# Fase 11: Scene Afronden En Race Starten

Status: uitgevoerd.

## Doel

De scene-builder kan nu een oefenronde afronden en de race starten wanneer genoeg plaatsopdrachten goed zijn uitgevoerd.

## Uitgevoerd

- MVP-completeregel ingesteld op 5 correcte plaatsopdrachten.
- De game detecteert wanneer de scene compleet genoeg is.
- Na de vijfde correcte opdracht verschijnt positieve scene-complete feedback.
- Geplaatste objecten blijven zichtbaar.
- De bevestigknop verandert naar `Start race`.
- Geoefende woorden worden meegenomen als race-state.
- Geoefende plaatsbegrippen worden meegenomen als race-state.
- De scene-state wordt opgeslagen in `sessionStorage`.
- De app schakelt daarna door naar het race-scherm.

## Smoke Test

Getest op `390x844`:

- Eerste 5 opdrachten afgerond: boot, dolfijn, bal, vuurtoren, vlieger.
- Na opdracht 5 is `data-scene-complete` gelijk aan `true`.
- Geoefende woorden: `boot,dolfijn,bal,vuurtoren,vlieger`.
- Geoefende begrippen: `in,in,op,op,boven`.
- Knop toont `Start race`.
- Na klikken verschijnt `RaceScreen`.

## Bewuste Grenzen

De race zelf is in deze fase nog de statische race-shell. De echte race-interactie komt in Fase 12.
