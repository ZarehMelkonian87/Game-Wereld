# Fase 4: Luister & Plaats Interactie

Status: uitgevoerd.

## Doel

De scene-builder is interactief gemaakt met een eenvoudige mobile-first tapflow:

1. Kind kiest een sticker onderaan.
2. Kind tikt op de sceneplek.
3. Kind drukt op `Klaar`.
4. De game controleert object, zone en plaatsbegrip.
5. Bij een goed antwoord krijgt het kind positieve feedback, +1 Speed en +1 woordster.
6. Pas daarna kan het kind naar de volgende opdracht.

## Uitgevoerd

- State voor actieve opdracht.
- State voor geselecteerd object.
- State voor gekozen doelzone.
- State voor geplaatste objecten.
- Tikselectie voor stickers.
- Tikselectie voor sceneplek.
- Bevestigknop `Klaar` voor jonge kinderen.
- Correctcontrole op object, zone en plaatsbegrip.
- Vriendelijke feedback zonder hard `fout`.
- Herhaalzin na een goed antwoord.
- +1 Speed en +1 woordster bij een goede taalactie.
- `Volgende` verschijnt pas na een goed afgeronde opdracht.

## Smoke Test

Getest in de browser op mobiel formaat `390x844`:

- `Boot` kiezen, scene aantikken en bevestigen plaatst de boot.
- Speed gaat van `0` naar `1`.
- Woordsterren gaan van `0/30` naar `1/30`.
- `Volgende` opent opdracht `lp-002`.
- Een verkeerd object geeft feedback: `Bijna! Zoek de dolfijn.`
- Bij een fout blijft speed gelijk en wordt geen fout object geplaatst.

## Bewuste Grenzen

Deze fase gebruikt nog een eenvoudige sceneplek-keuze. Gedetailleerde dropzones, oplichtende hints en echte drag-and-drop worden uitgewerkt in Fase 5 en Fase 6.
