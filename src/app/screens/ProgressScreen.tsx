import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useProfile } from "../contexts/ProfileContext";
import { gameThemes } from "../data/games";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Award, Zap, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface SkillProgress {
  name: string;
  percentage: number;
  previousPercentage?: number;
  change?: number;
}

interface ThemeProgress {
  themeId: string;
  skills: SkillProgress[];
  periodProgress: {
    strengths: string[];
    challenges: string[];
  };
}

type TimePeriod = "week" | "month" | "3months" | "alltime";

export function ProgressScreen() {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("month");

  useEffect(() => {
    if (!currentProfile) {
      navigate("/");
    }
  }, [currentProfile, navigate]);

  if (!currentProfile) return null;

  const periods: { id: TimePeriod; label: string; shortLabel: string }[] = [
    { id: "week", label: "Deze Week", shortLabel: "Week" },
    { id: "month", label: "Deze Maand", shortLabel: "Maand" },
    { id: "3months", label: "3 Maanden", shortLabel: "3M" },
    { id: "alltime", label: "Sinds Begin", shortLabel: "Alles" },
  ];

  // Mock data per periode - later komt dit uit de daadwerkelijke game resultaten
  const getProgressData = (period: TimePeriod): ThemeProgress[] => {
    const baseData = {
      week: {
        language: {
          skills: [
            { name: "Woordenschat begrijpen", percentage: 68, previousPercentage: 65, change: 3 },
            { name: "Actieve woordenschat", percentage: 52, previousPercentage: 50, change: 2 },
            { name: "Zinnen begrijpen", percentage: 61, previousPercentage: 59, change: 2 },
            { name: "Zinnen herhalen", percentage: 44, previousPercentage: 44, change: 0 },
            { name: "Aanwijzingen volgen", percentage: 73, previousPercentage: 70, change: 3 },
            { name: "Woordcategorieën", percentage: 58, previousPercentage: 56, change: 2 },
          ],
          periodProgress: {
            strengths: ["+3 nieuwe woorden deze week", "Aanwijzingen volgen beter"],
            challenges: ["Zinnen herhalen blijft stabiel"],
          },
        },
        math: {
          skills: [
            { name: "Getallen herkennen", percentage: 82, previousPercentage: 79, change: 3 },
            { name: "Optellen tot 10", percentage: 71, previousPercentage: 68, change: 3 },
            { name: "Aftrekken tot 10", percentage: 58, previousPercentage: 56, change: 2 },
            { name: "Tellen tot 20", percentage: 88, previousPercentage: 86, change: 2 },
            { name: "Getallen vergelijken", percentage: 65, previousPercentage: 64, change: 1 },
          ],
          periodProgress: {
            strengths: ["+3% in optellen", "Goed bezig met tellen"],
            challenges: ["Aftrekken kan sneller"],
          },
        },
        memory: {
          skills: [
            { name: "Korte termijn geheugen", percentage: 76, previousPercentage: 74, change: 2 },
            { name: "Patronen herkennen", percentage: 69, previousPercentage: 67, change: 2 },
            { name: "Volgorde onthouden", percentage: 55, previousPercentage: 54, change: 1 },
            { name: "Plaatjes onthouden", percentage: 81, previousPercentage: 78, change: 3 },
          ],
          periodProgress: {
            strengths: ["+3% beter in plaatjes", "Geheugen groeit constant"],
            challenges: ["Volgorde blijft uitdagend"],
          },
        },
      },
      month: {
        language: {
          skills: [
            { name: "Woordenschat begrijpen", percentage: 68, previousPercentage: 56, change: 12 },
            { name: "Actieve woordenschat", percentage: 52, previousPercentage: 44, change: 8 },
            { name: "Zinnen begrijpen", percentage: 61, previousPercentage: 53, change: 8 },
            { name: "Zinnen herhalen", percentage: 44, previousPercentage: 43, change: 1 },
            { name: "Aanwijzingen volgen", percentage: 73, previousPercentage: 61, change: 12 },
            { name: "Woordcategorieën", percentage: 58, previousPercentage: 50, change: 8 },
          ],
          periodProgress: {
            strengths: ["+12 nieuwe woorden sterk", "+8% beter in plaatswoorden"],
            challenges: ["Zinnen herhalen blijft moeilijk"],
          },
        },
        math: {
          skills: [
            { name: "Getallen herkennen", percentage: 82, previousPercentage: 67, change: 15 },
            { name: "Optellen tot 10", percentage: 71, previousPercentage: 56, change: 15 },
            { name: "Aftrekken tot 10", percentage: 58, previousPercentage: 48, change: 10 },
            { name: "Tellen tot 20", percentage: 88, previousPercentage: 75, change: 13 },
            { name: "Getallen vergelijken", percentage: 65, previousPercentage: 60, change: 5 },
          ],
          periodProgress: {
            strengths: ["+15% beter in optellen", "Tellen tot 20 bijna perfect!"],
            challenges: ["Aftrekken vraagt meer oefening"],
          },
        },
        memory: {
          skills: [
            { name: "Korte termijn geheugen", percentage: 76, previousPercentage: 65, change: 11 },
            { name: "Patronen herkennen", percentage: 69, previousPercentage: 58, change: 11 },
            { name: "Volgorde onthouden", percentage: 55, previousPercentage: 48, change: 7 },
            { name: "Plaatjes onthouden", percentage: 81, previousPercentage: 70, change: 11 },
          ],
          periodProgress: {
            strengths: ["+11% beter in plaatjes onthouden", "Patronen gaan steeds beter"],
            challenges: ["Volgorde onthouden kan nog groeien"],
          },
        },
      },
      "3months": {
        language: {
          skills: [
            { name: "Woordenschat begrijpen", percentage: 68, previousPercentage: 42, change: 26 },
            { name: "Actieve woordenschat", percentage: 52, previousPercentage: 30, change: 22 },
            { name: "Zinnen begrijpen", percentage: 61, previousPercentage: 38, change: 23 },
            { name: "Zinnen herhalen", percentage: 44, previousPercentage: 35, change: 9 },
            { name: "Aanwijzingen volgen", percentage: 73, previousPercentage: 45, change: 28 },
            { name: "Woordcategorieën", percentage: 58, previousPercentage: 35, change: 23 },
          ],
          periodProgress: {
            strengths: ["+28% groei in aanwijzingen volgen", "+26% woordenschat groei", "Enorme vooruitgang!"],
            challenges: ["Zinnen herhalen groeit langzamer"],
          },
        },
        math: {
          skills: [
            { name: "Getallen herkennen", percentage: 82, previousPercentage: 52, change: 30 },
            { name: "Optellen tot 10", percentage: 71, previousPercentage: 41, change: 30 },
            { name: "Aftrekken tot 10", percentage: 58, previousPercentage: 33, change: 25 },
            { name: "Tellen tot 20", percentage: 88, previousPercentage: 60, change: 28 },
            { name: "Getallen vergelijken", percentage: 65, previousPercentage: 45, change: 20 },
          ],
          periodProgress: {
            strengths: ["+30% in getallen herkennen", "+30% in optellen", "Fantastische groei!"],
            challenges: ["Blijf oefenen met aftrekken"],
          },
        },
        memory: {
          skills: [
            { name: "Korte termijn geheugen", percentage: 76, previousPercentage: 50, change: 26 },
            { name: "Patronen herkennen", percentage: 69, previousPercentage: 43, change: 26 },
            { name: "Volgorde onthouden", percentage: 55, previousPercentage: 35, change: 20 },
            { name: "Plaatjes onthouden", percentage: 81, previousPercentage: 55, change: 26 },
          ],
          periodProgress: {
            strengths: ["+26% groei in meerdere skills", "Geweldige ontwikkeling"],
            challenges: ["Volgorde onthouden kan nog beter"],
          },
        },
      },
      alltime: {
        language: {
          skills: [
            { name: "Woordenschat begrijpen", percentage: 68, previousPercentage: 15, change: 53 },
            { name: "Actieve woordenschat", percentage: 52, previousPercentage: 10, change: 42 },
            { name: "Zinnen begrijpen", percentage: 61, previousPercentage: 12, change: 49 },
            { name: "Zinnen herhalen", percentage: 44, previousPercentage: 18, change: 26 },
            { name: "Aanwijzingen volgen", percentage: 73, previousPercentage: 20, change: 53 },
            { name: "Woordcategorieën", percentage: 58, previousPercentage: 15, change: 43 },
          ],
          periodProgress: {
            strengths: ["+53% totale groei!", "Van beginner naar gevorderd", "Ongelooflijke reis!"],
            challenges: ["Blijf oefenen met zinnen"],
          },
        },
        math: {
          skills: [
            { name: "Getallen herkennen", percentage: 82, previousPercentage: 25, change: 57 },
            { name: "Optellen tot 10", percentage: 71, previousPercentage: 15, change: 56 },
            { name: "Aftrekken tot 10", percentage: 58, previousPercentage: 10, change: 48 },
            { name: "Tellen tot 20", percentage: 88, previousPercentage: 30, change: 58 },
            { name: "Getallen vergelijken", percentage: 65, previousPercentage: 20, change: 45 },
          ],
          periodProgress: {
            strengths: ["+58% in tellen!", "+57% in getallen", "Van start naar ster!"],
            challenges: ["Blijf rekenen oefenen"],
          },
        },
        memory: {
          skills: [
            { name: "Korte termijn geheugen", percentage: 76, previousPercentage: 25, change: 51 },
            { name: "Patronen herkennen", percentage: 69, previousPercentage: 20, change: 49 },
            { name: "Volgorde onthouden", percentage: 55, previousPercentage: 15, change: 40 },
            { name: "Plaatjes onthouden", percentage: 81, previousPercentage: 30, change: 51 },
          ],
          periodProgress: {
            strengths: ["+51% geheugen groei!", "Geweldige ontwikkeling", "Super trots!"],
            challenges: ["Blijf je geheugen trainen"],
          },
        },
      },
    };

    return [
      { themeId: "language", ...baseData[period].language },
      { themeId: "math", ...baseData[period].math },
      { themeId: "memory", ...baseData[period].memory },
    ];
  };

  const progressData = getProgressData(selectedPeriod);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "from-green-500 to-emerald-600";
    if (percentage >= 50) return "from-yellow-500 to-orange-600";
    return "from-orange-500 to-red-600";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />;
    return <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />;
  };

  const getChangeText = (change: number) => {
    if (change > 0) return `+${change}%`;
    if (change < 0) return `${change}%`;
    return "0%";
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="min-h-screen flex flex-col safe-area-inset">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-4 sm:px-4 sm:py-5 shadow-2xl border-b-4 border-purple-500/30">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/home")}
            className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-slate-700 rounded-lg sm:rounded-xl active:bg-slate-600 border-2 border-slate-600"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`bg-gradient-to-br ${currentProfile.avatar.color} w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-4xl sm:text-5xl border-3 border-white/20 shadow-xl flex-shrink-0`}>
              {currentProfile.avatar.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-black mb-1">
                Voortgang
              </h1>
              <p className="text-sm sm:text-base text-cyan-300 font-semibold">
                {currentProfile.name}'s Groei
              </p>
            </div>
            <Award className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Progress Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto pb-6">
          {/* Period Selector */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 sm:mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              <h3 className="text-lg sm:text-xl text-white font-black">Periode</h3>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-slate-800/50 p-2 sm:p-3 rounded-xl border-2 border-slate-600">
              {periods.map((period) => (
                <motion.button
                  key={period.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm md:text-base transition-all ${
                    selectedPeriod === period.id
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-2 border-cyan-300/50 shadow-lg"
                      : "bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:bg-slate-700"
                  }`}
                >
                  <span className="hidden sm:inline">{period.label}</span>
                  <span className="sm:hidden">{period.shortLabel}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {progressData.map((themeData, index) => {
            const theme = gameThemes.find((t) => t.id === themeData.themeId);
            if (!theme) return null;

            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 border-3 sm:border-4 border-slate-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
              >
                {/* Theme Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                  <div className={`bg-gradient-to-br ${theme.color} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-3xl sm:text-4xl md:text-5xl border-2 border-white/20 shadow-lg flex-shrink-0`}>
                    {theme.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-black mb-1">
                      {theme.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-cyan-300 font-semibold">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {/* Skills Progress */}
                <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                  {themeData.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-sm sm:text-base text-white font-bold truncate">
                            {skill.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          {skill.change !== undefined && skill.change !== 0 && (
                            <div className="flex items-center gap-1">
                              {getChangeIcon(skill.change)}
                              <span className={`text-xs sm:text-sm font-black ${getChangeColor(skill.change)}`}>
                                {getChangeText(skill.change)}
                              </span>
                            </div>
                          )}
                          <span className="text-sm sm:text-base text-cyan-300 font-black whitespace-nowrap">
                            {skill.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-900/50 rounded-full h-3 sm:h-4 overflow-hidden border-2 border-slate-600 relative">
                        {/* Previous percentage (faded) */}
                        {skill.previousPercentage !== undefined && (
                          <div
                            className="absolute inset-0 bg-slate-600/30"
                            style={{ width: `${skill.previousPercentage}%` }}
                          />
                        )}
                        {/* Current percentage */}
                        <motion.div
                          initial={{ width: skill.previousPercentage ? `${skill.previousPercentage}%` : 0 }}
                          animate={{ width: `${skill.percentage}%` }}
                          transition={{ duration: 1.2, delay: index * 0.1 }}
                          className={`h-full bg-gradient-to-r ${getProgressColor(skill.percentage)} shadow-lg relative z-10`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Period Progress */}
                <div className="bg-slate-900/30 rounded-xl p-3 sm:p-4 border-2 border-slate-600">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                    <h3 className="text-base sm:text-lg md:text-xl text-white font-black">
                      {periods.find((p) => p.id === selectedPeriod)?.label}
                    </h3>
                  </div>

                  {/* Strengths */}
                  {themeData.periodProgress.strengths.length > 0 && (
                    <div className="mb-3">
                      <div className="space-y-2">
                        {themeData.periodProgress.strengths.map((strength, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs sm:text-sm text-green-300 font-semibold"
                          >
                            <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenges */}
                  {themeData.periodProgress.challenges.length > 0 && (
                    <div className="space-y-2">
                      {themeData.periodProgress.challenges.map((challenge, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs sm:text-sm text-orange-300 font-semibold"
                        >
                          <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{challenge}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Overall Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: progressData.length * 0.1 }}
            className="game-card-3d bg-gradient-to-br from-purple-600 to-pink-600 border-3 sm:border-4 border-purple-400 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center"
          >
            <Award className="w-16 h-16 sm:w-20 sm:h-20 text-white mx-auto mb-3 sm:mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-black mb-2">
              {selectedPeriod === "alltime" ? "Ongelooflijke Reis!" : "Blijf Oefenen!"}
            </h2>
            <p className="text-base sm:text-lg text-white/90 font-semibold">
              {selectedPeriod === "alltime"
                ? `${currentProfile.name} is zo ver gekomen! 🌟`
                : `${currentProfile.name} maakt geweldige vooruitgang! 🎉`}
            </p>
          </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
