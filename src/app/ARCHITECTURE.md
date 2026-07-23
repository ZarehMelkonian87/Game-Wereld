# Actuele apparchitectuur

Status: geïmplementeerd op 23 juli 2026.

De normatieve regels staan in [`docs/code-quality-and-architecture.md`](../../docs/code-quality-and-architecture.md). Dit document beschrijft uitsluitend de actuele hoofdstructuur.

## Model

Game Wereld is één offline-first modulaire frontendmonoliet:

```text
bootstrap
  -> app-shell en routes
     -> features
     -> GameHost
        -> GameRuntime
           -> lazy gamemodule
  -> storage-, PWA- en diagnostiekadapters
```

## Eigenaarschap

| Module                                 | Verantwoordelijkheid                                                       |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `main.tsx`, `registerServiceWorker.ts` | bootstrap en PWA-registratie                                               |
| `screens`, `contexts`, `data`          | app-shellfeatures en catalogusweergave                                     |
| `game-host`                            | manifestcontrole, capabilities, lazy loading, sessielifecycle en foutgrens |
| `game-platform`                        | publieke gamecontracten, gedeelde game-UI en browser-/testadapters         |
| `games/<id>`                           | manifest, content, pure regels, UI en game-eigen assets                    |
| `storage`                              | Zod-schema's, repositories, Dexie, migratie en projecties                  |
| `pwa`                                  | updatebeleid en geverifieerde offlinepakketten                             |
| `diagnostics`                          | allowlisted lokale events, ringbuffer en developmentpaneel                 |

Dependency Cruiser blokkeert game-naar-game-, game-naar-app-, game-naar-storage-, platform-naar-game-, adapterlek- en circulaire imports.

## Datastroom

Een game ontvangt één `GameRuntime` met identiteit, klok, ids, oefenwriter, media, speech, storage, diagnostics en lifecycle. De host vult profiel-, sessie-, game- en contentidentiteit aan. Oefenobservaties worden als versieerbare events transactioneel opgeslagen en naar een herbouwbare voortgangsprojectie vertaald.

De app-shell kent uitsluitend manifests en lazy loaders. Zij importeert geen game-implementatie of game-assets. Iedere game heeft een eigen productiechunk en optioneel een afzonderlijk offlinepakket.

## Fout- en offlinebeleid

- Route- en GameHost-boundaries houden crashes binnen hun eigenaar.
- Storage-, game-, speech- en service-workerfouten krijgen veilige correlation-id's.
- Het diagnosepaneel is development-only; productie bevat geen externe observability-SDK.
- Een offlinepakket wordt pas `ready` na byte-, hash- en required-assetcontrole.
- Service-workerupdates wachten tot een actieve gamesessie veilig is verlaten.

## State

- componentstate: uitsluitend lokale renderinteractie;
- gamesessiestate: gamecomponent/controller;
- shellstate: begrensde featureproviders;
- duurzame data: repositories;
- assets: HTTP-/Cache Storage.

Er is geen globale store- of state-machinelibrary: de twee huidige games leveren geen meetbare complexiteitswinst die zo'n dependency rechtvaardigt.
