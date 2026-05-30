import { Volume2 } from "lucide-react";
import type { HTMLAttributes } from "react";
import { classNames } from "./classNames";
import { HudIconButton } from "./HudIconButton";

interface InstructionBubbleProps extends HTMLAttributes<HTMLDivElement> {
  audioLabel?: string;
  text: string;
}

export function InstructionBubble({
  audioLabel = "Luister opdracht",
  className,
  text,
  ...bubbleProps
}: InstructionBubbleProps) {
  return (
    <div
      {...bubbleProps}
      className={classNames(
        "flex min-h-16 min-w-0 items-center gap-3 rounded-3xl border-2 border-white/90 bg-white/92 p-2 text-slate-900 shadow-[0_5px_0_rgba(15,23,42,0.12)] backdrop-blur-sm",
        className,
      )}
    >
      <HudIconButton
        className="pointer-events-auto"
        icon={<Volume2 className="h-5 w-5" strokeWidth={3} />}
        label={audioLabel}
        tone="blue"
      />
      <p
        data-testid="scene-builder-instruction-text"
        className="min-w-0 flex-1 text-sm font-black leading-tight text-slate-900"
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
}
