import { BtnNavBack, DspStarCounter, TtlHeaderPill } from "../../components/ui";
import type { DevtoolsComponent } from "./devtools";

interface AdventureSelectHeaderProps {
  onBackToStart: () => void;
  starCount: number;
}

export const AdventureSelectHeader: DevtoolsComponent<AdventureSelectHeaderProps> = ({
  onBackToStart,
  starCount,
}: AdventureSelectHeaderProps) => (
  <header
    className="absolute left-3 right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex h-14 items-center gap-2.5"
    data-component="AdventureSelectHeader"
  >
    <BtnNavBack onClick={onBackToStart} />

    <div className="flex-1 flex justify-center min-w-0">
      <TtlHeaderPill data-slot="title">
        Kies avontuur
      </TtlHeaderPill>
    </div>

    <DspStarCounter count={starCount} data-testid="adventure-select-star-counter" />
  </header>
);

AdventureSelectHeader.displayName = "AdventureSelectHeader";
