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
  // Categorie: Speciale Woordenschat
  {
    id: "strand-bezem-escape",
    themeId: "vocabulary",
    name: "Magisch Strand-Avontuur",
    description: "Zeg en zet stickers op het strand, speel het woordzoekerspel en vlieg door de wolken!",
    difficulty: "easy",
    icon: "world-beach.png",
  },
  // Categorie: Taal & Lezen
  {
    id: "taal-strand-bezem-escape",
    themeId: "language",
    name: "Taal Strand-Avontuur",
    description: "Oefen woordjes, spelling en klanken op het magische strand!",
    difficulty: "easy",
    icon: "world-beach.png",
  },
  // Categorie: Rekenen & Getallen
  {
    id: "rekenen-strand-bezem-escape",
    themeId: "math",
    name: "Rekenen Strand-Avontuur",
    description: "Los getallenraadsels en splitsingen op rondom de zee!",
    difficulty: "easy",
    icon: "world-beach.png",
  },
  // Categorie: Wereldoriëntatie
  {
    id: "wereld-strand-bezem-escape",
    themeId: "world",
    name: "Wereld Strand-Avontuur",
    description: "Ontdek de natuur, zee, dieren en het weer op het strand!",
    difficulty: "easy",
    icon: "world-beach.png",
  },
];
