import { motion } from "motion/react";
import { BarChart3, LogOut, Settings, Trophy } from "lucide-react";
import type { Profile } from "../../game-platform";

interface HomeHeaderProps {
  currentProfile: Profile;
  onLogout: () => void;
  onOpenProgress: () => void;
  onOpenSettings: () => void;
}

export const HomeHeader = ({
  currentProfile,
  onLogout,
  onOpenProgress,
  onOpenSettings,
}: HomeHeaderProps) => (
  <div
    className="bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-4 sm:px-4 sm:py-5 shadow-2xl border-b-4 border-cyan-500/30"
    data-component="HomeHeader"
  >
    <div className="flex items-center justify-between max-w-4xl mx-auto gap-2">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
        <div
          className={`bg-gradient-to-br ${currentProfile.avatar.color} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-3xl sm:text-3xl md:text-4xl shadow-xl border-2 sm:border-3 border-white/20 flex-shrink-0`}
        >
          {currentProfile.avatar.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl text-white font-black truncate">
            {currentProfile.name}
          </h2>
          <div className="flex items-center gap-1 sm:gap-2 text-cyan-300">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold truncate">
              {currentProfile.progress.length} Games
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
        <motion.button
          className="p-2 sm:p-2.5 md:p-3 bg-purple-600 rounded-lg sm:rounded-xl active:bg-purple-700 border-2 border-purple-500"
          onClick={onOpenProgress}
          type="button"
          whileTap={{ scale: 0.9 }}
        >
          <BarChart3 className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </motion.button>
        <motion.button
          className="p-2 sm:p-2.5 md:p-3 bg-slate-700 rounded-lg sm:rounded-xl active:bg-slate-600 border-2 border-slate-600"
          onClick={onOpenSettings}
          type="button"
          whileTap={{ scale: 0.9 }}
        >
          <Settings className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-300" />
        </motion.button>
        <motion.button
          className="p-2 sm:p-2.5 md:p-3 bg-slate-700 rounded-lg sm:rounded-xl active:bg-slate-600 border-2 border-slate-600"
          onClick={onLogout}
          type="button"
          whileTap={{ scale: 0.9 }}
        >
          <LogOut className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-300" />
        </motion.button>
      </div>
    </div>
  </div>
);

HomeHeader.displayName = "HomeHeader";
