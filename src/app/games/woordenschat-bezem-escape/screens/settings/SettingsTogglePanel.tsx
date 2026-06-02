import { EyeOff, Lightbulb, Volume2 } from "lucide-react";
import { PanelCard } from "../../components/ui";
import type { BezemEscapeSettings } from "../../logic/settings";
import { SettingsToggleRow } from "./SettingsToggleRow";

interface SettingsTogglePanelProps {
  onUpdateSettings: (nextSettings: BezemEscapeSettings) => void;
  settings: BezemEscapeSettings;
}

export const SettingsTogglePanel = ({
  onUpdateSettings,
  settings,
}: SettingsTogglePanelProps) => (
  <div className="contents" data-component="SettingsTogglePanel">
    <PanelCard className="grid gap-2 !rounded-2xl !p-2.5">
      <SettingsToggleRow
        checked={settings.audioEnabled}
        description="Spreek de opdrachten hardop uit."
        icon={<Volume2 className="h-6 w-6" strokeWidth={3} />}
        label="Audio"
        onToggle={() =>
          onUpdateSettings({ ...settings, audioEnabled: !settings.audioEnabled })
        }
        testId="settings-audio-toggle"
      />
      <SettingsToggleRow
        checked={settings.hintsEnabled}
        description="Laat de mascotte helpen wanneer nodig."
        icon={<Lightbulb className="h-6 w-6" strokeWidth={3} />}
        label="Hints"
        onToggle={() =>
          onUpdateSettings({ ...settings, hintsEnabled: !settings.hintsEnabled })
        }
        testId="settings-hints-toggle"
      />
      <SettingsToggleRow
        checked={settings.reducedMotion}
        description="Minder beweging en minder pulse-effecten."
        icon={<EyeOff className="h-6 w-6" strokeWidth={3} />}
        label="Rustige beweging"
        onToggle={() =>
          onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion })
        }
        testId="settings-reduced-motion-toggle"
      />
    </PanelCard>
  </div>
);

SettingsTogglePanel.displayName = "SettingsTogglePanel";
