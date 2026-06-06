import { Mic, ShieldCheck, Volume2 } from "lucide-react";
import { PanelCard } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import type {
  VoiceSideScrollerMicrophoneState,
  VoiceSideScrollerMicrophoneStatus,
} from "./useVoiceSideScrollerMicrophone";

interface VoiceSideScrollerVoiceMeterProps {
  microphone: VoiceSideScrollerMicrophoneState;
}

const statusLabels: Record<VoiceSideScrollerMicrophoneStatus, string> = {
  blocked: "Geblokkeerd",
  checking: "Checken",
  error: "Fallback",
  idle: "Klaar",
  listening: "Luistert",
  requesting: "Vragen",
  unsupported: "Geen mic",
};

const getStatusClassName = (status: VoiceSideScrollerMicrophoneStatus) =>
  classNames(
    "rounded-xl border-2 px-2 py-1 text-[0.68rem] font-black leading-none",
    status === "listening" && "border-emerald-300 bg-emerald-100 text-emerald-900",
    (status === "checking" || status === "requesting") &&
      "border-sky-300 bg-sky-100 text-sky-900",
    (status === "blocked" || status === "error") &&
      "border-amber-300 bg-amber-100 text-amber-950",
    status === "unsupported" && "border-slate-300 bg-slate-100 text-slate-700",
    status === "idle" && "border-white/80 bg-white/90 text-slate-800",
  );

const getVolumeLabel = (volumeLevel: number) => {
  if (volumeLevel < 0.08) {
    return "stil";
  }

  if (volumeLevel < 0.45) {
    return "zacht";
  }

  if (volumeLevel < 0.78) {
    return "goed";
  }

  return "hard";
};

const voiceLevelSteps = [
  { id: "stil", max: 0.08 },
  { id: "zacht", max: 0.45 },
  { id: "goed", max: 0.78 },
  { id: "hard", max: 1 },
];

const getActiveVoiceLevelIndex = (volumeLevel: number) => {
  const levelIndex = voiceLevelSteps.findIndex((step) => volumeLevel <= step.max);

  return levelIndex >= 0 ? levelIndex : voiceLevelSteps.length - 1;
};

export const VoiceSideScrollerVoiceMeter = ({
  microphone,
}: VoiceSideScrollerVoiceMeterProps) => {
  const volumePercent = Math.round(microphone.volumeLevel * 100);
  const noiseFloorPercent = Math.round(microphone.noiseFloor * 100);
  const activeVoiceLevelIndex = getActiveVoiceLevelIndex(microphone.volumeLevel);

  return (
    <PanelCard
      aria-label="Stemcontrole"
      className="grid gap-2 !rounded-[1.35rem] !p-2.5"
      data-component="VoiceSideScrollerVoiceMeter"
      data-microphone-status={microphone.status}
      data-noise-floor={noiseFloorPercent}
      data-testid="voice-side-scroller-voice-meter"
      data-vertical-input={microphone.verticalInput.toFixed(3)}
      data-volume-level={volumePercent}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700">
            <Mic className="h-5 w-5" strokeWidth={3} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-black leading-none text-slate-900">Stem</p>
            <p className="mt-1 truncate text-[0.68rem] font-black leading-none text-sky-900">
              {getVolumeLabel(microphone.volumeLevel)}
            </p>
          </div>
        </div>
        <span className={getStatusClassName(microphone.status)}>
          {statusLabels[microphone.status]}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1" data-slot="voice-level-steps">
        {voiceLevelSteps.map((step, index) => (
          <span
            aria-current={index === activeVoiceLevelIndex ? "true" : undefined}
            className={classNames(
              "min-h-8 rounded-xl border-2 px-1 py-1 text-center text-[0.62rem] font-black leading-none transition",
              index === activeVoiceLevelIndex
                ? "border-emerald-300 bg-emerald-100 text-emerald-950 shadow-[0_2px_0_rgba(5,150,105,0.18)]"
                : "border-white bg-white/75 text-slate-500",
            )}
            data-active={index === activeVoiceLevelIndex ? "true" : "false"}
            key={step.id}
          >
            {step.id}
          </span>
        ))}
      </div>

      <div
        aria-label={`Stemvolume ${volumePercent} procent`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={volumePercent}
        className="rounded-2xl border-2 border-slate-200 bg-white/90 p-1"
        role="meter"
      >
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-yellow-300 to-sky-400 transition-[width] duration-100"
            data-slot="voice-level-fill"
            style={{ width: `${volumePercent}%` }}
          />
        </div>
      </div>

      <p
        aria-live="polite"
        className="min-h-[2rem] text-[0.7rem] font-black leading-tight text-slate-800"
      >
        <Volume2 className="mr-1 inline h-3.5 w-3.5 text-sky-700" strokeWidth={3} />
        {microphone.message}
      </p>

      <p className="rounded-xl border-2 border-emerald-200 bg-emerald-50/90 p-2 text-[0.66rem] font-black leading-tight text-emerald-950">
        <ShieldCheck className="mr-1 inline h-3.5 w-3.5" strokeWidth={3} />
        Audio blijft lokaal. We slaan geen opname op.
      </p>
    </PanelCard>
  );
};

VoiceSideScrollerVoiceMeter.displayName = "VoiceSideScrollerVoiceMeter";
