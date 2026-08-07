import type { GameProgressBarProps } from "../../../../game-platform";
import { GameProgressBar } from "../../../../game-platform";

export type ProgressBarProps = GameProgressBarProps;

export const ProgressBar = (props: ProgressBarProps) => <GameProgressBar {...props} />;

ProgressBar.displayName = "ProgressBar";
