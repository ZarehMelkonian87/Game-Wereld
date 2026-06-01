import type { SceneObject, SceneZone, SpatialConcept } from "../types";
import { getZoneCenter, type ScenePoint } from "./scene-zones";
import {
  parseSpokenPlacementCommand,
  type SpokenCommandConfidence,
  type SpokenCommandMissingPart,
  type SpokenCommandParseResult,
} from "./spoken-command-parser";

export type SceneCommandExecutionStatus =
  | "ready"
  | "needs-choice"
  | "needs-help";

export interface SceneCommandChoice {
  id: string;
  label: string;
  type: "object" | "zone";
}

export interface SceneCommandPlacement {
  anchorObjectIds: string[];
  confidence: SpokenCommandConfidence;
  objectId: string;
  point: ScenePoint;
  relation?: SpatialConcept;
  transcript: string;
  zoneId: string;
}

export interface SceneCommandExecutionResult {
  choices: SceneCommandChoice[];
  message: string;
  missing: SpokenCommandMissingPart[];
  normalizedTranscript: string;
  parseResult: SpokenCommandParseResult;
  placement?: SceneCommandPlacement;
  status: SceneCommandExecutionStatus;
  transcript: string;
}

const getObjectChoiceLabel = (objects: readonly SceneObject[], objectId: string) =>
  objects.find((object) => object.id === objectId)?.label ?? objectId;

const getZoneChoiceLabel = (zones: readonly SceneZone[], zoneId: string) =>
  zones.find((zone) => zone.id === zoneId)?.label ?? zoneId;

const getChoices = ({
  objects,
  parseResult,
  zones,
}: {
  objects: readonly SceneObject[];
  parseResult: SpokenCommandParseResult;
  zones: readonly SceneZone[];
}): SceneCommandChoice[] => {
  const objectChoices = parseResult.objectMatches.slice(0, 3).map((match) => ({
    id: match.id,
    label: getObjectChoiceLabel(objects, match.id),
    type: "object" as const,
  }));
  const zoneChoices = parseResult.zoneMatches.slice(0, 3).map((match) => ({
    id: match.id,
    label: getZoneChoiceLabel(zones, match.id),
    type: "zone" as const,
  }));

  return [...objectChoices, ...zoneChoices];
};

const getHelpMessage = (missing: readonly SpokenCommandMissingPart[]) => {
  if (missing.includes("object") && missing.includes("zone")) {
    return "Ik hoorde nog niet welk plaatje en welke plek je bedoelt.";
  }

  if (missing.includes("object")) {
    return "Ik hoorde de plek. Welk plaatje moet daar komen?";
  }

  if (missing.includes("spatial-concept")) {
    return "Ik hoorde het plaatje en de plek. Zeg ook een plaatswoord, zoals in of op.";
  }

  if (missing.includes("zone")) {
    return "Ik hoorde het plaatje. Waar moet het plaatje komen?";
  }

  return "Ik twijfel nog. Probeer de zin nog eens rustig.";
};

const getTranscriptDisplayText = (transcript: string) =>
  transcript.trim().replace(/[.!?]+$/g, "");

const getReadyMessage = (parseResult: SpokenCommandParseResult, zones: readonly SceneZone[]) => {
  const zoneLabel = parseResult.zoneId ? getZoneChoiceLabel(zones, parseResult.zoneId) : "de scene";
  const transcriptText = getTranscriptDisplayText(parseResult.transcript);

  return `Ik hoorde: ${transcriptText}. Ik zet het plaatje op de plek: ${zoneLabel}. Je kunt de plek nog aanpassen.`;
};

const resolvePlacement = ({
  parseResult,
  zones,
}: {
  parseResult: SpokenCommandParseResult;
  zones: readonly SceneZone[];
}): SceneCommandPlacement | undefined => {
  if (!parseResult.objectId || !parseResult.zoneId) {
    return undefined;
  }

  const zone = zones.find((sceneZone) => sceneZone.id === parseResult.zoneId);

  if (!zone) {
    return undefined;
  }

  return {
    anchorObjectIds: parseResult.anchorObjectIds,
    confidence: parseResult.confidence,
    objectId: parseResult.objectId,
    point: getZoneCenter(zone),
    relation: parseResult.relation,
    transcript: parseResult.transcript,
    zoneId: zone.id,
  };
};

export const executeSpokenSceneCommand = ({
  objects,
  transcript,
  zones,
}: {
  objects: readonly SceneObject[];
  transcript: string;
  zones: readonly SceneZone[];
}): SceneCommandExecutionResult => {
  const parseResult = parseSpokenPlacementCommand({ objects, transcript, zones });
  const choices = getChoices({ objects, parseResult, zones });
  const placement = parseResult.confidence === "high"
    ? resolvePlacement({ parseResult, zones })
    : undefined;
  const status: SceneCommandExecutionStatus = placement
    ? "ready"
    : parseResult.confidence === "needs-choice"
      ? "needs-choice"
      : "needs-help";

  return {
    choices,
    message: placement ? getReadyMessage(parseResult, zones) : getHelpMessage(parseResult.missing),
    missing: parseResult.missing,
    normalizedTranscript: parseResult.normalizedTranscript,
    parseResult,
    placement,
    status,
    transcript,
  };
};
