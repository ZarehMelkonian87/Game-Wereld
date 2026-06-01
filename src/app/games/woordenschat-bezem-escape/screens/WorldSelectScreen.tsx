import {
  ArrowLeft,
  BookOpen,
  Check,
  LockKeyhole,
  Orbit,
  PawPrint,
  Play,
  School,
  Star,
  Waves,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { beachObjectStickerUrls, mascotIconUrls } from "../asset-urls";
import { HudIconButton, PrimaryActionButton } from "../components/ui";
import { classNames } from "../components/ui/classNames";
import type { WorldDefinition, WorldIconId } from "../types";

interface WorldSelectScreenProps {
  onBackToStart: () => void;
  onSelectWorld: (worldId: string) => void;
  onStartWorld: () => void;
  selectedWorldId: string;
  starCount?: number;
  worlds: readonly WorldDefinition[];
}

const iconById: Record<WorldIconId, ReactNode> = {
  barn: <School className="h-7 w-7" strokeWidth={3} />,
  book: <BookOpen className="h-7 w-7" strokeWidth={3} />,
  paw: <PawPrint className="h-7 w-7" strokeWidth={3} />,
  planet: <Orbit className="h-7 w-7" strokeWidth={3} />,
  slide: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 20 16 6M13 6h5v14M5 20h14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  ),
  waves: <Waves className="h-7 w-7" strokeWidth={3} />,
};

const cardToneClasses: Record<string, string> = {
  beach: "from-emerald-100/95 via-teal-50/90 to-yellow-100/85",
  farm: "from-lime-100/80 via-green-50/75 to-red-100/60",
  playground: "from-sky-100/80 via-white/75 to-pink-100/65",
  school: "from-sky-100/80 via-yellow-50/75 to-white/70",
  space: "from-indigo-100/70 via-violet-50/75 to-pink-50/65",
  zoo: "from-green-100/75 via-lime-50/75 to-orange-100/60",
};

function WorldIcon({ icon }: { icon: WorldIconId }) {
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[1.1rem] border-[3px] border-white bg-white/90 text-slate-700 shadow-[0_4px_0_rgba(21,48,74,0.12)]">
      {iconById[icon]}
    </span>
  );
}

function StatusChip({ selected, status }: { selected: boolean; status: WorldDefinition["status"] }) {
  const isOpen = status === "open";

  return (
    <span
      className={classNames(
        "inline-flex min-h-[1.45rem] items-center justify-center rounded-full bg-white/95 px-2.5 text-[0.68rem] font-black leading-none shadow-sm",
        selected ? "text-emerald-700" : "text-slate-700",
      )}
    >
      {isOpen ? "Open" : status === "komt_later" ? "Komt later" : "Gesloten"}
    </span>
  );
}

function SelectedBadge() {
  return (
    <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border-[3px] border-white bg-emerald-400 text-white shadow-[0_3px_0_rgba(21,48,74,0.16)]">
      <Check className="h-5 w-5" strokeWidth={4} />
    </span>
  );
}

function LockedBadge() {
  return (
    <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border-[3px] border-white bg-amber-100 text-slate-700 shadow-[0_3px_0_rgba(21,48,74,0.16)]">
      <LockKeyhole className="h-4 w-4" strokeWidth={3} />
    </span>
  );
}

function WorldCard({
  onSelect,
  selected,
  world,
}: {
  onSelect: (world: WorldDefinition) => void;
  selected: boolean;
  world: WorldDefinition;
}) {
  const isOpen = world.status === "open";
  const toneClass = cardToneClasses[world.theme.cardTone] ?? cardToneClasses.beach;

  return (
    <button
      type="button"
      aria-pressed={selected || undefined}
      aria-label={`${world.title}, ${isOpen ? "open" : "komt later"}`}
      className={classNames(
        "relative min-h-[9.75rem] min-w-0 overflow-hidden rounded-[1.35rem] border-[4px] border-white bg-gradient-to-br p-3 text-left text-slate-800 shadow-[0_6px_0_rgba(21,48,74,0.15)] transition active:translate-y-0.5 active:shadow-none landscape:min-h-0",
        toneClass,
        selected &&
          "border-[5px] shadow-[0_7px_0_rgba(21,48,74,0.18),0_0_0_4px_rgba(52,211,153,0.38)]",
        !isOpen && "opacity-85",
      )}
      data-testid={`world-card-${world.id}`}
      onClick={() => onSelect(world)}
    >
      {selected ? <SelectedBadge /> : null}
      {!isOpen ? <LockedBadge /> : null}

      <WorldIcon icon={world.icon} />

      <div className="absolute bottom-3 left-3 right-2">
        <h2 className="truncate text-lg font-black leading-none text-slate-800">
          {world.title}
        </h2>
        <div className="mt-2">
          <StatusChip selected={selected} status={world.status} />
        </div>
      </div>
    </button>
  );
}

function FeaturedWorld({ world }: { world: WorldDefinition }) {
  return (
    <article
      aria-label={`Geselecteerde wereld ${world.title}`}
      className="relative min-h-[8.3rem] overflow-hidden rounded-[1.65rem] border-[5px] border-white bg-gradient-to-br from-teal-200/95 via-emerald-100/95 to-yellow-200/90 shadow-[0_7px_0_rgba(21,48,74,0.18)] landscape:min-h-0"
      data-testid="selected-world-preview"
    >
      <div className="relative z-10 w-[67%] p-4 landscape:w-[72%]">
        <StatusChip selected status={world.status} />
        <h1 className="mt-2 text-[2.1rem] font-black leading-none text-sky-900 drop-shadow-[0_2px_0_#fff] landscape:text-[2.2rem]">
          {world.title}
        </h1>
        <p className="mt-1 max-w-[13rem] text-[0.82rem] font-black leading-tight text-slate-800">
          Woorden plaatsen, luisteren en daarna racen.
        </p>
      </div>

      <img
        alt=""
        className="absolute right-1 top-2 z-20 h-20 w-20 object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.14)]"
        draggable={false}
        src={mascotIconUrls.celebration}
      />
      <img
        alt=""
        className="absolute -right-3 bottom-1 z-10 h-28 w-28 rotate-[-8deg] object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.14)]"
        draggable={false}
        src={beachObjectStickerUrls.parasol}
      />
      <img
        alt=""
        className="absolute right-12 bottom-0 z-10 h-16 w-16 object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.14)]"
        draggable={false}
        src={beachObjectStickerUrls.schelp}
      />
    </article>
  );
}

export function WorldSelectScreen({
  onBackToStart,
  onSelectWorld,
  onStartWorld,
  selectedWorldId,
  starCount = 120,
  worlds,
}: WorldSelectScreenProps) {
  const [message, setMessage] = useState<string | null>(null);
  const selectedWorld = useMemo(
    () => worlds.find((world) => world.id === selectedWorldId) ?? worlds[0],
    [selectedWorldId, worlds],
  );
  const canStartSelectedWorld = selectedWorld?.status === "open";

  function handleSelectWorld(world: WorldDefinition) {
    if (world.status !== "open") {
      setMessage(`${world.title} komt later.`);
      return;
    }

    setMessage(null);
    onSelectWorld(world.id);
  }

  return (
    <section
      aria-label="Wereldkeuze"
      className="pointer-events-auto absolute inset-0 z-10 overflow-hidden text-slate-900"
      data-testid="world-select-screen"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.72),transparent_38%),radial-gradient(circle_at_12%_78%,rgba(255,210,88,0.28),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,240,178,0.26))]"
      />

      <header className="absolute left-3 right-auto top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex h-12 w-[calc(100vw-1.5rem)] items-start gap-2.5 landscape:left-3 landscape:right-3 landscape:w-auto">
        <HudIconButton
          className="h-12 w-12 rounded-[1.1rem] border-[4px] border-white bg-white/95 shadow-[0_5px_0_rgba(21,48,74,0.18)]"
          icon={<ArrowLeft className="h-6 w-6" strokeWidth={3.2} />}
          label="Terug"
          onClick={onBackToStart}
          tone="white"
        />

        <div className="flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-[1.15rem] border-[4px] border-white bg-white/95 text-[1.35rem] font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.16)] landscape:flex-none landscape:basis-[16.25rem]">
          Kies wereld
        </div>

        <div
          aria-label={`${starCount} sterren`}
          className="inline-flex min-h-12 w-[4.875rem] shrink-0 items-center justify-center gap-1.5 rounded-[1.15rem] border-[4px] border-white bg-white/95 px-2 text-base font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.18)] landscape:ml-auto landscape:w-[8.25rem] landscape:flex-none landscape:justify-center landscape:gap-2 landscape:text-xl"
          data-testid="world-select-star-counter"
        >
          <Star className="h-5 w-5 fill-amber-300 text-amber-600 landscape:h-7 landscape:w-7" strokeWidth={2.4} />
          {starCount}
        </div>
      </header>

      <div className="absolute bottom-[max(5.3rem,calc(env(safe-area-inset-bottom)+5rem))] left-3 right-auto top-[5.25rem] z-10 grid min-h-0 w-[calc(100vw-1.5rem)] grid-rows-[8.6rem_minmax(0,1fr)] gap-2.5 landscape:bottom-4 landscape:left-[1.1rem] landscape:right-[1.1rem] landscape:top-[4.65rem] landscape:w-auto landscape:grid-cols-[minmax(250px,36%)_minmax(0,1fr)] landscape:grid-rows-1 landscape:gap-3.5">
        <FeaturedWorld world={selectedWorld} />

        <div className="grid min-h-0 min-w-0 grid-cols-2 gap-2 landscape:grid-cols-3">
          {worlds.map((world) => (
            <WorldCard
              key={world.id}
              onSelect={handleSelectWorld}
              selected={world.id === selectedWorld.id}
              world={world}
            />
          ))}
        </div>
      </div>

      {message ? (
        <div
          className="absolute bottom-[5.45rem] left-4 right-4 z-40 rounded-2xl border-[3px] border-white bg-white/95 px-3 py-2 text-center text-sm font-black text-slate-800 shadow-[0_4px_0_rgba(21,48,74,0.16)] landscape:bottom-24 landscape:left-auto landscape:right-7 landscape:w-64"
          data-testid="world-select-message"
        >
          {message}
        </div>
      ) : null}

      <div className="absolute bottom-[max(0.85rem,env(safe-area-inset-bottom))] left-5 right-auto z-30 w-[calc(100vw-2.5rem)] landscape:bottom-6 landscape:left-8 landscape:right-auto landscape:w-[min(31vw,280px)]">
        <PrimaryActionButton
          className="min-h-[4rem] w-full gap-3 rounded-[1.55rem] border-[5px] border-white bg-gradient-to-b from-[#67dc58] to-[#35bf43] px-5 text-[1.35rem] shadow-[0_7px_0_rgba(21,48,74,0.2)] hover:from-[#72e266] hover:to-[#3cca4a] disabled:border-white disabled:bg-gradient-to-b disabled:from-slate-300 disabled:to-slate-400 disabled:text-white disabled:shadow-[0_7px_0_rgba(21,48,74,0.14)] landscape:min-h-[3.6rem] landscape:text-xl"
          data-testid="world-start-button"
          disabled={!canStartSelectedWorld}
          iconLeft={
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-emerald-500"
            >
              <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={3} />
            </span>
          }
          onClick={onStartWorld}
        >
          Start wereld
        </PrimaryActionButton>
      </div>
    </section>
  );
}
