# Uitvoerrapport Groep F — Toegankelijkheid en gedeelde UI

Datum: 23 juli 2026  
Status: afgerond

## Resultaat

De gedeelde gameprimitives hebben nu één expliciet interactiecontract voor semantiek, focus, 48×48 touchdoelen, toggle-state en reduced motion. Spraak, slepen en audio zijn niet langer noodzakelijke voorwaarden voor de kernopdracht: typen gebruikt dezelfde commandoparser, de scene ondersteunt pijltoetsen plus Enter/spatie en alle instructies blijven tekstueel zichtbaar.

## Inventarisatie en keuzes

- Actief gebruikte gamebasis: `GameButton`, `GameIconButton`, `GameProgressBar`, panelen, objecttray en stickerknoppen.
- Terug, audio, hint, bevestigen en voortgang gebruiken gedeelde primitives met vaste betekenis.
- De appbrede Radix/shadcn-catalogus bevat veel ongebruikte bestanden. Er is niets speculatief verwijderd; Knip en build blijven de verwijderpoort en Groep H bezit de catalogusopruiming.
- Er is geen nieuwe UI-library of state-machine toegevoegd. `axe-core` is alleen een directe testdependency.

## Inclusieve kernflows

- Microfoon `denied` levert een normale statusmelding en opent de typfallback.
- De typfallback voert dezelfde zin via dezelfde parser en oefenregistratie uit.
- De audit vond een echte ambiguïteit in “ver weg boven de zee”: de parser koos soms `boven` in plaats van de langste relatie `ver weg`. Langste expliciete relatiefrasen winnen nu, met een regressietest voor alle zelfstandige opdrachtzinnen.
- Slepen blijft beschikbaar, maar selecteer-en-tik en een zichtbaar toetsenbordkruispunt zijn gelijkwaardige plaatsingsroutes.
- Pijltoetsen bewegen in begrensde stappen; Enter/spatie plaatst. De vliegknoppen ondersteunen eveneens Enter/spatie.
- Opdrachtvideo, audio, hints, fouten en succes hebben zichtbare tekst.

## Automatische audit

`@axe-core/playwright` controleert zonder generieke excludes:

1. welkom;
2. profielselectie;
3. catalogus;
4. GameHost/startscherm;
5. instellingen;
6. voortgang.

Chromium en WebKit voeren ook een opdracht uit met geweigerde microfoon en toetsenbordbediening. Kritieke overtredingen blokkeren de bestaande browser-smokejob. Het volledige Playwright QA-artifact wordt veertien dagen bewaard, ook als de job groen is.

De component-axe-test schakelt uitsluitend `color-contrast` uit omdat JSDOM geen CSS-layout/canvas kan berekenen. Dit is geen release-exceptie: dezelfde regel blijft actief in de echte Chromium-/WebKit-audit. Eigenaar: release-reviewer. Bekende productfalse-positives: geen.

## Handmatige controle

Uitgevoerd op de productiebuild in de in-app browser:

- semantische namen van welkom en profielselectie gecontroleerd;
- toetsenbordactivering is aanvullend in echte Chromium-/WebKit-E2E bewezen;
- portrait 768×1024 en landscape 1024×768: geen horizontale of verticale documentoverflow;
- 200%-zoomequivalent 512×384: geen horizontale documentoverflow of verlies van de primaire profielactie;
- profielactie gemeten op 242×160 px;
- reduced motion is afgedwongen via MotionConfig en de globale mediaquery; de geautomatiseerde browsermatrix blijft de herhaalbare releasepoort.

De device-screenreaderproef op fysieke iPad/Android blijft onderdeel van iedere echte releasecheck; lokale automatisering claimt die menselijke proef niet te vervangen.

## Toetsing aan Code Quality & Architecture Requirements

- Alle nieuwe en gewijzigde functies zijn arrow functions.
- De game importeert geen appcontext of browserinfrastructuur voor toegankelijkheid.
- Alternatieven delen bestaande domeinlogica en creëren geen tweede voortgangspad.
- Controls gebruiken native semantiek, toegankelijke namen, native disabledstate, zichtbare focus en minimaal 48px-doelen.
- Privacy: weigering vereist geen transcriptopslag; typen volgt het bestaande lokale runtimecontract.
- Component-, logica-, axe- en E2E-tests dekken gedrag via rollen en zichtbare feedback.

## Verificatie

- `npm run lint`: groen.
- `npm run typecheck`: groen.
- `npm run test`: 14 bestanden, 68 tests groen.
- `npm run build`: groen.
- `npm run test:e2e:a11y`: 4 tests groen in Chromium en WebKit.
- `npm run test:e2e`: 9 tests groen, 1 bewuste WebKit-skip voor de Chromium-specifieke PWA-proef. De productieproeven draaien serieel omdat de PWA-updateproef tijdelijk gedeelde `dist`/service-workerbestanden vervangt.
- Volledige kwaliteitsstraat, Knip, audit, bundlebudget en volledige E2E worden bij de finale Groep F-controle opnieuw uitgevoerd.

## Commitbericht voor de gebruiker

`feat(a11y): standardize inclusive controls and game alternatives`
