import { GamePanel, GameShell } from "../../game-platform";
import { gameTemplateConfig } from "./game.config";

export const GameTemplate = () => (
  <GameShell
    gameId={gameTemplateConfig.id}
    label={gameTemplateConfig.title}
    stageName="Nieuwe game"
    worldId={gameTemplateConfig.defaultWorldId}
  >
    <div className="grid h-full place-items-center p-4">
      <GamePanel>
        <h1 className="text-xl font-black text-slate-900">{gameTemplateConfig.title}</h1>
        <p className="mt-2 text-sm font-bold text-slate-700">Nieuwe mini-game volgens de standaard architectuur.</p>
      </GamePanel>
    </div>
  </GameShell>
);

GameTemplate.displayName = "GameTemplate";

