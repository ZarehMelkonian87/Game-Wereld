import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import type { PeriodDefinition, TimePeriod } from "./progressTypes";

interface PeriodSelectorProps {
  onSelectPeriod: (period: TimePeriod) => void;
  periods: PeriodDefinition[];
  selectedPeriod: TimePeriod;
}

export const PeriodSelector = ({
  onSelectPeriod,
  periods,
  selectedPeriod,
}: PeriodSelectorProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="mb-5 sm:mb-6"
    data-component="PeriodSelector"
    initial={{ opacity: 0, y: -10 }}
  >
    <div className="flex items-center gap-2 mb-3">
      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
      <h3 className="text-lg sm:text-xl text-white font-black">Periode</h3>
    </div>
    <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-slate-800/50 p-2 sm:p-3 rounded-xl border-2 border-slate-600">
      {periods.map((period) => (
        <motion.button
          className={`p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm md:text-base transition-all ${
            selectedPeriod === period.id
              ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-2 border-cyan-300/50 shadow-lg"
              : "bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:bg-slate-700"
          }`}
          key={period.id}
          onClick={() => onSelectPeriod(period.id)}
          type="button"
          whileTap={{ scale: 0.95 }}
        >
          <span className="hidden sm:inline">{period.label}</span>
          <span className="sm:hidden">{period.shortLabel}</span>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

PeriodSelector.displayName = "PeriodSelector";
