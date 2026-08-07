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

export const SettingsTogglePanel = ({ onUpdateSettings, settings }: SettingsTogglePanelProps) => (
  <div className="contents" data-component="SettingsTogglePanel">
    <PanelCard className="grid gap-2 !rounded-2xl !p-2.5">
      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
        <span className="text-xs font-bold text-slate-800">Audio</span>
        <ToggleAudio
          checked={settings.audioEnabled}
          onChange={() => onUpdateSettings({ ...settings, audioEnabled: !settings.audioEnabled })}
        />
      </div>
      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
        <span className="text-xs font-bold text-slate-800">Muziek</span>
        <ToggleMusic
          checked={settings.musicEnabled}
          onChange={() => onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })}
        />
      </div>
      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
        <span className="text-xs font-bold text-slate-800">Hints</span>
        <ToggleHints
          checked={settings.hintsEnabled}
          onChange={() => onUpdateSettings({ ...settings, hintsEnabled: !settings.hintsEnabled })}
        />
      </div>
      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
        <span className="text-xs font-bold text-slate-800">Rustige beweging</span>
        <ToggleReducedMotion
          checked={settings.reducedMotion}
          onChange={() => onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion })}
        />
      </div>
      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
        <span className="text-xs font-bold text-slate-800">Zone Editor (DevTools)</span>
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
      </div>
    </PanelCard>
  </div>
);

SettingsTogglePanel.displayName = "SettingsTogglePanel";
