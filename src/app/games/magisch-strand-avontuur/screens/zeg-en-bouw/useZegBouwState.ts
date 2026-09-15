import { useMemo, useState } from "react";
import {
  addProfileTotals,
  readUnlockedRewardIds,
  resolveNewRewardUnlocks,
  saveUnlockedRewardIds,
} from "../../logic/rewards";
import { findSmallestZoneAtPoint, getZoneCenter, type ScenePoint } from "../../logic/scene-zones";
import {
  getBuildCardProgress,
  isObjectAllowedOnCard,
  shuffleBuildCards,
  zegBouwCards,
  type ZegBouwCard,
} from "../../logic/zeg-en-bouw-cards";
import { createRoundSeed } from "../../logic/instruction-randomization";
import { useGameRuntime } from "../../runtime/GameRuntimeContext";
import type { SceneObject, SceneZone } from "../../types";

export interface ZegBouwPlacedObject {
  key: string;
  objectId: string;
  x: number;
  y: number;
  zoneId: string;
}

export interface ZegBouwFeedback {
  kind: "good" | "tip" | "prompt";
  text: string;
}

const getObjectLabel = (objects: readonly SceneObject[], objectId: string) =>
  objects.find((object) => object.id === objectId)?.label ?? objectId;

export const useZegBouwState = ({
  objects,
  zones,
}: {
  objects: readonly SceneObject[];
  zones: readonly SceneZone[];
}) => {
  const runtime = useGameRuntime();
  const rewardProfileId = runtime.identity.profileId;

  const [roundSeed, setRoundSeed] = useState(() => createRoundSeed());
  const cards = useMemo(() => shuffleBuildCards(zegBouwCards, roundSeed), [roundSeed]);
  const [cardIndex, setCardIndex] = useState(0);
  const card: ZegBouwCard = cards[cardIndex] ?? cards[0];

  const [placedObjects, setPlacedObjects] = useState<ZegBouwPlacedObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ZegBouwFeedback | null>(null);
  const [wordStarValue, setWordStarValue] = useState(0);
  const [unlockedRewardIds, setUnlockedRewardIds] = useState<string[]>(() =>
    readUnlockedRewardIds(rewardProfileId, runtime.storage),
  );

  const placedObjectIds = placedObjects.map((placedObject) => placedObject.objectId);
  const progress = getBuildCardProgress(card, placedObjectIds);
  const isCardComplete = progress.complete;

  const awardStars = (earnedWordStars: number) => {
    const totals = addProfileTotals(rewardProfileId, runtime.storage, {
      speed: earnedWordStars,
      wordStars: earnedWordStars,
    });
    const newUnlocks = resolveNewRewardUnlocks({
      totalWordStars: totals.wordStars,
      unlockedRewardIds,
    });

    if (newUnlocks.length > 0) {
      const nextUnlocked = [...unlockedRewardIds, ...newUnlocks.map((reward) => reward.id)];
      setUnlockedRewardIds(nextUnlocked);
      saveUnlockedRewardIds(rewardProfileId, nextUnlocked, runtime.storage);
    }

    setWordStarValue((current) => current + earnedWordStars);
    return newUnlocks;
  };

  const selectObject = (objectId: string) => {
    setSelectedObjectId(objectId);
    setFeedback({
      kind: "prompt",
      text: `Waar wil je de ${getObjectLabel(objects, objectId)} neerzetten? Tik op het strand of in de zee.`,
    });
  };

  /**
   * Plaatst één object op een geldige plek. Past het object bij het thema, dan
   * telt het mee; past het niet, dan volgt een vriendelijke tip (geen straf).
   * Geeft terug of er daadwerkelijk geplaatst is.
   */
  const placeObject = (objectId: string, point: ScenePoint, zoneId: string) => {
    const label = getObjectLabel(objects, objectId);

    if (!isObjectAllowedOnCard(card, objectId)) {
      setFeedback({
        kind: "tip",
        text: `Een ${label} past niet zo goed op het ${card.theme}. Kies iets dat er wél bij hoort!`,
      });
      return false;
    }

    const alreadyPlaced = placedObjects.some((placedObject) => placedObject.objectId === objectId);

    setPlacedObjects((current) => [
      ...current.filter((placedObject) => placedObject.objectId !== objectId),
      { key: `${objectId}-${Math.round(point.x)}-${Math.round(point.y)}`, objectId, x: point.x, y: point.y, zoneId },
    ]);
    setSelectedObjectId(null);

    // Sterren alleen voor een nieuw, passend object (niet voor verplaatsen).
    if (!alreadyPlaced) {
      awardStars(2);
    }

    const nextCount = getBuildCardProgress(card, [
      ...placedObjectIds.filter((id) => id !== objectId),
      objectId,
    ]).count;

    setFeedback(
      nextCount >= card.goalCount
        ? { kind: "good", text: `Knap gedaan! Je ${card.theme} is helemaal af! 🎉` }
        : { kind: "good", text: `Mooi! De ${label} staat op zijn plek.` },
    );

    return true;
  };

  const placeSelectedAtPoint = (point: ScenePoint) => {
    if (!selectedObjectId) {
      setFeedback({ kind: "prompt", text: "Kies eerst een plaatje onderaan." });
      return;
    }

    const zone = findSmallestZoneAtPoint([...zones], point);
    if (!zone) {
      setFeedback({
        kind: "prompt",
        text: "Tik op het strand of in de zee om het plaatje neer te zetten.",
      });
      return;
    }

    placeObject(selectedObjectId, point, zone.id);
  };

  /** Plaatst een object in het midden van een genoemde zone (voor spraak, C2b). */
  const placeObjectInZone = (objectId: string, zoneId: string) => {
    const zone = zones.find((candidate) => candidate.id === zoneId);
    if (!zone) {
      return false;
    }
    return placeObject(objectId, getZoneCenter(zone), zoneId);
  };

  const startNextCard = () => {
    setPlacedObjects([]);
    setSelectedObjectId(null);
    setFeedback(null);
    setCardIndex((current) => (current + 1) % cards.length);
  };

  const restartRound = () => {
    const nextSeed = createRoundSeed();
    setRoundSeed(nextSeed);
    setCardIndex(0);
    setPlacedObjects([]);
    setSelectedObjectId(null);
    setFeedback(null);
  };

  return {
    card,
    feedback,
    isCardComplete,
    placeObjectInZone,
    placeSelectedAtPoint,
    placedObjects,
    progress,
    restartRound,
    rewardProfileId,
    selectObject,
    selectedObjectId,
    startNextCard,
    unlockedRewardIds,
    wordStarValue,
  };
};
