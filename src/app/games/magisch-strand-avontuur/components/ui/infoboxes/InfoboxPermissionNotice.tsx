import React from "react";

/**
 * @uxId INFOBOX_PERMISSION_NOTICE
 * @screens SCR_SETTINGS_PRIVACY
 * @description Lichtgeel infovak met oranje rand over de browser microfoon-popup toestemming.
 */
export interface InfoboxPermissionNoticeProps {
  className?: string;
}

export const InfoboxPermissionNotice: React.FC<InfoboxPermissionNoticeProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`p-3 bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs rounded-2xl flex items-center gap-2 ${className}`}
    >
      <span className="text-base">⚠️</span>
      <span>Deze pagina mag een browser-popup voor microfoontoestemming tonen.</span>
    </div>
  );
};
