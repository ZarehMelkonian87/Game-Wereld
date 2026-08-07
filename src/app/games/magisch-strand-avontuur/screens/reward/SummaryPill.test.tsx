import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryPill } from "./SummaryPill";

describe("SummaryPill", () => {
  it("toont label en waarde", () => {
    render(<SummaryPill label="Tempo" tone="tempo" value="+3" />);

    expect(screen.getByText("Tempo")).toBeInTheDocument();
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("koppelt de semantische toon aan een stabiel data-attribuut", () => {
    render(<SummaryPill label="Goed" tone="good" value={9} />);

    const tile = screen.getByText("Goed").closest('[data-component="SummaryPill"]');
    expect(tile).toHaveAttribute("data-tone", "good");
    expect(tile?.className).toContain("bg-stat-good-surface");
  });

  it("valt terug op de neutrale toon zonder expliciete keuze", () => {
    render(<SummaryPill label="Audio" value={2} />);

    const tile = screen.getByText("Audio").closest('[data-component="SummaryPill"]');
    expect(tile).toHaveAttribute("data-tone", "neutral");
  });
});
