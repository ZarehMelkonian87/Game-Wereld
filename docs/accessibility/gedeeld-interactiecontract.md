# Gedeeld interactiecontract

Status: normatief  
Eigenaar: frontendteam  
Laatste controle: 23 juli 2026

## UI-basis

De app gebruikt browsersemantiek als basis en de componenten uit `src/app/game-platform/components` voor game-UI. Radix/shadcn-bestanden onder `src/app/components/ui` zijn alleen een bestaande, lokaal beheerde catalogus voor appschermen; zij vormen geen tweede designsysteem. Nieuwe gamecode importeert uitsluitend de publieke game-platformcomponenten.

De inventarisatie vond actief gebruik van de platformprimitives `GameButton`, `GameIconButton`, `GameProgressBar`, `GamePanel`, `GameStarCounter`, `ObjectTray` en `StickerObject`. De appcatalogus bevat daarnaast veel ongebruikte Radix/shadcn-bestanden. Die worden in Groep F bewust niet verwijderd: Knip behandelt de catalogus als een begrensde uitzondering en een productbesluit over de catalogus hoort bij legacy-opruiming in Groep H.

## Verplicht gedrag

### Acties

- Gebruik een native `button` met standaard `type="button"` voor een actie.
- Zichtbare tekst is de toegankelijke naam. Een icon-only knop heeft een expliciete `aria-label`.
- Terug betekent één niveau terug; verlaten betekent terug naar menu of app. Gebruik nooit hetzelfde icoon met wisselende betekenis.
- Audio heet `Luister …` wanneer een opdracht wordt herhaald en `Geluid aan/uit` wanneer een instelling wordt gewijzigd.
- Hint is een normale actie en geen pointer-only long-press. Pauze en hervatten zijn toggle-acties met `aria-pressed`.
- Een disabled actie gebruikt het native `disabled`-attribuut en blijft visueel herkenbaar.

### Focus en touch

- Kindgerichte doelen zijn minimaal 48×48 CSS-pixels.
- Iedere interactieve primitive heeft een zichtbare `focus-visible`-ring die niet alleen op kleurverandering berust.
- Focus volgt de visuele leesvolgorde en wordt niet automatisch verplaatst, behalve bij een modal of routewissel.
- Hover mag feedback toevoegen, maar nooit informatie of functionaliteit exclusief maken.

### Voortgang en feedback

- Voortgang gebruikt `role="meter"` met naam, minimum, maximum en actuele waarde.
- Selectie/toggles publiceren `aria-pressed=true|false`; `false` mag niet worden weggelaten.
- Opdracht, fout en succes zijn altijd als tekst beschikbaar. Audio/video is aanvullend.
- Statusverandering die zonder focuswisseling gebeurt, krijgt waar nodig een begrensde live-region.

### Beweging

- `MotionConfig reducedMotion="user"` is de gedeelde bron voor Motion-animaties.
- CSS-transities en decoratieve animaties worden onder `prefers-reduced-motion: reduce` gestopt of praktisch onmiddellijk afgerond.
- Essentiële status blijft zichtbaar wanneer beweging uitstaat.

## Alternatieve bediening

- Spraak heeft altijd een typ-/taproute met dezelfde parser en dezelfde oefenuitkomst.
- Geweigerde microfoontoestemming is een capabilitystatus met uitleg en directe fallback, geen crash of blokkade.
- De scene ondersteunt slepen, selecteer-en-tik én toetsenbordplaatsing. Bij toetsenbordplaatsing verplaatsen pijltoetsen een zichtbaar kruispunt; Enter/spatie kiest de plek.
- De vliegbediening reageert op pointer én Enter/spatie, met loslaten op key-up.
- Iedere audio- of video-opdracht toont dezelfde opdracht als tekst.

## Testcontract

- Componenttests controleren rollen, namen, toggle-/disabledstatus, 48px-klassen, reduced-motionklassen en axe.
- JSDOM schakelt alleen de axe-regel `color-contrast` uit, omdat JSDOM geen CSS-layout/canvas levert. Eigenaar van deze uitzondering is de release-reviewer; de Playwright-audit controleert contrast in een echte browser op alle kernschermen.
- Playwright blokkeert WCAG 2.2 A/AA-overtredingen op welkom, profielselectie, catalogus, GameHost, instellingen en voortgang.
- Chromium en WebKit doorlopen daarnaast de geweigerde-microfoon- en toetsenbordfallback.
