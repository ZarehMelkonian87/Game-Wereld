import type { ReactNode } from "react";
import { ObjectTrayContainer } from "../../components/ui";

interface ObjectCarouselProps {
  children: ReactNode;
}

export const ObjectCarousel = ({ children }: ObjectCarouselProps) => (
  <div
    className="pointer-events-auto h-[clamp(4.75rem,11dvh,6rem)] min-h-0"
    data-component="ObjectCarousel"
  >
    <ObjectTrayContainer
      aria-label="Objectenbalk"
      className="h-full !rounded-[1.35rem] !border-white/55 !bg-white/38 !p-1.5"
      data-testid="scene-builder-tray-area"
    >
      {children}
    </ObjectTrayContainer>
  </div>
);

ObjectCarousel.displayName = "ObjectCarousel";
