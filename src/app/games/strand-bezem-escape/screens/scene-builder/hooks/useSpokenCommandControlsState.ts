import { useEffect, useRef, useState } from "react";
import { useDutchSpeechRecognition } from "../../../hooks/useDutchSpeechRecognition";
import {
  initialMicrophonePermissionResult,
  type MicrophonePermissionResult,
} from "../../../logic/microphone-permission";
import type { VoiceRecognitionStatus } from "../../../logic/speech-recognition";
import { readVoicePrivacyAccepted, saveVoicePrivacyAccepted } from "../../../logic/voice-privacy";
import { useGameRuntime } from "../../../runtime/GameRuntimeContext";

export const useSpokenCommandControlsState = ({
  exampleText,
  onTranscript,
  onVoiceStatusChange,
  profileId,
}: {
  exampleText: string;
  onTranscript: (transcript: string) => void;
  onVoiceStatusChange?: (status: VoiceRecognitionStatus) => void;
  profileId: string;
}) => {
  const runtime = useGameRuntime();
  const handledTranscriptRef = useRef<string | undefined>();
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(() =>
    readVoicePrivacyAccepted(profileId, runtime.storage),
  );
  const [manualText, setManualText] = useState("");
  const [hasRequestedMicrophonePermission, setHasRequestedMicrophonePermission] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState<MicrophonePermissionResult>(
    initialMicrophonePermissionResult,
  );
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  const {
    errorMessage,
    resetTranscript,
    startListening,
    status,
    stopListening,
    support,
    transcript,
  } = useDutchSpeechRecognition({ autoStopMs: 6500 });

  const hasMicrophonePermissionMessage =
    hasRequestedMicrophonePermission && !microphonePermission.canUse;

  const showStatusBubble =
    status === "listening" ||
    status === "processing" ||
    status === "unsupported" ||
    hasMicrophonePermissionMessage ||
    Boolean(errorMessage) ||
    Boolean(transcript);

  const shouldShowFallback = showManualFallback || !support.isSupported;
  const shouldShowPopover = showPrivacyNotice || shouldShowFallback || showStatusBubble;

  useEffect(() => {
    setHasAcceptedPrivacy(readVoicePrivacyAccepted(profileId, runtime.storage));
  }, [profileId, runtime.storage]);

  useEffect(() => {
    onVoiceStatusChange?.(status);
  }, [status, onVoiceStatusChange]);

  useEffect(() => {
    if (!transcript || status !== "heard" || handledTranscriptRef.current === transcript) {
      return;
    }

    handledTranscriptRef.current = transcript;
    onTranscript(transcript);
  }, [onTranscript, status, transcript]);

  useEffect(() => {
    if (!support.isSupported) {
      setShowManualFallback(true);
    }
  }, [support.isSupported]);

  useEffect(() => {
    handledTranscriptRef.current = undefined;
    setManualText("");
    setShowManualFallback(!support.isSupported);
    setShowPrivacyNotice(false);
    resetTranscript();
  }, [exampleText, resetTranscript, support.isSupported]);

  useEffect(() => {
    let isMounted = true;

    runtime.speech.getMicrophonePermission().then((permissionStatus) => {
      if (isMounted) {
        setMicrophonePermission(permissionStatus);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [runtime.speech]);

  const startListeningAfterPermission = async () => {
    if (!support.isSupported) {
      setShowManualFallback(true);
      return false;
    }

    setHasRequestedMicrophonePermission(true);
    const permissionStatus = await runtime.speech.requestMicrophonePermission();
    setMicrophonePermission(permissionStatus);

    if (!permissionStatus.canUse) {
      setShowManualFallback(true);
      return false;
    }

    return startListening();
  };

  const handleStartListening = () => {
    if (!support.isSupported) {
      setShowManualFallback(true);
      return;
    }

    if (!hasAcceptedPrivacy) {
      setShowPrivacyNotice(true);
      return;
    }

    void startListeningAfterPermission();
  };

  const handleAcceptPrivacy = () => {
    saveVoicePrivacyAccepted(profileId, runtime.storage);
    setHasAcceptedPrivacy(true);
    setShowPrivacyNotice(false);
    void startListeningAfterPermission();
  };

  const handleSubmitTypedCommand = (transcriptText: string) => {
    handledTranscriptRef.current = transcriptText;
    onTranscript(transcriptText);
    setManualText("");
    setShowManualFallback(false);
  };

  return {
    handleAcceptPrivacy,
    handleStartListening,
    handleSubmitTypedCommand,
    hasAcceptedPrivacy,
    hasMicrophonePermissionMessage,
    manualText,
    microphonePermission,
    setManualText,
    setShowManualFallback,
    setShowPrivacyNotice,
    shouldShowFallback,
    shouldShowPopover,
    showPrivacyNotice,
    showStatusBubble,
    status,
    stopListening,
    support,
  };
};
