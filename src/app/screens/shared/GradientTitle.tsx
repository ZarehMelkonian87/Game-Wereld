import type { ReactNode } from "react";

interface GradientTitleProps {
  children: ReactNode;
  className?: string;
}

export const GradientTitle = ({ children, className = "" }: GradientTitleProps) => (
  <h1
    className={`bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-black ${className}`}
    data-component="GradientTitle"
  >
    {children}
  </h1>
);

GradientTitle.displayName = "GradientTitle";
