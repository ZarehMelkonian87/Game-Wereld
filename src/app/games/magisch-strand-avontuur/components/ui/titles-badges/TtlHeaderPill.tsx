import React from "react";

/**
 * @uxId TTL_HEADER_PILL
 * @uxId LBL_SECTION_TITLE
 * @screens SCR_ADVENTURE_SELECT | SCR_SETTINGS_PRIVACY | SCR_REWARD_SUMMARY
 * @description Witte afgeronde pill-header voor schermtitels en secties.
 */
export interface TtlHeaderPillProps {
  title: string;
  className?: string;
}

export const TtlHeaderPill: React.FC<TtlHeaderPillProps> = ({
  title,
  className = "",
}) => {
  return (
    <div
      className={`px-6 py-2 bg-white text-slate-800 font-extrabold text-xl rounded-full shadow-md border border-slate-200 text-center ${className}`}
    >
      {title}
    </div>
  );
};
