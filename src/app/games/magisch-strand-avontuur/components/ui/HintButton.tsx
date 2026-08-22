import type { HintButtonProps as PlatformHintButtonProps } from "../../../../game-platform";
import { HintButton as PlatformHintButton } from "../../../../game-platform";

export type HintButtonProps = PlatformHintButtonProps;

export const HintButton = (props: HintButtonProps) => <PlatformHintButton {...props} />;

HintButton.displayName = "HintButton";
