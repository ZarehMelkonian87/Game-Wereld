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
    id: "math",
    name: "Number Zone",
    icon: "🔢",
    color: "from-blue-500 to-cyan-600",
    description: "Battle met getallen!",
  },
  {
    id: "language",
    name: "Word Quest",
    icon: "📚",
    color: "from-green-500 to-emerald-600",
    description: "Verover de woordenwereld",
  },
  {
    id: "animals",
    name: "Beast Arena",
    icon: "🦁",
    color: "from-yellow-500 to-orange-600",
    description: "Ontdek wilde dieren",
  },
  {
    id: "colors",
    name: "Color Blast",
    icon: "🎨",
    color: "from-pink-500 to-rose-600",
    description: "Explosie van kleuren",
  },
  {
    id: "shapes",
    name: "Shape Shift",
    icon: "🔷",
    color: "from-purple-500 to-violet-600",
    description: "Vorm avonturen",
  },
  {
    id: "memory",
    name: "Brain Power",
    icon: "🧠",
    color: "from-indigo-500 to-blue-700",
    description: "Test je skills",
  },
  {
    id: "puzzle",
    name: "Puzzle Master",
    icon: "🧩",
    color: "from-red-500 to-pink-600",
    description: "Los de challenges op",
  },
  {
    id: "music",
    name: "Beat Zone",
    icon: "🎵",
    color: "from-cyan-500 to-teal-600",
    description: "Maak epic beats",
  },
];

export const miniGames: MiniGame[] = [
  // Number Zone games
  {
    id: "add-numbers",
    themeId: "math",
    name: "Addition Attack",
    description: "Tel super snel op!",
    difficulty: "easy",
    icon: "➕",
  },
  {
    id: "subtract-numbers",
    themeId: "math",
    name: "Minus Mission",
    description: "Trek af en win!",
    difficulty: "medium",
    icon: "➖",
  },
  {
    id: "count-objects",
    themeId: "math",
    name: "Count Challenge",
    description: "Tel zo snel mogelijk",
    difficulty: "easy",
    icon: "🔢",
  },

  // Word Quest games
  {
    id: "abc-learn",
    themeId: "language",
    name: "ABC Battle",
    description: "Meester de letters!",
    difficulty: "easy",
    icon: "🔤",
  },
  {
    id: "word-match",
    themeId: "language",
    name: "Word Warrior",
    description: "Match de woorden",
    difficulty: "medium",
    icon: "📝",
  },
  {
    id: "woordenschat-bezem-escape",
    themeId: "language",
    name: "+1 Bezem Escape",
    description: "Luister, plaats en race met woorden",
    difficulty: "easy",
    icon: "🧹",
  },

  // Beast Arena games
  {
    id: "animal-sounds",
    themeId: "animals",
    name: "Sound Safari",
    description: "Raad het geluid!",
    difficulty: "easy",
    icon: "🔊",
  },
  {
    id: "animal-match",
    themeId: "animals",
    name: "Beast Hunt",
    description: "Vind alle beesten",
    difficulty: "easy",
    icon: "🐾",
  },

  // Color Blast games
  {
    id: "color-match",
    themeId: "colors",
    name: "Color Clash",
    description: "Match de kleuren!",
    difficulty: "easy",
    icon: "🌈",
  },
  {
    id: "color-mix",
    themeId: "colors",
    name: "Mix Master",
    description: "Mix epic kleuren",
    difficulty: "medium",
    icon: "🎨",
  },

  // Shape Shift games
  {
    id: "shape-match",
    themeId: "shapes",
    name: "Shape Smash",
    description: "Vind de vorm!",
    difficulty: "easy",
    icon: "⬜",
  },
  {
    id: "shape-puzzle",
    themeId: "shapes",
    name: "Form Fighter",
    description: "Los de puzzel op",
    difficulty: "medium",
    icon: "🧩",
  },

  // Brain Power games
  {
    id: "memory-cards",
    themeId: "memory",
    name: "Memory Madness",
    description: "Vind de matches",
    difficulty: "medium",
    icon: "🃏",
  },
  {
    id: "sequence-remember",
    themeId: "memory",
    name: "Sequence Star",
    description: "Onthoud de combo",
    difficulty: "hard",
    icon: "🔄",
  },

  // Puzzle Master games
  {
    id: "jigsaw-easy",
    themeId: "puzzle",
    name: "Jigsaw Hero",
    description: "Maak het compleet",
    difficulty: "easy",
    icon: "🖼️",
  },
  {
    id: "sliding-puzzle",
    themeId: "puzzle",
    name: "Slide Master",
    description: "Schuif naar de win",
    difficulty: "hard",
    icon: "⬆️",
  },

  // Beat Zone games
  {
    id: "piano-play",
    themeId: "music",
    name: "Piano Pro",
    description: "Speel de beats",
    difficulty: "easy",
    icon: "🎹",
  },
  {
    id: "rhythm-match",
    themeId: "music",
    name: "Rhythm Rush",
    description: "Volg het ritme",
    difficulty: "medium",
    icon: "🥁",
  },
];
