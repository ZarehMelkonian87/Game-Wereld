# Game Template

Gebruik deze map als startpunt voor een nieuwe mini-game.

## Verplichte Structuur

```txt
game.config.ts
index.tsx
types.ts
assets/
content/
screens/
components/
logic/
state/
docs/
```

## Regels

- Gebruik alleen arrow functions.
- Gebruik shared primitives uit `src/app/game-platform`.
- Houd components klein.
- Zet business logic in `logic/`.
- Zet screen state in `state/useXController.ts`.
- Zet opdrachten en content in `content/*.data.ts`.
- Geef components `displayName`.
- Gebruik `data-component` en `data-slot` waar dat helpt voor DevTools.

## Doel

Beschrijf hier wat het kind leert.

## Gameplay

Beschrijf:

- wat het kind ziet;
- wat het kind moet doen;
- wanneer het goed/fout is;
- hoe levels moeilijker worden.

## Voortgang

Meet minimaal:

- aantal pogingen;
- aantal goede antwoorden;
- reactietijd;
- hulp gebruikt;
- afgeronde levels.

## Bestanden

- `game.config.ts` - vaste game metadata.
- `index.tsx` - game root component.
- `content/*.data.ts` - gamecontent.
- `types.ts` - types.
- `logic/` - pure spelregels.
- `state/` - controller hooks.
