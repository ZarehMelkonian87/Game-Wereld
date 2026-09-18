import type { RuntimeStorage } from "../../../../game-platform/contracts";

/**
 * Persoonlijk record voor Zeg & Vlieg (T-30): de verste vlucht (in meters) per
 * profiel. Dit voedt het "ik wil mijn record verbeteren"-gevoel zonder harde
 * straf. Lokaal per profiel opgeslagen, net als de andere spelinstellingen.
 */
export interface VoiceScrollerRecord {
  bestCombo: number;
  bestDistanceMeters: number;
}

export const emptyVoiceScrollerRecord: VoiceScrollerRecord = {
  bestCombo: 0,
  bestDistanceMeters: 0,
};

const getRecordStorageKey = (profileId: string) =>
  `magisch-strand-avontuur:${profileId}:zeg-en-vlieg-record`;

export const readVoiceScrollerRecord = (
  profileId: string,
  storage: RuntimeStorage,
): VoiceScrollerRecord => {
  const raw = storage.get(getRecordStorageKey(profileId));

  if (!raw) {
    return emptyVoiceScrollerRecord;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<VoiceScrollerRecord>;

    return {
      bestCombo: Math.max(0, Math.floor(Number(parsed.bestCombo) || 0)),
      bestDistanceMeters: Math.max(0, Math.floor(Number(parsed.bestDistanceMeters) || 0)),
    };
  } catch {
    return emptyVoiceScrollerRecord;
  }
};

export const saveVoiceScrollerRecord = (
  profileId: string,
  record: VoiceScrollerRecord,
  storage: RuntimeStorage,
): void => {
  storage.set(
    getRecordStorageKey(profileId),
    JSON.stringify({
      bestCombo: Math.max(0, Math.floor(record.bestCombo)),
      bestDistanceMeters: Math.max(0, Math.floor(record.bestDistanceMeters)),
    }),
  );
};

/**
 * Wist het Zeg & Vlieg-record van een profiel. Onderdeel van "Voortgang
 * resetten" (T-11): het record is voortgangsdata en moet dus ook weg.
 */
export const resetVoiceScrollerRecord = (profileId: string, storage: RuntimeStorage): void => {
  storage.remove(getRecordStorageKey(profileId));
};

/**
 * Werkt het record bij met de resultaten van een ronde. Geeft het nieuwe record
 * terug plus of er een nieuw afstands-/comborecord is gehaald (voor de viering).
 */
export const updateVoiceScrollerRecord = (
  previous: VoiceScrollerRecord,
  round: { comboReached: number; distanceMeters: number },
): { isNewComboRecord: boolean; isNewDistanceRecord: boolean; record: VoiceScrollerRecord } => {
  const distanceMeters = Math.max(0, Math.floor(round.distanceMeters));
  const comboReached = Math.max(0, Math.floor(round.comboReached));
  const isNewDistanceRecord = distanceMeters > previous.bestDistanceMeters;
  const isNewComboRecord = comboReached > previous.bestCombo;

  return {
    isNewComboRecord,
    isNewDistanceRecord,
    record: {
      bestCombo: Math.max(previous.bestCombo, comboReached),
      bestDistanceMeters: Math.max(previous.bestDistanceMeters, distanceMeters),
    },
  };
};
