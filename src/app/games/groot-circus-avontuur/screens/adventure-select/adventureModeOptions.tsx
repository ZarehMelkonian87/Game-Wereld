import { BookOpen, MessageCircle, Mic2 } from "lucide-react";
import type { ReactNode } from "react";
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

export const getAdventureModeOptions = (): AdventureModeOption[] => [
  {
    description: "Luister, spreek of typ en zet het plaatje op de goede plek.",
    icon: <MessageCircle className="h-6 w-6" strokeWidth={3} />,
    id: "listen-and-place",
    title: "Zeg & Zet",
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
    description: "Vlieg met je stem en zeg het circuswoord.",
    icon: <Mic2 className="h-6 w-6" strokeWidth={3} />,
    id: "zeg-en-vlieg",
    title: "Zeg & Vlieg",
    tone: "amber",
  },
];
