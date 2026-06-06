import { HelpCircle, Zap } from "lucide-react";
import { PanelCard } from "../../components/ui";
import type { VoiceSideScrollerGameplayFeedback as VoiceSideScrollerGameplayFeedbackState } from "./voiceSideScrollerModel";

interface VoiceSideScrollerGameplayFeedbackProps {
  feedback?: VoiceSideScrollerGameplayFeedbackState;
}

export const VoiceSideScrollerGameplayFeedback = ({
  feedback,
}: VoiceSideScrollerGameplayFeedbackProps) => {
  if (!feedback) {
    return null;
  }

  const isBoost = feedback.kind === "boost";

  return (
    <PanelCard
      aria-live="polite"
      className="pointer-events-none absolute left-3 right-3 top-3 z-50 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 !rounded-[1.2rem] !p-2 text-sm landscape:left-auto landscape:w-[18rem]"
      data-component="VoiceSideScrollerGameplayFeedback"
      data-feedback-kind={feedback.kind}
      data-testid="voice-side-scroller-gameplay-feedback"
      key={feedback.id}
    >
      <span
        className={[
          "grid h-10 w-10 place-items-center rounded-2xl border-2",
          isBoost
            ? "border-amber-300 bg-amber-100 text-amber-700"
            : "border-sky-300 bg-sky-100 text-sky-700",
        ].join(" ")}
      >
        {isBoost ? (
          <Zap className="h-5 w-5" fill="currentColor" strokeWidth={3} />
        ) : (
          <HelpCircle className="h-5 w-5" strokeWidth={3} />
        )}
      </span>
      <p className="text-sm font-black leading-tight text-slate-900">
        {feedback.message}
      </p>
    </PanelCard>
  );
};

VoiceSideScrollerGameplayFeedback.displayName = "VoiceSideScrollerGameplayFeedback";
