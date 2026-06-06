# Besturing En Woordspraak: Zeg & Vlieg

## Status

Dit document legt de actuele besturing vast voor `Zeg & Vlieg`.

De speler bestuurt de bezem niet meer met stemvolume. Dat gaf conflict met het uitspreken van objectnamen. De stem wordt nu alleen gebruikt voor woordherkenning.

## Waarom Gewijzigd

De vorige versie gebruikte stemvolume voor omhoog/omlaag vliegen. Dat was onduidelijk voor het kind, omdat hetzelfde kanaal ook nodig was om woorden zoals `boot`, `krab` en `dolfijn` uit te spreken.

Nieuwe regel:

- Knoppen sturen de bezem.
- Stem pakt het actieve woordobject.

## Beweging

De game heeft twee vaste klik/touch-knoppen:

- `Omhoog`
- `Omlaag`

De knoppen schrijven direct naar de verticale input van de side-scroller engine.

```text
0 = geen knop ingedrukt, bezem zakt rustig
-1 = Omhoog ingedrukt, bezem stijgt
1 = Omlaag ingedrukt, bezem daalt
```

Hierdoor kan het kind bewegen zonder te praten en praten zonder dat de beweging verandert.

## Woordspraak

Spraakherkenning blijft actief voor het educatieve doel:

1. De game toont het actieve woord, bijvoorbeeld `Zeg: boot`.
2. Het kind zegt het woord.
3. De game vergelijkt de gehoorde tekst met de woordvarianten.
4. Bij herkenning wordt het object verzameld.
5. Bij onduidelijke herkenning krijgt het kind vriendelijke feedback.

## UI

De oude stemmeterkaart is verwijderd.

Daardoor krijgt de stage meer ruimte en blijft het scherm rustiger:

- geen volumelevels;
- geen stilte/zacht/goed/hard labels;
- geen instructie om harder te praten voor beweging;
- alleen actieve opdracht, herhaalknop en vliegknoppen.

## Privacyregel

De app slaat geen audio-opname op. Alleen oefenobservaties zoals doelwoord, transcripttekst indien beschikbaar, hints en herhalingen worden opgeslagen.
