import type { InstructionBubbleProps as PlatformInstructionBubbleProps } from "../../../../game-platform";
import { InstructionBubble as PlatformInstructionBubble } from "../../../../game-platform";

export type InstructionBubbleProps = PlatformInstructionBubbleProps;

export const InstructionBubble = (props: InstructionBubbleProps) => (
  <PlatformInstructionBubble {...props} />
);

InstructionBubble.displayName = "InstructionBubble";
