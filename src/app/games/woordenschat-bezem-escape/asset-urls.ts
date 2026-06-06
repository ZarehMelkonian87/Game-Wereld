export const beachBackgrounds = {
  portrait: new URL("./assets/backgrounds/beach-board-portrait.png", import.meta.url).href,
  landscape: new URL("./assets/backgrounds/beach-board-landscape.png", import.meta.url).href,
  raceSideScroller: new URL(
    "./assets/backgrounds/beach-race-side-scroller.png",
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

export const worldIconUrls = {
  barn: new URL("./assets/icons/worlds/world-farm.png", import.meta.url).href,
  book: new URL("./assets/icons/worlds/world-school.png", import.meta.url).href,
  paw: new URL("./assets/icons/worlds/world-zoo.png", import.meta.url).href,
  planet: new URL("./assets/icons/worlds/world-space.png", import.meta.url).href,
  slide: new URL("./assets/icons/worlds/world-playground.png", import.meta.url).href,
  waves: new URL("./assets/icons/worlds/world-beach.png", import.meta.url).href,
};

export const instructionVideoUrls = {
  lp001: new URL("./assets/instructions/zet-de-boot-in-de-zee.mp4", import.meta.url).href,
  lp002: new URL(
    "./assets/instructions/lp-002-opdracht-zet-de-dolfijn-in-de-zee.mp4",
    import.meta.url,
  ).href,
  lp003: new URL(
    "./assets/instructions/lp-003-opdracht-zet-de-bal-op-het-strand.mp4",
    import.meta.url,
  ).href,
};

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
};

export const mascotIconUrls = {
  hint: new URL("./assets/icons/mascot/mascot-06-hint.png", import.meta.url).href,
  celebration: new URL("./assets/icons/mascot/mascot-05-celebration.png", import.meta.url).href,
  neutral: new URL("./assets/icons/mascot/mascot-01-neutral.png", import.meta.url).href,
};
