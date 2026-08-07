import type { GameStageProps } from "../../../../game-platform";
import { GameStage as PlatformGameStage } from "../../../../game-platform";

export type { GameStageProps };

export const GameStage = (props: GameStageProps) => <PlatformGameStage {...props} />;

GameStage.displayName = "GameStage";
