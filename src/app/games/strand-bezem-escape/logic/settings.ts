export interface BezemEscapeSettings {
  audioEnabled: boolean;
  hintsEnabled: boolean;
  musicEnabled: boolean;
  reducedMotion: boolean;
}
export const BEZEM_ESCAPE_SETTINGS_CHANGED_EVENT = "strand-bezem-escape:settings-changed";
export const defaultBezemEscapeSettings: BezemEscapeSettings = {
  audioEnabled: true,
  hintsEnabled: true,
  musicEnabled: true,
  reducedMotion: false,
};
const getSettingsStorageKey = (profileId: string) => {
  return `strand-bezem-escape:${profileId}:settings`;
};
export const readBezemEscapeSettings = (profileId: string, storage: RuntimeStorage) => {
  const rawSettings = storage.get(getSettingsStorageKey(profileId));
  if (!rawSettings) {
    return defaultBezemEscapeSettings;
  }
  try {
    return {
      ...defaultBezemEscapeSettings,
      ...(JSON.parse(rawSettings) as Partial<BezemEscapeSettings>),
    };
  } catch {
    return defaultBezemEscapeSettings;
  }
};
export const saveBezemEscapeSettings = (
  profileId: string,
  settings: BezemEscapeSettings,
  storage: RuntimeStorage,
) => {
  storage.set(getSettingsStorageKey(profileId), JSON.stringify(settings));
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(BEZEM_ESCAPE_SETTINGS_CHANGED_EVENT, {
        detail: {
          profileId,
          settings,
        },
      }),
    );
  }
};
import type { RuntimeStorage } from "../../../game-platform/contracts";
