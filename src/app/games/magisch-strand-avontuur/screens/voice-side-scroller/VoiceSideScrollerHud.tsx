import { useEffect, useRef, useState } from "react";
import { Flame, Shield, ShieldX, Trophy } from "lucide-react";
import {
  BtnNavHome,
  DspDistanceCounter,
  DspFlightScoreBadge,
  PanelCard,
} from "../../components/ui";
import { VOICE_SCROLLER_LEVEL_DISTANCE } from "./voiceSideScrollerModel";
import type { VoiceSideScrollerGameState } from "./voiceSideScrollerModel";
import type { VoiceScrollerRecord } from "./voiceSideScrollerRecord";
import {
  getVoiceScrollerDifficultyProgress,
  getVoiceScrollerDistanceMeters,
} from "./voiceSideScrollerSelectors";

interface VoiceSideScrollerHudProps {
  onBackToMenu: () => void;
  record: VoiceScrollerRecord;
  state: VoiceSideScrollerGameState;
}

const ShieldMeter = ({ maxShields, shields }: { maxShields: number; shields: number }) => {
  const previousShieldsRef = useRef(shields);
  const [isLosing, setIsLosing] = useState(false);

  useEffect(() => {
    if (shields < previousShieldsRef.current) {
      setIsLosing(true);
      const timer = window.setTimeout(() => setIsLosing(false), 550);
      previousShieldsRef.current = shields;
      return () => window.clearTimeout(timer);
    }

    previousShieldsRef.current = shields;
    return undefined;
  }, [shields]);

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border-2 border-white/80 bg-white/85 px-2 py-1 shadow-sm ${
        isLosing ? "shield-meter-shake" : ""
      }`}
      aria-label={`${shields} van ${maxShields} schildjes over`}
      data-slot="voice-side-scroller-shields"
      data-shields={shields}
      data-testid="voice-side-scroller-shields"
    >
      <style>{`
        @keyframes shieldMeterShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-3px) rotate(-2deg); }
          40% { transform: translateX(3px) rotate(2deg); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
        @keyframes shieldLostPop {
          0% { transform: scale(1.9); }
          55% { transform: scale(0.82); }
          100% { transform: scale(1); }
        }
        .shield-meter-shake { animation: shieldMeterShake 0.5s ease-in-out; }
        .shield-pip-lost-pop { animation: shieldLostPop 0.5s ease-out; }
      `}</style>
      {Array.from({ length: maxShields }).map((_, index) => {
        const isActive = index < shields;
        // Het net verloren schildje is het eerste lege vakje.
        const isJustLost = isLosing && index === shields;

        return (
          <span
            key={`shield-${index}`}
            className={`grid h-7 w-7 place-items-center rounded-xl border-2 ${
              isActive
                ? "border-emerald-300 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_2px_0_rgba(4,120,87,0.35)]"
                : "border-rose-300 bg-rose-100 text-rose-500"
            } ${isJustLost ? "shield-pip-lost-pop" : ""}`}
            data-shield-active={isActive ? "true" : "false"}
          >
            {isActive ? (
              <Shield className="h-4 w-4" fill="currentColor" strokeWidth={2.5} />
            ) : (
              <ShieldX className="h-4 w-4" strokeWidth={2.75} />
            )}
          </span>
        );
      })}
    </div>
  );
};

export const VoiceSideScrollerHud = ({ onBackToMenu, record, state }: VoiceSideScrollerHudProps) => {
  const distanceMeters = getVoiceScrollerDistanceMeters(state);
  const difficultyProgress = getVoiceScrollerDifficultyProgress(state);
  const showCombo = state.combo >= 2;

  return (
    <PanelCard
      aria-label="Zeg en Vlieg status"
      className="grid gap-1.5 !rounded-[1.35rem] !p-2"
      data-component="VoiceSideScrollerHud"
      data-testid="voice-side-scroller-hud"
      variant="transparent"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <BtnNavHome onClick={onBackToMenu} />
        <DspDistanceCounter
          distanceMeters={distanceMeters}
          maxDistance={VOICE_SCROLLER_LEVEL_DISTANCE}
          progress={difficultyProgress}
        />
        <DspFlightScoreBadge
          level={state.difficultyLevel}
          score={state.score}
          stars={state.stars}
        />
      </div>
      <div className="flex items-center justify-between gap-2 px-0.5">
        <ShieldMeter maxShields={state.maxShields} shields={state.shields} />
        {showCombo ? (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-2 py-0.5 text-xs font-black text-white shadow"
            data-testid="voice-side-scroller-combo"
          >
            <Flame className="h-4 w-4" fill="currentColor" strokeWidth={2} />
            Combo x{state.combo}
          </span>
        ) : null}
        <span
          className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-xs font-black text-sky-900 shadow"
          data-testid="voice-side-scroller-record"
        >
          <Trophy className="h-4 w-4 text-amber-500" strokeWidth={2.5} />
          Record {record.bestDistanceMeters}m
        </span>
      </div>
    </PanelCard>
  );
};

VoiceSideScrollerHud.displayName = "VoiceSideScrollerHud";
