import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { TimePeriod } from "./progressTypes";

interface ActivityChartCardProps {
  selectedPeriod: TimePeriod;
  delay: number;
}

export const ActivityChartCard = ({ selectedPeriod, delay }: ActivityChartCardProps) => {
  const getData = () => {
    switch (selectedPeriod) {
      case "week":
        return [
          { name: "Ma", minuten: 15 },
          { name: "Di", minuten: 25 },
          { name: "Wo", minuten: 20 },
          { name: "Do", minuten: 45 },
          { name: "Vr", minuten: 10 },
          { name: "Za", minuten: 35 },
          { name: "Zo", minuten: 30 },
        ];
      case "month":
        return [
          { name: "Week 1", minuten: 120 },
          { name: "Week 2", minuten: 160 },
          { name: "Week 3", minuten: 95 },
          { name: "Week 4", minuten: 140 },
        ];
      case "3months":
        return [
          { name: "Mei", minuten: 480 },
          { name: "Jun", minuten: 620 },
          { name: "Jul", minuten: 540 },
        ];
      case "alltime":
      default:
        return [
          { name: "Kwart 1", minuten: 1200 },
          { name: "Kwart 2", minuten: 1800 },
          { name: "Kwart 3", minuten: 1500 },
          { name: "Kwart 4", minuten: 2200 },
        ];
    }
  };

  const data = getData();
  const totalMinuten = data.reduce((sum, item) => sum + item.minuten, 0);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="game-card-3d bg-gradient-to-br from-slate-800 to-slate-900 border-3 sm:border-4 border-slate-700 p-5 rounded-2xl text-white relative overflow-hidden"
      data-component="ActivityChartCard"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay }}
    >
      <h3 className="text-xl sm:text-2xl font-black mb-1">⚡ SPEELTIJD ACTIVITEIT</h3>
      <p className="text-sm text-cyan-300 font-semibold mb-4">
        Totaal gespeeld: <span className="text-white font-black">{totalMinuten} minuten</span>
      </p>

      <div className="h-48 sm:h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#1f2937",
                border: "2px solid #06b6d4",
                borderRadius: "10px",
              }}
              labelStyle={{ color: "#22d3ee", fontWeight: "bold" }}
            />
            <Bar dataKey="minuten" fill="url(#colorMinuten)" radius={[6, 6, 0, 0]}>
              <defs>
                <linearGradient id="colorMinuten" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7b68ee" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

ActivityChartCard.displayName = "ActivityChartCard";
