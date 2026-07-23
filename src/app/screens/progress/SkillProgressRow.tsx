import { motion } from "motion/react";
import { getChangeColor, getChangeIcon, getChangeText, getProgressColor } from "./progressHelpers";
import type { SkillProgress } from "./progressTypes";

interface SkillProgressRowProps {
  animationDelay: number;
  skill: SkillProgress;
}

export const SkillProgressRow = ({ animationDelay, skill }: SkillProgressRowProps) => (
  <div className="space-y-2" data-component="SkillProgressRow">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-sm sm:text-base text-white font-bold truncate">{skill.name}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {skill.change !== undefined && skill.change !== 0 ? (
          <div className="flex items-center gap-1">
            {getChangeIcon(skill.change)}
            <span className={`text-xs sm:text-sm font-black ${getChangeColor(skill.change)}`}>
              {getChangeText(skill.change)}
            </span>
          </div>
        ) : null}
        <span className="text-sm sm:text-base text-cyan-300 font-black whitespace-nowrap">
          {skill.percentage}%
        </span>
      </div>
    </div>
    <div className="w-full bg-slate-900/50 rounded-full h-3 sm:h-4 overflow-hidden border-2 border-slate-600 relative">
      {skill.previousPercentage !== undefined ? (
        <div
          className="absolute inset-0 bg-slate-600/30"
          style={{ width: `${skill.previousPercentage}%` }}
        />
      ) : null}
      <motion.div
        animate={{ width: `${skill.percentage}%` }}
        className={`h-full bg-gradient-to-r ${getProgressColor(skill.percentage)} shadow-lg relative z-10`}
        initial={{ width: skill.previousPercentage ? `${skill.previousPercentage}%` : 0 }}
        transition={{ delay: animationDelay, duration: 1.2 }}
      />
    </div>
  </div>
);

SkillProgressRow.displayName = "SkillProgressRow";
