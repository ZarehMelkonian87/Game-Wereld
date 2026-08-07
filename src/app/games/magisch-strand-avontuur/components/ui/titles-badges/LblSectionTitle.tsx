import React from "react";

/**
 * @uxId LBL_SECTION_TITLE
 * @screens SCR_ADVENTURE_SELECT | SCR_REWARD_SUMMARY
 * @description Subtitel of sectielabel voor het scheiden van categorieën en contentblokken.
 */
export interface LblSectionTitleProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
  "data-testid"?: string;
}

export const LblSectionTitle: React.FC<LblSectionTitleProps> = ({
  children,
  title,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <h3
      className={`text-xs font-black uppercase tracking-wider text-slate-700 ${className}`}
      data-testid={testId}
    >
      {children ?? title}
    </h3>
  );
};
