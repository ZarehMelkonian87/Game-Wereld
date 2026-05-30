import { Volume2 } from "lucide-react";
import { HintButton, HudIconButton, StarCounter } from "../ui";

interface TopHudProps {
  showHint?: boolean;
  starCount: number;
}

export function TopHud({ showHint = true, starCount }: TopHudProps) {
  return (
    <div
      data-testid="gameplay-top-hud"
      className="pointer-events-none absolute inset-x-0 top-0 z-20"
      style={{
        paddingLeft: "calc(env(safe-area-inset-left) + 0.75rem)",
        paddingRight: "calc(env(safe-area-inset-right) + 0.75rem)",
        paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)",
      }}
    >
      <div className="grid grid-cols-[minmax(44px,1fr)_auto_minmax(44px,1fr)] items-start gap-2">
        <div className="flex justify-start">
          <HudIconButton
            className="pointer-events-auto"
            icon={<Volume2 className="h-5 w-5" strokeWidth={3} />}
            label="Audio"
            tone="blue"
          />
        </div>

        <div className="flex justify-center">
          <StarCounter value={starCount} />
        </div>

        <div className="flex justify-end">
          {showHint ? <HintButton className="pointer-events-auto" showLabel={false} /> : null}
        </div>
      </div>
    </div>
  );
}
