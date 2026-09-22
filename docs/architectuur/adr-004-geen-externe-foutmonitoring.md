# ADR-004 — Geen externe foutmonitoring

**Status:** geaccepteerd · **Herzien:** 2026-09-22

## Context

Bij een productie-app is externe foutmonitoring (Sentry en vergelijkbaar) gebruikelijk. Deze app wordt echter door kinderen van 4–8 jaar gebruikt, verwerkt spraak en slaat oefendata op. Een crashrapport bevat al snel schermnamen, url's, invoer of stukjes state.

## Besluit

**Geen externe monitoring, geen session replay, geen analytics.** Er gaat geen data het apparaat af.

In plaats daarvan:

- een **lokale diagnoselaag** die gebeurtenissen logt met een correlatie-id, foutcode, subsysteem en herstelpad — zonder inhoud van wat een kind zei of deed;
- een **diagnose-export** die een begeleider bewust kan delen bij een probleem;
- een **microfoon-diagnosescherm** waarmee op elk toestel te zien is waar spraak misgaat, met een kopieerbaar rapport;
- foutschermen die een kind nooit in een doodlopende staat achterlaten.

## Gevolgen

We zien geen fouten van gebruikers vanzelf binnenkomen: problemen komen via de begeleider, met een gerichte export. Dat is traag maar past bij de belofte "er verlaat niets dit apparaat". Wordt monitoring later toch gewenst, dan is een uitdrukkelijk besluit nodig over toestemming, dataminimalisatie en bewaartermijn.
