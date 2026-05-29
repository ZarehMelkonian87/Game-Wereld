import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface GameProgress {
  gameId: string;
  completed: boolean;
  score: number;
  stars: number;
  lastPlayed: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar: Avatar;
  createdAt: string;
  progress: GameProgress[];
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
  };
}

interface ProfileContextType {
  profiles: Profile[];
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile) => void;
  createProfile: (name: string, avatar: Avatar) => void;
  updateProgress: (gameId: string, progress: Partial<GameProgress>) => void;
  deleteProfile: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem("kids-game-profiles");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentProfile, setCurrentProfileState] = useState<Profile | null>(() => {
    const savedId = localStorage.getItem("kids-game-current-profile");
    if (savedId && profiles.length > 0) {
      return profiles.find(p => p.id === savedId) || null;
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem("kids-game-profiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem("kids-game-current-profile", currentProfile.id);
    }
  }, [currentProfile]);

  const setCurrentProfile = (profile: Profile) => {
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
        const existingProgress = profile.progress.find(p => p.gameId === gameId);
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
          ? profile.progress.map(p => (p.gameId === gameId ? updatedProgress : p))
          : [...profile.progress, updatedProgress];

        return { ...profile, progress: newProgressArray };
      }
      return profile;
    });

    setProfiles(updatedProfiles);
    setCurrentProfileState(updatedProfiles.find(p => p.id === currentProfile.id) || null);
  };

  const deleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
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
        deleteProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
