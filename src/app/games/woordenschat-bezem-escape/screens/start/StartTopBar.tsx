import { Settings, Star, Volume2 } from "lucide-react";
import { HudIconButton } from "../../components/ui";

interface StartTopBarProps {
  onOpenSettings: () => void;
  starCount: number;
}

export const StartTopBar = ({ onOpenSettings, starCount }: StartTopBarProps) => (
  <div
    className="absolute left-3 right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex h-12 items-start justify-between"
    data-component="StartTopBar"
  >
    <HudIconButton
      className="h-12 w-12 rounded-[1.1rem] border-[4px] border-white bg-white/95 shadow-[0_5px_0_rgba(21,48,74,0.18)]"
      icon={<Volume2 className="h-6 w-6" strokeWidth={3} />}
      label="Geluid"
      tone="white"
    />

    <div
      aria-label={`${starCount} sterren`}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.15rem] border-[4px] border-white bg-white/95 px-4 text-xl font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.18)]"
      data-testid="start-star-counter"
    >
      <Star className="h-7 w-7 fill-amber-300 text-amber-600" strokeWidth={2.4} />
      {starCount}
    </div>

    <button
      aria-label="Instellingen"
      className="inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-[1.1rem] border-[4px] border-white bg-gradient-to-b from-amber-200 to-amber-400 px-2 text-sm font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.18)] active:translate-y-0.5 active:shadow-none landscape:rounded-[1.15rem] landscape:px-3 landscape:text-base"
      data-testid="start-settings-button"
      onClick={onOpenSettings}
      type="button"
    >
      <Settings className="h-6 w-6" strokeWidth={3} />
      <span className="hidden landscape:inline">Opties</span>
    </button>
  </div>
);

StartTopBar.displayName = "StartTopBar";
