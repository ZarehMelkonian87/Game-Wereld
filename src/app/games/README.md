# Games

Actuele gamemodules:

- `magisch-strand-avontuur`: uitgebreide woordenschatgame;
- `groot-circus-avontuur`: in aanbouw, in de catalogus als "Binnenkort beschikbaar";
- `catalog-manifests.ts`: placeholders (rekenen, taal, wereld) die alleen een vergrendelde kaart tonen.

Catalogusmetadata komt uit schema-gevalideerde manifests. De app-shell kent alleen de registry in `registry.ts`; implementaties worden dynamisch geladen.

Gebruik voor een nieuwe game het proces uit [ARCHITECTURE.md](ARCHITECTURE.md). Kopieer geen bestaande game als generieke template: begin bij het kleine `GameRuntime`-contract en deel pas code wanneer twee echte consumers dezelfde semantiek hebben.
