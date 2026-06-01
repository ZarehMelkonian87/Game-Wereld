import { DEFAULT_WORLD_ID, getWorldDefinition } from "../worlds";

function getSelectedWorldStorageKey(profileId: string) {
  return `woordenschat-bezem-escape:${profileId}:selected-world`;
}

export function readSelectedWorldId(profileId: string) {
  if (typeof window === "undefined") {
    return DEFAULT_WORLD_ID;
  }

  const storedWorldId = window.localStorage.getItem(getSelectedWorldStorageKey(profileId));

  if (!storedWorldId) {
    return DEFAULT_WORLD_ID;
  }

  return getWorldDefinition(storedWorldId).id;
}

export function saveSelectedWorldId(profileId: string, worldId: string) {
  if (typeof window === "undefined") {
    return DEFAULT_WORLD_ID;
  }

  const world = getWorldDefinition(worldId);
  window.localStorage.setItem(getSelectedWorldStorageKey(profileId), world.id);

  return world.id;
}
