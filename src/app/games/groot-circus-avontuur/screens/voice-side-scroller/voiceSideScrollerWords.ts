import { normalizeSpokenCommand } from "../../logic/spoken-command-parser";

export const VOICE_SIDE_SCROLLER_WORD_ALIASES = {
  aap: ["aap", "apen", "aapje", "aapjes", "chimpansee"],
  bal: ["bal", "ballen", "balletje", "balletjes", "jongleerbal"],
  ballon: ["ballon", "ballonnen", "ballonnetje", "luchtballon"],
  beer: ["beer", "beren", "beertje", "teddybeer"],
  big: ["big", "biggen", "biggetje", "varken", "varkens"],
  clown: ["clown", "clowns", "clowntje", "pias", "nar"],
  hond: ["hond", "honden", "hondje", "hondjes", "puppy", "poedel"],
  hoepel: ["hoepel", "hoepels", "hoepeltje", "ring", "hoela"],
  kip: ["kip", "kippen", "kipje", "kuiken", "hen", "haan"],
  leeuw: ["leeuw", "leeuwen", "leeuwtje", "leeuwtjes", "welp"],
  muis: ["muis", "muizen", "muisje", "muisjes"],
  olifant: ["olifant", "olifanten", "olifantje", "slurf"],
  poes: ["poes", "poezen", "poesje", "kat", "katten", "katje", "kitten"],
  zeehond: ["zeehond", "zeehonden", "zeehondje", "rob", "zeeleeuw"],
} as const;

export type VoiceSideScrollerWordId = keyof typeof VOICE_SIDE_SCROLLER_WORD_ALIASES;

export interface VoiceSideScrollerWordMatchInput {
  targetWord: string;
  transcript: string;
}

export interface VoiceSideScrollerWordMatchResult {
  isMatch: boolean;
  matchedAlias?: string;
  normalizedTranscript: string;
  targetWord: string;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isKnownVoiceSideScrollerWord = (word: string): word is VoiceSideScrollerWordId =>
  word in VOICE_SIDE_SCROLLER_WORD_ALIASES;

const createAliasExpression = (alias: string) => new RegExp(`(?:^| )${escapeRegExp(alias)}(?= |$)`);

export const getVoiceSideScrollerWordAliases = (word: string): string[] => {
  const normalizedWord = normalizeSpokenCommand(word);
  const aliases = isKnownVoiceSideScrollerWord(normalizedWord)
    ? VOICE_SIDE_SCROLLER_WORD_ALIASES[normalizedWord]
    : [normalizedWord];

  return [...new Set(aliases.map(normalizeSpokenCommand).filter(Boolean))];
};

export const matchVoiceSideScrollerWord = ({
  targetWord,
  transcript,
}: VoiceSideScrollerWordMatchInput): VoiceSideScrollerWordMatchResult => {
  const normalizedTranscript = normalizeSpokenCommand(transcript);
  const aliases = getVoiceSideScrollerWordAliases(targetWord);
  const matchedAlias = aliases.find((alias) =>
    createAliasExpression(alias).test(normalizedTranscript),
  );

  return {
    isMatch: Boolean(matchedAlias),
    matchedAlias,
    normalizedTranscript,
    targetWord,
  };
};
