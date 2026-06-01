import { beachObjectStickerUrls, mascotIconUrls } from "../../asset-urls";
import type { WorldDefinition } from "../../types";
import type { DevtoolsComponent } from "./devtools";
import { StatusChip } from "./StatusChip";

interface FeaturedWorldCardProps {
  world: WorldDefinition;
}

export const FeaturedWorldCard: DevtoolsComponent<FeaturedWorldCardProps> = ({ world }) => (
  <article
    aria-label={`Geselecteerde wereld ${world.title}`}
    className="relative grid min-h-[8.3rem] grid-cols-[minmax(0,1fr)_4.8rem_5.3rem] items-stretch gap-1 overflow-hidden rounded-[1.65rem] border-[5px] border-white bg-gradient-to-br from-teal-200/95 via-emerald-100/95 to-yellow-200/90 p-3 shadow-[0_7px_0_rgba(21,48,74,0.18)] landscape:min-h-0 landscape:grid-cols-1 landscape:grid-rows-[auto_minmax(0,1fr)_5.8rem] landscape:gap-2 landscape:p-4"
    data-component="FeaturedWorldCard"
    data-testid="selected-world-preview"
    data-world-id={world.id}
  >
    <div className="relative z-10 min-w-0 self-center landscape:self-start" data-slot="content">
      <StatusChip selected status={world.status} />
      <h1
        className="mt-2 text-[1.95rem] font-black leading-none text-sky-900 drop-shadow-[0_2px_0_#fff] landscape:text-[2.2rem]"
        data-slot="title"
      >
        {world.title}
      </h1>
      <p
        className="mt-1 max-w-[11rem] text-[0.78rem] font-black leading-tight text-slate-800 landscape:max-w-[12rem] landscape:text-[0.82rem]"
        data-slot="description"
      >
        Woorden plaatsen, luisteren en daarna racen.
      </p>
    </div>

    <div
      className="relative z-20 flex min-w-0 items-center justify-center self-stretch"
      data-slot="mascot-zone"
    >
      <img
        alt=""
        className="h-[4.8rem] w-[4.8rem] object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.14)] landscape:h-[5.5rem] landscape:w-[5.5rem]"
        data-slot="mascot"
        draggable={false}
        src={mascotIconUrls.celebration}
      />
    </div>

    <div
      className="relative z-10 flex min-w-0 flex-col items-center justify-center gap-1 self-stretch landscape:flex-row landscape:items-end landscape:justify-center landscape:gap-2"
      data-slot="beach-props-zone"
    >
      <img
        alt=""
        className="h-[4.7rem] w-[4.7rem] rotate-[-8deg] object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.14)] landscape:h-[5.4rem] landscape:w-[5.4rem]"
        data-slot="parasol"
        draggable={false}
        src={beachObjectStickerUrls.parasol}
      />
      <img
        alt=""
        className="h-10 w-10 object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.14)] landscape:h-12 landscape:w-12"
        data-slot="shells"
        draggable={false}
        src={beachObjectStickerUrls.schelp}
      />
    </div>
  </article>
);

FeaturedWorldCard.displayName = "FeaturedWorldCard";
