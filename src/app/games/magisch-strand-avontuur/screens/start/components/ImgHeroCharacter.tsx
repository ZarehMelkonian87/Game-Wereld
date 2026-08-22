import React from "react";
import { avatarIconUrls } from "../../../asset-urls";

/**
 * @uxId IMG_HERO_CHARACTER
 * @screens SCR_MAIN_TITLE
 * @description Hero-illustratie van de jongen op de vliegende strandbezem met de regenboogster.
 */
export interface ImgHeroCharacterProps {
  className?: string;
  "data-testid"?: string;
}

export const ImgHeroCharacter: React.FC<ImgHeroCharacterProps> = ({
  className = "",
  "data-testid": testId = "start-hero",
}) => {
  return (
    <img
      alt="Jongen op vliegende bezem met ster"
      className={`select-none drop-shadow-[0_12px_0_rgba(21,48,74,0.18)] ${className}`}
      data-testid={testId}
      draggable={false}
      src={avatarIconUrls.avatar01}
    />
  );
};
