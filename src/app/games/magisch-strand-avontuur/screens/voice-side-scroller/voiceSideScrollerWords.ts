import { normalizeSpokenCommand } from "../../logic/spoken-command-parser";

export const VOICE_SIDE_SCROLLER_WORD_ALIASES = {
  bal: ["bal", "strandbal", "beachbal", "ballen", "balletje", "balletjes", "voetbal"],
  boot: ["boot", "bootje", "zeilboot", "schip", "boten", "bootjes", "zeilbootje", "zeilschip"],
  dolfijn: ["dolfijn", "dolfin", "dolfijnen", "dolfein", "dolfijntje", "dolfijntjes", "dolfijnvis"],
  krab: ["krab", "krabben", "krap", "krabbetje", "krabbetjes", "kreeft"],
  parasol: ["parasol", "strandparasol", "parasollen", "parasolletje", "parasols", "paraplu"],
  schelp: ["schelp", "schelpje", "schelpen", "schelpjes"],
  zon: ["zon", "zonnetje", "zonnig", "zonne", "zonnetjes", "zonsopgang"],
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
