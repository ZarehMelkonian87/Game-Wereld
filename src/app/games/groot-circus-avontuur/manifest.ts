import { defineGameManifest } from "../../game-platform/contracts";

// Placeholder-kaartafbeelding: circustent-emoji als inline SVG (nog geen echte afbeelding).
const circusGameCardImageUrl =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">' +
      '<rect width="256" height="256" rx="32" fill="#fde68a"/>' +
      '<text x="50%" y="50%" font-size="150" text-anchor="middle" dominant-baseline="central">🎪</text>' +
      "</svg>",
  );

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
