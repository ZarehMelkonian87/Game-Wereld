import { ArrowLeft } from "lucide-react";
import { RibbonTitle } from "../../components/ui";

interface SettingsHeaderProps {
  onBackToMenu?: () => void;
}

export const SettingsHeader = ({ onBackToMenu }: SettingsHeaderProps) => (
  <div className="grid gap-2" data-component="SettingsHeader">
    <button
      aria-label="Terug naar game menu"
      className="inline-flex min-h-12 w-fit items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white/88 px-3 text-sm font-black text-slate-900 shadow-[0_3px_0_rgba(71,85,105,0.22)] outline-none active:translate-y-0.5 focus-visible:ring-4 focus-visible:ring-sky-200 motion-reduce:transform-none"
      data-testid="settings-back-button"
      onClick={onBackToMenu}
      type="button"
    >
      <ArrowLeft className="h-5 w-5" strokeWidth={3} />
      Menu
    </button>
    <div className="text-center">
      <RibbonTitle data-testid="settings-title">Instellingen</RibbonTitle>
    </div>
  </div>
);

SettingsHeader.displayName = "SettingsHeader";
