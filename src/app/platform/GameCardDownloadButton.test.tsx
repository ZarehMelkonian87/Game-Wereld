import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameCardDownloadButton } from "./GameCardDownloadButton";
import type { DownloadGateState } from "./downloadGate";

describe("GameCardDownloadButton (T-46)", () => {
  it("rendert niets op desktop web (streaming mode)", () => {
    const streamingGate: DownloadGateState = {
      canPlay: true,
      mode: "streaming",
      phase: "ready",
    };

    const { container } = render(<GameCardDownloadButton gate={streamingGate} onClick={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("toont de 'Niet gedownload'-toestand met bestandsgrootte", async () => {
    const handleClick = vi.fn();
    const gate: DownloadGateState = {
      canPlay: false,
      mode: "gated",
      phase: "needs-download",
      requiredBytes: 36 * 1024 * 1024,
    };

    render(<GameCardDownloadButton gate={gate} onClick={handleClick} />);

    const button = screen.getByRole("button", {
      name: /Download game voor offline spelen \(36 MB\)/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-state", "needs-download");
    expect(screen.getByText("36 MB")).toBeInTheDocument();

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("toont de voortgang wanneer een download op de achtergrond bezig is", async () => {
    const handleClick = vi.fn();
    const gate: DownloadGateState = {
      canPlay: false,
      mode: "gated",
      phase: "downloading",
      progress: {
        downloadedBytes: 18 * 1024 * 1024,
        percent: 52,
        totalBytes: 36 * 1024 * 1024,
      },
    };

    render(<GameCardDownloadButton gate={gate} onClick={handleClick} />);

    const button = screen.getByRole("button", {
      name: /Download bezig: 52%/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-state", "downloading");
    expect(screen.getByText("52%")).toBeInTheDocument();

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("verdwijnt standaard wanneer de download klaar is (hideWhenReady=true)", () => {
    const gate: DownloadGateState = {
      canPlay: true,
      mode: "gated",
      phase: "ready",
    };

    const { container } = render(<GameCardDownloadButton gate={gate} onClick={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("toont Speel-knop wanneer hideWhenReady=false", async () => {
    const handlePlay = vi.fn();
    const gate: DownloadGateState = {
      canPlay: true,
      mode: "gated",
      phase: "ready",
    };

    render(
      <GameCardDownloadButton
        gate={gate}
        hideWhenReady={false}
        onClick={vi.fn()}
        onPlay={handlePlay}
      />,
    );

    const button = screen.getByRole("button", {
      name: /Spel is gedownload. Tik om direct te spelen/i,
    });
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Speel")).toBeInTheDocument();

    await userEvent.click(button);
    expect(handlePlay).toHaveBeenCalledTimes(1);
  });

  it("toont update-knop wanneer isUpdateAvailable=true", async () => {
    const handleClick = vi.fn();
    const gate: DownloadGateState = {
      canPlay: false,
      mode: "gated",
      phase: "needs-download",
      requiredBytes: 12 * 1024 * 1024,
    };

    render(<GameCardDownloadButton gate={gate} isUpdateAvailable={true} onClick={handleClick} />);

    const button = screen.getByRole("button", {
      name: /Update beschikbaar \(12 MB\)/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-state", "update-available");
    expect(screen.getByText("Update 12 MB")).toBeInTheDocument();

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("toont opnieuw-knop bij een foutstatus", async () => {
    const handleClick = vi.fn();
    const gate: DownloadGateState = {
      canPlay: false,
      message: "Netwerkverbinding verbroken",
      mode: "gated",
      phase: "error",
    };

    render(<GameCardDownloadButton gate={gate} onClick={handleClick} />);

    const button = screen.getByRole("button", {
      name: /Download gepauzeerd of fout opgetreden/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-state", "error");
    expect(screen.getByText("Opnieuw")).toBeInTheDocument();

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
