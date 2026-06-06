export type VoiceSideScrollerFrameCallback = (timestamp: number) => void;

export const getVoiceSideScrollerTimestamp = () => {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }

  return Date.now();
};

const shouldUseAnimationFrame = () =>
  typeof window !== "undefined" &&
  typeof window.requestAnimationFrame === "function" &&
  typeof document !== "undefined" &&
  !document.hidden;

export const requestVoiceSideScrollerFrame = (
  callback: VoiceSideScrollerFrameCallback,
) => {
  if (shouldUseAnimationFrame()) {
    return window.requestAnimationFrame(callback);
  }

  return window.setTimeout(() => {
    callback(getVoiceSideScrollerTimestamp());
  }, 16);
};

export const cancelVoiceSideScrollerFrame = (frameId: number) => {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.cancelAnimationFrame === "function") {
    window.cancelAnimationFrame(frameId);
  }

  window.clearTimeout(frameId);
};
