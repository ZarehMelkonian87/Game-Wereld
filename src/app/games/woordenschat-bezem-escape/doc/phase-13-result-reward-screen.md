# Fase 13 - Resultaat- En Beloningsscherm

## Doel

Het statische beloningsscherm is vervangen door een scherm dat de race-samenvatting leest en kindvriendelijk toont wat er geoefend is.

## Gebouwd

- Race krijgt na afloop een knop `Beloning`.
- Beloningsscherm leest `race-result` uit `sessionStorage`.
- Beloningsscherm toont:
  - geoefende woorden;
  - geoefende plaatsbegrippen;
  - aantal goede race-acties;
  - gebruikte hints;
  - audioherhalingen;
  - verdiende speed;
  - verdiende sterren;
  - sticker- of bezembeloning.
- Beloningsscherm bewaart nieuw vrijgespeelde beloningen per profiel.
- Actieknoppen toegevoegd:
  - `Opnieuw`;
  - `Wereld`;
  - `Menu`.

## Technische Notities

- `RewardScreen.tsx` gebruikt dezelfde productie-assets als de rest van de game.
- Nieuwe unlocks blijven voorspelbaar, zonder lootbox of willekeurige beloning.
- Als een beloning al eerder is vrijgespeeld, toont het scherm nog steeds een duidelijke beloningskaart zonder opnieuw te doen alsof die nieuw is.

## Verificatie

- `npm run build` is succesvol.
- Browser smoke test:
  - volledige race met 10 acties afgerond;
  - beloningsknop opent resultaat;
  - samenvatting toont woorden, plaatsbegrippen, speed en sterren;
  - knoppen `Opnieuw`, `Wereld` en `Menu` zijn aanwezig;
  - portrait en landscape hebben geen horizontale overflow.
