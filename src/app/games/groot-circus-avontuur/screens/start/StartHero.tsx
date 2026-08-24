import { ImgGameLogo } from "./components/ImgGameLogo";
import { ImgHeroCharacter } from "./components/ImgHeroCharacter";

export const StartHero = () => (
  <>
    <ImgGameLogo className="absolute left-[48%] top-[86px] z-20 w-[min(74vw,290px)] -translate-x-1/2 -rotate-2 landscape:left-[27%] landscape:top-11 landscape:w-[min(33vw,285px)]" />

    <div
      aria-hidden="true"
      className="absolute left-1/2 top-[370px] z-10 w-[min(82vw,340px)] -translate-x-1/2 landscape:left-[72%] landscape:top-[82px] landscape:w-[min(39vw,330px)]"
      data-component="StartHero"
    >
      <div className="bezem-start-flyer relative">
        <ImgHeroCharacter className="relative z-20 w-[78%] -rotate-[7deg]" />
      </div>
    </div>
  </>
);

StartHero.displayName = "StartHero";
