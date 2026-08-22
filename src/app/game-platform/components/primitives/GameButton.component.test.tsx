import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Volume2 } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { GameButton } from "./GameButton";
import { GameIconButton } from "./GameIconButton";
import { GameProgressBar } from "./GameProgressBar";

const expectNoAxeViolations = async (container: HTMLElement) => {
  const result = await axe.run(container, {
    rules: {
      // JSDOM heeft geen canvas/CSS-layout; contrast wordt zonder uitzondering in Playwright getest.
      "color-contrast": { enabled: false },
    },
  });
  expect(result.violations).toEqual([]);
};

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

  it("invokes its action with the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<GameButton onClick={onClick}>Klaar</GameButton>);

    await user.tab();
    expect(screen.getByRole("button", { name: "Klaar" })).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("uses the 48px compact touch target and a visible focus contract", () => {
    render(<GameButton size="compact">Hint</GameButton>);

    const button = screen.getByRole("button", { name: "Hint" });
    expect(button).toHaveClass("min-h-12");
    expect(button.className).toContain("focus-visible:ring-4");
    expect(button.className).toContain("motion-reduce:transition-none");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <main>
        <GameButton disabled>Verder</GameButton>
        <GameIconButton icon={<Volume2 />} label="Geluid" pressed={false} />
        <GameProgressBar label="Voortgang" max={10} value={4} />
      </main>,
    );

    await expectNoAxeViolations(container);
  });
});

describe("GameIconButton", () => {
  it("exposes its name, toggle state and 48px touch target", () => {
    render(<GameIconButton icon={<Volume2 />} label="Geluid" pressed={false} />);

    const button = screen.getByRole("button", { name: "Geluid" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveClass("min-h-12", "w-12");
  });
});

describe("GameProgressBar", () => {
  it("announces a clamped value and reduces transition motion", () => {
    render(<GameProgressBar label="Sterren" max={5} value={8} />);

    const meter = screen.getByRole("meter", { name: "Sterren: 8 van 5" });
    expect(meter).toHaveAttribute("aria-valuenow", "5");
    expect(meter.querySelector('[data-slot="fill"]')).toHaveClass("motion-reduce:transition-none");
  });
});
