# Projectrichtlijnen

De normatieve ontwikkelregels staan in [Code Quality & Architecture Requirements](../docs/code-quality-and-architecture.md).

Het volledige doelbeeld en de onderbouwing staan in het [architectuurvoorstel](../docs/architecture-proposal/README.md).

## Kernregels

1. Voer typecheck afzonderlijk van Vite-build uit.
2. Respecteer feature-, game- en platformgrenzen; games gebruiken uitsluitend publieke contracten en `GameRuntime`.
3. Gebruik geen directe browseropslag, speech-, media- of service-worker-API buiten adapters.
4. Splits code op verantwoordelijkheid en samenhang, niet op een universeel regelaantal.
5. Nieuwe of gewijzigde domainlogica, migraties en kernflows krijgen passende tests.
6. Behandel loading-, fout-, offline- en retrytoestanden expliciet.
7. Voldoe aan WCAG 2.2 AA en de strengere kindgerichte touch- en alternatiefvereisten.
8. Sla geen ruwe audio, speechtranscript of onnodige kindgegevens op of in logs.

Bij tegenstrijdige oudere documentatie gelden het normatieve kwaliteitsdocument en geaccepteerde ADR's.
