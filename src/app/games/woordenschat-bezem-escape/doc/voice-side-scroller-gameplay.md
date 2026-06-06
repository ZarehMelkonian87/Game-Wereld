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

Een woordster start rechts buiten beeld en scrolt rustig naar links. Het kind krijgt tijd om het woord te noemen. Als het kind het woord niet noemt, verdwijnt het item vanzelf links uit beeld en komt het later opnieuw binnen.

Een woordster wordt verzameld als het kind een zichtbaar objectwoord noemt. Dan krijgt het kind `+1 Speed` en een ster.

## Obstakels

De eerste strandobstakels zijn:

- wolk;
- meeuw;
- haai;
- zeeleeuw.

Bij botsing met een obstakel is de ronde direct klaar. Dit maakt de game spannender, terwijl onduidelijke uitspraak alleen vriendelijke feedback geeft.

Voorbeeldfeedback:

```text
Game over. Je raakte de haai.
```

## Einde Van De Ronde

Aan het einde toont de game:

- aantal verzamelde woordsterren;
- speed-bonus;
- aantal hints door obstakels;
- geoefende woorden.

Dit blijft oefenfeedback en is geen diagnose of officiele score.
