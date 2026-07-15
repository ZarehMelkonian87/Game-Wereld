import { Play } from "lucide-react";
import { PrimaryActionButton } from "../../components/ui";
import type { DevtoolsComponent } from "./devtools";

interface AdventureStartButtonProps {
  disabled: boolean;
  onStart: () => void;
}

export const AdventureStartButton: DevtoolsComponent<AdventureStartButtonProps> = ({
  disabled,
  onStart,
}: AdventureStartButtonProps) => (
  <PrimaryActionButton
    aria-label="Start spel"
    className="pointer-events-auto min-h-[3.25rem] w-full text-base shadow-[0_5px_0_rgba(22,101,52,0.3)]"
    data-testid="adventure-start-game-button"
    disabled={disabled}
    iconLeft={<Play className="h-6 w-6 fill-current" strokeWidth={3} />}
    onClick={onStart}
    size="default"
  >
    Start spel
  </PrimaryActionButton>
);

AdventureStartButton.displayName = "AdventureStartButton";
