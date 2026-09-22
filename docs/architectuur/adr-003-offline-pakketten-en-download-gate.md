# ADR-003 — Offline-pakketten, download-gate en basispaden

**Status:** geaccepteerd · **Herzien:** 2026-09-22

## Context

De games gebruiken zware media (instructievideo's, stickers, geluiden). Kinderen spelen vaak zonder stabiel netwerk, en haperende media midden in een opdracht verpest de beleving — zeker als de microfoon tegelijk actief is.

## Besluit

**Per game een offline-pakket.** Uit een bronbestand (`assets/offline-package.source.json`) genereert `scripts/generate-asset-manifest.mjs` bij elke build een manifest met per asset de url, grootte en hash. De service worker (Workbox) verzorgt de app-shell; de pakketten worden apart beheerd door de PWA-laag.

**Verificatie vóór "klaar".** Een pakket krijgt pas de status `ready` nadat élke asset is gedownload én de hash is gecontroleerd. Een half pakket is dus nooit speelklaar; een onderbroken download hervat zonder alles opnieuw te halen.

**Download-gate per platform:**

| Platform           | Gedrag                                                                    |
| :----------------- | :------------------------------------------------------------------------ |
| Desktopbrowser     | Streaming: direct speelbaar, geen gate                                    |
| Telefoon en tablet | Blokkerende gate: spelen kan pas als alle verplichte content lokaal staat |

De gate is een **pure policy** (`resolveDownloadGate`) over de pakketstatus, met fasen `checking → needs-download → sizing → confirm → downloading → verifying → ready` (of `error`). Daaromheen zit een hook die de policy aan de pakketlaag koppelt: inspecteren, grootte bepalen, downloaden met voortgang, en lokaal wissen.

**Bewuste keuzes daarbinnen:** op 4G/5G eerst een bevestiging (waarschuwen, niet blokkeren); boven 50 MB expliciet akkoord vragen; sluiten tijdens het downloaden laat de download doorlopen; verwijderen vraagt een in-app bevestiging.

**Prestatiebudgetten** staan in `config/performance-budgets.json` en worden in CI afgedwongen: app-shell JS ≤ 200 kB gzip, CSS ≤ 40 kB gzip, gamechunk ≤ 250 kB gzip, offline-pakket ≤ 200 MB, langste hoofddraadtaak ≤ 100 ms.

**Media-eisen** (volgen uit een gemeten prestatieprobleem): stickers als WebP van 30–50 kB, instructievideo's op 480p. Ongecomprimeerde media (PNG's van 200 kB, video's van 2,3 MB) concurreerden met de spraakherkenning op de hoofddraad en maakten de microfoon merkbaar traag.

## Basispaden (GitHub Pages)

De app draait in productie onder een submap (`/Game-Wereld/`). Daarom:

- `vite.config.ts` zet `base` via `scripts/resolve-base-path.mjs` (`GITHUB_PAGES=true` → `/Game-Wereld/`);
- het assetmanifest krijgt datzelfde voorvoegsel mee in elke url;
- de app vraagt manifesten op via `import.meta.env.BASE_URL`, nooit via een absoluut pad.

Een absoluut pad (`/offline/...`) werkt lokaal maar breekt op Pages — dat is één keer gebeurd en is daarom hier vastgelegd.

## Gevolgen

Na installatie is de game volledig offline speelbaar en hapert er tijdens het spelen niets meer. De prijs: een gate die het eerste spelen uitstelt, en de plicht om assets klein te houden en manifesten mee te committen na een contentwijziging.
