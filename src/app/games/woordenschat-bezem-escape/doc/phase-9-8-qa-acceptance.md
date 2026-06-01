# Fase 9.8: QA En Acceptatie

Datum: 2026-06-01

Doel: controleren of `Zeg & Bouw` binnen de bestaande scene-builder veilig en bruikbaar is voor de MVP.

## Samenvatting

- Parser MVP-zinnen: geslaagd, 10 van 10.
- Korte zinnen en herkenningsvariaties: geslaagd.
- Onduidelijke zinnen: veilig afgehandeld met hulptekst.
- Mobile layout: geslaagd in portrait, landscape en kleine telefoon.
- Automatisch plaatsen: geslaagd.
- Geplaatst object aanpassen voor `Klaar`: geslaagd.
- Voortgang opslaan in dashboard: geslaagd.
- TypeScript en productiebuild: geslaagd.
- Echte stemtest met achtergrondgeluid: handmatige telefooncheck blijft nodig.

## Parser QA: 10 MVP-Zinnen

Alle onderstaande zinnen gaven `status: ready` met het juiste object en de juiste zone.

| Zin | Object | Zone |
| --- | --- | --- |
| Zet de boot in de zee. | boot | zee |
| Zet de dolfijn in de zee. | dolfijn | zee |
| Leg de bal op het strand. | bal | strand |
| Zet de vuurtoren op het eiland. | vuurtoren | eiland |
| Zet de vlieger boven het strand. | vlieger | lucht |
| Zet het vliegtuig boven de zee. | vliegtuig | boven-zee |
| Leg de schelpen op het strand. | schelp | strand |
| Zet de krab op de handdoek. | krab | handdoek-zone |
| Zet het zandkasteel naast de schelpen. | zandkasteel | naast-schelp |
| Zet de parasol op het strand. | parasol | strand |

## Extra Zinvariaties

Geslaagd:

- `Boot in zee`
- `Bal op strand`
- `Krab op handdoek`
- `Zet het bootje in het water`
- `Zet de dolfin in zee`
- `Leg de strandbal op zand`
- `Zet de toren op eiland`

Veilig afgehandeld:

- Lege zin: `needs-help`
- `Zet hem daar`: `needs-help`
- `Zet de boot`: `needs-help`, met de vraag waar de boot moet komen.

## Mobile Layout QA

Geteste viewports:

| Viewport | Resultaat |
| --- | --- |
| 390x844 portrait | Geen horizontale overflow, instructie, scene, status, tray en knop zichtbaar. |
| 844x390 landscape | Geen horizontale overflow, instructie, scene, status, tray en knop zichtbaar. |
| 360x640 kleine telefoon | Geen horizontale overflow, instructie, scene, status, tray en knop zichtbaar. |

Console errors: 0.

## Scene Builder QA

Testzin: `Zet de boot in de zee.`

Resultaat:

- Spraak-preview wordt `ready`.
- De boot wordt automatisch in de scene geplaatst.
- Feedback zegt dat de game zelf heeft gebouwd.
- Het object blijft verplaatsbaar voordat `Klaar` wordt gedrukt.
- Na `Klaar` wordt voortgang zichtbaar in het ouder/logopedist-dashboard.

## Voortgang QA

Na bevestiging van een spraakgestuurde plaatsing toont het dashboard:

- woord `boot` geoefend en benoemd;
- plaatsbegrip `in` geoefend;
- zelf gemaakte zin geregistreerd;
- automatisch geplaatste zin geregistreerd;
- speed/sterren bijgewerkt.

## Technische Checks

- `npx tsc --noEmit`: geslaagd.
- `npm run build`: geslaagd.
- Browser smoke test: geslaagd.
- HTTPS tunnel voor mobiele microfoontest: beschikbaar via Cloudflare Tunnel.

## Handmatige Telefooncheck

Deze onderdelen moeten met een echte telefoon en echte stem worden beoordeeld:

- kind zegt zelf een zin via microfoon;
- herkenning met achtergrondgeluid;
- herkenning met uitspraakvariatie van het kind;
- ouder beoordeelt of de flow als spel voelt en niet als toets.

Acceptatie voor MVP: de technische basis is klaar. De echte microfoonkwaliteit blijft afhankelijk van telefoon, browser, uitspraak, omgeving en spraakherkenning van het apparaat.
