import React from "react";

/**
 * @uxId INFOBOX_MIC_BLOCKED_ALERT
 * @screens SCR_SETTINGS_PRIVACY
 * @description Oranje/rood omrand waarschuwingsvak wanneer de microfoon door de gebruiker is geblokkeerd.
 */
export interface InfoboxMicBlockedAlertProps {
  className?: string;
}

export const InfoboxMicBlockedAlert: React.FC<InfoboxMicBlockedAlertProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`p-3 bg-red-50 text-red-900 border border-red-300 font-bold text-xs rounded-2xl flex items-center gap-2 ${className}`}
    >
      <span className="text-base">🚫</span>
      <span>Microfoon is geblokkeerd. Zet microfoontoegang aan in de browserinstellingen...</span>
    </div>
  );
};
