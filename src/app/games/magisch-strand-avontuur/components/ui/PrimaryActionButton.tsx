import type { GameButtonProps } from "../../../../game-platform";
import { GameButton } from "../../../../game-platform";

export type PrimaryActionButtonProps = Omit<GameButtonProps, "tone">;

export const PrimaryActionButton = (props: PrimaryActionButtonProps) => (
  <GameButton {...props} tone="green" />
);

PrimaryActionButton.displayName = "PrimaryActionButton";
