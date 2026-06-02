import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";

interface ProgressLinkCardProps {
  childName: string;
  onOpenProgress: () => void;
}

export const ProgressLinkCard = ({ childName, onOpenProgress }: ProgressLinkCardProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="mb-5 sm:mb-6 md:mb-8"
    data-component="ProgressLinkCard"
    initial={{ opacity: 0, y: 20 }}
    transition={{ delay: 0.1 }}
  >
    <motion.button
      className="w-full game-card-3d bg-gradient-to-br from-purple-600 to-pink-600 border-3 sm:border-4 border-purple-400 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 flex items-center gap-4 sm:gap-5"
      onClick={onOpenProgress}
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white flex-shrink-0" />
      <div className="flex-1 text-left">
        <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-1">
          Voortgang Bekijken
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-white/90 font-semibold">
          Zie hoe {childName} groeit
        </p>
      </div>
    </motion.button>
  </motion.div>
);

ProgressLinkCard.displayName = "ProgressLinkCard";
