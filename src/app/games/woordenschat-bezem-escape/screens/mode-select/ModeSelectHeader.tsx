import { ArrowLeft, Sparkles } from "lucide-react";
import { HudIconButton } from "../../components/ui";
import type { DevtoolsComponent } from "./devtools";

interface ModeSelectHeaderProps {
  onChooseWorld: () => void;
}

export const ModeSelectHeader: DevtoolsComponent<ModeSelectHeaderProps> = ({
  onChooseWorld,
}) => (
  <header
    className="absolute left-3 right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex h-12 items-start gap-2.5"
    data-component="ModeSelectHeader"
  >
    <HudIconButton
      className="h-12 w-12 rounded-[1.1rem] border-[4px] border-white bg-white/95 shadow-[0_5px_0_rgba(21,48,74,0.18)]"
      icon={<ArrowLeft className="h-6 w-6" strokeWidth={3.2} />}
      label="Werelden"
      onClick={onChooseWorld}
      tone="white"
    />

    <div
      className="flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-[1.15rem] border-[4px] border-white bg-white/95 px-3 text-[1.35rem] font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.16)] landscape:flex-none landscape:basis-[17rem]"
      data-slot="title"
    >
      Kies spel
    </div>

    <div
      aria-hidden="true"
      className="grid h-12 w-12 shrink-0 place-items-center rounded-[1.1rem] border-[4px] border-white bg-white/95 text-amber-500 shadow-[0_5px_0_rgba(21,48,74,0.18)] landscape:ml-auto"
      data-slot="sparkle-icon"
    >
      <Sparkles className="h-6 w-6 fill-amber-200" strokeWidth={2.7} />
    </div>
  </header>
);

ModeSelectHeader.displayName = "ModeSelectHeader";
