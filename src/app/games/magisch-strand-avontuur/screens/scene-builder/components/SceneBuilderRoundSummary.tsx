import { Sparkles, Star, Trophy } from "lucide-react";
import { BtnActionWorld, BtnActionReplay, PanelCard } from "../../../components/ui";
import type { RewardUnlock } from "../../../logic/rewards";
import type { SceneCompletionSummary } from "../logic/scene-builder-types";
import type { SceneObject } from "../../../types";

interface SceneBuilderRoundSummaryProps {
  nextReward?: RewardUnlock;
  objects: readonly SceneObject[];
  onBackToMenu: () => void;
  onRestart: () => void;
  summary: SceneCompletionSummary;
  totalWordStars: number;
}

const getUniqueLabels = (
  objectIds: readonly string[],
  objects: readonly SceneObject[],
): string[] => {
  const labelById = new Map(objects.map((object) => [object.id, object.label]));

  return [...new Set(objectIds)].map((objectId) => labelById.get(objectId) ?? objectId);
};

export const SceneBuilderRoundSummary = ({
  nextReward,
  objects,
  onBackToMenu,
  onRestart,
  summary,
  totalWordStars,
}: SceneBuilderRoundSummaryProps) => {
  const placedCount = summary.placedObjects.length;
  const practicedWords = getUniqueLabels(summary.practicedWords, objects);
  const practicedConcepts = [...new Set(summary.practicedConcepts)];
  const starsToNextReward = nextReward
    ? Math.max(0, nextReward.unlockAfterWordStars - totalWordStars)
    : 0;

  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center bg-sky-950/25 p-3 backdrop-blur-[2px]"
      data-component="SceneBuilderRoundSummary"
      data-testid="scene-builder-round-summary"
    >
      <PanelCard
        aria-label="Rondesamenvatting Zeg en Zet"
        className="grid w-full max-w-[22rem] gap-3 !rounded-[1.5rem] !p-4 text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl border-2 border-amber-300 bg-amber-100 text-amber-600 shadow-[0_4px_0_rgba(180,83,9,0.2)]">
          <Sparkles className="h-8 w-8" fill="currentColor" strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-2xl font-black leading-none text-slate-900">Strandplaat af!</h2>
          <p className="mt-2 text-sm font-black leading-tight text-sky-900">
            Knap gedaan! Je zette alle {placedCount} {placedCount === 1 ? "plaatje" : "plaatjes"} op
            de goede plek.
          </p>
        </div>

        <div className="grid gap-2 text-left">
          <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-2.5">
            <p className="text-[0.7rem] font-black uppercase tracking-wide text-sky-700">
              Woorden geoefend
            </p>
            <p className="mt-0.5 text-sm font-black leading-tight text-slate-900">
              {practicedWords.length > 0 ? practicedWords.join(", ") : "—"}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-2.5">
            <p className="text-[0.7rem] font-black uppercase tracking-wide text-violet-700">
              Begrippen geoefend
            </p>
            <p className="mt-0.5 text-sm font-black leading-tight text-slate-900">
              {practicedConcepts.length > 0 ? practicedConcepts.join(", ") : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 p-2.5 text-sm font-black text-amber-900">
          <Star className="h-5 w-5 text-amber-500" fill="currentColor" strokeWidth={2} />
          Jouw sterren: {totalWordStars}
        </div>

        {nextReward ? (
          <p
            className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-2.5 text-xs font-black leading-tight text-emerald-900"
            data-testid="scene-builder-next-reward"
          >
            <Trophy className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
            {starsToNextReward > 0
              ? `Nog ${starsToNextReward} ${starsToNextReward === 1 ? "ster" : "sterren"} tot: ${nextReward.label}`
              : `Je verdiende: ${nextReward.label}!`}
          </p>
        ) : (
          <p className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-2.5 text-xs font-black leading-tight text-emerald-900">
            <Trophy className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
            Alle beloningen ontgrendeld. Wat knap!
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <BtnActionReplay onClick={onRestart} />
          <BtnActionWorld data-testid="scene-builder-summary-world-button" onClick={onBackToMenu} />
        </div>
      </PanelCard>
    </div>
  );
};

SceneBuilderRoundSummary.displayName = "SceneBuilderRoundSummary";
