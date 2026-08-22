import React from "react";

/**
 * @uxId TTL_KEYBOARD_MODAL
 * @screens SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Titel voor de typ-zin overlay modal ('TYP DE ZIN').
 */
export interface TtlKeyboardModalProps {
  title?: string;
  className?: string;
  "data-testid"?: string;
}

export const TtlKeyboardModal: React.FC<TtlKeyboardModalProps> = ({
  title = "TYP DE ZIN",
  className = "",
  "data-testid": testId,
}) => {
  return (
    <h2
      data-testid={testId}
      className={`text-2xl font-black text-slate-900 text-center ${className}`}
    >
      {title}
    </h2>
  );
};
