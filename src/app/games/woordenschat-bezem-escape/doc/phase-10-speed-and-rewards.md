# Fase 10: +1 Speed En Beloningen

Status: uitgevoerd.

## Doel

Goede taalacties geven nu merkbare voortgang zonder druk of straf. Beloningen zijn voorspelbaar, kindvriendelijk en zonder lootbox- of gokmechaniek.

## Uitgevoerd

- Goede taalactie verhoogt speed.
- Zonder hint krijgt het kind een extra bonus.
- Met hint blijft de normale beloning gelden.
- Fouten trekken niets af.
- Speed wordt getoond als broom energy bar.
- Speedbar pulseert kort bij winst.
- Woordsterren lopen mee met goede acties.
- Eerste sticker-unlock toegevoegd: `Schelp Sticker`.
- Eerste bezemkleur-unlock toegevoegd: `Zee Blauwe Bezemkleur`.
- Correcte feedback gebruikt de celebration-mascotte.
- Vrijgespeelde beloningen worden per profiel-id opgeslagen in localStorage.

## Smoke Test

Getest op `390x844`:

- Boot-opdracht zonder hint geeft bonus.
- Speed gaat naar `2`.
- Woordsterren gaan naar `2/30`.
- Unlocks staan in `data-unlocked-rewards`: `sticker-schelp-starter,broom-color-sea-blue`.

## Bewuste Grenzen

De beloningsdata wordt al per profiel-id opgeslagen, maar het volledige voortgangsmodel met oefenevents wordt in Fase 14 uitgebreid.
