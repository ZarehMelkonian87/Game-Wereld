import type { GameIconButtonProps, GameIconButtonTone } from "../../../../game-platform";
import { GameIconButton } from "../../../../game-platform";

export type HudIconButtonTone = Exclude<GameIconButtonTone, "red">;
export type HudIconButtonProps = Omit<GameIconButtonProps, "tone"> & {
  tone?: HudIconButtonTone;
};

export const HudIconButton = ({ tone = "white", ...buttonProps }: HudIconButtonProps) => (
  <GameIconButton {...buttonProps} tone={tone} />
);

HudIconButton.displayName = "HudIconButton";

