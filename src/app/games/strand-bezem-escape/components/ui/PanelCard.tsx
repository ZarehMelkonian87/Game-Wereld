import type { GamePanelProps } from "../../../../game-platform";
import { GamePanel } from "../../../../game-platform";

export type PanelCardProps = GamePanelProps;

export const PanelCard = (props: PanelCardProps) => <GamePanel {...props} />;

PanelCard.displayName = "PanelCard";

