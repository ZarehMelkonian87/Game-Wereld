import React from "react";
import { BtnTrayNext } from "../../../components/ui";

/**
 * @uxId TRAY_STICKER_PALETTE
 * @screens SCR_ZEG_ZET_GAME
 * @description Onderste carrousel met sleepbare objectstickers en bladerknop.
 */
export interface TrayStickerPaletteProps {
  children?: React.ReactNode;
  onNext?: () => void;
  className?: string;
}

export const TrayStickerPalette: React.FC<TrayStickerPaletteProps> = ({
  children,
  onNext,
  className = "",
}) => {
  return (
    <div className={`p-3 bg-amber-100/90 rounded-3xl border border-amber-300 shadow flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3 overflow-x-auto">
        {children}
      </div>
      <BtnTrayNext onClick={onNext} />
    </div>
  );
};
