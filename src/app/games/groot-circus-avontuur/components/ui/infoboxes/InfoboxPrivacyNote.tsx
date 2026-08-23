import React from "react";

/**
 * @uxId INFOBOX_PRIVACY_NOTE
 * @screens SCR_ZEG_VLIEG_START
 * @description Privacy garantiestempel (pil) die aangeeft dat er geen spraakopnames worden opgeslagen.
 */
export interface InfoboxPrivacyNoteProps {
  message?: string;
  className?: string;
}

export const InfoboxPrivacyNote: React.FC<InfoboxPrivacyNoteProps> = ({
  message = "We slaan geen opname op.",
  className = "",
}) => {
  return (
    <div
      className={`px-4 py-2 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-bold text-xs flex items-center justify-center gap-2 ${className}`}
    >
      <span className="text-sm">🛡️</span>
      <span>{message}</span>
    </div>
  );
};
