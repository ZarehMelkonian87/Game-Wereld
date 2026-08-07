import React from "react";

/**
 * @uxId INFOBOX_SPEECH_STATUS
 * @screens SCR_SETTINGS_PRIVACY
 * @description Statusmelding met toelichting op beschikbaarheid van spraakherkenning.
 */
export interface InfoboxSpeechStatusProps {
  message?: string;
  className?: string;
}

export const InfoboxSpeechStatus: React.FC<InfoboxSpeechStatusProps> = ({
  message = "Spraakherkenning is beschikbaar. Als spraak niet werkt op telefoon, typ dezelfde zin.",
  className = "",
}) => {
  return (
    <div
      className={`p-4 bg-sky-50 text-sky-900 border border-sky-200 rounded-2xl flex items-start gap-3 text-sm font-medium leading-relaxed ${className}`}
    >
      <span className="text-xl">📱</span>
      <p>{message}</p>
    </div>
  );
};
