import React from "react";

/**
 * @uxId CANVAS_BEACH_OCEAN_SCENE
 * @screens SCR_ZEG_ZET_GAME
 * @description Achtergrond met interactieve dropposities (zee, strand, palmeiland) voor Zeg & Zet.
 */
export interface CanvasBeachOceanSceneProps {
  children?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export const CanvasBeachOceanScene: React.FC<CanvasBeachOceanSceneProps> = ({
  children,
  className = "",
  "data-testid": testId = "canvas-beach-ocean-scene",
}) => {
  return (
    <div
      data-testid={testId}
      className={`relative w-full h-full overflow-hidden bg-sky-200 ${className}`}
    >
      {children}
    </div>
  );
};
