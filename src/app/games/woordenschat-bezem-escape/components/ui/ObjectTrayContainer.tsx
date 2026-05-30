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
        "flex h-full min-h-0 items-center justify-center overflow-hidden !p-2",
        className,
      )}
    >
      <div
        data-testid="object-tray-container"
        className="flex h-full min-w-0 items-center justify-center gap-2 overflow-hidden"
      >
        {children}
      </div>
    </PanelCard>
  );
}
