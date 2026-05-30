interface BeachBackgroundProps {
  landscapeUrl: string;
  portraitUrl: string;
}

export function BeachBackground({ landscapeUrl, portraitUrl }: BeachBackgroundProps) {
  return (
    <div
      data-testid="beach-scene-board"
      className="absolute inset-0 overflow-hidden bg-sky-100"
    >
      <img
        src={portraitUrl}
        alt=""
        data-testid="beach-background-portrait"
        className="absolute inset-0 h-full w-full object-cover object-center landscape:hidden"
        draggable={false}
      />
      <img
        src={landscapeUrl}
        alt=""
        data-testid="beach-background-landscape"
        className="absolute inset-0 hidden h-full w-full object-cover object-center landscape:block"
        draggable={false}
      />
    </div>
  );
}
