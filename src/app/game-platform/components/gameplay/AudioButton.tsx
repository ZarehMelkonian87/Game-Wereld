import { Volume2 } from "lucide-react";
import { GameIconButton } from "../primitives";
import type { GameIconButtonProps } from "../primitives";

export type AudioButtonProps = Omit<GameIconButtonProps, "icon" | "label" | "tone"> & {
  label?: string;
};

export const AudioButton = ({ label = "Luister", ...buttonProps }: AudioButtonProps) => (
  <GameIconButton
    {...buttonProps}
    icon={<Volume2 className="h-5 w-5" strokeWidth={3} />}
    label={label}
    tone="blue"
  />
);

AudioButton.displayName = "AudioButton";

