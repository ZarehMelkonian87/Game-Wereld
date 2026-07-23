# Games

Actuele gamemodules:

- `strand-bezem-escape`: uitgebreide woordenschatgame;
- `rekenen-strand`: compacte hoeveelhedengame “Schelpen Tellen”.

Catalogusmetadata komt uit schema-gevalideerde manifests. De app-shell kent alleen de registry in `registry.ts`; implementaties worden dynamisch geladen.

Gebruik voor een nieuwe game het proces uit [ARCHITECTURE.md](ARCHITECTURE.md). Kopieer geen bestaande game als generieke template: begin bij het kleine `GameRuntime`-contract en deel pas code wanneer twee echte consumers dezelfde semantiek hebben.
