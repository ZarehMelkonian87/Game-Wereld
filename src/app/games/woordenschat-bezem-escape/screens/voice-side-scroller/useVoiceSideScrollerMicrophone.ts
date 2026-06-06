import { useCallback, useEffect, useRef, useState } from "react";
import {
  getMicrophonePermissionStatus,
  initialMicrophonePermissionResult,
  requestMicrophonePermission,
  type MicrophonePermissionResult,
} from "../../logic/microphone-permission";
import {
  cancelVoiceSideScrollerFrame,
  requestVoiceSideScrollerFrame,
} from "./voiceSideScrollerFrame";

export type VoiceSideScrollerMicrophoneStatus =
  | "idle"
  | "checking"
  | "requesting"
  | "listening"
  | "blocked"
  | "unsupported"
  | "error";

export interface VoiceSideScrollerMicrophoneState {
  message: string;
  noiseFloor: number;
  permission: MicrophonePermissionResult;
  status: VoiceSideScrollerMicrophoneStatus;
  verticalInput: number;
  volumeLevel: number;
}

export interface VoiceSideScrollerMicrophoneController {
  microphone: VoiceSideScrollerMicrophoneState;
  startMicrophoneControl: () => Promise<boolean>;
  stopMicrophoneControl: () => void;
}

interface VoiceSideScrollerAudioWindow extends Window {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
}

const MIN_NOISE_FLOOR = 0.012;
const SILENCE_MARGIN = 0.018;
const FULL_VOICE_RANGE = 0.16;

const createInitialMicrophoneState = (): VoiceSideScrollerMicrophoneState => ({
  message: "Tik op Start om de microfoon te gebruiken.",
  noiseFloor: MIN_NOISE_FLOOR,
  permission: initialMicrophonePermissionResult,
  status: "idle",
  verticalInput: 0,
  volumeLevel: 0,
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getMicrophoneStatusFromPermission = ({
  state,
}: MicrophonePermissionResult): VoiceSideScrollerMicrophoneStatus => {
  if (state === "denied" || state === "insecure-context") {
    return "blocked";
  }

  if (state === "unsupported") {
    return "unsupported";
  }

  return "error";
};

const getRmsVolume = (samples: Uint8Array<ArrayBuffer>) => {
  if (samples.length === 0) {
    return 0;
  }

  let sum = 0;

  samples.forEach((sample) => {
    const centeredSample = (sample - 128) / 128;
    sum += centeredSample * centeredSample;
  });

  return Math.sqrt(sum / samples.length);
};

const getVoiceLevelFromRms = (rms: number, noiseFloor: number) => {
  const usableSignal = Math.max(0, rms - noiseFloor - SILENCE_MARGIN);
  return clamp(usableSignal / FULL_VOICE_RANGE, 0, 1);
};

const getVerticalInputFromVoiceLevel = (voiceLevel: number) => {
  if (voiceLevel < 0.08) {
    return 0;
  }

  return -clamp((voiceLevel - 0.08) / 0.92, 0, 1);
};

const getAudioContextConstructor = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const audioWindow = window as VoiceSideScrollerAudioWindow;
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
};

export const useVoiceSideScrollerMicrophone = (): VoiceSideScrollerMicrophoneController => {
  const [microphone, setMicrophone] = useState(createInitialMicrophoneState);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const noiseFloorRef = useRef(MIN_NOISE_FLOOR);
  const samplesRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopMicrophoneControl = useCallback(() => {
    if (frameIdRef.current !== null) {
      cancelVoiceSideScrollerFrame(frameIdRef.current);
      frameIdRef.current = null;
    }

    sourceRef.current?.disconnect();
    sourceRef.current = null;
    analyserRef.current = null;
    samplesRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setMicrophone((currentState) => ({
      ...currentState,
      message:
        currentState.status === "listening"
          ? "Microfoon is gestopt."
          : currentState.message,
      status: currentState.status === "listening" ? "idle" : currentState.status,
      verticalInput: 0,
      volumeLevel: 0,
    }));
  }, []);

  const readMicrophoneFrame = useCallback(() => {
    const analyser = analyserRef.current;
    const samples = samplesRef.current;

    if (!analyser || !samples) {
      return;
    }

    analyser.getByteTimeDomainData(samples);
    const rms = getRmsVolume(samples);

    if (rms < noiseFloorRef.current + 0.04) {
      noiseFloorRef.current = clamp(
        noiseFloorRef.current * 0.96 + rms * 0.04,
        MIN_NOISE_FLOOR,
        0.09,
      );
    }

    const volumeLevel = getVoiceLevelFromRms(rms, noiseFloorRef.current);
    const verticalInput = getVerticalInputFromVoiceLevel(volumeLevel);

    setMicrophone((currentState) => ({
      ...currentState,
      message:
        volumeLevel > 0.08
          ? "Stem bestuurt de bezem."
          : "Praat iets harder om omhoog te vliegen.",
      noiseFloor: noiseFloorRef.current,
      status: "listening",
      verticalInput,
      volumeLevel,
    }));

    frameIdRef.current = requestVoiceSideScrollerFrame(readMicrophoneFrame);
  }, []);

  const startMicrophoneControl = useCallback(async () => {
    stopMicrophoneControl();
    setMicrophone((currentState) => ({
      ...currentState,
      message: "Microfoon controleren...",
      status: "checking",
      verticalInput: 0,
      volumeLevel: 0,
    }));

    const currentPermission = await getMicrophonePermissionStatus();

    if (!currentPermission.canAsk && !currentPermission.canUse) {
      setMicrophone((currentState) => ({
        ...currentState,
        message: currentPermission.message,
        permission: currentPermission,
        status: getMicrophoneStatusFromPermission(currentPermission),
      }));
      return false;
    }

    setMicrophone((currentState) => ({
      ...currentState,
      message: "Microfoontoestemming vragen...",
      permission: currentPermission,
      status: "requesting",
    }));

    const permission = currentPermission.canUse
      ? currentPermission
      : await requestMicrophonePermission();

    if (!permission.canUse) {
      setMicrophone((currentState) => ({
        ...currentState,
        message: permission.message,
        permission,
        status: getMicrophoneStatusFromPermission(permission),
      }));
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const AudioContextConstructor = getAudioContextConstructor();

      if (!AudioContextConstructor) {
        throw new Error("AudioContext is niet beschikbaar.");
      }

      const audioContext = new AudioContextConstructor();

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.74;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      samplesRef.current = new Uint8Array(analyser.fftSize);
      sourceRef.current = source;
      streamRef.current = stream;
      noiseFloorRef.current = MIN_NOISE_FLOOR;

      setMicrophone({
        message: "Microfoon luistert. Praat rustig om omhoog te vliegen.",
        noiseFloor: noiseFloorRef.current,
        permission,
        status: "listening",
        verticalInput: 0,
        volumeLevel: 0,
      });

      frameIdRef.current = requestVoiceSideScrollerFrame(() => {
        readMicrophoneFrame();
      });

      return true;
    } catch {
      setMicrophone((currentState) => ({
        ...currentState,
        message: "Microfoon kon niet starten. Gebruik de knoppen als fallback.",
        permission,
        status: "error",
        verticalInput: 0,
        volumeLevel: 0,
      }));
      return false;
    }
  }, [readMicrophoneFrame, stopMicrophoneControl]);

  useEffect(() => {
    let isMounted = true;

    setMicrophone((currentState) => ({
      ...currentState,
      message: "Microfoonstatus controleren...",
      status: "checking",
    }));

    getMicrophonePermissionStatus().then((permission) => {
      if (!isMounted) {
        return;
      }

      setMicrophone((currentState) => ({
        ...currentState,
        message: permission.canUse
          ? "Microfoon is klaar voor stemcontrole."
          : permission.message,
        permission,
        status: permission.canUse ? "idle" : currentState.status === "checking" ? "idle" : currentState.status,
      }));
    });

    return () => {
      isMounted = false;
      stopMicrophoneControl();
    };
  }, [stopMicrophoneControl]);

  return {
    microphone,
    startMicrophoneControl,
    stopMicrophoneControl,
  };
};
