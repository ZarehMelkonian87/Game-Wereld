import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useProfile } from "../contexts/ProfileContext";
import { ArrowLeft, Volume2, VolumeX, Music, Trash2, Trophy, Target, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

export function SettingsScreen() {
  const navigate = useNavigate();
  const { currentProfile, deleteProfile } = useProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!currentProfile) {
      navigate("/");
    }
  }, [currentProfile, navigate]);

  if (!currentProfile) return null;

  const handleDeleteProfile = () => {
    deleteProfile(currentProfile.id);
    navigate("/");
  };

  const completedGames = currentProfile.progress.filter(p => p.completed).length;
  const totalStars = currentProfile.progress.reduce((sum, p) => sum + p.stars, 0);

  return (
    <div className="min-h-screen flex flex-col safe-area-inset">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-5 md:px-6 py-5 sm:py-6 md:py-8">
          <button
            onClick={() => navigate("/home")}
            className="mb-5 sm:mb-6 md:mb-8 p-3 sm:p-4 rounded-xl bg-slate-700/80 active:bg-slate-600 border-2 border-slate-500"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
          </button>

          <div className="max-w-2xl mx-auto w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-black mb-6 sm:mb-8 md:mb-10 text-center">
              INSTELLINGEN
            </h1>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 border-3 sm:border-4 border-slate-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 mb-5 sm:mb-6 md:mb-8"
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                <div className={`bg-gradient-to-br ${currentProfile.avatar.color} w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl flex items-center justify-center text-5xl sm:text-6xl md:text-7xl border-2 sm:border-3 border-white/20 shadow-xl flex-shrink-0`}>
                  {currentProfile.avatar.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-1 sm:mb-2 truncate">
                    {currentProfile.name}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-cyan-300 font-semibold mb-3 sm:mb-4 truncate">
                    {currentProfile.avatar.name}
                  </p>

                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-yellow-500/20 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full">
                      <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm md:text-base text-yellow-300 font-bold whitespace-nowrap">
                        {totalStars} sterren
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-green-500/20 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full">
                      <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm md:text-base text-green-300 font-bold whitespace-nowrap">
                        {completedGames} compleet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Progress Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-5 sm:mb-6 md:mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/progress")}
                className="w-full game-card-3d bg-gradient-to-br from-purple-600 to-pink-600 border-3 sm:border-4 border-purple-400 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 flex items-center gap-4 sm:gap-5"
              >
                <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-1">
                    Voortgang Bekijken
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-white/90 font-semibold">
                    Zie hoe {currentProfile.name} groeit
                  </p>
                </div>
              </motion.button>
            </motion.div>

            {/* Sound Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 border-3 sm:border-4 border-slate-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 mb-5 sm:mb-6 md:mb-8"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-4 sm:mb-5 md:mb-6">AUDIO</h3>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-600/50 rounded-lg sm:rounded-xl border-2 border-slate-500">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    {currentProfile.settings.soundEnabled ? (
                      <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400 flex-shrink-0" />
                    ) : (
                      <VolumeX className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-500 flex-shrink-0" />
                    )}
                    <span className="text-base sm:text-lg md:text-xl text-white font-bold truncate">Sound FX</span>
                  </div>
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-black flex-shrink-0 ${
                    currentProfile.settings.soundEnabled ? "bg-green-500 text-white" : "bg-gray-600 text-gray-400"
                  }`}>
                    {currentProfile.settings.soundEnabled ? "✓" : "✗"}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-600/50 rounded-lg sm:rounded-xl border-2 border-slate-500">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <Music className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 ${currentProfile.settings.musicEnabled ? "text-purple-400" : "text-gray-500"}`} />
                    <span className="text-base sm:text-lg md:text-xl text-white font-bold truncate">Music</span>
                  </div>
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-black flex-shrink-0 ${
                    currentProfile.settings.musicEnabled ? "bg-green-500 text-white" : "bg-gray-600 text-gray-400"
                  }`}>
                    {currentProfile.settings.musicEnabled ? "✓" : "✗"}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Delete Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="game-card-3d bg-gradient-to-br from-red-900/50 to-pink-900/50 border-3 sm:border-4 border-red-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 mb-6 sm:mb-8"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-4 sm:mb-5 md:mb-6">DANGER ZONE</h3>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-5 bg-red-600 text-white rounded-lg sm:rounded-xl active:bg-red-700 border-2 sm:border-3 border-red-500"
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
                      onClick={() => setShowDeleteConfirm(false)}
                      className="game-button p-4 sm:p-5 bg-slate-700 text-white rounded-lg sm:rounded-xl text-base sm:text-lg md:text-xl font-black border-2 sm:border-3 border-slate-600"
                    >
                      Nee
                    </button>
                    <button
                      onClick={handleDeleteProfile}
                      className="game-button p-4 sm:p-5 bg-red-600 text-white rounded-lg sm:rounded-xl text-base sm:text-lg md:text-xl font-black border-2 sm:border-3 border-red-500"
                    >
                      Ja, Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
