import { Play, Users } from "lucide-react";
import { PrimaryActionButton } from "../../components/ui";
import { StartCircleIcon } from "./StartCircleIcon";

interface StartActionsProps {
  onOpenDashboard: () => void;
  onPlay: () => void;
}

export const StartActions = ({ onOpenDashboard, onPlay }: StartActionsProps) => (
  <div
    className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-[3%] z-30 grid w-[78vw] max-w-[305px] gap-2.5 landscape:bottom-[18px] landscape:left-[54px] landscape:w-[min(38vw,320px)] landscape:max-w-none"
    data-component="StartActions"
  >
    <PrimaryActionButton
      className="min-h-[62px] w-full gap-3 rounded-[1.55rem] border-[5px] border-white bg-gradient-to-b from-[#67dc58] to-[#35bf43] px-5 text-[1.45rem] shadow-[0_7px_0_rgba(21,48,74,0.2)] hover:from-[#72e266] hover:to-[#3cca4a]"
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
      className="min-h-[52px] w-full gap-3 rounded-[1.45rem] border-[5px] border-white bg-gradient-to-b from-[#52b8ff] to-[#1679df] px-4 text-base shadow-[0_6px_0_rgba(21,48,74,0.2)] hover:from-[#60c0ff] hover:to-[#2389ec] landscape:text-[0.95rem]"
      data-testid="start-dashboard-button"
      iconLeft={
        <StartCircleIcon tone="blue">
          <Users className="h-5 w-5" strokeWidth={3} />
        </StartCircleIcon>
      }
      onClick={onOpenDashboard}
    >
      Ouders & Therapeuten
    </PrimaryActionButton>
  </div>
);

StartActions.displayName = "StartActions";
