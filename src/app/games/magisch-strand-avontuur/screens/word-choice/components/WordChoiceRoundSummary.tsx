import { mascotIconUrls } from "../../../asset-urls";
import { BtnActionReplay, BtnActionWorld, PanelCard } from "../../../components/ui";

interface WordChoiceRoundSummaryProps {
  difficultWords: string[];
  onBackToMenu?: () => void;
  onRestart: () => void;
  recognizedWithHint: string[];
  recognizedWithoutHelp: string[];
  speedValue: number;
  unlockedRewardLabels?: string[];
  wordStarValue: number;
}

export const WordChoiceRoundSummary = ({
  difficultWords,
  onBackToMenu,
  onRestart,
  recognizedWithHint,
  recognizedWithoutHelp,
  speedValue,
  unlockedRewardLabels = [],
  wordStarValue,
}: WordChoiceRoundSummaryProps) => {
  const totalCorrect = recognizedWithoutHelp.length + recognizedWithHint.length;
  const directWordsText =
    recognizedWithoutHelp.length > 0 ? recognizedWithoutHelp.join(", ") : "geen";
  const hintWordsText = recognizedWithHint.length > 0 ? recognizedWithHint.join(", ") : "geen";
  const needsPracticeText =
    difficultWords.length > 0 ? difficultWords.join(", ") : "geen lastige woorden!";

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-50 grid place-items-center bg-sky-950/30 p-3 backdrop-blur-[3px]"
      data-component="WordChoiceRoundSummary"
      data-testid="word-choice-round-summary"
    >
      <PanelCard
        aria-label="Kies het Woord Resultaten"
        className="grid w-full max-w-[24rem] gap-3 !rounded-[1.75rem] !p-4 text-center shadow-2xl"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border-2 border-amber-300 bg-amber-100 text-amber-700 shadow-[0_4px_0_rgba(180,83,9,0.2)]">
          <img
            alt=""
            className="h-14 w-14 object-contain"
            draggable={false}
            src={mascotIconUrls.celebration}
          />
        </div>

        <div>
          <h2 className="text-2xl font-black leading-none text-slate-900 drop-shadow-sm">
            Goed gedaan! 🎉
          </h2>
          <p className="mt-1.5 text-sm font-black leading-tight text-sky-900">
            Je hebt alle opdrachten voltooid!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs font-black text-slate-900">
          <span className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-2 shadow-xs">
            <span className="text-base text-amber-600">⭐ {wordStarValue}</span>
            <br />
            sterren
          </span>
          <span className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-2 shadow-xs">
            <span className="text-base text-emerald-600">+{speedValue}</span>
            <br />
            tempo
          </span>
          <span className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-2 shadow-xs">
            <span className="text-base text-sky-600">{totalCorrect}</span>
            <br />
            goed
          </span>
        </div>

        <div className="space-y-1.5 text-left text-xs font-black text-slate-800">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-2.5 py-1.5">
            <span className="text-emerald-800">✨ Meteen goed: </span>
            <span className="font-bold text-slate-700">{directWordsText}</span>
          </div>

          {recognizedWithHint.length > 0 && (
            <div className="rounded-xl border border-sky-200 bg-sky-50/80 px-2.5 py-1.5">
              <span className="text-sky-800">💡 Goed met hint: </span>
              <span className="font-bold text-slate-700">{hintWordsText}</span>
            </div>
          )}

          {difficultWords.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-2.5 py-1.5">
              <span className="text-amber-800">🔄 Extra geoefend: </span>
              <span className="font-bold text-slate-700">{needsPracticeText}</span>
            </div>
          )}

          {unlockedRewardLabels.length > 0 && (
            <div className="rounded-xl border border-purple-200 bg-purple-50/80 px-2.5 py-1.5 text-purple-900">
              <span>🎁 Nieuw ontgrendeld: </span>
              <span className="font-bold">{unlockedRewardLabels.join(", ")}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <BtnActionReplay
            data-testid="word-choice-summary-replay-button"
            label="Opnieuw"
            onClick={onRestart}
          />
          {onBackToMenu ? (
            <BtnActionWorld
              data-testid="word-choice-summary-menu-button"
              label="Menu"
              onClick={onBackToMenu}
            />
          ) : null}
        </div>
      </PanelCard>
    </div>
  );
};

WordChoiceRoundSummary.displayName = "WordChoiceRoundSummary";
