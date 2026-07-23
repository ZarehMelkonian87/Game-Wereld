import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { createProfileId, type Avatar, type Profile } from "../game-platform";
import {
  profileRecordSchema,
  profileSettingsRecordSchema,
  readActiveProfileId,
  saveActiveProfileId,
  useStorageRepositories,
  type ProfileRecord,
  type StorageApplicationError,
} from "../storage";

interface ProfileContextType {
  createProfile: (name: string, avatar: Avatar) => Promise<void>;
  currentProfile: Profile | null;
  deleteProfile: (id: string) => Promise<void>;
  profiles: Profile[];
  setCurrentProfile: (profile: Profile | null) => void;
  updateSettings: (settings: Partial<Profile["settings"]>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
const defaultSettings = { musicEnabled: true, soundEnabled: true };

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { repositories } = useStorageRepositories();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfileState] = useState<Profile | null>(null);
  const [status, setStatus] = useState<"error" | "loading" | "ready">("loading");
  const [error, setError] = useState<StorageApplicationError | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);

  const buildProfileView = useCallback(
    async (record: ProfileRecord): Promise<Profile> => {
      const profileId = createProfileId(record.id);
      const [settings, projections] = await Promise.all([
        repositories.settings.getProfileSettings(profileId),
        repositories.progress.listForProfile(profileId),
      ]);
      return {
        avatar: record.avatar,
        createdAt: record.createdAt,
        id: record.id,
        name: record.name,
        progress: projections.map((projection) => ({
          completed: projection.status === "confident",
          gameId: projection.gameId,
          lastPlayed: projection.lastPracticedAt ?? projection.calculatedAt,
          score: projection.score,
          stars: projection.stars,
        })),
        settings: settings
          ? {
              musicEnabled: settings.musicEnabled,
              soundEnabled: settings.soundEnabled,
            }
          : defaultSettings,
      };
    },
    [repositories.progress, repositories.settings],
  );

  const reloadProfiles = useCallback(async () => {
    setStatus("loading");
    try {
      const records = await repositories.profiles.list();
      const nextProfiles = await Promise.all(records.map(buildProfileView));
      const activeProfileId = readActiveProfileId();
      setProfiles(nextProfiles);
      setCurrentProfileState(
        activeProfileId
          ? (nextProfiles.find((profile) => profile.id === activeProfileId) ?? null)
          : null,
      );
      setError(null);
      setStatus("ready");
    } catch (caughtError) {
      setError(caughtError as StorageApplicationError);
      setStatus("error");
    }
  }, [buildProfileView, repositories.profiles]);

  useEffect(() => {
    void reloadProfiles();
  }, [reloadProfiles, reloadVersion]);

  const setCurrentProfile = useCallback((profile: Profile | null) => {
    setCurrentProfileState(profile);
    saveActiveProfileId(profile ? createProfileId(profile.id) : null);
  }, []);

  const createProfile = useCallback(
    async (name: string, avatar: Avatar) => {
      const now = new Date().toISOString();
      const profileId = createProfileId(crypto.randomUUID());
      const record = profileRecordSchema.parse({
        avatar,
        contractVersion: 1,
        createdAt: now,
        id: profileId,
        name,
        updatedAt: now,
      });
      const settings = profileSettingsRecordSchema.parse({
        contractVersion: 1,
        musicEnabled: true,
        profileId,
        soundEnabled: true,
        updatedAt: now,
      });
      await repositories.profiles.create(record, settings);
      const profile = await buildProfileView(record);
      setProfiles((current) => [...current, profile]);
      setCurrentProfile(profile);
    },
    [buildProfileView, repositories.profiles, setCurrentProfile],
  );

  const updateSettings = useCallback(
    async (patch: Partial<Profile["settings"]>) => {
      if (!currentProfile) return;
      const profileId = createProfileId(currentProfile.id);
      const currentSettings =
        (await repositories.settings.getProfileSettings(profileId)) ??
        profileSettingsRecordSchema.parse({
          contractVersion: 1,
          musicEnabled: true,
          profileId,
          soundEnabled: true,
          updatedAt: new Date().toISOString(),
        });
      const nextSettings = profileSettingsRecordSchema.parse({
        ...currentSettings,
        ...patch,
        updatedAt: new Date().toISOString(),
      });
      await repositories.settings.putProfileSettings(nextSettings);
      setProfiles((current) =>
        current.map((profile) =>
          profile.id === profileId
            ? { ...profile, settings: { ...profile.settings, ...patch } }
            : profile,
        ),
      );
      setCurrentProfileState((profile) =>
        profile ? { ...profile, settings: { ...profile.settings, ...patch } } : null,
      );
    },
    [currentProfile, repositories.settings],
  );

  const deleteProfile = useCallback(
    async (id: string) => {
      const profileId = createProfileId(id);
      await repositories.profiles.deleteCascade(profileId);
      setProfiles((current) => current.filter((profile) => profile.id !== id));
      setCurrentProfileState((profile) => {
        if (profile?.id !== id) return profile;
        saveActiveProfileId(null);
        return null;
      });
    },
    [repositories.profiles],
  );

  if (status === "loading") {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-slate-950 text-white"
        role="status"
      >
        Profielen laden…
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
        <section
          className="space-y-4 rounded-3xl border border-red-400 bg-slate-900 p-6"
          role="alert"
        >
          <h1 className="text-2xl font-black">Profielen konden niet laden</h1>
          <p>{error?.message ?? "Onbekende opslagfout."}</p>
          <button
            className="min-h-12 rounded-xl bg-cyan-500 px-5 font-bold text-slate-950"
            onClick={() => setReloadVersion((value) => value + 1)}
            type="button"
          >
            Opnieuw proberen
          </button>
        </section>
      </main>
    );
  }

  return (
    <ProfileContext.Provider
      value={{
        createProfile,
        currentProfile,
        deleteProfile,
        profiles,
        setCurrentProfile,
        updateSettings,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

ProfileProvider.displayName = "ProfileProvider";

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within ProfileProvider");
  return context;
};
