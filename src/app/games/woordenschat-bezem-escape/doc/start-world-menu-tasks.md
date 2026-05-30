# Startscherm En Wereldkeuze Takenlijst

Doel: de game krijgt eerst een duidelijker, vrolijker startscherm en daarna een wereldkeuze-menu. De stijl moet aansluiten op `mobile-ui-mockups-sheet.png` en op de bestaande app-stijl: pastel, stickerachtig, rustige panels, grote knoppen en geen losse random UI-elementen.

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

- [x] Nieuw schermbestand maken: `screens/StartScreen.tsx`.
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

- [ ] Bepalen welke werelden in de eerste versie zichtbaar zijn.
- [ ] Strandwereld actief maken als eerste speelbare wereld.
- [ ] Toekomstige werelden tonen als gesloten of `komt later`.
- [ ] Wereldkaarten ontwerpen met icoon, thema en korte naam.
- [ ] Wereldkaarten niet te groot maken, zodat telefoon overzichtelijk blijft.
- [ ] Elke wereldkaart moet duidelijk klikbaar zijn.
- [ ] Geselecteerde wereld zichtbaar markeren.
- [ ] Een duidelijke knop maken: `Start wereld`.
- [ ] Terugknop naar startscherm toevoegen.

## Fase 4: Eerste Wereldlijst

- [ ] `Strand` toevoegen als speelbare wereld.
- [ ] `Boerderij` toevoegen als toekomstige wereld.
- [ ] `Dierentuin` toevoegen als toekomstige wereld.
- [ ] `Speeltuin` toevoegen als toekomstige wereld.
- [ ] `School` toevoegen als toekomstige wereld.
- [ ] `Ruimte` toevoegen als toekomstige wereld.
- [ ] Per wereld thema-kleur bepalen.
- [ ] Per wereld kort leerdoel bepalen.
- [ ] Per wereld status bewaren: `open`, `gesloten`, `komt later`.

## Fase 5: Wereldkeuze Data

- [ ] `WorldDefinition` type maken of uitbreiden.
- [ ] Werelddata los zetten van scherm-JSX.
- [ ] Per wereld opslaan: `id`, `title`, `theme`, `status`, `icon`, `description`, `availableModes`.
- [ ] Strandwereld koppelen aan bestaande scene-builder, woordkeuze en race.
- [ ] Wereldkeuze bewaren in lokale state.
- [ ] Later gekozen wereld kunnen opslaan per profiel.
- [ ] Geen hardcoded wereldkaarten in meerdere bestanden gebruiken.

## Fase 6: Wereldkeuze Implementatie

- [ ] Nieuw schermbestand maken: `screens/WorldSelectScreen.tsx`.
- [ ] Wereldkeuze exporteren via `screens/index.ts`.
- [ ] Startscherm `Speel` naar `WorldSelectScreen` laten gaan.
- [ ] Strandkaart klikbaar maken.
- [ ] Gesloten werelden visueel rustig blokkeren.
- [ ] `Start wereld` knop alleen actief maken bij een speelbare wereld.
- [ ] Na `Start wereld` naar huidig game-menu of direct naar `Luister & Plaats` gaan.
- [ ] Terug naar startscherm laten werken.
- [ ] Portrait layout testen.
- [ ] Landscape layout testen.

## Fase 7: Game Menu Opruimen

- [ ] Controleren of `GameMenuScreen` nog nodig is na wereldkeuze.
- [ ] Game menu hernoemen naar `ModeSelectScreen` als het alleen spelmodi kiest.
- [ ] Wereldinformatie uit `GameMenuScreen` verwijderen als die naar `WorldSelectScreen` verhuist.
- [ ] Moduskeuze tonen na gekozen wereld: `Luister & Plaats`, `Kies het Woord`, `Race`.
- [ ] Race gesloten tonen totdat de scene genoeg geoefend is.
- [ ] Beloning, Groei en Opties als secundaire acties tonen.
- [ ] Geen twee verschillende hoofdmenu's naast elkaar laten bestaan.

## Fase 8: Visuele QA

- [ ] Startscherm screenshot maken in portrait.
- [ ] Startscherm screenshot maken in landscape.
- [ ] Wereldkeuze screenshot maken in portrait.
- [ ] Wereldkeuze screenshot maken in landscape.
- [ ] Controleren dat logo, speelknop en wereldkaarten niet overlappen.
- [ ] Controleren dat tekst in knoppen past.
- [ ] Controleren dat gesloten werelden duidelijk maar niet frustrerend zijn.
- [ ] Controleren dat er geen horizontale overflow is.
- [ ] Controleren dat er geen ongewenste verticale scroll is op het startscherm.
- [ ] Build draaien.
- [ ] Browser smoke test uitvoeren.

## Acceptatie Voor Deze Stap

- [ ] Het startscherm voelt vrolijker dan de huidige menu-start.
- [ ] Het startscherm heeft een herkenbaar logo.
- [ ] Het startscherm heeft een duidelijke grote `Speel` knop.
- [ ] De speler kan naar een wereldkeuze-menu.
- [ ] De speler kan `Strand` kiezen.
- [ ] Andere werelden zijn voorbereid voor later.
- [ ] De implementatie volgt de mockup-stijl en bestaande UI-componenten.
- [ ] De nieuwe schermen zijn los georganiseerd en niet als grote blokken in `index.tsx` gebouwd.
