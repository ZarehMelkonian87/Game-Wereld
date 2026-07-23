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
}: AvatarNameStepProps) => {
  const handleGenerateName = () => {
    const prefixes = [
      "Super",
      "Mega",
      "Epic",
      "Turbo",
      "Cool",
      "Giga",
      "Hyper",
      "Ninja",
      "Snelle",
      "Bliksem",
      "Cyber",
      "Dino",
      "Pixel",
      "Machtige",
      "Sterke",
    ];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const avatarBaseName = selectedAvatar.name.split(" ").pop() || "";
    const generated = `${randomPrefix} ${avatarBaseName}`;
    onNameChange(generated.substring(0, 15));
  };

  return (
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

        <div className="flex gap-2 w-full max-w-md justify-center mb-6 sm:mb-8">
          <div className="relative flex-1">
            <input
              autoFocus
              className="text-xl sm:text-2xl md:text-3xl text-center p-4 sm:p-5 pr-14 rounded-2xl border-3 sm:border-4 border-cyan-500 bg-slate-800 text-white placeholder-slate-400 w-full focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none font-bold shadow-xl transition-all"
              maxLength={15}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Type je gamer naam..."
              type="text"
              value={name}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-slate-400 font-bold">
              {name.length}/15
            </div>
          </div>
          <motion.button
            className="game-button px-4 sm:px-5 bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-2xl border-3 border-yellow-300/50 flex items-center justify-center cursor-pointer min-h-[58px] sm:min-h-[68px]"
            onClick={handleGenerateName}
            title="Verzin een naam"
            type="button"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl sm:text-3xl">🎲</span>
          </motion.button>
        </div>

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
};

AvatarNameStep.displayName = "AvatarNameStep";
