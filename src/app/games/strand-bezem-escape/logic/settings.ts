export interface BezemEscapeSettings {
  audioEnabled: boolean;
  hintsEnabled: boolean;
  musicEnabled: boolean;
  reducedMotion: boolean;
}

export const BEZEM_ESCAPE_SETTINGS_CHANGED_EVENT =
  "strand-bezem-escape:settings-changed";

export const defaultBezemEscapeSettings: BezemEscapeSettings = {
  audioEnabled: true,
  hintsEnabled: true,
  musicEnabled: true,
  reducedMotion: false,
};

function getSettingsStorageKey(profileId: string) {
  return `strand-bezem-escape:${profileId}:settings`;
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
  window.dispatchEvent(
    new CustomEvent(BEZEM_ESCAPE_SETTINGS_CHANGED_EVENT, {
      detail: {
        profileId,
        settings,
      },
    }),
  );
}
