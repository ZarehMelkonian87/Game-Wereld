# Production Asset Staging

Deze map bevat de productie-assets en productie-kandidaten voor `+1 Woordenschat Bezem Escape`.

De originele concept-art blijft in `concept-art/generated-images`. Bestanden in deze map zijn bedoeld als praktische bron voor de implementatie.

## Structuur

- `backgrounds/` - strandscene achtergronden voor portrait en landscape.
- `objects/candidates/` - oude strandstickers, alleen bewaard als referentie.
- `objects/transparent/` - losse strandstickers met echte alpha-transparantie.
- `icons/avatars/` - 8 losse avatar-assets met echte alpha-transparantie.
- `icons/brooms/` - 6 losse bezem-assets met echte alpha-transparantie.
- `icons/mascot/` - 7 losse mascotte-assets met echte alpha-transparantie.
- `source-sheets/` - avatar-, bezem- en mascotte-sheets als bron voor latere uitsnedes.
- `asset-manifest.ts` - metadata voor assets, readiness en bronbestanden.
- `asset-preview.png` - overzicht van de huidige productie-assets.

## Asset Readiness

De strandachtergronden zijn klaar voor gebruik als scene board.

Alle productie-objecten in `objects/transparent/` hebben echte alpha-transparantie.

Alle avatar-, bezem- en mascotte-assets zijn opnieuw los gegenereerd op een chroma-key groene achtergrond en daarna lokaal omgezet naar transparante PNG's. Gebruik deze losse bestanden voor de game, niet de oude beige source sheets.
