import type { ButtonHTMLAttributes } from "react";
import { LoaderCircle, Mic, MicOff, Square } from "lucide-react";
import type { VoiceRecognitionStatus } from "../../logic/speech-recognition";
import { classNames } from "./classNames";

interface VoiceCommandButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> {
  isSupported: boolean;
  onStartListening: () => void;
  onStopListening?: () => void;
  showLabel?: boolean;
  status: VoiceRecognitionStatus;
}

const getVoiceButtonLabel = (status: VoiceRecognitionStatus, isSupported: boolean) => {
  if (!isSupported || status === "unsupported") {
    return "Spraak niet beschikbaar";
  }

  if (status === "listening") {
    return "Stop luisteren";
  }

  if (status === "processing") {
    return "Even luisteren";
  }

  return "Zeg een zin";
};

const getVoiceButtonIcon = (status: VoiceRecognitionStatus, isSupported: boolean) => {
  if (!isSupported || status === "unsupported") {
    return <MicOff className="h-7 w-7" strokeWidth={3} />;
  }

  if (status === "listening") {
    return <Square className="h-6 w-6 fill-current" strokeWidth={3} />;
  }

  if (status === "processing") {
    return <LoaderCircle className="h-7 w-7 animate-spin" strokeWidth={3} />;
  }

  return <Mic className="h-8 w-8" strokeWidth={3} />;
};

export const VoiceCommandButton = ({
  className,
  disabled = false,
  isSupported,
  onStartListening,
  onStopListening,
  showLabel = true,
  status,
  type = "button",
  ...buttonProps
}: VoiceCommandButtonProps) => {
  const isListening = status === "listening";
  const isProcessing = status === "processing";
  const label = getVoiceButtonLabel(status, isSupported);
  const isDisabled = disabled || !isSupported || status === "unsupported" || isProcessing;

  const handleClick = () => {
    if (isListening) {
      onStopListening?.();
      return;
    }

    onStartListening();
  };

  return (
    <button
      {...buttonProps}
      aria-label={label}
      aria-pressed={isListening || undefined}
      className={classNames(
        "inline-flex min-h-14 touch-manipulation items-center justify-center gap-2 rounded-3xl border-4 border-white bg-emerald-500 px-5 font-black text-white shadow-[0_5px_0_rgba(21,128,61,0.35)] transition duration-150 active:translate-y-0.5 active:scale-[0.98] active:shadow-none disabled:pointer-events-none disabled:opacity-55",
        isListening && "animate-pulse bg-rose-500 shadow-[0_5px_0_rgba(190,18,60,0.35)]",
        isProcessing && "bg-sky-500 shadow-[0_5px_0_rgba(14,116,144,0.35)]",
        (!isSupported || status === "unsupported") &&
          "bg-slate-400 shadow-[0_5px_0_rgba(71,85,105,0.25)]",
        showLabel ? "min-w-40 text-lg" : "aspect-square w-14 px-0",
        className,
      )}
      data-component="VoiceCommandButton"
      data-slot="voice-command-button"
      data-status={status}
      disabled={isDisabled}
      onClick={handleClick}
      title={label}
      type={type}
    >
      <span className="flex h-8 w-8 items-center justify-center" aria-hidden="true">
        {getVoiceButtonIcon(status, isSupported)}
      </span>
      {showLabel ? <span className="whitespace-nowrap">{label}</span> : null}
    </button>
  );
};

VoiceCommandButton.displayName = "VoiceCommandButton";

