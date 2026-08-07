import type { DevtoolsComponent } from "./devtools";

interface AdventureSectionTitleProps {
  children: string;
}

export const AdventureSectionTitle: DevtoolsComponent<AdventureSectionTitleProps> = ({
  children,
}: AdventureSectionTitleProps) => (
  <h2
    className="px-1 text-[0.9rem] font-black leading-none text-slate-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]"
    data-component="AdventureSectionTitle"
  >
    {children}
  </h2>
);

AdventureSectionTitle.displayName = "AdventureSectionTitle";
