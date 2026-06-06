# Zeg & Vlieg: Side-Scroller Gameplay

Dit document beschrijft Fase 5 van de nieuwe side-scroller.

## Gameplay-Laag

De game gebruikt een brede strandachtergrond met rustige parallax-lagen:

- luchtlaag beweegt langzaam;
- zeelaag beweegt sneller;
- zandlaag beweegt het snelst;
- objecten en obstakels komen van rechts naar links.

De speler blijft links in beeld en beweegt verticaal met de knoppen `Omhoog` en `Omlaag`.

## Verzamelobjecten

De eerste ronde gebruikt woordsterren:

- bootster;
- krabster;
- dolfijnster;
- schelpster;
- balster;
- parasolster;
- zonster.

Een woordster wordt verzameld als het actieve woord wordt herkend. Dan krijgt het kind `+1 Speed` en een ster.

## Obstakels

De eerste strandobstakels zijn:

- wolk;
- meeuw;
- haai;
- zeeleeuw.

Botsingen zijn veilig. De ronde stopt niet. De bezem vertraagt kort en de game geeft een vriendelijke hint.

Voorbeeldfeedback:

```text
Rustig, vlieg om de haai heen.
```

## Einde Van De Ronde

Aan het einde toont de game:

- aantal verzamelde woordsterren;
- speed-bonus;
- aantal hints door obstakels;
- geoefende woorden.

Dit blijft oefenfeedback en is geen diagnose of officiele score.
