import type { Avatar } from "../../contexts/ProfileContext";
import { availableAvatars } from "../../data/avatars";
import { BackButton, GradientTitle } from "../shared";
import { AvatarCard } from "./AvatarCard";

interface AvatarGridStepProps {
  onBack: () => void;
  onSelectAvatar: (avatar: Avatar) => void;
}

export const AvatarGridStep = ({ onBack, onSelectAvatar }: AvatarGridStepProps) => (
  <div className="min-h-screen flex flex-col px-4 py-6" data-component="AvatarGridStep">
    <BackButton label="Terug naar profielen" onClick={onBack} />

    <div className="text-center mb-4 sm:mb-6">
      <GradientTitle className="text-3xl sm:text-4xl md:text-5xl mb-2 px-2">
        KIES JE AVATAR
      </GradientTitle>
      <p className="text-base sm:text-lg md:text-xl text-cyan-300 font-semibold px-2">
        Wie word jij?
      </p>
    </div>

    <div className="flex-1 overflow-y-auto px-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 max-w-3xl mx-auto pb-6">
        {availableAvatars.map((avatar, index) => (
          <AvatarCard
            avatar={avatar}
            index={index}
            key={avatar.id}
            onSelect={onSelectAvatar}
          />
        ))}
      </div>
    </div>
  </div>
);

AvatarGridStep.displayName = "AvatarGridStep";
