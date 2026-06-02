import { useEffect, useRef, useState } from "react";
import { useDutchSpeechRecognition } from "../../hooks/useDutchSpeechRecognition";
import { VoiceCommandButton } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import {
  getMicrophonePermissionStatus,
  initialMicrophonePermissionResult,
  requestMicrophonePermission,
  type MicrophonePermissionResult,
} from "../../logic/microphone-permission";
import type { VoiceRecognitionStatus } from "../../logic/speech-recognition";
import {
  readVoicePrivacyAccepted,
  saveVoicePrivacyAccepted,
  voicePrivacyCopy,
} from "../../logic/voice-privacy";
import { TypedCommandFallback } from "./TypedCommandFallback";
import { VoicePrivacyNotice } from "./VoicePrivacyNotice";

interface SpokenCommandControlsProps {
  className?: string;
  exampleText: string;
  onTranscript: (transcript: string) => void;
  profileId?: string;
}

const shouldShowStatusBubble = ({
  errorMessage,
  hasMicrophonePermissionMessage,
  status,
  transcript,
}: {
  errorMessage?: string;
  hasMicrophonePermissionMessage: boolean;
  status: VoiceRecognitionStatus;
  transcript?: string;
}) =>
  status === "listening" ||
  status === "processing" ||
  status === "unsupported" ||
  hasMicrophonePermissionMessage ||
  Boolean(errorMessage) ||
  Boolean(transcript);

export const SpokenCommandControls = ({
  className,
  exampleText,
  onTranscript,
  profileId = "demo-profile",
}: SpokenCommandControlsProps) => {
  const handledTranscriptRef = useRef<string | undefined>();
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(() =>
    readVoicePrivacyAccepted(profileId),
  );
  const [manualText, setManualText] = useState("");
  const [
    hasRequestedMicrophonePermission,
    setHasRequestedMicrophonePermission,
  ] = useState(false);
  const [microphonePermission, setMicrophonePermission] =
    useState<MicrophonePermissionResult>(initialMicrophonePermissionResult);
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const {
    errorMessage,
    resetTranscript,
    startListening,
    status,
    stopListening,
    support,
    transcript,
  } = useDutchSpeechRecognition({ autoStopMs: 6500 });
  const hasMicrophonePermissionMessage =
    hasRequestedMicrophonePermission && !microphonePermission.canUse;
  const showStatusBubble = shouldShowStatusBubble({
    errorMessage,
    hasMicrophonePermissionMessage,
    status,
    transcript,
  });
  const shouldShowFallback = showManualFallback || !support.isSupported;
  const shouldShowPopover =
    showPrivacyNotice || shouldShowFallback || showStatusBubble;

  useEffect(() => {
    setHasAcceptedPrivacy(readVoicePrivacyAccepted(profileId));
  }, [profileId]);

  useEffect(() => {
    if (
      !transcript ||
      status !== "heard" ||
      handledTranscriptRef.current === transcript
    ) {
      return;
    }

    handledTranscriptRef.current = transcript;
    onTranscript(transcript);
  }, [onTranscript, status, transcript]);

  useEffect(() => {
    if (!support.isSupported) {
      setShowManualFallback(true);
    }
  }, [support.isSupported]);

  useEffect(() => {
    handledTranscriptRef.current = undefined;
    setManualText("");
    setShowManualFallback(!support.isSupported);
    setShowPrivacyNotice(false);
    resetTranscript();
  }, [exampleText, resetTranscript, support.isSupported]);

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

  const startListeningAfterPermission = async () => {
    if (!support.isSupported) {
      setShowManualFallback(true);
      return false;
    }

    setHasRequestedMicrophonePermission(true);
    const permissionStatus = await requestMicrophonePermission();
    setMicrophonePermission(permissionStatus);

    if (!permissionStatus.canUse) {
      setShowManualFallback(true);
      return false;
    }

    return startListening();
  };

  const handleStartListening = () => {
    if (!support.isSupported) {
      setShowManualFallback(true);
      return;
    }

    if (!hasAcceptedPrivacy) {
      setShowPrivacyNotice(true);
      return;
    }

    void startListeningAfterPermission();
  };

  const handleAcceptPrivacy = () => {
    saveVoicePrivacyAccepted(profileId);
    setHasAcceptedPrivacy(true);
    setShowPrivacyNotice(false);
    void startListeningAfterPermission();
  };

  const handleSubmitTypedCommand = (transcriptText: string) => {
    handledTranscriptRef.current = transcriptText;
    onTranscript(transcriptText);
    setManualText("");
    setShowManualFallback(false);
  };

  return (
    <div
      className={classNames(
        "pointer-events-auto relative flex shrink-0 flex-col items-center",
        className,
      )}
      data-component="SpokenCommandControls"
      data-slot="spoken-command-controls"
      data-fallback-visible={shouldShowFallback ? "true" : "false"}
      data-microphone-permission={microphonePermission.state}
      data-privacy-accepted={hasAcceptedPrivacy ? "true" : "false"}
      data-privacy-notice-visible={showPrivacyNotice ? "true" : "false"}
      data-speech-supported={support.isSupported ? "true" : "false"}
      data-speech-status={status}
    >
      <VoiceCommandButton
        className="border-2"
        isSupported={support.isSupported}
        onStartListening={handleStartListening}
        onStopListening={stopListening}
        showLabel={false}
        status={status}
      />
      <div className="-mt-1 flex items-center gap-1" data-slot="voice-actions">
        <span
          className="rounded-full border border-white bg-white/90 px-2 py-0.5 text-[0.58rem] font-black leading-none text-emerald-950 shadow-[0_2px_0_rgba(15,23,42,0.1)]"
          data-slot="voice-label"
        >
          Zeg zelf
        </span>
        <button
          className="rounded-full border border-white bg-sky-100 px-2 py-0.5 text-[0.58rem] font-black leading-none text-sky-950 shadow-[0_2px_0_rgba(15,23,42,0.1)]"
          data-testid="typed-command-open-button"
          onClick={() => setShowManualFallback(true)}
          type="button"
        >
          Typ
        </button>
      </div>

      {shouldShowPopover ? (
        <div
          className="absolute right-0 top-[calc(100%+0.35rem)] z-30 w-[min(17rem,calc(100vw-1.5rem))]"
          data-slot="voice-status-popover"
        >
          <div className="grid gap-2">
            {showPrivacyNotice ? (
              <VoicePrivacyNotice
                onAccept={handleAcceptPrivacy}
                onClose={() => setShowPrivacyNotice(false)}
              />
            ) : null}

            {showStatusBubble ? (
              <div className="grid gap-2">
                {hasMicrophonePermissionMessage ? (
                  <p
                    className="rounded-2xl border-2 border-amber-200 bg-amber-50/95 p-2 text-[0.68rem] font-black leading-tight text-amber-950"
                    data-testid="microphone-permission-message"
                  >
                    {microphonePermission.message}
                  </p>
                ) : null}
              </div>
            ) : null}

            {shouldShowFallback ? (
              <TypedCommandFallback
                exampleText={exampleText}
                onClose={
                  support.isSupported
                    ? () => setShowManualFallback(false)
                    : undefined
                }
                onSubmit={handleSubmitTypedCommand}
                onValueChange={setManualText}
                value={manualText}
              />
            ) : null}

            {!support.isSupported ? (
              <p
                className="rounded-2xl border-2 border-white/80 bg-white/88 p-2 text-[0.68rem] font-bold leading-tight text-slate-700"
                data-testid="voice-privacy-fallback-note"
              >
                {voicePrivacyCopy.fallback}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <span className="sr-only">Zeg bijvoorbeeld: {exampleText}</span>
    </div>
  );
};

SpokenCommandControls.displayName = "SpokenCommandControls";
