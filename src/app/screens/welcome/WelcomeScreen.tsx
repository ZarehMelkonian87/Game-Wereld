import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { useProfile } from "../../contexts/ProfileContext";
import { WelcomeBackground } from "./WelcomeBackground";
import { WelcomeHero } from "./WelcomeHero";

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("game-wereld-global-mute") === "true";
  });

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    localStorage.setItem("game-wereld-global-mute", String(newState));
  };

  useEffect(() => {
    if (currentProfile) {
      navigate("/home");
    }
  }, [currentProfile, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      data-component="WelcomeScreen"
    >
      {/* Floating Audio Button */}
      <div className="absolute top-4 right-4 z-20">
        <motion.button
          aria-label={isMuted ? "Geluid aanzetten" : "Geluid dempen"}
          className="p-3 bg-slate-800/80 backdrop-blur border-2 border-cyan-500/50 rounded-full text-cyan-400 hover:text-cyan-300 active:scale-95 shadow-lg transition-colors cursor-pointer"
          onClick={toggleMute}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </motion.button>
      </div>

      <WelcomeBackground />
      <WelcomeHero onStart={() => navigate("/profiles")} />
    </div>
  );
};

WelcomeScreen.displayName = "WelcomeScreen";
