import type { VoiceRecognitionStatus } from "../../logic/speech-recognition";
import { classNames } from "./classNames";

interface VoiceCommandStatusProps {
  className?: string;
  compact?: boolean;
  errorMessage?: string;
  exampleText: string;
  isSupported: boolean;
  status: VoiceRecognitionStatus;
  supportMessage: string;
  transcript?: string;
}

const getStatusTitle = (
  status: VoiceRecognitionStatus,
  transcript: string | undefined,
  isSupported: boolean,
) => {
  if (!isSupported || status === "unsupported") {
    return "Microfoon niet klaar";
  }

  if (status === "listening") {
    return "Ik luister...";
  }

  if (status === "processing") {
    return "Even kijken...";
  }

  if (status === "heard" && transcript) {
    return "Ik hoorde:";
  }

  if (status === "error") {
    return "Nog een keer";
  }

  return "Zeg een zin";
};

const getStatusDescription = ({
  errorMessage,
  exampleText,
  isSupported,
  status,
  supportMessage,
  transcript,
}: VoiceCommandStatusProps) => {
  if (!isSupported || status === "unsupported") {
    return supportMessage;
  }

  if (status === "listening") {
    return `Zeg rustig: ${exampleText}`;
  }

  if (status === "processing") {
    return "De game probeert je zin te herkennen.";
  }

  if (status === "heard" && transcript) {
    return transcript;
  }

  if (status === "error") {
    return errorMessage ?? "Ik kon de zin niet goed horen. Probeer het nog eens rustig.";
  }

  return "Tik op de microfoon en zeg een korte zin.";
};

export const VoiceCommandStatus = (props: VoiceCommandStatusProps) => {
  const { className, compact = false, isSupported, status, transcript } = props;
  const title = getStatusTitle(status, transcript, isSupported);
  const description = getStatusDescription(props);

  return (
    <div
      className={classNames(
        "rounded-3xl border-2 border-white bg-white/88 px-4 py-3 text-left text-slate-900 shadow-[0_4px_0_rgba(15,23,42,0.12)]",
        compact && "rounded-2xl px-3 py-2",
        status === "listening" && "bg-emerald-50",
        status === "heard" && "bg-sky-50",
        status === "error" && "bg-amber-50",
        className,
      )}
      data-component="VoiceCommandStatus"
      data-slot="voice-command-status"
      data-status={status}
    >
      <p
        className={classNames(
          "font-black uppercase tracking-wide text-slate-600",
          compact ? "text-[0.62rem]" : "text-sm",
        )}
      >
        {title}
      </p>
      <p
        className={classNames(
          "mt-1 font-black leading-tight",
          compact ? "text-xs" : "text-base",
        )}
      >
        {description}
      </p>
    </div>
  );
};

VoiceCommandStatus.displayName = "VoiceCommandStatus";
