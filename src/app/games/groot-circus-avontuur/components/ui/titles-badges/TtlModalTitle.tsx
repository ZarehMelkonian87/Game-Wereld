import React from "react";

/**
 * @uxId TTL_MODAL_TITLE
 * @uxId TTL_KEYBOARD_MODAL
 * @screens SCR_ZEG_VLIEG_START | SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Donkerblauwe vetgedrukte titel voor instructie- en typ modals.
 */
export interface TtlModalTitleProps {
  title: string;
  className?: string;
}

export const TtlModalTitle: React.FC<TtlModalTitleProps> = ({ title, className = "" }) => {
  return (
    <h2 className={`text-2xl font-black text-slate-800 text-center tracking-wide ${className}`}>
      {title}
    </h2>
  );
};
