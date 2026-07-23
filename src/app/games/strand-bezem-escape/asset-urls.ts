export const beachBackgrounds = {
  portrait: new URL("./assets/backgrounds/beach-board-portrait.png", import.meta.url).href,
  landscape: new URL("./assets/backgrounds/beach-board-landscape.png", import.meta.url).href,
  voiceSideScroller: new URL("./assets/backgrounds/beach-voice-side-scroller.png", import.meta.url)
    .href,
};
export const startLogoUrl = new URL("./assets/logos/start-logo-beach.png", import.meta.url).href;
export const backgroundMusicUrl = new URL("./assets/audio/background-music.mp3", import.meta.url)
  .href;
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
  "sea-lion": new URL("./assets/objects/side-scroller/sea-lion-obstacle.png", import.meta.url).href,
  seagull: new URL("./assets/objects/side-scroller/seagull-obstacle.png", import.meta.url).href,
  shark: new URL("./assets/objects/side-scroller/shark-obstacle.png", import.meta.url).href,
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
  "cw-001": new URL("./assets/instructions/cw-001-opdracht-waar-is-de-dolfijn.mp4", import.meta.url)
    .href,
  "cw-002": new URL("./assets/instructions/cw-002-opdracht-waar-is-de-boot.mp4", import.meta.url)
    .href,
  "cw-003": new URL("./assets/instructions/cw-003-opdracht-waar-is-de-bal.mp4", import.meta.url)
    .href,
  "cw-004": new URL(
    "./assets/instructions/cw-004-opdracht-waar-is-de-vuurtoren.mp4",
    import.meta.url,
  ).href,
  "cw-005": new URL("./assets/instructions/cw-005-opdracht-waar-is-de-parasol.mp4", import.meta.url)
    .href,
  "cw-006": new URL("./assets/instructions/cw-006-opdracht-waar-is-de-vlieger.mp4", import.meta.url)
    .href,
  "cw-007": new URL("./assets/instructions/cw-007-opdracht-waar-is-de-krab.mp4", import.meta.url)
    .href,
  "cw-008": new URL(
    "./assets/instructions/cw-008-opdracht-waar-is-de-handdoek.mp4",
    import.meta.url,
  ).href,
  "cw-009": new URL("./assets/instructions/cw-009-opdracht-waar-is-de-schelp.mp4", import.meta.url)
    .href,
  "cw-010": new URL(
    "./assets/instructions/cw-010-opdracht-waar-is-het-zandkasteel.mp4",
    import.meta.url,
  ).href,
  "cw-011": new URL(
    "./assets/instructions/cw-011-opdracht-waar-is-het-vliegtuig.mp4",
    import.meta.url,
  ).href,
  "cw-012": new URL("./assets/instructions/cw-012-opdracht-waar-is-de-zon.mp4", import.meta.url)
    .href,
} as const;
type InstructionVideoId = keyof typeof instructionVideoUrls;
export const getInstructionVideoUrl = (instructionId: string) =>
  instructionVideoUrls[instructionId as InstructionVideoId];
const seekObjectHintVideoUrls = {
  "lp-001": new URL("./assets/instructions/zoek-de-boot.mp4", import.meta.url).href,
  "lp-002": new URL("./assets/instructions/lp-002-hint-01-zoek-de-dolfijn.mp4", import.meta.url)
    .href,
  "lp-003": new URL("./assets/instructions/lp-003-hint-01-zoek-de-bal.mp4", import.meta.url).href,
  "lp-004": new URL("./assets/instructions/lp-004-hint-01-zoek-de-vuurtoren.mp4", import.meta.url)
    .href,
  "lp-005": new URL("./assets/instructions/lp-005-hint-01-zoek-de-vlieger.mp4", import.meta.url)
    .href,
  "lp-006": new URL("./assets/instructions/lp-006-hint-01-zoek-het-vliegtuig.mp4", import.meta.url)
    .href,
  "lp-007": new URL("./assets/instructions/lp-007-hint-01-zoek-de-schelp.mp4", import.meta.url)
    .href,
  "lp-008": new URL("./assets/instructions/lp-008-hint-01-zoek-de-krab.mp4", import.meta.url).href,
  "lp-009": new URL(
    "./assets/instructions/lp-009-hint-01-zoek-het-zandkasteel.mp4",
    import.meta.url,
  ).href,
  "lp-010": new URL("./assets/instructions/lp-010-hint-01-zoek-de-parasol.mp4", import.meta.url)
    .href,
  "lp-011": new URL("./assets/instructions/lp-011-hint-01-zoek-de-zon.mp4", import.meta.url).href,
  "lp-012": new URL("./assets/instructions/lp-012-hint-01-zoek-de-handdoek.mp4", import.meta.url)
    .href,
  "lp-013": new URL("./assets/instructions/lp-013-hint-01-zoek-de-boot.mp4", import.meta.url).href,
} as const;
type SeekObjectHintVideoId = keyof typeof seekObjectHintVideoUrls;
export const getSeekObjectHintVideoUrl = (instructionId: string) =>
  seekObjectHintVideoUrls[instructionId as SeekObjectHintVideoId];
const highlightedObjectHintVideoUrls = {
  "lp-001": new URL(
    "./assets/instructions/kijk-naar-het-plaatje-dat-oplicht-boot.mp4",
    import.meta.url,
  ).href,
  "lp-002": new URL("./assets/instructions/lp-002-hint-02-kijk-naar-dolfijn.mp4", import.meta.url)
    .href,
  "lp-003": new URL("./assets/instructions/lp-003-hint-02-kijk-naar-bal.mp4", import.meta.url).href,
  "lp-004": new URL("./assets/instructions/lp-004-hint-02-kijk-naar-vuurtoren.mp4", import.meta.url)
    .href,
  "lp-005": new URL("./assets/instructions/lp-005-hint-02-kijk-naar-vlieger.mp4", import.meta.url)
    .href,
  "lp-006": new URL("./assets/instructions/lp-006-hint-02-kijk-naar-vliegtuig.mp4", import.meta.url)
    .href,
  "lp-007": new URL("./assets/instructions/lp-007-hint-02-kijk-naar-schelp.mp4", import.meta.url)
    .href,
  "lp-008": new URL("./assets/instructions/lp-008-hint-02-kijk-naar-krab.mp4", import.meta.url)
    .href,
  "lp-009": new URL(
    "./assets/instructions/lp-009-hint-02-kijk-naar-zandkasteel.mp4",
    import.meta.url,
  ).href,
  "lp-010": new URL("./assets/instructions/lp-010-hint-02-kijk-naar-parasol.mp4", import.meta.url)
    .href,
  "lp-011": new URL("./assets/instructions/lp-011-hint-02-kijk-naar-zon.mp4", import.meta.url).href,
  "lp-012": new URL("./assets/instructions/lp-012-hint-02-kijk-naar-handdoek.mp4", import.meta.url)
    .href,
  "lp-013": new URL("./assets/instructions/lp-013-hint-02-kijk-naar-boot.mp4", import.meta.url)
    .href,
} as const;
type HighlightedObjectHintVideoId = keyof typeof highlightedObjectHintVideoUrls;
export const getHighlightedObjectHintVideoUrl = (instructionId: string) =>
  highlightedObjectHintVideoUrls[instructionId as HighlightedObjectHintVideoId];
export const sharedPlaceHintVideoUrl = new URL(
  "./assets/instructions/shared-hint-kijk-naar-de-plek-die-oplicht.mp4",
  import.meta.url,
).href;
const conceptHintVideoUrls = {
  boven: new URL("./assets/instructions/concept-boven.mp4", import.meta.url).href,
  dichtbij: new URL("./assets/instructions/concept-dichtbij.mp4", import.meta.url).href,
  in: new URL("./assets/instructions/concept-in.mp4", import.meta.url).href,
  links: new URL("./assets/instructions/concept-links.mp4", import.meta.url).href,
  midden: new URL("./assets/instructions/concept-midden.mp4", import.meta.url).href,
  naast: new URL("./assets/instructions/concept-naast.mp4", import.meta.url).href,
  onder: new URL("./assets/instructions/concept-onder.mp4", import.meta.url).href,
  op: new URL("./assets/instructions/concept-op.mp4", import.meta.url).href,
  rechts: new URL("./assets/instructions/concept-rechts.mp4", import.meta.url).href,
  tussen: new URL("./assets/instructions/concept-tussen.mp4", import.meta.url).href,
  "ver weg": new URL("./assets/instructions/concept-ver-weg.mp4", import.meta.url).href,
} as const;
type ConceptHintVideoId = keyof typeof conceptHintVideoUrls;
export const getConceptHintVideoUrl = (concept: string) =>
  conceptHintVideoUrls[concept as ConceptHintVideoId];
const feedbackVideoUrls = {
  "lp-001": new URL(
    "./assets/instructions/lp-001-feedback-boot-vaart-in-de-zee.mp4",
    import.meta.url,
  ).href,
  "lp-002": new URL(
    "./assets/instructions/lp-002-feedback-dolfijn-zwemt-in-de-zee.mp4",
    import.meta.url,
  ).href,
  "lp-003": new URL(
    "./assets/instructions/lp-003-feedback-bal-ligt-op-het-strand.mp4",
    import.meta.url,
  ).href,
  "lp-004": new URL(
    "./assets/instructions/lp-004-feedback-vuurtoren-staat-op-het-eiland.mp4",
    import.meta.url,
  ).href,
  "lp-005": new URL(
    "./assets/instructions/lp-005-feedback-vlieger-boven-het-strand.mp4",
    import.meta.url,
  ).href,
  "lp-006": new URL(
    "./assets/instructions/lp-006-feedback-vliegtuig-boven-de-zee.mp4",
    import.meta.url,
  ).href,
  "lp-007": new URL(
    "./assets/instructions/lp-007-feedback-schelp-ligt-op-het-strand.mp4",
    import.meta.url,
  ).href,
  "lp-008": new URL(
    "./assets/instructions/lp-008-feedback-krab-zit-op-de-handdoek.mp4",
    import.meta.url,
  ).href,
  "lp-009": new URL(
    "./assets/instructions/lp-009-feedback-zandkasteel-naast-schelp.mp4",
    import.meta.url,
  ).href,
  "lp-010": new URL(
    "./assets/instructions/lp-010-feedback-parasol-rechts-op-strand.mp4",
    import.meta.url,
  ).href,
  "lp-011": new URL("./assets/instructions/lp-011-feedback-zon-boven-de-zee.mp4", import.meta.url)
    .href,
  "lp-012": new URL(
    "./assets/instructions/lp-012-feedback-handdoek-midden-op-strand.mp4",
    import.meta.url,
  ).href,
  "lp-013": new URL(
    "./assets/instructions/lp-013-feedback-boot-links-in-de-zee.mp4",
    import.meta.url,
  ).href,
  "lp-014": new URL(
    "./assets/instructions/lp-014-feedback-vliegtuig-ver-weg-boven-de-zee.mp4",
    import.meta.url,
  ).href,
  "lp-015": new URL(
    "./assets/instructions/lp-015-feedback-bal-dichtbij-parasol.mp4",
    import.meta.url,
  ).href,
} as const;
type FeedbackVideoId = keyof typeof feedbackVideoUrls;
export const getFeedbackVideoUrl = (instructionId: string) =>
  feedbackVideoUrls[instructionId as FeedbackVideoId];
export const hintVideoUrls = {
  lp001SeekBoot: seekObjectHintVideoUrls["lp-001"],
  lp001LookAtHighlightedBoot: highlightedObjectHintVideoUrls["lp-001"],
};
type BeachObjectStickerId = keyof typeof beachObjectStickerUrls;
export const getBeachObjectStickerUrl = (assetId: string) => {
  return beachObjectStickerUrls[assetId as BeachObjectStickerId];
};
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
