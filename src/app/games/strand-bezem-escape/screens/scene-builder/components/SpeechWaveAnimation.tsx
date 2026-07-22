export const SpeechWaveAnimation = () => {
  return (
    <>
      <style>{`
        @keyframes speechWave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.2); }
        }
        .speech-bar {
          animation: speechWave 0.8s infinite ease-in-out;
          transform-origin: center;
        }
      `}</style>
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-2 rounded-2xl border border-white/40 bg-sky-500/95 px-5 py-3 shadow-xl backdrop-blur-md">
        <span className="text-xs font-black tracking-wide text-white uppercase mr-1.5 animate-pulse">
          Ik luister...
        </span>
        <div className="flex items-center gap-1 h-6 w-12">
          <div className="speech-bar w-1.5 h-4 rounded-full bg-white" style={{ animationDelay: "0.1s" }} />
          <div className="speech-bar w-1.5 h-6 rounded-full bg-white" style={{ animationDelay: "0.25s" }} />
          <div className="speech-bar w-1.5 h-5 rounded-full bg-white" style={{ animationDelay: "0.4s" }} />
          <div className="speech-bar w-1.5 h-6 rounded-full bg-white" style={{ animationDelay: "0.15s" }} />
          <div className="speech-bar w-1.5 h-3 rounded-full bg-white" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    </>
  );
};

SpeechWaveAnimation.displayName = "SpeechWaveAnimation";
