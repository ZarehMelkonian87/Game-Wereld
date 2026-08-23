import { BtnPrimaryPlay } from "../../components/ui";

interface StartActionsProps {
  onPlay: () => void;
}

export const StartActions = ({ onPlay }: StartActionsProps) => (
  <div
    className="absolute bottom-[calc(env(safe-area-inset-bottom)+0.9rem)] left-1/2 z-30 grid w-[calc(100%_-_3rem)] max-w-[330px] -translate-x-1/2 gap-3 landscape:bottom-[18px] landscape:left-[54px] landscape:w-[min(36vw,318px)] landscape:max-w-none landscape:translate-x-0"
    data-component="StartActions"
  >
    <BtnPrimaryPlay aria-label="Spel starten" data-testid="start-play-button" onClick={onPlay}>
      Spelen
    </BtnPrimaryPlay>
  </div>
);

StartActions.displayName = "StartActions";
