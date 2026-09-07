export const beachBackgrounds = {
  portrait: new URL("./assets/backgrounds/circus-board-portrait.png", import.meta.url).href,
  portraitWebp: new URL("./assets/backgrounds/circus-board-portrait.webp", import.meta.url).href,
  landscape: new URL("./assets/backgrounds/circus-board-landscape.png", import.meta.url).href,
  landscapeWebp: new URL("./assets/backgrounds/circus-board-landscape.webp", import.meta.url).href,
  voiceSideScroller: new URL("./assets/backgrounds/circus-voice-side-scroller.png", import.meta.url)
    .href,
  voiceSideScrollerWebp: new URL(
    "./assets/backgrounds/circus-voice-side-scroller.webp",
    import.meta.url,
  ).href,
};
export const startLogoUrl = new URL("./assets/logos/start-logo-circus.png", import.meta.url).href;
export const backgroundMusicUrl = new URL("./assets/audio/background-music.mp3", import.meta.url)
  .href;

export const beachObjectStickerUrls = {
  clown: new URL("./assets/objects/transparent/clown-sticker.png", import.meta.url).href,
  acrobaat: new URL("./assets/objects/transparent/acrobat-sticker.png", import.meta.url).href,
  leeuw: new URL("./assets/objects/transparent/lion-sticker.png", import.meta.url).href,
  olifant: new URL("./assets/objects/transparent/elephant-sticker.png", import.meta.url).href,
  aap: new URL("./assets/objects/transparent/monkey-sticker.png", import.meta.url).href,
  kip: new URL("./assets/objects/transparent/chicken-sticker.png", import.meta.url).href,
  poes: new URL("./assets/objects/transparent/cat-sticker.png", import.meta.url).href,
  big: new URL("./assets/objects/transparent/piglet-sticker.png", import.meta.url).href,
  muis: new URL("./assets/objects/transparent/mouse-sticker.png", import.meta.url).href,
  beer: new URL("./assets/objects/transparent/bear-sticker.png", import.meta.url).href,
  zeehond: new URL("./assets/objects/transparent/seal-sticker.png", import.meta.url).href,
  hond: new URL("./assets/objects/transparent/dog-sticker.png", import.meta.url).href,
  eenwieler: new URL("./assets/objects/transparent/unicycle-sticker.png", import.meta.url).href,
  kanon: new URL("./assets/objects/transparent/cannon-sticker.png", import.meta.url).href,
  bal: new URL("./assets/objects/transparent/ball-sticker.png", import.meta.url).href,
  hoepel: new URL("./assets/objects/transparent/hoop-sticker.png", import.meta.url).href,
  ballon: new URL("./assets/objects/transparent/balloon-sticker.png", import.meta.url).href,
  trommel: new URL("./assets/objects/transparent/drum-sticker.png", import.meta.url).href,
  vlag: new URL("./assets/objects/transparent/flag-sticker.png", import.meta.url).href,
} as const;

export type BeachObjectStickerId = keyof typeof beachObjectStickerUrls;

export const voiceSideScrollerObjectSpriteUrls = beachObjectStickerUrls;

export const voiceSideScrollerObstacleSpriteUrls = {
  cloud: new URL("./assets/objects/side-scroller/cloud-obstacle.png", import.meta.url).href,
  "sea-lion": new URL("./assets/objects/side-scroller/sea-lion-obstacle.png", import.meta.url).href,
  seagull: new URL("./assets/objects/side-scroller/seagull-obstacle.png", import.meta.url).href,
  shark: new URL("./assets/objects/side-scroller/shark-obstacle.png", import.meta.url).href,
};

// Video-placeholders: nog geen MP4's. Alle getters geven undefined → TTS-fallback.
export const getInstructionVideoUrl = (_instructionId: string): string | undefined => undefined;
export const getSeekObjectHintVideoUrl = (_instructionId: string): string | undefined => undefined;
export const getHighlightedObjectHintVideoUrl = (_instructionId: string): string | undefined =>
  undefined;
export const getConceptHintVideoUrl = (_concept: string): string | undefined => undefined;
export const getFeedbackVideoUrl = (_instructionId: string): string | undefined => undefined;
export const sharedPlaceHintVideoUrl: string | undefined = undefined;

export const getBeachObjectStickerUrl = (assetId: string): string =>
  beachObjectStickerUrls[assetId as BeachObjectStickerId] ?? "";

export const avatarIconUrls = {
  avatar05: new URL("./assets/icons/avatars/avatar-05.png", import.meta.url).href,
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
  flying: avatarIconUrls.avatar05,
  slowed: avatarIconUrls.avatar05,
};
export const voiceSideScrollerMascotStateUrls = {
  celebration: mascotIconUrls.celebration,
  hint: mascotIconUrls.hint,
  ready: mascotIconUrls.neutral,
};
