import { defineGameManifest } from "../../game-platform/contracts";

const strandGameCardImageUrl = new URL("./assets/icons/worlds/world-beach.png", import.meta.url)
  .href;

export const strandBezemEscapeManifest = defineGameManifest({
  ageRange: { max: 8, min: 4 },
  capabilities: ["audio", "microphone", "offline-package"],
  cardImageUrl: strandGameCardImageUrl,
  contentVersion: "strand-bezem-escape-2026.07",
  contractVersion: 1,
  description:
    "Zeg en zet stickers op het strand, speel het woordzoekerspel en vlieg door de wolken!",
  icon: "🏖️",
  id: "strand-bezem-escape",
  offlinePackages: [
    {
      contentVersion: "strand-bezem-escape-2026.07",
      id: "strand-bezem-escape-beach",
      manifestUrl: "/offline/strand-bezem-escape-beach-v1.json",
      version: 1,
    },
  ],
  releaseStatus: "available",
  requiredCapabilities: [],
  supportedOrientations: ["portrait", "landscape"],
  themeId: "vocabulary",
  title: "Magisch Strand-Avontuur",
});
