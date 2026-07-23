import { useState } from "react";
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
import { useStorageRepositories } from "../../storage";
import { useProfileProgressQuery } from "./useProfileProgressQuery";

export const ProgressScreen = () => {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();
  const { repositories } = useStorageRepositories();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("month");
  const { refresh, state } = useProfileProgressQuery(currentProfile?.id, repositories);

  useRequireProfile(currentProfile, navigate);

  if (!currentProfile) {
    return null;
  }

  const events = state.status === "ready" ? state.events : [];
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

          {state.status === "loading" ? <p role="status">Voortgang laden…</p> : null}
          {state.status === "rebuilding" ? (
            <p role="status">Voortgang opnieuw berekenen uit oefenpogingen…</p>
          ) : null}
          {state.status === "error" ? (
            <div className="rounded-xl bg-red-700 p-4 text-white" role="alert">
              <p>{state.error.message}</p>
              <button className="min-h-12 underline" onClick={refresh} type="button">
                Opnieuw proberen
              </button>
            </div>
          ) : null}
          {state.status === "ready" && state.events.length === 0 ? (
            <p className="rounded-xl bg-slate-800 p-4 text-white">
              Nog geen oefeningen geregistreerd voor dit profiel.
            </p>
          ) : null}
          {state.status === "ready" &&
          state.events.length === 0 &&
          state.projections.some((projection) => projection.attempts > 0) ? (
            <p className="mt-3 rounded-xl border border-amber-300 bg-amber-950 p-4 text-amber-100">
              Er bestaat een samenvatting uit een oudere appversie, maar de onderliggende
              oefenpogingen ontbreken. Daarom tonen we daar geen nieuwe percentages voor.
            </p>
          ) : null}

          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <ActivityChartCard delay={0.05} events={events} selectedPeriod={selectedPeriod} />

            <AchievementsCard delay={0.1} events={events} />

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
              eventCount={events.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ProgressScreen.displayName = "ProgressScreen";
