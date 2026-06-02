import type { ReactNode } from "react";
import { mascotIconUrls } from "../../asset-urls";
import { classNames } from "../../components/ui/classNames";

interface CompactInstructionCardProps {
  actionControls: ReactNode;
  leadingControl?: ReactNode;
  text: string;
}

export const CompactInstructionCard = ({
  actionControls,
  leadingControl,
  text,
}: CompactInstructionCardProps) => (
  <section
    aria-label="Opdrachtgebied"
    className="pointer-events-auto relative z-40 grid min-h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 overflow-visible rounded-[1.35rem] border-2 border-white/90 bg-white/92 px-2 py-1.5 text-slate-900 shadow-[0_4px_0_rgba(15,23,42,0.1)] backdrop-blur-sm"
    data-component="CompactInstructionCard"
    data-testid="scene-builder-instruction-area"
  >
    <div className="flex h-14 w-14 shrink-0 items-center justify-center" data-slot="mascot">
      {leadingControl ?? (
        <img
          alt=""
          className="h-10 w-10 object-contain"
          draggable={false}
          src={mascotIconUrls.neutral}
        />
      )}
    </div>
    <p
      className="min-w-0 text-[clamp(0.9rem,3.5vw,1.05rem)] font-black leading-tight text-slate-950"
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
    <div
      className={classNames("flex shrink-0 items-center justify-end", "max-w-[7.5rem]")}
      data-slot="actions"
    >
      {actionControls}
    </div>
  </section>
);

CompactInstructionCard.displayName = "CompactInstructionCard";
