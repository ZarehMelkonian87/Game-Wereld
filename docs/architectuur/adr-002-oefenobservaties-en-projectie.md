# ADR-002 — Oefenobservaties, projectie en retentie

**Status:** geaccepteerd · **Herzien:** 2026-09-22

## Context

De app wil begeleiders inzicht geven in wat een kind oefent, zonder toetsdruk en zonder privacygevoelige gegevens te bewaren. Tegelijk moet dat inzicht herbouwbaar zijn: als de rekenregels veranderen, mag oude data niet ongeldig worden.

## Besluit

**Eén gebeurtenisstroom.** Elke poging — goed én fout — levert één `PracticeEventV1`-record op: welk woord of begrip, welke taaldomeinen, of er hulp is gebruikt, de uitkomst, het pogingnummer en de responstijd. De stroom is append-only: er wordt nooit een record gewijzigd.

**Wat er níet in staat:** geen kindnaam, geen transcript van wat er gezegd is, geen audio, geen pedagogisch eindoordeel of label. De game schrijft alleen de gepseudonimiseerde id's die het runtime-contract meegeeft.

**Projectie is afgeleid.** Het voortgangsscherm leest geen ruwe events maar een projectie per profiel en game, met een expliciete versie van de rekenregels. Verandert de rekenregel, dan verandert de versie en wordt de projectie opnieuw uit de events opgebouwd. Ontbreken de onderliggende events (data uit een oudere appversie), dan toont het scherm dat eerlijk in plaats van een getal te verzinnen.

**Retentie.** Observaties blijven lokaal op het apparaat en worden nooit verstuurd. "Voortgang resetten" wist ze transactioneel samen met de projecties, de gamesleutels en de records van de game; profielverwijdering doet hetzelfde in cascade.

**Export.** Een begeleider kan de voortgang downloaden: oefenpogingen en berekende voortgang zonder naam, avatar, audio of transcript.

## Gevolgen

Inzicht blijft herbouwbaar en uitlegbaar ("gebaseerd op N oefenpogingen met rekenregel versie X"), en de dataset blijft klein en privacyveilig. De prijs is dat de projectielaag onderhouden moet worden en dat het scherm nooit meer mag tonen dan uit de events volgt.
