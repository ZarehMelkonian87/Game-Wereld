import { Star } from "lucide-react";
import { mascotIconUrls } from "../../asset-urls";
import type { RewardUnlock } from "../../logic/rewards";
import { getRewardAssetUrl } from "./rewardDisplay";

interface RewardPrizePanelProps {
  featuredReward?: RewardUnlock;
  featuredRewardName: string;
  starsEarned: number;
}

export const RewardPrizePanel = ({
  featuredReward,
  featuredRewardName,
  starsEarned,
}: RewardPrizePanelProps) => (
  <div
    className="flex min-h-0 flex-col items-center justify-center gap-1.5"
    data-component="RewardPrizePanel"
  >
    <div
      aria-hidden="true"
      className="relative flex h-[8.5rem] w-[8.5rem] shrink-0 items-center justify-center rounded-[1.75rem] border-2 border-amber-300 bg-amber-50/90 shadow-[0_4px_0_rgba(180,83,9,0.16)] landscape:h-32 landscape:w-32"
    >
      <img
        alt=""
        className="h-20 w-24 object-contain landscape:h-20 landscape:w-24"
        draggable={false}
        src={getRewardAssetUrl(featuredReward)}
      />
      <img
        alt=""
        className="absolute -right-4 -top-4 h-14 w-14 object-contain landscape:h-14 landscape:w-14"
        draggable={false}
        src={mascotIconUrls.celebration}
      />
    </div>

    <div
      aria-label={`Sterren verdiend: ${starsEarned}`}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-2xl border-2 border-amber-400 bg-amber-100 px-3 text-sm font-black text-amber-950 shadow-[0_3px_0_rgba(180,83,9,0.28)]"
      data-testid="reward-stars"
    >
      <Star className="h-4 w-4 text-amber-500" fill="currentColor" strokeWidth={2.5} />
      <span className="tabular-nums">{starsEarned}/30</span>
    </div>

    <p
      className="max-w-full truncate text-center text-[0.82rem] font-black leading-tight text-slate-900"
      data-testid="reward-featured-name"
    >
      {featuredRewardName}
    </p>
  </div>
);

RewardPrizePanel.displayName = "RewardPrizePanel";
