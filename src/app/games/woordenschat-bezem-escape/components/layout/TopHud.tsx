import { ArrowLeft, LockKeyhole, Volume2 } from "lucide-react";
import { HintButton, HudIconButton, StarCounter } from "../ui";

interface TopHudProps {
  showParentBack?: boolean;
  showHint?: boolean;
  starCount: number;
}

export function TopHud({ showParentBack = false, showHint = true, starCount }: TopHudProps) {
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
        <div className="flex justify-start gap-2">
          {showParentBack ? (
            <HudIconButton
              className="pointer-events-auto"
              data-testid="parent-hold-back-button"
              icon={
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <ArrowLeft className="h-5 w-5" strokeWidth={3} />
                  <LockKeyhole className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-white text-slate-700" strokeWidth={3} />
                </span>
              }
              label="Ouder terug, houd vast"
              tone="white"
            />
          ) : null}
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
