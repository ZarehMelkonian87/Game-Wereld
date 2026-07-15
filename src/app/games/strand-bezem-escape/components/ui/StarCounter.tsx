import type { GameStarCounterProps } from "../../../../game-platform";
import { GameStarCounter } from "../../../../game-platform";

export type StarCounterProps = GameStarCounterProps;

export const StarCounter = (props: StarCounterProps) => <GameStarCounter {...props} />;

StarCounter.displayName = "StarCounter";

