# 03. Gameplay & Exacte Interactie-specificaties

Dit document bevat de **stap-voor-stap technische en functionele interactiebeschrijvingen**. Een developer kan hiermee de volledige game vanaf scratch nabouwen op elk gewenst platform.

---

## 🎮 Modus 1: Zeg & Zet (SceneBuilder – Luisteren & Plaatsen)

### 1. Doel & Opzet

In deze modus bouwt het kind een levendige strandscène op door stickers op de juiste plek te zetten aan de hand van gesproken of getoonde opdrachten.

### 2. Spelbord & Coördinatenstelsel

- Het speelveld is een genormaliseerd 2D-vlak (`x: 0..1`, `y: 0..1`):
  - `y = 0.0`: Bovenkant (Lucht/Hemel)
  - `y = 0.4`: Horizon / Bovenkant Zee
  - `y = 0.65`: Strandlijn / Zandstrand
  - `y = 1.0`: Onderkant Strand / Paletzone
- **Zones:** Statische zones (`lucht`, `zee`, `strand`, `eiland`, `links-zee`, `rechts-strand`, `midden-strand`) en dynamische ankerzones (`naast-parasol`, `tussen-bal-zandkasteel`, `onder-parasol`).

### 3. Interactie- & Invoermethodes (3 Ingangen)

1. **Tap-to-Place (Direct aantikken)**:
   - Het kind tikt op een sticker in het onderste stickerpalet (`TRAY_STICKER_PALETTE`). De sticker wordt geselecteerd (krijgt een gouden ring/pulse).
   - Het kind tikt op een plek op het strand (`CANVAS_BEACH_OCEAN`). Er verschijnt direct een spook-preview (_pending placement_) op die positie.
   - Het kind tikt op de grote knop **"Klaar"** (`BTN_ACTION_KLAAR`) om de plaatsing te valideren.
2. **Drag-and-Drop (Slepen en Neerzetten)**:
   - Het kind pakt een sticker vast uit het palet met de vinger/muis.
   - De sticker zweeft mee onder de vinger over het speelveld.
   - Bij het loslaten (_drop_) berekent de engine automatisch de dichtstbijzijnde zone of ankerrelatie en opent de bevestigingsfase.
3. **Spraakgestuurd Plaatsen (Microfoon & Web Speech API)**:
   - Het kind tikt op het microfoontje of spreekt direct een zin in (bijv. _"Zet de boot in de zee"_).
   - **Spraakengine & Time-out Specificatie:**
     - `continuous: true`: De microfoon blijft actief luisteren en breekt niet af bij spreekpauzes.
     - `autoStopMs: 15000`: Maximale luisterduur van 15 seconden voor lange, rustig uitgesproken zinnen.
     - `silenceStopMs: 2500`: Zodra het kind stopt met praten, wacht de engine 2,5 seconden aanhoudende stilte alvorens de zin automatisch te parsen en te bevestigen.
     - `interimResults: true`: Live woorden worden direct doorgegeven aan de UI.
   - **Waveform & Live Feedback ([SpeechWaveAnimation](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/scene-builder/components/SpeechWaveAnimation.tsx)):**
     - Onderaan zweeft een glazen banner met pulserend microfoonicoon, animerende geluidsgolven en de live gehoorde tekst (`🗣️ "[gesproken zin]"`).
     - Bevat een directe **"Klaar"**-knop waarmee het kind de opname onmiddellijk kan beëindigen zonder op de 2,5s stiltetimer te wachten.
   - **Natuurlijke Taal Parser ([spoken-command-parser.ts](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/logic/spoken-command-parser.ts)):**
     - Normaliseert transcriptie (accenten weg, diakrieten, kleine letters).
     - Extraheert doelobject (`objectId`), ruimtelijke relatie (`relation`) en doelzone (`zoneId`).

### 4. Validatie, Feedback & Volgende

- **Correct:** Sticker wordt vastgezet op de doellocatie, er klinkt een vrolijk beloningsgeluidje, de feestelijke mascotte verschijnt en de knop verandert in **"Volgende"**.
- **Onjuist:** De juiste zone pulseert goudgeel op het strand (_visual hint_), en een vriendelijke stem geeft een aanwijzing (_"Kijk goed naar de plek die oplicht"_).

---

## 🎯 Modus 2: Kies het Woord (Word Choice Quiz)

### 1. Doel & Opzet

Een gerichte quiz van **10 afwisselende vragen** om auditieve discriminatie en snelle woordherkenning te trainen.

### 2. Spelcyclus per Vraag

1. **Presentatie:**
   - Bovenbalk toont de vraag (bijv. _"Waar is de dolfijn?"_).
   - De vraag wordt direct uitgesproken via spraaksynthese.
   - Indien beschikbaar is er een **Video-knop** (`InstructionVideoButton`) die de gesproken instructie met een gebarenvideo of animatie toont.
   - Een luidsprekerknop (`BtnAudioReplayPrompt`) laat het kind de vraag oneindig herhalen.
2. **Keuzekaarten (2 tot 4 grote stickers):**
   - Het speelveld toont 2 of 4 grote, kindvriendelijke kaarten met strandillustraties.
   - Touch-targets zijn minimaal `120x120dp`.
3. **Selectie & Directe Feedback:**
   - **Goed antwoord:** De gekozen kaart krijgt een heldere groene rand (`#10b981`), een groen vinkje verschijnt en er dansen feestelijke sparkles ✨ en sterren ⭐ rondom de kaart.
   - **Nazegzin:** De feedbackbalk toont direct een declaratieve zin (_"Super! Zeg na: De dolfijn zwemt in de zee"_).
   - **Volgende knop:** Er verschijnt een grote groene knop **"Volgende"** (`BtnActionKlaar`) om naar de volgende vraag te gaan.
   - **Bijna / Fout antwoord:** De kaart krijgt een oranje rand (`#e8663d`) met een zacht rood kruisje en een geruststellende stem geeft een hint (_"Kijk goed naar het water"_). De foute kaart wordt gedeactiveerd zodat het kind direct opnieuw kan kiezen (_foutarm leren_).

### 3. Live Cyclusvoortgangsbalk (Onderaan)

- De statusbalk volgt nauwkeurig de **10-vragen cyclus**:
  - Vraag 1: `Voortgang 1/10` (10% gevuld) + `⭐ 0/30`
  - Vraag 2: `Voortgang 2/10` (20% gevuld) + `⭐ 3/30`
  - Vraag 10: `Voortgang 10/10` (100% gevuld) + `⭐ 30/30`

### 4. Ronde-afronding & In-Game Resultatenoverzicht ([WordChoiceRoundSummary](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/word-choice/components/WordChoiceRoundSummary.tsx))

- Na het afronden van vraag 10 navigeert het spel **niet** weg, maar toont in-game het complete **Resultatenoverzicht**:
  - 🏅 **Feestelijke Mascotte**: Juichende zeester/karakter.
  - ⭐ **Verdiende Sterren**: Totaal aantal behaalde sterren over de 10 vragen.
  - ⚡ **Tempo / Score**: Behaalde snelheidspunten.
  - 🎯 **Aantal Goed**: Totaal aantal correct beantwoorde vragen (bijv. 10/10).
  - 📝 **Woordenlijst-analyse**:
    - _Meteen goed:_ Woorden die zonder hint zijn beantwoord.
    - _Goed met hint:_ Woorden waarbij visuele hulp nodig was.
    - _Extra geoefend:_ Woorden die herhaald zijn.
  - 🔄 **Knoppen:**
    - **"Opnieuw"** (`BtnActionReplay`): Start direct een nieuwe, willekeurig geschudde ronde van 10 vragen.
    - **"Menu"** (`BtnActionWorld`): Keert terug naar het spelkeuzemenu.

---

## 🚀 Modus 3: Zeg & Vlieg (Voice Side-Scroller)

### 1. Doel & Opzet

Een dynamische, vliegende side-scroller waarin het kind op een bezem over het strand vliegt en woorden hardop moet uitspreken om doelen te verzamelen.

### 2. Gameloop & Besturing

- **Loop:** Draait op `requestAnimationFrame` met framerate-onafhankelijke delta-tijden (`deltaMs = timestamp - previousTimestamp`).
- **Ergonomische Duim-rail (Hoogtebesturing):**
  - Aan de rechterkant (landscape) of zijkant van het scherm bevindt zich een verticale rail.
  - Door de duim omhoog of omlaag te bewegen stuurt het kind de bezem traploos tussen `y: 0.1` (hoog in de lucht) en `y: 0.9` (laag boven het water/strand).

### 3. Spraakherkenning op Zichtbare Doelen

- **Spawning & Selectie ([voiceSideScrollerSelectors.ts](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/voice-side-scroller/voiceSideScrollerSelectors.ts)):**
  - Doelobjecten (boot, krab, dolfijn, schelp, bal, parasol, zon) bewegen van rechts naar links over het scherm.
  - De spraakengine selecteert alle objecten in het actieve zichtvenster (`x: -0.08` tot `x: 1.1`).
- **Multi-token Herkenning ([useVoiceSideScrollerWordRecognition.ts](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/voice-side-scroller/useVoiceSideScrollerWordRecognition.ts)):**
  - Spraakherkenning draait continu (`restartOnEnd: true`).
  - Alle alternatieven (`maxAlternatives: 8`) worden geanalyseerd.
  - Zinnen worden automatisch opgeknipt in losse tokens: als het kind _"kijk een dolfijn"_ roept, pikt de engine direct `"dolfijn"` op.
- **Woordverzameling & Beloning:**
  - Bij herkenning: Object explodeert in sterren ✨, speler krijgt `+50` punten, `+1` tempo-boost en een positieve audio-cue.

### 4. Obstakels & Botsingen

- **Obstakels:** Wolken (`cloud`), meeuwen (`seagull`), haaien (`shark`) en zeeleeuwen (`sea-lion`) met geteste collision boxes.
- **Botsing:** Bezem vertraagt kort en raakt een ster kwijt.
- **Game Over / Ronde-einde ([VoiceSideScrollerRoundSummary](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/voice-side-scroller/VoiceSideScrollerRoundSummary.tsx)):**
  - Toont gevlogen afstand in meters, verzamelde woorden, obstakel-hits en opties voor direct herstarten of menu.
