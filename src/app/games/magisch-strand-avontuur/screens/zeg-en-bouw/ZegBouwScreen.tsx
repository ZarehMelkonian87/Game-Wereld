import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { beachBackgrounds, getBeachObjectStickerUrl } from "../../asset-urls";
import { BeachBackground } from "../../components/layout/BeachBackground";
import { BtnNavHome, ObjectStickerButton, PanelCard } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { parseCompoundPlacements } from "../../logic/spoken-command-parser";
import { containsUnwantedWord, UNWANTED_WORD_NUDGE } from "../../logic/word-safety";
import type { SceneObject, SceneZone } from "../../types";
import { SpeechWaveAnimation } from "../scene-builder/components/SpeechWaveAnimation";
import { ObjectCarousel } from "../scene-builder/ObjectCarousel";
import { SpokenCommandControls } from "../scene-builder/SpokenCommandControls";
import { ZegBouwRoundSummary } from "./components/ZegBouwRoundSummary";
import { useZegBouwState } from "./useZegBouwState";

// Zodra het doel gehaald is: eerst even het afgebouwde strand laten zien voordat
// het "Strand af!"-menu verschijnt (feedback van tester: het menu kwam te snel).
const COMPLETE_OVERLAY_DELAY_MS = 1900;

interface ZegBouwScreenProps {
  objects: readonly SceneObject[];
  onBackToMenu: () => void;
  zones: readonly SceneZone[];
}

const feedbackToneClasses: Record<string, string> = {
  good: "border-emerald-200 bg-emerald-50/95 text-emerald-950",
  prompt: "border-sky-200 bg-sky-50/95 text-sky-950",
  tip: "border-amber-200 bg-amber-50/95 text-amber-950",
};

/**
 * @uxId SCR_MSA_ZEG_BOUW
 * @screens SCR_MSA_ZEG_BOUW
 * @description Zeg & Bouw — bouw een thema-strand met meerdere zelfgekozen objecten (T-04c).
 */
export const ZegBouwScreen = ({ objects, onBackToMenu, zones }: ZegBouwScreenProps) => {
  const sceneAreaRef = useRef<HTMLDivElement>(null);
  const {
    card,
    feedback,
    isCardComplete,
    placeCompound,
    placeSelectedAtPoint,
    placedObjects,
    progress,
    rewardProfileId,
    roundReward,
    selectObject,
    selectedObjectId,
    showNudge,
    startNextCard,
    wordStarValue,
  } = useZegBouwState({ objects, zones });

  const [voiceStatus, setVoiceStatus] = useState<string>("idle");
  const [voiceTranscript, setVoiceTranscript] = useState<string>("");
  const [showCompleteOverlay, setShowCompleteOverlay] = useState(false);

  // Toon het ronde-eindmenu pas na een korte viering, zodat het kind zijn
  // afgebouwde strand ziet (ook bij een compound-zin die het doel ineens haalt).
  useEffect(() => {
    if (!isCardComplete) {
      setShowCompleteOverlay(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setShowCompleteOverlay(true), COMPLETE_OVERLAY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isCardComplete]);

  const isListening =
    voiceStatus === "listening" || voiceStatus === "processing" || voiceStatus === "heard";

  const handleTranscript = (transcript: string) => {
    // Vriendelijke bescherming (T-28): bij een ongewenst woord een zachte nudge.
    if (containsUnwantedWord(transcript)) {
      showNudge(UNWANTED_WORD_NUDGE);
      return;
    }

    // Meerdere objecten uit één zin (T-04b) → in één keer plaatsen (T-04c C2b).
    placeCompound(parseCompoundPlacements({ objects, transcript, zones }).placements);
  };

  const handleSceneTap = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) {
      return;
    }
    const rect = sceneAreaRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) {
      return;
    }
    placeSelectedAtPoint({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section
      aria-label="Zeg en Bouw"
      className="pointer-events-auto absolute inset-0 z-10 overflow-hidden text-slate-900"
      data-build-complete={isCardComplete ? "true" : "false"}
      data-build-theme={card.theme}
      data-progress-count={progress.count}
      data-progress-goal={progress.goal}
      data-selected-object-id={selectedObjectId ?? ""}
      data-testid="zeg-bouw-screen"
    >
      <div className="absolute inset-0 z-0 overflow-hidden" ref={sceneAreaRef}>
        <BeachBackground
          landscapeUrl={beachBackgrounds.landscape}
          landscapeWebpUrl={beachBackgrounds.landscapeWebp}
          portraitUrl={beachBackgrounds.portrait}
          portraitWebpUrl={beachBackgrounds.portraitWebp}
        />

        <button
          aria-label="Tik op het strand of in de zee om het gekozen plaatje neer te zetten"
          className="pointer-events-auto absolute inset-0 touch-manipulation outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-cyan-300"
          data-testid="zeg-bouw-tap-target"
          onClick={handleSceneTap}
          type="button"
        />

        {placedObjects.map((placedObject) => {
          const object = objects.find((candidate) => candidate.id === placedObject.objectId);
          if (!object) {
            return null;
          }
          return (
            <img
              alt=""
              className="pointer-events-none absolute h-[clamp(4.2rem,12vw,5.5rem)] w-[clamp(4.2rem,12vw,5.5rem)] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_4px_0_rgba(15,23,42,0.16)]"
              data-testid={`zeg-bouw-placed-${placedObject.objectId}`}
              draggable={false}
              key={placedObject.key}
              src={getBeachObjectStickerUrl(object.assetId)}
              style={{ left: `${placedObject.x}%`, top: `${placedObject.y}%` }}
            />
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col gap-2 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-[calc(env(safe-area-inset-top)+0.5rem)]">
        <PanelCard
          aria-label="Bouwkaart"
          className="pointer-events-auto grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 !rounded-[1.35rem] !p-2"
          data-testid="zeg-bouw-card"
        >
          <BtnNavHome onClick={onBackToMenu} />
          <div className="min-w-0">
            <p className="truncate text-[1rem] font-black leading-none text-slate-900">
              {card.title}
            </p>
            <p className="mt-1 text-[0.72rem] font-black leading-tight text-sky-900">
              {card.prompt}
            </p>
          </div>
          <div
            className="flex items-center gap-1"
            aria-label={`${progress.count} van ${progress.goal} gebouwd`}
            data-testid="zeg-bouw-progress"
          >
            {Array.from({ length: progress.goal }).map((_, index) => (
              <span
                key={`progress-${index}`}
                className={classNames(
                  "h-4 w-4 rounded-full border-2",
                  index < progress.count
                    ? "border-emerald-300 bg-emerald-400"
                    : "border-white/80 bg-white/40",
                )}
              />
            ))}
          </div>
        </PanelCard>

        <div className="pointer-events-auto flex items-center justify-center">
          <SpokenCommandControls
            exampleText="de bal en de zon op het strand"
            onTranscript={handleTranscript}
            onVoiceStatusChange={setVoiceStatus}
            onVoiceTranscriptChange={setVoiceTranscript}
            profileId={rewardProfileId}
          />
        </div>

        {feedback ? (
          <div
            className={classNames(
              "pointer-events-none mx-auto max-w-md rounded-2xl border-2 px-3 py-1.5 text-center text-xs font-black leading-tight shadow-sm",
              feedbackToneClasses[feedback.kind] ?? feedbackToneClasses.prompt,
            )}
            data-feedback-kind={feedback.kind}
            data-testid="zeg-bouw-feedback"
          >
            {feedback.text}
          </div>
        ) : null}

        <div className="flex-1 min-h-0" />

        <ObjectCarousel>
          {objects.map((object) => (
            <ObjectStickerButton
              imageUrl={getBeachObjectStickerUrl(object.assetId)}
              key={object.id}
              label={object.label}
              onClick={() => selectObject(object.id)}
              selected={selectedObjectId === object.id}
              showLabel={false}
              size="tray"
            />
          ))}
        </ObjectCarousel>
      </div>

      {isListening ? <SpeechWaveAnimation transcript={voiceTranscript} /> : null}

      {showCompleteOverlay ? (
        <ZegBouwRoundSummary
          builtObjectIds={[...new Set(placedObjects.map((placedObject) => placedObject.objectId))]}
          nextReward={roundReward.nextReward}
          objects={objects}
          onBackToMenu={onBackToMenu}
          onNext={startNextCard}
          starsThisRound={wordStarValue}
          theme={card.theme}
          totalWordStars={roundReward.totalWordStars}
        />
      ) : null}
    </section>
  );
};

ZegBouwScreen.displayName = "ZegBouwScreen";
