import { useRef, useState } from "react";
import { GameButton, GamePanel, GameProgressBar, GameShell } from "../../game-platform/components";
import type { GameRuntime } from "../../game-platform/contracts";
import { countingRounds, isCorrectCountingAnswer } from "./domain/counting-rounds";

type GamePhase = "start" | "playing" | "complete";

const CountingGame = ({ runtime }: { runtime: GameRuntime }) => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [error, setError] = useState<string>();
  const [feedback, setFeedback] = useState<string>();
  const [phase, setPhase] = useState<GamePhase>("start");
  const [roundIndex, setRoundIndex] = useState(0);
  const [startedAt, setStartedAt] = useState(() => runtime.clock.now());
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const round = countingRounds[roundIndex];

  const start = () => {
    setCorrectAnswers(0);
    setError(undefined);
    setFeedback(undefined);
    setRoundIndex(0);
    setStartedAt(runtime.clock.now());
    setPhase("playing");
  };

  const answer = async (selected: number) => {
    if (!round || submittingRef.current || feedback) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError(undefined);
    const correct = isCorrectCountingAnswer(round, selected);
    const result = await runtime.practice.append({
      assistance: [],
      attemptNumber: 1,
      outcome: correct ? "correct" : "incorrect",
      responseTimeMs: Math.max(0, runtime.clock.now().getTime() - startedAt.getTime()),
      skillIds: [...round.skillIds],
      taskId: round.taskId,
    });
    submittingRef.current = false;
    setSubmitting(false);
    if (!result.ok) {
      runtime.diagnostics.log({
        context: {
          errorCode: result.error.code,
          gameId: runtime.identity.gameId,
          operation: "append-counting-observation",
          recovery: "retry-answer",
        },
        event: "practice-write-failed",
        severity: "error",
        subsystem: "counting-game",
      });
      setError("Je antwoord kon niet worden bewaard. Probeer het nog een keer.");
      return;
    }
    if (correct) setCorrectAnswers((current) => current + 1);
    setFeedback(correct ? "Goed geteld!" : `Bijna! Er liggen ${round.amount} schelpen.`);
  };

  const next = () => {
    const nextRoundIndex = roundIndex + 1;
    setFeedback(undefined);
    setStartedAt(runtime.clock.now());
    if (nextRoundIndex >= countingRounds.length) {
      setPhase("complete");
      return;
    }
    setRoundIndex(nextRoundIndex);
  };

  const finish = () => {
    runtime.lifecycle.complete({
      correctActions: correctAnswers,
      score: correctAnswers * 100,
      stars: correctAnswers,
    });
  };

  if (phase === "start") {
    return (
      <GameShell
        gameId={runtime.identity.gameId}
        label="Schelpen Tellen"
        stageName="start"
        testId="start-screen"
      >
        <div className="grid h-full place-items-center bg-gradient-to-b from-sky-300 to-amber-100 p-4">
          <GamePanel className="max-w-lg space-y-5 p-6 text-center">
            <div aria-hidden="true" className="text-7xl">
              🐚
            </div>
            <h1 className="text-3xl font-black">Schelpen Tellen</h1>
            <p className="text-lg">Tel de schelpen en kies steeds het goede cijfer.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <GameButton onClick={start} size="large">
                Start met tellen
              </GameButton>
              <GameButton
                onClick={() => runtime.lifecycle.exit("back")}
                size="large"
                tone="neutral"
              >
                Terug
              </GameButton>
            </div>
          </GamePanel>
        </div>
      </GameShell>
    );
  }

  if (phase === "complete") {
    return (
      <GameShell gameId={runtime.identity.gameId} label="Schelpen Tellen" stageName="result">
        <div className="grid h-full place-items-center bg-gradient-to-b from-sky-300 to-amber-100 p-4">
          <GamePanel className="max-w-lg space-y-5 p-6 text-center">
            <h1 className="text-3xl font-black">Klaar!</h1>
            <p className="text-xl" role="status">
              Je telde {correctAnswers} van de {countingRounds.length} hoeveelheden goed.
            </p>
            <GameButton onClick={finish} size="large">
              Terug naar de spellen
            </GameButton>
          </GamePanel>
        </div>
      </GameShell>
    );
  }

  if (!round) return null;

  return (
    <GameShell
      gameId={runtime.identity.gameId}
      instructionCount={countingRounds.length}
      label="Schelpen Tellen"
      objectCount={round.amount}
      stageName="counting"
    >
      <div className="flex h-full flex-col gap-4 overflow-auto bg-gradient-to-b from-sky-300 to-amber-100 p-4">
        <header className="mx-auto flex w-full max-w-2xl items-center gap-3">
          <GameButton onClick={() => runtime.lifecycle.exit("back")} tone="neutral">
            Terug
          </GameButton>
          <GameProgressBar label="Opdrachten" max={countingRounds.length} value={roundIndex + 1} />
        </header>
        <GamePanel className="mx-auto grid w-full max-w-2xl flex-1 place-items-center gap-5 p-6 text-center">
          <div>
            <h1 className="text-2xl font-black">Hoeveel schelpen liggen hier?</h1>
            <p className="mt-2 text-base">Tel ze één voor één en kies daarna een cijfer.</p>
          </div>
          <div
            aria-label={`Er liggen ${round.amount} schelpen.`}
            className="flex min-h-24 flex-wrap items-center justify-center gap-3 text-6xl"
            role="img"
          >
            {Array.from({ length: round.amount }, (_, index) => (
              <span aria-hidden="true" key={index}>
                🐚
              </span>
            ))}
          </div>
          <div
            aria-label="Kies het aantal"
            className="flex flex-wrap justify-center gap-3"
            role="group"
          >
            {round.choices.map((choice) => (
              <GameButton
                aria-label={`${choice} schelpen`}
                disabled={submitting || Boolean(feedback)}
                key={choice}
                onClick={() => void answer(choice)}
                size="large"
                tone="blue"
              >
                {choice}
              </GameButton>
            ))}
          </div>
          {error ? (
            <p className="font-bold text-rose-700" role="alert">
              {error}
            </p>
          ) : null}
          {feedback ? (
            <div className="space-y-3" role="status">
              <p className="text-xl font-black">{feedback}</p>
              <GameButton onClick={next}>Volgende opdracht</GameButton>
            </div>
          ) : null}
        </GamePanel>
      </div>
    </GameShell>
  );
};

CountingGame.displayName = "CountingGame";

export const Game = ({ runtime }: { runtime: GameRuntime }) => <CountingGame runtime={runtime} />;

Game.displayName = "RekenenStrandGame";
