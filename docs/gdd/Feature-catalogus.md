# 🧩 Feature-catalogus — Magisch Strand-Avontuur

> Document 2 van 4 in het GDD-dossier. Werkt sectie 10 van de [GDD-index](GDD-index.md) volledig uit: **elke concrete functionaliteit** krijgt een stabiel `FEAT_`-ID, een verwacht gedrag, een testhaak (`data-testid`) en een **status**. Dit is het document waarmee je "de hele game in kaart brengt" en per onderdeel ziet: werkt / kapot / niet getest.

---

## 0. Leeswijzer

### 0.1 Metadata

| Veld | Waarde |
| :--- | :--- |
| **Documenttitel** | Feature-catalogus — Magisch Strand-Avontuur |
| **Documentversie** | `0.2` (eerste verificatieronde in de browser uitgevoerd) |
| **Laatst bijgewerkt** | 2026-09-11 |
| **Status** | 🟡 In verificatie — kern-flows live getest op 2026-09-11 (zie 0.5) |
| **Bron van waarheid** | De code onder `src/app/games/magisch-strand-avontuur/` + [GDD-index](GDD-index.md) |

### 0.2 Hoe lees je een regel

| Kolom | Betekenis |
| :--- | :--- |
| **FEAT-ID** | Stabiel ID, formaat `FEAT_<SCHERM>_<KORT>`. Verandert niet bij tekst-/codewijziging. |
| **Feature** | Korte naam van de functionaliteit. |
| **Verwacht gedrag** | Wat er hoort te gebeuren (de bedoeling volgens de GDD-index). |
| **Testhaak** | `data-testid` of herkenbaar element voor (geautomatiseerd) testen. |
| **Status** | Zie legenda 0.3. |
| **Notitie** | Verwijzing naar GAP/taak of bijzonderheid. |

### 0.3 Statuslegenda

🟢 Werkt · 🟡 Deels · 🔴 Kapot/ontbreekt · ⚪ Niet getest · 🔵 Gepland · ⚫ Dood (opruimen)

> **Belangrijk:** de meeste features staan nu op **⚪ Niet getest**. Dat betekent *nog niet geverifieerd*, niet *werkt niet*. De statussen worden ingevuld via de **Test-matrix** (document 4) of door de app te draaien. De niet-⚪ statussen komen uit de code-analyse in de GDD-index (sectie 11).

### 0.4 Statusoverzicht (rollup)

*Bijgewerkt na de verificatieronde van 2026-09-11.*

| Status | Aantal |
| :--- | :--: |
| 🟢 Werkt (geverifieerd) | 46 |
| 🟡 Deels | 5 |
| 🔴 Kapot/ontbreekt | 2 |
| ⚪ Niet getest / niet testbaar hier | 13 |
| 🔵 Gepland | 2 |
| ⚫ Dood | 2 |
| **Totaal** | **70** |

### 0.5 Verificatieronde 2026-09-11 (browser, dev-server poort 3100)

Ik heb de volledige onboarding + alle drie de speelmodi + beloning + instellingen live doorlopen. Belangrijkste uitkomsten:

**Werkt goed (🟢):** de hele onboarding-flow (welkom → profiel → avatar → naam → thema → gamelijst → game), alle navigatie tussen game-schermen, Zeg & Zet (tap-plaatsing, toetsenbord + commando-parser, succesfeedback, hint, volgende), Kies het Woord (goed/fout/hint/voortgang, 12 vragen), Zeg & Vlieg (vliegen, obstakels, duim-rail, ronde-einde), beloningsscherm en instellingen (toggles, mic-status, reset-dialoog + annuleren).

**Nieuwe problemen gevonden (naast de bekende GAP's):**

| # | Bevinding | Ernst | Taak |
| :-- | :--- | :--- | :--- |
| 1 | **Instructievideo speelt niet af** — bij elke Zeg & Zet-opdracht verschijnt "De video-opdracht kan niet worden afgespeeld". Ook in Kies het Woord aanwezig. | 🔴 | `T-19` |
| 2 | **Dev-tool zichtbaar voor gebruikers** — de toggle "Zone Editor (DevTools)" staat gewoon in het instellingenscherm dat ouders/kinderen zien. | 🟡 | `T-20` |
| 3 | **Sterren lijken niet per-profiel** — een net aangemaakt profiel "Test" toont meteen **120 ⭐** op start/menu. Mogelijk gedeelde of geseede teller. | 🟡 | `T-21` |
| 4 | **Kaarten flitsen kort leeg** in Kies het Woord bij het doorschakelen naar de volgende vraag (afbeeldingen laden met vertraging). | ⚪ polish | `T-23` |

**Bevestigd (live) van de bekende GAP's:**
- `GAP-01` — bij de **allereerste** goede actie verschenen meteen **beide** unlocks ("Schelp Sticker, Zee Blauwe Bezemkleur"). Systeem is direct uitgeput. ✅ bevestigd.
- `GAP-15` — Zeg & Zet gaat opdracht-na-opdracht door **zonder** ronde-eindscherm. ✅ bevestigd.
- `GAP-13` — de vraagvolgorde in Kies het Woord is gerandomiseerd (begon bij `parasol`). ✅ bevestigd.
- Rondelengte Kies het Woord = **12** ("Voortgang 1/12"). ✅ bevestigd.

**Doc-nuance:** in Zeg & Vlieg leidde één botsing tot **"Game over — Je raakte een obstakel"**. De GDD-index (4.4) stelt "geen game-over per botsing" — dat moet worden genuanceerd → `T-22`.

**Niet testbaar in deze omgeving (⚪):** alles wat een échte microfoon vereist (spraakherkenning in Zeg & Zet en Zeg & Vlieg, `FEAT_*_MIC/WAVE/VOICE`) en hoorbare audio-output. De mic werd door de testbrowser geblokkeerd (correct gerapporteerd door de app). Deze vergen verificatie op een echt apparaat.

---

## 1. Platform-schil (`SCR_PLAT_*`)

De +1 Woordenschat-schil rondom de game. Features op hoofdlijn (testhaken nog toe te voegen).

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_PLAT_WELCOME` | Welkomstscherm | App start, instapknop naar profielkeuze | *(n.t.b.)* | 🟢 | `SCR_PLAT_WELCOME` |
| `FEAT_PLAT_PROFILE_PICK` | Profiel kiezen | Bestaand kindprofiel selecteren | *(n.t.b.)* | 🟢 | |
| `FEAT_PLAT_PROFILE_CREATE` | Profiel aanmaken | Nieuw profiel maken | *(n.t.b.)* | 🟢 | |
| `FEAT_PLAT_AVATAR_PICK` | Avatar kiezen | Avatar selecteren (16 avatars) | *(n.t.b.)* | 🟢 | |
| `FEAT_PLAT_NAME_CONFIRM` | Naam bevestigen | Naam invoeren/bevestigen | *(n.t.b.)* | 🟢 | |
| `FEAT_PLAT_THEME_PICK` | Thema kiezen | Thema/wereld kiezen op home | *(n.t.b.)* | 🟢 | |
| `FEAT_PLAT_GAME_PICK` | Game kiezen | Game kiezen in gamelijst | *(n.t.b.)* | 🟢 | |
| `FEAT_PLAT_GAME_HOST` | Game laden | `GamePlayScreen` host laadt Magisch Strand-Avontuur | *(n.t.b.)* | 🟢 | |
| `FEAT_PLAT_SETTINGS` | Platforminstellingen | Instellingen op app-niveau | *(n.t.b.)* | ⚪ | Niet apart geopend |
| `FEAT_PLAT_PROGRESS` | Voortgangsoverzicht | Toont observatiemodel per profiel | *(n.t.b.)* | ⚪ | `T-17` verifiëren |

---

## 2. Startscherm (`SCR_MSA_START`)

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_START_RENDER` | Scherm rendert | Titel, mascotte, achtergrond verschijnen | `start-screen` | 🟢 | |
| `FEAT_START_STARS` | Sterrenteller | Toont actueel aantal ⭐ | `start-star-counter` | 🟡 | Toonde 120 bij nieuw profiel, `T-21` |
| `FEAT_START_PLAY` | Speelknop | Gaat naar avontuur kiezen (`SCR_MSA_MODE_SELECT`) | `start-play-button` | 🟢 | Navigatie werkt; opruimen `world-select` via `T-05` |
| `FEAT_START_SETTINGS` | Instellingenknop | Opent `SCR_MSA_SETTINGS` | `start-settings-button` | ⚪ | Knop aanwezig, niet vanaf hier geopend |
| `FEAT_START_EXIT` | Terug naar platform | Verlaat de game naar de schil | *(n.t.b.)* | ⚪ | Knop aanwezig |

---

## 3. Avontuur kiezen (`SCR_MSA_MODE_SELECT`)

> Eén scherm voor wereld- én moduskeuze (review-beslissing, `T-05`). Component: `AdventureSelectScreen`.

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_MODE_RENDER` | Scherm rendert | Kaarten + navigatie zichtbaar | `adventure-select-screen` | 🟢 | |
| `FEAT_MODE_STARS` | Sterrenteller | Toont actueel aantal ⭐ | `adventure-select-star-counter` | 🟡 | Zie `T-21` (120 ⭐) |
| `FEAT_MODE_WORLD_MSG` | Wereldstatusbericht | Toont status (open/komt later/gesloten) | `world-select-message` | ⚪ | Niet expliciet waargenomen |
| `FEAT_MODE_CARD_ZEGZET` | Kaart Zeg & Zet | Selecteert modus `listen-and-place` | *(CardGameZegZet)* | 🟢 | Vooraf geselecteerd ✓ |
| `FEAT_MODE_CARD_KIESWOORD` | Kaart Kies het Woord | Selecteert modus `choose-word` | *(CardGameKiesWoord)* | 🟢 | |
| `FEAT_MODE_CARD_ZEGVLIEG` | Kaart Zeg & Vlieg | Selecteert modus `zeg-en-vlieg` | *(CardGameZegVlieg)* | 🟢 | |
| `FEAT_MODE_CARD_ZEGBOUW` | Kaart Zeg & Bouw | Selecteert modus `zeg-en-bouw` | *(n.t.b.)* | 🔵 | Gepland, `T-04` |
| `FEAT_MODE_START` | Start-avontuur-knop | Start de geselecteerde modus | `adventure-start-game-button` | 🟢 | |
| `FEAT_MODE_REWARDS` | Beloningen openen | Opent `SCR_MSA_REWARD` | `adventure-rewards-button` | 🟢 | Knop aanwezig |
| `FEAT_MODE_SETTINGS` | Instellingen openen | Opent `SCR_MSA_SETTINGS` | `adventure-settings-button` | 🟢 | Knop aanwezig |
| `FEAT_MODE_NAV` | Onderbalk-navigatie | Navigatie onderaan | `adventure-bottom-navigation` | 🟢 | |
| `FEAT_MODE_BACK` | Terug naar start | Terug naar `SCR_MSA_START` | *(n.t.b.)* | 🟢 | Terug-pijl aanwezig |

---

## 4. Zeg & Zet — Scene Builder (`SCR_MSA_SCENE_BUILDER`)

De rijkste modus: opdracht + drie invoerwegen + feedback.

### 4.1 Opdracht & instructie

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_SCENE_RENDER` | Scherm rendert | Strandcanvas, carrousel, instructiekaart | `scene-builder-screen`, `scene-builder-scene-area` | 🟢 | |
| `FEAT_SCENE_INSTRUCTION` | Opdrachttekst | Toont de opdracht als tekst | `scene-builder-instruction-text` | 🟢 | |
| `FEAT_SCENE_AUDIO` | Opdracht voorlezen | Spreekt de opdracht uit (spraaksynthese) | *(BtnTaskAudio)* | ⚪ | Audio-output niet hoorbaar getest |
| `FEAT_SCENE_VIDEO` | Instructievideo | Toont animatievideo van de handeling | *(InstructionVideoButton)* | 🔴 | **"Video-opdracht kan niet worden afgespeeld"**, `T-19` |

### 4.2 Invoer: tap & sleep

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_SCENE_CAROUSEL` | Objectcarrousel | Objecten selecteerbaar in tray | `scene-builder-tray-area` | 🟢 | Selectie toont "Tik nu op de plek" |
| `FEAT_SCENE_TAP_PLACE` | Tik-plaatsing | Geselecteerd object plaatsen door op strand te tikken | `scene-tap-target` | 🟢 | Vuurtoren op eiland geplaatst |
| `FEAT_SCENE_DRAG_PLACE` | Sleep-plaatsing | Object via drag-and-drop naar zone slepen | *(useSceneBuilderDragAndDrop)* | ⚪ | Niet getest (drag) |

### 4.3 Invoer: stem

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_SCENE_MIC` | Microfoon starten | Start luistersessie (`continuous`, `silenceStopMs 4000`) | `spoken-command-actions` | ⚪ | UI bereikbaar; echte mic niet testbaar hier |
| `FEAT_SCENE_WAVE` | Luister-indicator | Golfanimatie + "Ik luister…" + live transcriptie | *(SpeechWaveAnimation)* | ⚪ | Vereist echte mic |
| `FEAT_SCENE_STOP` | Klaar-knop | Rondt luistersessie netjes af | `speech-stop-button` | ⚪ | Vereist echte mic |
| `FEAT_SCENE_PARSE` | Commando uitvoeren | Parser plaatst object bij confidence `high` | `repeat-spoken-command` | 🟢 | Getest via typ-commando: dolfijn correct in zee geplaatst |
| `FEAT_SCENE_MIC_MSG` | Microfoonmelding | Toont status/toestemmingsmelding | `microphone-permission-message` | ⚪ | |
| `FEAT_SCENE_PRIVACY` | Privacy-notice | Toont privacy-uitleg vóór 1e gebruik | `voice-privacy-notice`, `voice-privacy-accept-button` | 🟢 | Verscheen bij mic-klik |
| `FEAT_SCENE_PRIVACY_FALLBACK` | Fallback-notitie | Wijst op toetsenbord als spraak niet kan | `voice-privacy-fallback-note` | 🟢 | Zichtbaar in notice |

### 4.4 Invoer: toetsenbord (fallback)

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_SCENE_KB_OPEN` | Toetsenbord openen | Opent invoerveld | `typed-command-open-button` | 🟢 | "TYP DE ZIN" opent |
| `FEAT_SCENE_KB_INPUT` | Commando typen | Tekstinvoer van commando | `typed-command-input` | 🟢 | Veld accepteert invoer |
| `FEAT_SCENE_KB_SUBMIT` | Commando verzenden | Voert getypt commando uit | `typed-command-submit-button` | 🟢 | "Gebruik zin" plaatst object |
| `FEAT_SCENE_KB_CLOSE` | Toetsenbord sluiten | Sluit het veld | `typed-command-close-button` | ⚪ | Knop aanwezig |
| `FEAT_SCENE_KB_CURSOR` | Toetsenbord-cursor | Visuele cursor bij plaatsing | `scene-keyboard-cursor` | ⚪ | |

### 4.5 Feedback, hint & voortgang

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_SCENE_FEEDBACK_OK` | Succesfeedback | `data-kind="correct"` + succes-toast | `scene-builder-feedback` | 🟢 | "Goed gedaan! +1 Tempo!" |
| `FEAT_SCENE_FEEDBACK_ALMOST` | Herstelbare feedback | `data-kind="almost"`, geen straf | `scene-builder-feedback` | ⚪ | Foute plaatsing niet getest |
| `FEAT_SCENE_HINT` | Doelzone-hint | Zone pulseert/licht op | `target-zone-hint-boundary`, `target-zone-hint-magic-rings` | 🟢 | "Kijk naar het plaatje dat oplicht" |
| `FEAT_SCENE_CONFIRM` | Bevestigen/Volgende | Actieknop; door naar volgende opdracht | `scene-builder-confirm-button` | 🟢 | Klaar → Volgende → nieuwe opdracht |
| `FEAT_SCENE_REWARD_MSG` | Unlock-melding | Toont nieuwe beloning bij succes | `reward-unlock-message` | 🟡 | Beide unlocks bij 1e actie, `T-01` (bevestigd) |
| `FEAT_SCENE_SUMMARY` | Ronde-eindscherm | In-game samenvatting aan einde ronde | *(SCR_MSA_OV_SCENE_SUMMARY)* | 🔴 | **Ontbreekt** (bevestigd), `T-03` |

### 4.6 Dev-tools (alleen ontwikkelaar)

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_SCENE_DEVTOOLS` | Zone-editor | Zones bewerken via `?dev=true` | `scene-zone-devtools` | ⚪ | Dev-only |

---

## 5. Kies het Woord (`SCR_MSA_WORD_CHOICE`)

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_WORD_RENDER` | Scherm rendert | Vraagpaneel + keuze-area | `word-choice-screen` | 🟢 | |
| `FEAT_WORD_QUESTION` | Vraagweergave | Toont vraag + doelkaart | `word-choice-question-panel`, `word-choice-target-card` | 🟢 | "Waar is de parasol?" |
| `FEAT_WORD_AUDIO` | Vraag voorlezen | Spreekt de vraag uit; onbeperkt herhaalbaar | *(playQuestionAudio)* | ⚪ | Audio-output niet hoorbaar getest |
| `FEAT_WORD_OPTIONS` | Keuzekaarten | 2–4 kaarten aanklikbaar | `word-choice-answer-area` | 🟢 | 2 en 3 kaarten gezien |
| `FEAT_WORD_CORRECT` | Goed antwoord | Groene rand + succes + bonus zonder hint | *(feedback kind="correct")* | 🟢 | "+1 Tempo! Bonus zonder hint!" + nazegzin |
| `FEAT_WORD_WRONG` | Fout antwoord | Vriendelijke tip, geen straf | *(feedback kind="almost")* | 🟢 | Rode ✗, "Bijna. Zoek nog eens…" |
| `FEAT_WORD_HINT` | Hint | Toont hint (indien aan) | *(handleHint)* | 🟢 | Hinttekst + juiste kaart licht op |
| `FEAT_WORD_PROGRESS` | Voortgang | Statusbalk loopt mee | `word-choice-status-area` | 🟢 | "Voortgang 1/12 → 2/12" |
| `FEAT_WORD_NEXT` | Volgende | Naar volgende vraag | `word-choice-next-button` | 🟢 | |
| `FEAT_WORD_REWARD_MSG` | Unlock-melding | Nieuwe beloning bij succes | `word-choice-reward-unlock-message` | 🟡 | `T-01` |
| `FEAT_WORD_SUMMARY` | Ronde-eindscherm | In-game samenvatting (sterren/tempo/goed) | `word-choice-round-summary` | ⚪ | 12-vragenronde niet uitgespeeld |
| `FEAT_WORD_SUMMARY_REPLAY` | Opnieuw | Herstart de ronde | `word-choice-summary-replay-button` | ⚪ | |
| `FEAT_WORD_SUMMARY_MENU` | Menu | Terug naar `SCR_MSA_MODE_SELECT` | `word-choice-summary-menu-button` | ⚪ | |

---

## 6. Zeg & Vlieg — Voice Side-Scroller (`SCR_MSA_VOICE_SCROLLER`)

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_FLY_RENDER` | Scherm rendert | Arena, HUD, achtergrond | `voice-side-scroller-screen`, `voice-side-scroller-stage` | 🟢 | |
| `FEAT_FLY_START_OVERLAY` | Start-overlay | Legt de ronde uit vóór start | `voice-side-scroller-start-overlay` | 🟢 | Doelwoorden + privacy |
| `FEAT_FLY_HUD` | HUD | Toont score/afstand/status | `voice-side-scroller-hud`, `voice-side-scroller-status-panel` | 🟢 | Afstand loopt op |
| `FEAT_FLY_THUMBRAIL` | Duim-rail besturing | Regelt traploos de vlieghoogte | `voice-side-scroller-thumb-rail` | 🟢 | Rail aanwezig/reageert |
| `FEAT_FLY_PLAYER` | Vliegende held | Beweegt continu, volgt hoogte | `voice-side-scroller-player` | 🟢 | Vliegt, 0→92m |
| `FEAT_FLY_TARGETS` | Doelobjecten | Verschijnen om benoemd te worden | `voice-side-scroller-target-layer` | ⚪ | Doelen benoemen vereist mic |
| `FEAT_FLY_VOICE` | Stem-verzamelen | Object verzamelen door naam uit te spreken | *(useVoiceSideScrollerWordRecognition)* | ⚪ | Vereist echte mic |
| `FEAT_FLY_OBSTACLES` | Obstakels | Wolk/meeuw/haai/zeeleeuw | `voice-side-scroller-obstacle-layer` | 🟢 | Botsing → game over ⚠️ doc `T-22` |
| `FEAT_FLY_SUMMARY` | Ronde-eindscherm | Meters, sterren, score | `voice-side-scroller-round-summary` | 🟢 | "Game over — 92 meter" + stats |
| `FEAT_FLY_SUMMARY_WORLD` | Naar menu | Terug naar `SCR_MSA_MODE_SELECT` | `game_over_resultaat-world-button` | 🟢 | Knop aanwezig |

---

## 7. Beloningsscherm (`SCR_MSA_REWARD`)

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_REWARD_RENDER` | Scherm rendert | Titel + beloningskaart | `reward-screen`, `reward-title` | 🟢 | |
| `FEAT_REWARD_FEATURED` | Uitgelichte beloning | Toont belangrijkste unlock | `reward-card`, `reward-featured-name` | 🟢 | "Schelp Sticker" |
| `FEAT_REWARD_STARS` | Sterrenweergave | Toont behaalde ⭐ | `reward-stars` | 🟢 | |
| `FEAT_REWARD_UNLOCKS` | Ontgrendelde items | Lijst van unlocks | `reward-unlocks`, `reward-unlock-message` | 🟡 | Werkt; `T-01` (uitgeput) |
| `FEAT_REWARD_SUMMARY` | Resultaatoverzicht | Samenvatting van de ronde | `reward-result-summary` | 🟢 | Stats-tegels tonen |
| `FEAT_REWARD_REPLAY` | Opnieuw spelen | Herstart zelfde modus | `reward-play-again-button` | 🟢 | Knop aanwezig |
| `FEAT_REWARD_WORLD` | Naar menu | Terug naar `SCR_MSA_MODE_SELECT` | `reward-world-button` | 🟢 | Knop aanwezig |

---

## 8. Instellingen (`SCR_MSA_SETTINGS`)

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_SET_RENDER` | Scherm rendert | Titel + panelen | `game-settings-screen`, `settings-title` | 🟢 | |
| `FEAT_SET_AUDIO` | Geluid-toggle | `audioEnabled` aan/uit, persistent | *(ToggleAudio)* | ⚪ | Toggle zichtbaar; effect/persist niet bevestigd |
| `FEAT_SET_MUSIC` | Muziek-toggle | `musicEnabled` aan/uit, persistent | *(ToggleMusic)* | ⚪ | Toggle zichtbaar |
| `FEAT_SET_HINTS` | Hints-toggle | `hintsEnabled` aan/uit, persistent | *(ToggleHints)* | ⚪ | Toggle zichtbaar |
| `FEAT_SET_MOTION` | Reduced-motion-toggle | `reducedMotion` aan/uit, persistent | *(ToggleReducedMotion)* | ⚪ | Toggle zichtbaar; effect `T-14` |
| `FEAT_SET_DEVTOOLS_TOGGLE` | Zone Editor toggle | Dev-tool schakelaar | *(ToggleDevtools)* | 🟡 | **Zichtbaar voor eindgebruiker**, `T-20` |
| `FEAT_SET_MIC_STATUS` | Microfoonstatus | Toont toestemming/omgeving/poging | `settings-microphone-permission-message` | 🟢 | "Microfoon is geblokkeerd" correct gemeld |
| `FEAT_SET_MIC_REQUEST` | Microfoon aanvragen | Vraagt toestemming | `settings-request-microphone-button` | 🟢 | "Controleer opnieuw" aanwezig |
| `FEAT_SET_PRIVACY_CARD` | Privacykaart | Toont privacy-informatie | `settings-voice-privacy-card` | 🟢 | |
| `FEAT_SET_PRIVACY_TOGGLE` | Privacy-dropdown | "Waarom gebruiken we de microfoon?" | `settings-voice-privacy-toggle` | 🟢 | Aanwezig |
| `FEAT_SET_RESET_OPEN` | Reset openen | Opent bevestigingsdialoog | `settings-reset-progress-button` | 🟢 | Dialoog opent |
| `FEAT_SET_RESET_CONFIRM` | Reset bevestigen | Wist voortgang | `settings-confirm-reset-button` | ⚪ | Niet uitgevoerd; `T-11`: wist het álles? |
| `FEAT_SET_RESET_CANCEL` | Reset annuleren | Sluit zonder dataverlies | `settings-cancel-reset-button` | 🟢 | Dialoog sluit |
| `FEAT_SET_RESET_MSG` | Reset-melding | Bevestigt de reset | `settings-reset-message` | ⚪ | |
| `FEAT_SET_BACK` | Terug | Terug met behoud van instellingen | `settings-back-button` | ⚪ | Knop aanwezig |

---

## 9. Zeg & Bouw (`SCR_MSA_ZEG_BOUW`) — 🔵 gepland

| FEAT-ID | Feature | Verwacht gedrag | Testhaak | Status | Notitie |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `FEAT_ZEGBOUW_MODE` | Modus + scherm | Nog te ontwerpen en te bouwen | — | 🔵 | `T-04`; mechanica t.b.d. |

---

## 10. Transversale features (over schermen heen)

| FEAT-ID | Feature | Verwacht gedrag | Status | Notitie |
| :--- | :--- | :--- | :--: | :--- |
| `FEAT_X_SPEECH` | Spraakherkenning | Hook + parser + foutmeldingen, per scherm geconfigureerd | 🟡 | Parser 🟢 (typ); herkenning vereist mic |
| `FEAT_X_TTS` | Spraaksynthese | Opdrachten/nazegzinnen voorlezen | ⚪ | Audio-output niet hoorbaar getest |
| `FEAT_X_MUSIC` | Achtergrondmuziek | Speelt/pauzeert volgens `musicEnabled` | ⚪ | `GameBackgroundMusic` |
| `FEAT_X_REWARDS` | Beloningssysteem | Één "Strandschat"-curve (na `T-01`) | 🟡 | Uitgeput na 1e actie (bevestigd) |
| `FEAT_X_PROGRESS` | Observatie-registratie | Elke actie → `PracticeEvent` | ⚪ | `T-17` |
| `FEAT_X_SETTINGS_RESPECT` | Instellingen-respect | `audio`/`hints`/`motion` beïnvloeden gedrag | ⚪ | |
| `FEAT_X_A11Y` | Toegankelijkheid | 48×48, focus-visible, aria, tekst-altijd | ⚪ | `T-13`, `T-14` |
| `FEAT_X_OFFLINE` | Offline/PWA | Speelbaar zonder netwerk | ⚪ | |
| `FEAT_X_DASHBOARD` | Dashboard-staat | — | ⚫ | Dood, `T-06` |
| `FEAT_X_WORLD_SELECT` | Losse wereldkeuze-staat | — | ⚫ | Dubbel, samenvoegen `T-05` |

---

## 11. Nieuwe taken uit deze catalogus

De verificatieronde (0.5) leverde nieuwe taken op, toegevoegd aan GDD-index sectie 12:

- **`T-18` (P2, 🔍):** Alle resterende ⚪-features verifiëren (o.a. op een echt apparaat met microfoon).
- **`T-19` (P1, 🔧):** Instructievideo speelt niet af ("De video-opdracht kan niet worden afgespeeld") — assets of afspeellogica repareren.
- **`T-20` (P2, 🔧):** "Zone Editor (DevTools)"-toggle verbergen voor eindgebruikers in productie.
- **`T-21` (P2, 🔍🔧):** Sterrenteller toont 120 bij nieuw profiel — onderzoeken of sterren per-profiel resetten (raakt `GAP-10`).
- **`T-22` (P3, 📄):** GDD 4.4 nuanceren: obstakel-botsing in Zeg & Vlieg kan game-over veroorzaken.
- **`T-23` (P3, 🔧):** Kies het Woord — kaarten flitsen kort leeg bij het doorschakelen (afbeeldingen preloaden).

---

## 12. Volgende stap

Deze catalogus is de invoer voor:
1. **User Journey Map** (`JRN_*`) — rijgt deze features aaneen tot gebruikersreizen.
2. **Test-matrix** (`TC_*`) — koppelt een testcase aan elke `FEAT_`, vult de status-kolom hier.
