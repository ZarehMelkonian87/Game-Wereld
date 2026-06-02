import { motion } from "motion/react";
import { GradientTitle } from "../shared";

export const ProfileSelectHeader = () => (
  <div className="text-center mb-6 mt-4 sm:mt-8" data-component="ProfileSelectHeader">
    <motion.div
      animate={{ scale: 1 }}
      initial={{ scale: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <GradientTitle className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 px-2">
        KIES JE SPELER
      </GradientTitle>
    </motion.div>
    <p className="text-base sm:text-lg md:text-xl text-cyan-300 font-semibold px-2">
      Wie gaat er winnen?
    </p>
  </div>
);

ProfileSelectHeader.displayName = "ProfileSelectHeader";
