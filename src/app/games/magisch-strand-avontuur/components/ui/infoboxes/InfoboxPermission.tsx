import React from "react";

/**
 * @uxId INFOBOX_PERMISSION_NOTICE
 * @uxId INFOBOX_MIC_BLOCKED_ALERT
 * @screens SCR_SETTINGS_PRIVACY
 * @description Meldingen en waarschuwingskaders over microfoontoestemming en blokkade.
 */
export interface InfoboxPermissionProps {
  variant?: "notice" | "blocked";
  message?: string;
  className?: string;
}

export const InfoboxPermission: React.FC<InfoboxPermissionProps> = ({
  variant = "notice",
  message,
  className = "",
}) => {
  if (variant === "blocked") {
    return (
      <div
        className={`p-4 bg-rose-50 text-rose-900 border-2 border-rose-300 rounded-2xl flex items-start gap-3 text-sm font-semibold leading-relaxed ${className}`}
      >
        <span className="text-xl">⚠️</span>
        <p>
          {message ||
            "Microfoon is geblokkeerd. Zet microfoontoegang aan in de browserinstellingen van je apparaat."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-amber-50 text-amber-900 border border-amber-300 rounded-2xl flex items-start gap-3 text-sm font-medium leading-relaxed ${className}`}
    >
      <span className="text-xl">🔒</span>
      <p>
        {message ||
          "Deze pagina mag een browser-popup voor microfoontoestemming tonen om te kunnen vliegen en spreken."}
      </p>
    </div>
  );
};
