export interface GameTheme {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface MiniGame {
  id: string;
  themeId: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  icon: string;
}

export const gameThemes: GameTheme[] = [
  {
    id: "language",
    name: "Taal & Lezen",
    icon: "📖",
    color: "from-green-500 to-emerald-600",
    description: "Letters, spelling en vloeiend lezen!",
  },
  {
    id: "math",
    name: "Rekenen & Getallen",
    icon: "🧮",
    color: "from-blue-500 to-indigo-600",
    description: "Tellen, optellen, aftrekken en klokkijken!",
  },
  {
    id: "vocabulary",
    name: "Speciale Woordenschat",
    icon: "🎯",
    color: "from-amber-400 to-orange-500",
    description: "Vergroot spelenderwijs je woordenschat!",
  },
  {
    id: "world",
    name: "Wereldoriëntatie",
    icon: "🌍",
    color: "from-teal-500 to-cyan-600",
    description: "Seizoenen, natuur, dieren en verkeer!",
  },
];

export const miniGames: MiniGame[] = [
  {
    id: "woordenschat-bezem-escape",
    themeId: "vocabulary",
    name: "Bezem Escape",
    description: "Luister naar de opdrachten, zet de stickers op de juiste plek en vlieg weg!",
    difficulty: "easy",
    icon: "🧹",
  },
];
