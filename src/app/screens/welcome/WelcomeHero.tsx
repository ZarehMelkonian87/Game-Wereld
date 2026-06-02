import { motion } from "motion/react";
import { Gamepad2, Sparkles } from "lucide-react";

interface WelcomeHeroProps {
  onStart: () => void;
}

export const WelcomeHero = ({ onStart }: WelcomeHeroProps) => (
  <motion.div
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className="text-center relative z-10 max-w-md w-full"
    data-component="WelcomeHero"
    initial={{ opacity: 0, scale: 0.8, y: 50 }}
    transition={{ duration: 0.6, type: "spring" }}
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      className="mb-4 sm:mb-6"
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-50 rounded-full" />
        <Gamepad2
          className="w-20 h-20 sm:w-32 sm:h-32 text-cyan-400 relative"
          strokeWidth={2.5}
        />
      </div>
    </motion.div>

    <motion.h1
      animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
      className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-black tracking-tight px-2"
      style={{ backgroundSize: "200% auto" }}
      transition={{ duration: 5, repeat: Infinity }}
    >
      GAME WERELD
    </motion.h1>
    <p className="text-lg sm:text-xl md:text-2xl text-cyan-300 mb-2 font-semibold px-2">
      Speel de coolste games!
    </p>
    <div className="flex items-center justify-center gap-2 text-purple-300 mb-6 sm:mb-8 px-2">
      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="text-sm sm:text-base md:text-lg">Oneindig veel avontuur</span>
      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>

    <motion.button
      className="game-button bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-8 sm:px-12 md:px-16 py-5 sm:py-6 md:py-7 rounded-2xl text-2xl sm:text-3xl md:text-4xl font-black tracking-wide min-h-[70px] sm:min-h-[80px] md:min-h-[90px] w-full max-w-[280px] border-4 border-cyan-300/50"
      onClick={onStart}
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-2 sm:gap-3 justify-center">
        <span>START</span>
        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
          ▶
        </motion.div>
      </div>
    </motion.button>
  </motion.div>
);

WelcomeHero.displayName = "WelcomeHero";
