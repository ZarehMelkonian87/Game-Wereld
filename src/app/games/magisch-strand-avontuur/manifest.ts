import { defineGameManifest } from "../../game-platform/contracts";

const strandGameCardImageUrl = new URL("./assets/icons/worlds/world-beach.png", import.meta.url)
  .href;

export const magischStrandAvontuurManifest = defineGameManifest({
  ageRange: { max: 8, min: 4 },
  capabilities: ["audio", "microphone", "offline-package"],
  cardImageUrl: strandGameCardImageUrl,
  contentVersion: "magisch-strand-avontuur-2026.07",
  contractVersion: 1,
  description:
    "Zeg en zet stickers op het strand, speel het woordzoekerspel en vlieg door de wolken!",
  icon: "🏖️",
  id: "magisch-strand-avontuur",
  offlinePackages: [
    {
      contentVersion: "magisch-strand-avontuur-2026.07",
      id: "magisch-strand-avontuur-beach",
      manifestUrl: "/offline/magisch-strand-avontuur-beach-v1.json",
      version: 1,
    },
  ],
  releaseStatus: "available",
  requiredCapabilities: [],
  supportedOrientations: ["portrait", "landscape"],
  themeId: "vocabulary",
  title: "Magisch Strand-Avontuur",
});

