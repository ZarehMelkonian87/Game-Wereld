import { motion } from "motion/react";
import { Award } from "lucide-react";

interface OverallSummaryCardProps {
  childName: string;
  delay: number;
  eventCount: number;
}

export const OverallSummaryCard = ({ childName, delay, eventCount }: OverallSummaryCardProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="game-card-3d bg-gradient-to-br from-purple-600 to-pink-600 border-3 sm:border-4 border-purple-400 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center"
    data-component="OverallSummaryCard"
    initial={{ opacity: 0, y: 20 }}
    transition={{ delay }}
  >
    <Award className="w-16 h-16 sm:w-20 sm:h-20 text-white mx-auto mb-3 sm:mb-4" />
    <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-black mb-2">
      {eventCount > 0 ? "Oefeningen opgeslagen" : "Klaar om te oefenen"}
    </h2>
    <p className="text-base sm:text-lg text-white/90 font-semibold">
      {eventCount > 0
        ? `${childName} heeft ${eventCount} oefenpogingen in het overzicht.`
        : `Voor ${childName} zijn nog geen oefenpogingen geregistreerd in deze periode.`}
    </p>
  </motion.div>
);

OverallSummaryCard.displayName = "OverallSummaryCard";
