import { Lightbulb } from "lucide-react";
import { GameIconButton } from "../primitives";
import type { GameIconButtonProps } from "../primitives";

export type HintButtonProps = Omit<GameIconButtonProps, "icon" | "label" | "tone"> & {
  label?: string;
};

export const HintButton = ({ label = "Hint", ...buttonProps }: HintButtonProps) => (
  <GameIconButton
    {...buttonProps}
    icon={<Lightbulb className="h-5 w-5" strokeWidth={3} />}
    label={label}
    tone="yellow"
  />
);

HintButton.displayName = "HintButton";
