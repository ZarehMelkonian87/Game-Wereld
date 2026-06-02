import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "../../utils/classNames";
import { AudioButton } from "./AudioButton";

export interface InstructionBubbleProps extends HTMLAttributes<HTMLDivElement> {
  audioLabel?: string;
  leadingControl?: ReactNode;
  onAudioClick?: () => void;
  text: string;
}

export const InstructionBubble = ({
  audioLabel = "Luister opdracht",
  className,
  leadingControl,
  onAudioClick,
  text,
  ...bubbleProps
}: InstructionBubbleProps) => (
  <div
    {...bubbleProps}
    className={classNames(
      "flex min-h-16 min-w-0 items-center gap-3 rounded-3xl border-2 border-white/90 bg-white/92 p-2 text-slate-900 shadow-[0_5px_0_rgba(15,23,42,0.12)] backdrop-blur-sm",
      className,
    )}
    data-component="InstructionBubble"
  >
    {leadingControl ?? (
      <AudioButton className="pointer-events-auto" label={audioLabel} onClick={onAudioClick} />
    )}
    <p
      className="min-w-0 flex-1 text-sm font-black leading-tight text-slate-900"
      data-slot="text"
      data-testid="scene-builder-instruction-text"
      style={{
        display: "-webkit-box",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
      }}
    >
      {text}
    </p>
  </div>
);

InstructionBubble.displayName = "InstructionBubble";
