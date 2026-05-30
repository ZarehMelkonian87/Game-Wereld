import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Sparkles,
  Star,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  avatarIconUrls,
  broomIconUrls,
  getBeachObjectStickerUrl,
  mascotIconUrls,
} from "../asset-urls";
import { TopHud } from "../components";
import {
  GameplayStatusBar,
  InstructionBubble,
  PanelCard,
  PrimaryActionButton,
} from "../components/ui";
import { classNames } from "../components/ui/classNames";
import { speakDutch } from "../logic/speech";
import type { BroomRaceInstruction, SceneObject, SpatialConcept } from "../types";

const RACE_DURATION_SECONDS = 30;
const RACE_STATE_STORAGE_KEY = "woordenschat-bezem-escape:race-state";
const RACE_RESULT_STORAGE_KEY = "woordenschat-bezem-escape:race-result";

type RaceControlAction = "between" | "collect" | "left" | "over" | "right" | "under";
type RaceLane = "center" | "left" | "right";
type FlightHeight = "high" | "low" | "middle";

interface RaceScreenProps {
  instructions: BroomRaceInstruction[];
  onShowReward?: () => void;
  objects: SceneObject[];
}

interface StoredPlacedObject {
  instructionId: string;
  objectId: string;
  zoneId: string;
}

interface StoredRaceState {
  placedObjects?: StoredPlacedObject[];
  practicedConcepts?: string[];
  practicedWords?: string[];
}

interface FeedbackState {
  kind: "correct" | "done" | "hint" | "ready";
  text: string;
}

interface RaceTrackObject {
  id: string;
  imageUrl: string;
  label: string;
  left: number;
  top: number;
  type: "collectible" | "obstacle";
}

const trackPositions = [
  { left: 18, top: 58 },
  { left: 35, top: 42 },
  { left: 54, top: 64 },
  { left: 72, top: 46 },
  { left: 84, top: 66 },
  { left: 45, top: 78 },
];

const actionLabels: Record<RaceControlAction, string> = {
  between: "Tussen",
  collect: "Pak",
  left: "Links",
  over: "Boven",
  right: "Rechts",
  under: "Onder",
};

const actionHints: Record<RaceControlAction, string> = {
  between: "Vlieg door het midden van twee dingen.",
  collect: "Pak de ster of het woord dat gevraagd wordt.",
  left: "Ga naar de linkerkant.",
  over: "Vlieg hoger of spring over het object.",
  right: "Ga naar de rechterkant.",
  under: "Vlieg lager, onder het object door.",
};

const laneLeft: Record<RaceLane, number> = {
  center: 50,
  left: 31,
  right: 69,
};

const flightTop: Record<FlightHeight, number> = {
  high: 40,
  low: 67,
  middle: 54,
};

function getRaceControlAction(action: BroomRaceInstruction["raceAction"]): RaceControlAction {
  if (action === "fly-under") {
    return "under";
  }

  if (action === "fly-over") {
    return "over";
  }

  if (action === "go-left") {
    return "left";
  }

  if (action === "go-right") {
    return "right";
  }

  if (action === "fly-between") {
    return "between";
  }

  return "collect";
}

function getActionIcon(action: RaceControlAction) {
  const iconClassName = "h-6 w-6";

  if (action === "left") {
    return <ArrowLeft className={iconClassName} strokeWidth={3} />;
  }

  if (action === "right") {
    return <ArrowRight className={iconClassName} strokeWidth={3} />;
  }

  if (action === "under") {
    return <ArrowDown className={iconClassName} strokeWidth={3} />;
  }

  if (action === "over") {
    return <ArrowUp className={iconClassName} strokeWidth={3} />;
  }

  if (action === "between") {
    return <Sparkles className={iconClassName} strokeWidth={3} />;
  }

  return <Star className={iconClassName} fill="currentColor" strokeWidth={2.5} />;
}

function readStoredRaceState(): StoredRaceState {
  if (typeof window === "undefined") {
    return {};
  }

  const rawState = window.sessionStorage.getItem(RACE_STATE_STORAGE_KEY);

  if (!rawState) {
    return {};
  }

  try {
    const parsedState = JSON.parse(rawState) as StoredRaceState;
    return {
      placedObjects: Array.isArray(parsedState.placedObjects) ? parsedState.placedObjects : [],
      practicedConcepts: Array.isArray(parsedState.practicedConcepts)
        ? parsedState.practicedConcepts
        : [],
      practicedWords: Array.isArray(parsedState.practicedWords) ? parsedState.practicedWords : [],
    };
  } catch {
    return {};
  }
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildFallbackPlacedObjects(instructions: BroomRaceInstruction[]) {
  return instructions
    .flatMap((instruction) =>
      instruction.targetObjectIds.map((objectId) => ({
        instructionId: instruction.id,
        objectId,
        zoneId: instruction.targetZoneIds[0] ?? "race-track",
      })),
    )
    .filter(
      (placedObject, index, placedObjects) =>
        placedObjects.findIndex((item) => item.objectId === placedObject.objectId) === index,
    )
    .slice(0, 6);
}

function getRaceFeedbackText(instruction: BroomRaceInstruction, action: RaceControlAction) {
  return (
    instruction.feedbackCopy.almost ??
    `Bijna! ${instruction.hint} Probeer: ${actionLabels[action].toLowerCase()}.`
  );
}

function RaceControlButton({
  action,
  active,
  children,
  onClick,
}: {
  action: RaceControlAction;
  active?: boolean;
  children: ReactNode;
  onClick: (action: RaceControlAction) => void;
}) {
  return (
    <button
      aria-label={actionLabels[action]}
      className={classNames(
        "pointer-events-auto flex min-h-14 min-w-[4.15rem] touch-manipulation flex-col items-center justify-center gap-0.5 rounded-2xl border-2 bg-white/92 px-2 text-xs font-black leading-none text-slate-900 shadow-[0_4px_0_rgba(15,23,42,0.14)] transition active:translate-y-0.5 active:shadow-none landscape:min-h-12 landscape:w-full landscape:min-w-0 landscape:flex-row landscape:gap-2",
        active && "border-emerald-500 bg-emerald-100 text-emerald-950 ring-2 ring-white",
      )}
      data-testid={`race-control-${action}`}
      onClick={() => onClick(action)}
      type="button"
    >
      <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center">
        {children}
      </span>
      <span>{actionLabels[action]}</span>
    </button>
  );
}

export function RaceScreen({ instructions, objects, onShowReward }: RaceScreenProps) {
  const timeoutRef = useRef<number | null>(null);
  const raceResultIdRef = useRef(`race-${Date.now()}`);
  const [storedRaceState] = useState<StoredRaceState>(() => readStoredRaceState());
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(RACE_DURATION_SECONDS);
  const [speedValue, setSpeedValue] = useState(0);
  const [wordStarValue, setWordStarValue] = useState(0);
  const [speedBoosting, setSpeedBoosting] = useState(false);
  const [lane, setLane] = useState<RaceLane>("center");
  const [flightHeight, setFlightHeight] = useState<FlightHeight>("middle");
  const [feedback, setFeedback] = useState<FeedbackState>({
    kind: "ready",
    text: "Luister naar de opdracht en stuur de bezem.",
  });
  const [raceEnded, setRaceEnded] = useState(false);
  const [correctActions, setCorrectActions] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [audioRepeats, setAudioRepeats] = useState(0);

  const instruction = instructions[activeInstructionIndex] ?? instructions[0];
  const expectedAction = getRaceControlAction(instruction.raceAction);
  const practicedWords = unique([
    ...(storedRaceState.practicedWords ?? []),
    ...instructions.flatMap((item) => item.targetObjectIds),
  ]);
  const practicedConcepts = unique([
    ...(storedRaceState.practicedConcepts ?? []),
    ...instructions.flatMap((item) => item.spatialConcepts),
  ]).filter((concept): concept is SpatialConcept =>
    [
      "boven",
      "dichtbij",
      "in",
      "links",
      "midden",
      "naast",
      "onder",
      "op",
      "rechts",
      "tussen",
      "ver weg",
    ].includes(concept),
  );
  const trackObjects = useMemo<RaceTrackObject[]>(() => {
    const storedPlacedObjects =
      storedRaceState.placedObjects && storedRaceState.placedObjects.length > 0
        ? storedRaceState.placedObjects
        : buildFallbackPlacedObjects(instructions);
    const fallbackPlacedObjects = buildFallbackPlacedObjects(instructions);
    const placedObjects = [
      ...storedPlacedObjects,
      ...fallbackPlacedObjects.filter(
        (placedObject) =>
          !storedPlacedObjects.some(
            (storedPlacedObject) => storedPlacedObject.objectId === placedObject.objectId,
          ),
      ),
    ];

    return placedObjects.slice(0, 6).flatMap((placedObject, index) => {
      const object = objects.find((sceneObject) => sceneObject.id === placedObject.objectId);
      const imageUrl = object ? getBeachObjectStickerUrl(object.assetId) : undefined;
      const position = trackPositions[index % trackPositions.length];

      if (!object || !imageUrl) {
        return [];
      }

      return [
        {
          id: `${placedObject.instructionId}-${object.id}`,
          imageUrl,
          label: object.label,
          left: position.left,
          top: position.top,
          type: index % 3 === 0 ? "collectible" : "obstacle",
        },
      ];
    });
  }, [instructions, objects, storedRaceState.placedObjects]);

  useEffect(() => {
    if (raceEnded) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((currentTimeLeft) => {
        if (currentTimeLeft <= 1) {
          setRaceEnded(true);
          setFeedback({
            kind: "done",
            text: "Race klaar! Je hebt de bezem veilig naar het einde gebracht.",
          });
          return 0;
        }

        return currentTimeLeft - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [raceEnded]);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!raceEnded || typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(
      RACE_RESULT_STORAGE_KEY,
      JSON.stringify({
        audioRepeats,
        correctActions,
        hintsUsed,
        mistakes,
        playedAt: new Date().toISOString(),
        practicedConcepts,
        practicedWords,
        resultId: raceResultIdRef.current,
        speedEarned: speedValue,
        starsEarned: wordStarValue,
      }),
    );
  }, [
    audioRepeats,
    correctActions,
    hintsUsed,
    mistakes,
    practicedConcepts,
    practicedWords,
    raceEnded,
    speedValue,
    wordStarValue,
  ]);

  function clearAdvanceTimeout() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function finishRace(text: string) {
    clearAdvanceTimeout();
    setRaceEnded(true);
    setFeedback({
      kind: "done",
      text,
    });
  }

  function advanceInstructionAfterFeedback() {
    clearAdvanceTimeout();
    timeoutRef.current = window.setTimeout(() => {
      setActiveInstructionIndex((currentIndex) => {
        if (currentIndex >= instructions.length - 1) {
          finishRace("Race klaar! Alle strandopdrachten zijn geoefend.");
          return currentIndex;
        }

        return currentIndex + 1;
      });
      setFeedback({
        kind: "ready",
        text: "Luister naar de volgende opdracht.",
      });
    }, 650);
  }

  function playInstructionAudio() {
    if (!speakDutch(instruction.audioText)) {
      setFeedback({
        kind: "hint",
        text: "Audio is niet beschikbaar in deze browser. Lees de race-opdracht samen hardop.",
      });
      return;
    }

    setAudioRepeats((currentRepeats) => currentRepeats + 1);
  }

  function handleHint() {
    setHintsUsed((currentHintsUsed) => currentHintsUsed + 1);
    setFeedback({
      kind: "hint",
      text: `${instruction.hint} ${actionHints[expectedAction]}`,
    });
  }

  function updateAvatarForAction(action: RaceControlAction) {
    if (action === "left") {
      setLane("left");
      setFlightHeight("middle");
      return;
    }

    if (action === "right") {
      setLane("right");
      setFlightHeight("middle");
      return;
    }

    if (action === "under") {
      setFlightHeight("low");
      return;
    }

    if (action === "over") {
      setFlightHeight("high");
      return;
    }

    if (action === "between") {
      setLane("center");
      setFlightHeight("middle");
      return;
    }

    setFlightHeight("middle");
  }

  function handleRaceAction(action: RaceControlAction) {
    if (raceEnded) {
      return;
    }

    clearAdvanceTimeout();
    updateAvatarForAction(action);

    if (action !== expectedAction) {
      setMistakes((currentMistakes) => currentMistakes + 1);
      setHintsUsed((currentHintsUsed) => currentHintsUsed + 1);
      setSpeedValue((currentSpeed) => Math.max(0, currentSpeed - 1));
      setFeedback({
        kind: "hint",
        text: getRaceFeedbackText(instruction, expectedAction),
      });
      return;
    }

    const nextCorrectActions = correctActions + 1;
    const nextSpeedValue = speedValue + instruction.reward.speed;
    const nextWordStarValue = wordStarValue + instruction.reward.wordStars;

    setCorrectActions(nextCorrectActions);
    setSpeedValue(nextSpeedValue);
    setWordStarValue(nextWordStarValue);
    setSpeedBoosting(true);
    setFeedback({
      kind: "correct",
      text: instruction.feedbackCopy.correct,
    });
    window.setTimeout(() => setSpeedBoosting(false), 450);
    advanceInstructionAfterFeedback();
  }

  function restartRace() {
    clearAdvanceTimeout();
    raceResultIdRef.current = `race-${Date.now()}`;
    setActiveInstructionIndex(0);
    setTimeLeft(RACE_DURATION_SECONDS);
    setSpeedValue(0);
    setWordStarValue(0);
    setSpeedBoosting(false);
    setLane("center");
    setFlightHeight("middle");
    setFeedback({
      kind: "ready",
      text: "Luister naar de opdracht en stuur de bezem.",
    });
    setRaceEnded(false);
    setCorrectActions(0);
    setMistakes(0);
    setHintsUsed(0);
    setAudioRepeats(0);
  }

  const activeTrackObject = trackObjects.find((trackObject) =>
    instruction.targetObjectIds.includes(trackObject.label),
  );

  return (
    <div
      data-testid="race-screen"
      data-active-instruction-id={instruction.id}
      data-race-active-action={expectedAction}
      data-race-audio-repeats={audioRepeats}
      data-race-correct-actions={correctActions}
      data-race-ended={raceEnded ? "true" : "false"}
      data-race-feedback={feedback.text}
      data-race-hints-used={hintsUsed}
      data-race-mistakes={mistakes}
      data-race-speed={speedValue}
      data-race-stars={wordStarValue}
      data-race-time-left={timeLeft}
      data-supported-race-concepts="onder,boven,links,rechts,tussen"
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <TopHud
        onAudioClick={playInstructionAudio}
        onHintClick={handleHint}
        showParentBack
        starCount={wordStarValue}
      />

      <div className="grid h-full min-h-0 grid-rows-[4rem_minmax(0,1fr)_3.75rem_5.75rem] gap-2 landscape:grid-cols-[minmax(13rem,18rem)_minmax(0,1fr)_8.5rem] landscape:grid-rows-[4rem_minmax(0,1fr)_3.75rem]">
        <InstructionBubble
          aria-label="Race-opdracht"
          data-testid="race-instruction-bubble"
          onAudioClick={playInstructionAudio}
          text={raceEnded ? feedback.text : instruction.prompt}
          className="landscape:col-start-1 landscape:row-start-1"
        />

        <section
          aria-label="Racegebied"
          data-testid="race-play-area"
          className="relative min-h-0 overflow-hidden rounded-[1.75rem] border-2 border-white/70 bg-white/5 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.18)] landscape:col-start-2 landscape:row-span-3 landscape:row-start-1"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-[18%] h-2 rounded-full bg-white/45 shadow-[0_10px_0_rgba(255,255,255,0.22),0_-12px_0_rgba(255,255,255,0.18)]"
          />

          {trackObjects.map((trackObject) => (
            <div
              aria-hidden="true"
              className={classNames(
                "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition duration-300",
                activeTrackObject?.id === trackObject.id && "scale-110 drop-shadow-[0_0_0.75rem_rgba(250,204,21,0.78)]",
              )}
              data-testid={`race-track-object-${trackObject.label}`}
              key={trackObject.id}
              style={{ left: `${trackObject.left}%`, top: `${trackObject.top}%` }}
            >
              <img
                alt=""
                className="h-[clamp(2.8rem,12vw,5.5rem)] w-[clamp(2.8rem,12vw,5.5rem)] object-contain drop-shadow-[0_4px_0_rgba(15,23,42,0.15)]"
                draggable={false}
                src={trackObject.imageUrl}
              />
              {trackObject.type === "collectible" ? (
                <Star
                  className="absolute -right-1 -top-1 h-6 w-6 text-amber-400 drop-shadow"
                  fill="currentColor"
                  strokeWidth={2.5}
                />
              ) : null}
            </div>
          ))}

          <div
            data-testid="race-avatar"
            className="absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 transition-[left,top,transform] duration-300 landscape:h-24 landscape:w-24"
            style={{
              left: `${laneLeft[lane]}%`,
              top: `${flightTop[flightHeight]}%`,
              transform:
                feedback.kind === "correct"
                  ? "translate(-50%, -50%) scale(1.06)"
                  : "translate(-50%, -50%)",
            }}
          >
            <img
              src={broomIconUrls.basic}
              alt=""
              className="absolute bottom-2 left-0 h-16 w-28 object-contain landscape:h-14 landscape:w-24"
              draggable={false}
            />
            <img
              src={avatarIconUrls.avatar01}
              alt=""
              className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 object-contain landscape:h-16 landscape:w-16"
              draggable={false}
            />
            {feedback.kind === "correct" ? (
              <Sparkles
                aria-hidden="true"
                className="absolute -right-3 top-4 h-8 w-8 text-amber-400"
                fill="currentColor"
                strokeWidth={2.5}
              />
            ) : null}
          </div>

          <PanelCard
            aria-live="polite"
            data-testid="race-feedback-panel"
            className="pointer-events-auto absolute bottom-3 left-3 right-3 !rounded-2xl !p-2"
          >
            <div className="flex items-center gap-2">
              <img
                alt=""
                className="h-10 w-10 shrink-0 object-contain"
                draggable={false}
                src={feedback.kind === "correct" || feedback.kind === "done" ? mascotIconUrls.celebration : mascotIconUrls.hint}
              />
              <p className="min-w-0 flex-1 text-xs font-black leading-tight text-slate-900">
                {feedback.text}
              </p>
              {raceEnded ? (
                <div className="flex shrink-0 gap-2">
                  <PrimaryActionButton
                    className="pointer-events-auto min-h-10 px-3 py-2 text-sm"
                    data-testid="race-restart-button"
                    iconLeft={<CheckCircle2 className="h-5 w-5" strokeWidth={3} />}
                    onClick={restartRace}
                  >
                    Opnieuw
                  </PrimaryActionButton>
                  <PrimaryActionButton
                    className="pointer-events-auto min-h-10 px-3 py-2 text-sm"
                    data-testid="race-reward-button"
                    iconLeft={<Star className="h-5 w-5" fill="currentColor" strokeWidth={2.5} />}
                    onClick={onShowReward}
                  >
                    Beloning
                  </PrimaryActionButton>
                </div>
              ) : null}
            </div>
          </PanelCard>
        </section>

        <PanelCard
          aria-label="Race status"
          data-testid="race-status-area"
          className="flex min-h-0 items-center !p-2 landscape:col-start-1 landscape:row-start-2 landscape:self-end"
        >
          <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <GameplayStatusBar
              boosting={speedBoosting}
              energyIconUrl={broomIconUrls.basic}
              speedMax={10}
              speedValue={speedValue}
              starMax={30}
              starValue={wordStarValue}
            />
            <span
              aria-label={`Race tijd: ${timeLeft} seconden`}
              className="inline-flex min-h-10 min-w-12 items-center justify-center rounded-2xl border-2 border-sky-300 bg-sky-100 px-2 text-sm font-black tabular-nums text-sky-950"
              data-testid="race-timer"
            >
              {timeLeft}s
            </span>
          </div>
        </PanelCard>

        <PanelCard
          aria-label="Raceknoppen"
          data-testid="race-control-area"
          className="flex min-h-0 items-center gap-2 overflow-x-auto !p-2 landscape:col-start-3 landscape:row-span-3 landscape:row-start-1 landscape:flex-col landscape:justify-center landscape:overflow-visible"
        >
          {(["left", "under", "over", "between", "collect", "right"] as RaceControlAction[]).map(
            (action) => (
              <RaceControlButton
                action={action}
                active={!raceEnded && action === expectedAction}
                key={action}
                onClick={handleRaceAction}
              >
                {getActionIcon(action)}
              </RaceControlButton>
            ),
          )}
        </PanelCard>
      </div>
    </div>
  );
}
