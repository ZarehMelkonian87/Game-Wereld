import { useEffect, useRef } from "react";
import { useDutchSpeechRecognition } from "../../hooks/useDutchSpeechRecognition";
import { VoiceCommandButton, VoiceCommandStatus } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import type { VoiceRecognitionStatus } from "../../logic/speech-recognition";

interface SpokenCommandControlsProps {
  className?: string;
  exampleText: string;
  onTranscript: (transcript: string) => void;
}

const shouldShowStatusBubble = ({
  errorMessage,
  status,
  transcript,
}: {
  errorMessage?: string;
  status: VoiceRecognitionStatus;
  transcript?: string;
}) =>
  status === "listening" ||
  status === "processing" ||
  Boolean(errorMessage) ||
  Boolean(transcript);

export const SpokenCommandControls = ({
  className,
  exampleText,
  onTranscript,
}: SpokenCommandControlsProps) => {
  const handledTranscriptRef = useRef<string | undefined>();
  const {
    errorMessage,
    startListening,
    status,
    stopListening,
    support,
    supportMessage,
    transcript,
  } = useDutchSpeechRecognition({ autoStopMs: 6500 });
  const showStatusBubble = shouldShowStatusBubble({ errorMessage, status, transcript });

  useEffect(() => {
    if (!transcript || status !== "heard" || handledTranscriptRef.current === transcript) {
      return;
    }

    handledTranscriptRef.current = transcript;
    onTranscript(transcript);
  }, [onTranscript, status, transcript]);

  return (
    <div
      className={classNames(
        "pointer-events-auto relative flex shrink-0 flex-col items-center",
        className,
      )}
      data-component="SpokenCommandControls"
      data-slot="spoken-command-controls"
      data-speech-supported={support.isSupported ? "true" : "false"}
      data-speech-status={status}
    >
      <VoiceCommandButton
        className="border-2"
        isSupported={support.isSupported}
        onStartListening={startListening}
        onStopListening={stopListening}
        showLabel={false}
        status={status}
      />
      <span
        className="-mt-1 rounded-full border border-white bg-white/90 px-2 py-0.5 text-[0.58rem] font-black leading-none text-emerald-950 shadow-[0_2px_0_rgba(15,23,42,0.1)]"
        data-slot="voice-label"
      >
        Zeg zelf
      </span>

      {showStatusBubble ? (
        <div
          className="absolute right-0 top-[calc(100%+0.35rem)] z-30 w-[min(17rem,calc(100vw-1.5rem))]"
          data-slot="voice-status-popover"
        >
          <VoiceCommandStatus
            compact
            errorMessage={errorMessage}
            isSupported={support.isSupported}
            status={status}
            supportMessage={supportMessage}
            transcript={transcript}
          />
        </div>
      ) : null}

      <span className="sr-only">Zeg bijvoorbeeld: {exampleText}</span>
    </div>
  );
};

SpokenCommandControls.displayName = "SpokenCommandControls";
