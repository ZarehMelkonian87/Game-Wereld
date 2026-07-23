import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "./classNames";
interface RibbonTitleProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export const RibbonTitle = ({ children, className, ...titleProps }: RibbonTitleProps) => {
  return (
    <div
      {...titleProps}
      className={classNames(
        "mx-auto inline-flex min-h-12 max-w-full items-center justify-center rounded-2xl border-2 border-sky-700 bg-sky-500 px-5 py-2 text-center text-lg font-black leading-tight text-white shadow-[0_4px_0_rgba(3,105,161,0.75)]",
        className,
      )}
    >
      <span className="truncate">{children}</span>
    </div>
  );
};
