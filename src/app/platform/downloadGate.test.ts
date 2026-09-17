import { describe, expect, it } from "vitest";
import type { OfflinePackageManifest, OfflinePackageState } from "../pwa/offlinePackages";
import { resolveDownloadGate } from "./downloadGate";

const manifest = (totalBytes: number): OfflinePackageManifest => ({
  assets: [],
  contentVersion: "test-2026.01",
  gameId: "test-game",
  id: "test-pkg",
  schemaVersion: 1,
  totalBytes,
  version: 1,
  worldId: "test-world",
});

describe("resolveDownloadGate (T-39)", () => {
  it("streamt op web/desktop (geen gate vereist) — direct speelbaar", () => {
    const gate = resolveDownloadGate({
      packageStates: [{ status: "not-downloaded" }],
      requiresGate: false,
    });

    expect(gate.mode).toBe("streaming");
    expect(gate.canPlay).toBe(true);
  });

  it("streamt ook als de game geen offline-pakket kent", () => {
    const gate = resolveDownloadGate({ packageStates: [], requiresGate: true });

    expect(gate.mode).toBe("streaming");
    expect(gate.canPlay).toBe(true);
  });

  it("blokkeert op telefoon/tablet zolang er nog niet is gedownload", () => {
    const gate = resolveDownloadGate({
      packageStates: [{ status: "not-downloaded" }],
      requiresGate: true,
    });

    expect(gate.mode).toBe("gated");
    expect(gate.phase).toBe("needs-download");
    expect(gate.canPlay).toBe(false);
  });

  it("toont geaggregeerde voortgang tijdens het downloaden", () => {
    const states: OfflinePackageState[] = [
      { downloadedBytes: 30, status: "downloading", totalBytes: 100 },
      { manifest: manifest(100), status: "ready" },
    ];

    const gate = resolveDownloadGate({ packageStates: states, requiresGate: true });

    expect(gate.phase).toBe("downloading");
    expect(gate.canPlay).toBe(false);
    expect(gate.progress).toEqual({ downloadedBytes: 130, percent: 65, totalBytes: 200 });
  });

  it("geeft de bevestigingsfase met totale grootte + vrije ruimte", () => {
    const gate = resolveDownloadGate({
      packageStates: [
        { availableBytes: 5_000, manifest: manifest(1_200), status: "awaiting-confirmation" },
      ],
      requiresGate: true,
    });

    expect(gate.phase).toBe("confirm");
    expect(gate.requiredBytes).toBe(1_200);
    expect(gate.availableBytes).toBe(5_000);
    expect(gate.canPlay).toBe(false);
  });

  it("is pas speelbaar wanneer alle pakketten klaar zijn", () => {
    const gate = resolveDownloadGate({
      packageStates: [{ manifest: manifest(100), status: "ready" }],
      requiresGate: true,
    });

    expect(gate.phase).toBe("ready");
    expect(gate.canPlay).toBe(true);
  });

  it("blokkeert nog als één van meerdere pakketten niet klaar is", () => {
    const gate = resolveDownloadGate({
      packageStates: [
        { manifest: manifest(100), status: "ready" },
        { status: "partial", missingAssets: 2 },
      ],
      requiresGate: true,
    });

    expect(gate.canPlay).toBe(false);
    expect(gate.phase).toBe("needs-download");
  });

  it("meldt een fout met bericht en blijft geblokkeerd", () => {
    const gate = resolveDownloadGate({
      packageStates: [{ message: "Netwerkfout", status: "failed" }],
      requiresGate: true,
    });

    expect(gate.phase).toBe("error");
    expect(gate.message).toBe("Netwerkfout");
    expect(gate.canPlay).toBe(false);
  });
});
