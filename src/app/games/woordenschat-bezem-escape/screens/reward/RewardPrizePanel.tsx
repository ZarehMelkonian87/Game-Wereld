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
    className="flex min-h-0 flex-col items-center justify-center gap-2"
    data-component="RewardPrizePanel"
  >
    <div
      aria-hidden="true"
      className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-[2rem] border-2 border-amber-300 bg-amber-50/90 shadow-[0_6px_0_rgba(180,83,9,0.18)] landscape:h-32 landscape:w-32"
    >
      <img
        alt=""
        className="h-24 w-28 object-contain landscape:h-20 landscape:w-24"
        draggable={false}
        src={getRewardAssetUrl(featuredReward)}
      />
      <img
        alt=""
        className="absolute -right-5 -top-5 h-16 w-16 object-contain landscape:h-14 landscape:w-14"
        draggable={false}
        src={mascotIconUrls.celebration}
      />
    </div>

    <div
      aria-label={`Sterren verdiend: ${starsEarned}`}
      className="inline-flex min-h-11 items-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-100 px-3 text-base font-black text-amber-950 shadow-[0_3px_0_rgba(180,83,9,0.35)]"
      data-testid="reward-stars"
    >
      <Star className="h-5 w-5 text-amber-500" fill="currentColor" strokeWidth={2.5} />
      <span className="tabular-nums">{starsEarned}/30</span>
    </div>

    <p
      className="max-w-full truncate text-center text-sm font-black leading-tight text-slate-900"
      data-testid="reward-featured-name"
    >
      {featuredRewardName}
    </p>
  </div>
);

RewardPrizePanel.displayName = "RewardPrizePanel";
