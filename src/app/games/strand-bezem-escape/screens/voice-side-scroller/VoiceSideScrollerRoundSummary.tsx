import { Home, RotateCcw } from "lucide-react";
import { voiceSideScrollerMascotStateUrls } from "../../asset-urls";
import { PanelCard, PrimaryActionButton } from "../../components/ui";
import type { VoiceSideScrollerGameState } from "./voiceSideScrollerModel";

interface VoiceSideScrollerRoundSummaryProps {
  onBackToMenu: () => void;
  onRestart: () => void;
  state: VoiceSideScrollerGameState;
}

const getCollectedWords = (state: VoiceSideScrollerGameState) =>
  Object.values(state.education.wordObservations)
    .filter((observation) => observation.recognized)
    .map((observation) => observation.word);

const getNeedsPracticeWords = (state: VoiceSideScrollerGameState) =>
  Object.values(state.education.wordObservations)
    .filter((observation) => observation.needsPractice && !observation.recognized)
    .map((observation) => observation.word);

const getTotalWordHints = (state: VoiceSideScrollerGameState) =>
  Object.values(state.education.wordObservations).reduce(
    (sum, observation) => sum + observation.hintsUsed,
    0,
  );

const getTotalAudioRepeats = (state: VoiceSideScrollerGameState) =>
  Object.values(state.education.wordObservations).reduce(
    (sum, observation) => sum + observation.audioRepeats,
    0,
  );

export const VoiceSideScrollerRoundSummary = ({
  onBackToMenu,
  onRestart,
  state,
}: VoiceSideScrollerRoundSummaryProps) => {
  const collectedWords = getCollectedWords(state);
  const focusText = state.education.focusWords.join(", ");
  const practicedText = collectedWords.length > 0 ? collectedWords.join(", ") : "nog geen woorden";
  const needsPracticeWords = getNeedsPracticeWords(state);
  const needsPracticeText =
    needsPracticeWords.length > 0 ? needsPracticeWords.join(", ") : "geen duidelijk moeilijk woord";
  const totalHints = state.obstacleHits + getTotalWordHints(state);
  const audioRepeats = getTotalAudioRepeats(state);
  const distanceMeters = Math.floor(state.distance);

  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center bg-sky-950/20 p-3 backdrop-blur-[2px]"
      data-component="VoiceSideScrollerRoundSummary"
      data-testid="voice-side-scroller-round-summary"
    >
      <PanelCard
        aria-label="Game over resultaat"
        className="grid w-full max-w-[22rem] gap-3 !rounded-[1.5rem] !p-4 text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl border-2 border-amber-300 bg-amber-100 text-amber-700 shadow-[0_4px_0_rgba(180,83,9,0.2)]">
          <img
            alt=""
            className="h-12 w-12 object-contain"
            draggable={false}
            src={voiceSideScrollerMascotStateUrls.celebration}
          />
        </div>
        <div>
          <h2 className="text-2xl font-black leading-none text-slate-900">Game over</h2>
          <p className="mt-2 text-sm font-black leading-tight text-sky-900">
            Je raakte een obstakel. Je vloog {distanceMeters} meter.
          </p>
          <p className="mt-2 text-sm font-black leading-tight text-sky-900">Focus: {focusText}</p>
          <p className="mt-1 text-xs font-black leading-tight text-slate-700">
            Actief gezegd: {practicedText}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-black text-slate-900">
          <span className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-2">
            {state.score}
            <br />
            punten
          </span>
          <span className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-2">
            {distanceMeters}m
            <br />
            afstand
          </span>
          <span className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-2">
            {state.stars}
            <br />
            sterren
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-black text-slate-900">
          <span className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-2">
            L{state.difficultyLevel}
            <br />
            level
          </span>
          <span className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-2">
            {totalHints}
            <br />
            hints
          </span>
          <span className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-2">
            +{Math.max(0, state.speed - 1)}
            <br />
            tempo
          </span>
        </div>
        <p className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-2 text-xs font-black leading-tight text-amber-950">
          Extra oefenen: {needsPracticeText}. Herhaald: {audioRepeats}x.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <PrimaryActionButton
            aria-label="Speel opnieuw"
            className="min-w-0"
            iconLeft={<RotateCcw className="h-5 w-5" strokeWidth={3} />}
            onClick={onRestart}
            size="compact"
          >
            Opnieuw
          </PrimaryActionButton>
          <PrimaryActionButton
            aria-label="Terug naar menu"
            className="min-w-0 !bg-sky-500"
            iconLeft={<Home className="h-5 w-5" strokeWidth={3} />}
            onClick={onBackToMenu}
            size="compact"
          >
            Menu
          </PrimaryActionButton>
        </div>
      </PanelCard>
    </div>
  );
};

VoiceSideScrollerRoundSummary.displayName = "VoiceSideScrollerRoundSummary";
