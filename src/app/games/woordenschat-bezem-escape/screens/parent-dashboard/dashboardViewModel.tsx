import { ClipboardList, Lightbulb, TrendingUp } from "lucide-react";
import type { BezemEscapePracticeEvent, BezemEscapeProgress } from "../../types";
import {
  getRowsFromActiveSpatialConcepts,
  getRowsFromConcepts,
  getRowsFromWords,
  getRowsSummary,
  getSectionStatus,
  getStatusFromConcept,
} from "./dashboardCalculations";
import { compactStatusLabels } from "./statusDisplay";
import type { DashboardAccordionSection, DashboardRow, DashboardStat } from "./types";

interface BuildDashboardViewModelParams {
  progress: BezemEscapeProgress;
  todayAttempts: BezemEscapePracticeEvent[];
}

export interface DashboardViewModel {
  accordionSections: DashboardAccordionSection[];
  allRows: DashboardRow[];
  dashboardStats: DashboardStat[];
  todayRow: DashboardRow;
}

export const buildDashboardViewModel = ({
  progress,
  todayAttempts,
}: BuildDashboardViewModelParams): DashboardViewModel => {
  const wordRows = getRowsFromWords({
    activeWords: progress.activelyNamedWords,
    practicedWords: progress.practicedWords,
    recognizedWords: progress.recognizedWords,
  });
  const conceptRows = getRowsFromConcepts(progress.spatialConcepts);
  const sentenceUnderstandingRows: DashboardRow[] = [
    {
      detail: `${progress.languageDomains["sentence-comprehension"].practiced} opdrachten`,
      label: "Zinnen begrijpen",
      status: getStatusFromConcept(progress.languageDomains["sentence-comprehension"]),
    },
  ];
  const activeVocabularyRows: DashboardRow[] = [
    {
      detail: `${Object.values(progress.activelyNamedWords).reduce((sum, count) => sum + count, 0)} benoemingen`,
      label: "Actieve woordenschat",
      status: getStatusFromConcept(progress.languageDomains["active-vocabulary"]),
    },
  ];
  const speakAndPlaceRows: DashboardRow[] = [
    {
      detail: `${progress.selfMadeSentences} zinnen, ${progress.autoExecutedSpokenCommands} automatisch geplaatst`,
      label: "Zelf gemaakte zinnen",
      status:
        progress.selfMadeSentencesWithoutHelp > 0
          ? "gaat-goed"
          : progress.selfMadeSentencesWithHelp > 0
            ? "met-hulp"
            : "oefenen",
    },
    {
      detail: `${progress.selfMadeSentencesWithoutHelp} zonder hulp, ${progress.selfMadeSentencesWithHelp} met hulp`,
      label: "Zinnen zonder/met hulp",
      status:
        progress.selfMadeSentencesWithoutHelp > 0
          ? "gaat-goed"
          : progress.selfMadeSentencesWithHelp > 0
            ? "met-hulp"
            : "oefenen",
    },
    {
      detail: `${progress.misunderstoodSpeechAttempts} keer niet verstaan of opnieuw geprobeerd`,
      label: "Niet verstaan / opnieuw",
      status:
        progress.misunderstoodSpeechAttempts > progress.selfMadeSentences
          ? "oefenen"
          : progress.misunderstoodSpeechAttempts > 0
            ? "met-hulp"
            : "gaat-goed",
    },
  ];
  const activeSpatialConceptRows = getRowsFromActiveSpatialConcepts(progress.activeSpatialConcepts);
  const sentenceRepeatRows: DashboardRow[] = [
    {
      detail: `${progress.languageDomains["sentence-repetition"].practiced} pogingen`,
      label: "Zinnen nazeggen",
      status: getStatusFromConcept(progress.languageDomains["sentence-repetition"]),
    },
  ];
  const directionsRows: DashboardRow[] = [
    {
      detail: `${progress.languageDomains["following-directions"].practiced} opdrachten`,
      label: "Aanwijzingen volgen",
      status: getStatusFromConcept(progress.languageDomains["following-directions"]),
    },
  ];
  const categoryRows: DashboardRow[] = [
    {
      detail: `${progress.languageDomains["word-categories"].practiced} opdrachten`,
      label: "Woordcategorieen",
      status: getStatusFromConcept(progress.languageDomains["word-categories"]),
    },
  ];
  const allRows = [
    ...wordRows,
    ...conceptRows,
    ...sentenceUnderstandingRows,
    ...activeVocabularyRows,
    ...speakAndPlaceRows,
    ...activeSpatialConceptRows,
    ...sentenceRepeatRows,
    ...directionsRows,
    ...categoryRows,
  ];
  const nextPractice = allRows
    .filter((row) => row.status === "nog-moeilijk" || row.status === "oefenen")
    .slice(0, 3);
  const nextPracticeRows =
    nextPractice.length > 0
      ? nextPractice
      : [
          {
            detail: "Blijf korte strandopdrachten herhalen.",
            label: "Onderhouden",
            status: "gaat-goed" as const,
          },
        ];
  const todayRow: DashboardRow = {
    detail: `${todayAttempts.length} events, ${todayAttempts.reduce((sum, attempt) => sum + attempt.hintsUsed, 0)} hints`,
    label: "Vandaag",
    status: todayAttempts.length > 0 ? "gaat-goed" : "oefenen",
  };
  const dashboardStats: DashboardStat[] = [
    { label: "Vandaag", value: todayAttempts.length },
    { label: "Speed", value: progress.totalSpeed },
    { label: "Sterren", value: progress.totalWordStars },
  ];
  const accordionSections: DashboardAccordionSection[] = [
    {
      icon: <TrendingUp className="h-5 w-5" strokeWidth={3} />,
      id: "words",
      rows: wordRows,
      status: getSectionStatus(wordRows),
      summary: getRowsSummary(wordRows, "woord", "woorden"),
      title: "Woordenlijst",
    },
    {
      icon: <Lightbulb className="h-5 w-5" strokeWidth={3} />,
      id: "spatial-concepts",
      rows: conceptRows,
      status: getSectionStatus(conceptRows),
      summary: getRowsSummary(conceptRows, "begrip", "begrippen"),
      title: "Plaatsbegrippen",
    },
    {
      icon: <ClipboardList className="h-5 w-5" strokeWidth={3} />,
      id: "sentence-understanding",
      rows: sentenceUnderstandingRows,
      status: getSectionStatus(sentenceUnderstandingRows),
      summary: getRowsSummary(sentenceUnderstandingRows, "onderdeel", "onderdelen"),
      title: "Zinnen begrijpen",
    },
    {
      icon: <TrendingUp className="h-5 w-5" strokeWidth={3} />,
      id: "active-vocabulary",
      rows: activeVocabularyRows,
      status: getSectionStatus(activeVocabularyRows),
      summary: getRowsSummary(activeVocabularyRows, "onderdeel", "onderdelen"),
      title: "Actieve woordenschat",
    },
    {
      icon: <ClipboardList className="h-5 w-5" strokeWidth={3} />,
      id: "self-made-sentences",
      rows: speakAndPlaceRows,
      status: getSectionStatus(speakAndPlaceRows),
      summary: `${progress.selfMadeSentences} zin${progress.selfMadeSentences === 1 ? "" : "nen"} · ${compactStatusLabels[getSectionStatus(speakAndPlaceRows)].toLowerCase()}`,
      title: "Zelf gemaakte zinnen",
    },
    {
      icon: <Lightbulb className="h-5 w-5" strokeWidth={3} />,
      id: "active-spatial-words",
      rows: activeSpatialConceptRows,
      status: getSectionStatus(activeSpatialConceptRows),
      summary: getRowsSummary(activeSpatialConceptRows, "plaatswoord", "plaatswoorden"),
      title: "Gebruikte plaatswoorden",
    },
    {
      icon: <ClipboardList className="h-5 w-5" strokeWidth={3} />,
      id: "sentence-repeat",
      rows: sentenceRepeatRows,
      status: getSectionStatus(sentenceRepeatRows),
      summary: getRowsSummary(sentenceRepeatRows, "onderdeel", "onderdelen"),
      title: "Zinnen nazeggen",
    },
    {
      icon: <Lightbulb className="h-5 w-5" strokeWidth={3} />,
      id: "directions",
      rows: directionsRows,
      status: getSectionStatus(directionsRows),
      summary: getRowsSummary(directionsRows, "onderdeel", "onderdelen"),
      title: "Aanwijzingen volgen",
    },
    {
      icon: <ClipboardList className="h-5 w-5" strokeWidth={3} />,
      id: "categories",
      rows: categoryRows,
      status: getSectionStatus(categoryRows),
      summary: getRowsSummary(categoryRows, "onderdeel", "onderdelen"),
      title: "Categorieen",
    },
    {
      icon: <Lightbulb className="h-5 w-5" strokeWidth={3} />,
      id: "next-practice",
      rows: nextPracticeRows,
      status: getSectionStatus(nextPracticeRows),
      summary: `${nextPracticeRows.length} aanbevolen onderdelen`,
      title: "Volgende oefening",
    },
  ];

  return {
    accordionSections,
    allRows,
    dashboardStats,
    todayRow,
  };
};
