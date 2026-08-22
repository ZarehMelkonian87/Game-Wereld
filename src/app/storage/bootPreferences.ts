import { createProfileId, type ProfileId } from "../game-platform/contracts";

const activeProfileKey = "game-wereld-active-profile-id";
const legacyActiveProfileKey = "kids-game-current-profile";
const globalMuteKey = "game-wereld-global-mute";

const getLocalStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const readActiveProfileId = (): ProfileId | null => {
  try {
    const value =
      getLocalStorage()?.getItem(activeProfileKey) ??
      getLocalStorage()?.getItem(legacyActiveProfileKey);
    return value?.trim() ? createProfileId(value) : null;
  } catch {
    return null;
  }
};

export const saveActiveProfileId = (profileId: ProfileId | null) => {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    if (profileId) {
      storage.setItem(activeProfileKey, profileId);
    } else {
      storage.removeItem(activeProfileKey);
    }
  } catch {
    // Dit is een niet-kritieke bootvoorkeur; de repositorydata blijft intact.
  }
};

export const readGlobalMute = () => {
  try {
    return getLocalStorage()?.getItem(globalMuteKey) === "true";
  } catch {
    return false;
  }
};

export const saveGlobalMute = (muted: boolean) => {
  try {
    getLocalStorage()?.setItem(globalMuteKey, String(muted));
  } catch {
    // Mute blijft lokaal in React-state werken wanneer de bootvoorkeur niet schrijfbaar is.
  }
};
