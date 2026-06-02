import { formatList } from "./rewardDisplay";

interface ChipListProps {
  emptyLabel: string;
  items: string[];
  testId: string;
}

export const ChipList = ({ emptyLabel, items, testId }: ChipListProps) => (
  <div className="min-w-0" data-component="ChipList">
    <div className="mt-1.5 flex flex-wrap gap-1.5" data-testid={testId}>
      {formatList(items, emptyLabel)
        .slice(0, 8)
        .map((item) => (
          <span
            className="inline-flex min-h-7 items-center rounded-2xl border-2 border-white/80 bg-white/78 px-2.5 text-[0.72rem] font-black leading-none text-slate-900"
            key={item}
          >
            {item}
          </span>
        ))}
    </div>
  </div>
);

ChipList.displayName = "ChipList";
