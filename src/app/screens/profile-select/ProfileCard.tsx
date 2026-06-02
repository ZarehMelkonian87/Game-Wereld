import { motion } from "motion/react";
import { Crown } from "lucide-react";
import type { Profile } from "../../game-platform";

interface ProfileCardProps {
  index: number;
  onSelect: (profile: Profile) => void;
  profile: Profile;
}

export const ProfileCard = ({ index, onSelect, profile }: ProfileCardProps) => (
  <motion.button
    animate={{ opacity: 1, y: 0 }}
    className="game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl border-3 sm:border-4 border-slate-600 min-h-[160px] sm:min-h-[180px] flex flex-col items-center justify-center relative overflow-hidden"
    data-component="ProfileCard"
    initial={{ opacity: 0, y: 20 }}
    onClick={() => onSelect(profile)}
    transition={{ delay: index * 0.1 }}
    type="button"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <div className="absolute top-2 right-2">
      {profile.progress.length > 5 ? (
        <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
      ) : null}
    </div>
    <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3 drop-shadow-lg">
      {profile.avatar.emoji}
    </div>
    <div className="text-lg sm:text-xl md:text-2xl text-white font-bold mb-1 truncate w-full text-center px-1">
      {profile.name}
    </div>
    <div className="text-xs sm:text-sm text-cyan-300 font-semibold">
      {profile.progress.length} games
    </div>
  </motion.button>
);

ProfileCard.displayName = "ProfileCard";
