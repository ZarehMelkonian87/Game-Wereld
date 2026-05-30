# Fase 15 - Ouder/Logopedist Dashboard

## Doel

Een eerste dashboard tonen dat oefenvoortgang zichtbaar maakt voor ouder of logopedist, zonder diagnose, normscore of officiele testvergelijking.

## Gebouwd

- Nieuw scherm `ParentDashboardScreen.tsx`.
- Preview via `?screen=dashboard`.
- Dashboard leest profielspecifieke data uit `logic/progress.ts`.
- Dashboard toont:
  - vandaag geoefend;
  - woordenlijst;
  - plaatsbegrippen;
  - zinnen begrijpen;
  - actieve woordenschat;
  - zinnen nazeggen;
  - aanwijzingen volgen;
  - categorieen;
  - aanbevolen volgende oefening;
  - deelbare samenvatting.
- Labels:
  - `Gaat goed`;
  - `Oefenen`;
  - `Met hulp`;
  - `Nog moeilijk`.
- Exportknop kopieert een eenvoudige oefensamenvatting.

## Veiligheidsregels

- Het dashboard noemt expliciet dat het oefenobservatie is.
- Het dashboard toont geen diagnose.
- Het dashboard toont geen officiele testscore.
- Er is geen vergelijking met normgroepen.

## Verificatie

- `npm run build` is succesvol.
- Browser smoke test:
  - dashboard opent via `?screen=dashboard`;
  - profiel-id en oefenpogingen worden gelezen;
  - kopieerknop is zichtbaar;
  - tekst `Geen diagnose` en `geen officiele testscore` is zichtbaar;
  - portrait en landscape hebben geen horizontale overflow.
