import { isLoadableGameEntry } from "../game-platform/contracts";
import { gameRegistry, getGameRegistryEntry } from "../games";

export interface GameTheme {
  color: string;
  description: string;
  icon: string;
  id: string;
  name: string;
}

export interface MiniGame {
  cardImageUrl?: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  icon: string;
  id: string;
  name: string;
  releaseStatus: "available" | "beta" | "coming-soon";
  themeId: string;
}

export const gameThemes: GameTheme[] = [
  {
    color: "from-green-500 to-emerald-600",
    description: "Letters, spelling en vloeiend lezen!",
    icon: "📖",
    id: "language",
    name: "Taal & Lezen",
  },
  {
    color: "from-blue-500 to-indigo-600",
    description: "Tellen, optellen, aftrekken en klokkijken!",
    icon: "🧮",
    id: "math",
    name: "Rekenen & Getallen",
  },
  {
    color: "from-amber-400 to-orange-500",
    description: "Vergroot spelenderwijs je woordenschat!",
    icon: "🎯",
    id: "vocabulary",
    name: "Speciale Woordenschat",
  },
  {
    color: "from-teal-500 to-cyan-600",
    description: "Seizoenen, natuur, dieren en verkeer!",
    icon: "🌍",
    id: "world",
    name: "Wereldoriëntatie",
  },
];

/**
 * Een game is speelbaar als er code voor geladen kan worden én hij niet als
 * "binnenkort" is gemarkeerd. Alles wat niet speelbaar is, toont in de app een
 * vergrendelde kaart met "Binnenkort beschikbaar" — ook een game die wel in de
 * registry staat maar nog niet klaar is (zoals Groot Circus-Avontuur).
 */
export const isPlayableGame = (game: Pick<MiniGame, "id" | "releaseStatus">): boolean => {
  const entry = getGameRegistryEntry(game.id);
  return Boolean(entry && isLoadableGameEntry(entry)) && game.releaseStatus !== "coming-soon";
};

export const COMING_SOON_LABEL = "Binnenkort beschikbaar";

export const miniGames: MiniGame[] = Object.values(gameRegistry).map(({ manifest }) => ({
  cardImageUrl: manifest.cardImageUrl,
  description: manifest.description,
  difficulty: "easy",
  icon: manifest.icon,
  id: manifest.id,
  name: manifest.title,
  releaseStatus: manifest.releaseStatus,
  themeId: manifest.themeId,
}));
