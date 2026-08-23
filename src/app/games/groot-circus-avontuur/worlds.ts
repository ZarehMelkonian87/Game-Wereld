import type { WorldDefinition } from "./types";
export const DEFAULT_WORLD_ID = "circus";
export const worldDefinitions = [
  {
    id: "circus",
    title: "Circus",
    theme: {
      label: "Rood en goud",
      colors: ["circusrood", "goud", "warm zand"],
      cardTone: "circus",
    },
    status: "open",
    icon: "paw",
    description: "Circuswoorden, plaatsbegrippen en korte aanwijzingen oefenen.",
    availableModes: ["listen-and-place", "choose-word", "zeg-en-vlieg"],
    plannedModes: ["active-vocabulary", "sentence-repeat", "word-category"],
    linkedGameWorldId: "circus-world-1",
  },
] as const satisfies readonly WorldDefinition[];
export type WorldDefinitionId = (typeof worldDefinitions)[number]["id"];
export const isWorldDefinitionId = (worldId: string): worldId is WorldDefinitionId => {
  return worldDefinitions.some((world) => world.id === worldId);
};
export const getWorldDefinition = (worldId: string) => {
  return worldDefinitions.find((world) => world.id === worldId) ?? worldDefinitions[0];
};
export const playableWorldDefinitions = worldDefinitions.filter((world) => world.status === "open");
