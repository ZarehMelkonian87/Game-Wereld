# Tijdelijke architectuuruitzonderingen

Laatst gecontroleerd: 23 juli 2026 tijdens IMP-H04.

Er zijn geen actieve tijdelijke architectuur-, lint- of dead-code-uitzonderingen.

De eerdere uitzondering `TOOL-001` is gesloten: de ongebruikte gegenereerde UI-catalogus is verwijderd, bijbehorende packages zijn uit de dependencyset gehaald en de brede Knip-ignore bestaat niet meer. Alleen `tailwindcss` en `tw-animate-css` staan als dependency-ignore geregistreerd omdat Knip de CSS-importketen bewust niet volgt; beide worden aantoonbaar vanuit `src/styles/tailwind.css`/de Vite-plugin gebruikt.
