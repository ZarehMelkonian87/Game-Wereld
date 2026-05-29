# Games

Deze map bevat alle mini-games van Game Wereld.

Elke game krijgt een eigen map met minimaal:

- `README.md` - ontwerp, leerdoel, regels en meetdata.
- `index.tsx` - entrypoint/component van de game.

Aanbevolen extra bestanden per game:

- `content.ts` - woorden, vragen, levels of opdrachten.
- `types.ts` - TypeScript types voor deze game.
- `progress.ts` - functies voor score en voortgang.
- `assets/` - afbeeldingen, geluiden of andere game-assets.

## Nieuwe Game Toevoegen

1. Kopieer `_template/` naar een nieuwe map, bijvoorbeeld `plaatsmissie/`.
2. Vul `README.md` in.
3. Bouw de game in `index.tsx`.
4. Voeg metadata toe in `src/app/data/games.ts`.
5. Koppel de game later aan de router/game-runner.

## Data Die Een Game Moet Kunnen Rapporteren

Gebruik per oefenmoment zoveel mogelijk dezelfde velden:

- profiel/kind id;
- game id;
- sessie id;
- datum/tijd;
- leergebied;
- opdracht id;
- moeilijkheid;
- goed/fout;
- aantal pogingen;
- reactietijd;
- hulp gebruikt;
- score;
- geoefend woord, zin, categorie of vaardigheid.
