export const beachBackgrounds = {
  portrait: new URL("./assets/backgrounds/beach-board-portrait.png", import.meta.url).href,
  landscape: new URL("./assets/backgrounds/beach-board-landscape.png", import.meta.url).href,
  voiceSideScroller: new URL(
    "./assets/backgrounds/beach-voice-side-scroller.png",
    import.meta.url,
  ).href,
};

export const startLogoUrl = new URL(
  "./assets/logos/start-logo-b-generated-magenta.png",
  import.meta.url,
).href;

export const backgroundMusicUrl = new URL(
  "./assets/audio/background-music.mp3",
  import.meta.url,
).href;

export const beachObjectStickerUrls = {
  dolfijn: new URL("./assets/objects/transparent/dolphin-sticker.png", import.meta.url).href,
  boot: new URL("./assets/objects/transparent/sailboat-sticker.png", import.meta.url).href,
  vuurtoren: new URL("./assets/objects/transparent/lighthouse-sticker.png", import.meta.url).href,
  vliegtuig: new URL("./assets/objects/transparent/airplane-sticker.png", import.meta.url).href,
  vlieger: new URL("./assets/objects/transparent/kite-sticker.png", import.meta.url).href,
  bal: new URL("./assets/objects/transparent/beach-ball-sticker.png", import.meta.url).href,
  parasol: new URL("./assets/objects/transparent/beach-umbrella-sticker.png", import.meta.url).href,
  schelp: new URL("./assets/objects/transparent/seashells-sticker.png", import.meta.url).href,
  krab: new URL("./assets/objects/transparent/crab-sticker.png", import.meta.url).href,
  zandkasteel: new URL("./assets/objects/transparent/sandcastle-sticker.png", import.meta.url).href,
  handdoek: new URL("./assets/objects/transparent/beach-towel-sticker.png", import.meta.url).href,
  zon: new URL("./assets/objects/transparent/sun-sticker.png", import.meta.url).href,
};

export const voiceSideScrollerObjectSpriteUrls = {
  bal: beachObjectStickerUrls.bal,
  boot: beachObjectStickerUrls.boot,
  dolfijn: beachObjectStickerUrls.dolfijn,
  krab: beachObjectStickerUrls.krab,
  parasol: beachObjectStickerUrls.parasol,
  schelp: beachObjectStickerUrls.schelp,
  zon: beachObjectStickerUrls.zon,
};

export const voiceSideScrollerObstacleSpriteUrls = {
  cloud: new URL("./assets/objects/side-scroller/cloud-obstacle.png", import.meta.url).href,
  "sea-lion": new URL(
    "./assets/objects/side-scroller/sea-lion-obstacle.png",
    import.meta.url,
  ).href,
  seagull: new URL("./assets/objects/side-scroller/seagull-obstacle.png", import.meta.url).href,
  shark: new URL("./assets/objects/side-scroller/shark-obstacle.png", import.meta.url).href,
};

export const worldIconUrls = {
  barn: new URL("./assets/icons/worlds/world-farm.png", import.meta.url).href,
  book: new URL("./assets/icons/worlds/world-school.png", import.meta.url).href,
  paw: new URL("./assets/icons/worlds/world-zoo.png", import.meta.url).href,
  planet: new URL("./assets/icons/worlds/world-space.png", import.meta.url).href,
  slide: new URL("./assets/icons/worlds/world-playground.png", import.meta.url).href,
  waves: new URL("./assets/icons/worlds/world-beach.png", import.meta.url).href,
};

export const instructionVideoUrls = {
  "lp-001": new URL("./assets/instructions/zet-de-boot-in-de-zee.mp4", import.meta.url).href,
  "lp-002": new URL(
    "./assets/instructions/lp-002-opdracht-zet-de-dolfijn-in-de-zee.mp4",
    import.meta.url,
  ).href,
  "lp-003": new URL(
    "./assets/instructions/lp-003-opdracht-zet-de-bal-op-het-strand.mp4",
    import.meta.url,
  ).href,
  "lp-004": new URL(
    "./assets/instructions/lp-004-opdracht-zet-de-vuurtoren-op-het-eiland.mp4",
    import.meta.url,
  ).href,
  "lp-005": new URL(
    "./assets/instructions/lp-005-opdracht-zet-de-vlieger-boven-het-strand.mp4",
    import.meta.url,
  ).href,
  "lp-006": new URL(
    "./assets/instructions/lp-006-opdracht-zet-het-vliegtuig-boven-de-zee.mp4",
    import.meta.url,
  ).href,
  "lp-007": new URL(
    "./assets/instructions/lp-007-opdracht-leg-de-schelp-op-het-strand.mp4",
    import.meta.url,
  ).href,
  "lp-008": new URL(
    "./assets/instructions/lp-008-opdracht-zet-de-krab-op-de-handdoek.mp4",
    import.meta.url,
  ).href,
  "lp-009": new URL(
    "./assets/instructions/lp-009-opdracht-zet-het-zandkasteel-naast-de-schelp.mp4",
    import.meta.url,
  ).href,
  "lp-010": new URL(
    "./assets/instructions/lp-010-opdracht-zet-de-parasol-rechts-op-het-strand.mp4",
    import.meta.url,
  ).href,
  "lp-011": new URL(
    "./assets/instructions/lp-011-opdracht-zet-de-zon-boven-de-zee.mp4",
    import.meta.url,
  ).href,
  "lp-012": new URL(
    "./assets/instructions/lp-012-opdracht-leg-de-handdoek-midden-op-het-strand.mp4",
    import.meta.url,
  ).href,
  "lp-013": new URL(
    "./assets/instructions/lp-013-opdracht-zet-de-boot-links-in-de-zee.mp4",
    import.meta.url,
  ).href,
  "lp-014": new URL(
    "./assets/instructions/lp-014-opdracht-zet-het-vliegtuig-ver-weg-boven-de-zee.mp4",
    import.meta.url,
  ).href,
  "lp-015": new URL(
    "./assets/instructions/lp-015-opdracht-leg-de-bal-dichtbij-de-parasol.mp4",
    import.meta.url,
  ).href,
  "lp-016": new URL(
    "./assets/instructions/lp-016-opdracht-leg-de-schelp-tussen-de-bal-en-het-zandkasteel.mp4",
    import.meta.url,
  ).href,
} as const;

type InstructionVideoId = keyof typeof instructionVideoUrls;

export const getInstructionVideoUrl = (instructionId: string) =>
  instructionVideoUrls[instructionId as InstructionVideoId];

export const hintVideoUrls = {
  lp001SeekBoot: new URL("./assets/instructions/zoek-de-boot.mp4", import.meta.url).href,
  lp001LookAtHighlightedBoot: new URL(
    "./assets/instructions/kijk-naar-het-plaatje-dat-oplicht-boot.mp4",
    import.meta.url,
  ).href,
};

type BeachObjectStickerId = keyof typeof beachObjectStickerUrls;

export function getBeachObjectStickerUrl(assetId: string) {
  return beachObjectStickerUrls[assetId as BeachObjectStickerId];
}

export const avatarIconUrls = {
  avatar01: new URL("./assets/icons/avatars/avatar-01.png", import.meta.url).href,
};

export const broomIconUrls = {
  basic: new URL("./assets/icons/brooms/broom-01-basic.png", import.meta.url).href,
  beach: new URL("./assets/icons/brooms/broom-02-beach.png", import.meta.url).href,
  speed: new URL("./assets/icons/brooms/broom-06-speed.png", import.meta.url).href,
};

export const mascotIconUrls = {
  hint: new URL("./assets/icons/mascot/mascot-06-hint.png", import.meta.url).href,
  celebration: new URL("./assets/icons/mascot/mascot-05-celebration.png", import.meta.url).href,
  neutral: new URL("./assets/icons/mascot/mascot-01-neutral.png", import.meta.url).href,
};

export const voiceSideScrollerBroomStateUrls = {
  boosted: broomIconUrls.speed,
  flying: broomIconUrls.basic,
  slowed: broomIconUrls.beach,
};

export const voiceSideScrollerAvatarStateUrls = {
  flying: avatarIconUrls.avatar01,
  slowed: avatarIconUrls.avatar01,
};

export const voiceSideScrollerMascotStateUrls = {
  celebration: mascotIconUrls.celebration,
  hint: mascotIconUrls.hint,
  ready: mascotIconUrls.neutral,
};
