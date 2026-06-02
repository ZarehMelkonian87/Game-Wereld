import { motion } from "motion/react";
import type { Avatar } from "../../game-platform";

interface AvatarCardProps {
  avatar: Avatar;
  index: number;
  onSelect: (avatar: Avatar) => void;
}

export const AvatarCard = ({ avatar, index, onSelect }: AvatarCardProps) => (
  <motion.button
    animate={{ opacity: 1, scale: 1 }}
    className={`game-card-3d bg-gradient-to-br ${avatar.color} p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-white/20 min-h-[110px] sm:min-h-[120px] md:min-h-[130px] flex flex-col items-center justify-center`}
    data-component="AvatarCard"
    initial={{ opacity: 0, scale: 0.8 }}
    onClick={() => onSelect(avatar)}
    transition={{ delay: index * 0.03 }}
    type="button"
    whileHover={{ scale: 1.05, rotate: 2 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="text-4xl sm:text-5xl mb-1 sm:mb-2 drop-shadow-lg">{avatar.emoji}</div>
    <div className="text-xs sm:text-sm text-white font-bold drop-shadow-md text-center leading-tight px-1">
      {avatar.name}
    </div>
  </motion.button>
);

AvatarCard.displayName = "AvatarCard";
