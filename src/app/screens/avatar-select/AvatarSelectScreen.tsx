import { useState } from "react";
import { useNavigate } from "react-router";
import type { Avatar } from "../../game-platform";
import { useProfile } from "../../contexts/ProfileContext";
import { availableAvatars } from "../../data/avatars";
import { reportStorageWriteFailure } from "../../storage";
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

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      await createProfile(name.trim(), selectedAvatar);
      navigate("/home");
    } catch (error) {
      reportStorageWriteFailure(error);
    }
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

  return (
    <AvatarGridStep onBack={() => navigate("/profiles")} onSelectAvatar={handleAvatarSelect} />
  );
};

AvatarSelectScreen.displayName = "AvatarSelectScreen";
