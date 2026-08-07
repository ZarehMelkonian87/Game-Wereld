import { avatarIconUrls, mascotIconUrls, startLogoUrl } from "../../asset-urls";

/**
 * @uxId IMG_GAME_LOGO
 * @uxId IMG_HERO_CHARACTER
 * @screens SCR_MAIN_TITLE
 * @description Titel logo en Hero-illustratie van de jongen op de vliegende strandbezem.
 */
export const StartHero = () => (
  <>
    <img
      alt="+1 Woordenschat Bezem Escape"
      className="absolute left-[48%] top-[86px] z-20 w-[min(74vw,290px)] -translate-x-1/2 -rotate-2 select-none drop-shadow-[0_8px_0_rgba(21,48,74,0.16)] landscape:left-[27%] landscape:top-11 landscape:w-[min(33vw,285px)]"
      data-testid="start-logo"
      draggable={false}
      src={startLogoUrl}
    />

    <div
      aria-hidden="true"
      className="absolute left-1/2 top-[305px] z-10 w-[min(82vw,340px)] -translate-x-1/2 landscape:left-[72%] landscape:top-[82px] landscape:w-[min(39vw,330px)]"
      data-component="StartHero"
    >
      <div className="bezem-start-flyer relative">
        <div className="bezem-start-trail absolute left-[16%] top-[44%] h-[26%] w-[70%] rounded-full bg-gradient-to-r from-amber-200 via-pink-200 to-sky-200 opacity-75 blur-[3px]" />
        <img
          alt=""
          className="bezem-start-mascot absolute right-[-4%] top-[12%] z-10 w-[34%] rotate-[10deg] select-none drop-shadow-[0_7px_0_rgba(21,48,74,0.14)]"
          draggable={false}
          src={mascotIconUrls.celebration}
        />
        <img
          alt=""
          className="relative z-20 w-[78%] -rotate-[7deg] select-none drop-shadow-[0_9px_0_rgba(21,48,74,0.18)]"
          draggable={false}
          src={avatarIconUrls.avatar01}
        />
      </div>
    </div>
  </>
);

StartHero.displayName = "StartHero";
