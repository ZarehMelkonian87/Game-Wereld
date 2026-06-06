import { useMemo, useState } from "react";
import { useProfile } from "../../../contexts/ProfileContext";
import { readBezemEscapeProgress } from "../logic/progress";
import {
  buildDashboardViewModel,
  buildShareSummary,
  CompactStatsStrip,
  CopySummaryButton,
  countTodayAttempts,
  getVoiceSideScrollerAttempts,
  PracticeAccordion,
  PracticeOverviewHeader,
  TodayPracticeCard,
} from "./parent-dashboard";

interface ParentDashboardScreenProps {
  onBackToMenu?: () => void;
}

export const ParentDashboardScreen = ({ onBackToMenu }: ParentDashboardScreenProps) => {
  const { currentProfile } = useProfile();
  const profileId = currentProfile?.id ?? "demo-profile";
  const profileName = currentProfile?.name ?? "Demo";
  const [copyFeedback, setCopyFeedback] = useState("");
  const [openSectionIds, setOpenSectionIds] = useState<Record<string, boolean>>({});
  const progress = readBezemEscapeProgress(profileId);
  const todayAttempts = useMemo(() => countTodayAttempts(progress.attempts), [progress.attempts]);
  const voiceSideScrollerAttempts = useMemo(
    () => getVoiceSideScrollerAttempts(progress.attempts),
    [progress.attempts],
  );
  const dashboardViewModel = useMemo(
    () => buildDashboardViewModel({ progress, todayAttempts }),
    [progress, todayAttempts],
  );
  const shareSummary = useMemo(
    () =>
      buildShareSummary({
        profileName,
        rows: dashboardViewModel.allRows,
        selfMadeSentences: progress.selfMadeSentences,
        selfMadeSentencesWithHelp: progress.selfMadeSentencesWithHelp,
        selfMadeSentencesWithoutHelp: progress.selfMadeSentencesWithoutHelp,
        todayAttempts,
        totalSpeed: progress.totalSpeed,
        totalWordStars: progress.totalWordStars,
        voiceSideScrollerAttempts,
        voiceSideScrollerRows: dashboardViewModel.accordionSections.find(
          (section) => section.id === "zeg-en-vlieg",
        )?.rows,
      }),
    [
      dashboardViewModel.allRows,
      dashboardViewModel.accordionSections,
      profileName,
      progress.selfMadeSentences,
      progress.selfMadeSentencesWithHelp,
      progress.selfMadeSentencesWithoutHelp,
      progress.totalSpeed,
      progress.totalWordStars,
      todayAttempts,
      voiceSideScrollerAttempts,
    ],
  );

  const toggleSection = (sectionId: string) => {
    setOpenSectionIds((currentSectionIds) => ({
      ...currentSectionIds,
      [sectionId]: !currentSectionIds[sectionId],
    }));
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(shareSummary);
      setCopyFeedback("Samenvatting gekopieerd.");
    } catch {
      setCopyFeedback("Kopieren lukt niet in deze browser.");
    }
  };

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-10 overflow-y-auto overflow-x-hidden px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)]"
      data-attempt-count={progress.attempts.length}
      data-profile-id={profileId}
      data-testid="parent-dashboard-screen"
      data-today-attempt-count={todayAttempts.length}
    >
      <div className="mx-auto flex min-h-full max-w-md flex-col gap-2.5">
        <PracticeOverviewHeader
          copyFeedback={copyFeedback}
          onBackToMenu={onBackToMenu}
          onCopySummary={handleCopySummary}
        />
        <CompactStatsStrip stats={dashboardViewModel.dashboardStats} />
        <CopySummaryButton onCopySummary={handleCopySummary} />
        <TodayPracticeCard row={dashboardViewModel.todayRow} />

        <div className="grid gap-2" data-component="PracticeAccordionList">
          {dashboardViewModel.accordionSections.map((section) => (
            <PracticeAccordion
              isOpen={openSectionIds[section.id] === true}
              key={section.id}
              onToggle={() => toggleSection(section.id)}
              section={section}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

ParentDashboardScreen.displayName = "ParentDashboardScreen";
