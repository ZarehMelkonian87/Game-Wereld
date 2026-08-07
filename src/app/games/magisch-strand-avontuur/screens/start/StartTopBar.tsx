import { ArrowLeft, Settings, Star, Volume2 } from "lucide-react";
import { HudIconButton } from "../../components/ui";

interface StartTopBarProps {
  onExit: () => void;
  onOpenSettings: () => void;
  starCount: number;
}

export const StartTopBar = ({ onExit, onOpenSettings, starCount }: StartTopBarProps) => (
  <div
    className="absolute left-3 right-3 top-[calc(env(safe-area-inset-top)+0.65rem)] z-30 flex h-[58px] items-start justify-between"
    data-component="StartTopBar"
  >
    <div className="flex gap-2">
      <HudIconButton
        className="h-14 w-14 rounded-[1.2rem] border-[3px] border-white/95 bg-white/92 shadow-[0_4px_0_rgba(21,48,74,0.14)] outline-none backdrop-blur-[2px] focus-visible:ring-4 focus-visible:ring-white/95 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 motion-reduce:transition-none"
        icon={<ArrowLeft className="h-7 w-7" strokeWidth={3} />}
        label="Terug naar spellen"
        onClick={onExit}
        tone="white"
      />
      <HudIconButton
        className="hidden h-14 w-14 rounded-[1.2rem] border-[3px] border-white/95 bg-white/86 shadow-[0_4px_0_rgba(21,48,74,0.14)] outline-none backdrop-blur-[2px] focus-visible:ring-4 focus-visible:ring-white/95 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 motion-reduce:transition-none sm:inline-flex"
        icon={<Volume2 className="h-7 w-7" strokeWidth={3} />}
        label="Geluid aan of uit"
        tone="white"
      />
    </div>

    <div
      aria-label={`${starCount} sterren`}
      className="absolute left-1/2 inline-flex min-h-14 w-[clamp(6.5rem,30vw,8rem)] -translate-x-1/2 items-center justify-center gap-1.5 rounded-[1.2rem] border-[3px] border-white/95 bg-white/88 px-3 text-[1.25rem] font-black leading-none text-slate-900 shadow-[0_4px_0_rgba(21,48,74,0.14)] backdrop-blur-[2px]"
      data-testid="start-star-counter"
    >
      <Star className="h-7 w-7 fill-amber-300 text-amber-600" strokeWidth={2.4} />
      {starCount}
    </div>

    <button
      aria-label="Instellingen openen"
      className="inline-flex h-14 w-14 touch-manipulation items-center justify-center rounded-[1.2rem] border-[3px] border-white/95 bg-gradient-to-b from-amber-200/92 to-amber-400/92 text-slate-900 shadow-[0_4px_0_rgba(21,48,74,0.14)] outline-none backdrop-blur-[2px] transition duration-150 active:translate-y-0.5 active:shadow-none focus-visible:ring-4 focus-visible:ring-white/95 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-400 motion-reduce:transition-none"
      data-testid="start-settings-button"
      onClick={onOpenSettings}
      type="button"
    >
      <Settings className="h-7 w-7" strokeWidth={3} />
    </button>
  </div>
);

StartTopBar.displayName = "StartTopBar";
