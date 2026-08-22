# Magisch Strand-Avontuur – Game Design & Pedagogisch Dossier

Welkom bij de uitgebreide ontwerp-, interactie- en pedagogische documentatie van **Magisch Strand-Avontuur** (onderdeel van het _+1 Woordenschat_ platform).

Dit dossier is opgesteld voor **game developers**, **educatieve ontwerpers**, **logopedisten/orthopedagogen** en **QA-specialisten**. Het beschrijft tot in detail de wetenschappelijke achtergrond, de leeringrepen, de exacte gameplaymechanieken en de gebruikersinteracties, zodat het spel volledig en nauwkeurig begrepen of gereproduceerd kan worden.

> [!IMPORTANT]
> **Definitief Game Design Document (GDD)**:  
> Voor het complete, overkoepelende industriestandaard ontwerpdossier (gebaseerd op het GitBook GDD Framework), zie:  
> 🎮 **[Game Design Document (GDD.md)](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/GDD.md)**

---

## 📚 Dossier Overzicht & Inhoudsopgave

Het dossier is modulair opgebouwd in de volgende hoofdstukken:

### 🌟 [00. Volledig Game Design Document (GDD.md)](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/GDD.md)

- Het complete overkoepelende GDD met executive summary, loops, USPs, mechanieken en tech-stack.

### 1. [01. Pedagogisch & Logopedisch Fundament](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/01-pedagogisch-en-logopedisch-fundament.md)

- Wetenschappelijke onderbouwing voor jonge kinderen (4–8 jaar), meertaligen en kinderen met een Taalontwikkelingsstoornis (TOS).
- Didactische principes: _Dual Coding_, _Scaffolding_, multimodale interactie (horen, zien, doen, zeggen) en foutloos leren.
- Observatiegericht datamodel: Pedagogische procesregistratie zonder toetsingsdruk of prestatielabels.

### 2. [02. Leerdoelen, Woorden & Ruimtelijke Oriëntatie](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/02-leerdoelen-en-curriculum.md)

- **Woordenschatcatalogus:** Zelfstandige naamwoorden, categorieën, lidwoorden, meervouden, verkleinwoorden en fonetische/kindertaal-aliassen.
- **Ruimtelijke Begrippen:** Statische en dynamische plaatsbepalingen (`in`, `op`, `onder`, `boven`, `naast`, `tussen`, `dichtbij`, `ver weg`, `links`, `rechts`, `midden`).
- **Zinsstructuren & Begrip:** Eenstaps- en tweestapsopdrachten, vraagvormen en syntactische opbouw.

### 3. [03. Gameplay & Exacte Interactie-specificaties](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/03-gameplay-en-interactie-specificaties.md)

- **Zeg & Zet (SceneBuilder):** Tap-to-place, drag-and-drop, continue microfoonherkenning, 15s opnameduur, 2,5s stiltetimer, realtime waveform `SpeechWaveAnimation`, zone-matching en feedbackloops.
- **Kies het Woord (Word Choice):** 10-vragenronde, audio- en video-opdrachten, feestelijke sparkles ✨, nazegzin, live cyclusvoortgangsbalk (`1/10`..`10/10`) en het in-game **Resultatenoverzicht**.
- **Zeg & Vlieg (Voice Side-Scroller):** Vliegende bezem, continue duim-rail hoogtecontrole, realtime spraakherkenning op zichtbare objecten (met zinsontleding), obstakels en ronde-resultatenscherm.

### 4. [04. Schermarchitectuur & User Flows](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/04-schermen-ux-en-user-flows.md)

- Specificatie van alle 9 UX-schermen en overlays.
- Navigatiehiërarchie, ergonomie, touch-targets (min. 48x48dp), visual feedback en landscape/portrait responsiveness.

### 5. [05. Beloningen, Voortgang & Opslag](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/05-beloningen-progressie-en-opslag.md)

- Beloningssysteem: Bezemskins (basis, strand, snelheid, goud), stickers, tempo (+) en woordsterren (⭐).
- Duurzame lokale opslagarchitectuur (Dexie / IndexedDB) met veilige tijdsafronding (`Math.round`).
- Privacybeleid: 100% lokaal in de browser, geen audio-opslag.

---

## 🎯 Doel van het Document voor Developers

Een developer moet met behulp van dit dossier in staat zijn om de complete interactielogica, visuele feedback, spraakregels en spelcycli van Magisch Strand-Avontuur vanaf nul na te bouwen op ieder platform (Web, iOS, Android, Unity).
