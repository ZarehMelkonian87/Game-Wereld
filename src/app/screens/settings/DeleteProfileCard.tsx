import { motion } from "motion/react";
import { Trash2 } from "lucide-react";

interface DeleteProfileCardProps {
  onCancel: () => void;
  onConfirmDelete: () => void;
  onRequestDelete: () => void;
  showConfirm: boolean;
}

export const DeleteProfileCard = ({
  onCancel,
  onConfirmDelete,
  onRequestDelete,
  showConfirm,
}: DeleteProfileCardProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="game-card-3d bg-gradient-to-br from-red-900/50 to-pink-900/50 border-3 sm:border-4 border-red-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 mb-6 sm:mb-8"
    data-component="DeleteProfileCard"
    initial={{ opacity: 0, y: 20 }}
    transition={{ delay: 0.3 }}
  >
    <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-4 sm:mb-5 md:mb-6">
      DANGER ZONE
    </h3>

    {!showConfirm ? (
      <button
        className="w-full flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-5 bg-red-600 text-white rounded-lg sm:rounded-xl active:bg-red-700 border-2 sm:border-3 border-red-500"
        onClick={onRequestDelete}
        type="button"
      >
        <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" />
        <span className="text-lg sm:text-xl md:text-2xl font-black">Delete Speler</span>
      </button>
    ) : (
      <div className="space-y-4">
        <p className="text-base sm:text-lg md:text-xl text-white text-center font-bold">
          Weet je het zeker?
        </p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            className="game-button p-4 sm:p-5 bg-slate-700 text-white rounded-lg sm:rounded-xl text-base sm:text-lg md:text-xl font-black border-2 sm:border-3 border-slate-600"
            onClick={onCancel}
            type="button"
          >
            Nee
          </button>
          <button
            className="game-button p-4 sm:p-5 bg-red-600 text-white rounded-lg sm:rounded-xl text-base sm:text-lg md:text-xl font-black border-2 sm:border-3 border-red-500"
            onClick={onConfirmDelete}
            type="button"
          >
            Ja, Delete
          </button>
        </div>
      </div>
    )}
  </motion.div>
);

DeleteProfileCard.displayName = "DeleteProfileCard";
