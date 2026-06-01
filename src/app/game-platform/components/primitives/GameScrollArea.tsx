import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "../../utils/classNames";

export interface GameScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  direction?: "both" | "horizontal" | "vertical";
}

const directionClasses: Record<NonNullable<GameScrollAreaProps["direction"]>, string> = {
  both: "overflow-auto overscroll-contain",
  horizontal: "overflow-x-auto overflow-y-hidden overscroll-x-contain",
  vertical: "overflow-x-hidden overflow-y-auto overscroll-y-contain",
};

export const GameScrollArea = ({
  children,
  className,
  direction = "vertical",
  style,
  ...scrollProps
}: GameScrollAreaProps) => (
  <div
    {...scrollProps}
    className={classNames(directionClasses[direction], "[scrollbar-width:thin]", className)}
    data-component="GameScrollArea"
    data-direction={direction}
    style={{ WebkitOverflowScrolling: "touch", ...style }}
  >
    {children}
  </div>
);

GameScrollArea.displayName = "GameScrollArea";

