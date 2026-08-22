import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import type { ReactNode } from "react";
import { GameHostStatusScreen } from "./GameHostStatusScreen";

interface GameRuntimeBoundaryProps {
  children: ReactNode;
  correlationId: string;
  onBack: () => void;
  onCrash: (error: Error) => void;
  onRetry: () => void;
}

export const GameRuntimeBoundary = ({
  children,
  correlationId,
  onBack,
  onCrash,
  onRetry,
}: GameRuntimeBoundaryProps) => {
  const RuntimeFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
    <GameHostStatusScreen
      correlationId={correlationId}
      description={error instanceof Error ? error.message : "Onverwachte gamefout."}
      onBack={onBack}
      onRetry={resetErrorBoundary}
      title="De game is gestopt"
    />
  );

  return (
    <ErrorBoundary
      FallbackComponent={RuntimeFallback}
      onError={(error) =>
        onCrash(error instanceof Error ? error : new Error("Onverwachte gamefout."))
      }
      onReset={onRetry}
    >
      {children}
    </ErrorBoundary>
  );
};

GameRuntimeBoundary.displayName = "GameRuntimeBoundary";
