import { ArrowLeft, EyeOff, Lightbulb, RotateCcw, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { PanelCard, PrimaryActionButton, RibbonTitle } from "../components/ui";
import { resetBezemEscapeProgress, BEZEM_ESCAPE_GAME_ID } from "../logic/progress";
import {
  readBezemEscapeSettings,
  saveBezemEscapeSettings,
  type BezemEscapeSettings,
} from "../logic/settings";
import { saveUnlockedRewardIds } from "../logic/rewards";
import { useProfile } from "../../../contexts/ProfileContext";

interface GameSettingsScreenProps {
  onBackToMenu?: () => void;
}

function ToggleRow({
  checked,
  description,
  icon,
  label,
  onToggle,
  testId,
}: {
  checked: boolean;
  description: string;
  icon: ReactNode;
  label: string;
  onToggle: () => void;
  testId: string;
}) {
  return (
    <button
      className="grid min-h-16 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border-2 border-white/80 bg-white/82 p-3 text-left shadow-[0_3px_0_rgba(15,23,42,0.12)] active:translate-y-0.5"
      data-testid={testId}
      onClick={onToggle}
      type="button"
    >
      <span
        aria-hidden="true"
        className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-black leading-tight text-slate-900">
          {label}
        </span>
        <span className="mt-1 block text-xs font-bold leading-tight text-slate-600">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`flex h-9 w-16 items-center rounded-full border-2 p-1 transition ${
          checked ? "border-emerald-400 bg-emerald-200" : "border-slate-300 bg-slate-200"
        }`}
      >
        <span
          className={`block h-6 w-6 rounded-full bg-white shadow transition ${
            checked ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

export function GameSettingsScreen({ onBackToMenu }: GameSettingsScreenProps) {
  const { currentProfile, updateProgress } = useProfile();
  const profileId = currentProfile?.id ?? "demo-profile";
  const [settings, setSettings] = useState<BezemEscapeSettings>(() =>
    readBezemEscapeSettings(profileId),
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  function updateSetting(nextSettings: BezemEscapeSettings) {
    setSettings(nextSettings);
    saveBezemEscapeSettings(profileId, nextSettings);
  }

  function handleResetProgress() {
    if (!confirmReset) {
      setConfirmReset(true);
      setResetMessage("Druk nog een keer om voortgang te wissen.");
      return;
    }

    resetBezemEscapeProgress(profileId);
    saveUnlockedRewardIds(profileId, []);
    updateProgress(BEZEM_ESCAPE_GAME_ID, {
      completed: false,
      lastPlayed: new Date().toISOString(),
      score: 0,
      stars: 0,
    });

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("woordenschat-bezem-escape:race-state");
      window.sessionStorage.removeItem("woordenschat-bezem-escape:race-result");
    }

    setConfirmReset(false);
    setResetMessage("Voortgang is gewist.");
  }

  return (
    <div
      data-testid="game-settings-screen"
      data-audio-enabled={settings.audioEnabled ? "true" : "false"}
      data-hints-enabled={settings.hintsEnabled ? "true" : "false"}
      data-reduced-motion={settings.reducedMotion ? "true" : "false"}
      className="pointer-events-auto absolute inset-0 z-10 overflow-y-auto px-3 pb-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]"
    >
      <div className="mx-auto flex min-h-full max-w-md flex-col gap-3">
        <div>
          <button
            aria-label="Terug naar game menu"
            className="mb-2 inline-flex min-h-11 items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white/88 px-3 text-sm font-black text-slate-900 shadow-[0_3px_0_rgba(71,85,105,0.22)] active:translate-y-0.5"
            data-testid="settings-back-button"
            onClick={onBackToMenu}
            type="button"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={3} />
            Menu
          </button>
          <div className="text-center">
            <RibbonTitle data-testid="settings-title">Instellingen</RibbonTitle>
          </div>
        </div>

        <PanelCard className="grid gap-2 !rounded-2xl !p-3">
          <ToggleRow
            checked={settings.audioEnabled}
            description="Spreek de opdrachten hardop uit."
            icon={<Volume2 className="h-6 w-6" strokeWidth={3} />}
            label="Audio"
            onToggle={() =>
              updateSetting({ ...settings, audioEnabled: !settings.audioEnabled })
            }
            testId="settings-audio-toggle"
          />
          <ToggleRow
            checked={settings.hintsEnabled}
            description="Laat de mascotte helpen wanneer nodig."
            icon={<Lightbulb className="h-6 w-6" strokeWidth={3} />}
            label="Hints"
            onToggle={() =>
              updateSetting({ ...settings, hintsEnabled: !settings.hintsEnabled })
            }
            testId="settings-hints-toggle"
          />
          <ToggleRow
            checked={settings.reducedMotion}
            description="Minder beweging en minder pulse-effecten."
            icon={<EyeOff className="h-6 w-6" strokeWidth={3} />}
            label="Rustige beweging"
            onToggle={() =>
              updateSetting({ ...settings, reducedMotion: !settings.reducedMotion })
            }
            testId="settings-reduced-motion-toggle"
          />
        </PanelCard>

        <PanelCard className="!rounded-2xl !p-3">
          <p className="text-xs font-black leading-tight text-slate-800">
            Data in deze game is oefenobservatie. Het is geen diagnose, geen officiele testscore en
            geen vergelijking met normgroepen.
          </p>
          <PrimaryActionButton
            className="mt-3 w-full border-rose-600 bg-rose-500 text-sm shadow-[0_4px_0_rgba(190,18,60,0.75)] hover:bg-rose-400"
            data-testid="settings-reset-progress-button"
            iconLeft={<RotateCcw className="h-5 w-5" strokeWidth={3} />}
            onClick={handleResetProgress}
          >
            {confirmReset ? "Bevestig wissen" : "Reset voortgang"}
          </PrimaryActionButton>
          <p
            className="mt-2 min-h-5 text-xs font-black leading-tight text-slate-700"
            data-testid="settings-reset-message"
          >
            {resetMessage}
          </p>
        </PanelCard>
      </div>
    </div>
  );
}
