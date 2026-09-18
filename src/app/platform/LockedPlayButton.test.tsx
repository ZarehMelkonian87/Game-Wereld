import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LockedPlayButton } from "./LockedPlayButton";

describe("LockedPlayButton (T-46)", () => {
  it("toont de vergrendelde toestand wanneer canPlay=false", async () => {
    const handleClick = vi.fn();
    render(<LockedPlayButton canPlay={false} onClick={handleClick} />);

    const button = screen.getByRole("button", {
      name: "Speel Nu (Pas na 100% download)",
    });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("data-state", "locked");

    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("toont de ontgrendelde actieve toestand wanneer canPlay=true", async () => {
    const handleClick = vi.fn();
    render(<LockedPlayButton canPlay={true} onClick={handleClick} />);

    const button = screen.getByRole("button", {
      name: "Klaar! Start Avontuur",
    });

    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("data-state", "ready");

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("ondersteunt aangepaste labels en disabled override", () => {
    render(
      <LockedPlayButton
        canPlay={true}
        disabled={true}
        lockedLabel="Nog even wachten"
        readyLabel="Begin met spelen"
      />,
    );

    const button = screen.getByRole("button", { name: "Begin met spelen" });
    expect(button).toBeDisabled();
  });
});
