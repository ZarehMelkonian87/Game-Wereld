import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DownloadGateModal } from "./DownloadGateModal";
import type { DownloadGateState } from "./downloadGate";

describe("DownloadGateModal (T-46)", () => {
  const defaultGate: DownloadGateState = {
    canPlay: false,
    mode: "gated",
    phase: "downloading",
    progress: {
      downloadedBytes: 18 * 1024 * 1024,
      percent: 50,
      totalBytes: 36 * 1024 * 1024,
    },
  };

  it("rendert de downloadende toestand met voortgang en vergrendelde Play-knop", () => {
    render(
      <DownloadGateModal
        gameTitle="Magisch Strand-Avontuur"
        gate={defaultGate}
        onDismiss={vi.fn()}
        onPlay={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Magisch Strand-Avontuur")).toBeInTheDocument();
    expect(screen.getByText("Fase 2 van 3: Bestanden opslaan…")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");

    // Play-knop moet vergrendeld zijn tot 100%
    const playButton = screen.getByRole("button", {
      name: "Speel Nu (Pas na 100% download)",
    });
    expect(playButton).toBeDisabled();
    expect(playButton).toHaveAttribute("data-state", "locked");

    // Vaste voetnoot moet aanwezig zijn
    expect(screen.getByText(/nooit meer opnieuw/i)).toBeInTheDocument();
  });

  it("toont de toestand 'Download Voltooid' met ontgrendelde actieve Play-knop", async () => {
    const handlePlay = vi.fn();
    const readyGate: DownloadGateState = {
      canPlay: true,
      mode: "gated",
      phase: "ready",
    };

    render(
      <DownloadGateModal
        gameTitle="Magisch Strand-Avontuur"
        gate={readyGate}
        onDismiss={vi.fn()}
        onPlay={handlePlay}
      />,
    );

    expect(screen.getByText("Download Voltooid!")).toBeInTheDocument();
    expect(screen.getByText(/100% Opgeslagen • Direct offline speelbaar/i)).toBeInTheDocument();

    const playButton = screen.getByRole("button", {
      name: "Klaar! Start Avontuur",
    });
    expect(playButton).not.toBeDisabled();
    expect(playButton).toHaveAttribute("data-state", "ready");

    await userEvent.click(playButton);
    expect(handlePlay).toHaveBeenCalledTimes(1);
  });

  it("toont de toestand 'sizing' tijdens het bepalen van de downloadgrootte", () => {
    const sizingGate: DownloadGateState = {
      canPlay: false,
      mode: "gated",
      phase: "sizing",
    };

    render(
      <DownloadGateModal
        gameTitle="Magisch Strand-Avontuur"
        gate={sizingGate}
        onDismiss={vi.fn()}
        onPlay={vi.fn()}
      />,
    );

    expect(screen.getByText("Downloadgrootte bepalen…")).toBeInTheDocument();
  });

  it("toont de toestand 'verifying' tijdens controle van bestanden", () => {
    const verifyingGate: DownloadGateState = {
      canPlay: false,
      mode: "gated",
      phase: "verifying",
    };

    render(
      <DownloadGateModal
        gameTitle="Magisch Strand-Avontuur"
        gate={verifyingGate}
        onDismiss={vi.fn()}
        onPlay={vi.fn()}
      />,
    );

    expect(screen.getByText("Fase 3 van 3: Bestanden controleren…")).toBeInTheDocument();
  });

  it("toont bevestiging bij mobiele data en laat gebruiker kiezen", async () => {
    const handleConfirm = vi.fn();
    const handleDismiss = vi.fn();
    const confirmGate: DownloadGateState = {
      canPlay: false,
      mode: "gated",
      phase: "confirm",
      requiredBytes: 36 * 1024 * 1024,
    };

    render(
      <DownloadGateModal
        gameTitle="Magisch Strand-Avontuur"
        gate={confirmGate}
        isCellular={true}
        onConfirmDownload={handleConfirm}
        onDismiss={handleDismiss}
        onPlay={vi.fn()}
      />,
    );

    expect(screen.getByText("Mobiele data (4G/5G)")).toBeInTheDocument();
    expect(
      screen.getByText(/Je gebruikt een mobiele dataverbinding. Deze eenmalige download is ongeveer 36.0 MB/i),
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /Toch downloaden/i });
    const waitBtn = screen.getByRole("button", { name: /Wacht op wifi/i });

    await userEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    await userEvent.click(waitBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it("toont foutstatus en staat herpoging via 'Opnieuw Proberen' toe", async () => {
    const handleRetry = vi.fn();
    const errorGate: DownloadGateState = {
      canPlay: false,
      message: "Netwerkverbinding verbroken",
      mode: "gated",
      phase: "error",
    };

    render(
      <DownloadGateModal
        gameTitle="Magisch Strand-Avontuur"
        gate={errorGate}
        onDismiss={vi.fn()}
        onPlay={vi.fn()}
        onRetry={handleRetry}
      />,
    );

    expect(screen.getByText("Download kon niet worden voltooid")).toBeInTheDocument();
    expect(screen.getByText("Netwerkverbinding verbroken")).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /Opnieuw Proberen/i });
    await userEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("toont specifieke foutmelding bij te weinig opslagruimte", () => {
    const storageGate: DownloadGateState = {
      availableBytes: 10 * 1024 * 1024,
      canPlay: false,
      message: "Niet genoeg vrije opslagruimte beschikbaar.",
      mode: "gated",
      phase: "error",
      requiredBytes: 50 * 1024 * 1024,
    };

    render(
      <DownloadGateModal
        gameTitle="Magisch Strand-Avontuur"
        gate={storageGate}
        onDismiss={vi.fn()}
        onPlay={vi.fn()}
      />,
    );

    expect(screen.getByText("Te weinig opslagruimte")).toBeInTheDocument();
  });

  it("sluit het venster bij klik op sluitknop of Escape-toets", async () => {
    const handleDismiss = vi.fn();
    render(
      <DownloadGateModal
        gameTitle="Magisch Strand-Avontuur"
        gate={defaultGate}
        onDismiss={handleDismiss}
        onPlay={vi.fn()}
      />,
    );

    const closeButton = screen.getByRole("button", {
      name: /Sluit downloadvenster/i,
    });
    await userEvent.click(closeButton);
    expect(handleDismiss).toHaveBeenCalledTimes(1);

    // Escape toets
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleDismiss).toHaveBeenCalledTimes(2);
  });
});
