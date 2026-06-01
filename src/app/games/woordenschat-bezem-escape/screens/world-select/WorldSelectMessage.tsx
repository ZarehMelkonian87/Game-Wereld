import type { DevtoolsComponent } from "./devtools";

interface WorldSelectMessageProps {
  message: string;
}

export const WorldSelectMessage: DevtoolsComponent<WorldSelectMessageProps> = ({ message }) => (
  <div
    className="absolute bottom-[5.45rem] left-4 right-4 z-40 rounded-2xl border-[3px] border-white bg-white/95 px-3 py-2 text-center text-sm font-black text-slate-800 shadow-[0_4px_0_rgba(21,48,74,0.16)] landscape:bottom-24 landscape:left-auto landscape:right-7 landscape:w-64"
    data-component="WorldSelectMessage"
    data-testid="world-select-message"
  >
    {message}
  </div>
);

WorldSelectMessage.displayName = "WorldSelectMessage";
