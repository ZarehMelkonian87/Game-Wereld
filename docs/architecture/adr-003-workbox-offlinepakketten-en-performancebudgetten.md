# ADR-003 — Workbox, offlinepakketten en performancebudgetten

Status: geaccepteerd  
Datum: 23 juli 2026  
Eigenaar: opdrachtgever/repository-eigenaar

## Context

De app gebruikte `public/sw.js` met een handmatig cacheversienummer en een handgeschreven shelllijst. De worker sloot grote media bewust uit, maar de UI kon daardoor niet aantonen of een wereld volledig offline beschikbaar was. Assetmetadata, pakketverificatie en een veilige updategrens tijdens games ontbraken.

Het huidige Strand-pakket bevat 113 daadwerkelijk door de productiebuild gebruikte gamecode- en media-assets en is circa 172,03 MB. Automatisch precachen is daarom onwenselijk. De opdrachtgever heeft het architectuurvoorstel geaccepteerd en Groep E expliciet voor uitvoering vrijgegeven. Daarmee is de pakketgrootte boven de productgrens van 50 MB voor deze bestaande wereld expliciet geaccepteerd, mits de UI vóór download de grootte toont en opnieuw bevestiging vraagt.

## Besluit: Vite PWA en Workbox

We gebruiken `vite-plugin-pwa` 1.3 met Workbox `generateSW` en registratiemodus `prompt`. De integratie is actief onderhouden en bouwt op `workbox-build`. Zie de [Vite PWA-documentatie](https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors) en de [Workbox build-documentatie](https://developer.chrome.com/docs/workbox/modules/workbox-build/).

De handgeschreven `public/sw.js` vervalt. De productiebuild genereert `dist/sw.js`, een revisie per precache-entry en de benodigde lokale Workbox-runtime.

| Resource                                      | Beleid                                                                 |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| App-shell HTML, CSS, JavaScript en PWA-iconen | Build-gegenereerde precache                                            |
| Navigatie                                     | Precachefallback naar `index.html`; `/api` en `/offline` uitgesloten   |
| Lazy code en styles                           | Zelfde origin, cache-first, maximaal 80 entries en 30 dagen            |
| Kleine afbeeldingen                           | Zelfde origin, stale-while-revalidate, maximaal 80 entries en 30 dagen |
| Niet-gedownloade audio/video                  | Network-first, maximaal 12 entries en 1 dag                            |
| Gedownload wereldpakket                       | Eigen versiegebonden Cache Storage-cache                               |
| Externe origins                               | Niet cachen                                                            |

Een nieuwe worker activeert niet automatisch. De app toont een updateprompt. Tijdens een actieve `GameHost`-sessie verandert die in “Update klaar na dit spel”; activering kan pas na veilige exit. Workbox ruimt oude precacheversies pas op wanneer de nieuwe worker activeert.

## Besluit: gegenereerd assetmanifest

Na iedere Vite-build leest `scripts/generate-asset-manifest.mjs` de werkelijke `.vite/manifest.json`. Het genereert per gebruikt gameasset:

- stabiele bron-id en gehashte build-URL;
- SHA-256;
- MIME-type en bytes;
- required-status;
- bron en licentie;
- content- en pakketversie.

De build faalt bij ontbrekende verplichte output, duplicate ids of onvolledige metadata. Niet-gebruikte bronassets worden alleen als orphan-signaal in `reports/asset-report.json` gezet. Ze worden niet automatisch verwijderd, omdat visuele, product- en licentiecontrole nodig blijven.

Het lichte gamemanifest bevat alleen pakket-id, manifest-URL, contentversie en pakketversie. Daardoor importeert de catalogus geen media.

## Besluit: offlinepakket-state-machine

De adapter modelleert:

`not-downloaded → estimating → awaiting-confirmation → downloading → verifying → ready`

Daarnaast bestaan `partial`, `failed` en `outdated`. De UI gebruikt `navigator.storage.estimate()` alleen als niet-bindende schatting. Een download kan worden geannuleerd en maakt partial data daarna schoon. Quota-, netwerk-, byte- en hashfouten worden nooit `ready`.

`ready` vereist:

1. succesvolle download van ieder required asset;
2. exacte bytegrootte;
3. correcte SHA-256;
4. een tweede aanwezigheidcontrole in Cache Storage;
5. versiegebonden metadata.

Pakketverwijdering is expliciet. Versiecleanup is begrensd tot twee offlinepakketten en beschermt het actieve downloadpakket. De enige huidige wereld heeft één pakket; het beleid is voorbereid op uitbreiding.

## Besluit: media en performance

PNG-bronnen zijn lossless opnieuw gecomprimeerd. De drie grote achtergronden hebben WebP-varianten met PNG-fallback. De WebP-varianten zijn samen circa 89 KB tegenover circa 2,7 MB PNG en zijn visueel gecontroleerd.

Instructievideo’s zijn H.264/AAC, 1280×720 en gemiddeld circa 1,5–2,5 MB. Een gecontroleerde omzetting naar 960×540 maakte de representatieve video circa 90% groter. Daarom behouden we de bestaande encodes en wijzigen we de consumptie: video-elementen gebruiken `preload="metadata"` en media blijft buiten de shell.

De blokkerende budgetten zijn:

- shell-JavaScript: 200 kB gzip;
- shell-CSS: 40 kB gzip;
- lazy gamechunk: 250 kB gzip;
- bestaand offlinepakket: 200 MB absoluut, met expliciete ADR-goedkeuring boven 50 MB;
- kerninteractie: geen long task boven 100 ms in het Chromium-referentieprofiel.

Het budgetrapport toont absolute waarde en verschil tegenover de vastgelegde main-baseline. CI archiveert asset-, beeldoptimalisatie- en performancerapporten.

## Verificatie

- Unit tests dekken packageverificatie, annuleren, quota, update-uitstel en activatie.
- Buildtests dekken manifeststructuur, ontbrekende assets, duplicate ids en een bewust te groot testchunk.
- De productie-E2E simuleert N→N+1, stelt de update uit tijdens een game, activeert na exit, controleert precachecleanup, downloadt een verifieerbaar fixturepakket en herlaadt de game zonder netwerk.
- Dezelfde E2E meet de kerninteractie met `PerformanceObserver`.

## Gevolgen

- “Offline beschikbaar” betekent nu aantoonbaar dat alle required assets zijn geverifieerd.
- De shell blijft klein en bevat geen game-media.
- Nieuwe of gewijzigde assets krijgen automatisch nieuwe build-URL's en hashes.
- Een nieuwe wereld boven 50 MB vereist opnieuw een expliciete ADR of aanpassing van deze goedkeuring.
- De 21 huidige orphan-signalen blijven staan voor afzonderlijke product-/licentiebeoordeling; deze ADR autoriseert geen verwijdering.
