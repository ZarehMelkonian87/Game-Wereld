import { useRef } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { GamePanel } from "./game-platform";

export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const correlationIdRef = useRef(crypto.randomUUID());
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Er ging iets onverwachts mis.";

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <GamePanel className="w-full max-w-lg space-y-4 text-center">
        <h1 className="text-2xl font-black text-white">Deze pagina liep vast</h1>
        <p className="text-cyan-100">{message}</p>
        <p className="text-xs text-slate-300">Diagnosecode: {correlationIdRef.current}</p>
        <a
          className="inline-flex min-h-12 items-center rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950"
          href="/home"
        >
          Veilig terug naar home
        </a>
      </GamePanel>
    </main>
  );
};

RouteErrorBoundary.displayName = "RouteErrorBoundary";
