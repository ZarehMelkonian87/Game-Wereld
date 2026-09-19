import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { motion } from "motion/react";
import { Lock, Star } from "lucide-react";
import type { GameProgress } from "../../game-platform";
import type { GameTheme, MiniGame } from "../../data/games";
import { getGameRegistryEntry } from "../../games";
import {
  ConfirmDeleteModal,
  DownloadGateModal,
  GameCardDownloadButton,
  useGameDownloadGate,
} from "../../platform";
import { getDifficultyColor, getDifficultyIcon, getDifficultyText } from "./gameDifficulty";

interface GameListCardProps {
  game: MiniGame;
  index: number;
  isLocked?: boolean;
  onSelect: (game: MiniGame) => void;
  progress?: GameProgress;
  theme: GameTheme;
}

export const GameListCard = ({
  game,
  index,
  isLocked = false,
  onSelect,
  progress,
  theme,
}: GameListCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const entry = getGameRegistryEntry(game.id);
  const { gate, isCellular, download, remove } = useGameDownloadGate(
    entry?.manifest.offlinePackages,
  );

  const cardVisual = game.cardImageUrl ?? game.icon;
  const hasImageIcon = /^(?:blob:|data:|https?:|\/)/.test(cardVisual);

  const startDownloadOrPrompt = () => {
    if (gate.phase === "downloading" || gate.phase === "verifying") {
      setIsModalOpen(true);
      return;
    }
    if (isCellular) {
      setIsModalOpen(true);
    } else {
      void download();
      setIsModalOpen(true);
    }
  };

  const handleCardClick = () => {
    if (isLocked) return;

    if (gate.canPlay) {
      onSelect(game);
      return;
    }

    // Als de game nog niet 100% gedownload is:
    if (gate.mode === "gated") {
      startDownloadOrPrompt();
      return;
    }

    // Direct spelen op streaming platforms
    onSelect(game);
  };

  const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsConfirmDeleteOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <>
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        aria-label={`${game.name} - ${gate.canPlay ? "Spelen" : "Downloaden"}`}
        className={`game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 border-3 sm:border-4 border-slate-600 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl min-h-[140px] sm:min-h-[150px] flex items-center gap-3 sm:gap-4 relative overflow-hidden transition-all duration-300 cursor-pointer select-none ${
          isLocked ? "opacity-60 grayscale border-slate-700/50" : ""
        }`}
        data-component="GameListCard"
        data-game-id={game.id}
        initial={{ opacity: 0, x: -20 }}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        transition={{ delay: index * 0.05 }}
        whileHover={isLocked ? { scale: 1 } : { scale: 1.02 }}
        whileTap={isLocked ? { scale: 1 } : { scale: 0.98 }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex h-20 w-24 flex-shrink-0 items-center justify-center sm:h-24 sm:w-32">
          {hasImageIcon ? (
            <img
              alt=""
              className="max-h-full max-w-full object-contain drop-shadow-lg"
              draggable={false}
              src={cardVisual}
            />
          ) : (
            <div className="text-4xl drop-shadow-lg sm:text-5xl md:text-6xl">{cardVisual}</div>
          )}
        </div>

        <div className="flex-1 text-left relative z-10 min-w-0">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <h3 className="text-base sm:text-lg md:text-xl text-white font-black truncate">
              {game.name}
            </h3>
            {isLocked ? (
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
            ) : null}
          </div>
          <p className="text-xs sm:text-sm text-cyan-300 mb-2 sm:mb-3 font-semibold line-clamp-2">
            {game.description}
          </p>

          {/* Onderste rij: badges links, download/verwijder knop rechts (waar groene placeholder stond) */}
          <div className="flex items-center justify-between gap-2 flex-wrap mt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`bg-gradient-to-r ${getDifficultyColor(
                  game.difficulty,
                )} text-white text-xs px-2 sm:px-3 py-1 rounded-full font-black flex items-center gap-1`}
              >
                {getDifficultyIcon(game.difficulty)}
                {getDifficultyText(game.difficulty)}
              </span>

              {progress && progress.stars > 0 ? (
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, starIndex) => (
                    <Star
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        starIndex < progress.stars
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-600"
                      }`}
                      key={`${theme.id}-${game.id}-${starIndex}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {/* DOWNLOAD / VERWIJDER KNOP RECHTSONDER WAAR DE GROENE PLACEHOLDER STOND */}
            {gate.mode === "gated" && !isLocked ? (
              <div className="ml-auto shrink-0" onClick={(event) => event.stopPropagation()}>
                <GameCardDownloadButton
                  gate={gate}
                  hideWhenReady={false}
                  onClick={(event) => {
                    event.stopPropagation();
                    startDownloadOrPrompt();
                  }}
                  onPlay={(event) => {
                    event.stopPropagation();
                    onSelect(game);
                  }}
                  onRemove={handleRemoveClick}
                />
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Volledige Download-Gate Modal bij openen */}
      {isModalOpen && (
        <div onClick={(event) => event.stopPropagation()}>
          <DownloadGateModal
            gameTitle={game.name}
            gate={gate}
            isCellular={isCellular}
            onConfirmDownload={download}
            onDismiss={() => setIsModalOpen(false)}
            onPlay={() => {
              setIsModalOpen(false);
              onSelect(game);
            }}
            onRemove={async () => {
              await remove();
            }}
            onRetry={download}
          />
        </div>
      )}

      {/* Verwijder Bevestiging Modal (T-46) */}
      <ConfirmDeleteModal
        gameTitle={game.name}
        isOpen={isConfirmDeleteOpen}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        onConfirm={async () => {
          setIsConfirmDeleteOpen(false);
          await remove();
        }}
        requiredBytes={gate.requiredBytes}
      />
    </>
  );
};

GameListCard.displayName = "GameListCard";
