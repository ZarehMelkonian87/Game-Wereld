export const beachBackgrounds = {
  portrait: new URL("./assets/backgrounds/beach-board-portrait.png", import.meta.url).href,
  landscape: new URL("./assets/backgrounds/beach-board-landscape.png", import.meta.url).href,
};

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
  celebration: new URL("./assets/icons/mascot/mascot-05-celebration.png", import.meta.url).href,
};
