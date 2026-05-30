import { PanelCard } from "../components/ui";

function PlaceholderLine({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-2 rounded-full bg-sky-200/80 ${className}`}
    />
  );
}

function EmptyTraySlot() {
  return (
    <span
      aria-hidden="true"
      className="block h-12 w-12 rounded-2xl border-2 border-dashed border-slate-300 bg-white/55"
    />
  );
}

export function SceneBuilderScreen() {
  return (
    <div
      data-testid="scene-builder-screen"
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <div className="grid h-full min-h-0 grid-rows-[3.25rem_minmax(0,1fr)_3rem_5rem] gap-2 landscape:grid-cols-[minmax(10rem,16rem)_minmax(0,1fr)] landscape:grid-rows-[3.25rem_minmax(0,1fr)_5rem]">
        <PanelCard
          aria-label="Opdrachtgebied"
          data-testid="scene-builder-instruction-area"
          className="flex min-h-0 items-center gap-3 p-2 landscape:col-start-1 landscape:row-start-1"
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border-2 border-sky-400 bg-sky-100"
          >
            <span className="h-3 w-3 rounded-full bg-sky-400" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-2">
            <PlaceholderLine className="w-3/4" />
            <PlaceholderLine className="w-1/2 bg-sky-100" />
          </span>
        </PanelCard>

        <section
          aria-label="Scenegebied"
          data-testid="scene-builder-scene-area"
          className="min-h-0 rounded-[1.75rem] border-2 border-white/75 bg-white/5 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.18)] landscape:col-start-2 landscape:row-span-3 landscape:row-start-1"
        />

        <PanelCard
          aria-label="Statusgebied"
          data-testid="scene-builder-status-area"
          className="flex min-h-0 items-center gap-2 p-2 landscape:col-start-1 landscape:row-start-2 landscape:self-end"
        >
          <span aria-hidden="true" className="h-4 w-16 rounded-full bg-emerald-200/90" />
          <span aria-hidden="true" className="h-4 flex-1 rounded-full bg-amber-200/90" />
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
