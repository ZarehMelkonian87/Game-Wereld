import React from "react";

/**
 * @uxId CARD_PRIVACY_SECTION
 * @screens SCR_SETTINGS_PRIVACY
 * @description Gele achtergrondkaart met schild-icoon die alle microfoon- en privacy-informatie bundelt.
 */
export interface CardPrivacySectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const CardPrivacySection: React.FC<CardPrivacySectionProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 shadow-sm space-y-3 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">🛡️</span>
        <h3 className="font-extrabold text-amber-950 text-base">Microfoon en privacy</h3>
      </div>
      {children}
    </div>
  );
};
