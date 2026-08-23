import type { GameTopHudProps } from "../../../../game-platform";
import { GameTopHud } from "../../../../game-platform";

export type TopHudProps = GameTopHudProps;

export const TopHud = (props: TopHudProps) => <GameTopHud {...props} />;

TopHud.displayName = "TopHud";
