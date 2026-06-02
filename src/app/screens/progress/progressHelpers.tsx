import { Minus, TrendingDown, TrendingUp } from "lucide-react";

export const getProgressColor = (percentage: number) => {
  if (percentage >= 75) {
    return "from-green-500 to-emerald-600";
  }

  if (percentage >= 50) {
    return "from-yellow-500 to-orange-600";
  }

  return "from-orange-500 to-red-600";
};

export const getChangeColor = (change: number) => {
  if (change > 0) {
    return "text-green-400";
  }

  if (change < 0) {
    return "text-red-400";
  }

  return "text-yellow-400";
};

export const getChangeText = (change: number) => {
  if (change > 0) {
    return `+${change}%`;
  }

  if (change < 0) {
    return `${change}%`;
  }

  return "0%";
};

export const getChangeIcon = (change: number) => {
  if (change > 0) {
    return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />;
  }

  if (change < 0) {
    return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />;
  }

  return <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />;
};
