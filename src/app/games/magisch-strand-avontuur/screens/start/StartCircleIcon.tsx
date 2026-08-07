import type { ReactNode } from "react";
import { classNames } from "../../components/ui/classNames";

interface StartCircleIconProps {
  children: ReactNode;
  tone: "blue" | "green";
}

export const StartCircleIcon = ({ children, tone }: StartCircleIconProps) => (
  <span
    aria-hidden="true"
    className={classNames(
      "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white",
      tone === "green" ? "text-emerald-500" : "text-sky-600",
    )}
  >
    {children}
  </span>
);

StartCircleIcon.displayName = "StartCircleIcon";
