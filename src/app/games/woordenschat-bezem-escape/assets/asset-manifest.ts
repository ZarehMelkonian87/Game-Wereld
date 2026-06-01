export type BezemEscapeAssetKind =
  | "background"
  | "object"
  | "avatar"
  | "broom"
  | "mascot";

export type BezemEscapeAssetReadiness = "ready";

export interface BezemEscapeImageAsset {
  id: string;
  label: string;
  kind: BezemEscapeAssetKind;
  path: string;
  sourcePath?: string;
  width: number;
  height: number;
  hasAlpha: boolean;
  readiness: BezemEscapeAssetReadiness;
  notes?: string;
}

const readyAsset = (
  id: string,
  label: string,
  kind: BezemEscapeAssetKind,
  path: string,
  hasAlpha = true,
) : BezemEscapeImageAsset => ({
    id,
    label,
    kind,
    path,
    width: 512,
    height: 512,
    hasAlpha,
    readiness: "ready",
  });

export const beachBackgroundAssets: BezemEscapeImageAsset[] = [
  {
    id: "beach-board-landscape",
    label: "Strandscene landscape",
    kind: "background",
    path: "backgrounds/beach-board-landscape.png",
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
  ),
  readyAsset(
    "boot",
    "Boot",
    "object",
    "objects/transparent/sailboat-sticker.png",
  ),
  readyAsset(
    "vuurtoren",
    "Vuurtoren",
    "object",
    "objects/transparent/lighthouse-sticker.png",
  ),
  readyAsset(
    "vliegtuig",
    "Vliegtuig",
    "object",
    "objects/transparent/airplane-sticker.png",
  ),
  readyAsset(
    "vlieger",
    "Vlieger",
    "object",
    "objects/transparent/kite-sticker.png",
  ),
  readyAsset(
    "bal",
    "Bal",
    "object",
    "objects/transparent/beach-ball-sticker.png",
  ),
  readyAsset(
    "parasol",
    "Parasol",
    "object",
    "objects/transparent/beach-umbrella-sticker.png",
  ),
  readyAsset(
    "schelp",
    "Schelp",
    "object",
    "objects/transparent/seashells-sticker.png",
  ),
  readyAsset(
    "krab",
    "Krab",
    "object",
    "objects/transparent/crab-sticker.png",
  ),
  readyAsset(
    "zandkasteel",
    "Zandkasteel",
    "object",
    "objects/transparent/sandcastle-sticker.png",
  ),
  readyAsset(
    "handdoek",
    "Handdoek",
    "object",
    "objects/transparent/beach-towel-sticker.png",
  ),
  readyAsset(
    "zon",
    "Zon",
    "object",
    "objects/transparent/sun-sticker.png",
  ),
];

export const avatarAssets: BezemEscapeImageAsset[] = Array.from({ length: 8 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");

  return readyAsset(
    `avatar-${number}`,
    `Avatar ${index + 1}`,
    "avatar",
    `icons/avatars/avatar-${number}.png`,
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
  ),
);

export const bezemEscapeAssets = {
  backgrounds: beachBackgroundAssets,
  objects: beachObjectAssets,
  avatars: avatarAssets,
  brooms: broomAssets,
  mascot: mascotAssets,
};
