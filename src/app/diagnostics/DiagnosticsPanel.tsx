import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { DiagnosticEvent } from "../game-platform/contracts";
import { diagnosticRingBuffer } from "./appDiagnostics";
import { collectDiagnosticSnapshot, type DiagnosticSnapshot } from "./diagnosticSnapshot";

export const createSanitizedDiagnosticExport = (
  snapshot: DiagnosticSnapshot,
  events: readonly DiagnosticEvent[],
) => ({
  events,
  generatedAt: new Date().toISOString(),
  schemaVersion: 1,
  snapshot,
});

const downloadExport = (snapshot: DiagnosticSnapshot, events: readonly DiagnosticEvent[]) => {
  const payload = JSON.stringify(createSanitizedDiagnosticExport(snapshot, events), null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `game-wereld-diagnose-${snapshot.session}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const formatBytes = (bytes?: number) =>
  bytes === undefined ? "onbekend" : `${(bytes / 1_048_576).toFixed(1)} MB`;

export const DiagnosticsPanel = () => {
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<DiagnosticSnapshot>();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const events = useSyncExternalStore(
    diagnosticRingBuffer.subscribe,
    diagnosticRingBuffer.getSnapshot,
    diagnosticRingBuffer.getSnapshot,
  );

  const refresh = async () => {
    setError(undefined);
    try {
      setSnapshot(await collectDiagnosticSnapshot());
    } catch {
      setError("Diagnosegegevens konden niet worden gemeten. Probeer het opnieuw.");
    }
  };

  useEffect(() => {
    if (!open) return;
    void refresh();
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (!open) {
    return (
      <button
        className="fixed bottom-3 right-3 z-[200] min-h-12 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white shadow-xl"
        onClick={() => setOpen(true)}
        type="button"
      >
        Diagnostiek
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] overflow-auto bg-slate-950/95 p-4 text-white">
      <section
        aria-labelledby="diagnostics-title"
        className="mx-auto max-w-4xl space-y-5 rounded-2xl border border-cyan-400 bg-slate-900 p-5"
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black" id="diagnostics-title">
            Development-diagnostiek
          </h2>
          <button
            className="min-h-12 rounded-xl border border-white px-4 font-bold"
            onClick={() => setOpen(false)}
            ref={closeButtonRef}
            type="button"
          >
            Sluiten
          </button>
        </header>

        {error ? <p role="alert">{error}</p> : null}
        {snapshot ? (
          <>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="font-bold">Release / build</dt>
                <dd>
                  {snapshot.release} / {snapshot.build}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Route</dt>
                <dd>{snapshot.route}</dd>
              </div>
              <div>
                <dt className="font-bold">Diagnosesessie</dt>
                <dd>{snapshot.session}</dd>
              </div>
              <div>
                <dt className="font-bold">Database</dt>
                <dd>
                  {snapshot.database.name} v{snapshot.database.version}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Game / contentversie</dt>
                <dd>
                  {snapshot.game
                    ? `${snapshot.game.id} / ${snapshot.game.contentVersion}`
                    : "geen actieve game"}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Opslag</dt>
                <dd>
                  {formatBytes(snapshot.quota.usageBytes)} /{" "}
                  {formatBytes(snapshot.quota.quotaBytes)}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Service worker</dt>
                <dd>{snapshot.serviceWorker}</dd>
              </div>
              <div>
                <dt className="font-bold">Capabilities</dt>
                <dd>
                  {Object.entries(snapshot.capabilities)
                    .map(([key, value]) => `${key}: ${value ? "ja" : "nee"}`)
                    .join(", ")}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Offlinepakketten</dt>
                <dd>
                  {snapshot.offlinePackages.length > 0
                    ? snapshot.offlinePackages.join(", ")
                    : "geen"}
                </dd>
              </div>
            </dl>
            <details>
              <summary className="cursor-pointer font-bold">Veilige appcaches inspecteren</summary>
              <ul className="list-disc pl-6">
                {snapshot.caches.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </details>
            <div className="flex flex-wrap gap-3">
              <button
                className="min-h-12 rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
                onClick={() => void refresh()}
                type="button"
              >
                Diagnose opnieuw meten
              </button>
              <button
                className="min-h-12 rounded-xl border border-white px-4 font-bold"
                onClick={() => downloadExport(snapshot, events)}
                type="button"
              >
                Veilige export downloaden
              </button>
              <button
                className="min-h-12 rounded-xl border border-white px-4 font-bold"
                onClick={diagnosticRingBuffer.clear}
                type="button"
              >
                Events wissen
              </button>
            </div>
          </>
        ) : (
          <p role="status">Diagnosegegevens laden…</p>
        )}

        <section aria-labelledby="diagnostic-events-title">
          <h3 className="text-xl font-bold" id="diagnostic-events-title">
            Laatste veilige events ({events.length}/100)
          </h3>
          {events.length === 0 ? (
            <p>Geen events geregistreerd.</p>
          ) : (
            <ol className="space-y-2">
              {[...events].reverse().map((event) => (
                <li
                  className="rounded-xl bg-slate-800 p-3 text-sm"
                  key={`${event.timestamp}-${event.correlationId}`}
                >
                  <strong>
                    {event.subsystem}:{event.event}
                  </strong>{" "}
                  <span>
                    {event.severity} · {event.correlationId}
                  </span>
                  <pre className="mt-1 overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(event.context)}
                  </pre>
                </li>
              ))}
            </ol>
          )}
        </section>
      </section>
    </div>
  );
};

DiagnosticsPanel.displayName = "DiagnosticsPanel";
