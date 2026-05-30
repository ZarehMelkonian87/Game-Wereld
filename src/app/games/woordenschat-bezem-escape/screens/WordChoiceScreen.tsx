import { Volume2 } from "lucide-react";
import { beachObjectStickerUrls } from "../asset-urls";
import { InstructionBubble, ObjectStickerButton, PanelCard } from "../components/ui";

const answerOptions = [
  { id: "boot", label: "Boot", imageUrl: beachObjectStickerUrls.boot },
  { id: "dolfijn", label: "Dolfijn", imageUrl: beachObjectStickerUrls.dolfijn },
];

export function WordChoiceScreen() {
  return (
    <div
      data-testid="word-choice-screen"
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <div className="grid h-full min-h-0 grid-rows-[4rem_minmax(0,1fr)_8.75rem] gap-2 landscape:grid-cols-[minmax(13rem,18rem)_minmax(0,1fr)] landscape:grid-rows-[4rem_minmax(0,1fr)]">
        <InstructionBubble
          aria-label="Vraagpaneel"
          data-testid="word-choice-question-panel"
          text="Waar is de boot?"
          className="landscape:col-start-1 landscape:row-start-1"
        />

        <PanelCard
          aria-label="Luisterkaart"
          data-testid="word-choice-target-card"
          className="flex min-h-0 items-center justify-center landscape:col-start-1 landscape:row-start-2"
        >
          <span
            aria-hidden="true"
            className="flex h-24 w-24 items-center justify-center rounded-[2rem] border-2 border-sky-300 bg-sky-100 text-sky-700 shadow-[0_4px_0_rgba(14,116,144,0.18)]"
          >
            <Volume2 className="h-12 w-12" strokeWidth={3} />
          </span>
        </PanelCard>

        <PanelCard
          aria-label="Antwoordkaarten"
          data-testid="word-choice-answer-area"
          className="grid min-h-0 grid-cols-2 items-center justify-center gap-3 p-3 landscape:col-start-2 landscape:row-span-2 landscape:row-start-1 landscape:grid-cols-2 landscape:gap-4 landscape:p-4"
        >
          {answerOptions.map((option) => (
            <ObjectStickerButton
              className="pointer-events-auto h-full w-full"
              imageUrl={option.imageUrl}
              key={option.id}
              label={option.label}
              showLabel={false}
            />
          ))}
        </PanelCard>
      </div>
    </div>
  );
}
