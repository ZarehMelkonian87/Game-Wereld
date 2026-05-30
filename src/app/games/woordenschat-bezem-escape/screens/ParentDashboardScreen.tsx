import { ClipboardList, Download, Lightbulb, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { PanelCard, PrimaryActionButton, RibbonTitle } from "../components/ui";
import { classNames } from "../components/ui/classNames";
import { readBezemEscapeProgress } from "../logic/progress";
import type { BezemEscapePracticeEvent, ConceptProgress } from "../types";
import { useProfile } from "../../../contexts/ProfileContext";

type ObservationStatus = "gaat-goed" | "met-hulp" | "nog-moeilijk" | "oefenen";

interface DashboardRow {
  detail: string;
  label: string;
  status: ObservationStatus;
}

const statusLabels: Record<ObservationStatus, string> = {
  "gaat-goed": "Gaat goed",
  "met-hulp": "Met hulp",
  "nog-moeilijk": "Nog moeilijk",
  oefenen: "Oefenen",
};

const statusClasses: Record<ObservationStatus, string> = {
  "gaat-goed": "border-emerald-300 bg-emerald-100 text-emerald-950",
  "met-hulp": "border-sky-300 bg-sky-100 text-sky-950",
  "nog-moeilijk": "border-amber-300 bg-amber-100 text-amber-950",
  oefenen: "border-violet-300 bg-violet-100 text-violet-950",
};

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getStatusFromConcept(progress: ConceptProgress | undefined): ObservationStatus {
  if (!progress || progress.practiced === 0) {
    return "oefenen";
  }

  if (progress.needsPractice > 0 && progress.needsPractice >= progress.correctWithoutHelp) {
    return "nog-moeilijk";
  }

  if (progress.correctWithHelp > progress.correctWithoutHelp) {
    return "met-hulp";
  }

  if (progress.correctWithoutHelp >= Math.max(1, progress.correctWithHelp + progress.needsPractice)) {
    return "gaat-goed";
  }

  return "oefenen";
}

function getWordStatus(params: {
  activeCount: number;
  practicedCount: number;
  recognizedCount: number;
}) {
  if (params.practicedCount === 0) {
    return "oefenen" as const;
  }

  if (params.recognizedCount > 0 && params.activeCount > 0) {
    return "gaat-goed" as const;
  }

  if (params.recognizedCount > 0) {
    return "met-hulp" as const;
  }

  return "nog-moeilijk" as const;
}

function StatusBadge({ status }: { status: ObservationStatus }) {
  return (
    <span
      className={classNames(
        "inline-flex min-h-8 shrink-0 items-center rounded-2xl border-2 px-2 text-[0.7rem] font-black leading-none",
        statusClasses[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

function DashboardSection({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <PanelCard className="min-w-0 !rounded-2xl !p-3">
      <div className="mb-2 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700"
        >
          {icon}
        </span>
        <h2 className="min-w-0 flex-1 truncate text-sm font-black leading-tight text-slate-900">
          {title}
        </h2>
      </div>
      {children}
    </PanelCard>
  );
}

function RowList({ rows }: { rows: DashboardRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-slate-200 bg-white/75 p-2 text-xs font-black leading-tight text-slate-700">
        Nog geen oefendata voor dit onderdeel.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          className="grid min-h-12 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border-2 border-white/80 bg-white/75 p-2"
          key={`${row.label}-${row.detail}`}
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-black leading-tight text-slate-900">{row.label}</p>
            <p className="mt-0.5 truncate text-[0.68rem] font-bold leading-tight text-slate-600">
              {row.detail}
            </p>
          </div>
          <StatusBadge status={row.status} />
        </div>
      ))}
    </div>
  );
}

function getRowsFromConcepts(concepts: Record<string, ConceptProgress>, limit = 6) {
  return Object.entries(concepts)
    .filter(([, progress]) => progress.practiced > 0)
    .sort(([, a], [, b]) => b.practiced - a.practiced)
    .slice(0, limit)
    .map(([label, progress]) => ({
      detail: `${progress.practiced} geoefend, ${progress.needsPractice} oefenen`,
      label,
      status: getStatusFromConcept(progress),
    }));
}

function getRowsFromWords(params: {
  activeWords: Record<string, number>;
  practicedWords: Record<string, number>;
  recognizedWords: Record<string, number>;
}) {
  return Object.entries(params.practicedWords)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([word, practicedCount]) => {
      const recognizedCount = params.recognizedWords[word] ?? 0;
      const activeCount = params.activeWords[word] ?? 0;

      return {
        detail: `${practicedCount}x geoefend, ${recognizedCount}x herkend, ${activeCount}x benoemd`,
        label: word,
        status: getWordStatus({ activeCount, practicedCount, recognizedCount }),
      };
    });
}

function countTodayAttempts(attempts: BezemEscapePracticeEvent[]) {
  const currentDay = todayKey();
  return attempts.filter((attempt) => attempt.playedAt.slice(0, 10) === currentDay);
}

function buildShareSummary(params: {
  profileName: string;
  rows: DashboardRow[];
  todayAttempts: BezemEscapePracticeEvent[];
  totalSpeed: number;
  totalWordStars: number;
}) {
  const goodRows = params.rows.filter((row) => row.status === "gaat-goed").slice(0, 5);
  const practiceRows = params.rows
    .filter((row) => row.status === "nog-moeilijk" || row.status === "oefenen")
    .slice(0, 5);

  return [
    `Oefensamenvatting - +1 Woordenschat Bezem Escape`,
    `Kind: ${params.profileName}`,
    `Vandaag: ${params.todayAttempts.length} oefenmomenten`,
    `Speed totaal: ${params.totalSpeed}`,
    `Woordsterren totaal: ${params.totalWordStars}`,
    "",
    "Gaat goed:",
    ...(goodRows.length > 0 ? goodRows.map((row) => `- ${row.label}: ${row.detail}`) : ["- Nog opbouwen"]),
    "",
    "Extra oefenen:",
    ...(practiceRows.length > 0
      ? practiceRows.map((row) => `- ${row.label}: ${row.detail}`)
      : ["- Geen duidelijk oefenpunt"]),
    "",
    "Let op: dit is oefenobservatie, geen diagnose of officiele testscore.",
  ].join("\n");
}

export function ParentDashboardScreen() {
  const { currentProfile } = useProfile();
  const profileId = currentProfile?.id ?? "demo-profile";
  const profileName = currentProfile?.name ?? "Demo";
  const [copyFeedback, setCopyFeedback] = useState("");
  const progress = readBezemEscapeProgress(profileId);
  const todayAttempts = useMemo(() => countTodayAttempts(progress.attempts), [progress.attempts]);
  const wordRows = useMemo(
    () =>
      getRowsFromWords({
        activeWords: progress.activelyNamedWords,
        practicedWords: progress.practicedWords,
        recognizedWords: progress.recognizedWords,
      }),
    [progress.activelyNamedWords, progress.practicedWords, progress.recognizedWords],
  );
  const conceptRows = useMemo(
    () => getRowsFromConcepts(progress.spatialConcepts),
    [progress.spatialConcepts],
  );
  const sentenceUnderstandingRows = [
    {
      detail: `${progress.languageDomains["sentence-comprehension"].practiced} opdrachten`,
      label: "Zinnen begrijpen",
      status: getStatusFromConcept(progress.languageDomains["sentence-comprehension"]),
    },
  ];
  const activeVocabularyRows = [
    {
      detail: `${Object.values(progress.activelyNamedWords).reduce((sum, count) => sum + count, 0)} benoemingen`,
      label: "Actieve woordenschat",
      status: getStatusFromConcept(progress.languageDomains["active-vocabulary"]),
    },
  ];
  const sentenceRepeatRows = [
    {
      detail: `${progress.languageDomains["sentence-repetition"].practiced} pogingen`,
      label: "Zinnen nazeggen",
      status: getStatusFromConcept(progress.languageDomains["sentence-repetition"]),
    },
  ];
  const directionsRows = [
    {
      detail: `${progress.languageDomains["following-directions"].practiced} opdrachten`,
      label: "Aanwijzingen volgen",
      status: getStatusFromConcept(progress.languageDomains["following-directions"]),
    },
  ];
  const categoryRows = [
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
    ...sentenceRepeatRows,
    ...directionsRows,
    ...categoryRows,
  ];
  const nextPractice = allRows
    .filter((row) => row.status === "nog-moeilijk" || row.status === "oefenen")
    .slice(0, 3);
  const shareSummary = buildShareSummary({
    profileName,
    rows: allRows,
    todayAttempts,
    totalSpeed: progress.totalSpeed,
    totalWordStars: progress.totalWordStars,
  });

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(shareSummary);
      setCopyFeedback("Samenvatting gekopieerd.");
    } catch {
      setCopyFeedback("Kopieren lukt niet in deze browser.");
    }
  }

  return (
    <div
      data-testid="parent-dashboard-screen"
      data-attempt-count={progress.attempts.length}
      data-profile-id={profileId}
      data-today-attempt-count={todayAttempts.length}
      className="pointer-events-auto absolute inset-0 z-10 overflow-y-auto px-3 pb-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]"
    >
      <div className="mx-auto flex min-h-full max-w-3xl flex-col gap-3">
        <div className="text-center">
          <RibbonTitle data-testid="dashboard-title">Oefenoverzicht</RibbonTitle>
          <p className="mx-auto mt-2 max-w-md rounded-2xl border-2 border-white/80 bg-white/75 px-3 py-2 text-xs font-black leading-tight text-slate-800">
            Oefenobservatie voor thuis en logopedie. Geen diagnose en geen officiele testscore.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <PanelCard className="!rounded-2xl !p-2 text-center">
            <p className="text-[0.65rem] font-black uppercase leading-none text-slate-600">
              Vandaag
            </p>
            <p className="mt-1 text-lg font-black leading-none text-slate-900">
              {todayAttempts.length}
            </p>
          </PanelCard>
          <PanelCard className="!rounded-2xl !p-2 text-center">
            <p className="text-[0.65rem] font-black uppercase leading-none text-slate-600">
              Speed
            </p>
            <p className="mt-1 text-lg font-black leading-none text-slate-900">
              {progress.totalSpeed}
            </p>
          </PanelCard>
          <PanelCard className="!rounded-2xl !p-2 text-center">
            <p className="text-[0.65rem] font-black uppercase leading-none text-slate-600">
              Sterren
            </p>
            <p className="mt-1 text-lg font-black leading-none text-slate-900">
              {progress.totalWordStars}
            </p>
          </PanelCard>
        </div>

        <div className="grid gap-3 landscape:grid-cols-2">
          <DashboardSection
            icon={<ClipboardList className="h-5 w-5" strokeWidth={3} />}
            title="Vandaag geoefend"
          >
            <RowList
              rows={[
                {
                  detail: `${todayAttempts.length} events, ${todayAttempts.reduce((sum, attempt) => sum + attempt.hintsUsed, 0)} hints`,
                  label: "Vandaag",
                  status: todayAttempts.length > 0 ? "gaat-goed" : "oefenen",
                },
              ]}
            />
          </DashboardSection>

          <DashboardSection
            icon={<TrendingUp className="h-5 w-5" strokeWidth={3} />}
            title="Woordenlijst"
          >
            <RowList rows={wordRows} />
          </DashboardSection>

          <DashboardSection
            icon={<Lightbulb className="h-5 w-5" strokeWidth={3} />}
            title="Plaatsbegrippen"
          >
            <RowList rows={conceptRows} />
          </DashboardSection>

          <DashboardSection
            icon={<ClipboardList className="h-5 w-5" strokeWidth={3} />}
            title="Zinnen begrijpen"
          >
            <RowList rows={sentenceUnderstandingRows} />
          </DashboardSection>

          <DashboardSection
            icon={<TrendingUp className="h-5 w-5" strokeWidth={3} />}
            title="Actieve woordenschat"
          >
            <RowList rows={activeVocabularyRows} />
          </DashboardSection>

          <DashboardSection
            icon={<ClipboardList className="h-5 w-5" strokeWidth={3} />}
            title="Zinnen nazeggen"
          >
            <RowList rows={sentenceRepeatRows} />
          </DashboardSection>

          <DashboardSection
            icon={<Lightbulb className="h-5 w-5" strokeWidth={3} />}
            title="Aanwijzingen volgen"
          >
            <RowList rows={directionsRows} />
          </DashboardSection>

          <DashboardSection
            icon={<ClipboardList className="h-5 w-5" strokeWidth={3} />}
            title="Categorieen"
          >
            <RowList rows={categoryRows} />
          </DashboardSection>

          <DashboardSection
            icon={<Lightbulb className="h-5 w-5" strokeWidth={3} />}
            title="Volgende oefening"
          >
            <RowList
              rows={
                nextPractice.length > 0
                  ? nextPractice
                  : [
                      {
                        detail: "Blijf korte strandopdrachten herhalen.",
                        label: "Onderhouden",
                        status: "gaat-goed",
                      },
                    ]
              }
            />
          </DashboardSection>

          <DashboardSection
            icon={<Download className="h-5 w-5" strokeWidth={3} />}
            title="Delen met ouder/logopedist"
          >
            <PrimaryActionButton
              className="w-full text-sm"
              data-testid="dashboard-copy-summary-button"
              iconLeft={<Download className="h-5 w-5" strokeWidth={3} />}
              onClick={handleCopySummary}
            >
              Kopieer samenvatting
            </PrimaryActionButton>
            <p
              className="mt-2 min-h-5 text-xs font-black leading-tight text-slate-700"
              data-testid="dashboard-copy-feedback"
            >
              {copyFeedback}
            </p>
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}
