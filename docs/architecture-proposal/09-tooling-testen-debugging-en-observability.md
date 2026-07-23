# 9. Tooling, testen, debugging en observability

## 9.1 Aanbevolen toolset

| Doel | Keuze | Waarom hier passend |
| --- | --- | --- |
| Typeveiligheid | `tsc --noEmit` | Vangt fouten die Vite-build nu laat passeren |
| Lint | ESLint flat config + typescript-eslint + React Hooks + jsx-a11y | Correctheid, effects, imports en toegankelijkheid in editor/CI |
| Format | Prettier | Elimineert stijldiscussies; geen architectuurtool |
| Unit/component | Vitest + Testing Library | Sluit aan op Vite/React en ondersteunt snelle pure tests |
| Browser/E2E | Playwright | Chromium, WebKit, Firefox, device-emulatie en rijke traces |
| Accessibility | `@axe-core/playwright` | Automatiseert veel detecteerbare WCAG-overtredingen |
| Opslag | Dexie | Dunne IndexedDB-laag met transacties en migraties |
| Grensvalidatie | Zod | Runtime-schema's die TypeScripttypes aanvullen |
| Architectuur | Dependency Cruiser | Blokkeert verboden imports en cycles |
| Dode code | Knip | Vindt ongebruikte files, exports en dependencies |
| PWA | Workbox, bij voorkeur via een onderhouden Vite-integratie | Build-revisies, precache, runtimecache en update-events |
| Bundles | Rollup visualizer + klein budgetscript | Zichtbaar welke import de entry vergroot |
| Regressieperformance | Lighthouse CI plus echte devicechecks | Snelle PR-signalering, aangevuld met relevante interactietests |

Bronnen en actuele documentatie:

- [Vite: TypeScript wordt getranspileerd; voer `tsc --noEmit` apart uit](https://main.vite.dev/guide/features)
- [Vitest-documentatie](https://vitest.dev/guide/)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer-intro)
- [Playwright accessibility testing met axe](https://playwright.dev/docs/accessibility-testing)
- [Dexie-documentatie](https://dexie.org/docs)
- [Dependency Cruiser](https://github.com/sverweij/dependency-cruiser)
- [Knip: hoe ongebruikte code en dependencies worden gevonden](https://knip.dev/explanations/how-knip-works)
- [Workbox: precaching en revisiebeheer](https://developer.chrome.com/docs/workbox/modules/workbox-precaching)
- [ESLint flat configuration](https://eslint.org/docs/latest/use/configure/configuration-files)

Versies worden bij implementatie gekozen op compatibiliteit met de dan gebruikte Node-, React- en Viteversies; dit document pint bewust geen toekomstige packageversies.

## 9.2 Lokaal ontwikkelcommando

Voorgestelde scripts:

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "format:check": "prettier . --check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:architecture": "depcruise src",
    "test:e2e": "playwright test",
    "check": "npm run format:check && npm run lint && npm run typecheck && npm run test && npm run test:architecture",
    "build": "vite build"
  }
}
```

In CI worden commando's waar mogelijk parallel uitgevoerd, maar `build` start pas na typecheck en architectuurcontrole.

## 9.3 Debugmodus in de app

React DevTools alleen is onvoldoende voor een game met speech, media, service worker en lokale data. Bouw een uitsluitend in development of via een beveiligde begeleidersactie beschikbare `DiagnosticsPanel`.

Toon minimaal:

- apprelease en build-id;
- route, game-id, contentversie en geanonimiseerde session-id;
- huidige game-state/tag en opdracht-id;
- capabilitystatus voor audio, speech, microfoon, IndexedDB, Cache Storage en service worker;
- storage mode, databaseversie, schatting van gebruik/quota en laatste migratie;
- actief offlinepakket en ontbrekende assets;
- laatste maximaal 100 gestructureerde diagnostiekevents;
- laatste fout met correlation-id;
- knoppen voor gesaniteerde diagnose-export, cache-inspectie en gecontroleerde retry.

Het panel toont geen kindnaam, ruwe transcriptie of volledige oefenantwoorden.

## 9.4 Gestructureerde logging

Definieer één loggercontract:

```ts
type DiagnosticEvent = {
  at: string;
  level: "debug" | "info" | "warn" | "error";
  subsystem: "storage" | "speech" | "media" | "pwa" | "game" | "routing";
  name: string;
  correlationId?: string;
  safeContext?: Record<string, string | number | boolean | null>;
};
```

- Developmentadapter schrijft leesbaar naar console en ringbuffer.
- Testadapter verzamelt events voor assertions.
- Productieadapter bewaart lokaal een korte ringbuffer en kan onverwachte fouten naar een goedgekeurde externe reporter sturen.
- Logvelden worden met een allowlist opgebouwd; achteraf blacklisten is onvoldoende.

## 9.5 Productiefoutmonitoring

Sentry of een gelijkwaardig platform is **optioneel**, niet automatisch onderdeel van de basis. Invoering vereist privacy- en contractbeoordeling. Als het wordt gebruikt:

- alleen onverwachte errors en beperkte technische performance;
- release-id en correct geüploade source maps;
- `beforeSend`-scrubbing en allowlisted tags;
- geen naam, profiel-id, transcript, taskinhoud of audio;
- session replay en DOM/input recording uit;
- lage sampling en bewaartermijn;
- game- en route-error boundaries koppelen correlation-id aan melding;
- source maps worden niet publiek meegehost als dat vermijdbaar is.

Een lokale diagnose-export blijft nodig, omdat devices offline kunnen zijn en externe telemetrie niet altijd is toegestaan.

## 9.6 Reproduceerbare browseradapters

Maak fakes voor:

- klok en timers;
- UUID-generator en seeded random;
- speech recognitionresultaten, time-outs en permission denial;
- speech synthesis en audio/video completion/error;
- storage quota, corrupt record en migratiefout;
- online/offline en service-workerupdate;
- Cache Storage-download met partial failure.

Hiermee kan een mislukte sessie via seed + gesaniteerde events lokaal opnieuw worden afgespeeld zonder kinddata.

## 9.7 Playwrightstrategie

Projecten:

- `chromium-tablet` als snelle PR-default;
- `webkit-tablet` voor Safari/iPad-gerelateerde risico's;
- `firefox-desktop` als compatibiliteitssignaal;
- portrait en landscape voor kernflows.

Configuratie:

- trace `on-first-retry`;
- screenshot bij falen;
- video alleen waar privacy en CI-opslag dit toestaan;
- console errors falen de test, met allowlist voor bekende browsermeldingen;
- netwerk- en capabilityfakes zijn deterministisch;
- een aparte offlineprojecttest start vanaf een productiebuild met service worker.

## 9.8 Componentontwikkeling

Voeg Storybook niet standaard toe. Begin met kleine render-harnesses of Vitest Browser Mode voor gedeelde primitives. Voeg Storybook pas toe wanneer designers/ontwikkelaars aantoonbaar een zelfstandig componentcatalogusproces nodig hebben. Zo voorkomen we een tweede build- en configuratieoppervlak zonder huidige consumer.

## 9.9 Debugrunbook

Bij een gemeld probleem:

1. noteer release, device/browser, route en correlation-id;
2. importeer of bekijk de gesaniteerde diagnose-export;
3. controleer capability-, storage-, SW- en pakketstatus;
4. reproduceer met dezelfde seed en fake adapterevents;
5. voeg eerst een falende unit/integratie/E2E-test toe;
6. herstel de kleinste eigenaarmodule;
7. controleer typecheck, contracttest, offlinepad en privacyvelden;
8. leg alleen een ADR vast als de oplossing een blijvende systeemkeuze verandert.

## 9.10 Tooling die bewust niet standaard wordt gekozen

- Geen globale stateframeworks zonder profilerbewijs.
- Geen backend-analyticsstack voor lokale leerprogressie.
- Geen session replay voor een kindapp.
- Geen monorepotooling zolang er één package/deployment is.
- Geen automatische runtime plugin discovery.
- Geen maximale-regelaantallinter als vervanging voor designreview.
