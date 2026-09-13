import {
  PanelCard,
  ToggleAudio,
  ToggleDevtools,
  ToggleHints,
  ToggleMusic,
  ToggleReducedMotion,
} from "../../components/ui";
import type { BezemEscapeSettings } from "../../logic/settings";
import { shouldShowZoneDevTools } from "../../logic/game-screen-preview";

interface SettingsTogglePanelProps {
  onUpdateSettings: (nextSettings: BezemEscapeSettings) => void;
  settings: BezemEscapeSettings;
}

export const SettingsTogglePanel = ({ onUpdateSettings, settings }: SettingsTogglePanelProps) => {
  // Dev-tools blijven verborgen voor eindgebruikers: alleen zichtbaar in de
  // dev-build (import.meta.env.DEV) of als de dev-modus expliciet via de URL
  // is aangezet (?dev=true / ?zoneDevTools=true).
  const showDevtoolsToggle = import.meta.env.DEV || shouldShowZoneDevTools();

  return (
    <div className="contents" data-component="SettingsTogglePanel">
      <PanelCard className="grid gap-2 !rounded-2xl !p-2.5">
        <ToggleAudio
          checked={settings.audioEnabled}
          onChange={() => onUpdateSettings({ ...settings, audioEnabled: !settings.audioEnabled })}
        />
        <ToggleMusic
          checked={settings.musicEnabled}
          onChange={() => onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })}
        />
        <ToggleHints
          checked={settings.hintsEnabled}
          onChange={() => onUpdateSettings({ ...settings, hintsEnabled: !settings.hintsEnabled })}
        />
        <ToggleReducedMotion
          checked={settings.reducedMotion}
          onChange={() => onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion })}
        />
        {showDevtoolsToggle && (
          <ToggleDevtools
            checked={shouldShowZoneDevTools()}
            onChange={() => {
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
          />
        )}
      </PanelCard>
    </div>
  );
};

SettingsTogglePanel.displayName = "SettingsTogglePanel";
