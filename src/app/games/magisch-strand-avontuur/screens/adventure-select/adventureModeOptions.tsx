import { BookOpen, Blocks, MessageCircle, Mic2 } from "lucide-react";
import type { ReactNode } from "react";
import { getStarsUntilModeUnlock, isModeUnlocked } from "../../logic/mode-unlocks";
import type { BezemEscapeMode } from "../../types";

export interface AdventureModeOption {
  description: string;
  disabled?: boolean;
  icon: ReactNode;
  id: BezemEscapeMode;
  lockedLabel?: string;
  title: string;
  tone: "amber" | "emerald" | "sky";
}

// Volgorde volgt de leerlijn receptief → relationeel → productief (T-31).
const baseAdventureModeOptions: AdventureModeOption[] = [
  {
    description: "Hoor een woord en kies het juiste plaatje.",
    icon: <BookOpen className="h-6 w-6" strokeWidth={3} />,
    id: "choose-word",
    title: "Kies het Woord",
    tone: "sky",
  },
  {
    description: "Luister, spreek of typ en zet het plaatje op de goede plek.",
    icon: <MessageCircle className="h-6 w-6" strokeWidth={3} />,
    id: "listen-and-place",
    title: "Zeg & Zet",
    tone: "emerald",
  },
  {
    description: "Bouw zelf een strand: zeg meerdere dingen in één zin.",
    icon: <Blocks className="h-6 w-6" strokeWidth={3} />,
    id: "zeg-en-bouw",
    title: "Zeg & Bouw",
    tone: "sky",
  },
  {
    description: "Vlieg met je stem en zeg het strandwoord.",
    icon: <Mic2 className="h-6 w-6" strokeWidth={3} />,
    id: "zeg-en-vlieg",
    title: "Zeg & Vlieg",
    tone: "amber",
  },
];

const getLockedLabel = (mode: BezemEscapeMode, totalWordStars: number): string => {
  const starsToGo = getStarsUntilModeUnlock(mode, totalWordStars);

  return `🔒 Nog ${starsToGo} ${starsToGo === 1 ? "ster" : "sterren"} om te openen`;
};

/**
 * Bouwt de moduskaarten op met hun ontgrendel-status op basis van het
 * cumulatieve per-profiel sterrentotaal (T-31). Vergrendelde modi worden
 * `disabled` en tonen hoeveel sterren er nog nodig zijn.
 */
export const getAdventureModeOptions = (totalWordStars = 0): AdventureModeOption[] =>
  baseAdventureModeOptions.map((option) => {
    if (isModeUnlocked(option.id, totalWordStars)) {
      return option;
    }

    return {
      ...option,
      disabled: true,
      lockedLabel: getLockedLabel(option.id, totalWordStars),
    };
  });
