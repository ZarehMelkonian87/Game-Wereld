import type { GameProgress } from "../progress";

export interface Avatar {
  color: string;
  emoji: string;
  id: string;
  name: string;
}

export interface ProfileSettings {
  musicEnabled: boolean;
  soundEnabled: boolean;
}

export interface Profile {
  avatar: Avatar;
  createdAt: string;
  id: string;
  name: string;
  progress: GameProgress[];
  settings: ProfileSettings;
}

export interface GameProfileSummary {
  avatarId?: string;
  displayName: string;
  id: string;
}
