import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "./classNames";

/**
 * Canonieke titel-sticker voor het interface-systeem (UX-103). Vervangt de
 * vier eerdere koptekststijlen (logo, witte pill, blauwe 3D-app-pill en de
 * losse belonings-kop) door één neutrale, hoog-contrast sticker die op de
 * lichte strandachtergrond leesbaar blijft. Menuschermen adopteren deze
 * component in Groep 2. Zie docs/ux/interface-redesign-takenlijst.md.
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
