# 04. Schermarchitectuur & User Flows

Dit document beschrijft de volledige schermstructuur, user flows, navigatietransities en ergonomische ontwerprichtlijnen van **Magisch Strand-Avontuur**.

---

## 🗺️ User Flow & Schermhiërarchie

De game volgt een intuïtieve, kindvriendelijke staat-machine (`useBezemEscapeGameController`):

```
                       ┌─────────────────────────┐
                       │    SCR_MAIN_TITLE       │
                       │   (Startscherm 1)       │
                       └───────────┬─────────────┘
                                   │ "Speel"
                                   ▼
                       ┌─────────────────────────┐
                       │  SCR_ADVENTURE_SELECT   │◄──────────────┐
                       │   (Spelkeuzemenu 2)     │               │
                       └───────────┬─────────────┘               │
            ┌──────────────────────┼──────────────────────┐      │ "Menu"
            ▼                      ▼                      ▼      │
   ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
   │SCR_ZEG_ZET_GAME│     │SCR_KIES_WOORD  │     │SCR_ZEG_VLIEG   │
   │ (SceneBuilder) │     │     (Quiz)     │     │(Side-Scroller) │
   └───────┬────────┘     └───────┬────────┘     └───────┬────────┘
           │                      │                      │
           │ Ronde Klaar          │ 10 Vragen Klaar      │ Game Over
           ▼                      ▼                      ▼
   ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
   │SCR_REWARD_SUMM.│     │WordChoiceSummary│    │ScrollerSummary │
   │ (Beloningen 4) │     │ (In-Game Modal)│     │(In-Game Modal) │
   └────────────────┘     └────────────────┘     └────────────────┘
```

---

## 📱 De 9 Schermen & Overlays in Detail

### 1. `SCR_MAIN_TITLE` – Hoofdscherm / Startmenu

- **Functie:** Landingsscherm van de game. Zet de vrolijke strandsfeer neer met geanimeerde bezemmascotte.
- **Elementen:**
  - `StartTopBar`: Terugknop naar portaal, instellingenknop (`BtnSettingsGear`), profielavatar.
  - `BtnPrimaryPlay`: Grote, pulserende speelknop in het centrum.

### 2. `SCR_ADVENTURE_SELECT` – Spelkeuzemenu

- **Functie:** Keuze tussen de 3 spelmodi en werelden.
- **Elementen:**
  - Moduskaarten: _Zeg & Zet_ (Sticker op strand), _Kies het Woord_ (Quiz kaarten), _Zeg & Vlieg_ (Vliegavontuur).
  - Onderbalk (`AdventureBottomNavigation`): Beloningenknop (`BtnSecondaryReward`) en terugknop.

### 3. `SCR_ZEG_ZET_GAME` – Zeg & Zet (SceneBuilder)

- **Functie:** Luister-, spreek- en stickerplaatsingsspel.
- **Elementen:**
  - `TopHud`: Vraagherhaal-knop, hintknop, sterrenteller en terugknop.
  - `SceneAreaCanvas`: Het interactieve strand met stickers, drop-zones en animaties.
  - `SpeechWaveAnimation`: Zwevende microfoon- en golfbalk onderaan met live tekst.
  - `TrayStickerPalette`: Het onderste palet met kiesbare stickers.

### 4. `SCR_KIES_WOORD_GAME` – Kies het Woord (Quiz)

- **Functie:** 10-vragenkeuzequiz met visuele en gesproken opdrachten.
- **Elementen:**
  - Vraagpaneel met optionele `InstructionVideoButton` en `BtnAudioReplayPrompt`.
  - 2 of 4 `ObjectStickerButton` keuzekaarten met directe sparkles ✨ bij succes.
  - `GameplayStatusBar`: Voortgangsbalk die de cyclus van `1/10` t/m `10/10` volgt en sterren toont.
  - `WordChoiceRoundSummary`: In-game resultatenscherm na vraag 10.

### 5. `SCR_ZEG_VLIEG_ACTIVE` – Zeg & Vlieg (Voice Side-Scroller)

- **Functie:** Realtime vlieggame met microfoon en duim-rail.
- **Elementen:**
  - `VoiceSideScrollerStage`: Canvas met bewegende achtergrond, speler en obstakels.
  - `VoiceSideScrollerThumbRail`: Verticale hoogtebesturingsrail.
  - `VoiceSideScrollerStatusPanel`: Microfoonluisterstatus en tempo-indicatie.
  - `VoiceSideScrollerRoundSummary`: Ronde-eindmodal met score en herstartknoppen.

### 6. `SCR_REWARD_SUMMARY` – Beloningen & Voortgang

- **Functie:** Kast met ontgrendelde bezemskins en stickers.
- **Elementen:** `RewardCard`, `RewardActionsPanel` met "Kies een Wereld" en "Speel Opnieuw".

### 7. `SCR_SETTINGS` – Instellingen & Privacy

- **Functie:** Toegankelijkheid en systeemconfiguratie.
- **Elementen:** Geluidstoggles, hintstoggles, microfoontest met live browserstatus, verminderde beweging (_reduced motion_).

### 8. `OVERLAY_KEYBOARD_FALLBACK` – Toetsenbord Invoer

- **Functie:** Toegankelijkheidsmodal voor situaties waarin geen microfoon beschikbaar is of in stille omgevingen.

### 9. `OVERLAY_PARENT_ASSIST` – Ouder & Begeleidershulp

- **Functie:** Eenvoudig paneel waarin een ouder of logopedist kan aangeven of het kind het woord zelfstandig heeft uitgesproken.

---

## 📐 Ergonomie, Touch Targets & Responsive Layout

1. **Touch Targets:**
   - Alle knoppen voldoen aan WCAG 2.1 AAA richtlijnen voor kinderen: minimale afmeting van **`48x48dp`** (keuzekaarten zijn minimaal `120x120dp`).
2. **Safe Area Insets:**
   - Volledige ondersteuning voor moderne mobiele schermen (notches, dynamic islands, home bars) via `calc(env(safe-area-inset-top) + ...)` en `env(safe-area-inset-bottom)`.
3. **Landscape vs. Portrait Adaptatie:**
   - **Landscape:** Vraag/statuspaneel links, antwoordkaarten of duim-rail rechts voor natuurlijke tweehandige tablet-/telefoonbediening.
   - **Portrait:** Verticale flexibele stapeling met behoud van de centrale speelzone.
