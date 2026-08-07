import type {
  MicrophonePermissionResult,
  MicrophonePermissionState,
} from "../../../game-platform/contracts";

export type { MicrophonePermissionResult, MicrophonePermissionState };

export const initialMicrophonePermissionResult: MicrophonePermissionResult = {
  canAsk: true,
  canUse: false,
  message: "Tik op de microfoonknop om toestemming te vragen.",
  state: "unknown",
};
