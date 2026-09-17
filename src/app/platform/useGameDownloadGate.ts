import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createOfflinePackageManager,
  type OfflinePackageDescriptor,
  type OfflinePackageState,
} from "../pwa/offlinePackages";
import {
  resolveDownloadGate,
  STREAMING_GATE,
  type DownloadGateState,
} from "./downloadGate";
import { usePlatform } from "./usePlatform";
import { requiresDownloadGate } from "./platformDetection";

export interface GameDownloadGateController {
  gate: DownloadGateState;
  /** Herbepaal de status van de pakketten (bv. na terugkeer online). */
  refresh: () => Promise<void>;
  /** Bepaal de downloadgrootte (zet pakketten naar "bevestigen"). */
  checkSize: () => Promise<void>;
  /** Start/bevestig de download van alle nog niet-klare pakketten. */
  download: () => Promise<void>;
  /** Onderbreek een lopende download. */
  cancel: () => void;
}

const descriptorKey = (descriptor: OfflinePackageDescriptor, index: number): string =>
  descriptor.id ?? `pkg-${index}`;

/**
 * Download-gate voor één game (T-39). Bepaalt met `usePlatform()` of er een gate
 * nodig is en beheert, indien zo, de offline-pakketten: inspecteren, grootte
 * bepalen, downloaden (met voortgang) en verifiëren. Op de webbrowser (desktop)
 * geeft de hook meteen een streaming-gate terug (`canPlay: true`) zonder iets te
 * downloaden. De **weergave** (downloadicoon/statusscherm, geblokkeerde Play-
 * knop) is per platform en komt in `T-42`/`T-44` (ontwerp) → `T-43`/`T-45`.
 */
export const useGameDownloadGate = (
  offlinePackages: readonly OfflinePackageDescriptor[] | undefined,
): GameDownloadGateController => {
  const platform = usePlatform();
  const gateRequired = requiresDownloadGate(platform);
  const manager = useMemo(() => createOfflinePackageManager(), []);
  const descriptors = useMemo(() => offlinePackages ?? [], [offlinePackages]);
  const [packageStates, setPackageStates] = useState<Record<string, OfflinePackageState>>({});
  const abortRef = useRef<AbortController>();
  const activeRef = useRef(true);

  const updateState = useCallback((key: string, next: OfflinePackageState) => {
    setPackageStates((current) => ({ ...current, [key]: next }));
  }, []);

  const runPerPackage = useCallback(
    async (op: (descriptor: OfflinePackageDescriptor, key: string) => Promise<void>) => {
      for (let index = 0; index < descriptors.length; index++) {
        const descriptor = descriptors[index];
        if (!descriptor) continue;
        await op(descriptor, descriptorKey(descriptor, index));
      }
    },
    [descriptors],
  );

  const refresh = useCallback(async () => {
    if (!gateRequired || descriptors.length === 0) return;
    await runPerPackage(async (descriptor, key) => {
      try {
        const next = await manager.inspect(descriptor);
        if (activeRef.current) updateState(key, next);
      } catch (error) {
        if (activeRef.current) {
          updateState(key, {
            message:
              error instanceof Error ? error.message : "Offlinestatus controleren is mislukt.",
            status: "failed",
          });
        }
      }
    });
  }, [descriptors.length, gateRequired, manager, runPerPackage, updateState]);

  const checkSize = useCallback(async () => {
    if (!gateRequired) return;
    await runPerPackage(async (descriptor, key) => {
      updateState(key, { status: "estimating" });
      try {
        updateState(key, await manager.estimate(descriptor));
      } catch (error) {
        updateState(key, {
          message: error instanceof Error ? error.message : "Pakketgrootte bepalen is mislukt.",
          status: "failed",
        });
      }
    });
  }, [gateRequired, manager, runPerPackage, updateState]);

  const download = useCallback(async () => {
    if (!gateRequired) return;
    const controller = new AbortController();
    abortRef.current = controller;

    await runPerPackage(async (descriptor, key) => {
      // Zorg dat we een manifest hebben (grootte bepaald); anders eerst schatten.
      let current = packageStates[key];
      if (current?.status !== "awaiting-confirmation") {
        try {
          current = await manager.estimate(descriptor);
          updateState(key, current);
        } catch (error) {
          updateState(key, {
            message: error instanceof Error ? error.message : "Pakketgrootte bepalen is mislukt.",
            status: "failed",
          });
          return;
        }
      }

      if (current.status !== "awaiting-confirmation") {
        // Al klaar of niet te downloaden → laat de laatste status staan.
        return;
      }

      updateState(key, {
        downloadedBytes: 0,
        status: "downloading",
        totalBytes: current.manifest.totalBytes,
      });
      const finalState = await manager.download(descriptor, current.manifest, {
        onState: (next) => {
          if (activeRef.current) updateState(key, next);
        },
        signal: controller.signal,
      });
      if (activeRef.current) updateState(key, finalState);
      if (finalState.status === "ready") await manager.cleanupOldPackages(undefined, 2);
    });

    abortRef.current = undefined;
  }, [gateRequired, manager, packageStates, runPerPackage, updateState]);

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  useEffect(() => {
    activeRef.current = true;
    void refresh();
    return () => {
      activeRef.current = false;
      abortRef.current?.abort();
    };
  }, [refresh]);

  const gate = useMemo<DownloadGateState>(() => {
    if (!gateRequired || descriptors.length === 0) {
      return STREAMING_GATE;
    }
    const states = descriptors
      .map((descriptor, index) => packageStates[descriptorKey(descriptor, index)])
      .filter((state): state is OfflinePackageState => Boolean(state));

    // Nog niets geïnspecteerd → we zijn aan het controleren.
    if (states.length === 0) {
      return { canPlay: false, mode: "gated", phase: "checking" };
    }

    return resolveDownloadGate({ packageStates: states, requiresGate: true });
  }, [descriptors, gateRequired, packageStates]);

  return { cancel, checkSize, download, gate, refresh };
};
