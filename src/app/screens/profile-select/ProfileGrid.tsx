import type { Profile } from "../../game-platform";
import { CreateProfileCard } from "./CreateProfileCard";
import { ProfileCard } from "./ProfileCard";

interface ProfileGridProps {
  onCreate: () => void;
  onSelectProfile: (profile: Profile) => void;
  onEditProfile: (profile: Profile) => void;
  profiles: Profile[];
}

export const ProfileGrid = ({
  onCreate,
  onSelectProfile,
  onEditProfile,
  profiles,
}: ProfileGridProps) => (
  <div className="flex-1 overflow-y-auto px-2" data-component="ProfileGrid">
    <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-6">
      {profiles.map((profile, index) => (
        <ProfileCard
          index={index}
          key={profile.id}
          onSelect={onSelectProfile}
          onEdit={onEditProfile}
          profile={profile}
        />
      ))}
      <CreateProfileCard delay={profiles.length * 0.1} onCreate={onCreate} />
    </div>
  </div>
);

ProfileGrid.displayName = "ProfileGrid";
