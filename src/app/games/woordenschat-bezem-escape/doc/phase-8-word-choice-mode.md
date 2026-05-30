# Fase 8: Kies Het Woord Modus

Status: uitgevoerd.

## Doel

De eerste PPVT/Peabody-achtige oefenvorm is nu speelbaar als oefenmodus. De game gebruikt originele strandwoorden en originele stickerbeelden, zonder officiele testitems of scoring.

## Uitgevoerd

- `WordChoiceScreen` gebruikt gestructureerde woordkeuze-opdrachten.
- Antwoordopties worden getoond als grote stickercards.
- De modus ondersteunt 2, 3 en 4 antwoordopties vanuit de contentdata.
- Vraag wordt afgespeeld via de audio-knoppen.
- De gekozen antwoordkaart wordt gecontroleerd.
- Correct antwoord geeft +1 Speed en +1 woordster.
- Correct antwoord herhaalt het woord in een korte zin.
- Herkend zonder hint wordt apart bijgehouden.
- Herkend met hint wordt apart bijgehouden.
- Moeilijke woorden worden gemarkeerd voor herhaling.
- Hint laat het juiste doelplaatje oplichten.

## Smoke Test

Getest op `390x844` met `?screen=word-choice`:

- `cw-001` opent met 2 keuzes.
- Audio verhoogt `data-active-audio-repeats` naar `1`.
- Hint laat `Dolfijn` oplichten.
- Verkeerd antwoord `Boot` zet `dolfijn` bij moeilijke woorden.
- Correct antwoord `Dolfijn` met hint zet `dolfijn` bij herkend met hulp.
- Speed gaat naar `1` en woordsterren naar `1/30`.

## Bewuste Grenzen

Deze modus staat nu via preview-query open. De kindvriendelijke mode-keuze in de app komt in Fase 16.
