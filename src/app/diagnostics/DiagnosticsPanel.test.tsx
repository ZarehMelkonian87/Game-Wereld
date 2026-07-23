import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DiagnosticsPanel, createSanitizedDiagnosticExport } from "./DiagnosticsPanel";
import { appDiagnostics, diagnosticRingBuffer } from "./appDiagnostics";

describe("DiagnosticsPanel", () => {
  beforeEach(() => diagnosticRingBuffer.clear());

  it("blijft gesloten tot de expliciete developmentactie", async () => {
    Object.defineProperty(window, "caches", {
      configurable: true,
      value: { keys: vi.fn().mockResolvedValue(["game-wereld-code-v1", "andere-cache"]) },
    });
    Object.defineProperty(navigator, "storage", {
      configurable: true,
      value: { estimate: vi.fn().mockResolvedValue({ quota: 2_000, usage: 1_000 }) },
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    appDiagnostics.record({
      context: { errorCode: "quota-exceeded", operation: "repository-write" },
      event: "storage-write-failed",
      severity: "error",
      subsystem: "storage",
    });
    appDiagnostics.record({
      context: { errorCode: "not-allowed", operation: "recognize-speech" },
      event: "speech-recognition-failed",
      severity: "warn",
      subsystem: "speech",
    });

    render(<DiagnosticsPanel />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Diagnostiek" }));

    expect(
      await screen.findByRole("dialog", { name: "Development-diagnostiek" }),
    ).toBeInTheDocument();
    expect(screen.getByText("game-wereld v2")).toBeInTheDocument();
    expect(screen.getByText("storage:storage-write-failed")).toBeInTheDocument();
    expect(screen.getByText("speech:speech-recognition-failed")).toBeInTheDocument();
    expect(screen.queryByText("andere-cache")).not.toBeInTheDocument();
  });

  it("exporteert alleen het veilige snapshot- en eventcontract", () => {
    const exported = createSanitizedDiagnosticExport(
      {
        build: "development",
        caches: [],
        capabilities: {
          cacheStorage: true,
          indexedDb: true,
          online: true,
          serviceWorker: true,
          speechRecognition: true,
        },
        database: { name: "game-wereld", version: 2 },
        game: undefined,
        offlinePackages: [],
        quota: {},
        release: "test",
        route: "/home",
        serviceWorker: "ready",
        session: "anoniem",
      },
      [],
    );

    expect(JSON.stringify(exported)).not.toMatch(/profileName|transcript|rawAnswer|audioBlob/i);
  });
});
