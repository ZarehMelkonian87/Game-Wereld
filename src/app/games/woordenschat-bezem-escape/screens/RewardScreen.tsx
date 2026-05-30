import { Home, RotateCcw, Sparkles, Star, Trophy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { broomIconUrls, getBeachObjectStickerUrl, mascotIconUrls } from "../asset-urls";
import { PanelCard, PrimaryActionButton } from "../components/ui";
import { classNames } from "../components/ui/classNames";
import {
  firstRewardUnlocks,
  readUnlockedRewardIds,
  resolveNewRewardUnlocks,
  saveUnlockedRewardIds,
  type RewardUnlock,
} from "../logic/rewards";
import {
  BEZEM_ESCAPE_GAME_ID,
  recordRaceProgressSummary,
} from "../logic/progress";
import { useProfile } from "../../../contexts/ProfileContext";

const RACE_RESULT_STORAGE_KEY = "woordenschat-bezem-escape:race-result";

interface RewardScreenProps {
  onBackToMenu?: () => void;
  onChooseWorld?: () => void;
  onPlayAgain?: () => void;
}

interface StoredRaceResult {
  audioRepeats: number;
  correctActions: number;
  hintsUsed: number;
  mistakes: number;
  playedAt?: string;
  practicedConcepts: string[];
  practicedWords: string[];
  resultId?: string;
  speedEarned: number;
  starsEarned: number;
}

interface SummaryPillProps {
  label: string;
  value: number | string;
  tone?: "amber" | "emerald" | "sky";
}

const emptyRaceResult: StoredRaceResult = {
  audioRepeats: 0,
  correctActions: 0,
  hintsUsed: 0,
  mistakes: 0,
  playedAt: undefined,
  practicedConcepts: [],
  practicedWords: [],
  resultId: undefined,
  speedEarned: 0,
  starsEarned: 0,
};

const toneClasses = {
  amber: "border-amber-300 bg-amber-100 text-amber-950",
  emerald: "border-emerald-300 bg-emerald-100 text-emerald-950",
  sky: "border-sky-300 bg-sky-100 text-sky-950",
};

function readStoredRaceResult(): StoredRaceResult {
  if (typeof window === "undefined") {
    return emptyRaceResult;
  }

  const rawResult = window.sessionStorage.getItem(RACE_RESULT_STORAGE_KEY);

  if (!rawResult) {
    return emptyRaceResult;
  }

  try {
    const parsedResult = JSON.parse(rawResult) as Partial<StoredRaceResult>;

    return {
      audioRepeats: Number(parsedResult.audioRepeats) || 0,
      correctActions: Number(parsedResult.correctActions) || 0,
      hintsUsed: Number(parsedResult.hintsUsed) || 0,
      mistakes: Number(parsedResult.mistakes) || 0,
      playedAt: typeof parsedResult.playedAt === "string" ? parsedResult.playedAt : undefined,
      practicedConcepts: Array.isArray(parsedResult.practicedConcepts)
        ? parsedResult.practicedConcepts.filter(Boolean)
        : [],
      practicedWords: Array.isArray(parsedResult.practicedWords)
        ? parsedResult.practicedWords.filter(Boolean)
        : [],
      resultId: typeof parsedResult.resultId === "string" ? parsedResult.resultId : undefined,
      speedEarned: Number(parsedResult.speedEarned) || 0,
      starsEarned: Number(parsedResult.starsEarned) || 0,
    };
  } catch {
    return emptyRaceResult;
  }
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function formatList(values: string[], emptyLabel: string) {
  const uniqueValues = unique(values);
  return uniqueValues.length > 0 ? uniqueValues : [emptyLabel];
}

function SummaryPill({ label, tone = "sky", value }: SummaryPillProps) {
  return (
    <div
      className={classNames(
        "flex min-h-12 min-w-0 flex-col justify-center rounded-2xl border-2 px-2 text-center font-black leading-none",
        toneClasses[tone],
      )}
    >
      <span className="text-[0.65rem] uppercase tracking-normal opacity-80">{label}</span>
      <span className="mt-1 truncate text-sm tabular-nums">{value}</span>
    </div>
  );
}

function ChipList({
  emptyLabel,
  items,
  testId,
}: {
  emptyLabel: string;
  items: string[];
  testId: string;
}) {
  return (
    <div className="min-w-0">
      <div data-testid={testId} className="mt-1 flex flex-wrap gap-1.5">
        {formatList(items, emptyLabel).slice(0, 8).map((item) => (
          <span
            className="inline-flex min-h-8 items-center rounded-2xl border-2 border-white/80 bg-white/78 px-2 text-xs font-black leading-none text-slate-900"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function getRewardAssetUrl(reward: RewardUnlock | undefined) {
  if (!reward) {
    return broomIconUrls.basic;
  }

  if (reward.type === "sticker") {
    return getBeachObjectStickerUrl("schelp") ?? broomIconUrls.basic;
  }

  return broomIconUrls.basic;
}

export function RewardScreen({
  onBackToMenu,
  onChooseWorld,
  onPlayAgain,
}: RewardScreenProps) {
  const { currentProfile, updateProgress } = useProfile();
  const rewardProfileId = currentProfile?.id ?? "demo-profile";
  const progressSavedRef = useRef(false);
  const [raceResult] = useState<StoredRaceResult>(() => readStoredRaceResult());
  const [newRewards, setNewRewards] = useState<RewardUnlock[]>([]);
  const practicedWords = useMemo(
    () => formatList(raceResult.practicedWords, "nog geen woorden"),
    [raceResult.practicedWords],
  );
  const practicedConcepts = useMemo(
    () => formatList(raceResult.practicedConcepts, "nog geen plaatswoorden"),
    [raceResult.practicedConcepts],
  );
  const featuredReward = newRewards[0] ?? firstRewardUnlocks[0];
  const featuredRewardName = featuredReward?.label ?? "Woordster verzameld";
  const rewardSectionTitle = newRewards.length > 0 ? "Nieuwe beloning" : "Beloning";
  const rewardSectionText =
    newRewards.length > 0
      ? newRewards.map((reward) => reward.label).join(", ")
      : featuredRewardName;

  useEffect(() => {
    const unlockedRewardIds = readUnlockedRewardIds(rewardProfileId);
    const nextRewards = resolveNewRewardUnlocks({
      totalSpeed: raceResult.speedEarned,
      totalWordStars: raceResult.starsEarned,
      unlockedRewardIds,
    });

    setNewRewards(nextRewards);

    if (nextRewards.length === 0) {
      return;
    }

    saveUnlockedRewardIds(rewardProfileId, [
      ...unlockedRewardIds,
      ...nextRewards.map((reward) => reward.id),
    ]);
  }, [raceResult.speedEarned, raceResult.starsEarned, rewardProfileId]);

  useEffect(() => {
    const hasMeaningfulResult =
      raceResult.correctActions > 0 ||
      raceResult.practicedWords.length > 0 ||
      raceResult.starsEarned > 0;

    if (!hasMeaningfulResult || progressSavedRef.current) {
      return;
    }

    progressSavedRef.current = true;
    const progress = recordRaceProgressSummary(rewardProfileId, {
      audioRepeats: raceResult.audioRepeats,
      correctActions: raceResult.correctActions,
      hintsUsed: raceResult.hintsUsed,
      mistakes: raceResult.mistakes,
      playedAt: raceResult.playedAt,
      practicedConcepts: raceResult.practicedConcepts,
      practicedWords: raceResult.practicedWords,
      resultId: raceResult.resultId,
      speedEarned: raceResult.speedEarned,
      starsEarned: raceResult.starsEarned,
    });

    updateProgress(BEZEM_ESCAPE_GAME_ID, {
      completed: true,
      lastPlayed: raceResult.playedAt ?? new Date().toISOString(),
      score: progress.totalSpeed,
      stars: Math.min(3, Math.max(1, Math.ceil(raceResult.starsEarned / 4))),
    });
  }, [raceResult, rewardProfileId, updateProgress]);

  return (
    <div
      data-testid="reward-screen"
      data-audio-repeats={raceResult.audioRepeats}
      data-correct-actions={raceResult.correctActions}
      data-hints-used={raceResult.hintsUsed}
      data-new-rewards={newRewards.map((reward) => reward.id).join(",")}
      data-practiced-concepts={raceResult.practicedConcepts.join(",")}
      data-practiced-words={raceResult.practicedWords.join(",")}
      data-profile-id={rewardProfileId}
      data-progress-saved={progressSavedRef.current ? "true" : "false"}
      data-result-id={raceResult.resultId ?? ""}
      data-shown-rewards={featuredReward?.id ?? ""}
      data-speed-earned={raceResult.speedEarned}
      data-stars-earned={raceResult.starsEarned}
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_7rem] gap-2 landscape:grid-cols-[minmax(0,1fr)_17rem] landscape:grid-rows-[minmax(0,1fr)]">
        <PanelCard
          aria-label="Resultaat en beloning"
          data-testid="reward-card"
          className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden !p-3 landscape:col-start-1 landscape:row-start-1 landscape:grid-cols-[13rem_minmax(0,1fr)] landscape:grid-rows-1 landscape:gap-4"
        >
          <div className="flex min-h-0 flex-col items-center justify-center gap-2">
            <div
              aria-hidden="true"
              className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-[2rem] border-2 border-amber-300 bg-amber-50/90 shadow-[0_6px_0_rgba(180,83,9,0.18)] landscape:h-32 landscape:w-32"
            >
              <img
                src={getRewardAssetUrl(featuredReward)}
                alt=""
                className="h-24 w-28 object-contain landscape:h-20 landscape:w-24"
                draggable={false}
              />
              <img
                src={mascotIconUrls.celebration}
                alt=""
                className="absolute -right-5 -top-5 h-16 w-16 object-contain landscape:h-14 landscape:w-14"
                draggable={false}
              />
            </div>

            <div
              aria-label={`Sterren verdiend: ${raceResult.starsEarned}`}
              data-testid="reward-stars"
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-100 px-3 text-base font-black text-amber-950 shadow-[0_3px_0_rgba(180,83,9,0.35)]"
            >
              <Star className="h-5 w-5 text-amber-500" fill="currentColor" strokeWidth={2.5} />
              <span className="tabular-nums">{raceResult.starsEarned}/30</span>
            </div>

            <p
              data-testid="reward-featured-name"
              className="max-w-full truncate text-center text-sm font-black leading-tight text-slate-900"
            >
              {featuredRewardName}
            </p>
          </div>

          <div
            data-testid="reward-result-summary"
            className="min-h-0 overflow-y-auto pr-1"
          >
            <div className="grid grid-cols-3 gap-2">
              <SummaryPill label="Goed" tone="emerald" value={raceResult.correctActions} />
              <SummaryPill label="Speed" tone="sky" value={`+${raceResult.speedEarned}`} />
              <SummaryPill label="Hints" tone="amber" value={raceResult.hintsUsed} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <SummaryPill label="Audio" value={raceResult.audioRepeats} />
              <SummaryPill label="Sterren" tone="amber" value={`+${raceResult.starsEarned}`} />
            </div>

            <section className="mt-3">
              <h2 className="text-xs font-black leading-none text-slate-900">Woorden geoefend</h2>
              <ChipList
                emptyLabel="nog geen woorden"
                items={practicedWords}
                testId="reward-practiced-words"
              />
            </section>

            <section className="mt-3">
              <h2 className="text-xs font-black leading-none text-slate-900">Plaatswoorden</h2>
              <ChipList
                emptyLabel="nog geen plaatswoorden"
                items={practicedConcepts}
                testId="reward-practiced-concepts"
              />
            </section>

            {featuredReward ? (
              <section
                className="mt-3 rounded-2xl border-2 border-amber-300 bg-amber-100/80 p-2"
                data-testid="reward-unlocks"
              >
                <h2 className="flex items-center gap-1 text-xs font-black leading-none text-amber-950">
                  <Trophy className="h-4 w-4" fill="currentColor" strokeWidth={2.5} />
                  {rewardSectionTitle}
                </h2>
                <p className="mt-1 text-xs font-black leading-tight text-amber-950">
                  {rewardSectionText}
                </p>
              </section>
            ) : null}
          </div>
        </PanelCard>

        <PanelCard
          aria-label="Beloning acties"
          data-testid="reward-action-area"
          className="grid min-h-0 grid-cols-3 items-center gap-2 !p-2 landscape:col-start-2 landscape:row-start-1 landscape:grid-cols-1 landscape:content-center landscape:gap-3"
        >
          <PrimaryActionButton
            aria-label="Nog een keer"
            className="pointer-events-auto h-14 px-2 text-sm"
            data-testid="reward-play-again-button"
            iconLeft={<RotateCcw className="h-5 w-5" strokeWidth={3} />}
            onClick={onPlayAgain}
          >
            Opnieuw
          </PrimaryActionButton>
          <PrimaryActionButton
            aria-label="Kies wereld"
            className="pointer-events-auto h-14 px-2 text-sm"
            data-testid="reward-world-button"
            iconLeft={<Sparkles className="h-5 w-5" strokeWidth={3} />}
            onClick={onChooseWorld}
          >
            Wereld
          </PrimaryActionButton>
          <PrimaryActionButton
            aria-label="Terug naar menu"
            className="pointer-events-auto h-14 px-2 text-sm"
            data-testid="reward-menu-button"
            iconLeft={<Home className="h-5 w-5" strokeWidth={3} />}
            onClick={onBackToMenu}
          >
            Menu
          </PrimaryActionButton>
        </PanelCard>
      </div>
    </div>
  );
}
