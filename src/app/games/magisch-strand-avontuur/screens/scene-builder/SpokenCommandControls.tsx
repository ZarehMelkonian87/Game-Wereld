import { BtnTaskKeyboardToggle, VoiceCommandButton } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import type { VoiceRecognitionStatus } from "../../logic/speech-recognition";
import { voicePrivacyCopy } from "../../logic/voice-privacy";
import { useSpokenCommandControlsState } from "./hooks/useSpokenCommandControlsState";
import { TypedCommandFallback } from "./TypedCommandFallback";
import { VoicePrivacyNotice } from "./VoicePrivacyNotice";

interface SpokenCommandControlsProps {
  className?: string;
  exampleText: string;
  onTranscript: (transcript: string) => void;
  onVoiceStatusChange?: (status: VoiceRecognitionStatus) => void;
  profileId?: string;
}

export const SpokenCommandControls = ({
  className,
  exampleText,
  onTranscript,
  onVoiceStatusChange,
  profileId = "demo-profile",
}: SpokenCommandControlsProps) => {
  const {
    handleAcceptPrivacy,
    handleStartListening,
    handleSubmitTypedCommand,
    hasAcceptedPrivacy,
    hasMicrophonePermissionMessage,
    manualText,
    microphonePermission,
    setManualText,
    setShowManualFallback,
    setShowPrivacyNotice,
    shouldShowFallback,
    shouldShowPopover,
    showPrivacyNotice,
    showStatusBubble,
    status,
    stopListening,
    support,
  } = useSpokenCommandControlsState({ exampleText, onTranscript, onVoiceStatusChange, profileId });

  return (
    <div
      className={classNames(
        "pointer-events-auto relative flex shrink-0 items-center gap-1.5",
        className,
      )}
      data-component="SpokenCommandControls"
      data-fallback-visible={shouldShowFallback ? "true" : "false"}
      data-microphone-permission={microphonePermission.state}
      data-privacy-accepted={hasAcceptedPrivacy ? "true" : "false"}
      data-privacy-notice-visible={showPrivacyNotice ? "true" : "false"}
      data-slot="spoken-command-controls"
      data-speech-status={status}
      data-speech-supported={support.isSupported ? "true" : "false"}
    >
      <VoiceCommandButton
        className="border-2"
        isSupported={support.isSupported}
        onStartListening={handleStartListening}
        onStopListening={stopListening}
        showLabel={false}
        status={status}
      />
      <div className="flex items-center gap-1" data-slot="voice-actions">
        <BtnTaskKeyboardToggle
          data-testid="typed-command-open-button"
          onClick={() => setShowManualFallback(true)}
        />
      </div>

      {shouldShowPopover ? (
        <div
          className="pointer-events-auto absolute right-0 top-[calc(100%+0.35rem)] z-[70] w-[min(17rem,calc(100vw-1.5rem))]"
          data-slot="voice-status-popover"
          onClick={(event) => event.stopPropagation()}
          onPointerCancel={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onPointerMove={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
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
                onClose={support.isSupported ? () => setShowManualFallback(false) : undefined}
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
