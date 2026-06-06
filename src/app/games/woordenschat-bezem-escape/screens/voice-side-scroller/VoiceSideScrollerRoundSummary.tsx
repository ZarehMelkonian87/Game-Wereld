import { Home, RotateCcw, Star } from "lucide-react";
import { PanelCard, PrimaryActionButton } from "../../components/ui";
import type { VoiceSideScrollerGameState } from "./voiceSideScrollerModel";

interface VoiceSideScrollerRoundSummaryProps {
  onBackToMenu: () => void;
  onRestart: () => void;
  state: VoiceSideScrollerGameState;
}

const getCollectedWords = (state: VoiceSideScrollerGameState) =>
  state.targets.filter((target) => target.collected).map((target) => target.word);

export const VoiceSideScrollerRoundSummary = ({
  onBackToMenu,
  onRestart,
  state,
}: VoiceSideScrollerRoundSummaryProps) => {
  const collectedWords = getCollectedWords(state);
  const practicedText = collectedWords.length > 0 ? collectedWords.join(", ") : "nog geen woorden";

  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center bg-sky-950/20 p-3 backdrop-blur-[2px]"
      data-component="VoiceSideScrollerRoundSummary"
      data-testid="voice-side-scroller-round-summary"
    >
      <PanelCard
        aria-label="Ronde klaar"
        className="grid w-full max-w-[22rem] gap-3 !rounded-[1.5rem] !p-4 text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl border-2 border-amber-300 bg-amber-100 text-amber-700 shadow-[0_4px_0_rgba(180,83,9,0.2)]">
          <Star className="h-8 w-8" fill="currentColor" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-black leading-none text-slate-900">Ronde klaar</h2>
          <p className="mt-2 text-sm font-black leading-tight text-sky-900">
            Geoefend: {practicedText}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-black text-slate-900">
          <span className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-2">
            {state.stars}/{state.targets.length}
            <br />
            sterren
          </span>
          <span className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-2">
            +{Math.max(0, state.speed - 1)}
            <br />
            speed
          </span>
          <span className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-2">
            {state.obstacleHits}
            <br />
            hints
          </span>
        </div>
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
