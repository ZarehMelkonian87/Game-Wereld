import { CheckCircle2, Mic, RotateCcw, Sparkles } from "lucide-react";
import { voiceSideScrollerMascotStateUrls } from "../../asset-urls";
import { HudIconButton, PanelCard } from "../../components/ui";
import type { VoiceSideScrollerWordRecognitionState } from "./useVoiceSideScrollerWordRecognition";
import type {
  VoiceSideScrollerGameplayFeedback,
  VoiceSideScrollerStatus,
  VoiceSideScrollerTarget,
} from "./voiceSideScrollerModel";

interface VoiceSideScrollerStatusPanelProps {
  activeTarget?: VoiceSideScrollerTarget;
  gameplayFeedback?: VoiceSideScrollerGameplayFeedback;
  onRepeatWordPrompt: () => boolean;
  recognition: VoiceSideScrollerWordRecognitionState;
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

const getStatusIcon = (
  status: VoiceSideScrollerStatus,
  recognition: VoiceSideScrollerWordRecognitionState,
) => {
  if (status !== "running") {
    return <Sparkles className="h-7 w-7" fill="currentColor" strokeWidth={2.5} />;
  }

  if (recognition.status === "matched") {
    return <CheckCircle2 className="h-7 w-7" strokeWidth={3} />;
  }

  if (recognition.status === "missed" || recognition.status === "error") {
    return (
      <img
        alt=""
        className="h-9 w-9 object-contain"
        draggable={false}
        src={voiceSideScrollerMascotStateUrls.hint}
      />
    );
  }

  return <Mic className="h-7 w-7" strokeWidth={3} />;
};

const getIconClassName = (recognition: VoiceSideScrollerWordRecognitionState) => {
  if (recognition.status === "matched") {
    return "border-emerald-300 bg-emerald-100 text-emerald-700 shadow-[0_3px_0_rgba(4,120,87,0.2)]";
  }

  if (recognition.status === "missed" || recognition.status === "error") {
    return "border-amber-300 bg-amber-100 text-amber-700 shadow-[0_3px_0_rgba(180,83,9,0.2)]";
  }

  return "border-sky-300 bg-sky-100 text-sky-700 shadow-[0_3px_0_rgba(3,105,161,0.2)]";
};

const getSubText = (
  gameplayFeedback: VoiceSideScrollerGameplayFeedback | undefined,
  status: VoiceSideScrollerStatus,
  recognition: VoiceSideScrollerWordRecognitionState,
) => {
  if (status === "running" && gameplayFeedback?.kind === "hint") {
    return gameplayFeedback.message;
  }

  if (status === "running") {
    return recognition.feedbackText;
  }

  if (status === "finished") {
    return "Alle woorden zijn klaar of de tijd is op.";
  }

  return "Klaar voor ronde";
};

export const VoiceSideScrollerStatusPanel = ({
  activeTarget,
  gameplayFeedback,
  onRepeatWordPrompt,
  recognition,
  status,
}: VoiceSideScrollerStatusPanelProps) => (
  <PanelCard
    aria-label="Actieve opdracht"
    className="grid min-h-[4.5rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 !rounded-[1.35rem] !p-3"
    data-active-word={activeTarget?.word ?? ""}
    data-component="VoiceSideScrollerStatusPanel"
    data-recognition-status={recognition.status}
    data-testid="voice-side-scroller-status-panel"
  >
    <div className={`grid h-12 w-12 place-items-center rounded-2xl border-2 ${getIconClassName(recognition)}`}>
      {getStatusIcon(status, recognition)}
    </div>
    <div className="min-w-0">
      <p className="text-[1.25rem] font-black leading-none text-slate-900">
        {getStatusText(status, activeTarget)}
      </p>
      <p className="mt-1 text-xs font-black leading-tight text-sky-900">
        {getSubText(gameplayFeedback, status, recognition)}
      </p>
    </div>
    <HudIconButton
      disabled={status !== "running"}
      icon={<RotateCcw className="h-5 w-5" strokeWidth={3} />}
      label="Herhaal woord"
      onClick={onRepeatWordPrompt}
      tone="yellow"
    />
  </PanelCard>
);

VoiceSideScrollerStatusPanel.displayName = "VoiceSideScrollerStatusPanel";
