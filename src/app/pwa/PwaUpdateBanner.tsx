import { activateWaitingPwaUpdate } from "./pwaLifecycle";
import { usePwaLifecycle } from "./usePwaLifecycle";

export const PwaUpdateBanner = () => {
  const lifecycle = usePwaLifecycle();
  if (!["error", "update-postponed", "update-waiting"].includes(lifecycle.status)) return null;

  const postponed = lifecycle.status === "update-postponed";
  return (
    <aside
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-2xl border-2 border-cyan-300 bg-slate-950 p-4 text-white shadow-2xl"
      data-component="PwaUpdateBanner"
    >
      <p className="font-black">
        {lifecycle.status === "error"
          ? "De app-update is niet gelukt"
          : postponed
            ? "Update klaar na dit spel"
            : "Een nieuwe versie staat klaar"}
      </p>
      <p className="mt-1 text-sm text-cyan-100">
        {lifecycle.status === "error"
          ? (lifecycle.error ?? "Je kunt veilig doorgaan en het later opnieuw proberen.")
          : postponed
            ? "We wachten tot je het spel veilig hebt verlaten."
            : "Werk de app nu bij om de nieuwste versie te gebruiken."}
      </p>
      {!postponed ? (
        <button
          className="mt-3 min-h-12 rounded-xl bg-cyan-500 px-5 font-black text-slate-950"
          onClick={() => void activateWaitingPwaUpdate()}
          type="button"
        >
          Nu bijwerken
        </button>
      ) : null}
    </aside>
  );
};

PwaUpdateBanner.displayName = "PwaUpdateBanner";
