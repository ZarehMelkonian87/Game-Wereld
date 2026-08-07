import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "./classNames";

/**
 * @uxId TTL_HEADER_PILL
 * @uxId LBL_SECTION_TITLE
 * @screens SCR_ADVENTURE_SELECT | SCR_SETTINGS_PRIVACY | SCR_REWARD_SUMMARY
 * @description Canonieke titel-sticker / header pill voor het interface-systeem.
 */
interface RibbonTitleProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export const RibbonTitle = ({ children, className, ...titleProps }: RibbonTitleProps) => {
  return (
    <div
      {...titleProps}
      className={classNames(
        "mx-auto inline-flex min-h-12 max-w-full items-center justify-center rounded-2xl border-2 border-sky-200 bg-white px-5 py-2 text-center text-lg font-black leading-tight text-slate-900 shadow-[0_4px_0_rgba(2,132,199,0.16)]",
        className,
      )}
      data-component="RibbonTitle"
    >
      <span className="truncate">{children}</span>
    </div>
  );
};

RibbonTitle.displayName = "RibbonTitle";
