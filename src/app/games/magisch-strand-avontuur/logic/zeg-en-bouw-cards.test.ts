import { describe, expect, it } from "vitest";
import {
  countMatchingPlacements,
  getBuildCardProgress,
  isBuildCardComplete,
  isObjectAllowedOnCard,
  shuffleBuildCards,
  zegBouwCards,
} from "./zeg-en-bouw-cards";

const cardById = (id: string) => {
  const card = zegBouwCards.find((entry) => entry.id === id);
  if (!card) {
    throw new Error(`Onbekende bouwkaart: ${id}`);
  }
  return card;
};

describe("zeg-en-bouw-cards (T-04c)", () => {
  it("elke kaart heeft een positief doel en genoeg passende objecten", () => {
    for (const card of zegBouwCards) {
      expect(card.goalCount).toBeGreaterThan(0);
      if (!card.allowsAnyObject) {
        expect(card.allowedObjectIds.length).toBeGreaterThanOrEqual(card.goalCount);
      }
    }
  });

  it("herkent passende en niet-passende objecten per thema", () => {
    const vaar = cardById("build-vaarstrand");
    expect(isObjectAllowedOnCard(vaar, "boot")).toBe(true);
    expect(isObjectAllowedOnCard(vaar, "dolfijn")).toBe(true);
    expect(isObjectAllowedOnCard(vaar, "vliegtuig")).toBe(false);
  });

  it("laat op het feeststrand elk object toe (vrij thema)", () => {
    const feest = cardById("build-feeststrand");
    expect(isObjectAllowedOnCard(feest, "vliegtuig")).toBe(true);
    expect(isObjectAllowedOnCard(feest, "krab")).toBe(true);
  });

  it("telt alleen unieke passende objecten mee", () => {
    const speel = cardById("build-speelstrand");
    // bal + vlieger passen; parasol past; dolfijn niet; dubbele bal telt één keer.
    expect(countMatchingPlacements(speel, ["bal", "bal", "vlieger", "dolfijn"])).toBe(2);
  });

  it("markeert het doel als gehaald bij genoeg passende objecten", () => {
    const dieren = cardById("build-dierenstrand"); // goalCount 2
    expect(isBuildCardComplete(dieren, ["krab"])).toBe(false);
    expect(isBuildCardComplete(dieren, ["krab", "schelp"])).toBe(true);
    // Niet-passende objecten tellen niet mee.
    expect(isBuildCardComplete(dieren, ["krab", "boot"])).toBe(false);
  });

  it("begrenst de voortgang op het doel", () => {
    const dieren = cardById("build-dierenstrand"); // goalCount 2
    const progress = getBuildCardProgress(dieren, ["krab", "schelp", "dolfijn"]);
    expect(progress).toEqual({ complete: true, count: 2, goal: 2 });
  });

  it("shuffelt deterministisch per seed en behoudt alle kaarten", () => {
    const a = shuffleBuildCards(zegBouwCards, 123).map((card) => card.id);
    const b = shuffleBuildCards(zegBouwCards, 123).map((card) => card.id);
    const c = shuffleBuildCards(zegBouwCards, 999).map((card) => card.id);

    expect(a).toEqual(b); // zelfde seed → zelfde volgorde
    expect([...a].sort()).toEqual([...zegBouwCards.map((card) => card.id)].sort()); // niets kwijt
    expect(a).not.toEqual(c); // andere seed → (zeer waarschijnlijk) andere volgorde
  });
});
