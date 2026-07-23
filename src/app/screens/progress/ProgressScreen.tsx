import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useProfile } from "../../contexts/ProfileContext";
import { gameThemes } from "../../data/games";
import { useRequireProfile } from "../shared";
import { OverallSummaryCard } from "./OverallSummaryCard";
import { PeriodSelector } from "./PeriodSelector";
import { ProgressHeader } from "./ProgressHeader";
import { getProgressData, periods } from "./progressData";
import { ThemeProgressCard } from "./ThemeProgressCard";
import { ActivityChartCard } from "./ActivityChartCard";
import { AchievementsCard } from "./AchievementsCard";
import type { TimePeriod } from "./progressTypes";
import { createGameId, createProfileId } from "../../game-platform";
import {
  useStorageRepositories,
  type PracticeEventEnvelope,
  type StorageApplicationError,
} from "../../storage";

export const ProgressScreen = () => {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();
  const { repositories } = useStorageRepositories();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("month");
  const [events, setEvents] = useState<PracticeEventEnvelope[]>([]);
  const [loadError, setLoadError] = useState<StorageApplicationError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useRequireProfile(currentProfile, navigate);

  useEffect(() => {
    if (!currentProfile) return;
    setIsLoading(true);
    void repositories.practice
      .listForProfile(createProfileId(currentProfile.id), createGameId("strand-bezem-escape"))
      .then((records) => {
        setEvents(records);
        setLoadError(null);
      })
      .catch((error: StorageApplicationError) => setLoadError(error))
      .finally(() => setIsLoading(false));
  }, [currentProfile, repositories.practice]);

  if (!currentProfile) {
    return null;
  }

  const progressData = getProgressData(selectedPeriod, events);

  return (
    <div className="min-h-screen flex flex-col safe-area-inset" data-component="ProgressScreen">
      <ProgressHeader onBack={() => navigate("/home")} profile={currentProfile} />

      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto pb-6">
          <PeriodSelector
            onSelectPeriod={setSelectedPeriod}
            periods={periods}
            selectedPeriod={selectedPeriod}
          />

          {isLoading ? <p role="status">Voortgang laden…</p> : null}
          {loadError ? (
            <p className="rounded-xl bg-red-700 p-4 text-white" role="alert">
              {loadError.message}
            </p>
          ) : null}

          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <ActivityChartCard delay={0.05} selectedPeriod={selectedPeriod} />

            <AchievementsCard delay={0.1} profile={currentProfile} />

            {progressData.map((themeData, index) => {
              const theme = gameThemes.find((candidate) => candidate.id === themeData.themeId);

              if (!theme) {
                return null;
              }

              return (
                <ThemeProgressCard
                  index={index}
                  key={theme.id}
                  selectedPeriod={selectedPeriod}
                  theme={theme}
                  themeData={themeData}
                />
              );
            })}

            <OverallSummaryCard
              childName={currentProfile.name}
              delay={(progressData.length + 2) * 0.05}
              selectedPeriod={selectedPeriod}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ProgressScreen.displayName = "ProgressScreen";
