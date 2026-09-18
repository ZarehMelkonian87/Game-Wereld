import { Sparkles, Star, Trophy } from "lucide-react";
import { getBeachObjectStickerUrl } from "../../../asset-urls";
import { PanelCard } from "../../../components/ui";
import type { RewardUnlock } from "../../../logic/rewards";
import type { SceneObject } from "../../../types";

interface ZegBouwRoundSummaryProps {
  builtObjectIds: readonly string[];
  nextReward?: RewardUnlock;
  objects: readonly SceneObject[];
  onBackToMenu: () => void;
  onNext: () => void;
  starsThisRound: number;
  theme: string;
  totalWordStars: number;
}

/**
 * Ronde-eindscherm van Zeg & Bouw (T-04d): viert de afgebouwde strandkaart,
 * toont de gebouwde plaatjes, de sterren van deze ronde en het eerstvolgende
 * beloningsdoel — consistent met de andere modi.
 */
export const ZegBouwRoundSummary = ({
  builtObjectIds,
  nextReward,
  objects,
  onBackToMenu,
  onNext,
  starsThisRound,
  theme,
  totalWordStars,
}: ZegBouwRoundSummaryProps) => {
  const starsToNextReward = nextReward
    ? Math.max(0, nextReward.unlockAfterWordStars - totalWordStars)
    : 0;
  const builtObjects = builtObjectIds
    .map((objectId) => objects.find((object) => object.id === objectId))
    .filter((object): object is SceneObject => Boolean(object));

  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center bg-sky-950/25 p-3 backdrop-blur-[2px]"
      data-component="ZegBouwRoundSummary"
      data-testid="zeg-bouw-complete"
    >
      <PanelCard
        aria-label="Rondesamenvatting Zeg en Bouw"
        className="grid w-full max-w-[21rem] gap-3 !rounded-[1.5rem] !p-4 text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl border-2 border-amber-300 bg-amber-100 text-amber-600 shadow-[0_4px_0_rgba(180,83,9,0.2)]">
          <Sparkles className="h-8 w-8" fill="currentColor" strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-2xl font-black leading-none text-slate-900">Strand af!</h2>
          <p className="mt-2 text-sm font-black leading-tight text-sky-900">
            Knap gedaan! Je {theme} is helemaal gebouwd.
          </p>
        </div>

        {builtObjects.length > 0 ? (
          <div
            className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-sky-200 bg-sky-50 p-2.5"
            data-testid="zeg-bouw-summary-objects"
          >
            {builtObjects.map((object) => (
              <img
                alt={object.label}
                className="h-11 w-11 object-contain drop-shadow-[0_2px_0_rgba(15,23,42,0.14)]"
                draggable={false}
                key={object.id}
                src={getBeachObjectStickerUrl(object.assetId)}
                title={object.label}
              />
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 p-2.5 text-sm font-black text-amber-900">
          <Star className="h-5 w-5 text-amber-500" fill="currentColor" strokeWidth={2} />
          Sterren deze ronde: +{starsThisRound}
        </div>

        {nextReward ? (
          <p
            className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-2.5 text-xs font-black leading-tight text-emerald-900"
            data-testid="zeg-bouw-next-reward"
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
          <button
            className="rounded-2xl border-2 border-white bg-emerald-500 px-3 py-2.5 text-sm font-black text-white shadow-md transition active:scale-95"
            data-testid="zeg-bouw-next-card-button"
            onClick={onNext}
            type="button"
          >
            Volgende strand
          </button>
          <button
            className="rounded-2xl border-2 border-white bg-sky-500 px-3 py-2.5 text-sm font-black text-white shadow-md transition active:scale-95"
            data-testid="zeg-bouw-menu-button"
            onClick={onBackToMenu}
            type="button"
          >
            Menu
          </button>
        </div>
      </PanelCard>
    </div>
  );
};

ZegBouwRoundSummary.displayName = "ZegBouwRoundSummary";
