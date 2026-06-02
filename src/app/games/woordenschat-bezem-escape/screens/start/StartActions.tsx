import { Play, Users } from "lucide-react";
import { PrimaryActionButton } from "../../components/ui";
import { StartCircleIcon } from "./StartCircleIcon";

interface StartActionsProps {
  onOpenDashboard: () => void;
  onPlay: () => void;
}

export const StartActions = ({ onOpenDashboard, onPlay }: StartActionsProps) => (
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

    <PrimaryActionButton
      aria-label="Ouders en therapeuten openen"
      className="mx-auto min-h-[50px] w-[94%] gap-2.5 rounded-[1.25rem] border-[3px] border-white bg-gradient-to-b from-[#48aef4] to-[#1776d8] px-3 text-[0.95rem] shadow-[0_4px_0_rgba(21,48,74,0.18)] outline-none hover:from-[#5abaff] hover:to-[#2389ec] focus-visible:ring-4 focus-visible:ring-white/95 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-500 motion-reduce:transition-none landscape:text-[0.9rem]"
      data-testid="start-dashboard-button"
      iconLeft={
        <StartCircleIcon tone="blue">
          <Users className="h-[1.15rem] w-[1.15rem]" strokeWidth={3} />
        </StartCircleIcon>
      }
      onClick={onOpenDashboard}
    >
      Ouders & Therapeuten
    </PrimaryActionButton>
  </div>
);

StartActions.displayName = "StartActions";
