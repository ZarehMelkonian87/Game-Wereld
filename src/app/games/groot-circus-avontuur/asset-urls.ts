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

const circusBoardUrl = svgDataUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none">' +
    '<rect width="100" height="100" fill="#fde7c9"/>' +
    // Tentdak / nok: rode en crème strepen bovenin
    "<g>" +
    '<rect x="0" y="0" width="100" height="38" fill="#f6d8b0"/>' +
    '<path d="M0 0 H14 L7 38 H0 Z" fill="#d1495b"/>' +
    '<path d="M28 0 H42 L35 38 H21 Z" fill="#d1495b"/>' +
    '<path d="M56 0 H70 L63 38 H49 Z" fill="#d1495b"/>' +
    '<path d="M84 0 H98 L91 38 H77 Z" fill="#d1495b"/>' +
    "</g>" +
    // Piste: gouden middenband
    '<rect x="0" y="38" width="100" height="17" fill="#f2b705"/>' +
    '<ellipse cx="50" cy="55" rx="52" ry="10" fill="#e8a600"/>' +
    // Tribune rechts
    '<rect x="60" y="31" width="40" height="12" fill="#b5651d" opacity="0.85"/>' +
    // Vloer / voorgrond
    '<rect x="0" y="55" width="100" height="45" fill="#deb887"/>' +
    "</svg>",
);

export const beachBackgrounds = {
  portrait: circusBoardUrl,
  portraitWebp: undefined as string | undefined,
  landscape: circusBoardUrl,
  landscapeWebp: undefined as string | undefined,
  voiceSideScroller: circusBoardUrl,
  voiceSideScrollerWebp: undefined as string | undefined,
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
