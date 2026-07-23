import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameButton } from "./GameButton";

describe("GameButton", () => {
  it("is a named button and invokes its action", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<GameButton onClick={onClick}>Start spel</GameButton>);

    const button = screen.getByRole("button", { name: "Start spel" });
    await user.click(button);

    expect(button).toHaveAttribute("type", "button");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not invoke its action while disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <GameButton disabled onClick={onClick}>
        Verder
      </GameButton>,
    );

    await user.click(screen.getByRole("button", { name: "Verder" }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
