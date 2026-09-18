import { type MouseEvent } from "react";
import { Download, RefreshCw, Play, Trash2 } from "lucide-react";
import type { DownloadGateState } from "./downloadGate";

export interface GameCardDownloadButtonProps {
  className?: string;
  gate: DownloadGateState;
  hideWhenReady?: boolean;
  isUpdateAvailable?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onPlay?: (event: MouseEvent<HTMLButtonElement>) => void;
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const formatMb = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  return mb < 1 ? "< 1 MB" : `${Math.round(mb)} MB`;
};

/**
 * Compact download trigger/indicator embedded in game cards (T-46, GDD §2.2).
 * Displays 4 distinct states:
 * 1. Niet gedownload (📥 36 MB)
 * 2. Bezig op achtergrond (⏳ 52%)
 * 3. Klaar (knop verdwijnt of directe Speel-actie)
 * 4. Update beschikbaar (🔄 Update)
 */
export const GameCardDownloadButton = ({
  className = "",
  gate,
  hideWhenReady = true,
  isUpdateAvailable = false,
  onClick,
  onPlay,
  onRemove,
}: GameCardDownloadButtonProps) => {
  // If platform is streaming (web), no gate button is displayed on cards
  if (gate.mode === "streaming") {
    return null;
  }

  // 4. Update beschikbaar
  const hasUpdate = isUpdateAvailable || Boolean(gate.isUpdateAvailable);
  if (hasUpdate) {
    const sizeText = formatMb(gate.requiredBytes);
    return (
      <button
        aria-label={`Update beschikbaar${sizeText ? ` (${sizeText})` : ""}. Tik om bij te werken.`}
        className={`pointer-events-auto flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-xs font-black text-white shadow-md transition-all duration-150 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${className}`}
        data-component="GameCardDownloadButton"
        data-state="update-available"
        onClick={onClick}
        type="button"
      >
        <RefreshCw aria-hidden="true" className="h-4 w-4 shrink-0 text-white" />
        <span className="truncate">Update{sizeText ? ` ${sizeText}` : ""}</span>
      </button>
    );
  }

  // 3. Klaar (ready / canPlay)
  if (gate.canPlay || gate.phase === "ready") {
    if (onRemove) {
      return (
        <button
          aria-label="Spel is gedownload. Tik op de prullenbak om lokale gamebestanden te verwijderen."
          className={`pointer-events-auto flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-400/40 bg-slate-800/90 hover:bg-rose-950/80 px-3 py-2 text-xs font-bold text-rose-300 shadow-md transition-all duration-150 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${className}`}
          data-component="GameCardDownloadButton"
          data-slot="download-button"
          data-state="ready"
          onClick={onRemove}
          title="Verwijder lokale gamebestanden"
          type="button"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4 shrink-0 text-rose-400" />
          <span className="truncate">Verwijder</span>
        </button>
      );
    }

    if (hideWhenReady) {
      return null;
    }

    return (
      <button
        aria-label="Spel is gedownload. Tik om direct te spelen."
        className={`pointer-events-auto flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-emerald-300/80 bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-2 text-xs font-black text-white shadow-md transition-all duration-150 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${className}`}
        data-component="GameCardDownloadButton"
        data-state="ready"
        onClick={onPlay ?? onClick}
        type="button"
      >
        <Play aria-hidden="true" className="h-4 w-4 shrink-0 fill-white text-white" />
        <span className="truncate">Speel</span>
      </button>
    );
  }

  // 2. Bezig (downloading / verifying / sizing)
  if (gate.phase === "downloading" || gate.phase === "verifying" || gate.phase === "sizing") {
    const percent = gate.progress?.percent ?? 0;
    const isVerifying = gate.phase === "verifying";

    return (
      <button
        aria-label={`Download bezig: ${isVerifying ? "controleren" : `${percent}%`}. Tik voor details.`}
        className={`pointer-events-auto flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-sky-300/80 bg-sky-950/80 px-3 py-2 text-xs font-black text-sky-200 shadow-md backdrop-blur-sm transition-all duration-150 hover:bg-sky-900/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${className}`}
        data-component="GameCardDownloadButton"
        data-slot="download-button"
        data-state="downloading"
        onClick={onClick}
        type="button"
      >
        {/* Progress spinner / ring */}
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <svg
            aria-hidden="true"
            className="h-5 w-5 -rotate-90 animate-spin text-sky-300"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              fill="none"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle
              className="transition-all duration-300"
              cx="12"
              cy="12"
              fill="none"
              r="9"
              stroke="currentColor"
              strokeDasharray={56.5}
              strokeDashoffset={56.5 - (56.5 * (percent || 10)) / 100}
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>
        </span>
        <span className="truncate text-xs font-bold text-sky-100">
          {isVerifying ? "Check…" : `${percent}%`}
        </span>
      </button>
    );
  }

  // Error state
  if (gate.phase === "error") {
    return (
      <button
        aria-label="Download gepauzeerd of fout opgetreden. Tik om opnieuw te proberen."
        className={`pointer-events-auto flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-300/80 bg-rose-950/85 px-3 py-2 text-xs font-black text-rose-200 shadow-md transition-all duration-150 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${className}`}
        data-component="GameCardDownloadButton"
        data-slot="download-button"
        data-state="error"
        onClick={onClick}
        type="button"
      >
        <RefreshCw aria-hidden="true" className="h-4 w-4 shrink-0 text-rose-200" />
        <span className="truncate">Opnieuw</span>
      </button>
    );
  }

  // 1. Niet gedownload (needs-download / checking / confirm)
  const sizeText = formatMb(gate.requiredBytes);
  return (
    <button
      aria-label={`Download game voor offline spelen${sizeText ? ` (${sizeText})` : ""}`}
      className={`pointer-events-auto flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-sky-300/80 bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-600 px-3 py-2 text-xs font-black text-white shadow-md transition-all duration-150 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${className}`}
      data-component="GameCardDownloadButton"
      data-slot="download-button"
      data-state="needs-download"
      onClick={onClick}
      type="button"
    >
      <Download aria-hidden="true" className="h-4 w-4 shrink-0 text-white" />
      <span className="truncate font-black">{sizeText ? `${sizeText}` : "Download"}</span>
    </button>
  );
};

GameCardDownloadButton.displayName = "GameCardDownloadButton";
