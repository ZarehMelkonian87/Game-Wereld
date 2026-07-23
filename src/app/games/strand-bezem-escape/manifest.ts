import { defineGameManifest } from "../../game-platform/contracts";

export const strandBezemEscapeManifest = defineGameManifest({
  ageRange: { max: 8, min: 4 },
  capabilities: ["audio", "microphone"],
  contractVersion: 1,
  description:
    "Zeg en zet stickers op het strand, speel het woordzoekerspel en vlieg door de wolken!",
  icon: "🏖️",
  id: "strand-bezem-escape",
  offlinePackages: [],
  releaseStatus: "available",
  requiredCapabilities: [],
  supportedOrientations: ["portrait", "landscape"],
  themeId: "vocabulary",
  title: "Magisch Strand-Avontuur",
});
