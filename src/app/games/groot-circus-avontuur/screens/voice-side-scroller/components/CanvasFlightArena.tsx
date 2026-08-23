import React from "react";

/**
 * @uxId CANVAS_FLIGHT_ARENA
 * @screens SCR_ZEG_VLIEG_ACTIVE
 * @description Scrollende 2D-wereld waarin het personage vliegt en obstakels ontwijkt.
 */
export interface CanvasFlightArenaProps {
  children?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export const CanvasFlightArena: React.FC<CanvasFlightArenaProps> = ({
  children,
  className = "",
  "data-testid": testId = "canvas-flight-arena",
}) => {
  return (
    <div
      data-testid={testId}
      className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-amber-100 ${className}`}
    >
      {children}
    </div>
  );
};
