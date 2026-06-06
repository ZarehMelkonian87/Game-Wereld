# Production Assets

Deze map bevat alleen de productie-assets die we in de app willen kunnen gebruiken.

Oude candidates, source sheets, lokale previews en gegenereerde conceptbeelden zijn verwijderd om de repository klein en overzichtelijk te houden.

## Structuur

- `backgrounds/` - strandscene achtergronden voor portrait, landscape en side-scroller race.
- `audio/` - achtergrondmuziek en later eventuele korte geluidseffecten.
- `objects/transparent/` - losse strandstickers met echte alpha-transparantie.
- `icons/avatars/` - 8 losse avatar-assets met echte alpha-transparantie.
- `icons/brooms/` - 6 losse bezem-assets met echte alpha-transparantie.
- `icons/mascot/` - 7 losse mascotte-assets met echte alpha-transparantie.
- `instructions/` - korte video-opdrachten met animatie en voice-over.
- `logos/` - productie-logo voor het startscherm.
- `asset-manifest.ts` - metadata voor productie-assets.

## Asset Readiness

- De strandachtergronden zijn klaar voor gebruik als scene board en raceachtergrond.
- Alle productie-objecten in `objects/transparent/` hebben echte alpha-transparantie.
- Avatar-, bezem- en mascotte-assets zijn losse transparante PNG's.
- Instructievideo's zijn alleen toegevoegd wanneer ze gekoppeld zijn aan een concrete opdracht-id.
- Nieuwe bronbeelden of conceptvarianten horen niet in `assets/` totdat ze als productie-asset gekozen zijn.
