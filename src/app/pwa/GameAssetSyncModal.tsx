/**
 * @file GameAssetSyncModal.tsx
 * @description Kindvriendelijk en dynamisch synchronisatiescherm.
 * Downloadt automatisch via wifi en vraagt een bewuste bevestiging wanneer
 * de gebruiker op een mobiele 4G/5G-databundel zit.
 */

import { motion } from "motion/react";
import type { SyncProgress } from "./GameAssetSyncManager";

interface GameAssetSyncModalProps {
  isCellularWarning?: boolean;
  missingBytes?: number;
  missingFiles?: number;
  onConfirmCellular?: () => void;
  onDismiss?: () => void;
  progress?: SyncProgress;
  title: string;
}

const formatMb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

export const GameAssetSyncModal = ({
  isCellularWarning = false,
  missingBytes = 0,
  missingFiles = 0,
  onConfirmCellular,
  onDismiss,
  progress,
  title,
}: GameAssetSyncModalProps) => {
  const percentage =
    progress && progress.totalBytes > 0
      ? Math.min(100, Math.round((progress.downloadedBytes / progress.totalBytes) * 100))
      : 0;

  return (
    <div
      aria-labelledby="asset-sync-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
      data-component="GameAssetSyncModal"
      role="dialog"
    >
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl border-4 border-cyan-400/80 bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 p-6 text-center text-white shadow-[0_0_50px_rgba(6,182,212,0.3)]"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        {isCellularWarning ? (
          <>
            <div className="mb-3 text-5xl">📱📶</div>

            <h2 className="text-2xl font-black text-amber-300" id="asset-sync-title">
              Mobiele data (4G/5G)
            </h2>

            <p className="mt-2 text-sm font-bold text-cyan-100">
              We willen {missingFiles > 0 ? `${missingFiles} bestanden` : "de game"} (
              {formatMb(missingBytes)} MB) downloaden zodat alles supersnel en offline speelt.
            </p>

            <p className="mt-2 text-xs font-semibold text-amber-200">
              Wil je deze download nu uitvoeren via je mobiele databundel, of wacht je liever tot je
              op wifi bent?
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-sm font-black text-slate-950 shadow-lg transition active:scale-95"
                onClick={onConfirmCellular}
                type="button"
              >
                Ja, download via mobiele data ({formatMb(missingBytes)} MB)
              </button>

              <button
                className="w-full rounded-2xl border-2 border-cyan-400/40 bg-slate-900/80 px-5 py-3 text-xs font-black text-cyan-200 transition hover:bg-white/10 active:scale-95"
                onClick={onDismiss}
                type="button"
              >
                Wacht op wifi (nu direct spelen)
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 text-5xl">🏝️✨</div>

            <h2 className="text-2xl font-black text-cyan-300" id="asset-sync-title">
              {title} klaarmaken!
            </h2>

            <p className="mt-2 text-sm font-bold text-cyan-100">
              We zetten de video’s en stemmen klaar op jouw apparaat via wifi zodat het spel straks
              razendsnel en vloeiend speelt!
            </p>

            {progress ? (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-black text-cyan-200">
                  <span>Voortgang: {percentage}%</span>
                  <span>
                    {formatMb(progress.downloadedBytes)} MB / {formatMb(progress.totalBytes)} MB
                  </span>
                </div>

                <div className="h-4 w-full overflow-hidden rounded-full border-2 border-cyan-300/40 bg-slate-950/80 p-0.5 shadow-inner">
                  <motion.div
                    animate={{ width: `${percentage}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                    transition={{ duration: 0.2 }}
                  />
                </div>

                <p className="text-xs font-bold text-cyan-300/80">
                  Bestand {progress.downloadedFiles} van {progress.totalFiles}
                </p>
              </div>
            ) : (
              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-black text-cyan-300">
                <span className="h-3 w-3 animate-ping rounded-full bg-cyan-400" />
                Bestanden synchroniseren via wifi…
              </div>
            )}

            {onDismiss ? (
              <button
                className="mt-6 rounded-xl border border-cyan-400/40 px-4 py-2 text-xs font-black text-cyan-200/80 transition hover:bg-white/10 active:scale-95"
                onClick={onDismiss}
                type="button"
              >
                Nu alvast beginnen (downloadt op de achtergrond)
              </button>
            ) : null}
          </>
        )}
      </motion.div>
    </div>
  );
};
