import { Lightbulb } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { HudIconButton } from "./HudIconButton";

type HintButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  showLabel?: boolean;
};

export function HintButton({ showLabel = true, ...buttonProps }: HintButtonProps) {
  return (
    <HudIconButton
      {...buttonProps}
      icon={<Lightbulb className="h-5 w-5" strokeWidth={3} />}
      label="Hint"
      showLabel={showLabel}
      tone="yellow"
    />
  );
}
