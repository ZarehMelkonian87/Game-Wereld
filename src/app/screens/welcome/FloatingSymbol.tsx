import { motion } from "motion/react";

interface FloatingSymbolProps {
  className: string;
  delay?: number;
  duration: number;
  opacity: [number, number, number];
  scale: [number, number, number];
  symbol: string;
}

export const FloatingSymbol = ({
  className,
  delay = 0,
  duration,
  opacity,
  scale,
  symbol,
}: FloatingSymbolProps) => (
  <motion.div
    animate={{ opacity, scale }}
    className={className}
    data-component="FloatingSymbol"
    transition={{ delay, duration, repeat: Infinity }}
  >
    {symbol}
  </motion.div>
);

FloatingSymbol.displayName = "FloatingSymbol";
