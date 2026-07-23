import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { useProfile } from "../../contexts/ProfileContext";
import { readGlobalMute, saveGlobalMute } from "../../storage";
import { WelcomeBackground } from "./WelcomeBackground";
import { WelcomeHero } from "./WelcomeHero";

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();
  const [isMuted, setIsMuted] = useState(readGlobalMute);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    saveGlobalMute(newState);
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
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border-2 border-cyan-500/50 bg-slate-800/80 p-3 text-cyan-400 shadow-lg outline-none backdrop-blur transition-colors active:scale-95 focus-visible:ring-4 focus-visible:ring-cyan-200 motion-reduce:transform-none motion-reduce:transition-none"
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
