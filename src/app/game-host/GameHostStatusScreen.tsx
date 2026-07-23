import { GameButton, GamePanel } from "../game-platform";

interface GameHostStatusScreenProps {
  correlationId?: string;
  description: string;
  onBack: () => void;
  onRetry?: () => void;
  onUpdate?: () => void;
  title: string;
}

export const GameHostStatusScreen = ({
  correlationId,
  description,
  onBack,
  onRetry,
  onUpdate,
  title,
}: GameHostStatusScreenProps) => (
  <main className="flex min-h-screen items-center justify-center p-4">
    <GamePanel className="w-full max-w-lg space-y-4 text-center">
      <h1 className="text-2xl font-black text-white">{title}</h1>
      <p className="text-cyan-100">{description}</p>
      {correlationId ? (
        <p className="text-xs text-slate-300">Diagnosecode: {correlationId}</p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-3">
        {onRetry ? <GameButton onClick={onRetry}>Opnieuw proberen</GameButton> : null}
        {onUpdate ? <GameButton onClick={onUpdate}>App bijwerken</GameButton> : null}
        <GameButton onClick={onBack}>Terug naar spellen</GameButton>
      </div>
    </GamePanel>
  </main>
);

GameHostStatusScreen.displayName = "GameHostStatusScreen";
