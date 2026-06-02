import type { GameStorage } from "../storage";
import type { Profile } from "./profile.types";

const profilesStorageKey = "kids-game-profiles";
const currentProfileStorageKey = "kids-game-current-profile";

const readJson = <TValue,>(storage: GameStorage, key: string, fallback: TValue): TValue => {
  const savedValue = storage.getItem(key);

  if (!savedValue) {
    return fallback;
  }

  try {
    return JSON.parse(savedValue) as TValue;
  } catch {
    return fallback;
  }
};

export const readStoredProfiles = (storage: GameStorage): Profile[] =>
  readJson<Profile[]>(storage, profilesStorageKey, []);

export const saveStoredProfiles = (storage: GameStorage, profiles: Profile[]) => {
  storage.setItem(profilesStorageKey, JSON.stringify(profiles));
};

export const readStoredCurrentProfileId = (storage: GameStorage): string | null =>
  storage.getItem(currentProfileStorageKey);

export const saveStoredCurrentProfileId = (storage: GameStorage, profileId: string) => {
  storage.setItem(currentProfileStorageKey, profileId);
};

export const clearStoredCurrentProfileId = (storage: GameStorage) => {
  storage.removeItem(currentProfileStorageKey);
};
