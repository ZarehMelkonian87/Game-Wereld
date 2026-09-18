import type { BezemEscapeMode } from "../types";

/**
 * Ontgrendel-drempels per modus (T-31), uitgedrukt in het cumulatieve
 * per-profiel sterrentotaal (`wordStars`, zie `T-01`/`T-21`).
 *
 * De volgorde volgt de leerlijn **receptief → relationeel → productief**:
 * - `choose-word` (Kies het Woord, receptief) is de instapmodus en altijd open.
 * - `listen-and-place` (Zeg & Zet, relationeel) opent na wat sterren.
 * - `zeg-en-vlieg` (Zeg & Vlieg, productief) opent daarna.
 *
 * Belangrijk: alleen Kies het Woord en Zeg & Zet leveren sterren op, dus de
 * drempels zijn haalbaar zonder een vergrendelde modus nodig te hebben
 * (geen deadlock).
 */
export const MODE_UNLOCK_WORD_STARS: Record<BezemEscapeMode, number> = {
  "choose-word": 0,
  "listen-and-place": 3,
  // Leerlijn Kies → Zet → Bouw → Vlieg (concept-besluit 4): zelf zinnen bouwen
  // vóór het onder tijdsdruk benoemen in Zeg & Vlieg.
  "zeg-en-bouw": 8,
  "zeg-en-vlieg": 14,
};

/** De aanbevolen weergavevolgorde in het moduskeuzescherm (leerlijn). */
export const MODE_DISPLAY_ORDER: readonly BezemEscapeMode[] = [
  "choose-word",
  "listen-and-place",
  "zeg-en-bouw",
  "zeg-en-vlieg",
];

export const isModeUnlocked = (mode: BezemEscapeMode, totalWordStars: number): boolean =>
  totalWordStars >= (MODE_UNLOCK_WORD_STARS[mode] ?? 0);

export const getStarsUntilModeUnlock = (
  mode: BezemEscapeMode,
  totalWordStars: number,
): number => Math.max(0, (MODE_UNLOCK_WORD_STARS[mode] ?? 0) - totalWordStars);
