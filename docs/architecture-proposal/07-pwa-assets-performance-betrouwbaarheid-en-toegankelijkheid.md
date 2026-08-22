# 7. PWA, assets, performance, betrouwbaarheid en toegankelijkheid

## 7.1 PWA-doel

De app moet betrouwbaar werken op tablets met wisselende verbinding. Dat betekent niet dat alle circa 174 MB automatisch bij installatie wordt gecachet. We onderscheiden:

1. **App-shell beschikbaar** — profiel- en catalogusschermen openen offline.
2. **Gamecode beschikbaar** — gekozen gamechunk is lokaal.
3. **Wereldpakket beschikbaar** — alle vereiste beelden, audio en video voor die wereld zijn geverifieerd.

De UI mag alleen “offline beschikbaar” tonen wanneer niveau 3 voor het gekozen pakket is bereikt.

## 7.2 Service-workerstrategie

Vervang de handgeschreven buildlijst door Workbox met een door de build gegenereerd precachemanifest.

| Resource                  | Strategie                                                  | Reden                                        |
| ------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| HTML/navigatie            | network-first met app-shellfallback                        | Update wanneer online, bruikbaar offline     |
| Gehashte JS/CSS shell     | precache/cache-first                                       | Immutable buildassets                        |
| Gamechunks                | cache-first na eerste load of expliciete download          | Niet in initiële shell                       |
| Kleine afbeeldingen/fonts | stale-while-revalidate of packagebeleid                    | Snelle herhaling                             |
| Grote audio/video         | expliciet offlinepakket, cache-first; anders network-first | Quota en voorspelbaarheid                    |
| Externe origins           | standaard niet cachen                                      | Privacy, CORS en onbegrensde cache voorkomen |

Workbox beheert revisies en oude precache-items. De app toont een updateprompt en activeert een nieuwe versie niet midden in een gamesessie. Een mislukte dynamische import biedt retry en “app vernieuwen”.

## 7.3 Offlinepakketten

Ieder game-/wereldmanifest declareert:

- asset-URL, content hash, MIME-type en bytes;
- verplicht of optioneel;
- minimale packageversie;
- totale downloadgrootte.

Downloadproces:

1. controleer opslaginschatting en verbinding;
2. vraag expliciete bevestiging bij grote download;
3. download met voortgang en annuleren;
4. verifieer aanwezigheid en waar mogelijk hash/response;
5. schrijf pas daarna package-status `ready`;
6. ruim oude versies volgens LRU en productbeleid op.

De app ondersteunt `navigator.storage.estimate()` waar beschikbaar, maar behandelt dit als schatting. Quota-fouten leveren herstel-UI met pakketbeheer, niet een leeg catch-blok.

## 7.4 Assetpipeline

- Genereer het assetmanifest tijdens build; onderhoud geen lijst van honderden handgeschreven URL-exports.
- Comprimeer beeldassets naar passende WebP/AVIF-varianten met PNG-fallback waar transparantie/compatibiliteit dat vereist.
- Lever video in geoptimaliseerde resoluties/bitrates; test codecsteun op doelapparaten.
- Laad media van de gekozen wereld/modus, niet alle content bij boot.
- Gebruik posterframes en preload alleen metadata tenzij directe playback vereist is.
- Detecteer ontbrekende en orphan assets in CI.
- Leg licentie/attributie per asset vast.

## 7.5 Performancebudgetten

Startwaarden die na een echte devicebaseline als ADR worden bevestigd:

| Budget                           | Voorgestelde grens                                                           |
| -------------------------------- | ---------------------------------------------------------------------------- |
| Initiële shell-JavaScript        | maximaal 200 kB gzip, zonder gamecode                                        |
| Initiële shell-CSS               | maximaal 40 kB gzip                                                          |
| Eén lazy gamechunk               | maximaal 250 kB gzip, tenzij gemotiveerd                                     |
| Nieuwe offlinewereld             | grootte zichtbaar in PR en product-UI; >50 MB vereist expliciete goedkeuring |
| Long task tijdens kerninteractie | geen taak >100 ms op referentietablet                                        |
| Route/game-loadfout              | altijd herstelbare UI, nooit blanco scherm                                   |

De huidige eerste JavaScript-entry van circa 299 kB gzip is de baseline, niet de norm. Bundlevisualisatie en een CI-script vergelijken iedere PR met budget en vorige release.

Prestatie wordt daarnaast op een vast referentietablet of representatief throttlingprofiel gemeten. Alleen desktop-Lighthouse is onvoldoende voor drag, speech en media.

## 7.6 Betrouwbaarheid

- Route- en game-error boundaries met fout-id, retry en veilige exit.
- Alle browsercapabilities worden feature-detected.
- Speech heeft altijd een gelijkwaardig tik/sleepalternatief.
- Mediafouten geven herhalen, overslaan waar pedagogisch toegestaan en lokale diagnose.
- Opslagwrites zijn transactioneel en melden niet-duurzame modus.
- Open sessies worden bij crash als `crashed` of na herstel als `abandoned` afgesloten.
- Service-workerupdates wachten tot een veilige lifecyclegrens.
- Klok en randomisatie zijn injecteerbaar voor reproduceerbare tests.

## 7.7 Toegankelijkheid en kindvriendelijkheid

WCAG 2.2 AA is de technische ondergrens; kindvriendelijkheid voegt strengere productregels toe:

- interactieve doelen zijn minimaal 48×48 CSS-pixels met voldoende tussenruimte;
- alle acties werken met toetsenbord en logische focusvolgorde;
- icon-only controls hebben een toegankelijke naam;
- kleur is nooit de enige informatiedrager;
- instructies hebben visueel én auditief equivalent;
- captions/tekstalternatief is beschikbaar voor essentiële video/audio;
- beweging respecteert `prefers-reduced-motion` en kan niet noodzakelijk zijn voor begrip;
- tijdslimieten zijn vermijdbaar of aanpasbaar;
- statusfeedback gebruikt passende live regions zonder overmatige aankondigingen;
- portrait, landscape, zoom en safe areas worden getest;
- microfoontoestemming wordt in kindvriendelijke taal uitgelegd en weigeren blokkeert de game niet.

Geautomatiseerde axe-tests vinden slechts een deel van problemen. Iedere release bevat ook handmatige toetsenbord-, screenreader-, contrast-, touch- en kindflowcontroles.

## 7.8 UX-consistentie zonder “Atomic Design”-dogma

Platform-UI bevat tokens, toegankelijke primitives en game-layouts. Het doel is consistent gedrag, niet een verplichte atoom/molecuulhiërarchie. Een primitive documenteert:

- interactiestates;
- toetsenbord- en screenreadergedrag;
- touch target;
- reduced motion;
- visuele varianten via tokens;
- tests en voorbeeldgebruik.

Games mogen een eigen visuele identiteit hebben, maar wijzigen geen semantiek van terug, pauze, audio, hint, voortgang en exit.
