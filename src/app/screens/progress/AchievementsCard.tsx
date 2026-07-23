import { motion } from "motion/react";
import type { Profile } from "../../game-platform";

interface AchievementsCardProps {
  profile: Profile;
  delay: number;
}

export const AchievementsCard = ({ profile, delay }: AchievementsCardProps) => {
  const getBadges = () => {
    const hasMath = profile.progress.some(
      (p) => p.gameId.includes("numbers") || p.gameId.includes("count"),
    );
    const hasLanguage = profile.progress.some(
      (p) => p.gameId.includes("abc") || p.gameId.includes("word") || p.gameId.includes("bezem"),
    );
    const totalStars = profile.progress.reduce((sum, p) => sum + p.stars, 0);
    const totalPlayed = profile.progress.length;

    return [
      {
        id: "first_steps",
        name: "Eerste Stappen",
        icon: "🚀",
        description: "Je eerste game gespeeld!",
        unlocked: totalPlayed > 0,
        color: "from-cyan-400 to-blue-500",
      },
      {
        id: "star_hunter",
        name: "Sterrenjager",
        icon: "⭐",
        description: "Behaal 5 sterren in totaal",
        unlocked: totalStars >= 5,
        color: "from-yellow-400 to-orange-500",
      },
      {
        id: "math_genius",
        name: "Rekenmeester",
        icon: "🔢",
        description: "Speel een reken zone game",
        unlocked: hasMath,
        color: "from-blue-500 to-indigo-600",
      },
      {
        id: "word_smith",
        name: "Woordenheld",
        icon: "📚",
        description: "Speel een taal zone game",
        unlocked: hasLanguage,
        color: "from-green-400 to-emerald-600",
      },
    ];
  };

  const badges = getBadges();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="game-card-3d bg-gradient-to-br from-slate-800 to-slate-900 border-3 sm:border-4 border-slate-700 p-5 rounded-2xl text-white relative overflow-hidden"
      data-component="AchievementsCard"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay }}
    >
      <h3 className="text-xl sm:text-2xl font-black mb-4">🏆 PRESTATIES & BADGES</h3>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {badges.map((badge) => (
          <div
            className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 ${
              badge.unlocked
                ? `bg-gradient-to-r ${badge.color}/10 border-white/20 hover:scale-103`
                : "bg-slate-800/30 border-slate-700/50 opacity-40 grayscale"
            }`}
            key={badge.id}
          >
            <div className="text-3xl sm:text-4xl drop-shadow-md">{badge.icon}</div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base font-bold text-white truncate">{badge.name}</h4>
              <p className="text-xs text-slate-400 leading-tight">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

AchievementsCard.displayName = "AchievementsCard";
