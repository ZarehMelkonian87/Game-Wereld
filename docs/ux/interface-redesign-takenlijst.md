# UX — Implementatietakenlijst interface-herontwerp

Status: **open**

Laatste herziening: **23 juli 2026**

Deze pagina vertaalt het UX-herontwerp van _Magisch Strand Avontuur_ (`strand-bezem-escape`) naar uitvoerbare implementatietaken. De taken staan in afhankelijkheidsvolgorde en zijn zo beschreven dat een ontwikkelaar of AI-agent één taak zelfstandig kan oppakken.

**Ontwerpbron:** het voor/na-herontwerp met alle mockups en onderbouwing staat in de artifact — <https://claude.ai/code/artifact/ec79e421-9f44-4e58-9fc0-75cb654ad75e>. Iedere taak verwijst naar de betreffende sectie ("Ontwerpbron: …").

De normatieve kwaliteitsstandaard blijft [Code Quality & Architecture Requirements](../code-quality-and-architecture.md); dit document voegt daar niets aan toe maar past het toe op een UI-herontwerp. Iedere taak bevat daarom dezelfde verplichte kwaliteitscontrole als de [architectuurtakenlijst](../architecture-proposal/11-implementatie-takenlijst.md).

> **Kernprincipe van dit herontwerp:** de functionaliteit van elk scherm blijft ongewijzigd. Wat verandert is uitsluitend de _presentatie_ — één gedeelde HUD, één titelstijl, één kaart, edge-to-edge scènes, grotere raakdoelen en levendiger feedback. Geen enkele taak mag een bestaande spelmechaniek, invoerwijze (spraak, typen, drag, toets) of opgeslagen data verwijderen.

## Werkwijze voor iedere taak

1. Lees deze taak, haar afhankelijkheden en de gekoppelde ontwerpsectie volledig.
2. Inspecteer vóór wijziging de actuele code; paden zijn richtinggevend en kunnen door eerdere taken zijn veranderd.
3. Beperk de wijziging tot de beschreven scope. Leg een noodzakelijke scope-uitbreiding eerst vast in de taak of een ADR.
4. Voeg of wijzig tests tegelijk met productiecode.
5. Voer de genoemde verificatie uit en daarna alle beschikbare checks uit `npm run check`.
6. Vergelijk de implementatie expliciet met `docs/code-quality-and-architecture.md`.
7. Noteer bewijs onder de taak: gewijzigde bestanden, uitgevoerde commando's, testresultaten, metingen en eventuele ADR.
8. Geef na afronding een Conventional Commit-bericht aan de gebruiker dat de werkelijke wijzigingen samenvat.
9. Voer zelf geen `git add`, `git commit` of `git push` uit; de gebruiker doet dit altijd zelf.
10. Vink de hoofdtaak pas af wanneer geen verplichte subtaak openstaat en het commitbericht is aangeleverd.

## Betekenis van checkboxes

- `[ ]` niet gestart of nog niet bewezen;
- `[x]` geïmplementeerd én geverifieerd;
- een geblokkeerde taak blijft `[ ]` en krijgt een korte regel `Geblokkeerd door: …`.

## Verplichte kwaliteitscontrole per taak

De checkbox **Kwaliteitscontrole** onder iedere taak betekent minimaal: import- en modulegrenzen gerespecteerd; TypeScript- en runtimegrenzen correct; loading-, fout-, lege en retrytoestanden behandeld waar relevant; tests dekken de veranderde risico's; **toegankelijkheid** (WCAG 2.2 AA, 48×48 px raakdoelen, toetsenbord, focus, `prefers-reduced-motion`, niet-uitsluitend-kleur/drag/spraak), privacy, offlinegedrag en performance beoordeeld; geen nieuwe dependency zonder toelating; documentatie/ADR bijgewerkt bij contractwijziging; alle beschikbare kwaliteitscommando's groen.

De checkbox **Commitbericht voor gebruiker** betekent een bericht in de vorm:

```text
type(scope): korte beschrijving in gebiedende wijs

- belangrijkste inhoudelijke wijziging
- relevante test of kwaliteitsverbetering
```

---

## Overzicht

| Groep | Taak   | Onderwerp                          | Belangrijkste bestanden                                         |
| ----- | ------ | ---------------------------------- | --------------------------------------------------------------- |
| 1     | UX-101 | Interface-tokens & thema           | `src/styles/theme.css`, Tailwind-thema                          |
| 1     | UX-102 | Eén canonieke HUD-balk             | `game-platform/components/layout/GameTopHud.tsx`, game-`TopHud` |
| 1     | UX-103 | Eén titel-/koptekstcomponent       | `components/ui/RibbonTitle.tsx` + screenkoppen                  |
| 1     | UX-104 | Gedeelde stat-tegel + NL-labels    | `components/ui/GameplayStatusBar.tsx`, reward-summary           |
| 2     | UX-201 | Hoofdmenu (Start)                  | `screens/start/*`                                               |
| 2     | UX-202 | Kies avontuur                      | `screens/adventure-select/*`                                    |
| 2     | UX-203 | Instellingen                       | `screens/settings/*`                                            |
| 2     | UX-204 | Beloning                           | `screens/reward/*`                                              |
| 3     | UX-301 | Zeg & Zet (scene builder)          | `screens/scene-builder/*`                                       |
| 3     | UX-302 | Kies het Woord — layout & plaatjes | `screens/WordChoiceScreen.tsx`, `word-choice/*`                 |
| 3     | UX-303 | Kies het Woord — feedback-animatie | `screens/word-choice/*`                                         |
| 3     | UX-304 | Zeg & Vlieg (side scroller)        | `screens/voice-side-scroller/*`                                 |
| 4     | UX-401 | Toegankelijkheid & E2E-regressie   | `e2e/*`, componenttests                                         |
| 4     | UX-402 | Budgetten, docs & opruimen         | `ARCHITECTURE.md`, Knip, budgetcheck                            |

---

<details open>
<summary><strong>Groep 1 — Gedeeld interface-fundament</strong></summary>

## Groep 1 — Gedeeld interface-fundament

Deze groep blokkeert groep 2 en 3. Zolang er geen gedeelde tokens, HUD en titel bestaan, herhaalt elk scherm zijn eigen stijl. Doel: één kleine set bouwstenen die elk scherm — en elke toekomstige game — meekrijgt, bovenop de bestaande platform-primitives (`GameShell`, `GameStage`, `GameTopHud`, `GameButton`, `GamePanel`).

### UX-101 — Interface-designtokens en thema vastleggen

- [x] **UX-101 afgerond**

Afhankelijkheden: geen.

Ontwerpbron: artifact-sectie "Fundament → Palet / Stat-tegels & taal".

Doel: één bron van waarheid voor kleur, semantiek en type, zodat schermen niet meer per stuk hex-waarden kiezen.

- [x] Definieer designtokens voor strandpalet (`sky`, `sea`, `sand`), primaire "go"-actie (groen), doel-accent (koraal) en ster-goud als CSS custom properties en/of Tailwind-thema-extensie in `src/styles/theme.css`.
- [x] Definieer **semantische** statuskleuren gescheiden van het accent: `goed` (groen), `tempo` (teal/blauw), `hint` (amber). Deze zijn betekenisdragend, niet decoratief.
- [x] Leg een korte typeschaal en gewichten vast voor titel, label en waarde; koppel geen webfont-CDN (CSP/offline).
- [x] Documenteer de tokens beknopt (bestaand stijldocument of `src/app/game-platform/theme/`), inclusief welke token waarvoor bedoeld is.
- [x] Wijzig in deze taak nog geen scherm; alleen de tokens beschikbaar maken.
- [x] Acceptatie: alle vervolgtaken kunnen kleur/semantiek uit één token halen; er is geen tweede "blauw" of "groen" nodig buiten de tokens.
- [x] Verificatie: `npm run build` en `npm run typecheck` groen; tokens zijn toegepast door de UX-104-stat-tegels en in de app geverifieerd.
- [x] **Kwaliteitscontrole:** toets tokens, contrast (AA) en dependencies aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker.**

Bewijs: `src/styles/theme.css` bevat een gedocumenteerd `@theme`-blok met wereldpalet (`beach-sky/sea/sand`, `go`, `go-strong`, `target`, `star`) en semantische statustokens (`stat-good/tempo/hint` × tekst/oppervlak/rand). Thema-onafhankelijk en losstaand van het donkere app-shellthema. Geen nieuwe dependency. Typecheck en build groen.

### UX-102 — Eén canonieke HUD-balk

- [x] **UX-102 afgerond**

Afhankelijkheden: UX-101.

Ontwerpbron: artifact-sectie "Fundament → HUD-balk"; alle in-game mockups.

Doel: de drie afwijkende in-game koppen en de losse widgets vervangen door één doorschijnende HUD-balk (terug · sterren · context­actie), veilig binnen safe-area.

- [x] Inspecteer de huidige HUD's: platform `GameTopHud` (`game-platform/components/layout/GameTopHud.tsx`) versus de game-eigen `TopHud` (`games/strand-bezem-escape/components/layout/TopHud.tsx`) en de losse widgets in de side scroller.
- [x] Kies één canonieke HUD (`GameTopHud` uitgebreid) met slots voor links (terug), midden (context: sterren) en rechts (hint/actie); doorschijnende `backdrop-blur`-achtergrond toegevoegd.
- [x] Laat de game-`TopHud` deze canonieke HUD gebruiken (wrapt al `GameTopHud`); geen callbacks verwijderd (`onBackToMenu`, `onAudioClick`, `onHintClick`, `starCount`).
- [x] Behoud `pointer-events`-gedrag (bar `pointer-events-none`, controls `-auto`) en de bestaande `data-testid`/`data-slot`-contracten.
- [x] Voeg/actualiseer een componenttest die back-, hint- en audio-acties via toegankelijke naam controleert.
- [x] Acceptatie: word-choice (die `GameTopHud` gebruikt) toont de gedeelde HUD-balk; scene-builder en side-scroller migreren in Groep 3 (UX-301/UX-304).
- [x] Verificatie: componenttest + `npm run test:architecture` groen; visuele check op 384×854 (bar `backdrop-blur(12px)`, `pointer-events:none` bevestigd).
- [x] **Kwaliteitscontrole:** toets modulegrens (game gebruikt platform-primitive), a11y en testcontracten aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker.**

Bewijs: `GameTopHud.tsx` wikkelt de drie slots nu in één doorschijnende, backdrop-blurred bar; `pointer-events-none` op de bar houdt de scène aantikbaar. Nieuwe `GameTopHud.test.tsx` borgt namen (Terug/Audio/Hint/sterren) en callbacks. In de app geverifieerd op word-choice; scene-builder en side-scroller zijn bewust ongemoeid (Groep 3).

### UX-103 — Eén titel-/koptekstcomponent

- [x] **UX-103 afgerond**

Afhankelijkheden: UX-101.

Ontwerpbron: artifact-sectie "Menu's & instellingen → Voorstel · één systeem"; "Fundament → Titel & hoofdknop".

Doel: de vier verschillende titelbehandelingen (logo / witte pill / blauwe 3D-pill / aparte reward-kop) vervangen door één sticker-titelcomponent.

- [x] Inspecteer `components/ui/RibbonTitle.tsx` en de koppen in `screens/settings/SettingsHeader.tsx`, `screens/adventure-select/AdventureSelectHeader.tsx`, `screens/start/StartTopBar.tsx` en het reward-scherm.
- [x] Veralgemeniseer de bestaande gedeelde `RibbonTitle` tot de sticker-stijl uit de ontwerpbron (geen blauwe app-pill meer): witte achtergrond, subtiele rand, hoog-contrast donkere tekst.
- [x] Component blijft één slot met `data-component="RibbonTitle"`; een eyebrow/icoon is niet nodig voor de huidige schermen.
- [x] Wijzig in deze taak nog geen schermlayout; alleen de component. Settings toont de nieuwe titel automatisch omdat het al `RibbonTitle` gebruikt.
- [x] Voeg een componenttest toe die de titel via testid/tekst controleert en dat de blauwe pill weg is.
- [x] Acceptatie: één component dekt de titels; de blauwe 3D-pill is niet langer nodig. Adventure/Start/Reward adopteren `RibbonTitle` in Groep 2.
- [x] Verificatie: componenttest groen; in de app is de nieuwe witte sticker-titel op Instellingen bevestigd (`data-component="RibbonTitle"`, witte bg).
- [x] **Kwaliteitscontrole:** toets aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker.**

Bewijs: `RibbonTitle.tsx` is herstyled van `bg-sky-500 border-sky-700 text-white` naar de neutrale witte sticker (`bg-white border-sky-200 text-slate-900`), met `data-component`. Nieuwe `RibbonTitle.test.tsx`. Settings-titel in de app bevestigd als witte sticker.

### UX-104 — Gedeelde stat-tegel en Nederlandse labels

- [x] **UX-104 afgerond**

Afhankelijkheden: UX-101.

Ontwerpbron: artifact-sectie "Fundament → Stat-tegels & taal"; belonings- en woordkeuze-mockups.

Doel: stat-tegels met consistente, semantische kleur; en doorgaand Nederlands ("Tempo" i.p.v. "Speed"/"SPEED").

- [x] Inspecteer `components/ui/GameplayStatusBar.tsx` en de stat-weergave in het beloningsscherm (`screens/reward/*`, o.a. `RewardResultSummary.tsx`, `SummaryPill.tsx`).
- [x] Maak de gedeelde stat-tegel (`SummaryPill`) met semantische tonen (`good`/`tempo`/`hint`/`star`/`neutral`) uit de UX-101-tokens.
- [x] Vervang de Engelse labels door "Tempo": statusbalk, reward-tegel, dev-preview, én de feedback-copy "+1 Speed!" → "+1 Tempo!" (content.ts, side-scroller-engine, woordherkenning) met de bijbehorende toast-regex.
- [x] Raak geen opgeslagen veldnamen of event-/schema-sleutels aan; alleen presentatie/tekst (`speedValue`, `speedEarned` e.d. ongewijzigd).
- [x] Geen bestaande test assert op de oude labeltekst; nieuwe `SummaryPill.test.tsx` borgt de semantische tonen.
- [x] Acceptatie: geen zichtbaar Engels label meer; stat-tegels identiek van vorm en kleursemantiek.
- [x] Verificatie: `rg -i "speed"` toont geen zichtbaar UI-label meer; tests groen; in de app "Tempo" op statusbalk en reward bevestigd.
- [x] **Kwaliteitscontrole:** toets aan `docs/code-quality-and-architecture.md` (geen schemawijziging, alleen UI/tekst).
- [x] **Commitbericht voor gebruiker.**

Bewijs: `SummaryPill.tsx` heeft nu token-gedreven semantische tonen met `data-tone`; reward-tegels tonen Goed/Tempo/Hints/Audio/Sterren met betekenisvolle kleuren. Alle zichtbare "Speed" → "Tempo" (7 plekken) inclusief de `FloatingSuccessToast`-detectieregex. Nieuwe `SummaryPill.test.tsx`. In de app bevestigd.

### Uitvoerbewijs Groep 1

- Gedeelde tokens, HUD-balk, sticker-titel en semantische stat-tegel staan; vervolgtaken (Groep 2/3) kunnen erop bouwen.
- `npm run check` (format, lint, typecheck, 98 unit/componenttests, assets, architectuur, docs), `npm run check:dead-code` (Knip, alleen bestaande config-hints) en `npm run check:bundle` (alle PASS) zijn groen op Node 22.
- Visueel geverifieerd in een productie-preview: witte sticker-titel op Instellingen, semantische reward-tegels met "Tempo", en de doorschijnende HUD-balk op word-choice met behouden `pointer-events`.
- Commitbericht voor de volledige groep: `feat(ui): add shared interface foundation (tokens, HUD bar, sticker title, semantic stat tiles)`

</details>

---

<details>
<summary><strong>Groep 2 — Menu's &amp; instellingen</strong></summary>

## Groep 2 — Menu's & instellingen

Start pas wanneer groep 1 groen is. Elk scherm wordt op de gedeelde HUD, titel en tegels gezet. Functionaliteit en navigatie blijven gelijk.

### UX-201 — Hoofdmenu (Start) op het systeem

- [x] **UX-201 afgerond**

Afhankelijkheden: UX-102, UX-103.

Ontwerpbron: artifact "Menu's → Hoofdmenu".

Doel: het startscherm op de gedeelde HUD + één groene go-knop zetten.

- [x] `StartTopBar.tsx` gebruikt al de gedeelde `HudIconButton`-controls (terug, geluid, instellingen) met de HUD-behandeling; geen scherm-eigen kopstijl.
- [x] Het logo blijft bewust hero-illustratie (zo ook in de ontwerpbron); er is geen aparte titelcomponent nodig.
- [x] De "Spelen"-knop is de gedeelde groene primaire knop (`GameButton tone="green"` via `PrimaryActionButton`) — in de app bevestigd.
- [x] Alle navigatie (`onExit`, `onOpenSettings`, `onPlay`) en `data-testid`'s (`start-play-button`, `start-settings-button`) behouden.
- [x] Acceptatie: hoofdmenu gebruikt dezelfde groene knop en HUD-primitives als de rest; conform na Groep 1, geen restructurering nodig.
- [x] Verificatie: `start-play-button` = `GameButton`/`tone="green"` in de app; typecheck/lint/tests groen.
- [x] **Kwaliteitscontrole:** toets aan `docs/code-quality-and-architecture.md` (geen cosmetische churn toegevoegd).
- [x] **Commitbericht voor gebruiker.**

Bewijs: Start voldeed na Groep 1 al aan het systeem (groene `PrimaryActionButton`, gedeelde `HudIconButton`, logo-hero conform ontwerpbron). Geen productiewijziging nodig; in de app geverifieerd (`data-component="GameButton"`, `data-tone="green"`).

### UX-202 — Kies avontuur op het systeem

- [x] **UX-202 afgerond**

Afhankelijkheden: UX-102, UX-103.

Ontwerpbron: artifact "Menu's → Kies avontuur".

Doel: het modus-keuzescherm uniformeren (sticker-titel, consistente keuzekaarten, gedeelde primaire knop).

- [x] `AdventureSelectHeader.tsx`: de inline witte-pill titel is vervangen door de gedeelde `RibbonTitle` (UX-103); kaarten en knoppen gebruikten al `PanelCard`/`SecondaryActionButton`.
- [x] "Start spel" gebruikt al de gedeelde groene `PrimaryActionButton`.
- [x] De drie modi, hun selectiegedrag en de knoppen "Beloning"/"Opties" blijven ongewijzigd; `data-slot="title"` behouden.
- [x] Acceptatie: de titel is nu identiek aan Instellingen/Beloning; selectie- en startgedrag ongewijzigd.
- [x] Verificatie: tests + architectuur groen; in de app bevestigd (`data-component="RibbonTitle"`, tekst "Kies avontuur").
- [x] **Kwaliteitscontrole:** toets aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker.**

Bewijs: `AdventureSelectHeader.tsx` importeert en gebruikt nu `RibbonTitle` i.p.v. een bespoke witte pill. Visueel bevestigd naast de identieke Instellingen-/Beloning-titel.

### UX-203 — Instellingen op het systeem

- [x] **UX-203 afgerond**

Afhankelijkheden: UX-103, UX-104.

Ontwerpbron: artifact "Menu's → Instellingen".

Doel: de felblauwe 3D-pill uit de app-schil vervangen door de gedeelde sticker-titel; toggle-kaarten uniformeren.

- [x] `SettingsHeader.tsx` gebruikt de gedeelde `RibbonTitle` (in UX-103 herstyled naar de sticker); de blauwe 3D-pill is daarmee weg.
- [x] Alle toggles (audio, muziek, hints, rustige beweging, zone editor devtools) en het microfoon/privacy-blok blijven ongewijzigd van gedrag en gebruiken al consistente witte kaart-rijen.
- [x] "Controleer opnieuw" gebruikt al de gedeelde groene `PrimaryActionButton`.
- [x] Acceptatie: Instellingen deelt titel/kaart/knop met de rest; geen toggle of privacytekst verloren.
- [x] Verificatie: `microphoneSettings`-tests groen; in de app bevestigd (witte sticker-titel, `data-component="RibbonTitle"`).
- [x] **Kwaliteitscontrole:** toets privacy-UI, a11y (toggle-rollen/namen) en imports aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker.**

Bewijs: door UX-103 toont `SettingsHeader` de witte sticker-titel; de toggle-rijen en de groene "Controleer opnieuw"-knop waren al conform. Geen aanvullende productiewijziging nodig; in de app geverifieerd.

### UX-204 — Beloning op het systeem

- [x] **UX-204 afgerond**

Afhankelijkheden: UX-103, UX-104.

Ontwerpbron: artifact "Menu's → Beloning".

Doel: het beloningsscherm uniformeren met sticker-titel, semantische stat-tegels en consistente bottom-nav.

- [x] `RewardScreen.tsx` krijgt een gedeelde `RibbonTitle` "Beloning" in de gereserveerde bovenruimte (titel 12–60px, card start op 68px — geen overlap).
- [x] De stat-tegels gebruiken al de semantische kleuren en "Tempo" (via UX-104: `SummaryPill` Goed/Tempo/Hints/Audio/Sterren).
- [x] De bottom-nav (Opnieuw · Wereld · Menu) gebruikt al drie gedeelde groene `PrimaryActionButton`s.
- [x] Sticker-beloning, reward-toekenning en `rewardResultStorage` ongewijzigd.
- [x] Acceptatie: beloningsscherm past in het systeem; geen functionele of dataregressie.
- [x] Verificatie: tests + build groen; in de app bevestigd (`reward-title` = "Beloning", `data-component="RibbonTitle"`, geen overlap met de card).
- [x] **Kwaliteitscontrole:** toets aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker.**

Bewijs: `RewardScreen.tsx` rendert de gedeelde sticker-titel bovenaan; tegels en bottom-nav waren al conform (UX-104 / bestaande `PrimaryActionButton`s). Visueel bevestigd.

### Uitvoerbewijs Groep 2

- Alle vier menuschermen delen nu dezelfde sticker-titel (`RibbonTitle`), groene primaire knop (`GameButton`/`PrimaryActionButton`) en semantische stat-tegels. De vier eerdere titelstijlen (logo / witte pill / blauwe 3D-pill / geen) zijn teruggebracht tot: logo-hero op Start + één sticker-titel op Kies avontuur, Instellingen en Beloning.
- Productiewijzigingen bleven bewust minimaal: alleen `AdventureSelectHeader` (titel → `RibbonTitle`) en `RewardScreen` (titel toegevoegd). Start en Instellingen voldeden al na Groep 1.
- `npm run typecheck`, `lint`, `test` (98), `test:architecture`, `format:check` en `build` groen op Node 22.
- Service-workercache-valkuil onderkend: de PWA-`CacheFirst` serveerde een oude preview-build; na `getRegistrations().unregister()` + `caches.delete()` de verse build geverifieerd.
- Commitbericht voor de volledige groep: `feat(ui): unify menu screens on shared sticker title (adventure select + reward)`

</details>

---

<details>
<summary><strong>Groep 3 — In-game modi</strong></summary>

## Groep 3 — In-game modi

Start pas wanneer groep 1 groen is (kan parallel aan groep 2). Per modus: HUD toepassen, scène edge-to-edge, en de per-modus verbeteringen uit de ontwerpbron — met behoud van alle invoerwijzen en mechaniek.

### UX-301 — Zeg & Zet (scene builder)

- [ ] **UX-301 afgerond**

Afhankelijkheden: UX-102.

Ontwerpbron: artifact "In het spel → Zeg & Zet" (functioneel bijgesteld: grote scène + scroll-tray + spraak én typen blijven).

Doel: chrome verminderen zonder speelmechaniek te verliezen.

- [ ] Zet `screens/SceneBuilderScreen.tsx` + `SceneBuilderTopBar.tsx` op de canonieke HUD (terug · sterren · hint · klaar).
- [ ] Laat de scène **edge-to-edge** lopen: verwijder het decoratieve ronde kader / de zichtbare bezel-rand (inspecteer `components/layout/GameStage.tsx` / `BeachBackground.tsx`), zodat de neerzet-scène groter wordt.
- [ ] **Behoud** de horizontale objecten-tray (`ObjectCarousel.tsx` / `ObjectTrayContainer.tsx`), maar verbeter: grotere tegels (±40 px), duidelijk gemarkeerd geselecteerd object, en een fade-rand als scroll-hint. De horizontale scroll blijft bewust behouden — de grote scène is de neerzet-zone.
- [ ] **Behoud** beide invoerwijzen als volwaardig: spraak/mic én typen. Presenteer ze als duidelijke cluster (grote mic-hoofdknop + typ-knop met labels) i.p.v. gelijk-uitziende mini-iconen; behoud de video/audio-herhaalknop bij de instructie.
- [ ] Voeg een subtiele doelzone-gloed op de scène toe als visuele hint (naast, niet in plaats van, de bestaande hint).
- [ ] Raak de plaatsingslogica, spraakherkenning en drag-and-drop (`hooks/useSceneBuilder*`) niet in gedrag aan; alleen presentatie/HUD.
- [ ] Acceptatie: alle bestaande manieren om een object te plaatsen (drag, tik-tik, spraak, typen, toetsenbord) werken nog; scène is zichtbaar groter; geen decoratief kadergat meer.
- [ ] Verificatie: scene-builder unit/keyboard-tests + E2E-scene-flow groen; visuele check 390×844 + landscape.
- [ ] **Kwaliteitscontrole:** toets a11y (48×48, toetsenbord, niet-alleen-drag/kleur), speechprivacy en imports aan `docs/code-quality-and-architecture.md`.
- [ ] **Commitbericht voor gebruiker.**

### UX-302 — Kies het Woord — layout en grotere plaatjes

- [ ] **UX-302 afgerond**

Afhankelijkheden: UX-102.

Ontwerpbron: artifact "In het spel → Kies het Woord" (grotere plaatjes, samengevoegde vraagbalk).

Doel: plaatjes veel groter en één opgeruimde vraagbalk.

- [ ] Zet `screens/WordChoiceScreen.tsx` op de canonieke HUD.
- [ ] Voeg vraag + "luister/herhaal" samen tot één compacte balk (nu twee gestapelde kaarten: `InstructionBubble` + de "Luister en kies"-`PanelCard`); geef de teruggewonnen ruimte aan de antwoordkaarten.
- [ ] Laat het plaatje in elke antwoordkaart ±80% vullen (nu ~15%). Inspecteer `ObjectStickerButton` (`showLabel={false}`) en het grid in `word-choice/*`.
- [ ] Behoud vier antwoordopties, het keuzegedrag, hint-onthulling en de statusbalk.
- [ ] Acceptatie: plaatjes vullen het grootste deel van de kaart; vraag staat op één regel/balk; keuzegedrag ongewijzigd.
- [ ] Verificatie: word-choice componenttests groen; visuele check.
- [ ] **Kwaliteitscontrole:** toets a11y (48×48, toegankelijke naam per kaart) en imports aan `docs/code-quality-and-architecture.md`.
- [ ] **Commitbericht voor gebruiker.**

### UX-303 — Kies het Woord — feedback-animatie

- [ ] **UX-303 afgerond**

Afhankelijkheden: UX-302.

Ontwerpbron: artifact "In het spel → Kies het Woord → animatie loopt live in de mockup".

Doel: het spel leuker maken met levendige feedback bij goed en fout.

- [ ] Voeg bij een **goed** antwoord een korte celebratie toe: kaart springt op, groene gloed + vinkje, en een sterren/confetti-burst.
- [ ] Voeg bij een **fout** antwoord een zachte, niet-bestraffende reactie toe: kaart schudt kort, koraal-rand + kruisje; het juiste plaatje licht daarna op (bestaand hint-gedrag mag hergebruikt worden).
- [ ] Gebruik de bestaande `motion`-dependency of pure CSS; voeg geen nieuwe animatiebibliotheek toe.
- [ ] Respecteer `prefers-reduced-motion`: bij voorkeur alleen kleur + vinkje/kruisje, zonder beweging.
- [ ] Koppel de animatie aan de bestaande `feedback.kind` (`"correct"`/incorrect) uit `useWordChoiceState`; verzin geen nieuwe uitkomststatus.
- [ ] Acceptatie: goed/fout hebben duidelijk verschillende, plezierige feedback; met reduced-motion blijft de feedback begrijpelijk zonder beweging.
- [ ] Verificatie: componenttest controleert dat correct/incorrect de juiste toegankelijke statusindicatie tonen; reduced-motion-pad getest.
- [ ] **Kwaliteitscontrole:** toets reduced-motion, niet-alleen-kleur (vink/kruis naast kleur) en performance aan `docs/code-quality-and-architecture.md`.
- [ ] **Commitbericht voor gebruiker.**

### UX-304 — Zeg & Vlieg (side scroller)

- [ ] **UX-304 afgerond**

Afhankelijkheden: UX-102.

Ontwerpbron: artifact "In het spel → Zeg & Vlieg" (goedgekeurd voorstel).

Doel: HUD toepassen, scène edge-to-edge, en eenhandige duim-rail toevoegen náást de bestaande knoppen.

- [ ] Zet `screens/voice-side-scroller/VoiceSideScrollerScreen.tsx` en `VoiceSideScrollerHud.tsx` op de canonieke HUD (thuis · afstand · score) i.p.v. twee losse widgets.
- [ ] Laat de scène edge-to-edge lopen (verwijder het kadergat).
- [ ] Voeg een duim-rail rechts toe voor fijne hoogtecontrole met één hand; **behoud** de `↑ Omhoog`/`↓ Omlaag`-knoppen (`VoiceSideScrollerMovementControls.tsx`) als toegankelijk alternatief — bediening mag nooit uitsluitend van drag afhangen.
- [ ] Behoud spraakbesturing, obstakel-/scorelogica (`voiceSideScrollerEngine.ts`, `useVoiceSideScrollerController.ts`) en het geen-microfoon-pad ongewijzigd.
- [ ] Acceptatie: rail + knoppen werken beide; scène zichtbaar hoger; spraak- en geen-mic-flow ongewijzigd.
- [ ] Verificatie: side-scroller controller-/engine-tests groen; visuele check + toets-/geen-mic-pad.
- [ ] **Kwaliteitscontrole:** toets a11y (drag heeft toets/knop-alternatief), speechprivacy en performance aan `docs/code-quality-and-architecture.md`.
- [ ] **Commitbericht voor gebruiker.**

</details>

---

<details>
<summary><strong>Groep 4 — Verificatie &amp; afronding</strong></summary>

## Groep 4 — Verificatie & afronding

Sluit het herontwerp af met dekkende toegankelijkheid, regressie en opgeruimde documentatie/dependencies.

### UX-401 — Toegankelijkheid en E2E-regressie

- [ ] **UX-401 afgerond**

Afhankelijkheden: groep 2 en groep 3.

Doel: aantonen dat het herontwerp de bestaande kwaliteitsondergrens haalt.

- [ ] Draai/actualiseer `@axe-core/playwright` op de kernschermen (menu, instellingen, elke in-game modus) via `e2e/accessibility.spec.ts`.
- [ ] Controleer handmatig: 48×48 px raakdoelen, logische focusvolgorde, zichtbare focus, contrast AA, `prefers-reduced-motion`, portrait + landscape + safe-area.
- [ ] Werk `e2e/critical-user-journey.spec.ts` bij als selectors/teksten door de herstijl zijn veranderd (bij voorkeur rol/naam, niet Tailwind-classes).
- [ ] Controleer dat het geen-microfoon-pad en handmatig-verder nog werken (kernflow uit het kwaliteitsdocument).
- [ ] Acceptatie: axe-kernschermen zonder violations; kritieke E2E-journey groen in Chromium + WebKit.
- [ ] Verificatie: `npm run test:e2e` en `npm run test:e2e:a11y` groen; handmatige checklist afgevinkt in `docs/accessibility/release-checklist.md`.
- [ ] **Kwaliteitscontrole:** toets aan `docs/code-quality-and-architecture.md` hoofdstuk 11.
- [ ] **Commitbericht voor gebruiker.**

### UX-402 — Budgetten, documentatie en opruimen

- [ ] **UX-402 afgerond**

Afhankelijkheden: UX-401.

Doel: bundelgroei bewaken, docs bijwerken en de nu overbodige dubbele UI-componenten verwijderen.

- [ ] Draai `npm run check:bundle`; controleer dat de shell- en gamechunk-budgetten (200 kB / 40 kB / 250 kB gzip) behouden blijven.
- [ ] Draai `npm run check:dead-code` (Knip) en verwijder de game-eigen `ui/`-componenten die na convergentie op de platform-primitives ongebruikt zijn — alleen na Knip-, import- en buildbevestiging.
- [ ] Werk `src/app/ARCHITECTURE.md` en relevante game-README's bij met de nieuwe gedeelde HUD/titel/tegel.
- [ ] Vervang verouderde screenshots/beschrijvingen die niet meer met de UI overeenkomen.
- [ ] Acceptatie: budgetten binnen grens; geen ongebruikte dubbele UI-component meer; docs komen overeen met de code.
- [ ] Verificatie: `npm run check`, `npm run check:bundle` en `npm run check:dead-code` groen.
- [ ] **Kwaliteitscontrole:** toets dependency-/dead-coderegels en documentatie aan `docs/code-quality-and-architecture.md`.
- [ ] **Commitbericht voor gebruiker.**

</details>

---

## Aanbevolen volgorde

1. **Groep 1** volledig (UX-101 → UX-104) — fundament, blokkeert de rest.
2. Daarna **Groep 2** en **Groep 3** parallel; binnen elke groep de taakvolgorde aanhouden (UX-302 vóór UX-303).
3. Afsluiten met **Groep 4** (UX-401 → UX-402).

Je kunt mij per taak vragen te implementeren, bijvoorbeeld: _"implementeer UX-102"_ of _"doe UX-301"_. Ik houd me dan aan de scope van die ene taak, voer de verificatie uit en lever een commitbericht — zonder zelf te committen.
