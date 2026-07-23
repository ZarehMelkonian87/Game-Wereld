# Releaserunbook

Eigenaar: releaseverantwoordelijke  
Laatste proef: 23 juli 2026

## Voorbereiding

1. Werk vanaf een schone checkout met Node/npm uit `.nvmrc` en `package.json`.
2. Controleer open ADR's, migraties en `docs/architecture/temporary-exceptions.md`.
3. Zet een unieke `VITE_APP_RELEASE` die overeenkomt met de release/tag.
4. Bewaar nooit secrets in `VITE_*`; alle waarden worden clientcode.

## Blokkerende pipeline

```sh
npm ci
npm run check
npm run build
npm run check:bundle
npm run check:dead-code
npm audit --audit-level=high
npm run test:e2e -- --workers=1
```

Controleer daarna:

- beide gamechunks staan als dynamische entries in `dist/.vite/manifest.json`;
- ieder manifestdescriptor heeft een bestand in `dist/offline`;
- shell ≤200 kB gzip, iedere gamechunk ≤250 kB gzip en CSS ≤40 kB gzip;
- assetrapport heeft geen nieuw onverklaard orphan-signaal;
- `_headers` staat in `dist` en productiehosting retourneert dezelfde CSP/securityheaders;
- migration-, cascade-, rebuild-, offline-, service-worker- en accessibilitytests zijn groen.

## Handmatige browser-/devicecheck

Voer Chromium-tablet en fysieke iPad/Safari uit:

1. profiel maken, herladen en selecteren;
2. beide games openen en één opdracht voltooien;
3. voortgang voor woordenschat én rekenen tonen;
4. microfoon weigeren en de tekstfallback gebruiken;
5. beide offlinepakketten controleren/downloaden, netwerk uitschakelen en openen;
6. update tijdens game uitstellen en na exit activeren;
7. toetsenbord, screenreader, 200% zoom, reduced motion, portrait/landscape en 48px touchdoelen;
8. privacyexport controleren en profiel cascade-verwijderen.

## Uitrol en rollback

- Publiceer alleen exact de geteste build.
- Activeer een service-workerrelease niet midden in een gamesessie.
- Rollback publiceert de vorige complete shell, chunks, offline manifests en service worker als één set.
- Verwijder geen IndexedDB of legacykeys tijdens rollback.
- Controleer na rollback een bestaande profielmigratie en eerder gedownload offlinepakket.

Destructief en altijd met expliciete begeleidersbevestiging:

- profiel verwijderen;
- lokale database opnieuw maken;
- offlinepakket/cache verwijderen;
- legacykeys verwijderen na de formele rollbackperiode.
