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
      from: { path: "^src/app/games/magisch-strand-avontuur/" },
      to: {
        path: "^src/app/games/",
        pathNot: "^src/app/games/magisch-strand-avontuur/",
      },
    },
    {
      name: "no-counting-game-to-other-game",
      comment: "De rekengame communiceert uitsluitend via platformcontracten.",
      severity: "error",
      from: { path: "^src/app/games/rekenen-strand/" },
      to: {
        path: "^src/app/games/",
        pathNot: "^src/app/games/rekenen-strand/",
      },
    },
    {
      name: "no-game-to-app-context",
      comment: "Games ontvangen appdiensten uitsluitend via GameRuntime.",
      severity: "error",
      from: { path: "^src/app/games/" },
      to: { path: "^src/app/(contexts|routes|screens|game-host)/" },
    },
    {
      name: "no-game-to-infrastructure",
      comment: "Games gebruiken poorten, geen concrete infrastructurele adapters.",
      severity: "error",
      from: { path: "^src/app/games/" },
      to: { path: "^src/(app/)?(infrastructure|storage)/" },
    },
    {
      name: "no-storage-adapter-leak",
      comment:
        "UI en games gebruiken opslagcontracten; alleen de storage-composition-root kent Dexie en migratie-adapters.",
      severity: "error",
      from: { path: "^src/app/(?!storage/)" },
      to: {
        path: "^src/app/storage/(database|dexieRepositories|legacyMigration|platform)\\.",
      },
    },
    {
      name: "no-platform-to-game",
      comment: "Het platform is onafhankelijk van concrete games.",
      severity: "error",
      from: { path: "^src/app/game-platform/" },
      to: { path: "^src/app/games/" },
    },
    {
      name: "no-app-to-game-internals",
      comment: "Appmodules gebruiken uitsluitend de publieke games-entrypoint.",
      severity: "error",
      from: { path: "^src/app/(?!games/)" },
      to: {
        path: "^src/app/games/",
        pathNot: "^src/app/games/index\\.ts$",
      },
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
