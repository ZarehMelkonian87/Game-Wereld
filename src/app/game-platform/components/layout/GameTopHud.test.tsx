import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameTopHud } from "./GameTopHud";

describe("GameTopHud", () => {
  it("toont de gedeelde HUD-controls met toegankelijke namen", () => {
    render(<GameTopHud onBackClick={vi.fn()} starCount={12} />);

    expect(screen.getByRole("button", { name: "Terug" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Audio" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hint" })).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("roept terug- en audio-acties aan", async () => {
    const user = userEvent.setup();
    const onBackClick = vi.fn();
    const onAudioClick = vi.fn();

    render(<GameTopHud onAudioClick={onAudioClick} onBackClick={onBackClick} starCount={0} />);

    await user.click(screen.getByRole("button", { name: "Terug" }));
    await user.click(screen.getByRole("button", { name: "Audio" }));

    expect(onBackClick).toHaveBeenCalledOnce();
    expect(onAudioClick).toHaveBeenCalledOnce();
  });

  it("verbergt de hint-knop wanneer showHint uit staat", () => {
    render(<GameTopHud showHint={false} starCount={0} />);

    expect(screen.queryByRole("button", { name: "Hint" })).not.toBeInTheDocument();
  });
});
