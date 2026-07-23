/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular-dependencies",
      comment: "Circulaire imports maken initialisatie en eigenaarschap onvoorspelbaar.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-game-to-game",
      comment: "Games communiceren uitsluitend via platformcontracten.",
      severity: "error",
      from: { path: "^src/app/games/strand-bezem-escape/" },
      to: {
        path: "^src/app/games/",
        pathNot: "^src/app/games/strand-bezem-escape/",
      },
    },
    {
      name: "no-game-to-app-context",
      comment:
        "Nieuwe gamecode mag geen globale app-context introduceren; bestaande uitzonderingen staan apart gedocumenteerd.",
      severity: "error",
      from: {
        path: "^src/app/games/",
        pathNot: [
          "GameBackgroundMusic\\.tsx$",
          "RewardScreen\\.tsx$",
          "useWordChoiceState\\.ts$",
          "GameSettingsScreen\\.tsx$",
          "VoiceSideScrollerScreen\\.tsx$",
          "useSceneBuilderState\\.ts$",
          "useBezemEscapeGameController\\.ts$",
        ],
      },
      to: { path: "^src/app/contexts/" },
    },
    {
      name: "no-game-to-infrastructure",
      comment: "Games gebruiken poorten, geen concrete infrastructurele adapters.",
      severity: "error",
      from: { path: "^src/app/games/" },
      to: { path: "^src/(app/)?infrastructure/" },
    },
    {
      name: "no-platform-to-game",
      comment: "Het platform is onafhankelijk van concrete games.",
      severity: "error",
      from: { path: "^src/app/game-platform/" },
      to: { path: "^src/app/games/" },
    },
    {
      name: "no-domain-to-react",
      comment: "Pure domeinlogica is onafhankelijk van React.",
      severity: "error",
      from: { path: "(^|/)(domain|logic)/" },
      to: { path: "^react($|/)" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "(^|/)(dist|coverage|playwright-report|test-results)/" },
    tsConfig: { fileName: "tsconfig.json" },
  },
};
