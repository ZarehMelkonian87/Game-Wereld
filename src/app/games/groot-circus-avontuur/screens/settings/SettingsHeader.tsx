import { BtnNavMenu, TtlHeaderPill } from "../../components/ui";

interface SettingsHeaderProps {
  onBackToMenu?: () => void;
}

export const SettingsHeader = ({ onBackToMenu }: SettingsHeaderProps) => (
  <div className="grid gap-2" data-component="SettingsHeader">
    <BtnNavMenu data-testid="settings-back-button" onClick={onBackToMenu} />
    <div className="text-center">
      <TtlHeaderPill data-testid="settings-title">Instellingen</TtlHeaderPill>
    </div>
  </div>
);

SettingsHeader.displayName = "SettingsHeader";
