import type { RuntimeStorage } from "../../../game-platform/contracts";
import { DEFAULT_WORLD_ID, getWorldDefinition } from "../worlds";
const getSelectedWorldStorageKey = (profileId: string) => {
  return `groot-circus-avontuur:${profileId}:selected-world`;
};
export const readSelectedWorldId = (profileId: string, storage: RuntimeStorage) => {
  const storedWorldId = storage.get(getSelectedWorldStorageKey(profileId));
  if (!storedWorldId) {
    return DEFAULT_WORLD_ID;
  }
  return getWorldDefinition(storedWorldId).id;
};
export const saveSelectedWorldId = (
  profileId: string,
  worldId: string,
  storage: RuntimeStorage,
) => {
  const world = getWorldDefinition(worldId);
  storage.set(getSelectedWorldStorageKey(profileId), world.id);
  return world.id;
};
