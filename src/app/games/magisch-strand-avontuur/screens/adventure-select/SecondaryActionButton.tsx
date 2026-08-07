import type { ReactNode } from "react";
import { classNames } from "../../components/ui/classNames";
import type { DevtoolsComponent } from "./devtools";

interface SecondaryActionButtonProps {
  children: string;
  icon: ReactNode;
  onClick: () => void;
  testId: string;
  tone: "amber" | "sky" | "white";
}

const secondaryToneClasses = {
  amber: "border-amber-300 bg-amber-100 text-amber-950 shadow-[0_3px_0_rgba(180,83,9,0.25)]",
  sky: "border-sky-300 bg-sky-100 text-sky-950 shadow-[0_3px_0_rgba(14,116,144,0.25)]",
  white: "border-slate-300 bg-white text-slate-900 shadow-[0_3px_0_rgba(71,85,105,0.22)]",
};

export const SecondaryActionButton: DevtoolsComponent<SecondaryActionButtonProps> = ({
  children,
  icon,
  onClick,
  testId,
  tone,
}) => (
  <button
    aria-label={children}
    className={classNames(
      "flex min-h-14 touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl border-2 px-1 text-[0.68rem] font-black leading-none active:translate-y-0.5 landscape:min-h-[4.25rem]",
      secondaryToneClasses[tone],
    )}
    data-component="SecondaryActionButton"
    data-testid={testId}
    data-tone={tone}
    onClick={onClick}
    type="button"
  >
    <span className="grid h-5 w-5 place-items-center" data-slot="icon">
      {icon}
    </span>
    <span className="truncate" data-slot="label">
      {children}
    </span>
  </button>
);

SecondaryActionButton.displayName = "SecondaryActionButton";
