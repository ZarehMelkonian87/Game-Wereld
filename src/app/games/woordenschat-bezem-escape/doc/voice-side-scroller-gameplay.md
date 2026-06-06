# Zeg & Vlieg: Endless Side-Scroller Gameplay

Dit document beschrijft de actuele endless-run gameplay van `Zeg & Vlieg`.

## Gameplay-Laag

De game gebruikt een brede strandachtergrond met rustige parallax-lagen:

- luchtlaag beweegt langzaam;
- zeelaag beweegt sneller;
- zandlaag beweegt het snelst;
- objecten en obstakels komen van rechts naar links.

De speler blijft links in beeld en beweegt verticaal met de knoppen `Omhoog` en `Omlaag`.

De run heeft geen vaste eindtijd. Net als bij een endless runner probeert het kind zo ver mogelijk te komen. De game stopt alleen bij botsing met een obstakel.

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

Een woordster wordt verzameld als het kind een zichtbaar objectwoord noemt. Dan krijgt het kind:

- `+1 Speed`;
- `+1` woordster;
- extra punten.

De totale score groeit door:

- afstand afleggen;
- woordsterren verzamelen.

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

## Oplopende Moeilijkheid

De game wordt langzaam moeilijker:

- afstand verhoogt het moeilijkheidslevel;
- de wereld scrolt steeds sneller;
- obstakels komen geleidelijk dichter op elkaar;
- verzamelde woorden geven speed, waardoor de speler meer punten kan halen maar ook sneller moet reageren.

## Game Over

Bij game-over toont de game:

- totale punten;
- afgelegde afstand;
- aantal verzamelde woordsterren;
- bereikt level;
- speed-bonus;
- aantal hints door obstakels;
- geoefende woorden.

Dit blijft oefenfeedback en is geen diagnose of officiele score.
