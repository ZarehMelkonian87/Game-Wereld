import { motion } from "motion/react";
import { Mic } from "lucide-react";

interface MicrophoneDiagnosisLinkCardProps {
  onOpenDiagnosis: () => void;
}

/**
 * Ingang naar de microfoon-diagnose (T-52). Zit in Instellingen omdat een
 * geïnstalleerde app geen adresbalk heeft om de route zelf in te typen.
 */
export const MicrophoneDiagnosisLinkCard = ({
  onOpenDiagnosis,
}: MicrophoneDiagnosisLinkCardProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="mb-5 sm:mb-6 md:mb-8"
    data-component="MicrophoneDiagnosisLinkCard"
    initial={{ opacity: 0, y: 20 }}
    transition={{ delay: 0.15 }}
  >
    <motion.button
      className="w-full game-card-3d bg-gradient-to-br from-cyan-700 to-sky-800 border-3 sm:border-4 border-cyan-400 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-4"
      data-testid="settings-open-microphone-diagnosis"
      onClick={onOpenDiagnosis}
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white flex-shrink-0" />
      <div className="flex-1 text-left">
        <h3 className="text-lg sm:text-xl text-white font-black mb-0.5">Microfoon-diagnose</h3>
        <p className="text-sm sm:text-base text-white/90 font-semibold">
          Werkt de microfoon niet? Doorloop de test en kopieer het rapport.
        </p>
      </div>
    </motion.button>
  </motion.div>
);

MicrophoneDiagnosisLinkCard.displayName = "MicrophoneDiagnosisLinkCard";
