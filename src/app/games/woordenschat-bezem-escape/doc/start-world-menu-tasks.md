# Startscherm En Wereldkeuze Takenlijst

Doel: de game krijgt eerst een duidelijker, vrolijker startscherm en daarna een wereldkeuze-menu. De stijl moet aansluiten op de vastgelegde mobile UI mockup-analyse en op de bestaande app-stijl: pastel, stickerachtig, rustige panels, grote knoppen en geen losse random UI-elementen.

## Ontwerpregels

- [ ] Mobile-first ontwerpen voor portrait.
- [ ] Daarna landscape bruikbaar maken.
- [ ] Geen scroll op het startscherm tenzij echt nodig.
- [ ] Geen losse zwevende knoppen zonder vaste layout.
- [ ] Alle knoppen minimaal 44px hoog maken.
- [ ] Dezelfde UI-bouwstenen gebruiken: `PanelCard`, `RibbonTitle`, `PrimaryActionButton`, `HudIconButton`.
- [ ] Dezelfde visuele taal gebruiken als de mockup-sheet: pastel, ronde vormen, witte panelen, duidelijke iconen.
- [ ] Kinderschermen kort houden: weinig tekst, grote visuele signalen.
- [ ] Ouderfuncties niet dominant in het kinderscherm tonen.

## Fase 1: Startscherm Concept

- [x] Bepalen welke elementen op het startscherm komen.
- [x] Startscherm moet een duidelijk logo krijgen.
- [x] Logo-tekst bepalen, bijvoorbeeld `+1 Woordenschat Bezem Escape`.
- [x] Logo visueel combineren met mascot, ster of bezem.
- [x] Een grote primaire speelknop ontwerpen: `Speel`.
- [x] Een kleinere knop maken voor `Werelden`.
- [x] Een kleine instellingenknop plaatsen zonder het kindscherm druk te maken.
- [x] Achtergrond vrolijker maken met rustige strand/pastel sfeer.
- [x] Mascot of avatar als eerste visuele signaal tonen.
- [x] Geen lange uitlegtekst op het startscherm gebruiken.

Resultaat: zie `start-screen-concept.md`.

## Fase 2: Startscherm Implementatie

- [x] Nieuw startscherm maken in `screens/start/`.
- [x] Startscherm exporteren via `screens/index.ts`.
- [x] Startscherm koppelen in `index.tsx` als eerste scherm van deze game.
- [x] Bestaande `GameMenuScreen` niet verwijderen voordat de nieuwe flow werkt.
- [x] Logo-component maken of herbruikbaar houden binnen `StartScreen`.
- [x] Speelknop koppelen aan de standaard flow: wereldkeuze of laatst gekozen wereld.
- [x] Kleine `Opties` knop koppelen aan instellingen.
- [x] Kleine `Groei` knop alleen secundair tonen voor ouder/logopedist.
- [x] Portrait layout testen.
- [x] Landscape layout testen.

## Fase 3: Wereldkeuze Concept

- [x] Bepalen welke werelden in de eerste versie zichtbaar zijn.
- [x] Strandwereld actief maken als eerste speelbare wereld.
- [x] Toekomstige werelden tonen als gesloten of `komt later`.
- [x] Wereldkaarten ontwerpen met icoon, thema en korte naam.
- [x] Wereldkaarten niet te groot maken, zodat telefoon overzichtelijk blijft.
- [x] Elke wereldkaart moet duidelijk klikbaar zijn.
- [x] Geselecteerde wereld zichtbaar markeren.
- [x] Een duidelijke knop maken: `Start wereld`.
- [x] Terugknop naar startscherm toevoegen.

Resultaat: zie `world-select-concept.md`.

## Fase 4: Eerste Wereldlijst

- [x] `Strand` toevoegen als speelbare wereld.
- [x] `Boerderij` toevoegen als toekomstige wereld.
- [x] `Dierentuin` toevoegen als toekomstige wereld.
- [x] `Speeltuin` toevoegen als toekomstige wereld.
- [x] `School` toevoegen als toekomstige wereld.
- [x] `Ruimte` toevoegen als toekomstige wereld.
- [x] Per wereld thema-kleur bepalen.
- [x] Per wereld kort leerdoel bepalen.
- [x] Per wereld status bewaren: `open`, `gesloten`, `komt later`.

Resultaat: zie `world-list.md`.

## Fase 5: Wereldkeuze Data

- [x] `WorldDefinition` type maken of uitbreiden.
- [x] Werelddata los zetten van scherm-JSX.
- [x] Per wereld opslaan: `id`, `title`, `theme`, `status`, `icon`, `description`, `availableModes`.
- [x] Strandwereld koppelen aan bestaande scene-builder, woordkeuze en race.
- [x] Wereldkeuze bewaren in lokale state.
- [x] Later gekozen wereld kunnen opslaan per profiel.
- [x] Geen hardcoded wereldkaarten in meerdere bestanden gebruiken.

Resultaat: zie `worlds.ts` en `logic/world-selection.ts`.

## Fase 6: Wereldkeuze Implementatie

- [x] Nieuw schermbestand maken: `screens/WorldSelectScreen.tsx`.
- [x] Wereldkeuze exporteren via `screens/index.ts`.
- [x] Startscherm `Speel` naar `WorldSelectScreen` laten gaan.
- [x] Strandkaart klikbaar maken.
- [x] Gesloten werelden visueel rustig blokkeren.
- [x] `Start wereld` knop alleen actief maken bij een speelbare wereld.
- [x] Na `Start wereld` naar huidig game-menu of direct naar `Luister & Plaats` gaan.
- [x] Terug naar startscherm laten werken.
- [x] Portrait layout testen.
- [x] Landscape layout testen.

Resultaat: zie `screens/WorldSelectScreen.tsx`. Tijdelijke QA-screenshots zijn na acceptatie verwijderd.

## Fase 7: Game Menu Opruimen

- [x] Controleren of `GameMenuScreen` nog nodig is na wereldkeuze.
- [x] Game menu hernoemen naar `ModeSelectScreen` als het alleen spelmodi kiest.
- [x] Wereldinformatie uit `GameMenuScreen` verwijderen als die naar `WorldSelectScreen` verhuist.
- [x] Moduskeuze tonen na gekozen wereld: `Luister & Plaats`, `Kies het Woord`, `Race`.
- [x] Race gesloten tonen totdat de scene genoeg geoefend is.
- [x] Beloning, Groei en Opties als secundaire acties tonen.
- [x] Geen twee verschillende hoofdmenu's naast elkaar laten bestaan.

Resultaat: `GameMenuScreen` is vervangen door `ModeSelectScreen`. De oude `screen=menu` preview blijft tijdelijk als alias naar `screen=mode-select` werken. Tijdelijke QA-screenshots zijn na acceptatie verwijderd.

## Fase 8: Visuele QA

- [x] Startscherm screenshot maken in portrait.
- [x] Startscherm screenshot maken in landscape.
- [x] Wereldkeuze screenshot maken in portrait.
- [x] Wereldkeuze screenshot maken in landscape.
- [x] Controleren dat logo, speelknop en wereldkaarten niet overlappen.
- [x] Controleren dat tekst in knoppen past.
- [x] Controleren dat gesloten werelden duidelijk maar niet frustrerend zijn.
- [x] Controleren dat er geen horizontale overflow is.
- [x] Controleren dat er geen ongewenste verticale scroll is op het startscherm.
- [x] Build draaien.
- [x] Browser smoke test uitvoeren.

Resultaat: visuele QA is uitgevoerd in portrait en landscape. Tijdelijke QA-screenshots zijn na acceptatie verwijderd. Tijdens QA is een kleine overlap tussen het startlogo en de speelknop in landscape gevonden en opgelost.

## Acceptatie Voor Deze Stap

- [x] Het startscherm voelt vrolijker dan de huidige menu-start.
- [x] Het startscherm heeft een herkenbaar logo.
- [x] Het startscherm heeft een duidelijke grote `Speel` knop.
- [x] De speler kan naar een wereldkeuze-menu.
- [x] De speler kan `Strand` kiezen.
- [x] Andere werelden zijn voorbereid voor later.
- [x] De implementatie volgt de mockup-stijl en bestaande UI-componenten.
- [x] De nieuwe schermen zijn los georganiseerd en niet als grote blokken in `index.tsx` gebouwd.
