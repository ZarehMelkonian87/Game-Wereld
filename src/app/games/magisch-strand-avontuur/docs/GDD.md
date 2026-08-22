# 🎮 Game Design Document (GDD) – Magisch Strand-Avontuur

**Project:** Magisch Strand-Avontuur (+1 Woordenschat Platform)  
**Versie:** 2.0 (Definitieve Productie & GDD Specificatie)  
**Genre:** Educatieve Serious Game / Spraak- en Taalontwikkeling / Logopedische Gamified Oefenomgeving  
**Doelgroep:** Kinderen 4–8 jaar (Kleuters, Groep 1–4, Meertalig/NT2, Taalontwikkelingsstoornis TOS)  
**Platform:** Cross-Platform Web (PWA), Touchscreen Tablets (iPad/Android), Desktop Browsers (Chrome/Safari/Edge)  
**Methodologie:** Geïnspireerd op industry-standard GDD-richtlijnen (GitBook GDD Framework, Jesse Schell, Scott Rogers) & Logopedische Scaffolding.

---

## 📑 Inhoudsopgave (GDD Overzicht)

1. [Executive Summary & High Concept](#1-executive-summary--high-concept)
2. [Doelgroep, Pedagogiek & Logopedische Pijlers](#2-doelgroep-pedagogiek--logopedische-pijlers)
3. [Core Gameplay Loops & Spelmodi](#3-core-gameplay-loops--spelmodi)
   - [3.1 Modus 1: Zeg & Zet (SceneBuilder)](#31-modus-1-zeg--zet-scenebuilder)
   - [3.2 Modus 2: Kies het Woord (Word Choice Quiz)](#32-modus-2-kies-het-woord-word-choice-quiz)
   - [3.3 Modus 3: Zeg & Vlieg (Voice Side-Scroller)](#33-modus-3-zeg--vlieg-voice-side-scroller)
4. [Woorden, Begrippen & Curriculum Matrix](#4-woorden-begrippen--curriculum-matrix)
5. [Invoer-, Besturings- & Spraaktechnologie Specificaties](#5-invoer--besturings--spraaktechnologie-specificaties)
6. [Game Systems, Beloningen & Economie](#6-game-systems-beloningen--economie)
7. [User Interface (UI) & User Experience (UX) Specificaties](#7-user-interface-ui--user-experience-ux-specificaties)
8. [Data-Architectuur, Privacy & Veiligheid](#8-data-architectuur-privacy--veiligheid)
9. [Toegankelijkheid (Accessibility) & Foutloos Leren](#9-toegankelijkheid-accessibility--foutloos-leren)

---

## 1. Executive Summary & High Concept

### 1.1 De Elevator Pitch

> _"Magisch Strand-Avontuur is een interactieve, spraakgestuurde educatieve game waarin jonge kinderen op een vliegende magische bezem het strand verkennen, luisteropdrachten uitvoeren, stickers plaatsen en woorden hardop uitspreken om hun woordenschat, zinsbegrip en ruimtelijke oriëntatie spelenderwijs te versterken."_

### 1.2 Unieke Verkoop- & Speelpunten (USPs)

1. **Multimodale Drievoudige Invoer**: Spelen via aanraken (_tap_), slepen (_drag-and-drop_) én directe steminvoer (_microfoon/Web Speech API_).
2. **Continue, Kindvriendelijke Spraakherkenning**: Geen frustrerende vroege afbrekingen; 15s opnameduur, 2,5s adaptieve stiltetimer, live golfanimatie en ondersteuning voor kindertaal-aliassen.
3. **Logopedisch Verantwoord Scaffolding**: Geen afstraffing of faalangst; visuele hints, oplichtende doelzones en audio-herhalingen ondersteunen elk kind in zijn eigen tempo.
4. **Volledige Offline & Privacy-First Werking**: 100% lokale spraakverwerking in de browser; géén audio-opslag of externe datalekken.

---

## 2. Doelgroep, Pedagogiek & Logopedische Pijlers

### 2.1 Spelerpersona's

- **Persona A – De Jonge Kleuter (4–5 jaar)**: Heeft een ontluikende woordenschat, leert door auditieve en visuele koppeling, gebruikt intuïtief de touchscreen-modus.
- **Persona B – Het Kind met TOS (4–8 jaar)**: Heeft moeite met complexe zinnen en abstracte voorzetsels (_onder_, _tussen_), heeft baat bij het visueel oplichten van doelzones en de video-instructies.
- **Persona C – Het NT2 / Meertalige Kind (5–8 jaar)**: Leert Nederlands als tweede taal; profiteert van de uitgesproken lidwoorden (_de boot_, _het vliegtuig_), duidelijke uitspraakmodellen en nazegzinnen.

### 2.2 Wetenschappelijke & Didactische Pijlers

```
             ┌──────────────────────────────────────────────┐
             │      DUAL CODING THEORY (Paivio)             │
             │ Gelijktijdige activatie van beeld + geluid   │
             └──────────────────────┬───────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────┴───────────────────────────────────┐
│                    DE LOGOPEDISCHE LEERTRAP                           │
│  1. RECEPTIEF (Herkennen) ──> 2. RELATIE (Plaatsen) ──> 3. PRODUCTIEF │
│     Kies het Woord                Zeg & Zet                Zeg & Vlieg│
└───────────────────────────────────┬───────────────────────────────────┘
                                    │
                                    ▼
             ┌──────────────────────────────────────────────┐
             │       SCAFFOLDING & FOUTARM LEREN            │
             │ Geen faalervaring; progressieve visuele hulp │
             └──────────────────────────────────────────────┘
```

---

## 3. Core Gameplay Loops & Spelmodi

### Algemene Core Gameloop

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. HOOR/ZIE │ ──> │ 2. BEGRIJP   │ ──> │ 3. ACTIE     │ ──> │ 4. BEKRACH-  │
│   Opdracht   │     │  & Verwerk   │     │ Touch/Stem   │     │    TIGING    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
       ▲                                                              │
       └──────────────────────── 5. PROGRESSIE ───────────────────────┘
```

---

### 3.1 Modus 1: Zeg & Zet (SceneBuilder)

- **Mechanics**:
  1. Spel start met een gesproken en getoonde opdracht (bijv. _"Zet de gele zeester onder de parasol"_).
  2. Speler pakt de sticker vast of spreekt een commando in.
  3. Speler plaatst de sticker op het interactieve strandcanvas (`CANVAS_BEACH_OCEAN`).
  4. Bij juiste plaatsing: feestelijke geluiden, succesmascotte en doorgang naar de volgende opdracht.
  5. Bij twijfel: knop "Hint" laat de doelzone subtiel pulseren op het strand.

---

### 3.2 Modus 2: Kies het Woord (Word Choice Quiz)

- **Mechanics**:
  1. Ronde bestaat uit **10 gestructureerde opdrachten** met 2 of 4 keuzekaarten.
  2. Bovenbalk toont vraag (bijv. _"Waar is de dolfijn?"_) met spraaksynthese en optionele video.
  3. Speler tikt op de juiste kaart:
     - **Goed**: Kaart krijgt groene rand (`#10b981`), sparkles ✨ dansen rondom, en er klinkt een nazegzin (_"Super! Zeg na: De dolfijn zwemt in de zee"_).
     - **Fout**: Kaart krijgt oranje rand met subtiel kruisje; kaart schakelt uit en stem geeft een vriendelijke tip (_"Kijk goed naar het water"_).
  4. **Voortgangsbalk**: Volgt live de cyclus: `Voortgang 1/10` t/m `10/10`.
  5. **Eindscherm ([WordChoiceRoundSummary](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/word-choice/components/WordChoiceRoundSummary.tsx))**:
     - Blijft in-game gemount (geen plotselinge exit).
     - Toont behaalde sterren (⭐), tempo (⚡), aantal goed direct / met hint, en knoppen voor direct **"Opnieuw"** of **"Menu"**.

---

### 3.3 Modus 3: Zeg & Vlieg (Voice Side-Scroller)

- **Mechanics**:
  1. Speler vliegt continu op de bezem van links naar rechts over het strand.
  2. **Besturing**: Duim-rail aan de zijkant regelt traploos de vlieghoogte (`y: 0.1` t/m `y: 0.9`).
  3. **Stemherkenning**: Zodra een doelobject in beeld verschijnt (boot, krab, dolfijn, bal, schelp, zon), spreekt het kind de naam hardop uit.
  4. **Verzamelen**: Object wordt direct verzameld (`+50` punten, `+1` tempo-boost, sterrenregen).
  5. **Obstakels**: Wolken, meeuwen, haaien en zeeleeuwen moeten ontweken worden via de duim-rail.
  6. **Ronde-einde ([VoiceSideScrollerRoundSummary](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/voice-side-scroller/VoiceSideScrollerRoundSummary.tsx))**: Geeft meters, sterren en behaalde score weer.

---

## 4. Woorden, Begrippen & Curriculum Matrix

### 4.1 Doelwoordenlijst

| ID          | Doelwoord | Lidwoord | Categorie     | Meervoud    | Verkleinwoord | Spraak-aliassen & Kindertaal                                  |
| :---------- | :-------- | :------- | :------------ | :---------- | :------------ | :------------------------------------------------------------ |
| `boot`      | boot      | de       | Voertuigen    | boten       | bootje        | `boot`, `bootje`, `zeilboot`, `boten`, `bootjes`, `schip`     |
| `bal`       | bal       | de       | Strandspullen | ballen      | balletje      | `bal`, `strandbal`, `ballen`, `balletje`, `balletjes`         |
| `krab`      | krab      | de       | Dieren        | krabben     | krabbetje     | `krab`, `krabben`, `krap`, `krabbetje`, `krabbetjes`          |
| `dolfijn`   | dolfijn   | de       | Dieren        | dolfijnen   | dolfijntje    | `dolfijn`, `dolfijnen`, `dolfin`, `dolfijntje`, `dolfijntjes` |
| `parasol`   | parasol   | de       | Strandspullen | parasols    | parasolletje  | `parasol`, `strandparasol`, `parasolletje`, `paraplu`         |
| `schelp`    | schelp    | de       | Strandspullen | schelpen    | schelpje      | `schelp`, `schelpje`, `schelpen`, `schelpjes`                 |
| `zon`       | zon       | de       | Natuur        | zonnen      | zonnetje      | `zon`, `zonnetje`, `zonnig`, `zonnetjes`                      |
| `vliegtuig` | vliegtuig | het      | Voertuigen    | vliegtuigen | vliegtuigje   | `vliegtuig`, `vliegtuigje`, `vliegmachine`, `vliegtuigen`     |
| `vlieger`   | vlieger   | de       | Strandspullen | vliegers    | vliegertje    | `vlieger`, `vliegertje`, `kite`, `vliegers`                   |
| `vuurtoren` | vuurtoren | de       | Bouwwerken    | vuurtorens  | vuurtorentje  | `vuurtoren`, `vuurtorentje`, `toren`, `lichttoren`            |

### 4.2 Ruimtelijke Plaatsbegrippen Matrix

- **Statische Posities**: `in` (in de zee), `op` (op het strand/eiland), `boven` (in de lucht), `onder` (onder de parasol).
- **Relatieve Posities**: `naast` (naast een ander object), `tussen` (tussen twee ankerobjecten), `dichtbij`, `ver weg`.
- **Laterale Posities**: `links`, `rechts`, `midden`.

---

## 5. Invoer-, Besturings- & Spraaktechnologie Specificaties

### 5.1 Spraakherkenning Specificatie (Web Speech API)

```typescript
const speechConfig = {
  lang: "nl-NL",
  continuous: true, // Blijft actief luisteren tijdens korte spraakpauzes
  interimResults: true, // Geeft live tussentijdse transcriptie door aan UI
  maxAlternatives: 8, // Analyseert alle akoestische kandidaatwoorden
  autoStopMs: 15000, // 15s maximale time-out voor lange zinnen
  silenceStopMs: 2500, // 2.5s aanhoudende stilte alvorens automatisch af te ronden
};
```

### 5.2 Live Waveform & Terugkoppeling ([SpeechWaveAnimation](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/scene-builder/components/SpeechWaveAnimation.tsx))

- Zwevend venster onderin met pulserend microfoonicoon, geluidsgolven en live transcriptie (`🗣️ "..."`).
- Bevat een expliciete **"Klaar"**-knop zodat het kind de opname direct kan bevestigen zonder op de stiltetimer te wachten.

---

## 6. Game Systems, Beloningen & Economie

### 6.1 Beloningsvaluta

- ⭐ **Woordsterren**: `+2` per succesvolle actie, `+1` bonus bij zelfstandig antwoord zonder hint.
- ⚡ **Tempo**: Snelheidsmeter die visuele energie geeft en boosters activeert.

### 6.2 Ontgrendelbare Bezemskins

1. 🧹 **Basis Bezem** (0 sterren) – Hout met strik.
2. 🏖️ **Strand Bezem** (10 sterren) – Geel zonnig met zeester.
3. ⚡ **Snelheids Bezem** (25 sterren) – Aerodynamisch met bliksem.
4. 👑 **Gouden Bezem** (50 sterren) – Magisch goud met glinsteraura.

---

## 7. User Interface (UI) & User Experience (UX) Specificaties

### 7.1 De 9 Schermen & Overlays

1. `SCR_MAIN_TITLE`: Startscherm met speelknop, avatar en instellingen.
2. `SCR_ADVENTURE_SELECT`: Spelkeuzemenu (Zeg & Zet, Kies het Woord, Zeg & Vlieg).
3. `SCR_ZEG_ZET_GAME`: Interactieve sticker- en spraakscène.
4. `SCR_KIES_WOORD_GAME`: 10-vragen quiz met live cyclusbalk.
5. `SCR_ZEG_VLIEG_ACTIVE`: Side-scroller met duim-rail en vliegende bezem.
6. `SCR_REWARD_SUMMARY`: Overzicht van ontgrendelde bezems en stickers.
7. `SCR_SETTINGS`: Audio-, microfoon- en toegankelijkheidsinstellingen.
8. `OVERLAY_KEYBOARD_FALLBACK`: Toetsenbordinvoer voor stille omgevingen.
9. `OVERLAY_PARENT_ASSIST`: Begeleiderspaneel voor handmatige observaties.

### 7.2 Ergonomie & Touch Targets

- Knoppen hebben een minimale afmeting van **`48x48dp`** (keuzekaarten minimaal `120x120dp`).
- Safe-area insets (`env(safe-area-inset-top)` / `bottom`) zorgen voor storingsvrij spel op moderne telefoons en tablets.

---

## 8. Data-Architectuur, Privacy & Veiligheid

### 8.1 Lokale Opslag (Dexie.js / IndexedDB)

- Alle observaties worden weggeschreven als `PracticeEventV1` records via het centrale platform.
- Reactietijden en tijdsduren worden strikt geheeltallig afgerond via `Math.round(Math.max(0, ms))` om database-schemavalidatiefouten te voorkomen.

### 8.2 Privacy & Kindveiligheid (AVG / COPPA)

- **Geen audio-opslag**: Spraak wordt uitsluitend realtime in het browsergeheugen verwerkt en direct daarna gewist.
- **Geen externe tracking**: Geen cookies, advertenties of in-app aankopen.

---

## 9. Toegankelijkheid (Accessibility) & Foutloos Leren

1. **Gelijkwaardige Invoermethodes**: Elk gesproken commando kan ook via aanraking of toetsenbord worden uitgevoerd.
2. **Reduced Motion**: Ondersteuning voor spelers die gevoelig zijn voor snelle animaties of parallax.
3. **Oneindige Herhaling**: Instructies kunnen onbeperkt opnieuw beluisterd worden zonder tijdsstraf.
