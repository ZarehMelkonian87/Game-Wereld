interface BeachBackgroundProps {
  landscapeUrl: string;
  portraitUrl: string;
}

export function BeachBackground({ landscapeUrl, portraitUrl }: BeachBackgroundProps) {
  return (
    <>
      <img
        src={portraitUrl}
        alt=""
        data-testid="beach-background-portrait"
        className="absolute inset-0 h-full w-full object-contain landscape:hidden"
        draggable={false}
      />
      <img
        src={landscapeUrl}
        alt=""
        data-testid="beach-background-landscape"
        className="absolute inset-0 hidden h-full w-full object-contain landscape:block"
        draggable={false}
      />
    </>
  );
}
