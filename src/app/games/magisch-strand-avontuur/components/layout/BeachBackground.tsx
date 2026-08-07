interface BeachBackgroundProps {
  landscapeUrl: string;
  landscapeWebpUrl?: string;
  portraitUrl: string;
  portraitWebpUrl?: string;
  forceLandscape?: boolean;
}
export const BeachBackground = ({
  landscapeUrl,
  landscapeWebpUrl,
  portraitUrl,
  portraitWebpUrl,
  forceLandscape = false,
}: BeachBackgroundProps) => {
  return (
    <div data-testid="beach-scene-board" className="absolute inset-0 overflow-hidden bg-sky-100">
      {!forceLandscape && (
        <picture>
          {portraitWebpUrl ? <source srcSet={portraitWebpUrl} type="image/webp" /> : null}
          <img
            src={portraitUrl}
            alt=""
            data-testid="beach-background-portrait"
            className="absolute inset-0 h-full w-full object-fill object-center landscape:hidden"
            draggable={false}
          />
        </picture>
      )}
      <picture>
        {landscapeWebpUrl ? <source srcSet={landscapeWebpUrl} type="image/webp" /> : null}
        <img
          src={landscapeUrl}
          alt=""
          data-testid="beach-background-landscape"
          className={`absolute inset-0 h-full w-full object-fill object-center ${forceLandscape ? "" : "hidden landscape:block"}`}
          draggable={false}
        />
      </picture>
    </div>
  );
};
