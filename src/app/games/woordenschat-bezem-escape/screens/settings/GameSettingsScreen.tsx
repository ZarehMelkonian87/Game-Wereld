import { useEffect, useState } from "react";
import { useProfile } from "../../../../contexts/ProfileContext";
import {
  getMicrophonePermissionStatus,
  initialMicrophonePermissionResult,
  requestMicrophonePermission,
  type MicrophonePermissionResult,
} from "../../logic/microphone-permission";
import { resetBezemEscapeProgress, BEZEM_ESCAPE_GAME_ID } from "../../logic/progress";
import { saveUnlockedRewardIds } from "../../logic/rewards";
import {
  readBezemEscapeSettings,
  saveBezemEscapeSettings,
  type BezemEscapeSettings,
} from "../../logic/settings";
import {
  getSpeechRecognitionSupport,
  getSpeechRecognitionSupportMessage,
} from "../../logic/speech-recognition";
import {
  getMicrophoneEnvironmentMessage,
  getMicrophonePermissionAttemptMessage,
} from "./microphoneSettings";
import { ConfirmResetDialog } from "./ConfirmResetDialog";
import { ResetProgressCard } from "./ResetProgressCard";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsTogglePanel } from "./SettingsTogglePanel";
import { VoicePrivacySettingsCard } from "./VoicePrivacySettingsCard";

interface GameSettingsScreenProps {
  onBackToMenu?: () => void;
}

export const GameSettingsScreen = ({ onBackToMenu }: GameSettingsScreenProps) => {
  const { currentProfile, updateProgress } = useProfile();
  const profileId = currentProfile?.id ?? "demo-profile";
  const [settings, setSettings] = useState<BezemEscapeSettings>(() =>
    readBezemEscapeSettings(profileId),
  );
  const speechSupport = getSpeechRecognitionSupport();
  const speechSupportMessage = getSpeechRecognitionSupportMessage(speechSupport);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isCheckingMicrophonePermission, setIsCheckingMicrophonePermission] =
    useState(false);
  const [microphonePermission, setMicrophonePermission] =
    useState<MicrophonePermissionResult>(initialMicrophonePermissionResult);
  const [permissionAttemptMessage, setPermissionAttemptMessage] = useState(
    "Tik op de knop om microfoontoegang te vragen.",
  );
  const [resetMessage, setResetMessage] = useState("");
  const microphoneEnvironmentMessage = getMicrophoneEnvironmentMessage();

  useEffect(() => {
    let isMounted = true;

    getMicrophonePermissionStatus().then((permissionStatus) => {
      if (isMounted) {
        setMicrophonePermission(permissionStatus);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateSetting = (nextSettings: BezemEscapeSettings) => {
    setSettings(nextSettings);
    saveBezemEscapeSettings(profileId, nextSettings);
  };

  const handleRequestMicrophonePermission = async () => {
    setIsCheckingMicrophonePermission(true);
    setPermissionAttemptMessage(
      "Ik probeer nu de browser-popup voor microfoontoestemming te openen...",
    );

    try {
      const permissionStatus = await requestMicrophonePermission();
      setMicrophonePermission(permissionStatus);
      setPermissionAttemptMessage(getMicrophonePermissionAttemptMessage(permissionStatus));
    } finally {
      setIsCheckingMicrophonePermission(false);
    }
  };

  const handleResetProgress = () => {
    resetBezemEscapeProgress(profileId);
    saveUnlockedRewardIds(profileId, []);
    updateProgress(BEZEM_ESCAPE_GAME_ID, {
      completed: false,
      lastPlayed: new Date().toISOString(),
      score: 0,
      stars: 0,
    });

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("woordenschat-bezem-escape:reward-result");
    }

    setIsResetDialogOpen(false);
    setResetMessage("Voortgang is gewist.");
  };

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-10 overflow-y-auto overflow-x-hidden px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)]"
      data-audio-enabled={settings.audioEnabled ? "true" : "false"}
      data-hints-enabled={settings.hintsEnabled ? "true" : "false"}
      data-music-enabled={settings.musicEnabled ? "true" : "false"}
      data-reduced-motion={settings.reducedMotion ? "true" : "false"}
      data-testid="game-settings-screen"
    >
      <div className="mx-auto flex min-h-full max-w-md flex-col gap-2.5">
        <SettingsHeader onBackToMenu={onBackToMenu} />
        <SettingsTogglePanel onUpdateSettings={updateSetting} settings={settings} />
        <VoicePrivacySettingsCard
          isCheckingMicrophonePermission={isCheckingMicrophonePermission}
          microphoneEnvironmentMessage={microphoneEnvironmentMessage}
          microphonePermission={microphonePermission}
          onRequestMicrophonePermission={handleRequestMicrophonePermission}
          permissionAttemptMessage={permissionAttemptMessage}
          speechSupport={speechSupport}
          speechSupportMessage={speechSupportMessage}
        />
        <ResetProgressCard
          onOpenResetDialog={() => {
            setResetMessage("");
            setIsResetDialogOpen(true);
          }}
          resetMessage={resetMessage}
        />
      </div>
      {isResetDialogOpen ? (
        <ConfirmResetDialog
          onCancel={() => setIsResetDialogOpen(false)}
          onConfirm={handleResetProgress}
        />
      ) : null}
    </div>
  );
};

GameSettingsScreen.displayName = "GameSettingsScreen";
