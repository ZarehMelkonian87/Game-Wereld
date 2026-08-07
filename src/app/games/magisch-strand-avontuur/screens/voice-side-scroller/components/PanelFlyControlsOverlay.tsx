import React from "react";
import { BtnManualFlyUp, BtnManualFlyDown } from "../../../components/ui";

/**
 * @uxId PANEL_FLY_CONTROLS_OVERLAY
 * @screens SCR_ZEG_VLIEG_START
 * @description Besturingsbalk onderaan met actieknoppen voor handmatige besturing.
 */
export interface PanelFlyControlsOverlayProps {
  onFlyUp?: () => void;
  onFlyDown?: () => void;
  className?: string;
}

export const PanelFlyControlsOverlay: React.FC<PanelFlyControlsOverlayProps> = ({
  onFlyUp,
  onFlyDown,
  className = "",
}) => {
  return (
    <div className={`p-3 bg-white/90 rounded-2xl shadow flex items-center justify-between border border-slate-200 ${className}`}>
      <span className="text-xs font-bold text-slate-700">Handmatig sturen:</span>
      <div className="flex gap-2">
        <BtnManualFlyUp onClick={onFlyUp} />
        <BtnManualFlyDown onClick={onFlyDown} />
      </div>
    </div>
  );
};
