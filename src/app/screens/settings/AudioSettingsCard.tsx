import { motion } from "motion/react";
import { Music, Volume2, VolumeX } from "lucide-react";
import type { Profile } from "../../game-platform";
import { AudioSettingRow } from "./AudioSettingRow";
import { useProfile } from "../../contexts/ProfileContext";

interface AudioSettingsCardProps {
  profile: Profile;
}

export const AudioSettingsCard = ({ profile }: AudioSettingsCardProps) => {
  const { updateSettings } = useProfile();

  const playToggleSound = (enabled: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Play C5 (523.25Hz) for enable, G4 (392Hz) for disable
      osc.frequency.setValueAtTime(enabled ? 523.25 : 392.00, ctx.currentTime);
      osc.type = "sine";

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  };

  const handleToggleSound = () => {
    const nextState = !profile.settings.soundEnabled;
    updateSettings({ soundEnabled: nextState });
    playToggleSound(nextState);
  };

  const handleToggleMusic = () => {
    const nextState = !profile.settings.musicEnabled;
    updateSettings({ musicEnabled: nextState });
    playToggleSound(nextState);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 border-3 sm:border-4 border-slate-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 mb-5 sm:mb-6 md:mb-8"
      data-component="AudioSettingsCard"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-4 sm:mb-5 md:mb-6">
        AUDIO
      </h3>

      <div className="space-y-3 sm:space-y-4">
        <AudioSettingRow
          enabled={profile.settings.soundEnabled}
          icon={
            profile.settings.soundEnabled ? (
              <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400 flex-shrink-0" />
            ) : (
              <VolumeX className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-500 flex-shrink-0" />
            )
          }
          label="Sound FX"
          onToggle={handleToggleSound}
        />
        <AudioSettingRow
          enabled={profile.settings.musicEnabled}
          icon={
            <Music
              className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 ${
                profile.settings.musicEnabled ? "text-purple-400" : "text-gray-500"
              }`}
            />
          }
          label="Music"
          onToggle={handleToggleMusic}
        />
      </div>
    </motion.div>
  );
};

AudioSettingsCard.displayName = "AudioSettingsCard";
