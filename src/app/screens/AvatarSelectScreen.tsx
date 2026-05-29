import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useProfile } from "../contexts/ProfileContext";
import { availableAvatars } from "../data/avatars";
import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

export function AvatarSelectScreen() {
  const navigate = useNavigate();
  const { createProfile } = useProfile();
  const [selectedAvatar, setSelectedAvatar] = useState(availableAvatars[0]);
  const [name, setName] = useState("");
  const [step, setStep] = useState<"avatar" | "name">("avatar");

  const handleAvatarSelect = (avatar: typeof availableAvatars[0]) => {
    setSelectedAvatar(avatar);
    setStep("name");
  };

  const handleCreateProfile = () => {
    if (name.trim()) {
      createProfile(name.trim(), selectedAvatar);
      navigate("/home");
    }
  };

  if (step === "name") {
    return (
      <div className="min-h-screen flex flex-col px-4 py-6">
        <button
          onClick={() => setStep("avatar")}
          className="self-start mb-4 p-3 sm:p-4 rounded-xl bg-slate-700/80 active:bg-slate-600 border-2 border-slate-500"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center px-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`bg-gradient-to-br ${selectedAvatar.color} w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl flex items-center justify-center text-6xl sm:text-7xl md:text-8xl mx-auto mb-4 sm:mb-6 shadow-2xl border-3 sm:border-4 border-white/20`}
            >
              {selectedAvatar.emoji}
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-black mb-2 px-2">
              {selectedAvatar.name}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-cyan-300 font-semibold mb-4 sm:mb-6 px-2">
              Wat is je naam?
            </p>
          </motion.div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type je gamer naam..."
            className="text-xl sm:text-2xl md:text-3xl text-center p-4 sm:p-5 rounded-2xl border-3 sm:border-4 border-cyan-500 bg-slate-800 text-white placeholder-slate-400 mb-6 sm:mb-8 max-w-md w-full focus:border-purple-500 outline-none font-bold shadow-xl"
            autoFocus
            maxLength={15}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateProfile}
            disabled={!name.trim()}
            className={`game-button px-8 sm:px-10 md:px-14 py-5 sm:py-6 md:py-7 rounded-2xl text-2xl sm:text-3xl md:text-4xl font-black min-h-[70px] sm:min-h-[80px] md:min-h-[90px] w-full max-w-[280px] border-3 sm:border-4 ${
              name.trim()
                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-300/50"
                : "bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              <span>LET'S GO!</span>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      <button
        onClick={() => navigate("/profiles")}
        className="self-start mb-4 p-3 sm:p-4 rounded-xl bg-slate-700/80 active:bg-slate-600 border-2 border-slate-500"
      >
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
      </button>

      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-black mb-2 px-2">
          KIES JE AVATAR
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-cyan-300 font-semibold px-2">
          Wie word jij?
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 max-w-3xl mx-auto pb-6">
          {availableAvatars.map((avatar, index) => (
            <motion.button
              key={avatar.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAvatarSelect(avatar)}
              className={`game-card-3d bg-gradient-to-br ${avatar.color} p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-white/20 min-h-[110px] sm:min-h-[120px] md:min-h-[130px] flex flex-col items-center justify-center`}
            >
              <div className="text-4xl sm:text-5xl mb-1 sm:mb-2 drop-shadow-lg">{avatar.emoji}</div>
              <div className="text-xs sm:text-sm text-white font-bold drop-shadow-md text-center leading-tight px-1">
                {avatar.name}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
