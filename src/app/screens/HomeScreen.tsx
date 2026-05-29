import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useProfile } from "../contexts/ProfileContext";
import { gameThemes } from "../data/games";
import { Settings, LogOut, Trophy, Zap, BarChart3 } from "lucide-react";
import { useEffect } from "react";

export function HomeScreen() {
  const navigate = useNavigate();
  const { currentProfile, setCurrentProfile } = useProfile();

  useEffect(() => {
    if (!currentProfile) {
      navigate("/");
    }
  }, [currentProfile, navigate]);

  if (!currentProfile) return null;

  const handleLogout = () => {
    setCurrentProfile(null as any);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col safe-area-inset">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-4 sm:px-4 sm:py-5 shadow-2xl border-b-4 border-cyan-500/30">
        <div className="flex items-center justify-between max-w-4xl mx-auto gap-2">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
            <div className={`bg-gradient-to-br ${currentProfile.avatar.color} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-3xl sm:text-3xl md:text-4xl shadow-xl border-2 sm:border-3 border-white/20 flex-shrink-0`}>
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
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/progress")}
              className="p-2 sm:p-2.5 md:p-3 bg-purple-600 rounded-lg sm:rounded-xl active:bg-purple-700 border-2 border-purple-500"
            >
              <BarChart3 className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/settings")}
              className="p-2 sm:p-2.5 md:p-3 bg-slate-700 rounded-lg sm:rounded-xl active:bg-slate-600 border-2 border-slate-600"
            >
              <Settings className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-300" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 sm:p-2.5 md:p-3 bg-slate-700 rounded-lg sm:rounded-xl active:bg-slate-600 border-2 border-slate-600"
            >
              <LogOut className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-300" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Game Themes Grid */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-400 flex-shrink-0" />
            <h3 className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-black text-center">
              GAME ZONES
            </h3>
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-400 flex-shrink-0" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 pb-6">
            {gameThemes.map((theme, index) => (
              <motion.button
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, rotate: 1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/games/${theme.id}`)}
                className={`game-card-3d bg-gradient-to-br ${theme.color} p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border-3 sm:border-4 border-white/20 min-h-[150px] sm:min-h-[170px] md:min-h-[190px] flex flex-col items-center justify-center text-white relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-2xl" />
                <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3 drop-shadow-2xl relative z-10">
                  {theme.icon}
                </div>
                <div className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2 font-black drop-shadow-lg relative z-10 text-center leading-tight px-1">
                  {theme.name}
                </div>
                <div className="text-xs sm:text-sm opacity-90 text-center px-1 sm:px-2 font-semibold relative z-10 leading-tight">
                  {theme.description}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
