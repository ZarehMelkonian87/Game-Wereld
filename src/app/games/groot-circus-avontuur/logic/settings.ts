import { z } from "zod";
import type { RuntimeStorage } from "../../../game-platform/contracts";

export const bezemEscapeSettingsSchema = z.object({
  audioEnabled: z.boolean(),
  hintsEnabled: z.boolean(),
  musicEnabled: z.boolean(),
  reducedMotion: z.boolean(),
});
export type BezemEscapeSettings = z.infer<typeof bezemEscapeSettingsSchema>;

export const MAGISCH_STRAND_AVONTUUR_SETTINGS_CHANGED_EVENT =
  "groot-circus-avontuur:settings-changed";
export const defaultBezemEscapeSettings: BezemEscapeSettings = {
  audioEnabled: true,
  hintsEnabled: true,
  musicEnabled: true,
  reducedMotion: false,
};

const getSettingsStorageKey = (profileId: string) => `groot-circus-avontuur:${profileId}:settings`;

export const readBezemEscapeSettings = (profileId: string, storage: RuntimeStorage) => {
  const rawSettings = storage.get(getSettingsStorageKey(profileId));
  if (!rawSettings) return defaultBezemEscapeSettings;
  try {
    return {
      ...defaultBezemEscapeSettings,
      ...bezemEscapeSettingsSchema.partial().parse(JSON.parse(rawSettings)),
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
  storage.set(
    getSettingsStorageKey(profileId),
    JSON.stringify(bezemEscapeSettingsSchema.parse(settings)),
  );
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(MAGISCH_STRAND_AVONTUUR_SETTINGS_CHANGED_EVENT, {
        detail: { profileId, settings },
      }),
    );
  }
};
