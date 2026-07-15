import { CheckCircle2, Mic, Sparkles } from "lucide-react";
import { voiceSideScrollerMascotStateUrls } from "../../asset-urls";
import { PanelCard } from "../../components/ui";
import type { VoiceSideScrollerWordRecognitionState } from "./useVoiceSideScrollerWordRecognition";
import type {
  VoiceSideScrollerGameplayFeedback,
  VoiceSideScrollerStatus,
} from "./voiceSideScrollerModel";

interface VoiceSideScrollerStatusPanelProps {
  gameplayFeedback?: VoiceSideScrollerGameplayFeedback;
  recognition: VoiceSideScrollerWordRecognitionState;
  status: VoiceSideScrollerStatus;
}

const getStatusText = (status: VoiceSideScrollerStatus) => {
  if (status === "running") {
    return "Noem wat je ziet";
  }

  if (status === "game-over") {
    return "Game over";
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
  if (status === "game-over") {
    return gameplayFeedback?.message ?? "Raak geen obstakels. Probeer opnieuw.";
  }

  if (status === "running" && gameplayFeedback) {
    return gameplayFeedback.message;
  }

  if (status === "running") {
    return recognition.feedbackText;
  }

  return "Vlieg zo ver mogelijk en pak plaatjes";
};

export const VoiceSideScrollerStatusPanel = ({
  gameplayFeedback,
  recognition,
  status,
}: VoiceSideScrollerStatusPanelProps) => (
  <PanelCard
    aria-label="Actieve opdracht"
    className="grid min-h-[4.5rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 !rounded-[1.35rem] !p-3"
    data-component="VoiceSideScrollerStatusPanel"
    data-recognition-status={recognition.status}
    data-testid="voice-side-scroller-status-panel"
  >
    <div className={`grid h-12 w-12 place-items-center rounded-2xl border-2 ${getIconClassName(recognition)}`}>
      {getStatusIcon(status, recognition)}
    </div>
    <div className="min-w-0">
      <p className="text-[1.25rem] font-black leading-none text-slate-900">
        {getStatusText(status)}
      </p>
      <p className="mt-1 text-xs font-black leading-tight text-sky-900">
        {getSubText(gameplayFeedback, status, recognition)}
      </p>
    </div>
  </PanelCard>
);

VoiceSideScrollerStatusPanel.displayName = "VoiceSideScrollerStatusPanel";
