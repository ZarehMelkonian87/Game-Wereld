import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "./classNames";
import { PanelCard } from "./PanelCard";

interface ObjectTrayContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function ObjectTrayContainer({
  children,
  className,
  ...trayProps
}: ObjectTrayContainerProps) {
  return (
    <PanelCard
      {...trayProps}
      className={classNames(
        "flex h-full min-h-0 w-full items-center justify-center overflow-hidden !p-2",
        className,
      )}
    >
      <div
        data-testid="object-tray-container"
        className={classNames(
          "pointer-events-auto flex h-full w-full min-w-0 max-w-full items-center gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain px-0.5 [scrollbar-width:thin]",
          children ? "justify-start" : "justify-center",
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
    </PanelCard>
  );
}
