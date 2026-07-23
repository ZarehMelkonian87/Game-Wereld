import { Trophy } from "lucide-react";
import type { RewardUnlock } from "../../logic/rewards";
import { ChipList } from "./ChipList";
import { SummaryPill } from "./SummaryPill";
import type { StoredRewardResult } from "./rewardResultStorage";

interface RewardResultSummaryProps {
  featuredReward?: RewardUnlock;
  practicedConcepts: string[];
  practicedWords: string[];
  rewardResult: StoredRewardResult;
  rewardSectionText: string;
  rewardSectionTitle: string;
}

export const RewardResultSummary = ({
  featuredReward,
  practicedConcepts,
  practicedWords,
  rewardResult,
  rewardSectionText,
  rewardSectionTitle,
}: RewardResultSummaryProps) => (
  <div
    className="min-h-0 overflow-y-auto pr-1"
    data-component="RewardResultSummary"
    data-testid="reward-result-summary"
  >
    <div className="grid grid-cols-3 gap-1.5">
      <SummaryPill label="Goed" tone="emerald" value={rewardResult.correctActions} />
      <SummaryPill label="Speed" tone="sky" value={`+${rewardResult.speedEarned}`} />
      <SummaryPill label="Hints" tone="amber" value={rewardResult.hintsUsed} />
    </div>

    <div className="mt-1.5 grid grid-cols-2 gap-1.5">
      <SummaryPill label="Audio" value={rewardResult.audioRepeats} />
      <SummaryPill label="Sterren" tone="amber" value={`+${rewardResult.starsEarned}`} />
    </div>

    <section className="mt-3.5">
      <h2 className="text-[0.78rem] font-black leading-none text-slate-900">Woorden geoefend</h2>
      <ChipList
        emptyLabel="nog geen woorden"
        items={practicedWords}
        testId="reward-practiced-words"
      />
    </section>

    <section className="mt-3.5">
      <h2 className="text-[0.78rem] font-black leading-none text-slate-900">Plaatswoorden</h2>
      <ChipList
        emptyLabel="nog geen plaatswoorden"
        items={practicedConcepts}
        testId="reward-practiced-concepts"
      />
    </section>

    {featuredReward ? (
      <section
        className="mt-3 grid min-h-[4.5rem] content-center rounded-2xl border-2 border-amber-300 bg-amber-100/80 px-3 py-2"
        data-testid="reward-unlocks"
      >
        <h2 className="flex items-center gap-1 text-xs font-black leading-none text-amber-950">
          <Trophy className="h-4 w-4" fill="currentColor" strokeWidth={2.5} />
          {rewardSectionTitle}
        </h2>
        <p className="mt-1 text-xs font-black leading-tight text-amber-950">{rewardSectionText}</p>
      </section>
    ) : null}
  </div>
);

RewardResultSummary.displayName = "RewardResultSummary";
