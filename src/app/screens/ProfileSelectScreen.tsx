import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useProfile } from "../contexts/ProfileContext";
import { Plus, Crown } from "lucide-react";

export function ProfileSelectScreen() {
  const navigate = useNavigate();
  const { profiles, setCurrentProfile } = useProfile();

  const handleSelectProfile = (profile: typeof profiles[0]) => {
    setCurrentProfile(profile);
    navigate("/home");
  };

  const handleCreateNew = () => {
    navigate("/avatar");
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 safe-area-inset">
      <div className="text-center mb-6 mt-4 sm:mt-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-black px-2">
            KIES JE SPELER
          </h1>
        </motion.div>
        <p className="text-base sm:text-lg md:text-xl text-cyan-300 font-semibold px-2">
          Wie gaat er winnen?
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-6">
          {profiles.map((profile, index) => (
            <motion.button
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectProfile(profile)}
              className="game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl border-3 sm:border-4 border-slate-600 min-h-[160px] sm:min-h-[180px] flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute top-2 right-2">
                {profile.progress.length > 5 && (
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                )}
              </div>
              <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3 drop-shadow-lg">{profile.avatar.emoji}</div>
              <div className="text-lg sm:text-xl md:text-2xl text-white font-bold mb-1 truncate w-full text-center px-1">
                {profile.name}
              </div>
              <div className="text-xs sm:text-sm text-cyan-300 font-semibold">
                {profile.progress.length} games
              </div>
            </motion.button>
          ))}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: profiles.length * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCreateNew}
            className="game-card-3d bg-gradient-to-br from-purple-600 to-pink-600 border-3 sm:border-4 border-purple-400 p-4 sm:p-5 md:p-6 rounded-2xl min-h-[160px] sm:min-h-[180px] flex flex-col items-center justify-center"
          >
            <Plus className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white mb-2" strokeWidth={3} />
            <div className="text-base sm:text-lg md:text-xl text-white font-bold">NIEUW SPELER</div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
