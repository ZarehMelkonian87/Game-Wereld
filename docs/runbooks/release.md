# 🚀 Releaserunbook

> Van groene branch naar een werkende versie op GitHub Pages.

**Laatst bijgewerkt:** 2026-09-22

## 1. Voorbereiding

1. Schone checkout, Node-versie uit `.nvmrc` (22.x).
2. `npm ci`
3. Controleer dat er geen openstaande taken in het gamedossier op "in uitvoering" staan die deze release raken.
4. Secrets horen nooit in een `VITE_*`-variabele: alles daarin wordt clientcode.

## 2. Blokkerende controles

```sh
npm run check          # format, lint, types, unit, scripttests, architectuur, documentlinks
npm run check:dead-code
npm run build
npm run check:bundle
npm run test:e2e -- --project=chromium-tablet
```

Controleer daarna:

- elke gamechunk staat als dynamische entry in `dist/.vite/manifest.json`;
- elk offline-manifest in `dist/offline/` heeft bestaande bestanden;
- de budgetten uit `config/performance-budgets.json` worden gehaald;
- het assetrapport toont geen nieuw, onverklaard orphan-signaal;
- `_headers` staat in `dist` en de hosting geeft dezelfde CSP- en securityheaders terug.

**Contentwijziging?** De offline-manifesten in `public/offline/` worden door de build opnieuw gegenereerd. Commit ze mee, anders wijkt de gepubliceerde inhoud af van wat de app verwacht.

## 3. Uitrol (GitHub Pages)

Pushen naar `main` start twee workflows: **Quality** (de controles hierboven) en **Deploy to GitHub Pages** (`npm run build` met `GITHUB_PAGES=true`, daarna publiceren).

> ⚠️ **Controleer eenmalig de Pages-bron.** Staat _Settings → Pages → Build and deployment → Source_ op "Deploy from a branch: main", dan publiceert GitHub de **ruwe broncode** en wint die soms van onze gebouwde versie — een race die zich uit als "de game laadt niet" en 404's op `offline/*.json` en `sw.js`. De bron hoort op **GitHub Actions** te staan (of op de branch `gh-pages`, waar de workflow de gebouwde app neerzet).

Controle na de deploy:

```sh
curl -s -o /dev/null -w "%{http_code}\n" https://zarehmelkonian87.github.io/Game-Wereld/offline/magisch-strand-avontuur-beach-v1.json   # 200
curl -s -o /dev/null -w "%{http_code}\n" https://zarehmelkonian87.github.io/Game-Wereld/package.json                                    # 404
```

De eerste moet **200** geven (het manifest staat er), de tweede **404** (broncode hoort niet gepubliceerd te zijn).

## 4. Controle op een echt toestel

1. Open de site; kies **Nu bijwerken** als de update-melding verschijnt, of verwijder de geïnstalleerde app en installeer opnieuw.
2. Controleer in _Instellingen → Microfoon-diagnose_ dat **Build** een tijd ná de deploy toont.
3. Speel per modus één opdracht, met spraak.
4. Download het offline-pakket, zet het netwerk uit en start het spel opnieuw.
5. Loop de [toegankelijkheidscheck](../toegankelijkheid/release-checklist.md) door.

## 5. Terugrollen

- Publiceer alleen exact de geteste build.
- Terugrollen = de vorige commit opnieuw deployen (workflow handmatig starten op die commit). De offline-pakketten zijn per contentversie gesleuteld, dus een oudere build vraagt netjes opnieuw om de bijbehorende content.
- Activeer een service-workerupdate niet midden in een spelsessie: de app wacht daar zelf op ("Update klaar na dit spel").
