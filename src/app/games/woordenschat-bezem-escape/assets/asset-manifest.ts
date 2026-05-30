export type BezemEscapeAssetKind =
  | "background"
  | "object"
  | "avatar"
  | "broom"
  | "mascot"
  | "source-sheet"
  | "preview";

export type BezemEscapeAssetReadiness =
  | "ready"
  | "reference-only";

export interface BezemEscapeImageAsset {
  id: string;
  label: string;
  kind: BezemEscapeAssetKind;
  path: string;
  sourcePath: string;
  width: number;
  height: number;
  hasAlpha: boolean;
  readiness: BezemEscapeAssetReadiness;
  notes?: string;
}

function readyAsset(
  id: string,
  label: string,
  kind: BezemEscapeAssetKind,
  path: string,
  sourcePath: string,
  hasAlpha = true,
): BezemEscapeImageAsset {
  return {
    id,
    label,
    kind,
    path,
    sourcePath,
    width: 512,
    height: 512,
    hasAlpha,
    readiness: "ready",
  };
}

export const beachBackgroundAssets: BezemEscapeImageAsset[] = [
  {
    id: "beach-board-landscape",
    label: "Strandscene landscape",
    kind: "background",
    path: "backgrounds/beach-board-landscape.png",
    sourcePath: "../concept-art/generated-images/beach-scene-board-landscape.png",
    width: 872,
    height: 612,
    hasAlpha: false,
    readiness: "ready",
  },
  {
    id: "beach-board-portrait",
    label: "Strandscene portrait",
    kind: "background",
    path: "backgrounds/beach-board-portrait.png",
    sourcePath: "../concept-art/generated-images/beach-scene-board-portrait.png",
    width: 504,
    height: 852,
    hasAlpha: false,
    readiness: "ready",
  },
];

export const beachObjectAssets: BezemEscapeImageAsset[] = [
  readyAsset(
    "dolfijn",
    "Dolfijn",
    "object",
    "objects/transparent/dolphin-sticker.png",
    "../concept-art/generated-images/beach-objects/dolphin-sticker-green-source.png",
  ),
  readyAsset(
    "boot",
    "Boot",
    "object",
    "objects/transparent/sailboat-sticker.png",
    "../concept-art/generated-images/beach-objects/sailboat-sticker-green-source.png",
  ),
  readyAsset(
    "vuurtoren",
    "Vuurtoren",
    "object",
    "objects/transparent/lighthouse-sticker.png",
    "../concept-art/generated-images/beach-objects/lighthouse-sticker-green-source.png",
  ),
  readyAsset(
    "vliegtuig",
    "Vliegtuig",
    "object",
    "objects/transparent/airplane-sticker.png",
    "../concept-art/generated-images/beach-objects/airplane-sticker-green-source.png",
  ),
  readyAsset(
    "vlieger",
    "Vlieger",
    "object",
    "objects/transparent/kite-sticker.png",
    "../concept-art/generated-images/beach-objects/kite-sticker-green-source.png",
  ),
  readyAsset(
    "bal",
    "Bal",
    "object",
    "objects/transparent/beach-ball-sticker.png",
    "../concept-art/generated-images/beach-objects/beach-ball-sticker-green-source.png",
  ),
  readyAsset(
    "parasol",
    "Parasol",
    "object",
    "objects/transparent/beach-umbrella-sticker.png",
    "../concept-art/generated-images/beach-objects/beach-umbrella-sticker-green-source.png",
  ),
  readyAsset(
    "schelp",
    "Schelp",
    "object",
    "objects/transparent/seashells-sticker.png",
    "../concept-art/generated-images/beach-objects/seashells-sticker-green-source.png",
  ),
  readyAsset(
    "krab",
    "Krab",
    "object",
    "objects/transparent/crab-sticker.png",
    "../concept-art/generated-images/beach-objects/crab-sticker-green-source.png",
  ),
  readyAsset(
    "zandkasteel",
    "Zandkasteel",
    "object",
    "objects/transparent/sandcastle-sticker.png",
    "../concept-art/generated-images/beach-objects/sandcastle-sticker-green-source.png",
  ),
  readyAsset(
    "handdoek",
    "Handdoek",
    "object",
    "objects/transparent/beach-towel-sticker.png",
    "../concept-art/generated-images/beach-objects/beach-towel-sticker-green-source.png",
  ),
  readyAsset(
    "zon",
    "Zon",
    "object",
    "objects/transparent/sun-sticker.png",
    "../concept-art/generated-images/beach-objects/sun-sticker-green-source.png",
  ),
];

export const avatarAssets: BezemEscapeImageAsset[] = Array.from({ length: 8 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");

  return readyAsset(
    `avatar-${number}`,
    `Avatar ${index + 1}`,
    "avatar",
    `icons/avatars/avatar-${number}.png`,
    `../concept-art/generated-images/avatars-green-source/avatar-${number}-green-source.png`,
  );
});

export const broomAssets: BezemEscapeImageAsset[] = [
  ["broom-01-basic", "Beginner Bezem"],
  ["broom-02-beach", "Strand Bezem"],
  ["broom-03-dolphin", "Dolfijn Bezem"],
  ["broom-04-rainbow", "Regenboog Bezem"],
  ["broom-05-star", "Ster Bezem"],
  ["broom-06-speed", "Speed Bezem"],
].map(([id, label]) =>
  readyAsset(
    id,
    label,
    "broom",
    `icons/brooms/${id}.png`,
    `../concept-art/generated-images/brooms-green-source/${id}-green-source.png`,
  ),
);

export const mascotAssets: BezemEscapeImageAsset[] = [
  ["mascot-01-neutral", "Ster Mascotte Neutraal"],
  ["mascot-02-happy", "Ster Mascotte Blij"],
  ["mascot-03-thinking", "Ster Mascotte Denkt"],
  ["mascot-04-pointing", "Ster Mascotte Wijst"],
  ["mascot-05-celebration", "Ster Mascotte Viert"],
  ["mascot-06-hint", "Ster Mascotte Hint"],
  ["mascot-07-ui-icon", "Ster Mascotte UI Icoon"],
].map(([id, label]) =>
  readyAsset(
    id,
    label,
    "mascot",
    `icons/mascot/${id}.png`,
    `../concept-art/generated-images/mascot-green-source/${id}-green-source.png`,
  ),
);

export const sourceSheetAssets: BezemEscapeImageAsset[] = [
  {
    id: "avatar-character-sheet",
    label: "Avatar character sheet",
    kind: "source-sheet",
    path: "source-sheets/child-avatar-character-sheet.png",
    sourcePath: "../concept-art/generated-images/child-avatar-character-sheet.png",
    width: 1536,
    height: 1024,
    hasAlpha: false,
    readiness: "reference-only",
  },
  {
    id: "avatar-lineup",
    label: "Avatar lineup",
    kind: "source-sheet",
    path: "source-sheets/child-avatar-lineup-8.png",
    sourcePath: "../concept-art/generated-images/child-avatar-lineup-8.png",
    width: 1536,
    height: 1024,
    hasAlpha: false,
    readiness: "reference-only",
  },
  {
    id: "mascot-sheet",
    label: "Ster mascotte sheet",
    kind: "source-sheet",
    path: "source-sheets/star-mascot-character-sheet.png",
    sourcePath: "../concept-art/generated-images/star-mascot-character-sheet.png",
    width: 1536,
    height: 1024,
    hasAlpha: false,
    readiness: "reference-only",
  },
  {
    id: "broom-sheet",
    label: "Magische bezem sheet",
    kind: "source-sheet",
    path: "source-sheets/magical-broom-set.png",
    sourcePath: "../concept-art/generated-images/magical-broom-set.png",
    width: 1536,
    height: 1024,
    hasAlpha: false,
    readiness: "reference-only",
  },
];

export const previewAsset: BezemEscapeImageAsset = {
  id: "asset-preview",
  label: "Asset preview",
  kind: "preview",
  path: "asset-preview.png",
  sourcePath: "generated locally from production assets",
  width: 768,
  height: 1196,
  hasAlpha: false,
  readiness: "ready",
};

export const bezemEscapeAssets = {
  backgrounds: beachBackgroundAssets,
  objects: beachObjectAssets,
  avatars: avatarAssets,
  brooms: broomAssets,
  mascot: mascotAssets,
  sourceSheets: sourceSheetAssets,
  preview: previewAsset,
};
