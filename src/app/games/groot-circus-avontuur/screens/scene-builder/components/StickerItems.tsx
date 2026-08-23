import React from "react";

/**
 * @uxId STICKER_ITEMS
 * @screens SCR_ZEG_ZET_GAME
 * @description Sleepbare sticker (Dolfijn, Boot, Vuurtoren, Vliegtuig, Vlieger).
 */
export interface StickerItemsProps {
  label: string;
  icon?: string;
  onDragStart?: () => void;
  className?: string;
}

export const StickerItems: React.FC<StickerItemsProps> = ({
  label,
  icon = "⛵",
  onDragStart,
  className = "",
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`p-3 bg-white rounded-2xl shadow border border-amber-200 flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform ${className}`}
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-xs font-bold text-slate-800">{label}</span>
    </div>
  );
};
