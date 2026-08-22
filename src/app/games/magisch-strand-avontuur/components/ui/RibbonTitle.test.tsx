import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RibbonTitle } from "./RibbonTitle";

describe("RibbonTitle", () => {
  it("toont de titeltekst en draagt een stabiel componentcontract", () => {
    render(<RibbonTitle data-testid="title">Instellingen</RibbonTitle>);

    const title = screen.getByTestId("title");
    expect(title).toHaveTextContent("Instellingen");
    expect(title).toHaveAttribute("data-component", "RibbonTitle");
  });

  it("gebruikt de neutrale sticker-stijl in plaats van de blauwe app-pill", () => {
    render(<RibbonTitle data-testid="title">Beloning</RibbonTitle>);

    const title = screen.getByTestId("title");
    expect(title.className).toContain("bg-white");
    expect(title.className).not.toContain("bg-sky-500");
  });
});
