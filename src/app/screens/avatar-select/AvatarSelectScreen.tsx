import { useState } from "react";
import { useNavigate } from "react-router";
import { availableAvatars } from "../../data/avatars";
import { useProfile, type Avatar } from "../../contexts/ProfileContext";
import { AvatarGridStep } from "./AvatarGridStep";
import { AvatarNameStep } from "./AvatarNameStep";

type AvatarSelectStep = "avatar" | "name";

export const AvatarSelectScreen = () => {
  const navigate = useNavigate();
  const { createProfile } = useProfile();
  const [selectedAvatar, setSelectedAvatar] = useState(availableAvatars[0]);
  const [name, setName] = useState("");
  const [step, setStep] = useState<AvatarSelectStep>("avatar");

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setStep("name");
  };

  const handleCreateProfile = () => {
    if (!name.trim()) {
      return;
    }

    createProfile(name.trim(), selectedAvatar);
    navigate("/home");
  };

  if (step === "name") {
    return (
      <AvatarNameStep
        name={name}
        onBack={() => setStep("avatar")}
        onCreateProfile={handleCreateProfile}
        onNameChange={setName}
        selectedAvatar={selectedAvatar}
      />
    );
  }

  return <AvatarGridStep onBack={() => navigate("/profiles")} onSelectAvatar={handleAvatarSelect} />;
};

AvatarSelectScreen.displayName = "AvatarSelectScreen";
