export {
  classifyPlatform,
  detectPlatform,
  readPlatformEnv,
  requiresDownloadGate,
  type PlatformDisplayMode,
  type PlatformEnv,
  type PlatformFormFactor,
  type PlatformInfo,
} from "./platformDetection";
export { usePlatform } from "./usePlatform";
export {
  platformRequiresDownloadGate,
  resolveDownloadGate,
  STREAMING_GATE,
  type DownloadGatePhase,
  type DownloadGateProgress,
  type DownloadGateState,
} from "./downloadGate";
export {
  useGameDownloadGate,
  type GameDownloadGateController,
} from "./useGameDownloadGate";
