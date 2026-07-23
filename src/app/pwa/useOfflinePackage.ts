import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OfflinePackageDescriptor } from "./offlinePackages";
import { createOfflinePackageManager, type OfflinePackageState } from "./offlinePackages";

export const useOfflinePackage = (descriptor: OfflinePackageDescriptor) => {
  const manager = useMemo(() => createOfflinePackageManager(), []);
  const [state, setState] = useState<OfflinePackageState>({ status: "not-downloaded" });
  const abortControllerRef = useRef<AbortController>();

  const refresh = useCallback(async () => {
    try {
      setState(await manager.inspect(descriptor));
    } catch (error) {
      setState({
        message: error instanceof Error ? error.message : "Offlinestatus controleren is mislukt.",
        status: "failed",
      });
    }
  }, [descriptor, manager]);

  useEffect(() => {
    void refresh();
    return () => abortControllerRef.current?.abort();
  }, [refresh]);

  const prepare = useCallback(async () => {
    setState({ status: "estimating" });
    try {
      setState(await manager.estimate(descriptor));
    } catch (error) {
      setState({
        message: error instanceof Error ? error.message : "Pakketgrootte bepalen is mislukt.",
        status: "failed",
      });
    }
  }, [descriptor, manager]);

  const download = useCallback(async () => {
    if (state.status !== "awaiting-confirmation") return;
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setState({ downloadedBytes: 0, status: "downloading", totalBytes: state.manifest.totalBytes });
    const nextState = await manager.download(descriptor, state.manifest, {
      onState: setState,
      signal: controller.signal,
    });
    abortControllerRef.current = undefined;
    setState(nextState);
    if (nextState.status === "ready") await manager.cleanupOldPackages(undefined, 2);
  }, [descriptor, manager, state]);

  const cancel = useCallback(() => abortControllerRef.current?.abort(), []);

  const remove = useCallback(async () => {
    await manager.remove(descriptor);
    setState({ status: "not-downloaded" });
  }, [descriptor, manager]);

  return { cancel, download, prepare, refresh, remove, state };
};
