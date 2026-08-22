import React from "react";

/**
 * @uxId TTL_HEADER_PILL
 * @screens SCR_ADVENTURE_SELECT | SCR_SETTINGS_PRIVACY | SCR_REWARD_SUMMARY
 * @description Witte afgeronde pill-header voor hoofdschermtitels.
 */
export interface TtlHeaderPillProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export const TtlHeaderPill: React.FC<TtlHeaderPillProps> = ({
  title,
  children,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center px-6 py-2 bg-white text-slate-800 font-extrabold text-xl rounded-full shadow-md border border-slate-200 text-center ${className}`}
      data-testid={testId}
    >
      {children ?? title}
    </div>
  );
};
