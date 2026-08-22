import { motion } from "motion/react";
import type { PracticeEventEnvelope } from "../../storage";

interface AchievementsCardProps {
  delay: number;
  events: PracticeEventEnvelope[];
}

export const AchievementsCard = ({ delay, events }: AchievementsCardProps) => {
  const independentCorrect = events.filter(
    (event) => event.outcome === "correct" && event.assistance.length === 0,
  ).length;
  const hasVocabulary = events.some((event) =>
    event.skillIds.some((skillId) => skillId.includes("vocabulary")),
  );
  const badges = [
    {
      description: "De eerste oefenpoging is opgeslagen",
      icon: "🚀",
      id: "first_steps",
      name: "Eerste Stappen",
      unlocked: events.length > 0,
    },
    {
      description: "Vijf pogingen lukten zonder geregistreerde hulp",
      icon: "⭐",
      id: "independent_five",
      name: "Zelf Oefenen",
      unlocked: independentCorrect >= 5,
    },
    {
      description: "Er is met woordenschat geoefend",
      icon: "📚",
      id: "vocabulary",
      name: "Woordenontdekker",
      unlocked: hasVocabulary,
    },
  ];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="game-card-3d relative overflow-hidden rounded-2xl border-3 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white sm:border-4"
      data-component="AchievementsCard"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay }}
    >
      <h3 className="mb-4 text-xl font-black sm:text-2xl">🏆 OEFENMIJLPALEN</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {badges.map((badge) => (
          <div
            className={`flex items-center gap-3 rounded-xl border-2 p-3 ${
              badge.unlocked
                ? "border-white/20 bg-cyan-500/10"
                : "border-slate-700/50 bg-slate-800/30 opacity-40 grayscale"
            }`}
            key={badge.id}
          >
            <div className="text-3xl sm:text-4xl">{badge.icon}</div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-bold text-white sm:text-base">{badge.name}</h4>
              <p className="text-xs leading-tight text-slate-400">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

AchievementsCard.displayName = "AchievementsCard";
