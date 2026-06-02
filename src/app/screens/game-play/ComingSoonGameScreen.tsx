import { ArrowLeft } from "lucide-react";
import type { MiniGame } from "../../data/games";

interface ComingSoonGameScreenProps {
  game?: MiniGame;
  onBack: () => void;
}

export const ComingSoonGameScreen = ({ game, onBack }: ComingSoonGameScreenProps) => (
  <main
    className="min-h-screen safe-area-inset bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 px-4 py-5 text-white"
    data-component="ComingSoonGameScreen"
  >
    <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-md flex-col">
      <button
        aria-label="Terug"
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-white/20 bg-white/10 active:bg-white/20"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <section className="mt-auto mb-auto rounded-lg border-4 border-cyan-400/30 bg-slate-800 p-5 text-center shadow-2xl">
        <div className="text-6xl">{game?.icon ?? "🎮"}</div>
        <h1 className="mt-4 text-2xl font-black">{game?.name ?? "Game"}</h1>
        <p className="mt-2 text-sm font-semibold text-cyan-200">
          Deze game krijgt later een eigen speelwereld.
        </p>
      </section>
    </div>
  </main>
);

ComingSoonGameScreen.displayName = "ComingSoonGameScreen";
