import { BackButton, GradientTitle } from "../shared";

interface SettingsHeaderProps {
  onBack: () => void;
}

export const SettingsHeader = ({ onBack }: SettingsHeaderProps) => (
  <div data-component="SettingsHeader">
    <div className="mb-5 sm:mb-6 md:mb-8">
      <BackButton label="Terug naar home" onClick={onBack} />
    </div>
    <div className="text-center">
      <GradientTitle className="text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8 md:mb-10">
        INSTELLINGEN
      </GradientTitle>
    </div>
  </div>
);

SettingsHeader.displayName = "SettingsHeader";
