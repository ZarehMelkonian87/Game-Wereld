// @vitest-environment node

import { describe, expect, it } from "vitest";
import { beachWorld } from "../content";
import { parseCompoundPlacements } from "./spoken-command-parser";

const parse = (transcript: string) =>
  parseCompoundPlacements({
    objects: beachWorld.objects,
    transcript,
    zones: beachWorld.zones,
  }).placements;

// De essentie voor een bouwplaatsing is welk object waar terechtkomt. De
// zone-aliassen bevatten vaak het voorzetsel ("in de zee" → zone `zee`), dus
// de plaats zit in `zoneId`; `relation` is dan aanvullend en mag leeg zijn.
const asPairs = (transcript: string) =>
  parse(transcript).map(({ objectId, zoneId }) => ({ objectId, zoneId }));

describe("parseCompoundPlacements (T-04b)", () => {
  it("haalt twee plaatsingen met een eigen zone uit één zin", () => {
    expect(asPairs("de boot in de zee en de vuurtoren op het eiland")).toEqual([
      { objectId: "boot", zoneId: "zee" },
      { objectId: "vuurtoren", zoneId: "eiland" },
    ]);
  });

  it("laat twee objecten dezelfde zone delen", () => {
    expect(asPairs("de krab en de dolfijn in de zee")).toEqual([
      { objectId: "krab", zoneId: "zee" },
      { objectId: "dolfijn", zoneId: "zee" },
    ]);
  });

  it("geeft objecten zonder genoemde zone als losse plaatsing terug (soepel doel)", () => {
    expect(asPairs("de bal en de zon")).toEqual([
      { objectId: "bal", zoneId: undefined },
      { objectId: "zon", zoneId: undefined },
    ]);
  });

  it("verwerkt een enkel object net als voorheen", () => {
    expect(asPairs("zet de boot in de zee")).toEqual([{ objectId: "boot", zoneId: "zee" }]);
  });

  it("laat de langste zone-alias winnen (boven de zee)", () => {
    expect(asPairs("de zon boven de zee")).toEqual([{ objectId: "zon", zoneId: "boven-zee" }]);
  });

  it("combineert een zone-plaatsing met een los object erna", () => {
    expect(asPairs("de boot in de zee en de bal")).toEqual([
      { objectId: "boot", zoneId: "zee" },
      { objectId: "bal", zoneId: undefined },
    ]);
  });

  it("geeft een lege lijst terug bij een zin zonder herkende objecten", () => {
    expect(parse("hallo daar")).toEqual([]);
  });
});
