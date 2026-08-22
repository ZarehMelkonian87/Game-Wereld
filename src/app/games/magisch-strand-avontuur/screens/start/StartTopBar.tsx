import {
  BtnAudioToggleQuick,
  BtnNavBack,
  BtnSettingsGear,
  DspStarCounter,
} from "../../components/ui";

interface StartTopBarProps {
  onExit: () => void;
  onOpenSettings: () => void;
  starCount: number;
}

export const StartTopBar = ({ onExit, onOpenSettings, starCount }: StartTopBarProps) => (
  <div
    className="absolute left-3 right-3 top-[calc(env(safe-area-inset-top)+0.65rem)] z-30 flex h-[58px] items-start justify-between"
    data-component="StartTopBar"
  >
    <div className="flex gap-2">
      <BtnNavBack aria-label="Terug naar spellen" onClick={onExit} />
      <div className="hidden sm:inline-flex">
        <BtnAudioToggleQuick />
      </div>
    </div>

    <div className="absolute left-1/2 -translate-x-1/2">
      <DspStarCounter count={starCount} data-testid="start-star-counter" />
    </div>

    <BtnSettingsGear
      aria-label="Instellingen openen"
      data-testid="start-settings-button"
      onClick={onOpenSettings}
    />
  </div>
);

StartTopBar.displayName = "StartTopBar";
