# ♿ Interactiecontract

> **Normatief.** Deze regels gelden voor alle schermen, in de app-schil én in de games. Ze zijn de basis van de axe-audits en de componenttests.

**Laatst bijgewerkt:** 2026-09-22

## Uitgangspunt

Browsersemantiek is de basis. Game-UI gebruikt de primitives uit `src/app/game-platform/components`; elke game heeft daarnaast zijn eigen componentenmap. Een nieuw interactief element voldoet aan dit contract vóórdat het in een scherm terechtkomt.

## Acties

- Een actie is een native `button` met expliciete `type="button"`.
- De zichtbare tekst is de toegankelijke naam. Een knop met alleen een icoon krijgt een `aria-label`.
- **Terug** betekent één niveau terug; **verlaten** betekent terug naar menu of app. Nooit hetzelfde icoon met wisselende betekenis.
- Een toggle publiceert `aria-pressed="true|false"` — de `false` mag niet worden weggelaten.
- Een uitgeschakelde actie gebruikt het native `disabled`-attribuut en blijft visueel herkenbaar. Een vergrendelde kaart (bijvoorbeeld "Binnenkort beschikbaar") gebruikt daarnaast `aria-disabled` en reageert niet op een tik.
- Hint is een gewone knop, geen long-press of hover-only functie.

## Focus en touch

- Kindgerichte doelen zijn minimaal **48×48 CSS-pixels**.
- Elk interactief element heeft een zichtbare `focus-visible`-ring die niet alleen op kleur berust.
- Focus volgt de visuele leesvolgorde en verspringt niet vanzelf, behalve bij een modal of een routewissel.
- Hover mag iets toevoegen, maar nooit informatie of functionaliteit exclusief maken.

## Voortgang en feedback

- Voortgang gebruikt `role="meter"` met naam, minimum, maximum en actuele waarde.
- Opdracht, fout en succes zijn **altijd** als tekst beschikbaar; audio en video zijn aanvullend, nooit de enige drager.
- Een statuswijziging zonder focuswissel krijgt waar nodig een begrensde live-region.
- Feedback is nooit straffend: geen faalgeluid, geen verlies van voortgang.

## Beweging

- `MotionConfig reducedMotion="user"` is de gedeelde bron voor animaties.
- Onder `prefers-reduced-motion: reduce` én bij de in-app instelling "Rustige beweging" stoppen decoratieve animaties.
- **Nooit een universele reset** van `transition-duration` op `*`: dat veroorzaakte een stortvloed aan `transitionend`-events (gemeten 246 per seconde) waardoor de game juist onspeelbaar werd. Demping raakt alleen de decoratieve klassen.
- Essentiële status blijft zichtbaar wanneer beweging uitstaat.

## Alternatieve bediening

- Spraak heeft altijd een typ- of taproute met dezelfde parser en dezelfde oefenuitkomst.
- Een geweigerde microfoon is een capabilitystatus met uitleg en directe fallback — geen crash, geen doodlopende staat.
- De scène ondersteunt slepen, selecteer-en-tik én toetsenbordplaatsing (pijltoetsen verplaatsen een zichtbaar kruispunt, Enter of spatie plaatst).
- De vliegbediening reageert op pointer én Enter/spatie, met loslaten bij key-up.
- Typen gebeurt in een overtyp-veld: de doelzin staat als spookletters in het veld en wordt per letter groen. Automatische correctie en hoofdletters staan uit.

## Oriëntatie

- Op een **telefoon** draait de game alleen in portret; landschap toont een guard met uitleg en pauzeert de gameplay.
- Tablet en desktop ondersteunen beide standen; safe-area-insets worden gerespecteerd (Dynamic Island, punch-hole, navigatiebalk).

## Taal

- Alle gebruikersteksten zijn Nederlands, inclusief foutmeldingen.
- Enkelvoud en meervoud kloppen (één helper bepaalt "1 bestand" tegenover "3 bestanden").
- Lidwoorden komen uit de content ("het zandkasteel", niet "de zandkasteel") — belangrijk voor NT2-kinderen.
- Nederlandse hoofdletterregels: "Download voltooid", niet "Download Voltooid".

## Testcontract

- Componenttests controleren rollen, namen, toggle- en disabled-status, 48px-doelen en reduced-motion-gedrag.
- Playwright + axe blokkeren WCAG 2.2 A/AA-overtredingen op de kernschermen: welkom, profielselectie, catalogus, GameHost, instellingen, voortgang en microfoon-diagnose.
- Eén e2e-test voltooit de kernopdracht volledig met een **geweigerde microfoon** via het toetsenbord.
- In JSDOM staat alleen de axe-regel `color-contrast` uit (JSDOM levert geen layout); contrast wordt in een echte browser gecontroleerd.
- Er zijn geen generieke axe-excludes. Een toekomstige uitzondering noemt regel, exact element, reden, eigenaar en einddatum.
