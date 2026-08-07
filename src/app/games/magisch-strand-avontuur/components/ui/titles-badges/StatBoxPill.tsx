import React from "react";

/**
 * @uxId STAT_BOX_GOED
 * @uxId STAT_BOX_TEMPO
 * @uxId STAT_BOX_HINTS
 * @uxId STAT_BOX_AUDIO
 * @uxId STAT_BOX_STERREN
 * @screens SCR_REWARD_SUMMARY
 * @description Statistiek-capsule pil voor resultatenoverzicht (Goed, Tempo, Hints, Audio, Sterren).
 */
export interface StatBoxPillProps {
  label: string;
  value: string | number;
  variant?: "goed" | "tempo" | "hints" | "audio" | "sterren";
  className?: string;
}

export const StatBoxPill: React.FC<StatBoxPillProps> = ({
  label,
  value,
  variant = "goed",
  className = "",
}) => {
  let styleClass = "bg-emerald-100 text-emerald-900 border-emerald-300";
  if (variant === "tempo") styleClass = "bg-sky-100 text-sky-900 border-sky-300";
  if (variant === "hints") styleClass = "bg-amber-100 text-amber-900 border-amber-300";
  if (variant === "audio") styleClass = "bg-slate-100 text-slate-900 border-slate-300";
  if (variant === "sterren") styleClass = "bg-yellow-100 text-yellow-900 border-yellow-400";

  return (
    <div
      className={`px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${styleClass} ${className}`}
    >
      <span>{label}:</span>
      <span className="text-sm font-black">{value}</span>
    </div>
  );
};
