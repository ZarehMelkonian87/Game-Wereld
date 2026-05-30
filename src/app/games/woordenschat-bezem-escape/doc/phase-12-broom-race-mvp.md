# Fase 12 - Bezem Escape-run MVP

## Doel

De statische race-placeholder is vervangen door een eerste speelbare race-laag. De race gebruikt dezelfde strandstijl, dezelfde concept-art en dezelfde taalopdrachten als de scene-builder.

## Gebouwd

- Race duurt 30 seconden.
- Race toont een opdrachtbubble met audio.
- Race heeft altijd audio- en hintknoppen in de top-HUD.
- Race toont avatar op magische bezem.
- Race toont speed, sterren en timer.
- Race toont objecten uit de gebouwde scene, aangevuld met race-doelobjecten.
- Race gebruikt verzamelsterren op objecten.
- Race heeft kindvriendelijke knoppen voor `links`, `rechts`, `onder`, `boven`, `tussen` en `pak`.
- Race ondersteunt de MVP-begrippen `onder`, `boven`, `links`, `rechts` en `tussen`.
- Correcte race-actie geeft +1 Speed en +1 ster.
- Onjuiste actie geeft geen harde game-over, maar vertraagt licht en toont een hint.
- Race eindigt veilig met positieve feedback.

## Technische Notities

- `RaceScreen.tsx` leest de opgeslagen scene-state uit `sessionStorage`.
- De race schrijft een eerste `race-result` summary terug naar `sessionStorage`, zodat Fase 13 het beloningsscherm hierop kan aansluiten.
- `index.tsx` geeft de getypte race-opdrachten en objectdata door aan `RaceScreen`.

## Verificatie

- `npm run build` is succesvol.
- Browser smoke test op race-route uitgevoerd:
  - eerste opdracht `br-001` verwacht actie `onder`;
  - onjuiste knop verhoogt `mistakes` en `hints`;
  - juiste knop verhoogt `correctActions`, `speed` en `stars`;
  - landscape layout heeft zichtbare controls en geen horizontale overflow.
