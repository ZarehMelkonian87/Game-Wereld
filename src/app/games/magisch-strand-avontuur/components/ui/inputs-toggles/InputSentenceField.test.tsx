import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InputSentenceField, resolveSentenceLetters } from "./InputSentenceField";

describe("resolveSentenceLetters (T-54 overtyp-hulp)", () => {
  it("toont de hele doelzin als spookletters met de eerste letter als 'volgende'", () => {
    const letters = resolveSentenceLetters("Zet", "");
    expect(letters.map((letter) => letter.state)).toEqual(["next", "ghost", "ghost"]);
    expect(letters.map((letter) => letter.char).join("")).toBe("Zet");
  });

  it("kleurt goed getypte letters groen en schuift de cursor door", () => {
    const letters = resolveSentenceLetters("Zet de bal", "Zet ");
    expect(letters.slice(0, 5).map((letter) => letter.state)).toEqual([
      "typed-ok",
      "typed-ok",
      "typed-ok",
      "typed-ok",
      "next",
    ]);
  });

  it("negeert hoofdletters en accenten bij het vergelijken", () => {
    expect(resolveSentenceLetters("Zee", "zeé").map((letter) => letter.state)).toEqual([
      "typed-ok",
      "typed-ok",
      "typed-ok",
    ]);
  });

  it("markeert een verkeerde letter zacht rood maar laat de getypte letter staan", () => {
    const letters = resolveSentenceLetters("bal", "bol");
    expect(letters[1]).toEqual({ char: "o", state: "typed-wrong" });
  });

  it("laat extra letters voorbij de doelzin toe (vrij typen blijft mogelijk)", () => {
    const letters = resolveSentenceLetters("bal", "bal en zon");
    expect(letters).toHaveLength("bal en zon".length);
    expect(letters[3]).toEqual({ char: " ", state: "extra" });
    expect(letters.filter((letter) => letter.state === "extra")).toHaveLength(7);
  });
});

describe("InputSentenceField", () => {
  it("rendert de doelzin als letterlaag en telt goed getypte letters", async () => {
    const user = userEvent.setup();
    const Wrapper = () => {
      const [value, setValue] = React.useState("");
      return (
        <InputSentenceField
          data-testid="sentence-input"
          onChange={setValue}
          targetText="Zet de bal"
          value={value}
        />
      );
    };
    const { container } = render(<Wrapper />);
    const field = container.querySelector('[data-component="InputSentenceField"]');
    expect(field?.getAttribute("data-target-length")).toBe("10");
    expect(field?.getAttribute("data-correct-count")).toBe("0");

    await user.type(screen.getByTestId("sentence-input"), "zet x");

    expect(field?.getAttribute("data-typed-count")).toBe("5");
    expect(field?.getAttribute("data-correct-count")).toBe("4");
    const states = Array.from(container.querySelectorAll("[data-letter-state]")).map((span) =>
      span.getAttribute("data-letter-state"),
    );
    expect(states.slice(0, 6)).toEqual([
      "typed-ok",
      "typed-ok",
      "typed-ok",
      "typed-ok",
      "typed-wrong",
      "next",
    ]);
    // De rest blijft als spookletters staan.
    expect(states.slice(6).every((state) => state === "ghost")).toBe(true);
  });

  it("bevestigt met Enter en zet nooit een regelovergang in de zin", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onChange = vi.fn();
    render(
      <InputSentenceField
        data-testid="sentence-input"
        onChange={onChange}
        onSubmit={onSubmit}
        targetText="Zet de bal"
        value="Zet de bal"
      />,
    );

    await user.type(screen.getByTestId("sentence-input"), "{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalledWith(expect.stringContaining("\n"));
  });
});
