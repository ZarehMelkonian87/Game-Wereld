import React from "react";
import { startLogoUrl } from "../../../asset-urls";

/**
 * @uxId IMG_GAME_LOGO
 * @screens SCR_MAIN_TITLE
 * @description Visueel merklogo 'MAGISCH STRAND AVONTUUR' met 3D-effecten en strandthema.
 */
export interface ImgGameLogoProps {
  className?: string;
  "data-testid"?: string;
}

export const ImgGameLogo: React.FC<ImgGameLogoProps> = ({
  className = "",
  "data-testid": testId = "start-logo",
}) => {
  return (
    <img
      alt="+1 Woordenschat Bezem Escape"
      className={`select-none drop-shadow-[0_8px_0_rgba(21,48,74,0.16)] ${className}`}
      data-testid={testId}
      draggable={false}
      src={startLogoUrl}
    />
  );
};
