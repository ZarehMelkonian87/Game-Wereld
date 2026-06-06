import { Mic, Sparkles } from "lucide-react";
import { PanelCard } from "../../components/ui";
import type {
  VoiceSideScrollerStatus,
  VoiceSideScrollerTarget,
} from "./voiceSideScrollerModel";

interface VoiceSideScrollerStatusPanelProps {
  activeTarget?: VoiceSideScrollerTarget;
  status: VoiceSideScrollerStatus;
}

const getStatusText = (status: VoiceSideScrollerStatus, activeTarget?: VoiceSideScrollerTarget) => {
  if (status === "running") {
    return activeTarget ? `Zeg: ${activeTarget.word}` : "Zeg het woord";
  }

  if (status === "paused") {
    return "Pauze";
  }

  if (status === "finished") {
    return "Klaar";
  }

  return "Zeg & Vlieg";
};

export const VoiceSideScrollerStatusPanel = ({
  activeTarget,
  status,
}: VoiceSideScrollerStatusPanelProps) => (
  <PanelCard
    aria-label="Actieve opdracht"
    className="grid min-h-[4.5rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 !rounded-[1.35rem] !p-3"
    data-active-word={activeTarget?.word ?? ""}
    data-component="VoiceSideScrollerStatusPanel"
    data-testid="voice-side-scroller-status-panel"
  >
    <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700 shadow-[0_3px_0_rgba(3,105,161,0.2)]">
      {status === "running" ? (
        <Mic className="h-7 w-7" strokeWidth={3} />
      ) : (
        <Sparkles className="h-7 w-7" fill="currentColor" strokeWidth={2.5} />
      )}
    </div>
    <div className="min-w-0">
      <p className="truncate text-[1.25rem] font-black leading-none text-slate-900">
        {getStatusText(status, activeTarget)}
      </p>
      <p className="mt-1 truncate text-xs font-black leading-none text-sky-900">
        {status === "running" ? "Stemtest actief" : "Klaar voor ronde"}
      </p>
    </div>
  </PanelCard>
);

VoiceSideScrollerStatusPanel.displayName = "VoiceSideScrollerStatusPanel";
