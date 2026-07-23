import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "../../utils/classNames";

export interface GameSafeAreaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const GameSafeArea = ({
  children,
  className,
  style,
  ...safeAreaProps
}: GameSafeAreaProps) => (
  <div
    {...safeAreaProps}
    className={classNames("pointer-events-none absolute inset-0", className)}
    data-component="GameSafeArea"
    style={{
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingLeft: "env(safe-area-inset-left)",
      paddingRight: "env(safe-area-inset-right)",
      paddingTop: "env(safe-area-inset-top)",
      ...style,
    }}
  >
    {children}
  </div>
);

GameSafeArea.displayName = "GameSafeArea";
