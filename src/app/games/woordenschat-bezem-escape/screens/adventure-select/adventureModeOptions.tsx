import { BookOpen, LockKeyhole, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import { broomIconUrls } from "../../asset-urls";
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

export const getAdventureModeOptions = (raceUnlocked: boolean): AdventureModeOption[] => [
  {
    description: "Luister naar de opdracht en zet het plaatje op de goede plek.",
    icon: <Volume2 className="h-6 w-6" strokeWidth={3} />,
    id: "listen-and-place",
    title: "Luister & Plaats",
    tone: "emerald",
  },
  {
    description: "Hoor een woord en kies het juiste plaatje.",
    icon: <BookOpen className="h-6 w-6" strokeWidth={3} />,
    id: "choose-word",
    title: "Kies het Woord",
    tone: "sky",
  },
  {
    description: "Vlieg met de bezem door korte taalopdrachten.",
    disabled: !raceUnlocked,
    icon: raceUnlocked ? (
      <img alt="" className="h-8 w-8 object-contain" draggable={false} src={broomIconUrls.basic} />
    ) : (
      <LockKeyhole className="h-6 w-6" strokeWidth={3} />
    ),
    id: "broom-escape-run",
    lockedLabel: raceUnlocked ? undefined : "Eerst scene klaar",
    title: "Bezem Race",
    tone: "amber",
  },
];
