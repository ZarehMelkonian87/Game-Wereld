import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useProfile } from "../contexts/ProfileContext";
import { useEffect } from "react";
import { Gamepad2, Sparkles } from "lucide-react";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();

  useEffect(() => {
    if (currentProfile) {
      navigate("/home");
    }
  }, [currentProfile, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute top-10 left-4 sm:top-20 sm:left-10 text-4xl sm:text-6xl"
      >
        ⭐
      </motion.div>
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 3, delay: 1 }}
        className="absolute bottom-20 right-4 sm:bottom-32 sm:right-10 text-4xl sm:text-6xl"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
        className="absolute top-1/2 right-8 sm:right-20 text-3xl sm:text-5xl"
      >
        🎯
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center relative z-10 max-w-md w-full"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-4 sm:mb-6"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-50 rounded-full" />
            <Gamepad2 className="w-20 h-20 sm:w-32 sm:h-32 text-cyan-400 relative" strokeWidth={2.5} />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-black tracking-tight px-2"
          animate={{
            backgroundPosition: ["0%", "100%", "0%"]
          }}
          transition={{ repeat: Infinity, duration: 5 }}
          style={{ backgroundSize: "200% auto" }}
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profiles")}
          className="game-button bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-8 sm:px-12 md:px-16 py-5 sm:py-6 md:py-7 rounded-2xl text-2xl sm:text-3xl md:text-4xl font-black tracking-wide min-h-[70px] sm:min-h-[80px] md:min-h-[90px] w-full max-w-[280px] border-4 border-cyan-300/50"
        >
          <div className="flex items-center gap-2 sm:gap-3 justify-center">
            <span>START</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ▶
            </motion.div>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
