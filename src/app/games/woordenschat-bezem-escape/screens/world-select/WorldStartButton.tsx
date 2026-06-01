import { Play } from "lucide-react";
import { PrimaryActionButton } from "../../components/ui";
import type { DevtoolsComponent } from "./devtools";

interface WorldStartButtonProps {
  disabled: boolean;
  onStartWorld: () => void;
}

export const WorldStartButton: DevtoolsComponent<WorldStartButtonProps> = ({
  disabled,
  onStartWorld,
}) => (
  <div
    className="absolute bottom-[max(0.85rem,env(safe-area-inset-bottom))] left-5 right-auto z-30 w-[calc(100vw-2.5rem)] landscape:bottom-6 landscape:left-8 landscape:right-auto landscape:w-[min(31vw,280px)]"
    data-component="WorldStartButton"
  >
    <PrimaryActionButton
      className="min-h-[4rem] w-full gap-3 rounded-[1.55rem] border-[5px] border-white bg-gradient-to-b from-[#67dc58] to-[#35bf43] px-5 text-[1.35rem] shadow-[0_7px_0_rgba(21,48,74,0.2)] hover:from-[#72e266] hover:to-[#3cca4a] disabled:border-white disabled:bg-gradient-to-b disabled:from-slate-300 disabled:to-slate-400 disabled:text-white disabled:shadow-[0_7px_0_rgba(21,48,74,0.14)] landscape:min-h-[3.6rem] landscape:text-xl"
      data-component="WorldStartPrimaryAction"
      data-testid="world-start-button"
      disabled={disabled}
      iconLeft={
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-emerald-500"
        >
          <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={3} />
        </span>
      }
      onClick={onStartWorld}
    >
      Start wereld
    </PrimaryActionButton>
  </div>
);

WorldStartButton.displayName = "WorldStartButton";
