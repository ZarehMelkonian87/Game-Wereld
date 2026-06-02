import { RotateCcw } from "lucide-react";
import { PanelCard } from "../../components/ui";

interface ResetProgressCardProps {
  onOpenResetDialog: () => void;
  resetMessage: string;
}

export const ResetProgressCard = ({
  onOpenResetDialog,
  resetMessage,
}: ResetProgressCardProps) => (
  <div className="contents" data-component="ResetProgressCard">
    <PanelCard className="grid gap-2 !rounded-2xl !p-3">
      <p className="text-xs font-black leading-tight text-slate-800">
        Data in deze game is oefenobservatie. Het is geen diagnose, geen officiele testscore en
        geen vergelijking met normgroepen.
      </p>
      {resetMessage ? (
        <p
          aria-live="polite"
          className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/90 p-2 text-xs font-black leading-tight text-emerald-900"
          data-testid="settings-reset-message"
        >
          {resetMessage}
        </p>
      ) : null}
    </PanelCard>

    <button
      aria-label="Voortgang resetten"
      className="mx-auto inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-[0.78rem] font-black leading-none text-rose-700 underline-offset-4 active:translate-y-0.5"
      data-component="ResetProgressLink"
      data-testid="settings-reset-progress-button"
      onClick={onOpenResetDialog}
      type="button"
    >
      <RotateCcw className="h-4 w-4" strokeWidth={3} />
      Reset voortgang
    </button>
  </div>
);

ResetProgressCard.displayName = "ResetProgressCard";
