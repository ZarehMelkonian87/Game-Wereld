import type { BezemEscapePracticeEvent, ConceptProgress } from "../../types";
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
}: {
  profileName: string;
  rows: DashboardRow[];
  selfMadeSentences: number;
  selfMadeSentencesWithHelp: number;
  selfMadeSentencesWithoutHelp: number;
  todayAttempts: BezemEscapePracticeEvent[];
  totalSpeed: number;
  totalWordStars: number;
}) => {
  const goodRows = rows.filter((row) => row.status === "gaat-goed").slice(0, 5);
  const practiceRows = rows
    .filter((row) => row.status === "nog-moeilijk" || row.status === "oefenen")
    .slice(0, 5);

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
