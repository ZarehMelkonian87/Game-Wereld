export interface GameStorage {
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
}

export const createBrowserGameStorage = (): GameStorage => ({
  getItem: (key) => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(key);
  },
  removeItem: (key) => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(key);
  },
  setItem: (key, value) => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(key, value);
  },
});

