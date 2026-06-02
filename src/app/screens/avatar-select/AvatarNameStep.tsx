import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import type { Avatar } from "../../game-platform";
import { BackButton, GradientTitle } from "../shared";

interface AvatarNameStepProps {
  name: string;
  onBack: () => void;
  onCreateProfile: () => void;
  onNameChange: (name: string) => void;
  selectedAvatar: Avatar;
}

export const AvatarNameStep = ({
  name,
  onBack,
  onCreateProfile,
  onNameChange,
  selectedAvatar,
}: AvatarNameStepProps) => (
  <div className="min-h-screen flex flex-col px-4 py-6" data-component="AvatarNameStep">
    <BackButton label="Terug naar avatars" onClick={onBack} />

    <div className="flex-1 flex flex-col items-center justify-center px-2">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          className={`bg-gradient-to-br ${selectedAvatar.color} w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl flex items-center justify-center text-6xl sm:text-7xl md:text-8xl mx-auto mb-4 sm:mb-6 shadow-2xl border-3 sm:border-4 border-white/20`}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {selectedAvatar.emoji}
        </motion.div>
        <GradientTitle className="text-2xl sm:text-3xl md:text-4xl mb-2 px-2">
          {selectedAvatar.name}
        </GradientTitle>
        <p className="text-lg sm:text-xl md:text-2xl text-cyan-300 font-semibold mb-4 sm:mb-6 px-2">
          Wat is je naam?
        </p>
      </motion.div>

      <input
        autoFocus
        className="text-xl sm:text-2xl md:text-3xl text-center p-4 sm:p-5 rounded-2xl border-3 sm:border-4 border-cyan-500 bg-slate-800 text-white placeholder-slate-400 mb-6 sm:mb-8 max-w-md w-full focus:border-purple-500 outline-none font-bold shadow-xl"
        maxLength={15}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder="Type je gamer naam..."
        type="text"
        value={name}
      />

      <motion.button
        className={`game-button px-8 sm:px-10 md:px-14 py-5 sm:py-6 md:py-7 rounded-2xl text-2xl sm:text-3xl md:text-4xl font-black min-h-[70px] sm:min-h-[80px] md:min-h-[90px] w-full max-w-[280px] border-3 sm:border-4 ${
          name.trim()
            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-300/50"
            : "bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500"
        }`}
        disabled={!name.trim()}
        onClick={onCreateProfile}
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 justify-center">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          <span>LET'S GO!</span>
        </div>
      </motion.button>
    </div>
  </div>
);

AvatarNameStep.displayName = "AvatarNameStep";
