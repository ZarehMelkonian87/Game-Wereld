export const RACE_STATE_STORAGE_KEY = "woordenschat-bezem-escape:race-state";
export const RACE_RESULT_STORAGE_KEY = "woordenschat-bezem-escape:race-result";

export const hasSavedRaceState = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.sessionStorage.getItem(RACE_STATE_STORAGE_KEY));
};

export const clearStoredRaceResult = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(RACE_RESULT_STORAGE_KEY);
};

