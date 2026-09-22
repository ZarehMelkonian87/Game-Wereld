# 🧩 Feature-catalogus — Zonnige Speeltuin-Avontuur

> Elke functie die de game moet krijgen. Omdat de gameplay één op één uit het strandspel komt, is dit tegelijk het **afnamecontract**: klaar is pas klaar als elke regel 🟢 is.

| Veld                  | Waarde                                                                                  |
| :-------------------- | :-------------------------------------------------------------------------------------- |
| **Documentversie**    | `1.0`                                                                                   |
| **Laatst bijgewerkt** | 2026-09-22                                                                              |
| **Referentie**        | [Feature-catalogus van het strandspel](../magisch-strand-avontuur/Feature-catalogus.md) |

**Legenda:** 🟢 werkt · 🔵 nog te bouwen · 👤 alleen handmatig te bevestigen (microfoon/geluid).

## 1. Catalogus en platform

| FEAT-ID          | Feature                  | Verwacht gedrag                                          | Status |
| :--------------- | :----------------------- | :------------------------------------------------------- | :----: |
| `FEAT_CARD`      | Kaart in de spellenlijst | Toont wereldicoon, titel en beschrijving                 |   🟢   |
| `FEAT_CARD_LOCK` | Binnenkort beschikbaar   | Kaart vergrendeld; deep link toont het binnenkort-scherm |   🟢   |
| `FEAT_GATE`      | Download-gate            | Op telefoon/tablet pas spelen na 100% lokale content     |   🔵   |
| `FEAT_HOST`      | Game starten             | De host laadt de module en opent een sessie              |   🔵   |

## 2. Schermen

| FEAT-ID            | Feature         | Verwacht gedrag                                            | Status |
| :----------------- | :-------------- | :--------------------------------------------------------- | :----: |
| `FEAT_START_*`     | Startscherm     | Logo, mascotte, sterrenteller, spelen, instellingen, terug |   🔵   |
| `FEAT_MODE_CARDS`  | Avontuur kiezen | Vier moduskaarten in leerlijnvolgorde                      |   🔵   |
| `FEAT_MODE_UNLOCK` | Ontgrendeling   | 0 / 3 / 8 / 14 ⭐                                          |   🔵   |
| `FEAT_REWARD_*`    | Beloningsscherm | Uitgelichte beloning, sterren, verzamelde items            |   🔵   |
| `FEAT_SET_*`       | Instellingen    | Audio, muziek, hints, rustige beweging, microfoon, reset   |   🔵   |

## 3. Kies het Woord

| FEAT-ID                  | Feature          | Verwacht gedrag                                              | Status |
| :----------------------- | :--------------- | :----------------------------------------------------------- | :----: |
| `FEAT_WORD_RENDER`       | Scherm rendert   | Vraagpaneel, 2–4 keuzekaarten, statusbalk                    |   🔵   |
| `FEAT_WORD_CORRECT`      | Goed antwoord    | Groene rand, succestekst met juist lidwoord, nazegzin, bonus |   🔵   |
| `FEAT_WORD_WRONG`        | Fout antwoord    | Vriendelijke tip, geen straf                                 |   🔵   |
| `FEAT_WORD_HINT`         | Hint             | Hinttekst + juiste kaart licht op                            |   🔵   |
| `FEAT_WORD_AUTO_ADVANCE` | Automatisch door | Vanzelf verder na een goed antwoord; geen Volgende-knop      |   🔵   |
| `FEAT_WORD_SOUND`        | Goed/fout-geluid | Kort geluid, respecteert de audio-instelling                 |   🔵   |
| `FEAT_WORD_PROGRESS`     | Voortgang        | Statusbalk loopt 1/14 → 14/14                                |   🔵   |
| `FEAT_WORD_SUMMARY`      | Ronde-eindscherm | Sterren, tempo, goed direct/met hint                         |   🔵   |
| `FEAT_WORD_VIDEO`        | Vraagvideo       | Speelt de opdrachtvideo; anders de voorleesstem              |   🔵   |

## 4. Zeg & Zet

| FEAT-ID                   | Feature                | Verwacht gedrag                                         | Status |
| :------------------------ | :--------------------- | :------------------------------------------------------ | :----: |
| `FEAT_SCENE_RENDER`       | Scherm rendert         | Wereld, opdracht en objectbalk                          |   🔵   |
| `FEAT_SCENE_INSTRUCTION`  | Opdracht               | Altijd als tekst zichtbaar                              |   🔵   |
| `FEAT_SCENE_TAP_PLACE`    | Tik-plaatsing          | Object kiezen en plek tikken                            |   🔵   |
| `FEAT_SCENE_DRAG_PLACE`   | Sleep-plaatsing        | Object naar zone slepen                                 |   🔵   |
| `FEAT_SCENE_KEYBOARD`     | Toetsenbordplaatsing   | Pijltoetsen + Enter                                     |   🔵   |
| `FEAT_SCENE_MIC`          | Microfoon              | Continu luisteren met stiltestop                        |   👤   |
| `FEAT_SCENE_WAVE`         | Luister-indicator      | Golf + live transcriptie; op mobiel zonder eigen opname |   🔵   |
| `FEAT_SCENE_PARSE`        | Commando-ontleding     | Object + relatie + zone/anker met betrouwbaarheid       |   🔵   |
| `FEAT_SCENE_KB_INPUT`     | Overtyp-veld           | Doelzin als spookletters, groen/rood per letter         |   🔵   |
| `FEAT_SCENE_ONE_INPUT`    | Eén invoer tegelijk    | Nooit wave én typ-paneel tegelijk                       |   🔵   |
| `FEAT_SCENE_AUTO_CONFIRM` | Automatisch bevestigen | Correcte plaatsing meteen bevestigd                     |   🔵   |
| `FEAT_SCENE_HINT`         | Doelzone-hint          | De plek pulseert en licht op                            |   🔵   |
| `FEAT_SCENE_SUMMARY`      | Ronde-eindscherm       | Geoefende woorden en begrippen, sterren                 |   🔵   |
| `FEAT_SCENE_VIDEO`        | Instructievideo        | Opdracht-, hint- en feedbackvideo's                     |   🔵   |

## 5. Zeg & Bouw en Zeg & Vlieg

| FEAT-ID                    | Feature           | Verwacht gedrag                                    | Status |
| :------------------------- | :---------------- | :------------------------------------------------- | :----: |
| `FEAT_BOUW_RENDER/CARD`    | Bouwscherm        | Bouwkaart, wereld en objectbalk                    |   🔵   |
| `FEAT_BOUW_PARSE_COMPOUND` | Samengestelde zin | Eén zin plaatst meerdere objecten                  |   🔵   |
| `FEAT_BOUW_BONUS`          | Compound-bonus    | 2 ⭐ per object, +1 ⭐ bij ≥ 2 in één zin          |   🔵   |
| `FEAT_BOUW_FREE`           | Vrij bouwen       | Elk plaatje mag, geen doel                         |   🔵   |
| `FEAT_FLY_*`               | Vliegen           | Start-overlay, duim-rail, schildjes, combo, record |   🔵   |
| `FEAT_FLY_VOICE`           | Stem-verzamelen   | Naam uitspreken verzamelt het object               |   👤   |
| `FEAT_FLY_OBSTACLES`       | Obstakels         | Wereld-eigen obstakels; botsing kost een schildje  |   🔵   |

## 6. Transversaal

| FEAT-ID            | Feature             | Verwacht gedrag                               | Status |
| :----------------- | :------------------ | :-------------------------------------------- | :----: |
| `FEAT_X_SPEECH`    | Spraaklaag          | Gedeeld met het platform, mobiel-vast         |   🟢   |
| `FEAT_X_WORD_SAFE` | Woordbescherming    | Ongewenste woorden gemaskeerd, zachte nudge   |   🔵   |
| `FEAT_X_REWARDS`   | Beloningssysteem    | Eén curve, cumulatief per profiel en per game |   🔵   |
| `FEAT_X_PRACTICE`  | Oefenobservaties    | Elke poging levert een observatie             |   🔵   |
| `FEAT_X_RANDOM`    | Randomisatie        | Verse geseede volgorde per ronde              |   🔵   |
| `FEAT_X_OFFLINE`   | Offline spelen      | Na download volledig speelbaar zonder netwerk |   🔵   |
| `FEAT_X_PORTRAIT`  | Portret op telefoon | Landschap toont de guard                      |   🟢   |
| `FEAT_X_A11Y`      | Toegankelijkheid    | 48×48, focus-ring, tekst altijd beschikbaar   |   🔵   |

Elke 🔵 heeft een taak in de [Takenlijst](Takenlijst.md).
