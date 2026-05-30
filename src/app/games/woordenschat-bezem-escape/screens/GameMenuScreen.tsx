import { BarChart3, Gift, LockKeyhole, Play, Settings, Waves } from "lucide-react";
import type { ReactNode } from "react";
import { broomIconUrls, mascotIconUrls } from "../asset-urls";
import { PanelCard, PrimaryActionButton, RibbonTitle } from "../components/ui";
import { classNames } from "../components/ui/classNames";

interface GameMenuScreenProps {
  raceUnlocked: boolean;
  onOpenDashboard: () => void;
  onOpenRewards: () => void;
  onOpenSettings: () => void;
  onStartRace: () => void;
  onStartSceneBuilder: () => void;
  onStartWordChoice: () => void;
}

function MenuButton({
  children,
  disabled,
  icon,
  onClick,
  testId,
}: {
  children: string;
  disabled?: boolean;
  icon: ReactNode;
  onClick: () => void;
  testId: string;
}) {
  return (
    <PrimaryActionButton
      className={classNames(
        "w-full justify-start px-3 text-sm",
        disabled && "border-slate-300 bg-slate-300 text-slate-700 shadow-[0_4px_0_rgba(71,85,105,0.45)]",
      )}
      data-testid={testId}
      disabled={disabled}
      iconLeft={icon}
      onClick={onClick}
    >
      {children}
    </PrimaryActionButton>
  );
}

export function GameMenuScreen({
  raceUnlocked,
  onOpenDashboard,
  onOpenRewards,
  onOpenSettings,
  onStartRace,
  onStartSceneBuilder,
  onStartWordChoice,
}: GameMenuScreenProps) {
  return (
    <div
      data-testid="game-menu-screen"
      data-race-unlocked={raceUnlocked ? "true" : "false"}
      className="pointer-events-auto absolute inset-0 z-10 overflow-y-auto px-3 pb-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]"
    >
      <div className="mx-auto flex min-h-full max-w-md flex-col gap-3 landscape:max-w-3xl">
        <div className="text-center">
          <RibbonTitle data-testid="game-menu-title">Bezem Escape</RibbonTitle>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 landscape:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <PanelCard
            aria-label="Strandwereld"
            data-testid="world-selection-card"
            className="flex min-h-0 flex-col items-center justify-center gap-3 !rounded-2xl !p-4"
          >
            <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border-2 border-sky-300 bg-sky-100/90 shadow-[0_5px_0_rgba(14,116,144,0.18)]">
              <Waves className="h-16 w-16 text-sky-600" strokeWidth={2.8} />
              <img
                alt=""
                className="absolute -right-5 -top-5 h-16 w-16 object-contain"
                draggable={false}
                src={mascotIconUrls.neutral}
              />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-black leading-tight text-slate-900">Strandwereld</h2>
              <p className="mt-1 text-xs font-black leading-tight text-slate-700">
                Luister, plaats, kies woorden en race.
              </p>
            </div>
          </PanelCard>

          <PanelCard
            aria-label="Spelkeuze"
            data-testid="mode-selection-card"
            className="grid min-h-0 content-center gap-2 !rounded-2xl !p-3"
          >
            <MenuButton
              icon={<Play className="h-5 w-5" strokeWidth={3} />}
              onClick={onStartSceneBuilder}
              testId="menu-scene-builder-button"
            >
              Luister & Plaats
            </MenuButton>
            <MenuButton
              icon={<Play className="h-5 w-5" strokeWidth={3} />}
              onClick={onStartWordChoice}
              testId="menu-word-choice-button"
            >
              Kies het Woord
            </MenuButton>
            <MenuButton
              disabled={!raceUnlocked}
              icon={
                raceUnlocked ? (
                  <img alt="" className="h-5 w-5 object-contain" draggable={false} src={broomIconUrls.basic} />
                ) : (
                  <LockKeyhole className="h-5 w-5" strokeWidth={3} />
                )
              }
              onClick={onStartRace}
              testId="menu-race-button"
            >
              Race
            </MenuButton>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                aria-label="Beloningen"
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-amber-300 bg-amber-100 px-1 text-[0.68rem] font-black leading-none text-amber-950 shadow-[0_3px_0_rgba(180,83,9,0.25)] active:translate-y-0.5"
                data-testid="menu-rewards-button"
                onClick={onOpenRewards}
                type="button"
              >
                <Gift className="h-5 w-5" strokeWidth={3} />
                Beloning
              </button>
              <button
                aria-label="Dashboard"
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-sky-300 bg-sky-100 px-1 text-[0.68rem] font-black leading-none text-sky-950 shadow-[0_3px_0_rgba(14,116,144,0.25)] active:translate-y-0.5"
                data-testid="menu-dashboard-button"
                onClick={onOpenDashboard}
                type="button"
              >
                <BarChart3 className="h-5 w-5" strokeWidth={3} />
                Groei
              </button>
              <button
                aria-label="Instellingen"
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-slate-300 bg-white px-1 text-[0.68rem] font-black leading-none text-slate-900 shadow-[0_3px_0_rgba(71,85,105,0.22)] active:translate-y-0.5"
                data-testid="menu-settings-button"
                onClick={onOpenSettings}
                type="button"
              >
                <Settings className="h-5 w-5" strokeWidth={3} />
                Opties
              </button>
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}
