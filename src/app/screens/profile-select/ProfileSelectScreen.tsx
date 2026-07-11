import { useNavigate } from "react-router";
import type { Profile } from "../../game-platform";
import { useProfile } from "../../contexts/ProfileContext";
import { ProfileGrid } from "./ProfileGrid";
import { ProfileSelectHeader } from "./ProfileSelectHeader";

export const ProfileSelectScreen = () => {
  const navigate = useNavigate();
  const { profiles, setCurrentProfile } = useProfile();

  const handleSelectProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    navigate("/home");
  };

  const handleEditProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    navigate("/settings");
  };

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-6 safe-area-inset"
      data-component="ProfileSelectScreen"
    >
      <ProfileSelectHeader />
      <ProfileGrid
        onCreate={() => navigate("/avatar")}
        onSelectProfile={handleSelectProfile}
        onEditProfile={handleEditProfile}
        profiles={profiles}
      />
    </div>
  );
};

ProfileSelectScreen.displayName = "ProfileSelectScreen";
