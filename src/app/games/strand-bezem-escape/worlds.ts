import type { WorldDefinition } from "./types";

export const DEFAULT_WORLD_ID = "strand";

export const worldDefinitions = [
  {
    id: "strand",
    title: "Strand",
    theme: {
      label: "Aqua en zand",
      colors: ["aqua", "zonnig geel", "zacht zand"],
      cardTone: "beach",
    },
    status: "open",
    icon: "waves",
    description: "Strandwoorden, plaatsbegrippen en korte aanwijzingen oefenen.",
    availableModes: ["listen-and-place", "choose-word", "zeg-en-vlieg"],
    plannedModes: ["active-vocabulary", "sentence-repeat", "word-category"],
    linkedGameWorldId: "beach-world-1",
  },
] as const satisfies readonly WorldDefinition[];

export type WorldDefinitionId = (typeof worldDefinitions)[number]["id"];

export function isWorldDefinitionId(worldId: string): worldId is WorldDefinitionId {
  return worldDefinitions.some((world) => world.id === worldId);
}

export function getWorldDefinition(worldId: string) {
  return worldDefinitions.find((world) => world.id === worldId) ?? worldDefinitions[0];
}

export const playableWorldDefinitions = worldDefinitions.filter((world) => world.status === "open");
