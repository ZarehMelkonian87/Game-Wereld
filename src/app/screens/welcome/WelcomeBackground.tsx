import { FloatingSymbol } from "./FloatingSymbol";

export const WelcomeBackground = () => (
  <>
    <FloatingSymbol
      className="absolute top-10 left-4 sm:top-20 sm:left-10 text-4xl sm:text-6xl"
      duration={4}
      opacity={[0.3, 0.5, 0.3]}
      scale={[1, 1.2, 1]}
      symbol="⭐"
    />
    <FloatingSymbol
      className="absolute bottom-20 right-4 sm:bottom-32 sm:right-10 text-4xl sm:text-6xl"
      delay={1}
      duration={3}
      opacity={[0.3, 0.5, 0.3]}
      scale={[1, 1.3, 1]}
      symbol="✨"
    />
    <FloatingSymbol
      className="absolute top-1/2 right-8 sm:right-20 text-3xl sm:text-5xl"
      delay={0.5}
      duration={5}
      opacity={[0.2, 0.4, 0.2]}
      scale={[1, 1.2, 1]}
      symbol="🎯"
    />
  </>
);

WelcomeBackground.displayName = "WelcomeBackground";
