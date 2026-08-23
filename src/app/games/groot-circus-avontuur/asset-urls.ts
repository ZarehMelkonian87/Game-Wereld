import { beachObjects } from "./content";

// -----------------------------------------------------------------------------
// PLACEHOLDER-ASSETS (v1)
// Afbeeldingen zijn tijdelijke emoji-/SVG-iconen als inline data-URL's, zodat de
// game direct speelbaar is zonder losse afbeeldingsbestanden. Video's zijn nog
// niet aanwezig: de video-getters geven `undefined` terug, waardoor de game
// automatisch terugvalt op de spraaksynthese-stem (TTS). Vervang deze data-URL's
// later door echte circusafbeeldingen en koppel MP4-video's in de getters.
// -----------------------------------------------------------------------------

const svgDataUrl = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const emojiStickerUrl = (emoji: string) =>
  svgDataUrl(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">' +
      '<text x="50%" y="52%" font-size="86" text-anchor="middle" dominant-baseline="central">' +
      emoji +
      "</text></svg>",
  );

export const beachBackgrounds = {
  portrait: new URL("./assets/backgrounds/circus-board-portrait.png", import.meta.url).href,
  portraitWebp: new URL("./assets/backgrounds/circus-board-portrait.webp", import.meta.url).href,
  landscape: new URL("./assets/backgrounds/circus-board-landscape.png", import.meta.url).href,
  landscapeWebp: new URL("./assets/backgrounds/circus-board-landscape.webp", import.meta.url).href,
  voiceSideScroller: new URL(
    "./assets/backgrounds/circus-voice-side-scroller.png",
    import.meta.url,
  ).href,
  voiceSideScrollerWebp: new URL(
    "./assets/backgrounds/circus-voice-side-scroller.webp",
    import.meta.url,
  ).href,
};
export const startLogoUrl = new URL("./assets/logos/start-logo-circus.png", import.meta.url).href;
export const backgroundMusicUrl = new URL("./assets/audio/background-music.mp3", import.meta.url)
  .href;

export const beachObjectStickerUrls: Record<string, string> = Object.fromEntries(
  beachObjects.map((object) => [object.assetId, emojiStickerUrl(object.emoji)]),
);

export const voiceSideScrollerObjectSpriteUrls: Record<string, string> = beachObjectStickerUrls;

export const voiceSideScrollerObstacleSpriteUrls = {
  cloud: emojiStickerUrl("☁️"),
  "sea-lion": emojiStickerUrl("🤹"),
  seagull: emojiStickerUrl("🕊️"),
  shark: emojiStickerUrl("🐯"),
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
  beachObjectStickerUrls[assetId];

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
