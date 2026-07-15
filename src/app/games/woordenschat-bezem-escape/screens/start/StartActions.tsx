import { Play } from "lucide-react";
import { PrimaryActionButton } from "../../components/ui";
import { StartCircleIcon } from "./StartCircleIcon";

interface StartActionsProps {
  onPlay: () => void;
}

export const StartActions = ({ onPlay }: StartActionsProps) => (
  <div
    className="absolute bottom-[calc(env(safe-area-inset-bottom)+0.9rem)] left-1/2 z-30 grid w-[calc(100%_-_3rem)] max-w-[330px] -translate-x-1/2 gap-3 landscape:bottom-[18px] landscape:left-[54px] landscape:w-[min(36vw,318px)] landscape:max-w-none landscape:translate-x-0"
    data-component="StartActions"
  >
    <PrimaryActionButton
      aria-label="Spel starten"
      className="min-h-[66px] w-full gap-3 rounded-[1.55rem] border-[4px] border-white bg-gradient-to-b from-[#69df5d] to-[#34bd43] px-5 text-[1.42rem] shadow-[0_7px_0_rgba(21,48,74,0.2)] outline-none hover:from-[#72e266] hover:to-[#3cca4a] focus-visible:ring-4 focus-visible:ring-white/95 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-500 motion-reduce:transition-none"
      data-testid="start-play-button"
      iconLeft={
        <StartCircleIcon tone="green">
          <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={3} />
        </StartCircleIcon>
      }
      onClick={onPlay}
    >
      Spelen
    </PrimaryActionButton>
  </div>
);

StartActions.displayName = "StartActions";
