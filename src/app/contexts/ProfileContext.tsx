import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  clearStoredCurrentProfileId,
  createBrowserGameStorage,
  readStoredCurrentProfileId,
  readStoredProfiles,
  saveStoredCurrentProfileId,
  saveStoredProfiles,
  type Avatar,
  type GameProgress,
  type Profile,
} from "../game-platform";

interface ProfileContextType {
  profiles: Profile[];
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
  createProfile: (name: string, avatar: Avatar) => void;
  updateProgress: (gameId: string, progress: Partial<GameProgress>) => void;
  updateSettings: (settings: Partial<Profile["settings"]>) => void;
  deleteProfile: (id: string) => void;
}

const profileStorage = createBrowserGameStorage();

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<Profile[]>(() => readStoredProfiles(profileStorage));

  const [currentProfile, setCurrentProfileState] = useState<Profile | null>(() => {
    const savedId = readStoredCurrentProfileId(profileStorage);

    if (savedId && profiles.length > 0) {
      return profiles.find((profile) => profile.id === savedId) || null;
    }

    return null;
  });

  useEffect(() => {
    saveStoredProfiles(profileStorage, profiles);
  }, [profiles]);

  useEffect(() => {
    if (currentProfile) {
      saveStoredCurrentProfileId(profileStorage, currentProfile.id);
      return;
    }

    clearStoredCurrentProfileId(profileStorage);
  }, [currentProfile]);

  const setCurrentProfile = (profile: Profile | null) => {
    setCurrentProfileState(profile);
  };

  const createProfile = (name: string, avatar: Avatar) => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      name,
      avatar,
      createdAt: new Date().toISOString(),
      progress: [],
      settings: {
        soundEnabled: true,
        musicEnabled: true,
      },
    };
    setProfiles([...profiles, newProfile]);
    setCurrentProfileState(newProfile);
  };

  const updateProgress = (gameId: string, progressUpdate: Partial<GameProgress>) => {
    if (!currentProfile) return;

    const updatedProfiles = profiles.map(profile => {
      if (profile.id === currentProfile.id) {
        const existingProgress = profile.progress.find((progress) => progress.gameId === gameId);
        const updatedProgress = existingProgress
          ? { ...existingProgress, ...progressUpdate }
          : {
              gameId,
              completed: false,
              score: 0,
              stars: 0,
              lastPlayed: new Date().toISOString(),
              ...progressUpdate,
            };

        const newProgressArray = existingProgress
          ? profile.progress.map((progress) =>
              progress.gameId === gameId ? updatedProgress : progress,
            )
          : [...profile.progress, updatedProgress];

        return { ...profile, progress: newProgressArray };
      }
      return profile;
    });

    setProfiles(updatedProfiles);
    setCurrentProfileState(
      updatedProfiles.find((profile) => profile.id === currentProfile.id) || null,
    );
  };

  const updateSettings = (settingsUpdate: Partial<Profile["settings"]>) => {
    if (!currentProfile) return;

    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === currentProfile.id) {
        return {
          ...profile,
          settings: { ...profile.settings, ...settingsUpdate },
        };
      }
      return profile;
    });

    setProfiles(updatedProfiles);
    setCurrentProfileState(
      updatedProfiles.find((profile) => profile.id === currentProfile.id) || null,
    );
  };

  const deleteProfile = (id: string) => {
    setProfiles(profiles.filter((profile) => profile.id !== id));
    if (currentProfile?.id === id) {
      setCurrentProfileState(null);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        setCurrentProfile,
        createProfile,
        updateProgress,
        updateSettings,
        deleteProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

ProfileProvider.displayName = "ProfileProvider";

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
};
