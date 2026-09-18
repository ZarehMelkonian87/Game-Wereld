# Playwright E2E Testplan: Magisch Strand-Avontuur

Dit document bevat het stapsgewijze testplan met afvinkbare taken (`[ ]` / `[x]`) voor de end-to-end verificatie van **Magisch Strand-Avontuur** met Playwright.

---

## 🎯 Overzicht & Testdoelen

1. **Startscherm (SCR_MAIN_TITLE / StartScreen):**
   - Correcte rendering van titel, achtergrond, sterrenteller en knoppen.
   - Navigatie naar Instellingen en Terug naar portaal.
   - Starten van de game flow (naar avontuur-selectie).

2. **Instellingenscherm (SCR_SETTINGS / GameSettingsScreen):**
   - Audio toggles (geluidseffecten, achtergrondmuziek, spraakbegeleiding).
   - Microfoon- en privacy-instellingen (stemdata lokaal, statusweergave).
   - Reset progressie dialoog (annuleren vs. bevestigen).
   - Veilige terugkeer naar het startscherm met behoud van instellingen.

3. **Zeg & Zet Game (SCR_ZEG_ZET_GAME / SceneBuilderScreen):**
   - **Navigatie:** Starten vanuit modusselectie (`SCR_ADVENTURE_SELECT` -> `Zeg & Zet`).
   - **Opdracht & Instructie:** Tonen van de mascotte, gesproken/tekstuele opdracht en instructie-videoknop.
   - **Typfunctionaliteit:** Toetsenbord-knop openen, typen van een commando (bijv. _"Zet de bal op het strand"_), commando verzenden en plaatsing verifiëren.
   - **Microfoon & Spraakopname:**
     - Microfoon activeren via `VoiceCommandButton`.
     - `SpeechWaveAnimation` validatie: verhoogde positie bovenaan onder de instructiekaart, golfanimatie zichtbaar, status "Ik luister...", realtime tekstweergave.
     - "Klaar"-knop functionaliteit.
     - Voldoende luistertijd (minimaal 4s stiltetimer, geen voortijdig verdwijnen).
   - **Stickerplaatsing (Handmatig & Drag-and-Drop):**
     - Selecteren uit `ObjectCarousel` en tikken op `SceneAreaCanvas`.
     - Drag-and-drop van stickers naar doelzones.
   - **Feedback bij Goed Antwoord:**
     - Plaatsing in de juiste zone activeert succesfeedback (`FloatingSuccessToast`).
     - Succesgeluid/animatie en "Volgende" actieknop.
     - Bijwerken van sterrenteller en voortgang.
   - **Feedback bij Fout Antwoord:**
     - Plaatsing in verkeerde zone toont herstelbare feedback.
     - Doelzone pulseert / licht op als visuele hint (`TargetZoneHint`).
     - Geen straf; kind kan het object opnieuw oppakken of herplaatsen.

---

## 📋 Takenlijst & Voortgang

### Fase 1: Startscherm (`StartScreen`)

- [x] **Test 1.1:** Startscherm toont alle basiselementen (titel "Magisch Strand-Avontuur", mascotte, sterrenteller, speelknop, instellingenknop, terugknop).
- [x] **Test 1.2:** Klik op "Instellingen" navigeert naar het instellingenscherm (`data-testid="game-settings-screen"`).
- [x] **Test 1.3:** Klik op "Terug" navigeert veilig terug naar het hoofdmenu van Game-Wereld.
- [x] **Test 1.4:** Klik op "Speel" navigeert door naar het speltype-selectiescherm (`SCR_ADVENTURE_SELECT`).

### Fase 2: Instellingenscherm (`GameSettingsScreen`)

- [x] **Test 2.1:** Instellingenscherm toont toggles voor geluid, muziek en spraak, plus spraakprivacy en voortgangskaarten.
- [x] **Test 2.2:** Toggles voor audio kunnen worden aan- en uitgezet (aria-checked status wijzigt en persisteert in opslag).
- [x] **Test 2.3:** Microfoonpermissie en lokale spraakstatus worden helder gerapporteerd ("Microfoon en privacy").
- [x] **Test 2.4:** Voortgang reset dialoog: openen, annuleren sluit de dialoog zonder dataverlies, bevestigen reset de lokale score/sterren.
- [x] **Test 2.5:** Terugknop navigeert terug naar `StartScreen` met behoud van gewijzigde instellingen.

### Fase 3: Zeg & Zet (`SceneBuilderScreen`)

- [x] **Test 3.1:** Selecteren van "Zeg & Zet" (`listen-and-place`) opent `SceneBuilderScreen` met strandachtergrond, carrousel met stickers en instructiekaart.
- [x] **Test 3.2 (Typfunctionaliteit):**
  - Klikken op de toetsenbord-toggle opent het invoerveld `TypedCommandFallback`.
  - Invoeren van een commando (bijv. _"bal op strand"_ of voorgestelde zin) en verzenden.
  - Het commando wordt gevalideerd en het object verschijnt op het speelveld.
- [x] **Test 3.3 (Microfoon & Waveform weergave):**
  - Klikken op de microfoonknop start de luistersessie via `VoiceCommandButton`.
  - `SpeechWaveAnimation` verschijnt in de **hoge positie** (bovenaan onder de instructiekaart via `fixed z-50`, overlapt niet met carrousel).
  - Waveform balkjes animeren en tekst toont "Ik luister...".
  - Klikken op "Klaar" rondt de sessie netjes af zonder dat clicks onderschept worden door andere lagen.
  - Voldoende luistertijd (4s stiltetimer, geen vroegtijdig verdwijnen).
- [x] **Test 3.4 (Handmatige plaatsing & Carrousel):**
  - Tikken op een sticker in `ObjectCarousel` selecteert het object.
  - Tikken op het strand (`scene-tap-target`) plaatst het object op de gekozen coördinaten.
- [x] **Test 3.5 (Fout Antwoord & Hinting):**
  - Klikken op "Klaar" zonder plaatsing of foute plaatsing toont herstelbare feedback (`data-kind="almost"`).
  - Hintknop activeert oplichtende doelzone (`TargetZoneHint`).
- [x] **Test 3.6 (Goed Antwoord & Positieve Feedback):**
  - Juiste plaatsing/commando activeert successtatus (`data-kind="correct"`).
  - `FloatingSuccessToast` toont succesvolle bevestiging.
  - Actieknop verandert in "Volgende".
  - Klikken op "Volgende" gaat door naar de volgende opdracht.

---

## 📊 Resultaten

- **Playwright Testbestand:** `e2e/magisch-strand-avontuur.spec.ts`
- **Resultaat:** 14 van de 14 tests geslaagd (100% groen) op Chromium-tablet.
- **Geen browser console- of paginafouten:** Alle browser errors zijn blokkerend gecontroleerd.

---

## 🔒 Regels & Richtlijnen

- **NIET PUSHEN:** Geen commits naar `origin` pushen totdat de gebruiker dit expliciet aangeeft.
- **Stapsgewijze uitvoering:** Tests worden één voor één geschreven, uitgevoerd in Playwright en afgevinkt in dit document.
