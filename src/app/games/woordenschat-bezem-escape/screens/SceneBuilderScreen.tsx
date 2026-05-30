import { GameplayStatusBar, InstructionBubble, PanelCard } from "../components/ui";

interface SceneBuilderScreenProps {
  instructionText?: string;
}

function EmptyTraySlot() {
  return (
    <span
      aria-hidden="true"
      className="block h-12 w-12 rounded-2xl border-2 border-dashed border-slate-300 bg-white/55"
    />
  );
}

export function SceneBuilderScreen({
  instructionText = "Zet de boot in het water.",
}: SceneBuilderScreenProps) {
  return (
    <div
      data-testid="scene-builder-screen"
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <div className="grid h-full min-h-0 grid-rows-[4rem_minmax(0,1fr)_3rem_5rem] gap-2 landscape:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)] landscape:grid-rows-[4rem_minmax(0,1fr)_5rem]">
        <InstructionBubble
          aria-label="Opdrachtgebied"
          data-testid="scene-builder-instruction-area"
          text={instructionText}
          className="landscape:col-start-1 landscape:row-start-1"
        />

        <section
          aria-label="Scenegebied"
          data-testid="scene-builder-scene-area"
          className="min-h-0 rounded-[1.75rem] border-2 border-white/75 bg-white/5 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.18)] landscape:col-start-2 landscape:row-span-3 landscape:row-start-1"
        />

        <PanelCard
          aria-label="Statusgebied"
          data-testid="scene-builder-status-area"
          className="flex min-h-0 items-center !p-2 landscape:col-start-1 landscape:row-start-2 landscape:self-end landscape:!p-1.5"
        >
          <GameplayStatusBar speedMax={10} speedValue={6} starMax={30} starValue={18} />
        </PanelCard>

        <PanelCard
          aria-label="Traygebied"
          data-testid="scene-builder-tray-area"
          className="flex min-h-0 items-center justify-center gap-2 p-2 landscape:col-start-1 landscape:row-start-3"
        >
          <EmptyTraySlot />
          <EmptyTraySlot />
          <EmptyTraySlot />
        </PanelCard>
      </div>
    </div>
  );
}
