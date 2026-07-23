import { DEFAULT_WORLD_ID, getWorldDefinition } from "../worlds";
const getSelectedWorldStorageKey = (profileId: string) => {
  return `strand-bezem-escape:${profileId}:selected-world`;
};
export const readSelectedWorldId = (profileId: string) => {
  if (typeof window === "undefined") {
    return DEFAULT_WORLD_ID;
  }
  const storedWorldId = window.localStorage.getItem(getSelectedWorldStorageKey(profileId));
  if (!storedWorldId) {
    return DEFAULT_WORLD_ID;
  }
  return getWorldDefinition(storedWorldId).id;
};
export const saveSelectedWorldId = (profileId: string, worldId: string) => {
  if (typeof window === "undefined") {
    return DEFAULT_WORLD_ID;
  }
  const world = getWorldDefinition(worldId);
  window.localStorage.setItem(getSelectedWorldStorageKey(profileId), world.id);
  return world.id;
};
