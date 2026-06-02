import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface CreateProfileCardProps {
  delay: number;
  onCreate: () => void;
}

export const CreateProfileCard = ({ delay, onCreate }: CreateProfileCardProps) => (
  <motion.button
    animate={{ opacity: 1, y: 0 }}
    className="game-card-3d bg-gradient-to-br from-purple-600 to-pink-600 border-3 sm:border-4 border-purple-400 p-4 sm:p-5 md:p-6 rounded-2xl min-h-[160px] sm:min-h-[180px] flex flex-col items-center justify-center"
    data-component="CreateProfileCard"
    initial={{ opacity: 0, y: 20 }}
    onClick={onCreate}
    transition={{ delay }}
    type="button"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <Plus className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white mb-2" strokeWidth={3} />
    <div className="text-base sm:text-lg md:text-xl text-white font-bold">NIEUW SPELER</div>
  </motion.button>
);

CreateProfileCard.displayName = "CreateProfileCard";
