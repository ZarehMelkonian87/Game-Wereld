export const modeCardToneClasses = {
  amber: {
    icon: "bg-amber-100 text-amber-700",
    root: "from-amber-100/95 via-white/90 to-yellow-100/90",
    shadow: "shadow-[0_6px_0_rgba(180,83,9,0.18)]",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-700",
    root: "from-emerald-100/95 via-white/90 to-teal-100/90",
    shadow: "shadow-[0_6px_0_rgba(4,120,87,0.18)]",
  },
  sky: {
    icon: "bg-sky-100 text-sky-700",
    root: "from-sky-100/95 via-white/90 to-cyan-100/90",
    shadow: "shadow-[0_6px_0_rgba(14,116,144,0.18)]",
  },
} as const;

export type ModeCardTone = keyof typeof modeCardToneClasses;
