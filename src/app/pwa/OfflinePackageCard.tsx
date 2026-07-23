import type { OfflinePackageDescriptor } from "./offlinePackages";
import { LARGE_OFFLINE_PACKAGE_BYTES } from "./offlinePackages";
import { useOfflinePackage } from "./useOfflinePackage";

interface OfflinePackageCardProps {
  descriptor: OfflinePackageDescriptor;
  title: string;
}

const formatBytes = (bytes?: number) => {
  if (bytes === undefined) return "onbekend";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const OfflinePackageCard = ({ descriptor, title }: OfflinePackageCardProps) => {
  const { cancel, download, prepare, refresh, remove, state } = useOfflinePackage(descriptor);
  const awaiting = state.status === "awaiting-confirmation";
  const isLarge = awaiting && state.manifest.totalBytes > LARGE_OFFLINE_PACKAGE_BYTES;
  const progress =
    state.status === "downloading"
      ? Math.round((state.downloadedBytes / state.totalBytes) * 100)
      : undefined;

  return (
    <section
      aria-labelledby={`offline-package-${descriptor.id}`}
      className="mt-5 rounded-2xl border-2 border-cyan-400/60 bg-slate-950/75 p-4 text-white"
      data-component="OfflinePackageCard"
      data-offline-status={state.status}
    >
      <h2 className="text-lg font-black" id={`offline-package-${descriptor.id}`}>
        {title} offline
      </h2>
      <div aria-live="polite" className="mt-2 text-sm text-cyan-100">
        {state.status === "not-downloaded" ? <p>Nog niet gedownload voor offline spelen.</p> : null}
        {state.status === "estimating" ? <p>Benodigde opslagruimte bepalen…</p> : null}
        {awaiting ? (
          <>
            <p>
              Downloadgrootte: <strong>{formatBytes(state.manifest.totalBytes)}</strong>. Vrije
              ruimte volgens dit apparaat: {formatBytes(state.availableBytes)}.
            </p>
            {isLarge ? (
              <p className="mt-1 text-amber-200">
                Dit pakket is groter dan 50 MB. Bevestig de download bewust.
              </p>
            ) : null}
          </>
        ) : null}
        {state.status === "downloading" ? (
          <>
            <p>
              Downloaden: {progress}% ({formatBytes(state.downloadedBytes)} van{" "}
              {formatBytes(state.totalBytes)})
            </p>
            <progress className="mt-2 w-full" max={100} value={progress}>
              {progress}%
            </progress>
          </>
        ) : null}
        {state.status === "verifying" ? <p>Alle verplichte bestanden controleren…</p> : null}
        {state.status === "ready" ? (
          <p>
            Offline beschikbaar — {formatBytes(state.manifest.totalBytes)} gecontroleerd voor
            contentversie {state.manifest.contentVersion}.
          </p>
        ) : null}
        {state.status === "partial" ? (
          <p>Niet compleet: {state.missingAssets} verplicht bestand ontbreekt.</p>
        ) : null}
        {state.status === "outdated" ? (
          <p>Versie {state.installedVersion} is verouderd. Download het huidige pakket opnieuw.</p>
        ) : null}
        {state.status === "failed" ? <p>{state.message}</p> : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["failed", "not-downloaded", "outdated", "partial"].includes(state.status) ? (
          <button
            className="min-h-12 rounded-xl bg-cyan-500 px-5 font-black text-slate-950"
            onClick={() => void prepare()}
            type="button"
          >
            {state.status === "not-downloaded" ? "Grootte controleren" : "Opnieuw proberen"}
          </button>
        ) : null}
        {awaiting ? (
          <button
            className="min-h-12 rounded-xl bg-emerald-500 px-5 font-black text-slate-950"
            onClick={() => void download()}
            type="button"
          >
            {isLarge ? "Ja, groot pakket downloaden" : "Downloaden"}
          </button>
        ) : null}
        {state.status === "downloading" ? (
          <button
            className="min-h-12 rounded-xl border-2 border-white px-5 font-black"
            onClick={cancel}
            type="button"
          >
            Annuleren
          </button>
        ) : null}
        {state.status === "ready" ? (
          <button
            className="min-h-12 rounded-xl border-2 border-rose-300 px-5 font-black text-rose-100"
            onClick={() => void remove()}
            type="button"
          >
            Offlinepakket verwijderen
          </button>
        ) : null}
        {state.status === "failed" ? (
          <button
            className="min-h-12 rounded-xl border-2 border-white px-5 font-black"
            onClick={() => void refresh()}
            type="button"
          >
            Status opnieuw controleren
          </button>
        ) : null}
      </div>
    </section>
  );
};

OfflinePackageCard.displayName = "OfflinePackageCard";
