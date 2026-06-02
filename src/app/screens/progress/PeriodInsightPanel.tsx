import { TrendingUp, Zap } from "lucide-react";
import type { PeriodDefinition, ThemeProgress, TimePeriod } from "./progressTypes";

interface PeriodInsightPanelProps {
  periods: PeriodDefinition[];
  selectedPeriod: TimePeriod;
  themeData: ThemeProgress;
}

export const PeriodInsightPanel = ({
  periods,
  selectedPeriod,
  themeData,
}: PeriodInsightPanelProps) => (
  <div
    className="bg-slate-900/30 rounded-xl p-3 sm:p-4 border-2 border-slate-600"
    data-component="PeriodInsightPanel"
  >
    <div className="flex items-center gap-2 mb-3 sm:mb-4">
      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
      <h3 className="text-base sm:text-lg md:text-xl text-white font-black">
        {periods.find((period) => period.id === selectedPeriod)?.label}
      </h3>
    </div>

    {themeData.periodProgress.strengths.length > 0 ? (
      <div className="mb-3">
        <div className="space-y-2">
          {themeData.periodProgress.strengths.map((strength) => (
            <div
              className="flex items-start gap-2 text-xs sm:text-sm text-green-300 font-semibold"
              key={strength}
            >
              <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{strength}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null}

    {themeData.periodProgress.challenges.length > 0 ? (
      <div className="space-y-2">
        {themeData.periodProgress.challenges.map((challenge) => (
          <div
            className="flex items-start gap-2 text-xs sm:text-sm text-orange-300 font-semibold"
            key={challenge}
          >
            <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{challenge}</span>
          </div>
        ))}
      </div>
    ) : null}
  </div>
);

PeriodInsightPanel.displayName = "PeriodInsightPanel";
