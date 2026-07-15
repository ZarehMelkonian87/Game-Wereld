interface BeachBackgroundProps {
  landscapeUrl: string;
  portraitUrl: string;
  forceLandscape?: boolean;
}

export function BeachBackground({
  landscapeUrl,
  portraitUrl,
  forceLandscape = false,
}: BeachBackgroundProps) {
  return (
    <div
      data-testid="beach-scene-board"
      className="absolute inset-0 overflow-hidden bg-sky-100"
    >
      {!forceLandscape && (
        <img
          src={portraitUrl}
          alt=""
          data-testid="beach-background-portrait"
          className="absolute inset-0 h-full w-full object-fill object-center landscape:hidden"
          draggable={false}
        />
      )}
      <img
        src={landscapeUrl}
        alt=""
        data-testid="beach-background-landscape"
        className={`absolute inset-0 h-full w-full object-fill object-center ${
          forceLandscape ? "" : "hidden landscape:block"
        }`}
        draggable={false}
      />
    </div>
  );
}
