# 🧩 Feature-catalogus — Magisch Strand-Avontuur

> Elke functie die in de game zit, met testhaak en status. Wat niet gebouwd is, staat in de [Versie 2-backlog](Versie-2-Backlog.md). Detail per modus: zie de modusdocumenten vanuit de [GDD](GDD-index.md).

| Veld                  | Waarde                                   |
| :-------------------- | :--------------------------------------- |
| **Documentversie**    | `1.0` (opgeschoond)                      |
| **Laatst bijgewerkt** | 2026-09-22                               |
| **Status**            | 🟢 Alle functies gebouwd en geverifieerd |

**Statuslegenda:** 🟢 werkt (geautomatiseerd of op toestel bevestigd) · 👤 werkt, alleen handmatig te bevestigen (microfoon/geluid).

---

## 1. Platform-schil (`SCR_PLAT_*`)

| FEAT-ID                    | Feature              | Verwacht gedrag                                                       | Testhaak                                | Status |
| :------------------------- | :------------------- | :-------------------------------------------------------------------- | :-------------------------------------- | :----: |
| `FEAT_PLAT_WELCOME`        | Welkomstscherm       | START leidt naar profielkeuze                                         | knop "START"                            |   🟢   |
| `FEAT_PLAT_PROFILE_CREATE` | Profiel aanmaken     | "NIEUWE SPELER" → avatarkeuze                                         | knop "NIEUWE SPELER"                    |   🟢   |
| `FEAT_PLAT_PROFILE_PICK`   | Profiel kiezen       | Bestaand profiel behoudt sterren, unlocks en instellingen             | `[data-component="ProfileCard"]`        |   🟢   |
| `FEAT_PLAT_AVATAR_PICK`    | Avatar kiezen        | Avatar selecteerbaar, daarna naamstap                                 | `[data-component="AvatarCard"]`         |   🟢   |
| `FEAT_PLAT_NAME_CONFIRM`   | Naam bevestigen      | "LET'S GO!" maakt het profiel aan                                     | placeholder "Typ je gamernaam..."       |   🟢   |
| `FEAT_PLAT_ZONE_PICK`      | Zone kiezen          | Zone met speelbare game opent; zone zonder game is vergrendeld        | `[data-theme-id]`                       |   🟢   |
| `FEAT_PLAT_ZONE_LOCKED`    | Zone binnenkort      | Vergrendelde zone toont "Binnenkort beschikbaar" en reageert niet     | `data-coming-soon="true"`               |   🟢   |
| `FEAT_PLAT_GAME_PICK`      | Game kiezen          | Kaart opent de game (of de download-gate)                             | `[data-component="GameListCard"]`       |   🟢   |
| `FEAT_PLAT_GATE`           | Download-gate        | Op telefoon/tablet pas spelen na 100% lokale content                  | `[data-component="DownloadGateModal"]`  |   🟢   |
| `FEAT_PLAT_GATE_CELLULAR`  | 4G/5G-waarschuwing   | Bevestiging met "Toch downloaden" of "Wacht op wifi"                  | zelfde modal                            |   🟢   |
| `FEAT_PLAT_GATE_REMOVE`    | Lokaal verwijderen   | In-app bevestiging, daarna terug naar `📥`                            | `[data-component="ConfirmDeleteModal"]` |   🟢   |
| `FEAT_PLAT_PROGRESS`       | Voortgangsscherm     | Categorie-uitsplitsing en tempo-inzicht per profiel                   | route `/progress`                       |   🟢   |
| `FEAT_PLAT_EXPORT`         | Voortgang exporteren | Download zonder naam, avatar of transcript                            | knop "Voortgang downloaden"             |   🟢   |
| `FEAT_PLAT_MIC_DIAGNOSE`   | Microfoon-diagnose   | Toont omgeving, API, toestemming; stappen loggen; rapport kopieerbaar | `diagnose-microfoon-screen`             |   🟢   |

## 2. Startscherm (`SCR_MSA_START`)

| FEAT-ID               | Feature             | Verwacht gedrag                           | Testhaak                | Status |
| :-------------------- | :------------------ | :---------------------------------------- | :---------------------- | :----: |
| `FEAT_START_RENDER`   | Scherm rendert      | Titel, mascotte, sterrenteller, knoppen   | `start-screen`          |   🟢   |
| `FEAT_START_PLAY`     | Spelen              | Naar avontuur kiezen                      | `start-play-button`     |   🟢   |
| `FEAT_START_STARS`    | Sterrenteller       | Toont het echte cumulatieve profieltotaal | `start-star-counter`    |   🟢   |
| `FEAT_START_SETTINGS` | Instellingen        | Opent game-instellingen                   | `start-settings-button` |   🟢   |
| `FEAT_START_EXIT`     | Terug naar platform | Verlaat de game naar de spellenlijst      | knop "Terug"            |   🟢   |

## 3. Avontuur kiezen (`SCR_MSA_MODE_SELECT`)

| FEAT-ID              | Feature           | Verwacht gedrag                                             | Testhaak                        | Status |
| :------------------- | :---------------- | :---------------------------------------------------------- | :------------------------------ | :----: |
| `FEAT_MODE_RENDER`   | Scherm rendert    | Wereld + vier moduskaarten in leerlijnvolgorde              | `adventure-select-screen`       |   🟢   |
| `FEAT_MODE_CARDS`    | Moduskaarten      | Kaart per modus; vergrendelde modus toont benodigde sterren | `compact-mode-card-*`           |   🟢   |
| `FEAT_MODE_UNLOCK`   | Ontgrendeling     | 0 / 3 / 8 / 14 ⭐ conform de leerlijn                       | `data-disabled` op de kaart     |   🟢   |
| `FEAT_MODE_START`    | Spel starten      | Start de gekozen modus                                      | `adventure-start-game-button`   |   🟢   |
| `FEAT_MODE_STARS`    | Sterrenteller     | Cumulatief profieltotaal                                    | `adventure-select-star-counter` |   🟢   |
| `FEAT_MODE_REWARDS`  | Beloningen openen | Opent het beloningsscherm                                   | `adventure-rewards-button`      |   🟢   |
| `FEAT_MODE_SETTINGS` | Opties openen     | Opent game-instellingen                                     | `adventure-settings-button`     |   🟢   |
| `FEAT_MODE_NAV`      | Onderbalk         | Navigatie tussen wereld, beloning en opties                 | `adventure-bottom-navigation`   |   🟢   |

## 4. Kies het Woord (`SCR_MSA_WORD_CHOICE`)

> Mechanica: [Modus — Kies het Woord](Modus-Kies-het-Woord.md).

| FEAT-ID                    | Feature          | Verwacht gedrag                                                                     | Testhaak                            | Status |
| :------------------------- | :--------------- | :---------------------------------------------------------------------------------- | :---------------------------------- | :----: |
| `FEAT_WORD_RENDER`         | Scherm rendert   | Vraagpaneel, keuzekaarten, statusbalk                                               | `word-choice-screen`                |   🟢   |
| `FEAT_WORD_QUESTION`       | Vraagweergave    | Vraag + doelkaart + videoknop                                                       | `word-choice-question-panel`        |   🟢   |
| `FEAT_WORD_OPTIONS`        | Keuzekaarten     | 2–4 kaarten, moeilijkheid loopt op met het niveau                                   | `word-choice-answer-area`           |   🟢   |
| `FEAT_WORD_CORRECT`        | Goed antwoord    | Groene rand, succestekst met juist lidwoord, nazegzin, bonus zonder hint            | `word-choice-target-card`           |   🟢   |
| `FEAT_WORD_WRONG`          | Fout antwoord    | Vriendelijke tip, geen straf, opnieuw kiezen mag                                    | `word-choice-target-card`           |   🟢   |
| `FEAT_WORD_HINT`           | Hint             | Hinttekst + juiste kaart licht op; telt als "met hulp"                              | hintknop in de HUD                  |   🟢   |
| `FEAT_WORD_AUTO_ADVANCE`   | Automatisch door | Na goed antwoord vanzelf verder (1,8 s; 2,6 s bij beloning); extra tikken genegeerd | `data-auto-advancing`               |   🟢   |
| `FEAT_WORD_SOUND`          | Goed/fout-geluid | Kort CC0-geluid, respecteert de audio-instelling                                    | `logic/feedback-sounds.ts`          |   🟢   |
| `FEAT_WORD_PROGRESS`       | Voortgang        | Statusbalk loopt 1/12 → 12/12                                                       | `word-choice-status-area`           |   🟢   |
| `FEAT_WORD_REWARD_MSG`     | Unlock-melding   | Nieuwe beloning verschijnt bij succes                                               | `word-choice-reward-unlock-message` |   🟢   |
| `FEAT_WORD_SUMMARY`        | Ronde-eindscherm | Sterren, tempo, goed direct/met hint, volgende beloning                             | `word-choice-round-summary`         |   🟢   |
| `FEAT_WORD_SUMMARY_REPLAY` | Opnieuw          | Herstart met verse volgorde                                                         | `word-choice-summary-replay-button` |   🟢   |
| `FEAT_WORD_SUMMARY_MENU`   | Menu             | Terug naar moduskeuze                                                               | `word-choice-summary-menu-button`   |   🟢   |

## 5. Zeg & Zet (`SCR_MSA_SCENE_BUILDER`)

> Mechanica: [Modus — Zeg & Zet](Modus-Zeg-en-Zet.md).

| FEAT-ID                      | Feature                | Verwacht gedrag                                                  | Testhaak                           | Status |
| :--------------------------- | :--------------------- | :--------------------------------------------------------------- | :--------------------------------- | :----: |
| `FEAT_SCENE_RENDER`          | Scherm rendert         | Speelveld, instructie en objectbalk                              | `scene-builder-screen`             |   🟢   |
| `FEAT_SCENE_INSTRUCTION`     | Opdracht               | Opdracht altijd als tekst zichtbaar                              | `scene-builder-instruction-text`   |   🟢   |
| `FEAT_SCENE_AUDIO`           | Opdracht voorlezen     | Spraaksynthese; nette melding als audio uitstaat                 | audioknop in de opdrachtbalk       |   👤   |
| `FEAT_SCENE_VIDEO`           | Instructievideo        | Toont de handeling; nette tekstfallback bij een fout             | videoknop                          |   🟢   |
| `FEAT_SCENE_CAROUSEL`        | Objectbalk             | Objecten selecteerbaar, horizontaal scrollbaar                   | `scene-builder-tray-area`          |   🟢   |
| `FEAT_SCENE_TAP_PLACE`       | Tik-plaatsing          | Gekozen object verschijnt op de aangetikte plek                  | `scene-tap-target`                 |   🟢   |
| `FEAT_SCENE_DRAG_PLACE`      | Sleep-plaatsing        | Object naar zone slepen plaatst het                              | `scene-builder-scene-area`         |   🟢   |
| `FEAT_SCENE_KEYBOARD_PLACE`  | Toetsenbordplaatsing   | Pijltoetsen verplaatsen het kruispunt, Enter plaatst             | `scene-keyboard-cursor`            |   🟢   |
| `FEAT_SCENE_MIC`             | Microfoon              | Start een luistersessie (continu, 4 s stilte)                    | `voice-command-button`             |   👤   |
| `FEAT_SCENE_WAVE`            | Luister-indicator      | Golf + "Ik hoor je" + live transcriptie                          | `speech-stop-button`               |   🟢   |
| `FEAT_SCENE_PARSE`           | Commando-ontleding     | Object + relatie + zone/anker met betrouwbaarheidsniveau         | `logic/spoken-command-parser.ts`   |   🟢   |
| `FEAT_SCENE_RETRY`           | Herkansingspaneel      | Bij een fout blijft de mic herstartbaar, met typ-alternatief     | `speech-retry-panel`               |   🟢   |
| `FEAT_SCENE_MIC_MSG`         | Microfoonmelding       | Toestemmingsstatus kindvriendelijk gemeld                        | `microphone-permission-message`    |   🟢   |
| `FEAT_SCENE_KB_OPEN`         | Typen openen           | Opent het typ-paneel en zet de mic uit                           | `typed-command-open-button`        |   🟢   |
| `FEAT_SCENE_KB_INPUT`        | Overtyp-veld           | Doelzin als spookletters, groen/rood per letter, Enter bevestigt | `typed-command-input`              |   🟢   |
| `FEAT_SCENE_KB_SUBMIT`       | Zin gebruiken          | Voert het getypte commando uit                                   | `typed-command-submit-button`      |   🟢   |
| `FEAT_SCENE_KB_CLOSE`        | Typen sluiten          | Sluit het paneel                                                 | `typed-command-close-button`       |   🟢   |
| `FEAT_SCENE_ONE_INPUT`       | Eén invoer tegelijk    | Nooit wave én typ-paneel tegelijk                                | `data-fallback-visible`            |   🟢   |
| `FEAT_SCENE_AUTO_CONFIRM`    | Automatisch bevestigen | Correcte plaatsing wordt meteen bevestigd, geen Klaar-knop       | `scene-builder-feedback`           |   🟢   |
| `FEAT_SCENE_FEEDBACK_OK`     | Succesfeedback         | `data-kind="correct"` + zwevende toast + sterren                 | `scene-builder-feedback`           |   🟢   |
| `FEAT_SCENE_FEEDBACK_ALMOST` | Herstelbare feedback   | `data-kind="almost"`, geen straf                                 | `scene-builder-feedback`           |   🟢   |
| `FEAT_SCENE_HINT`            | Doelzone-hint          | Doelzone pulseert en licht op                                    | `target-zone-hint-boundary`        |   🟢   |
| `FEAT_SCENE_ANCHOR_SAFE`     | Ontbrekend anker       | Opdracht met ongeplaatst anker crasht niet en telt niet als goed | `logic/dynamic-scene-relations.ts` |   🟢   |
| `FEAT_SCENE_REWARD_MSG`      | Unlock-melding         | Nieuwe beloning bij succes                                       | `scene-builder-next-reward`        |   🟢   |
| `FEAT_SCENE_SUMMARY`         | Ronde-eindscherm       | Geoefende woorden/begrippen, sterren, volgende beloning          | `scene-builder-round-summary`      |   🟢   |
| `FEAT_SCENE_DEVTOOLS`        | Zone-editor (dev-only) | Alleen met `?dev=true`; onzichtbaar in productie                 | `scene-zone-devtools`              |   🟢   |

## 6. Zeg & Bouw (`SCR_MSA_ZEG_BOUW`)

> Mechanica: [Modus — Zeg & Bouw](Modus-Zeg-en-Bouw.md).

| FEAT-ID                    | Feature           | Verwacht gedrag                                                  | Testhaak                    | Status |
| :------------------------- | :---------------- | :--------------------------------------------------------------- | :-------------------------- | :----: |
| `FEAT_BOUW_RENDER`         | Scherm rendert    | Bouwkaart, strand en objectbalk                                  | `zeg-bouw-screen`           |   🟢   |
| `FEAT_BOUW_CARD`           | Bouwkaart         | Thema, opdracht en doel zichtbaar                                | `zeg-bouw-card`             |   🟢   |
| `FEAT_BOUW_TAP`            | Tik-plaatsing     | Plaatje kiezen → plek tikken; zonder keuze een vriendelijke tip  | `zeg-bouw-tap-target`       |   🟢   |
| `FEAT_BOUW_PARSE_COMPOUND` | Samengestelde zin | Eén zin plaatst meerdere objecten                                | `spoken-command-parser`     |   🟢   |
| `FEAT_BOUW_VOICE`          | Spraakbouwen      | Ingesproken zin bouwt de scène, met live wave                    | `voice-command-button`      |   👤   |
| `FEAT_BOUW_BONUS`          | Compound-bonus    | 2 ⭐ per nieuw passend object, +1 ⭐ bij ≥ 2 objecten in één zin | `zeg-bouw-feedback`         |   🟢   |
| `FEAT_BOUW_PROGRESS`       | Voortgang         | Teller loopt naar het kaartdoel                                  | `zeg-bouw-progress`         |   🟢   |
| `FEAT_BOUW_OVERLAY`        | "Strand af!"      | Korte viering nadat het kind de scène heeft gezien               | `zeg-bouw-complete`         |   🟢   |
| `FEAT_BOUW_SUMMARY`        | Ronde-eindscherm  | Gebouwde objecten, sterren, volgende beloning                    | `zeg-bouw-summary-objects`  |   🟢   |
| `FEAT_BOUW_NEXT`           | Volgende strand   | Verse bouwkaart                                                  | `zeg-bouw-next-card-button` |   🟢   |
| `FEAT_BOUW_FREE`           | Vrij bouwen       | Elk plaatje mag, geen doel of eindscherm; mascotte benoemt mee   | `zeg-bouw-mode-toggle`      |   🟢   |

## 7. Zeg & Vlieg (`SCR_MSA_VOICE_SCROLLER`)

> Mechanica: [Modus — Zeg & Vlieg](Modus-Zeg-en-Vlieg.md).

| FEAT-ID                  | Feature            | Verwacht gedrag                                          | Testhaak                             | Status |
| :----------------------- | :----------------- | :------------------------------------------------------- | :----------------------------------- | :----: |
| `FEAT_FLY_START_OVERLAY` | Start-overlay      | Doelwoorden + privacytekst vóór de ronde                 | `voice-side-scroller-start-overlay`  |   🟢   |
| `FEAT_FLY_PLAYER`        | Vliegen            | Held vliegt, afstand loopt op                            | `voice-side-scroller-stage`          |   🟢   |
| `FEAT_FLY_THUMBRAIL`     | Duim-rail          | Regelt traploos de vlieghoogte                           | `voice-side-scroller-thumb-rail`     |   🟢   |
| `FEAT_FLY_TARGETS`       | Doelobjecten       | Objecten komen in beeld om benoemd te worden             | `voice-side-scroller-target-layer`   |   🟢   |
| `FEAT_FLY_VOICE`         | Stem-verzamelen    | Naam uitspreken verzamelt het object (met woordgeheugen) | `voice-side-scroller-wave`           |   👤   |
| `FEAT_FLY_OBSTACLES`     | Obstakels          | Botsing kost een schildje + vertraging, geen game-over   | `voice-side-scroller-obstacle-layer` |   🟢   |
| `FEAT_FLY_SHIELDS`       | Schildjes          | 3 per ronde, zichtbaar in de HUD                         | `voice-side-scroller-shields`        |   🟢   |
| `FEAT_FLY_COMBO`         | Combo              | Elke 3e goed op rij geeft een bonusster                  | `voice-side-scroller-combo`          |   🟢   |
| `FEAT_FLY_RECORD`        | Persoonlijk record | Verste vlucht per profiel, gevierd bij een nieuw record  | `voice-side-scroller-record`         |   🟢   |
| `FEAT_FLY_SUMMARY`       | Ronde-eindscherm   | Meters, sterren, score, record, per-woord observaties    | `voice-side-scroller-round-summary`  |   🟢   |

## 8. Beloningsscherm (`SCR_MSA_REWARD`)

| FEAT-ID                 | Feature              | Verwacht gedrag                            | Testhaak                   | Status |
| :---------------------- | :------------------- | :----------------------------------------- | :------------------------- | :----: |
| `FEAT_REWARD_RENDER`    | Scherm rendert       | Titel, sterren en beloningskaart           | `reward-screen`            |   🟢   |
| `FEAT_REWARD_FEATURED`  | Uitgelichte beloning | Toont de nieuwste of eerste beloning       | `reward-featured-name`     |   🟢   |
| `FEAT_REWARD_STARS`     | Sterrenteller        | Vers profiel begint op 0 ⭐                | `reward-stars`             |   🟢   |
| `FEAT_REWARD_UNLOCKS`   | Ontgrendelde items   | Lijst met alles wat vrijgespeeld is        | `reward-unlocks`           |   🟢   |
| `FEAT_REWARD_WORLD`     | Terug naar wereld    | Terug naar moduskeuze                      | `reward-world-button`      |   🟢   |
| `FEAT_REWARD_MENU_ONLY` | Geen "Opnieuw"       | Vanuit het menu geen sprong naar een modus | `reward-play-again-button` |   🟢   |

## 9. Game-instellingen (`SCR_MSA_SETTINGS`)

| FEAT-ID                  | Feature            | Verwacht gedrag                                      | Testhaak                                 | Status |
| :----------------------- | :----------------- | :--------------------------------------------------- | :--------------------------------------- | :----: |
| `FEAT_SET_RENDER`        | Scherm rendert     | Alle instelgroepen zichtbaar                         | `game-settings-screen`                   |   🟢   |
| `FEAT_SET_AUDIO`         | Geluid             | `audioEnabled` aan/uit, blijft bewaard               | toggle "Audio aan of uit"                |   🟢   |
| `FEAT_SET_MUSIC`         | Muziek             | `musicEnabled` aan/uit                               | toggle "Muziek aan of uit"               |   🟢   |
| `FEAT_SET_HINTS`         | Hints              | `hintsEnabled` aan/uit                               | toggle "Hints aan of uit"                |   🟢   |
| `FEAT_SET_MOTION`        | Rustige beweging   | Dempt zweef-/sparkle-/parallax-animaties             | `data-app-reduced-motion`                |   🟢   |
| `FEAT_SET_MIC_STATUS`    | Microfoonstatus    | Toont toestemming en omgeving (https/localhost)      | `settings-microphone-permission-message` |   🟢   |
| `FEAT_SET_MIC_REQUEST`   | Toestemming vragen | Vraagt de browser om microfoontoegang                | `settings-request-microphone-button`     |   👤   |
| `FEAT_SET_PRIVACY_CARD`  | Privacykaart       | Legt uit dat er geen opnames worden bewaard          | `settings-voice-privacy-card`            |   🟢   |
| `FEAT_SET_RESET_OPEN`    | Reset openen       | Opent de bevestigingsdialoog                         | `settings-reset-progress-button`         |   🟢   |
| `FEAT_SET_RESET_CONFIRM` | Reset bevestigen   | Wist sleutels, observaties én het Zeg & Vlieg-record | `settings-confirm-reset-button`          |   🟢   |
| `FEAT_SET_RESET_CANCEL`  | Reset annuleren    | Sluit zonder dataverlies                             | `settings-cancel-reset-button`           |   🟢   |
| `FEAT_SET_BACK`          | Terug              | Terug met behoud van instellingen                    | `settings-back-button`                   |   🟢   |

## 10. Transversaal

| FEAT-ID            | Feature             | Verwacht gedrag                                                                              | Status |
| :----------------- | :------------------ | :------------------------------------------------------------------------------------------- | :----: |
| `FEAT_X_SPEECH`    | Spraaklaag          | Eén runtime-laag voor alle modi; mobiel-vast (wave zonder opname, Android-quirks opgevangen) |   🟢   |
| `FEAT_X_WORD_SAFE` | Woordbescherming    | Ongewenste woorden gemaskeerd, zachte nudge in plaats van straf                              |   🟢   |
| `FEAT_X_REWARDS`   | Beloningssysteem    | Eén curve, cumulatief per profiel, geleidelijke unlocks                                      |   🟢   |
| `FEAT_X_PRACTICE`  | Oefenobservaties    | Elke poging levert een observatie, ook bij fout                                              |   🟢   |
| `FEAT_X_RANDOM`    | Randomisatie        | Verse geseede volgorde per ronde in alle vier de modi                                        |   🟢   |
| `FEAT_X_TTS`       | Spraaksynthese      | Opdrachten en nazegzinnen voorlezen                                                          |   👤   |
| `FEAT_X_MUSIC`     | Achtergrondmuziek   | Speelt en pauzeert volgens `musicEnabled`                                                    |   👤   |
| `FEAT_X_OFFLINE`   | Offline spelen      | Na download volledig speelbaar zonder netwerk                                                |   🟢   |
| `FEAT_X_PORTRAIT`  | Portret op telefoon | Landschap toont de guard en pauzeert de gameplay                                             |   🟢   |
| `FEAT_X_A11Y`      | Toegankelijkheid    | 48×48, focus-ring, aria, tekst altijd beschikbaar                                            |   🟢   |
| `FEAT_X_PRIVACY`   | Profielscheiding    | Data lekt niet tussen kindprofielen                                                          |   🟢   |

---

## 11. Statusoverzicht

| Status                                                      | Aantal |
| :---------------------------------------------------------- | :----: |
| 🟢 Geautomatiseerd of op toestel bevestigd                  |   78   |
| 👤 Werkt, alleen handmatig te bevestigen (microfoon/geluid) |   6    |
| **Totaal**                                                  | **84** |

De 👤-functies zijn op een Samsung Galaxy A56 en een iPhone doorlopen en werken; ze zijn niet in CI te automatiseren omdat er een echte microfoon of hoorbaar geluid voor nodig is.
