import { defineGameManifest } from "../../game-platform/contracts";

const circusGameCardImageUrl = new URL("./assets/icons/worlds/world-circus.png", import.meta.url)
  .href;

export const grootCircusAvontuurManifest = defineGameManifest({
  ageRange: { max: 8, min: 4 },
  capabilities: ["audio", "microphone"],
  cardImageUrl: circusGameCardImageUrl,
  contentVersion: "groot-circus-avontuur-2026.08",
  contractVersion: 1,
  description:
    "Zeg en zet stickers in de piste, speel het woordzoekerspel en vlieg door de circustent!",
  icon: "🎪",
  id: "groot-circus-avontuur",
  offlinePackages: [],
  releaseStatus: "available",
  requiredCapabilities: [],
  supportedOrientations: ["portrait", "landscape"],
  themeId: "vocabulary",
  title: "Groot Circus-Avontuur",
});
