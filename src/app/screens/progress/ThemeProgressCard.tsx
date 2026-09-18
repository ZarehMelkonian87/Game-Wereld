import { motion } from "motion/react";
import type { GameTheme } from "../../data/games";
import { PeriodInsightPanel } from "./PeriodInsightPanel";
import { periods } from "./progressData";
import { SkillProgressRow } from "./SkillProgressRow";
import type { ThemeProgress, TimePeriod } from "./progressTypes";

interface ThemeProgressCardProps {
  index: number;
  selectedPeriod: TimePeriod;
  theme: GameTheme;
  themeData: ThemeProgress;
}

export const ThemeProgressCard = ({
  index,
  selectedPeriod,
  theme,
  themeData,
}: ThemeProgressCardProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 border-3 sm:border-4 border-slate-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
    data-component="ThemeProgressCard"
    initial={{ opacity: 0, y: 20 }}
    transition={{ delay: index * 0.1 }}
  >
    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
      <div
        className={`bg-gradient-to-br ${theme.color} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-3xl sm:text-4xl md:text-5xl border-2 border-white/20 shadow-lg flex-shrink-0`}
      >
        {theme.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-1">{theme.name}</h2>
        <p className="text-xs sm:text-sm text-cyan-300 font-semibold">{theme.description}</p>
      </div>
    </div>

    <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
      {themeData.skills.map((skill) => (
        <SkillProgressRow animationDelay={index * 0.1} key={skill.name} skill={skill} />
      ))}
    </div>

    {themeData.categoryBreakdown.length > 0 ? (
      <div className="mb-5 sm:mb-6" data-component="ThemeCategoryBreakdown">
        <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-cyan-300">
          Per categorie
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {themeData.categoryBreakdown.map((skill) => (
            <SkillProgressRow animationDelay={index * 0.1} key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    ) : null}

    {themeData.tempo ? (
      <div
        className="mb-4 flex items-center justify-between gap-3 rounded-xl border-2 border-slate-600 bg-slate-900/40 px-3 py-2"
        data-component="ThemeTempoInsight"
      >
        <span className="text-sm font-bold text-white">Gemiddeld tempo per opdracht</span>
        <span className="whitespace-nowrap text-sm font-black text-cyan-300">
          {themeData.tempo.averageSeconds.toLocaleString("nl-NL")} s
          <span className="ml-1 text-xs font-semibold text-slate-400">
            ({themeData.tempo.measuredResponses} gemeten)
          </span>
        </span>
      </div>
    ) : null}

    <p className="mb-4 text-sm text-slate-300">
      Gebaseerd op {themeData.evidence.eventCount} oefenpogingen met rekenregel versie{" "}
      {themeData.evidence.projectorVersion}.
    </p>

    <PeriodInsightPanel periods={periods} selectedPeriod={selectedPeriod} themeData={themeData} />
  </motion.div>
);

ThemeProgressCard.displayName = "ThemeProgressCard";
