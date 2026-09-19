import { defineGameManifest } from "../../game-platform/contracts";
import { resolveOfflineManifestUrl } from "../../game-platform/offline-manifest-url";

export const rekenenStrandManifest = defineGameManifest({
  ageRange: { max: 7, min: 4 },
  capabilities: ["offline-package"],
  contentVersion: "rekenen-strand-2026.07",
  contractVersion: 1,
  description: "Tel de schelpen en kies het cijfer dat bij de hoeveelheid hoort.",
  icon: "🐚",
  id: "rekenen-strand-avontuur",
  offlinePackages: [
    {
      contentVersion: "rekenen-strand-2026.07",
      id: "rekenen-strand-basis",
      manifestUrl: resolveOfflineManifestUrl("rekenen-strand-basis-v1.json"),
      version: 1,
    },
  ],
  releaseStatus: "available",
  requiredCapabilities: [],
  supportedOrientations: ["portrait", "landscape"],
  themeId: "math",
  title: "Schelpen Tellen",
});
