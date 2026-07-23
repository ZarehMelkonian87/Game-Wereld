import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  bootstrapDurableStorage,
  createStorageDiagnostic,
  createTemporaryStorage,
  resetDurableStorage,
} from "./platform";
import type {
  DatabaseBootstrapState,
  RepositoryBundle,
  StorageApplicationError,
} from "./contracts";

interface StorageContextValue {
  repositories: RepositoryBundle;
  storageMode: "durable" | "temporary";
}

const StorageContext = createContext<StorageContextValue | undefined>(undefined);

const StorageFailureScreen = ({
  error,
  onReset,
  onRetry,
  onUseTemporaryMode,
}: {
  error: StorageApplicationError;
  onReset: () => void;
  onRetry: () => void;
  onUseTemporaryMode: () => void;
}) => {
  const exportDiagnostic = () => {
    const payload = JSON.stringify(createStorageDiagnostic(error), null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `game-wereld-diagnose-${error.correlationId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <section
        aria-labelledby="storage-error-title"
        className="w-full max-w-xl space-y-4 rounded-3xl border border-amber-400 bg-slate-900 p-6"
        role="alert"
      >
        <h1 className="text-2xl font-black" id="storage-error-title">
          Voortgangsopslag is niet beschikbaar
        </h1>
        <p>{error.message}</p>
        <p className="text-sm text-slate-300">Diagnosecode: {error.correlationId}</p>
        <div className="flex flex-wrap gap-3">
          <button
            className="min-h-12 rounded-xl bg-cyan-500 px-5 font-bold text-slate-950"
            onClick={onRetry}
            type="button"
          >
            Opnieuw proberen
          </button>
          <button
            className="min-h-12 rounded-xl bg-amber-400 px-5 font-bold text-slate-950"
            onClick={onUseTemporaryMode}
            type="button"
          >
            Tijdelijk spelen
          </button>
          <button
            className="min-h-12 rounded-xl border border-slate-400 px-5 font-bold"
            onClick={exportDiagnostic}
            type="button"
          >
            Diagnose exporteren
          </button>
          <button
            className="min-h-12 rounded-xl border border-red-400 px-5 font-bold"
            onClick={() => {
              if (
                window.confirm(
                  "Weet je zeker dat je de lokale database wilt verwijderen? Niet-gemigreerde gegevens kunnen verloren gaan.",
                )
              ) {
                onReset();
              }
            }}
            type="button"
          >
            Nieuwe database maken
          </button>
        </div>
        <p className="text-sm text-amber-200">
          Tijdelijk spelen bewaart voortgang alleen zolang deze pagina open blijft.
        </p>
      </section>
    </main>
  );
};

export const StorageProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<DatabaseBootstrapState>({ status: "opening" });
  const [attempt, setAttempt] = useState(0);
  const [writeFailure, setWriteFailure] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let openedRepositories: RepositoryBundle | null = null;
    setState({ status: "opening" });
    void bootstrapDurableStorage()
      .then(({ repositories }) => {
        openedRepositories = repositories;
        if (active) {
          setState({ repositories, status: "ready" });
        } else {
          repositories.close();
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        const storageError = error as StorageApplicationError;
        setState({
          error: storageError,
          status: storageError.code === "migration-failed" ? "migration-failed" : "unavailable",
        });
      });
    return () => {
      active = false;
      openedRepositories?.close();
    };
  }, [attempt]);

  useEffect(() => {
    const handleWriteFailure = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : undefined;
      setWriteFailure(
        typeof detail?.message === "string"
          ? detail.message
          : "Voortgang kon niet worden opgeslagen.",
      );
    };
    window.addEventListener("game-wereld:storage-write-failed", handleWriteFailure);
    return () => window.removeEventListener("game-wereld:storage-write-failed", handleWriteFailure);
  }, []);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  const useTemporaryMode = useCallback(() => {
    setState({ repositories: createTemporaryStorage(), status: "ready" });
  }, []);
  const reset = useCallback(() => {
    void resetDurableStorage().then(retry);
  }, [retry]);

  const value = useMemo<StorageContextValue | null>(
    () =>
      state.status === "ready"
        ? { repositories: state.repositories, storageMode: state.repositories.mode }
        : null,
    [state],
  );

  if (state.status === "opening") {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white"
        role="status"
      >
        <p className="text-xl font-bold">Profielen en voortgang laden…</p>
      </main>
    );
  }

  if (state.status === "migration-failed" || state.status === "unavailable") {
    return (
      <StorageFailureScreen
        error={state.error}
        onReset={reset}
        onRetry={retry}
        onUseTemporaryMode={useTemporaryMode}
      />
    );
  }

  if (!value) return null;

  return (
    <StorageContext.Provider value={value}>
      {value.storageMode === "temporary" ? (
        <div
          className="sticky top-0 z-[100] bg-amber-300 px-4 py-2 text-center font-bold text-slate-950"
          role="status"
        >
          Tijdelijke modus: voortgang wordt niet bewaard na het sluiten van deze pagina.
        </div>
      ) : null}
      {writeFailure ? (
        <div
          className="sticky top-0 z-[101] flex items-center justify-center gap-3 bg-red-600 px-4 py-2 text-center font-bold text-white"
          role="alert"
        >
          <span>{writeFailure} Probeer opnieuw of beheer de lokale opslag.</span>
          <button
            className="min-h-12 rounded-lg border border-white px-3"
            onClick={() => setWriteFailure(null)}
            type="button"
          >
            Sluiten
          </button>
        </div>
      ) : null}
      {children}
    </StorageContext.Provider>
  );
};

StorageProvider.displayName = "StorageProvider";

export const useStorageRepositories = () => {
  const value = useContext(StorageContext);
  if (!value) throw new Error("useStorageRepositories vereist StorageProvider.");
  return value;
};
