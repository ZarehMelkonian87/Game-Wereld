import { describe, expect, it } from "vitest";
import {
  getMicrophoneEnvironmentMessage,
  getMicrophonePermissionAttemptMessage,
  getMicrophonePermissionButtonLabel,
} from "./microphoneSettings";

describe("microfoonfallbacks", () => {
  it("behandelt geweigerde toestemming als herstelbare normale toestand", () => {
    const denied = {
      canAsk: true,
      canUse: false,
      message: "Microfoon geweigerd.",
      state: "denied" as const,
    };
    expect(getMicrophonePermissionButtonLabel(false, denied)).toBe("Controleer opnieuw");
    expect(getMicrophonePermissionAttemptMessage(denied)).toContain("browserinstellingen");
  });

  it("legt unsupported uit zonder speechdata te vereisen", () => {
    expect(
      getMicrophoneEnvironmentMessage({
        isSecureContext: true,
        isSupported: false,
        needsSecureContext: false,
        reason: "api-missing",
      }),
    ).toContain("Deze browser");
  });
});
