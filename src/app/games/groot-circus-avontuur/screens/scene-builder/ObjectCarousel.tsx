import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { ObjectTrayContainer } from "../../components/ui";

interface ObjectCarouselProps {
  children: ReactNode;
}

export const ObjectCarousel = ({ children }: ObjectCarouselProps) => (
  <div
    className="pointer-events-auto relative h-[clamp(4.75rem,11dvh,6rem)] min-h-0"
    data-component="ObjectCarousel"
  >
    <ObjectTrayContainer
      aria-label="Objectenbalk"
      className="h-full !rounded-[1.35rem] !border-white/55 !bg-white/38 !p-1.5"
      data-testid="scene-builder-tray-area"
    >
      {children}
    </ObjectTrayContainer>
    {/* Fade-rand + chevron als scroll-hint (UX-301): laat zien dat er meer
        objecten naar rechts staan. Puur visueel, blokkeert geen tik. */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-1.5 right-1.5 flex w-9 items-center justify-end rounded-r-[1.35rem] bg-gradient-to-l from-white/85 via-white/45 to-transparent pr-1 text-slate-500"
      data-slot="scroll-hint"
    >
      <ChevronRight className="h-5 w-5" strokeWidth={3} />
    </span>
  </div>
);

ObjectCarousel.displayName = "ObjectCarousel";
