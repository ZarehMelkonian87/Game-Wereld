import { useState } from "react";
import { useNavigate } from "react-router";
import { useProfile } from "../../contexts/ProfileContext";
import { useRequireProfile } from "../shared";
import { AudioSettingsCard } from "./AudioSettingsCard";
import { DeleteProfileCard } from "./DeleteProfileCard";
import { ProgressLinkCard } from "./ProgressLinkCard";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsProfileCard } from "./SettingsProfileCard";

export const SettingsScreen = () => {
  const navigate = useNavigate();
  const { currentProfile, deleteProfile } = useProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useRequireProfile(currentProfile, navigate);

  if (!currentProfile) {
    return null;
  }

  const completedGames = currentProfile.progress.filter((progress) => progress.completed).length;
  const totalStars = currentProfile.progress.reduce(
    (sum, progress) => sum + progress.stars,
    0,
  );

  const handleDeleteProfile = () => {
    deleteProfile(currentProfile.id);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col safe-area-inset" data-component="SettingsScreen">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-5 md:px-6 py-5 sm:py-6 md:py-8">
          <div className="max-w-2xl mx-auto w-full">
            <SettingsHeader onBack={() => navigate("/home")} />
            <SettingsProfileCard
              completedGames={completedGames}
              profile={currentProfile}
              totalStars={totalStars}
            />
            <ProgressLinkCard
              childName={currentProfile.name}
              onOpenProgress={() => navigate("/progress")}
            />
            <AudioSettingsCard profile={currentProfile} />
            <DeleteProfileCard
              onCancel={() => setShowDeleteConfirm(false)}
              onConfirmDelete={handleDeleteProfile}
              onRequestDelete={() => setShowDeleteConfirm(true)}
              showConfirm={showDeleteConfirm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

SettingsScreen.displayName = "SettingsScreen";
