export type VoiceSideScrollerFrameCallback = (timestamp: number) => void;
export const getVoiceSideScrollerTimestamp = () => {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
};
export const requestVoiceSideScrollerFrame = (callback: VoiceSideScrollerFrameCallback): number => {
  if (typeof window === "undefined") {
    return 0;
  }
  return window.setTimeout(() => {
    callback(getVoiceSideScrollerTimestamp());
  }, 16);
};
export const cancelVoiceSideScrollerFrame = (frameId: number) => {
  if (typeof window === "undefined") {
    return;
  }
  window.clearTimeout(frameId);
};
