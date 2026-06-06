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
    availableModes: ["listen-and-place", "choose-word"],
    plannedModes: ["active-vocabulary", "sentence-repeat", "word-category"],
    linkedGameWorldId: "beach-world-1",
  },
  {
    id: "boerderij",
    title: "Boerderij",
    theme: {
      label: "Groen en rood",
      colors: ["grasgroen", "appelrood", "warm geel"],
      cardTone: "farm",
    },
    status: "komt_later",
    icon: "barn",
    description: "Dieren, geluiden, actiewoorden en simpele zinnen oefenen.",
    availableModes: [],
    plannedModes: ["active-vocabulary", "following-directions", "word-category"],
  },
  {
    id: "dierentuin",
    title: "Dierentuin",
    theme: {
      label: "Groen en oranje",
      colors: ["bladgroen", "oranje", "licht zand"],
      cardTone: "zoo",
    },
    status: "komt_later",
    icon: "paw",
    description: "Dieren benoemen, categorieen kiezen en beschrijven.",
    availableModes: [],
    plannedModes: ["active-vocabulary", "word-category", "sentence-repeat"],
  },
  {
    id: "speeltuin",
    title: "Speeltuin",
    theme: {
      label: "Blauw en roze",
      colors: ["helder blauw", "zacht roze", "fris groen"],
      cardTone: "playground",
    },
    status: "komt_later",
    icon: "slide",
    description: "Werkwoorden, bewegingstaal en aanwijzingen volgen.",
    availableModes: [],
    plannedModes: ["following-directions", "word-structure", "sentence-repeat"],
  },
  {
    id: "school",
    title: "School",
    theme: {
      label: "Blauw en geel",
      colors: ["schoolblauw", "potloodgeel", "wit"],
      cardTone: "school",
    },
    status: "komt_later",
    icon: "book",
    description: "Schoolspullen, volgorde, kleuren en aantallen oefenen.",
    availableModes: [],
    plannedModes: ["following-directions", "word-structure", "sentence-repeat"],
  },
  {
    id: "ruimte",
    title: "Ruimte",
    theme: {
      label: "Nachtblauw en sterren",
      colors: ["nachtblauw", "sterrengeel", "zacht paars"],
      cardTone: "space",
    },
    status: "komt_later",
    icon: "planet",
    description: "Ruimtelijke taal, vergelijken en volgorde oefenen.",
    availableModes: [],
    plannedModes: ["following-directions", "word-structure", "sentence-repeat"],
  },
] as const satisfies readonly WorldDefinition[];

export type WorldDefinitionId = (typeof worldDefinitions)[number]["id"];

export function isWorldDefinitionId(worldId: string): worldId is WorldDefinitionId {
  return worldDefinitions.some((world) => world.id === worldId);
}

export function getWorldDefinition(worldId: string) {
  return worldDefinitions.find((world) => world.id === worldId) ?? worldDefinitions[0];
}

export const playableWorldDefinitions = worldDefinitions.filter(
  (world) => world.status === "open",
);
