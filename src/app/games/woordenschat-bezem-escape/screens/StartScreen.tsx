import { Play, Settings, Star, Users, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import { avatarIconUrls, mascotIconUrls, startLogoUrl } from "../asset-urls";
import { HudIconButton, PrimaryActionButton } from "../components/ui";
import { classNames } from "../components/ui/classNames";

interface StartScreenProps {
  onOpenDashboard: () => void;
  onOpenSettings: () => void;
  onPlay: () => void;
  starCount?: number;
}

function CircleIcon({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "blue" | "green";
}) {
  return (
    <span
      aria-hidden="true"
      className={classNames(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white",
        tone === "green" ? "text-emerald-500" : "text-sky-600",
      )}
    >
      {children}
    </span>
  );
}

export function StartScreen({
  onOpenDashboard,
  onOpenSettings,
  onPlay,
  starCount = 120,
}: StartScreenProps) {
  return (
    <section
      aria-label="Startscherm"
      className="pointer-events-auto absolute inset-0 z-10 overflow-hidden"
      data-testid="start-screen"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_13%,rgba(255,255,255,0.76),transparent_34%),radial-gradient(circle_at_28%_78%,rgba(255,222,115,0.42),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,247,211,0.24))]"
      />

      <div className="absolute left-3 right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex h-12 items-start justify-between">
        <HudIconButton
          className="h-12 w-12 rounded-[1.1rem] border-[4px] border-white bg-white/95 shadow-[0_5px_0_rgba(21,48,74,0.18)]"
          icon={<Volume2 className="h-6 w-6" strokeWidth={3} />}
          label="Geluid"
          tone="white"
        />

        <div
          aria-label={`${starCount} sterren`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.15rem] border-[4px] border-white bg-white/95 px-4 text-xl font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.18)]"
          data-testid="start-star-counter"
        >
          <Star
            className="h-7 w-7 fill-amber-300 text-amber-600"
            strokeWidth={2.4}
          />
          {starCount}
        </div>

        <button
          aria-label="Instellingen"
          className="inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-[1.1rem] border-[4px] border-white bg-gradient-to-b from-amber-200 to-amber-400 px-2 text-sm font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.18)] active:translate-y-0.5 active:shadow-none landscape:rounded-[1.15rem] landscape:px-3 landscape:text-base"
          data-testid="start-settings-button"
          onClick={onOpenSettings}
          type="button"
        >
          <Settings className="h-6 w-6" strokeWidth={3} />
          <span className="hidden landscape:inline">Opties</span>
        </button>
      </div>

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
      >
        <div className="absolute left-[16%] top-[44%] h-[26%] w-[70%] -rotate-[14deg] rounded-full bg-gradient-to-r from-amber-200 via-pink-200 to-sky-200 opacity-75 blur-[3px]" />
        <img
          alt=""
          className="absolute right-[-4%] top-[12%] z-10 w-[34%] rotate-[10deg] select-none drop-shadow-[0_7px_0_rgba(21,48,74,0.14)]"
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

      <span className="absolute left-5 top-[386px] z-20 h-[18px] w-[18px] rotate-45 rounded bg-white shadow-[0_0_0_4px_#ffd13d,0_5px_0_rgba(21,48,74,0.12)] landscape:left-[410px] landscape:top-[82px]" />
      <span className="absolute right-8 top-[388px] z-20 h-[13px] w-[13px] rotate-45 rounded bg-white shadow-[0_0_0_4px_#ffd13d,0_5px_0_rgba(21,48,74,0.12)] landscape:right-11 landscape:top-[102px]" />
      <span className="absolute right-[74px] top-[516px] z-20 h-[15px] w-[15px] rotate-45 rounded bg-white shadow-[0_0_0_4px_#ffd13d,0_5px_0_rgba(21,48,74,0.12)] landscape:right-[372px] landscape:top-48" />

      <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-[3%] z-30 grid w-[78vw] max-w-[305px] gap-2.5 landscape:bottom-[18px] landscape:left-[54px] landscape:w-[min(38vw,320px)] landscape:max-w-none">
        <PrimaryActionButton
          className="min-h-[62px] w-full gap-3 rounded-[1.55rem] border-[5px] border-white bg-gradient-to-b from-[#67dc58] to-[#35bf43] px-5 text-[1.45rem] shadow-[0_7px_0_rgba(21,48,74,0.2)] hover:from-[#72e266] hover:to-[#3cca4a]"
          data-testid="start-play-button"
          iconLeft={
            <CircleIcon tone="green">
              <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={3} />
            </CircleIcon>
          }
          onClick={onPlay}
        >
          Spelen
        </PrimaryActionButton>

        <PrimaryActionButton
          className="min-h-[52px] w-full gap-3 rounded-[1.45rem] border-[5px] border-white bg-gradient-to-b from-[#52b8ff] to-[#1679df] px-4 text-base shadow-[0_6px_0_rgba(21,48,74,0.2)] hover:from-[#60c0ff] hover:to-[#2389ec] landscape:text-[0.95rem]"
          data-testid="start-dashboard-button"
          iconLeft={
            <CircleIcon tone="blue">
              <Users className="h-5 w-5" strokeWidth={3} />
            </CircleIcon>
          }
          onClick={onOpenDashboard}
        >
          Ouders & Therapeuten
        </PrimaryActionButton>
      </div>
    </section>
  );
}
