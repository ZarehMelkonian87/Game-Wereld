import { ImgGameLogo } from "./components/ImgGameLogo";
import { ImgHeroCharacter } from "./components/ImgHeroCharacter";

export const StartHero = () => (
  <>
    <ImgGameLogo className="absolute left-[48%] top-[86px] z-20 w-[min(74vw,290px)] -translate-x-1/2 -rotate-2 landscape:left-[27%] landscape:top-11 landscape:w-[min(33vw,285px)]" />

    <div
      aria-hidden="true"
      className="absolute left-1/2 top-[305px] z-10 w-[min(82vw,340px)] -translate-x-1/2 landscape:left-[72%] landscape:top-[82px] landscape:w-[min(39vw,330px)]"
      data-component="StartHero"
    >
      <div className="bezem-start-flyer relative">
        <div className="bezem-start-trail absolute left-[16%] top-[44%] h-[26%] w-[70%] rounded-full bg-gradient-to-r from-amber-200 via-pink-200 to-sky-200 opacity-75 blur-[3px]" />
        <ImgHeroCharacter className="relative z-20 w-[78%] -rotate-[7deg]" />
      </div>
    </div>
  </>
);

StartHero.displayName = "StartHero";
