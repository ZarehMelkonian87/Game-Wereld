import { motion } from "motion/react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PracticeEventEnvelope } from "../../storage";
import { filterEventsForPeriod } from "./progressData";
import type { TimePeriod } from "./progressTypes";

interface ActivityChartCardProps {
  delay: number;
  events: PracticeEventEnvelope[];
  selectedPeriod: TimePeriod;
}

const groupEventsByDay = (events: PracticeEventEnvelope[]) => {
  const counts = new Map<string, number>();
  events.forEach((event) => {
    const day = event.occurredAt.slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  });
  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-8)
    .map(([day, pogingen]) => ({ name: day.slice(5), pogingen }));
};

export const ActivityChartCard = ({ delay, events, selectedPeriod }: ActivityChartCardProps) => {
  const selectedEvents = filterEventsForPeriod(selectedPeriod, events);
  const data = groupEventsByDay(selectedEvents);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="game-card-3d relative overflow-hidden rounded-2xl border-3 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white sm:border-4"
      data-component="ActivityChartCard"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay }}
    >
      <h3 className="mb-1 text-xl font-black sm:text-2xl">⚡ OEFENACTIVITEIT</h3>
      <p className="mb-4 text-sm font-semibold text-cyan-300">
        Geregistreerd:{" "}
        <span className="font-black text-white">{selectedEvents.length} oefenpogingen</span>
      </p>

      {data.length === 0 ? (
        <p className="text-slate-300">Nog geen activiteit in deze periode.</p>
      ) : (
        <div className="h-48 w-full sm:h-56">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={data} margin={{ bottom: 0, left: -25, right: 10, top: 10 }}>
              <XAxis
                axisLine={false}
                dataKey="name"
                fontSize={12}
                stroke="#9ca3af"
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                fontSize={12}
                stroke="#9ca3af"
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1f2937",
                  border: "2px solid #06b6d4",
                  borderRadius: "10px",
                }}
                labelStyle={{ color: "#22d3ee", fontWeight: "bold" }}
              />
              <Bar dataKey="pogingen" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

ActivityChartCard.displayName = "ActivityChartCard";
