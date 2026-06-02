import { motion } from "motion/react";
import { Target, Trophy } from "lucide-react";
import type { Profile } from "../../contexts/ProfileContext";

interface SettingsProfileCardProps {
  completedGames: number;
  profile: Profile;
  totalStars: number;
}

export const SettingsProfileCard = ({
  completedGames,
  profile,
  totalStars,
}: SettingsProfileCardProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 border-3 sm:border-4 border-slate-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 mb-5 sm:mb-6 md:mb-8"
    data-component="SettingsProfileCard"
    initial={{ opacity: 0, y: 20 }}
  >
    <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
      <div
        className={`bg-gradient-to-br ${profile.avatar.color} w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl flex items-center justify-center text-5xl sm:text-6xl md:text-7xl border-2 sm:border-3 border-white/20 shadow-xl flex-shrink-0`}
      >
        {profile.avatar.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-1 sm:mb-2 truncate">
          {profile.name}
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-cyan-300 font-semibold mb-3 sm:mb-4 truncate">
          {profile.avatar.name}
        </p>

        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-yellow-500/20 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm md:text-base text-yellow-300 font-bold whitespace-nowrap">
              {totalStars} sterren
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 bg-green-500/20 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm md:text-base text-green-300 font-bold whitespace-nowrap">
              {completedGames} compleet
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

SettingsProfileCard.displayName = "SettingsProfileCard";
