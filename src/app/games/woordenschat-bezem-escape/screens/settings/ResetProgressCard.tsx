import { RotateCcw } from "lucide-react";
import { PanelCard, PrimaryActionButton } from "../../components/ui";

interface ResetProgressCardProps {
  confirmReset: boolean;
  onResetProgress: () => void;
  resetMessage: string;
}

export const ResetProgressCard = ({
  confirmReset,
  onResetProgress,
  resetMessage,
}: ResetProgressCardProps) => (
  <div className="contents" data-component="ResetProgressCard">
    <PanelCard className="!rounded-2xl !p-3">
      <p className="text-xs font-black leading-tight text-slate-800">
        Data in deze game is oefenobservatie. Het is geen diagnose, geen officiele testscore en
        geen vergelijking met normgroepen.
      </p>
      <PrimaryActionButton
        className="mt-3 w-full border-rose-600 bg-rose-500 text-sm shadow-[0_4px_0_rgba(190,18,60,0.75)] hover:bg-rose-400"
        data-testid="settings-reset-progress-button"
        iconLeft={<RotateCcw className="h-5 w-5" strokeWidth={3} />}
        onClick={onResetProgress}
      >
        {confirmReset ? "Bevestig wissen" : "Reset voortgang"}
      </PrimaryActionButton>
      <p
        className="mt-2 min-h-5 text-xs font-black leading-tight text-slate-700"
        data-testid="settings-reset-message"
      >
        {resetMessage}
      </p>
    </PanelCard>
  </div>
);

ResetProgressCard.displayName = "ResetProgressCard";
