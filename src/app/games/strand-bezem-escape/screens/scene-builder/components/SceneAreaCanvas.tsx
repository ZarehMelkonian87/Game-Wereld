import type { MouseEvent, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { beachBackgrounds, getBeachObjectStickerUrl } from "../../../asset-urls";
import { BeachBackground } from "../../../components/layout/BeachBackground";
import type { SceneObject, SceneZone } from "../../../types";
import { TargetZoneHint } from "../TargetZoneHint";
import { SceneZoneDevTools } from "../SceneZoneDevTools";
import type { PlacedObject } from "../logic/scene-builder-types";
import { SpeechWaveAnimation } from "./SpeechWaveAnimation";

interface SceneAreaCanvasProps {
  effectiveZones: SceneZone[];
  handleObjectPointerCancel: (
    event: ReactPointerEvent<HTMLButtonElement>,
    objectId: string,
  ) => void;
  handleObjectPointerMove: (event: ReactPointerEvent<HTMLButtonElement>, objectId: string) => void;
  handleObjectPointerUp: (event: ReactPointerEvent<HTMLButtonElement>, objectId: string) => void;
  handlePendingObjectPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  handleSceneTap: (event: MouseEvent<HTMLButtonElement>) => void;
  isHintVideoPlaying: boolean;
  objects: readonly SceneObject[];
  pendingPlacement: {
    objectId: string;
    source?: "manual" | "spoken";
    transcript?: string;
    x: number;
    y: number;
    zoneId: string;
  } | null;
  placedObjects: PlacedObject[];
  sceneAreaRef: RefObject<HTMLElement>;
  showTargetZoneHint: boolean;
  showZoneDevTools: boolean;
  visualHintZone?: SceneZone;
  voiceRecognitionStatus: string;
}

export const SceneAreaCanvas = ({
  effectiveZones,
  handleObjectPointerCancel,
  handleObjectPointerMove,
  handleObjectPointerUp,
  handlePendingObjectPointerDown,
  handleSceneTap,
  isHintVideoPlaying,
  objects,
  pendingPlacement,
  placedObjects,
  sceneAreaRef,
  showTargetZoneHint,
  showZoneDevTools,
  visualHintZone,
  voiceRecognitionStatus,
}: SceneAreaCanvasProps) => {
  return (
    <section
      aria-label="Scenegebied"
      className="absolute inset-0 z-0 overflow-hidden"
      data-testid="scene-builder-scene-area"
      ref={sceneAreaRef}
    >
      <BeachBackground
        landscapeUrl={beachBackgrounds.landscape}
        landscapeWebpUrl={beachBackgrounds.landscapeWebp}
        portraitUrl={beachBackgrounds.portrait}
        portraitWebpUrl={beachBackgrounds.portraitWebp}
      />

      <button
        aria-label="Kies plek in de scene"
        className="pointer-events-auto absolute inset-0 touch-manipulation"
        data-testid="scene-tap-target"
        onClick={handleSceneTap}
        type="button"
      />

      {showTargetZoneHint && isHintVideoPlaying && visualHintZone ? (
        <TargetZoneHint pulsing={true} zone={visualHintZone} />
      ) : null}

      {showZoneDevTools ? (
        <SceneZoneDevTools initialZoneId={visualHintZone?.id} zones={effectiveZones} />
      ) : null}

      {placedObjects.map((placedObject) => {
        const object = objects.find((sceneObject) => sceneObject.id === placedObject.objectId);

        if (!object) {
          return null;
        }

        return (
          <img
            alt=""
            className="pointer-events-none absolute h-[clamp(4.2rem,12vw,5.5rem)] w-[clamp(4.2rem,12vw,5.5rem)] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_4px_0_rgba(15,23,42,0.16)]"
            data-testid={`placed-object-${placedObject.objectId}`}
            draggable={false}
            key={placedObject.instructionId}
            src={getBeachObjectStickerUrl(object.assetId)}
            style={{
              left: `${placedObject.x}%`,
              top: `${placedObject.y}%`,
            }}
          />
        );
      })}

      {pendingPlacement
        ? (() => {
            const object = objects.find(
              (sceneObject) => sceneObject.id === pendingPlacement.objectId,
            );
            const imageUrl = object ? getBeachObjectStickerUrl(object.assetId) : undefined;

            if (!object || !imageUrl) {
              return null;
            }

            return (
              <button
                aria-label={`Verplaats ${object.label}`}
                className={`pointer-events-auto absolute h-[clamp(4.2rem,12vw,5.5rem)] w-[clamp(4.2rem,12vw,5.5rem)] -translate-x-1/2 -translate-y-1/2 touch-none ${
                  pendingPlacement.source === "spoken"
                    ? "drop-shadow-[0_0_18px_rgba(56,189,248,0.55)] motion-safe:animate-[bounce_550ms_ease-out_1]"
                    : ""
                }`}
                data-placement-source={pendingPlacement.source ?? "manual"}
                data-testid={`pending-object-${pendingPlacement.objectId}`}
                onPointerCancel={(event) =>
                  handleObjectPointerCancel(event, pendingPlacement.objectId)
                }
                onPointerDown={handlePendingObjectPointerDown}
                onPointerMove={(event) => handleObjectPointerMove(event, pendingPlacement.objectId)}
                onPointerUp={(event) => handleObjectPointerUp(event, pendingPlacement.objectId)}
                style={{
                  left: `${pendingPlacement.x}%`,
                  top: `${pendingPlacement.y}%`,
                }}
                type="button"
              >
                <img
                  alt=""
                  className="h-full w-full object-contain drop-shadow-[0_4px_0_rgba(15,23,42,0.16)]"
                  draggable={false}
                  src={imageUrl}
                />
              </button>
            );
          })()
        : null}

      {voiceRecognitionStatus === "listening" && <SpeechWaveAnimation />}
    </section>
  );
};

SceneAreaCanvas.displayName = "SceneAreaCanvas";
