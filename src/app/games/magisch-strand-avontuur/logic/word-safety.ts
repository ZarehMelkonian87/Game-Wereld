import { normalizeSpokenCommand } from "./spoken-command-parser";

/**
 * Vriendelijke bescherming tegen scheld- en ongewenste woorden in de
 * spraaktranscriptie (T-28). Het doel is **niet** straffen, maar het kind zacht
 * bijsturen ("laten we mooie woorden gebruiken") en voorkomen dat een ongewenst
 * woord op het scherm verschijnt of als antwoord wordt verwerkt.
 *
 * De lijst is bewust beknopt en bevat alleen ondubbelzinnig ongewenste woorden,
 * zodat gewone strandwoorden (bal, boot, zon, schelp, krab, parasol, dolfijn,
 * zee…) nooit per ongeluk worden geblokkeerd. Matching gebeurt op **hele
 * genormaliseerde woorden**, wat de "Scunthorpe"-valkuil (ongewenste woorden als
 * deelstring in nette woorden, bv. "hoer" in "hoera") voorkomt.
 */
const UNWANTED_WORDS: readonly string[] = [
  // Nederlandse scheldwoorden en veelgehoorde varianten
  "kut",
  "kutje",
  "kutten",
  "lul",
  "lullen",
  "kloot",
  "klote",
  "klootzak",
  "klootzakken",
  "hoer",
  "hoeren",
  "kanker",
  "kankerlijer",
  "tering",
  "tyfus",
  "tyfuslijer",
  "kolere",
  "klere",
  "stront",
  "schijt",
  "neuk",
  "neuken",
  "godverdomme",
  "godver",
  "verdomme",
  "mongool",
  "mongolen",
  "debiel",
  "debielen",
  // Engelse scheldwoorden die kinderen kunnen oppikken
  "shit",
  "fuck",
  "fucking",
  "fucker",
  "motherfucker",
  "bitch",
  "asshole",
  "dick",
  "bastard",
];

const UNWANTED_WORD_SET = new Set(UNWANTED_WORDS.map(normalizeSpokenCommand).filter(Boolean));

/** Vriendelijke nudge die getoond wordt bij een ongewenst woord. */
export const UNWANTED_WORD_NUDGE = "Oei, laten we mooie woorden gebruiken. Zeg maar wat je ziet.";

const toWordTokens = (text: string) =>
  normalizeSpokenCommand(text)
    .split(" ")
    .filter(Boolean);

/** Geeft het eerste ongewenste woord terug (genormaliseerd), of undefined. */
export const findUnwantedWord = (text: string): string | undefined =>
  toWordTokens(text).find((token) => UNWANTED_WORD_SET.has(token));

/** Of de tekst een ongewenst woord bevat. */
export const containsUnwantedWord = (text: string): boolean => Boolean(findUnwantedWord(text));

/**
 * Vervangt ongewenste hele woorden door "…" zodat ze niet op het scherm
 * verschijnen, maar de rest van wat het kind zei zichtbaar blijft.
 */
export const sanitizeSpokenText = (text: string): string => {
  if (!text) {
    return text;
  }

  return text
    .split(/(\s+)/)
    .map((segment) =>
      segment.trim() && UNWANTED_WORD_SET.has(normalizeSpokenCommand(segment)) ? "…" : segment,
    )
    .join("");
};

/**
 * Splitst herkenningskandidaten in de nette woorden en of er een ongewenst
 * woord tussen zat. Zo kan een gemengde uiting ("stomme bal") tóch het geldige
 * strandwoord ("bal") oppakken, terwijl het ongewenste deel wordt genegeerd.
 */
export const filterUnwantedCandidates = (
  candidates: readonly string[],
): { clean: string[]; hadUnwanted: boolean } => {
  let hadUnwanted = false;
  const clean: string[] = [];

  for (const candidate of candidates) {
    if (UNWANTED_WORD_SET.has(normalizeSpokenCommand(candidate))) {
      hadUnwanted = true;
      continue;
    }

    clean.push(candidate);
  }

  return { clean, hadUnwanted };
};
