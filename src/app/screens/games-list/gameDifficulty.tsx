import { Flame, Zap } from "lucide-react";
import type { MiniGame } from "../../data/games";

type Difficulty = MiniGame["difficulty"];

export const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return "from-green-500 to-emerald-600";
    case "medium":
      return "from-yellow-500 to-orange-600";
    case "hard":
      return "from-red-500 to-pink-600";
    default:
      return "from-gray-500 to-gray-600";
  }
};

export const getDifficultyText = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return "EASY";
    case "medium":
      return "MEDIUM";
    case "hard":
      return "HARD";
    default:
      return difficulty;
  }
};

export const getDifficultyIcon = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return <Zap className="w-3 h-3" />;
    case "medium":
    case "hard":
      return <Flame className="w-3 h-3" />;
    default:
      return null;
  }
};
