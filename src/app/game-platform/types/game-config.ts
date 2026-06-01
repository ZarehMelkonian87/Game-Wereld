export type GameOrientation = "landscape" | "portrait";

export interface GameConfig {
  ageRange: string;
  category: string;
  defaultWorldId?: string;
  hasProgressDashboard?: boolean;
  hasSpeechInput?: boolean;
  id: string;
  supportedOrientations: GameOrientation[];
  title: string;
}

