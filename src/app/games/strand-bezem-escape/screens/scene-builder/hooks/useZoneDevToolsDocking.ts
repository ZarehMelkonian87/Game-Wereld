import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { clamp, type PanelDragState, type PanelPosition } from "../logic/zone-devtools-utils";

export const useZoneDevToolsDocking = ({
  panelRef,
  rootRef,
}: {
  panelRef: RefObject<HTMLElement | null>;
  rootRef: RefObject<HTMLDivElement | null>;
}) => {
  const dragStateRef = useRef<PanelDragState | null>(null);
  const [panelPosition, setPanelPosition] = useState<PanelPosition>({ x: 12, y: 72 });
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const dragState = dragStateRef.current;
      const rootBounds = rootRef.current?.getBoundingClientRect();
      const panelBounds = panelRef.current?.getBoundingClientRect();

      if (!dragState || !rootBounds || !panelBounds) {
        return;
      }

      const maxX = Math.max(6, rootBounds.width - panelBounds.width - 6);
      const maxY = Math.max(6, rootBounds.height - panelBounds.height - 6);

      setPanelPosition({
        x: clamp(event.clientX - rootBounds.left - dragState.offsetX, 6, maxX),
        y: clamp(event.clientY - rootBounds.top - dragState.offsetY, 6, maxY),
      });
    }

    function handlePointerUp() {
      dragStateRef.current = null;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [panelRef, rootRef]);

  const dockPanel = (corner: "top-left" | "top-right" | "bottom-left" | "bottom-right") => {
    const rootBounds = rootRef.current?.getBoundingClientRect();
    const panelBounds = panelRef.current?.getBoundingClientRect();
    const width = panelBounds?.width ?? 240;
    const height = panelBounds?.height ?? 220;
    const rootW = rootBounds?.width ?? (typeof window !== "undefined" ? window.innerWidth : 360);
    const rootH = rootBounds?.height ?? (typeof window !== "undefined" ? window.innerHeight : 640);

    const margin = 12;

    switch (corner) {
      case "top-left":
        setPanelPosition({ x: margin, y: margin });
        break;
      case "top-right":
        setPanelPosition({ x: Math.max(margin, rootW - width - margin), y: margin });
        break;
      case "bottom-left":
        setPanelPosition({ x: margin, y: Math.max(margin, rootH - height - margin) });
        break;
      case "bottom-right":
        setPanelPosition({
          x: Math.max(margin, rootW - width - margin),
          y: Math.max(margin, rootH - height - margin),
        });
        break;
    }
  };

  const startPanelDrag = (clientX: number, clientY: number) => {
    const panelBounds = panelRef.current?.getBoundingClientRect();

    if (!panelBounds) {
      return;
    }

    dragStateRef.current = {
      offsetX: clientX - panelBounds.left,
      offsetY: clientY - panelBounds.top,
    };
  };

  return {
    dockPanel,
    isCollapsed,
    panelPosition,
    setIsCollapsed,
    startPanelDrag,
  };
};
