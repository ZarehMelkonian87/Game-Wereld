# Uitvoerrapport Groep E — PWA, assets, offlinepakketten en performance

Datum: 23 juli 2026  
Status: afgerond

## Resultaat

De PWA-status is niet langer afgeleid van alleen een geregistreerde service worker. De productiebuild genereert nu een gereviseerde Workbox-worker, ieder werkelijk gebruikt gameasset krijgt verifieerbare metadata en de UI noemt een wereld pas offline beschikbaar nadat alle verplichte bestanden op grootte, SHA-256 en aanwezigheid zijn gecontroleerd.

## Service worker en updates

- `vite-plugin-pwa` 1.3 genereert de worker via Workbox `generateSW`.
- De shell-precache bevat alleen HTML, shellcode, styles, het webmanifest en PWA-iconen.
- Lazy code, afbeeldingen en niet-gedownloade media hebben afzonderlijke, begrensde runtimecaches.
- Externe origins, `/api` en offlinepakketmanifesten worden niet onbedoeld door de navigatiefallback onderschept.
- De oude handgeschreven `public/sw.js` is verwijderd.
- Updates gebruiken `prompt`: tijdens een actieve game wordt activering uitgesteld en na veilige exit expliciet aangeboden.
- De productie-E2E simuleert N→N+1 en controleert dat de oude precache tijdens de sessie blijft bestaan en na activatie wordt opgeruimd.

Tijdens de eerste E2E werd een dubbele `manifest.webmanifest`-entry gevonden. Workbox kon daardoor de installatiefase afwijzen en de precache bleef leeg. De definitieve configuratie laat Workbox ook webmanifest en PWA-iconen rechtstreeks hashen; de test vereist nu expliciet een gevulde `index.html`-precache.

## Gegenereerd assetmanifest

`scripts/generate-asset-manifest.mjs` leest na de Vite-build de werkelijke buildmanifest-output. Het schrijft een versiegebonden pakketmanifest met URL, SHA-256, MIME-type, bytes, required-status, bron en licentie.

Actuele build:

- 113 verplichte runtimeassets;
- 172,03 MB;
- contentversie `strand-bezem-escape-2026.07`;
- 21 orphan-signalen.

Ontbrekende buildoutput, duplicate ids en onvolledige metadata blokkeren de build. De 21 orphan-signalen zijn alternatieve avatars, bezems, mascottes, wereldiconen en een alternatief logo. Ze worden niet automatisch verwijderd: zij zijn ongebruikt in de huidige build, maar niet bewezen productmatig overbodig. De visuele controle vond geen veilige één-op-één-duplicaten.

## Offlinepakketmanager

De state-machine bevat `not-downloaded`, `estimating`, `awaiting-confirmation`, `downloading`, `verifying`, `ready`, `partial`, `failed` en `outdated`.

- De UI toont eerst de pakketgrootte en de niet-bindende opslaginschatting.
- Boven 50 MB is een extra expliciete bevestiging nodig.
- Downloadvoortgang is zichtbaar en annuleren ruimt partial data op.
- Quota-, netwerk-, byte- en hashfouten kunnen nooit `ready` opleveren.
- Verwijderen en retry zijn expliciete acties.
- Cleanup bewaart maximaal twee pakketversies en beschermt het actieve pakket.
- Unsupported `navigator.storage.estimate()` wordt als “onbekend” behandeld.

## Asset- en mediaoptimalisatie

- PNG-assets zijn lossless opnieuw gecomprimeerd: 14,74 → 14,41 MB.
- Drie achtergronden hebben WebP met PNG-fallback.
- De WebP-achtergronden zijn samen circa 89 KB tegenover circa 2,7 MB voor de PNG-versies.
- De WebP-uitvoer is visueel op volledige resolutie gecontroleerd.
- Video-elementen gebruiken `preload="metadata"` in plaats van `auto`.
- De game en alle media blijven buiten de initiële shell.

De bestaande instructievideo’s zijn 1280×720 H.264/AAC en circa 1,5–2,5 MB. Een representatieve omzetting naar 960×540 werd circa 4,5 MB in plaats van 2,4 MB. Die omzetting is daarom terecht verworpen: minder pixels met bijna tweemaal zoveel bytes is geen optimalisatie.

## Performancebudgetten

De budgetcontrole rapporteert absolute grootte en verschil tegen de vastgelegde main-baseline:

| Onderdeel             |   Actueel | Budget | Verschil tegen main |
| --------------------- | --------: | -----: | ------------------: |
| Shell-JavaScript gzip | 116,88 kB | 200 kB |              −18,0% |
| Lazy gamechunk gzip   |  84,26 kB | 250 kB |              +57,0% |
| Shell-CSS gzip        |  27,78 kB |  40 kB |               +0,3% |
| Offlinepakket         | 172,03 MB | 200 MB |       nieuwe meting |

De gamechunkgroei komt door één expliciet benoemde gamechunk in plaats van verspreide anonieme gamechunks en blijft ruim binnen het absolute budget. Een node-test bewijst dat 250 kB + 1 byte de quality gate laat falen.

De productie-E2E gebruikt `PerformanceObserver` rond de kerninteractie en blokkeert een long task boven 100 ms. Build- en assetrapporten worden in CI als artifact bewaard.

## Toetsing aan Code Quality & Architecture Requirements

- Alle nieuwe en gewijzigde functies zijn arrow functions.
- Cache Storage en service-worker-API's blijven in aangewezen PWA-adapters/bootstrap.
- De catalogus importeert alleen lichte pakketdescriptors, nooit media.
- Persistente netwerkmetadata wordt met Zod gevalideerd.
- State-overgangen, klok, fetch, hashing, Cache Storage en storage estimate zijn testbaar/injecteerbaar.
- Fouttoestanden bieden retry, verwijderen, annuleren of veilig doorgaan.
- De updateprompt en offlinekaart gebruiken live status, semantische controls en minimaal 48 px hoge knoppen.
- Er zijn geen externe cache-origins en er is geen automatische session replay of inputcapture.

## Verificatie

- `npm run check`: formatting, ESLint, TypeScript, Vitest, buildscripttests en Dependency Cruiser groen.
- Unit-/integratietests: 59 geslaagd.
- Buildscripttests: 4 geslaagd.
- Productie-E2E: 5 geslaagd; de Chromium-specifieke PWA-flow is in WebKit bewust overgeslagen, terwijl de bestaande WebKit-kernflows groen zijn.
- `npm run build`: Workbox-worker en assetmanifest gegenereerd.
- `npm run check:bundle`: alle absolute en main-diffbudgetten groen.
- `npm run check:dead-code`: geen blokkerende ongebruikte code of dependencies.
- `npm audit --audit-level=high`: 0 kwetsbaarheden.

## Commitbericht voor de gebruiker

`feat(pwa): add verified offline packages and performance budgets`
