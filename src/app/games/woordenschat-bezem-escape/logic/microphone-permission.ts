export type MicrophonePermissionState =
  | "denied"
  | "granted"
  | "insecure-context"
  | "prompt"
  | "unknown"
  | "unsupported";

export interface MicrophonePermissionResult {
  canAsk: boolean;
  canUse: boolean;
  message: string;
  state: MicrophonePermissionState;
}

const createMicrophonePermissionResult = (
  state: MicrophonePermissionState,
  message: string,
): MicrophonePermissionResult => ({
  canAsk: state === "prompt" || state === "unknown",
  canUse: state === "granted",
  message,
  state,
});

export const initialMicrophonePermissionResult: MicrophonePermissionResult =
  createMicrophonePermissionResult(
    "unknown",
    "Tik op de microfoonknop om toestemming te vragen.",
  );

const getUnavailableReason = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return createMicrophonePermissionResult(
      "unsupported",
      "Microfooncontrole is hier niet beschikbaar.",
    );
  }

  if (!window.isSecureContext) {
    return createMicrophonePermissionResult(
      "insecure-context",
      "Microfoon werkt op telefoon meestal alleen via HTTPS of localhost.",
    );
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return createMicrophonePermissionResult(
      "unsupported",
      "Deze browser kan geen microfoontoestemming vragen. Gebruik Typ of probeer Chrome.",
    );
  }

  return undefined;
};

const mapPermissionState = (state: PermissionState): MicrophonePermissionResult => {
  if (state === "granted") {
    return createMicrophonePermissionResult("granted", "Microfoon is toegestaan.");
  }

  if (state === "denied") {
    return createMicrophonePermissionResult(
      "denied",
      "Microfoon is geblokkeerd. Zet microfoontoegang aan in de browserinstellingen.",
    );
  }

  return createMicrophonePermissionResult(
    "prompt",
    "De browser moet nog om microfoontoestemming vragen.",
  );
};

const readBrowserMicrophonePermissionStatus =
  async (): Promise<MicrophonePermissionResult | undefined> => {
    if (!navigator.permissions?.query) {
      return undefined;
    }

    try {
      const permissionStatus = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      return mapPermissionState(permissionStatus.state);
    } catch {
      return undefined;
    }
  };

export const getMicrophonePermissionStatus = async (): Promise<MicrophonePermissionResult> => {
  const unavailableReason = getUnavailableReason();

  if (unavailableReason) {
    return unavailableReason;
  }

  const permissionStatus = await readBrowserMicrophonePermissionStatus();

  if (permissionStatus) {
    return permissionStatus;
  }

  return createMicrophonePermissionResult(
    "unknown",
    "Tik op de microfoonknop om toestemming te vragen.",
  );
};

export const requestMicrophonePermission = async (): Promise<MicrophonePermissionResult> => {
  const unavailableReason = getUnavailableReason();

  if (unavailableReason) {
    return unavailableReason;
  }

  const currentPermissionStatus = await readBrowserMicrophonePermissionStatus();

  if (
    currentPermissionStatus?.state === "denied" ||
    currentPermissionStatus?.state === "granted"
  ) {
    return currentPermissionStatus;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());

    return createMicrophonePermissionResult("granted", "Microfoon is toegestaan.");
  } catch (error) {
    const errorName = error instanceof DOMException ? error.name : "";

    if (errorName === "NotAllowedError" || errorName === "SecurityError") {
      return createMicrophonePermissionResult(
        "denied",
        "Microfoon is geweigerd. Sta microfoon toe in de browserinstellingen en probeer opnieuw.",
      );
    }

    if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
      return createMicrophonePermissionResult(
        "unsupported",
        "Er is geen microfoon gevonden op dit apparaat.",
      );
    }

    return createMicrophonePermissionResult(
      "unknown",
      "Microfoon kon niet worden gestart. Gebruik Typ of probeer het opnieuw.",
    );
  }
};
