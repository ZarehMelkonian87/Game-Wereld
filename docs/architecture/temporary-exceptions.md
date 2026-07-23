# Tijdelijke architectuuruitzonderingen

Laatst gecontroleerd: 23 juli 2026

Deze lijst volgt hoofdstuk 16 van `docs/code-quality-and-architecture.md`. Dependency Cruiser voorkomt dat de bestaande uitzonderingen zich uitbreiden.

## ARCH-001 — Game importeert globale ProfileContext

- Overtreden regel: een game mag geen globale app-context importeren.
- Reden: de bestaande game leest en schrijft profiel- en voortgangsdata rechtstreeks. Dit in één baselinetaak vervangen zou het persistente contract en de gameflow tegelijk wijzigen.
- Scope: uitsluitend de zeven in `dependency-cruiser.config.cjs` genoemde bronbestanden onder `strand-bezem-escape`.
- Eigenaar/issue: architectuurmigratie IMP-B03, IMP-B04 en IMP-B06.
- Verwijdercriterium: `GameRuntime` levert profielidentiteit en progressiepoorten; daarna verdwijnen alle zeven uitzonderingen.
- Guard: `no-game-to-app-context` blokkeert iedere nieuwe contextimport vanuit andere gamebestanden.
- Uiterste herbeoordeling: vóór afronding van Groep B.

## TOOL-001 — Gegenereerde UI-catalogus buiten Knip

- Overtreden regel: Knip hoort ongebruikte bestanden, exports en dependencies te rapporteren.
- Reden: `src/app/components/ui` is een brede gegenereerde componentcatalogus. Direct verwijderen in de baselinetaak heeft een te groot regressierisico en vertroebelt het dependencyrapport.
- Scope: `src/app/components/ui/**` en uitsluitend de bijbehorende allowlist in `knip.json`.
- Eigenaar/issue: dependency-opschoning na IMP-B06.
- Verwijdercriterium: vaststellen welke UI-primitives de shell werkelijk gebruikt, de overige bestanden en packages verwijderen en vervolgens de Knip-ignore opheffen.
- Guard: nieuwe dependencies worden niet aan de allowlist toegevoegd zonder een nieuwe, aflopende uitzondering.
- Uiterste herbeoordeling: vóór start van Groep C.
