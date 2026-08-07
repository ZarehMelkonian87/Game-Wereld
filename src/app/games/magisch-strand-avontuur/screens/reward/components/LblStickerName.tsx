import React from "react";

/**
 * @uxId LBL_STICKER_NAME
 * @screens SCR_REWARD_SUMMARY
 * @description Tekstlabel onder de stickerweergave op het beloningsscherm.
 */
export interface LblStickerNameProps {
  name?: string;
  className?: string;
}

export const LblStickerName: React.FC<LblStickerNameProps> = ({
  name = "Schelp Sticker",
  className = "",
}) => {
  return (
    <h3 className={`font-black text-slate-900 text-lg ${className}`}>
      {name}
    </h3>
  );
};
