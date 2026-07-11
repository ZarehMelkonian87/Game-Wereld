import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";

interface DeleteProfileCardProps {
  onCancel: () => void;
  onConfirmDelete: () => void;
  onRequestDelete: () => void;
  showConfirm: boolean;
}

export const DeleteProfileCard = ({
  onCancel,
  onConfirmDelete,
  onRequestDelete,
  showConfirm,
}: DeleteProfileCardProps) => {
  const [numA, setNumA] = useState(0);
  const [numB, setNumB] = useState(0);
  const [answerInput, setAnswerInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (showConfirm) {
      const a = Math.floor(Math.random() * 8) + 5; // 5 to 12
      const b = Math.floor(Math.random() * 8) + 5; // 5 to 12
      setNumA(a);
      setNumB(b);
      setAnswerInput("");
      setIsCorrect(false);
    }
  }, [showConfirm]);

  const handleInputChange = (val: string) => {
    setAnswerInput(val);
    if (parseInt(val, 10) === numA + numB) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="game-card-3d bg-gradient-to-br from-red-900/50 to-pink-900/50 border-3 sm:border-4 border-red-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 mb-6 sm:mb-8"
      data-component="DeleteProfileCard"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-4 sm:mb-5 md:mb-6">
        DANGER ZONE
      </h3>

      {!showConfirm ? (
        <button
          className="w-full flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-5 bg-red-600 text-white rounded-lg sm:rounded-xl active:bg-red-700 border-2 sm:border-3 border-red-500 cursor-pointer"
          onClick={onRequestDelete}
          type="button"
        >
          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" />
          <span className="text-lg sm:text-xl md:text-2xl font-black">Delete Speler</span>
        </button>
      ) : (
        <div className="space-y-4 flex flex-col items-center">
          <p className="text-base sm:text-lg md:text-xl text-yellow-400 text-center font-bold">
            🔒 Ouderlijk Toezicht: Los de som op om door te gaan.
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-white text-center font-black">
            Wat is {numA} + {numB}?
          </p>
          <input
            autoFocus
            className="text-center p-3 rounded-xl bg-slate-800 text-white font-bold border-2 border-red-500 w-full max-w-[120px] text-2xl outline-none focus:border-yellow-400 transition-colors"
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="?"
            type="number"
            value={answerInput}
          />
          <p className="text-xs sm:text-sm text-red-300 text-center font-semibold max-w-xs">
            Let op: Alle sterren en voortgang van deze speler worden definitief gewist!
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mt-2">
            <button
              className="game-button p-4 bg-slate-700 text-white rounded-lg sm:rounded-xl text-base sm:text-lg font-black border-2 border-slate-600 cursor-pointer"
              onClick={onCancel}
              type="button"
            >
              Nee, terug
            </button>
            <button
              className={`game-button p-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-black border-2 ${
                isCorrect
                  ? "bg-red-600 text-white border-red-500 active:bg-red-700 cursor-pointer"
                  : "bg-slate-800 text-gray-500 border-slate-700 cursor-not-allowed"
              }`}
              disabled={!isCorrect}
              onClick={onConfirmDelete}
              type="button"
            >
              Ja, Delete
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

DeleteProfileCard.displayName = "DeleteProfileCard";
