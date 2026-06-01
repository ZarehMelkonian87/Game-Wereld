import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "../../utils/classNames";
import { GamePanel } from "../primitives";

export interface ObjectTrayProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const ObjectTray = ({ children, className, ...trayProps }: ObjectTrayProps) => (
  <GamePanel
    {...trayProps}
    className={classNames(
      "flex h-full min-h-0 w-full items-center justify-center overflow-hidden !border-white/55 !bg-white/45 !p-2 !shadow-[0_4px_0_rgba(15,23,42,0.08)]",
      className,
    )}
    data-component="ObjectTray"
    variant="transparent"
  >
    <div
      className={classNames(
        "pointer-events-auto flex h-full w-full min-w-0 max-w-full items-center gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain px-0.5 [scrollbar-width:thin]",
        children ? "justify-start" : "justify-center",
      )}
      data-slot="scroll-area"
      data-testid="object-tray-container"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {children}
    </div>
  </GamePanel>
);

ObjectTray.displayName = "ObjectTray";

