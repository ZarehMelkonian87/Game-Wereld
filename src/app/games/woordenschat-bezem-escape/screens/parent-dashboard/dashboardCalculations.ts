import type {
  BezemEscapePracticeEvent,
  ConceptProgress,
  VoiceSideScrollerPracticeEvent,
} from "../../types";
import type { DashboardRow, ObservationStatus } from "./types";

const todayKey = (date = new Date()) => date.toISOString().slice(0, 10);

export const getStatusFromConcept = (
  progress: ConceptProgress | undefined,
): ObservationStatus => {
  if (!progress || progress.practiced === 0) {
    return "oefenen";
  }

  if (progress.needsPractice > 0 && progress.needsPractice >= progress.correctWithoutHelp) {
    return "nog-moeilijk";
  }

  if (progress.correctWithHelp > progress.correctWithoutHelp) {
    return "met-hulp";
  }

  if (
    progress.correctWithoutHelp >= Math.max(1, progress.correctWithHelp + progress.needsPractice)
  ) {
    return "gaat-goed";
  }

  return "oefenen";
};

export const getWordStatus = ({
  activeCount,
  practicedCount,
  recognizedCount,
}: {
  activeCount: number;
  practicedCount: number;
  recognizedCount: number;
}): ObservationStatus => {
  if (practicedCount === 0) {
    return "oefenen";
  }

  if (recognizedCount > 0 && activeCount > 0) {
    return "gaat-goed";
  }

  if (recognizedCount > 0) {
    return "met-hulp";
  }

  return "nog-moeilijk";
};

export const getRowsFromConcepts = (
  concepts: Record<string, ConceptProgress>,
  limit = 6,
): DashboardRow[] =>
  Object.entries(concepts)
    .filter(([, progress]) => progress.practiced > 0)
    .sort(([, a], [, b]) => b.practiced - a.practiced)
    .slice(0, limit)
    .map(([label, progress]) => ({
      detail: `${progress.practiced} geoefend, ${progress.needsPractice} oefenen`,
      label,
      status: getStatusFromConcept(progress),
    }));

export const getRowsFromWords = ({
  activeWords,
  practicedWords,
  recognizedWords,
}: {
  activeWords: Record<string, number>;
  practicedWords: Record<string, number>;
  recognizedWords: Record<string, number>;
}): DashboardRow[] =>
  Object.entries(practicedWords)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([word, practicedCount]) => {
      const recognizedCount = recognizedWords[word] ?? 0;
      const activeCount = activeWords[word] ?? 0;

      return {
        detail: `${practicedCount}x geoefend, ${recognizedCount}x herkend, ${activeCount}x benoemd`,
        label: word,
        status: getWordStatus({ activeCount, practicedCount, recognizedCount }),
      };
    });

export const getRowsFromActiveSpatialConcepts = (
  concepts: Record<string, number>,
  limit = 6,
): DashboardRow[] =>
  Object.entries(concepts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([label, count]) => ({
      detail: `${count}x spontaan gebruikt in een eigen zin`,
      label,
      status: "gaat-goed",
    }));

export const getVoiceSideScrollerAttempts = (
  attempts: BezemEscapePracticeEvent[],
): VoiceSideScrollerPracticeEvent[] =>
  attempts.flatMap((attempt) => {
    if (attempt.mode !== "zeg-en-vlieg") {
      return [];
    }

    return [
      {
        ...attempt,
        mode: "zeg-en-vlieg",
        voiceSideScroller: attempt.voiceSideScroller ?? {
          audioRepeats: attempt.audioRepeats,
          hintsUsed: attempt.hintsUsed,
          isRecognized: attempt.isCorrect,
          spokenTranscript: attempt.spokenTranscript,
          targetWord: attempt.targetWords[0] ?? "onbekend woord",
          wordAttempts: attempt.attempts,
        },
      },
    ];
  });

const getVoiceSideScrollerWordStatus = ({
  hintsUsed,
  needsPractice,
  recognized,
}: {
  hintsUsed: number;
  needsPractice: number;
  recognized: number;
}): ObservationStatus => {
  if (recognized > 0 && needsPractice === 0 && hintsUsed === 0) {
    return "gaat-goed";
  }

  if (recognized > 0) {
    return "met-hulp";
  }

  if (needsPractice > 0) {
    return "nog-moeilijk";
  }

  return "oefenen";
};

interface VoiceSideScrollerTargetStats {
  audioRepeats: number;
  hintsUsed: number;
  recognized: boolean;
  targetWord: string;
  wordAttempts: number;
}

const getVoiceSideScrollerTargetStats = (
  attempts: VoiceSideScrollerPracticeEvent[],
) => {
  const targetStats = new Map<string, VoiceSideScrollerTargetStats>();

  attempts.forEach((attempt) => {
    const targetKey = `${attempt.instructionId}:${attempt.voiceSideScroller.targetWord}`;
    const currentStats = targetStats.get(targetKey) ?? {
      audioRepeats: 0,
      hintsUsed: 0,
      recognized: false,
      targetWord: attempt.voiceSideScroller.targetWord,
      wordAttempts: 0,
    };

    targetStats.set(targetKey, {
      audioRepeats: Math.max(
        currentStats.audioRepeats,
        attempt.voiceSideScroller.audioRepeats,
      ),
      hintsUsed: Math.max(currentStats.hintsUsed, attempt.voiceSideScroller.hintsUsed),
      recognized: currentStats.recognized || attempt.voiceSideScroller.isRecognized,
      targetWord: attempt.voiceSideScroller.targetWord,
      wordAttempts: Math.max(
        currentStats.wordAttempts,
        attempt.voiceSideScroller.wordAttempts,
      ),
    });
  });

  return [...targetStats.values()];
};

export const getRowsFromVoiceSideScrollerAttempts = (
  attempts: VoiceSideScrollerPracticeEvent[],
  limit = 8,
): DashboardRow[] => {
  if (attempts.length === 0) {
    return [
      {
        detail: "Nog geen stemronde gespeeld.",
        label: "Zeg & Vlieg",
        status: "oefenen",
      },
    ];
  }

  const targetStats = getVoiceSideScrollerTargetStats(attempts);
  const wordStats = new Map<
    string,
    {
      audioRepeats: number;
      hintsUsed: number;
      needsPractice: number;
      practiced: number;
      recognized: number;
      wordAttempts: number;
    }
  >();

  targetStats.forEach((target) => {
    const targetWord = target.targetWord;
    const currentStats = wordStats.get(targetWord) ?? {
      audioRepeats: 0,
      hintsUsed: 0,
      needsPractice: 0,
      practiced: 0,
      recognized: 0,
      wordAttempts: 0,
    };

    wordStats.set(targetWord, {
      audioRepeats: currentStats.audioRepeats + target.audioRepeats,
      hintsUsed: currentStats.hintsUsed + target.hintsUsed,
      needsPractice: currentStats.needsPractice + (target.recognized ? 0 : 1),
      practiced: currentStats.practiced + 1,
      recognized: currentStats.recognized + (target.recognized ? 1 : 0),
      wordAttempts: currentStats.wordAttempts + target.wordAttempts,
    });
  });

  return [...wordStats.entries()]
    .sort(([, left], [, right]) => {
      if (right.needsPractice !== left.needsPractice) {
        return right.needsPractice - left.needsPractice;
      }

      return right.practiced - left.practiced;
    })
    .slice(0, limit)
    .map(([word, stats]) => ({
      detail: `${stats.practiced}x geoefend, ${stats.recognized}x herkend, ${stats.hintsUsed} hints, ${stats.audioRepeats} herhalingen`,
      label: word,
      status: getVoiceSideScrollerWordStatus({
        hintsUsed: stats.hintsUsed,
        needsPractice: stats.needsPractice,
        recognized: stats.recognized,
      }),
    }));
};

export const getVoiceSideScrollerObservationStats = (
  attempts: VoiceSideScrollerPracticeEvent[],
) => {
  const targetStats = getVoiceSideScrollerTargetStats(attempts);

  return {
    audioRepeats: targetStats.reduce((sum, target) => sum + target.audioRepeats, 0),
    hintsUsed: targetStats.reduce((sum, target) => sum + target.hintsUsed, 0),
    practicedWords: new Set(targetStats.map((target) => target.targetWord)).size,
    recognized: targetStats.filter((target) => target.recognized).length,
    spokenAttempts: targetStats.reduce((sum, target) => sum + target.wordAttempts, 0),
    totalAttempts: attempts.length,
  };
};

export const countTodayAttempts = (attempts: BezemEscapePracticeEvent[]) => {
  const currentDay = todayKey();

  return attempts.filter((attempt) => attempt.playedAt.slice(0, 10) === currentDay);
};

export const buildShareSummary = ({
  profileName,
  rows,
  selfMadeSentences,
  selfMadeSentencesWithHelp,
  selfMadeSentencesWithoutHelp,
  todayAttempts,
  totalSpeed,
  totalWordStars,
  voiceSideScrollerAttempts,
  voiceSideScrollerRows,
}: {
  profileName: string;
  rows: DashboardRow[];
  selfMadeSentences: number;
  selfMadeSentencesWithHelp: number;
  selfMadeSentencesWithoutHelp: number;
  todayAttempts: BezemEscapePracticeEvent[];
  totalSpeed: number;
  totalWordStars: number;
  voiceSideScrollerAttempts?: VoiceSideScrollerPracticeEvent[];
  voiceSideScrollerRows?: DashboardRow[];
}) => {
  const goodRows = rows.filter((row) => row.status === "gaat-goed").slice(0, 5);
  const practiceRows = rows
    .filter((row) => row.status === "nog-moeilijk" || row.status === "oefenen")
    .slice(0, 5);
  const voiceStats = getVoiceSideScrollerObservationStats(voiceSideScrollerAttempts ?? []);
  const difficultVoiceRows = (voiceSideScrollerRows ?? [])
    .filter((row) => row.status === "nog-moeilijk" || row.status === "oefenen")
    .slice(0, 3);

  return [
    `Oefensamenvatting - +1 Woordenschat Bezem Escape`,
    `Kind: ${profileName}`,
    `Vandaag: ${todayAttempts.length} oefenmomenten`,
    `Speed totaal: ${totalSpeed}`,
    `Woordsterren totaal: ${totalWordStars}`,
    `Zelf gemaakte zinnen: ${selfMadeSentences}`,
    `Zonder hulp: ${selfMadeSentencesWithoutHelp}`,
    `Met hulp: ${selfMadeSentencesWithHelp}`,
    "",
    "Zeg & Vlieg:",
    ...(voiceStats.totalAttempts > 0
      ? [
          `- Woorden geoefend: ${voiceStats.practicedWords}`,
          `- Woordpogingen: ${voiceStats.spokenAttempts}`,
          `- Herkend: ${voiceStats.recognized}`,
          `- Hints: ${voiceStats.hintsUsed}`,
          `- Audioherhalingen: ${voiceStats.audioRepeats}`,
        ]
      : ["- Nog geen Zeg & Vlieg-ronde opgeslagen"]),
    ...(difficultVoiceRows.length > 0
      ? ["- Extra oefenen: " + difficultVoiceRows.map((row) => row.label).join(", ")]
      : []),
    "",
    "Gaat goed:",
    ...(goodRows.length > 0
      ? goodRows.map((row) => `- ${row.label}: ${row.detail}`)
      : ["- Nog opbouwen"]),
    "",
    "Extra oefenen:",
    ...(practiceRows.length > 0
      ? practiceRows.map((row) => `- ${row.label}: ${row.detail}`)
      : ["- Geen duidelijk oefenpunt"]),
    "",
    "Let op: dit is oefenobservatie, geen diagnose of officiele testscore.",
  ].join("\n");
};

export const getSectionStatus = (rows: DashboardRow[]): ObservationStatus => {
  if (rows.some((row) => row.status === "nog-moeilijk")) {
    return "nog-moeilijk";
  }

  if (rows.some((row) => row.status === "met-hulp")) {
    return "met-hulp";
  }

  if (rows.some((row) => row.status === "oefenen")) {
    return "oefenen";
  }

  if (rows.some((row) => row.status === "gaat-goed")) {
    return "gaat-goed";
  }

  return "oefenen";
};

const countDifficultRows = (rows: DashboardRow[]) =>
  rows.filter((row) => row.status === "nog-moeilijk" || row.status === "oefenen").length;

const formatCountLabel = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

export const getRowsSummary = (
  rows: DashboardRow[],
  nounSingular: string,
  nounPlural: string,
) => {
  const difficultCount = countDifficultRows(rows);

  if (rows.length === 0) {
    return `0 ${nounPlural} · nog opbouwen`;
  }

  if (difficultCount > 0) {
    return `${formatCountLabel(rows.length, nounSingular, nounPlural)} · ${difficultCount} moeilijk`;
  }

  return `${formatCountLabel(rows.length, nounSingular, nounPlural)} · gaat goed`;
};
