export type VoiceSideScrollerFrameCallback = (timestamp: number) => void;

export const getVoiceSideScrollerTimestamp = () => {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }

  return Date.now();
};

export const requestVoiceSideScrollerFrame = (
  callback: VoiceSideScrollerFrameCallback,
) => {
  if (typeof window !== "undefined" && typeof window.setTimeout === "function") {
    return window.setTimeout(() => {
      callback(getVoiceSideScrollerTimestamp());
    }, 16);
  }

  return setTimeout(() => {
    callback(getVoiceSideScrollerTimestamp());
  }, 16);
};

export const cancelVoiceSideScrollerFrame = (frameId: number) => {
  if (typeof window === "undefined") {
    return;
  }

  window.clearTimeout(frameId);
};
