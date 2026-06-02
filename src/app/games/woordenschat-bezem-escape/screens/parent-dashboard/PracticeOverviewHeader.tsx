import { ArrowLeft, Copy } from "lucide-react";
import { RibbonTitle } from "../../components/ui";

interface PracticeOverviewHeaderProps {
  copyFeedback: string;
  onBackToMenu?: () => void;
  onCopySummary: () => void;
}

export const PracticeOverviewHeader = ({
  copyFeedback,
  onBackToMenu,
  onCopySummary,
}: PracticeOverviewHeaderProps) => (
  <div className="grid gap-2 text-center" data-component="PracticeOverviewHeader">
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2">
      <button
        aria-label="Terug naar game menu"
        className="inline-flex min-h-11 items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white/88 px-3 text-sm font-black text-slate-900 shadow-[0_3px_0_rgba(71,85,105,0.22)] active:translate-y-0.5"
        data-testid="dashboard-back-button"
        onClick={onBackToMenu}
        type="button"
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={3} />
        Menu
      </button>
      <RibbonTitle data-testid="dashboard-title">Oefenoverzicht</RibbonTitle>
      <button
        aria-label="Kopieer samenvatting"
        className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-emerald-600 bg-emerald-500 text-white shadow-[0_3px_0_rgba(4,120,87,0.62)] active:translate-y-0.5 active:shadow-none"
        data-testid="dashboard-copy-summary-icon-button"
        onClick={onCopySummary}
        type="button"
      >
        <Copy className="h-5 w-5" strokeWidth={3} />
      </button>
    </div>

    <p className="rounded-2xl border-2 border-white/80 bg-white/75 px-3 py-1.5 text-xs font-black leading-tight text-slate-800">
      Oefenobservatie voor thuis en logopedie. Geen diagnose en geen officiele testscore.
    </p>

    <p
      aria-live="polite"
      className="min-h-5 text-xs font-black leading-tight text-slate-700"
      data-testid="dashboard-copy-feedback"
    >
      {copyFeedback}
    </p>
  </div>
);

PracticeOverviewHeader.displayName = "PracticeOverviewHeader";
