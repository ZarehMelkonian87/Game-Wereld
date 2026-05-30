# Fase 16 - Navigatie En Schermen

## Doel

De game krijgt een rustige mobiele menustructuur, zodat het kind niet direct in losse gameplay terechtkomt en nieuwe onderdelen later netjes toegevoegd kunnen worden.

## Gebouwd

- Nieuw scherm `GameMenuScreen.tsx`.
- De game start standaard in het game-menu.
- Wereldkeuze toont `Strandwereld`.
- Moduskeuze bevat:
  - `Luister & Plaats`;
  - `Kies het Woord`;
  - `Race`.
- Race-knop is alleen actief wanneer er een opgeslagen scene-state is.
- Beloningen-entry opent het beloningsscherm.
- Dashboard-entry opent het ouder/logopedist dashboard.
- Instellingen-entry is zichtbaar en verwijst tijdelijk naar de bestaande app-instellingen.
- Dashboard heeft een terugknop naar het game-menu.
- Beloningsscherm kan terug naar het game-menu via de wereldknop.

## Verificatie

- `npm run build` is succesvol.
- Browser smoke test:
  - standaardroute opent het game-menu;
  - Strandwereld-kaart is zichtbaar;
  - modusknoppen zijn zichtbaar;
  - woordkeuze-knop opent woordkeuze;
  - dashboard-knop opent dashboard;
  - dashboard-terugknop opent menu;
  - portrait en landscape hebben geen horizontale overflow.
