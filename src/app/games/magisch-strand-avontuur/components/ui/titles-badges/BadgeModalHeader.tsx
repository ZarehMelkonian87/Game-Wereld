import React from "react";

/**
 * @uxId BADGE_MODAL_STAR_HEADER
 * @uxId BADGE_KEYBOARD_HEADER
 * @screens SCR_ZEG_VLIEG_START | SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Decoratieve badge of mascotte-icoon bovenaan modals.
 */
export interface BadgeModalHeaderProps {
  icon?: React.ReactNode;
  variant?: "star" | "keyboard";
  className?: string;
}

export const BadgeModalHeader: React.FC<BadgeModalHeaderProps> = ({
  icon,
  variant = "star",
  className = "",
}) => {
  const bgStyle =
    variant === "star"
      ? "bg-amber-400 text-slate-900 border-amber-500"
      : "bg-sky-500 text-white border-sky-600";

  return (
    <div
      className={`w-14 h-14 rounded-2xl border-2 shadow-md flex items-center justify-center -mt-10 mx-auto ${bgStyle} ${className}`}
    >
      {icon ? (
        icon
      ) : variant === "star" ? (
        <span className="text-2xl">⭐</span>
      ) : (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-3 0h2v2H5v-2zm0-3h2v2H5V8zm11 10H8v-2h8v2zm1-3h-2v-2h2v2zm0-3h-2V8h2v2z" />
        </svg>
      )}
    </div>
  );
};
