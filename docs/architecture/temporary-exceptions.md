# Tijdelijke architectuuruitzonderingen

Laatst gecontroleerd: 23 juli 2026

Deze lijst volgt hoofdstuk 16 van `docs/code-quality-and-architecture.md`. Dependency Cruiser voorkomt dat de bestaande uitzonderingen zich uitbreiden.

## TOOL-001 — Gegenereerde UI-catalogus buiten Knip

- Overtreden regel: Knip hoort ongebruikte bestanden, exports en dependencies te rapporteren.
- Reden: `src/app/components/ui` is een brede gegenereerde componentcatalogus. Direct verwijderen in de baselinetaak heeft een te groot regressierisico en vertroebelt het dependencyrapport.
- Scope: `src/app/components/ui/**` en uitsluitend de bijbehorende allowlist in `knip.json`.
- Eigenaar/issue: dependency-opschoning na IMP-B06.
- Verwijdercriterium: vaststellen welke UI-primitives de shell werkelijk gebruikt, de overige bestanden en packages verwijderen en vervolgens de Knip-ignore opheffen.
- Guard: nieuwe dependencies worden niet aan de allowlist toegevoegd zonder een nieuwe, aflopende uitzondering.
- Uiterste herbeoordeling: vóór start van Groep C.
