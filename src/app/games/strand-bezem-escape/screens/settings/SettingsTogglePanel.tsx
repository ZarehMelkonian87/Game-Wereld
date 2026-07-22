import { EyeOff, Lightbulb, Music2, Volume2, Wrench } from "lucide-react";
import { PanelCard } from "../../components/ui";
import type { BezemEscapeSettings } from "../../logic/settings";
import { shouldShowZoneDevTools } from "../../logic/game-screen-preview";
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
        description="Laat opdrachtspraak en video's horen."
        icon={<Volume2 className="h-6 w-6" strokeWidth={3} />}
        label="Audio"
        onToggle={() =>
          onUpdateSettings({ ...settings, audioEnabled: !settings.audioEnabled })
        }
        testId="settings-audio-toggle"
      />
      <SettingsToggleRow
        checked={settings.musicEnabled}
        description="Zachte muziek op de achtergrond."
        icon={<Music2 className="h-6 w-6" strokeWidth={3} />}
        label="Muziek"
        onToggle={() =>
          onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })
        }
        testId="settings-music-toggle"
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
      <SettingsToggleRow
        checked={shouldShowZoneDevTools()}
        description="Open de interactieve zone-locatie editor."
        icon={<Wrench className="h-6 w-6" strokeWidth={3} />}
        label="Zone Editor (DevTools)"
        onToggle={() => {
          const url = new URL(window.location.href);
          if (shouldShowZoneDevTools()) {
            url.searchParams.delete("zoneDevTools");
            url.searchParams.delete("dev");
          } else {
            url.searchParams.set("zoneDevTools", "true");
            url.searchParams.set("screen", "scene-builder");
          }
          window.location.href = url.toString();
        }}
        testId="settings-zone-editor-toggle"
      />
    </PanelCard>
  </div>
);

SettingsTogglePanel.displayName = "SettingsTogglePanel";
