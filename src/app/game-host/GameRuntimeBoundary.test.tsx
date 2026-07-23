import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameRuntimeBoundary } from "./GameRuntimeBoundary";

const CrashingGame = () => {
  throw new Error("Gesimuleerde gamefout.");
};

describe("GameRuntimeBoundary", () => {
  it("toont dezelfde correlation-id als aan de crashlogger wordt gekoppeld", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const suppressExpectedWindowError = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener("error", suppressExpectedWindowError);
    const onCrash = vi.fn();
    const onRetry = vi.fn();

    render(
      <GameRuntimeBoundary
        correlationId="diagnose-123"
        onBack={vi.fn()}
        onCrash={onCrash}
        onRetry={onRetry}
      >
        <CrashingGame />
      </GameRuntimeBoundary>,
    );
    window.removeEventListener("error", suppressExpectedWindowError);

    expect(screen.getByText(/diagnose-123/)).toBeInTheDocument();
    expect(onCrash).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Gesimuleerde gamefout." }),
    );
    await userEvent.click(screen.getByRole("button", { name: /opnieuw/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
