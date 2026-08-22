import React from "react";

/**
 * @uxId LBL_PRIVACY_DESC
 * @screens SCR_SETTINGS_PRIVACY
 * @description Omschrijvingstext over het niet bewaren van spraakopnames onder privacy-titel.
 */
export interface LblPrivacyDescProps {
  className?: string;
}

export const LblPrivacyDesc: React.FC<LblPrivacyDescProps> = ({ className = "" }) => {
  return (
    <p className={`text-xs font-semibold text-slate-700 leading-relaxed ${className}`}>
      De microfoon wordt alleen gebruikt om korte zinnen naar tekst om te zetten. We slaan geen
      opnames op.
    </p>
  );
};
