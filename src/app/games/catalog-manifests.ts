import { defineGameManifest } from "../game-platform/contracts";

export const comingSoonGameManifests = [
  defineGameManifest({
    ageRange: { max: 8, min: 4 },
    capabilities: ["audio"],
    contentVersion: "taal-strand-2026.07",
    contractVersion: 1,
    description: "Oefen woordjes, spelling en klanken op het magische strand!",
    icon: "📖",
    id: "taal-strand-avontuur",
    offlinePackages: [],
    releaseStatus: "coming-soon",
    requiredCapabilities: [],
    supportedOrientations: ["portrait", "landscape"],
    themeId: "language",
    title: "Taal Strand-Avontuur",
  }),
  defineGameManifest({
    ageRange: { max: 8, min: 4 },
    capabilities: ["audio"],
    contentVersion: "wereld-strand-2026.07",
    contractVersion: 1,
    description: "Ontdek de natuur, zee, dieren en het weer op het strand!",
    icon: "🌍",
    id: "wereld-strand-avontuur",
    offlinePackages: [],
    releaseStatus: "coming-soon",
    requiredCapabilities: [],
    supportedOrientations: ["portrait", "landscape"],
    themeId: "world",
    title: "Wereld Strand-Avontuur",
  }),
] as const;
