# Architectuur voor gamemodules

Een game is een lazy geladen module achter het publieke `game-platform`-contract.

## Verplicht contract

Iedere game bevat minimaal:

```text
games/<game-id>/
  manifest.ts
  index.tsx
  domain/ of logic/
  tests
```

`manifest.ts` bevat een schema-gevalideerde id, contentversie, leeftijd, thema, capabilities, oriëntaties en offlinepakketdescriptors. `index.tsx` exporteert uitsluitend:

```ts
export const Game = ({ runtime }: { runtime: GameRuntime }) => ...
```

De registry importeert het lichte manifest statisch en de implementatie met `import()`.

## Toegestane afhankelijkheden

Een game mag:

- publieke exports uit `game-platform` gebruiken;
- eigen content, domeinregels, components en assets importeren;
- via `GameRuntime` oefenen, media/speech gebruiken, settings lezen en de lifecycle afsluiten.

Een game mag niet:

- app-routes, contexts, screens, Dexie of service-workerimplementaties importeren;
- een andere game importeren;
- browseropslag, browser-speech of externe observability rechtstreeks gebruiken;
- profielgegevens of ruwe kindinhoud in events/logs zetten.

## Oefenobservaties

De game levert alleen taak-id, skill-id's, uitkomst, poging, responstijd en gebruikte hulp. De runtime voegt duurzame identiteit en tijd toe. Pedagogische status, scoreprojectie en dashboardinterpretatie blijven centraal.

## UI en toegankelijkheid

Gebruik publieke `GameButton`, `GamePanel`, `GameProgressBar`, `GameShell` en andere bewezen platformprimitives. Iedere kernactie werkt met touch en toetsenbord, heeft minimaal 48×48 px, zichtbare tekst/focus en is niet uitsluitend afhankelijk van kleur, audio, spraak, hover of drag.

## Toevoegproces

1. Formuleer leerdoel, inhoudelijk eigenaar en stabiele taak-/skill-id's.
2. Maak manifest, pure regels, UI en tests.
3. Voeg één lazy entry aan `registry.ts` toe.
4. Voeg bij offlinegebruik een packagebron toe aan de assetmanifestgenerator.
5. Laat generieke contract-, projector-, accessibility-, offline- en E2E-tests slagen.
6. Meet de zelfstandige gamechunk; maximaal 250 kB gzip tenzij een ADR anders besluit.

De tweede game bewees dat geen route-, profielrepository-, database- of projectorwijziging nodig is. Wel is de appfeature voor voortgang ontdaan van een oude hardcoded eerste-gamefilter.
