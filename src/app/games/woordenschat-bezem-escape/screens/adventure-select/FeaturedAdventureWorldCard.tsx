import { beachObjectStickerUrls, mascotIconUrls } from "../../asset-urls";
import type { WorldDefinition } from "../../types";
import { StatusChip } from "../world-select/StatusChip";
import type { DevtoolsComponent } from "./devtools";

interface FeaturedAdventureWorldCardProps {
  world: WorldDefinition;
}

export const FeaturedAdventureWorldCard: DevtoolsComponent<FeaturedAdventureWorldCardProps> = ({
  world,
}: FeaturedAdventureWorldCardProps) => (
  <article
    aria-label={`Geselecteerde wereld ${world.title}`}
    className="relative grid min-h-[7.5rem] grid-cols-[minmax(0,1fr)_4.2rem_4.5rem] items-center gap-1 overflow-hidden rounded-[1.45rem] border-[4px] border-white bg-gradient-to-br from-teal-200/95 via-emerald-100/95 to-yellow-200/90 p-3 shadow-[0_5px_0_rgba(21,48,74,0.16)]"
    data-component="FeaturedAdventureWorldCard"
    data-testid="selected-world-preview"
    data-world-id={world.id}
  >
    <div className="relative z-10 min-w-0" data-slot="content">
      <StatusChip selected status={world.status} />
      <h1
        className="mt-1.5 truncate text-[1.75rem] font-black leading-none text-sky-900 drop-shadow-[0_2px_0_#fff]"
        data-slot="title"
      >
        {world.title}
      </h1>
      <p
        className="mt-1 max-w-[13rem] text-[0.74rem] font-black leading-tight text-slate-800"
        data-slot="description"
      >
        Woorden plaatsen, luisteren en daarna racen.
      </p>
    </div>

    <img
      alt=""
      className="relative z-20 h-[4.3rem] w-[4.3rem] object-contain drop-shadow-[0_4px_0_rgba(21,48,74,0.14)]"
      data-slot="mascot"
      draggable={false}
      src={mascotIconUrls.celebration}
    />

    <div
      className="relative z-10 flex min-w-0 flex-col items-center justify-center gap-0.5"
      data-slot="beach-props-zone"
    >
      <img
        alt=""
        className="h-[4.2rem] w-[4.2rem] rotate-[-8deg] object-contain drop-shadow-[0_4px_0_rgba(21,48,74,0.14)]"
        data-slot="parasol"
        draggable={false}
        src={beachObjectStickerUrls.parasol}
      />
      <img
        alt=""
        className="h-8 w-8 object-contain drop-shadow-[0_3px_0_rgba(21,48,74,0.12)]"
        data-slot="shells"
        draggable={false}
        src={beachObjectStickerUrls.schelp}
      />
    </div>
  </article>
);

FeaturedAdventureWorldCard.displayName = "FeaturedAdventureWorldCard";
