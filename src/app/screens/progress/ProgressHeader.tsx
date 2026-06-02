import { Award } from "lucide-react";
import type { Profile } from "../../contexts/ProfileContext";
import { BackButton } from "../shared";

interface ProgressHeaderProps {
  onBack: () => void;
  profile: Profile;
}

export const ProgressHeader = ({ onBack, profile }: ProgressHeaderProps) => (
  <div
    className="bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-4 sm:px-4 sm:py-5 shadow-2xl border-b-4 border-purple-500/30"
    data-component="ProgressHeader"
  >
    <div className="max-w-4xl mx-auto">
      <div className="mb-3 sm:mb-4">
        <BackButton label="Terug naar home" onClick={onBack} />
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className={`bg-gradient-to-br ${profile.avatar.color} w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-4xl sm:text-5xl border-3 border-white/20 shadow-xl flex-shrink-0`}
        >
          {profile.avatar.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-black mb-1">
            Voortgang
          </h1>
          <p className="text-sm sm:text-base text-cyan-300 font-semibold">
            {profile.name}'s Groei
          </p>
        </div>
        <Award className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 flex-shrink-0" />
      </div>
    </div>
  </div>
);

ProgressHeader.displayName = "ProgressHeader";
