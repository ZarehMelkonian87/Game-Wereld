import { useEffect, useRef } from "react";

interface MicWaveBarsProps {
  /** Aantal balkjes in de wave. */
  barCount?: number;
  /** Extra classes op de container. */
  className?: string;
  /** Kleuren-classes per balkje (herhaalt als er meer balkjes zijn). */
  barClassName?: string;
}

const MIN_SCALE = 0.28;
const MAX_SCALE = 1.35;

/**
 * Audio-reactieve wave-balkjes voor de microfoon: stil = platte lijn,
 * praten = uitslaande balkjes. Reageert op het echte microfoonvolume via een
 * Web Audio `AnalyserNode`. De balkjes worden **direct via de DOM** aangestuurd
 * (geen React-state per frame) zodat er geen re-renders ontstaan tijdens spraak
 * (zie performance-analyse T-33).
 *
 * Valt netjes terug op een rustige idle-animatie als de microfoon niet
 * beschikbaar is (bv. geen toestemming of niet ondersteund).
 */
export const MicWaveBars = ({
  barCount = 7,
  className = "",
  barClassName = "bg-white",
}: MicWaveBarsProps) => {
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    let audioContext: AudioContext | null = null;
    let stream: MediaStream | null = null;
    let analyser: AnalyserNode | null = null;

    const applyIdleFallback = () => {
      barRefs.current.forEach((bar, index) => {
        if (bar) {
          bar.style.animation = `micWaveIdle 0.85s ${index * 0.09}s infinite ease-in-out`;
        }
      });
    };

    const start = async () => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        applyIdleFallback();
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const AudioContextClass =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) {
          applyIdleFallback();
          return;
        }

        audioContext = new AudioContextClass();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        source.connect(analyser);

        const buffer = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
          if (cancelled || !analyser) {
            return;
          }

          analyser.getByteTimeDomainData(buffer);
          let sumSquares = 0;
          for (let index = 0; index < buffer.length; index += 1) {
            const centered = (buffer[index] - 128) / 128;
            sumSquares += centered * centered;
          }
          const rms = Math.sqrt(sumSquares / buffer.length);
          // Versterk en begrens naar 0..1 zodat normaal kinderstemvolume duidelijk uitslaat.
          const level = Math.min(1, rms * 3.2);
          const now = Date.now();

          barRefs.current.forEach((bar, index) => {
            if (!bar) {
              return;
            }
            // Kleine per-balkje variatie voor een natuurlijke golf.
            const wobble = 0.65 + 0.35 * Math.sin(now / 110 + index * 0.9);
            const scale = MIN_SCALE + level * wobble * (MAX_SCALE - MIN_SCALE);
            bar.style.transform = `scaleY(${Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale))})`;
          });

          rafId = requestAnimationFrame(loop);
        };

        loop();
      } catch {
        // Geen mic-toestemming of andere fout: toon een rustige idle-animatie.
        applyIdleFallback();
      }
    };

    void start();

    return () => {
      cancelled = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      analyser?.disconnect();
      stream?.getTracks().forEach((track) => track.stop());
      void audioContext?.close();
    };
  }, []);

  return (
    <div className={`flex items-center gap-0.5 ${className}`} data-slot="mic-wave-bars">
      <style>{`
        @keyframes micWaveIdle {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1.1); }
        }
      `}</style>
      {Array.from({ length: barCount }).map((_, index) => (
        <span
          key={`mic-wave-bar-${index}`}
          ref={(element) => {
            barRefs.current[index] = element;
          }}
          className={`inline-block w-1 rounded-full ${barClassName}`}
          style={{
            height: "1.25rem",
            transform: `scaleY(${MIN_SCALE})`,
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
};

MicWaveBars.displayName = "MicWaveBars";
