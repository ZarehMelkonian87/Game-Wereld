import React from "react";

/**
 * @uxId CARD_TASK_HEADER
 * @screens SCR_ZEG_ZET_GAME
 * @description Header container met de te voltooien instructie en actieknoppen.
 */
export interface CardTaskHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const CardTaskHeader: React.FC<CardTaskHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`p-4 bg-white/95 rounded-3xl border-2 border-sky-200 shadow-md flex items-center justify-between gap-3 ${className}`}>
      {children}
    </div>
  );
};
