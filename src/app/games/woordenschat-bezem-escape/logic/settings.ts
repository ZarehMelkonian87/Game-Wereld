export interface BezemEscapeSettings {
  audioEnabled: boolean;
  hintsEnabled: boolean;
  reducedMotion: boolean;
}

export const defaultBezemEscapeSettings: BezemEscapeSettings = {
  audioEnabled: true,
  hintsEnabled: true,
  reducedMotion: false,
};

function getSettingsStorageKey(profileId: string) {
  return `woordenschat-bezem-escape:${profileId}:settings`;
}

export function readBezemEscapeSettings(profileId: string) {
  if (typeof window === "undefined") {
    return defaultBezemEscapeSettings;
  }

  const rawSettings = window.localStorage.getItem(getSettingsStorageKey(profileId));

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
}

export function saveBezemEscapeSettings(profileId: string, settings: BezemEscapeSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getSettingsStorageKey(profileId), JSON.stringify(settings));
}
