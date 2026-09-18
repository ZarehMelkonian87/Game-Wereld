import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  HardDrive,
  RefreshCw,
  Trash2,
  Wifi,
  X,
} from "lucide-react";
import { getDeviceConnectionInfo } from "../pwa/GameAssetSyncManager";
import type { DownloadGateState } from "./downloadGate";
import { LockedPlayButton } from "./LockedPlayButton";

export interface DownloadGateModalProps {
  /** Of de gebruiker op een mobiele dataverbinding (4G/5G) zit. */
  isCellular?: boolean;
  /** Controller acties en toestand van de gate. */
  gate: DownloadGateState;
  /** Titel van het spel (bv. "Magisch Strand-Avontuur"). */
  gameTitle: string;
  /** Wordt aangeroepen wanneer de download gestart of bevestigd wordt. */
  onConfirmDownload?: () => void;
  /** Wordt aangeroepen wanneer de modal gesloten wordt (achtergrond-download loopt door). */
  onDismiss: () => void;
  /** Direct spelen zodra de download 100% voltooid is. */
  onPlay?: () => void;
  /** Opnieuw proberen bij een downloadfout. */
  onRetry?: () => void;
  /** Lokale gamebestanden verwijderen. */
  onRemove?: () => void;
}

const formatMb = (bytes?: number): string => {
  if (bytes === undefined || bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return mb < 0.1 ? "< 0.1 MB" : `${mb.toFixed(1)} MB`;
};

export const DownloadGateModal = ({
  isCellular: propIsCellular,
  gate,
  gameTitle,
  onConfirmDownload,
  onDismiss,
  onPlay,
  onRetry,
  onRemove,
}: DownloadGateModalProps) => {
  const isCellular = propIsCellular ?? getDeviceConnectionInfo().isCellular;
  const modalRef = useRef<HTMLDivElement>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Sluit de modal bij druk op Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);

  const percent = gate.progress?.percent ?? (gate.phase === "ready" ? 100 : 0);
  const downloadedMb = formatMb(gate.progress?.downloadedBytes);
  const totalMb = formatMb(gate.progress?.totalBytes ?? gate.requiredBytes);
  const isStorageError =
    gate.phase === "error" &&
    (gate.message?.toLowerCase().includes("ruimte") ||
      gate.message?.toLowerCase().includes("opslag") ||
      gate.message?.toLowerCase().includes("storage") ||
      (gate.availableBytes !== undefined &&
        gate.requiredBytes !== undefined &&
        gate.availableBytes < gate.requiredBytes));

  return (
    <div
      aria-labelledby="download-gate-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-5 py-4 sm:px-8 sm:py-6 backdrop-blur-md safe-area-inset"
      data-component="DownloadGateModal"
      data-gate-phase={gate.phase}
      ref={modalRef}
      role="dialog"
    >
      <div className="relative flex w-full max-w-[350px] sm:max-w-[400px] flex-col overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-sky-300/80 bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 p-4 sm:p-5 text-white shadow-[0_12px_40px_rgba(3,105,161,0.35)]">
        {/* Sluitknop (achtergrond-download) */}
        <button
          aria-label="Sluit downloadvenster. De download loopt op de achtergrond door."
          className="absolute right-2.5 top-2.5 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition-all duration-150 hover:bg-slate-700 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          data-slot="close-button"
          onClick={onDismiss}
          type="button"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        {/* Header met badge */}
        <div className="text-center px-6">
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-950/80 px-2.5 py-0.5 text-[11px] font-black tracking-wide text-sky-200">
            <Download aria-hidden="true" className="h-3 w-3 text-sky-400" />
            Eenmalige Offline Download
          </span>
          <h2
            className="mt-1.5 text-lg sm:text-xl font-black text-white"
            id="download-gate-title"
          >
            {gameTitle}
          </h2>
        </div>

        {isConfirmingDelete ? (
          <div className="mt-3 flex flex-col items-center py-1 text-center" data-state-view="confirm-delete">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
              <Trash2 aria-hidden="true" className="h-6 w-6" />
            </div>
            <h3 className="mt-2 text-base font-black text-white">
              Spel verwijderen?
            </h3>
            <p className="mt-1.5 max-w-xs text-xs font-semibold text-slate-200">
              Weet je zeker dat je <strong className="text-white">"{gameTitle}"</strong> wilt verwijderen? De offline bestanden ({totalMb}) worden van dit apparaat gewist.
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Je kunt het spel later altijd opnieuw downloaden om offline te spelen.
            </p>
            <div className="mt-3.5 flex w-full flex-col gap-2">
              <button
                className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-500 bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2 text-sm font-black text-white shadow-md hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                data-slot="confirm-delete-button"
                onClick={() => {
                  setIsConfirmingDelete(false);
                  onRemove?.();
                }}
                type="button"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                Verwijder gamebestanden
              </button>
              <button
                className="flex min-h-[40px] w-full cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-400"
                onClick={() => setIsConfirmingDelete(false)}
                type="button"
              >
                Annuleren
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Inhoud per toestand (GDD §2.3) */}
            <div aria-live="polite" className="mt-3 flex flex-col items-center text-center">
              {/* TOESTAND: SIZING / CHECKING */}
              {(gate.phase === "sizing" || gate.phase === "checking") && (
                <div className="flex flex-col items-center py-3" data-state-view="sizing">
                  <RefreshCw
                    aria-hidden="true"
                    className="h-8 w-8 animate-spin text-sky-400"
                  />
                  <p className="mt-2.5 text-sm font-black text-sky-100">
                    Downloadgrootte bepalen…
                  </p>
                  <p className="mt-0.5 text-[11px] text-sky-300">
                    Even geduld, we controleren de gamebestanden.
                  </p>
                </div>
              )}

              {/* TOESTAND: CONFIRM (Mobiele data / Groot pakket) */}
              {gate.phase === "confirm" && (
                <div className="flex w-full flex-col items-center py-1" data-state-view="confirm">
                  <h3 className="mt-1 text-base font-black text-amber-300">
                    {isCellular
                      ? "Mobiele data (4G/5G)"
                      : (gate.requiredBytes ?? 0) > 50 * 1024 * 1024
                      ? "Groot pakket downloaden"
                      : "Offline download"}
                  </h3>
                  <p className="mt-1 max-w-xs text-xs font-semibold text-slate-200">
                    {isCellular
                      ? `Je gebruikt een mobiele dataverbinding. Deze eenmalige download is ongeveer ${totalMb}.`
                      : (gate.requiredBytes ?? 0) > 50 * 1024 * 1024
                      ? `Dit pakket is groter dan 50 MB (${totalMb}). Wil je dit nu downloaden voor offline gebruik?`
                      : `Download ${totalMb} aan audio en animaties om dit spel direct en vloeiend offline te kunnen spelen.`}
                  </p>
                  {gate.availableBytes !== undefined && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      Beschikbare opslag op toestel: {formatMb(gate.availableBytes)}
                    </p>
                  )}
                  <div className="mt-3 flex w-full flex-col gap-2">
                    <button
                      className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-sm font-black text-white shadow-md hover:brightness-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-300"
                      onClick={onConfirmDownload}
                      type="button"
                    >
                      <Download aria-hidden="true" className="h-4 w-4" />
                      {isCellular ? "Toch downloaden" : `Start Download (${totalMb})`}
                    </button>
                    <button
                      className="flex min-h-[40px] w-full cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-400"
                      onClick={onDismiss}
                      type="button"
                    >
                      {isCellular ? "Wacht op wifi" : "Later"}
                    </button>
                  </div>
                </div>
              )}

              {/* TOESTAND: DOWNLOADING */}
              {gate.phase === "downloading" && (
                <div className="w-full py-1" data-state-view="downloading">
                  <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-sky-200">
                    <span>Fase 2 van 3: Bestanden opslaan…</span>
                    <span className="font-black text-white">{percent}%</span>
                  </div>

                  {/* Voortgangsbalk */}
                  <div
                    aria-label="Downloadvoortgang"
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={percent}
                    className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800 p-0.5"
                    role="progressbar"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 transition-all duration-300"
                      style={{ width: `${Math.max(4, percent)}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-sky-300">
                    <span>
                      {downloadedMb} van {totalMb}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-300">
                      <Wifi aria-hidden="true" className="h-3 w-3" />
                      {isCellular ? "4G/5G" : "WiFi"} • Actief
                    </span>
                  </div>
                </div>
              )}

              {/* TOESTAND: VERIFYING */}
              {gate.phase === "verifying" && (
                <div className="w-full py-2" data-state-view="verifying">
                  <div className="flex flex-col items-center">
                    <RefreshCw
                      aria-hidden="true"
                      className="h-8 w-8 animate-spin text-cyan-400"
                    />
                    <p className="mt-2 text-sm font-black text-cyan-100">
                      Fase 3 van 3: Bestanden controleren…
                    </p>
                    <p className="mt-0.5 text-[11px] text-sky-300">
                      Bijna klaar, we verifiëren dat alles compleet is opgeslagen.
                    </p>
                  </div>
                </div>
              )}

              {/* TOESTAND: READY (Voltooid) */}
              {gate.phase === "ready" && (
                <div className="flex flex-col items-center py-1" data-state-view="ready">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <h3 className="mt-2 text-base sm:text-lg font-black text-emerald-300">
                    Download Voltooid!
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-slate-200">
                    100% Opgeslagen • Direct offline speelbaar
                  </p>
                </div>
              )}

              {/* TOESTAND: ERROR */}
              {gate.phase === "error" && (
                <div className="flex flex-col items-center py-1" data-state-view="error">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
                    {isStorageError ? (
                      <HardDrive aria-hidden="true" className="h-6 w-6" />
                    ) : (
                      <AlertCircle aria-hidden="true" className="h-6 w-6" />
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-black text-rose-300">
                    {isStorageError ? "Te weinig opslagruimte" : "Download kon niet worden voltooid"}
                  </h3>
                  <p className="mt-1 max-w-xs text-xs font-semibold text-slate-200">
                    {isStorageError
                      ? `Er is te weinig vrije opslag op dit toestel (${formatMb(gate.availableBytes)} beschikbaar, ${totalMb} nodig). Maak wat ruimte vrij en probeer opnieuw.`
                      : (gate.message ??
                        "Er ging iets mis tijdens het downloaden van de bestanden. Tik op opnieuw proberen om door te gaan.")}
                  </p>
                  {onRetry && (
                    <button
                      className="mt-3 flex min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-xs font-black text-white shadow-md hover:brightness-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-300"
                      onClick={onRetry}
                      type="button"
                    >
                      <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
                      Opnieuw Proberen
                    </button>
                  )}
                </div>
              )}

              {/* TOESTAND: NEEDS-DOWNLOAD (Startscherm van de download) */}
              {gate.phase === "needs-download" && (
                <div className="flex flex-col items-center py-1" data-state-view="needs-download">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
                    <Download aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <h3 className="mt-2 text-base font-black text-white">
                    Download vereist voor dit apparaat
                  </h3>
                  <p className="mt-1 max-w-xs text-xs font-semibold text-slate-200">
                    Download {totalMb} aan bestanden om direct en zonder haperingen te spelen.
                  </p>
                  {onConfirmDownload && (
                    <button
                      className="mt-3 flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-sm font-black text-white shadow-lg hover:brightness-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-300"
                      onClick={onConfirmDownload}
                      type="button"
                    >
                      <Download aria-hidden="true" className="h-4 w-4" />
                      Start Download ({totalMb})
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Play-knop (Geblokkeerd tot 100%!) - Niet nodig in confirm fase */}
            {gate.phase !== "confirm" && (
              <div className="mt-3.5 border-t border-slate-800/80 pt-3">
                <LockedPlayButton
                  canPlay={gate.canPlay || gate.phase === "ready"}
                  lockedLabel="Speel Nu (Pas na 100% download)"
                  onClick={onPlay}
                  readyLabel="Klaar! Start Avontuur"
                />

                {(gate.canPlay || gate.phase === "ready") && onRemove && (
                  <div className="mt-2 flex justify-center">
                    <button
                      aria-label="Verwijder offline gamebestanden van dit apparaat"
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-300/90 transition-colors hover:text-rose-200 cursor-pointer underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-300 rounded px-2 py-0.5"
                      data-slot="remove-package-button"
                      onClick={() => setIsConfirmingDelete(true)}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                      Gamebestanden van apparaat verwijderen
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Vaste voetnoot (GDD §2.3) */}
            <p className="mt-2.5 text-center text-[10px] leading-tight font-medium text-slate-400">
              Na deze download hoef je <strong className="text-slate-200">nooit meer opnieuw</strong> te downloaden, behalve bij een nieuwe app-update.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

DownloadGateModal.displayName = "DownloadGateModal";
