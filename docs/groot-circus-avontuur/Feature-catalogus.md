# 🧩 Feature-catalogus — Groot Circus-Avontuur

> Elke functie die de game moet hebben, met testhaak en stand van zaken. Omdat de gameplay identiek is aan het strandspel, is dit tegelijk het **afnamecontract**: klaar is pas klaar als elke regel hieronder 🟢 is.

| Veld                  | Waarde                                                                                  |
| :-------------------- | :-------------------------------------------------------------------------------------- |
| **Documentversie**    | `1.0`                                                                                   |
| **Laatst bijgewerkt** | 2026-09-22                                                                              |
| **Referentie**        | [Feature-catalogus van het strandspel](../magisch-strand-avontuur/Feature-catalogus.md) |

**Legenda:** 🟢 werkt · 🟡 aanwezig in oude vorm, moet bijgewerkt · 🔵 ontbreekt nog · 👤 alleen handmatig te bevestigen (microfoon/geluid).

---

## 1. Platform-schil

Volledig gedeeld met het strandspel: profielen, zones, spellenlijst, download-gate, voortgang, export, microfoon-diagnose. Deze functies hoeven niet opnieuw gebouwd of getest te worden; wel moet de circuskaart zelf correct in de lijst verschijnen.

| FEAT-ID         | Feature                  | Verwacht gedrag                                                               | Status |
| :-------------- | :----------------------- | :---------------------------------------------------------------------------- | :----: |
| `FEAT_GCA_CARD` | Kaart in de spellenlijst | Toont icoon, titel en beschrijving; nu vergrendeld ("Binnenkort beschikbaar") |   🟢   |
| `FEAT_GCA_GATE` | Download-gate            | Op telefoon/tablet pas spelen na 100% lokale content                          |   🔵   |
| `FEAT_GCA_HOST` | Game starten             | De host laadt de module en opent een sessie                                   |   🟡   |

## 2. Startscherm en avontuur kiezen

| FEAT-ID             | Feature        | Verwacht gedrag                                               | Testhaak                      | Status |
| :------------------ | :------------- | :------------------------------------------------------------ | :---------------------------- | :----: |
| `FEAT_START_RENDER` | Scherm rendert | Circuslogo, mascotte, sterrenteller, knoppen                  | `start-screen`                |   🟢   |
| `FEAT_START_PLAY`   | Spelen         | Naar avontuur kiezen                                          | `start-play-button`           |   🟢   |
| `FEAT_START_STARS`  | Sterrenteller  | Cumulatief profieltotaal voor déze game                       | `start-star-counter`          |   🟢   |
| `FEAT_MODE_CARDS`   | Moduskaarten   | Vier kaarten in leerlijnvolgorde                              | `compact-mode-card-*`         |   🔵   |
| `FEAT_MODE_UNLOCK`  | Ontgrendeling  | 0 / 3 / 8 / 14 ⭐; vergrendelde kaart toont benodigde sterren | `data-disabled`               |   🔵   |
| `FEAT_MODE_START`   | Spel starten   | Start de gekozen modus                                        | `adventure-start-game-button` |   🟢   |

## 3. Kies het Woord

| FEAT-ID                  | Feature          | Verwacht gedrag                                              | Status |
| :----------------------- | :--------------- | :----------------------------------------------------------- | :----: |
| `FEAT_WORD_RENDER`       | Scherm rendert   | Vraagpaneel, 2–4 keuzekaarten, statusbalk                    |   🟢   |
| `FEAT_WORD_CORRECT`      | Goed antwoord    | Groene rand, succestekst met juist lidwoord, nazegzin, bonus |   🟢   |
| `FEAT_WORD_WRONG`        | Fout antwoord    | Vriendelijke tip, geen straf                                 |   🟢   |
| `FEAT_WORD_HINT`         | Hint             | Hinttekst + juiste kaart licht op                            |   🟢   |
| `FEAT_WORD_AUTO_ADVANCE` | Automatisch door | Na goed antwoord vanzelf verder; geen "Volgende"-knop        |   🔵   |
| `FEAT_WORD_SOUND`        | Goed/fout-geluid | Kort geluid, respecteert de audio-instelling                 |   🔵   |
| `FEAT_WORD_PROGRESS`     | Voortgang        | Statusbalk loopt 1/19 → 19/19                                |   🟢   |
| `FEAT_WORD_SUMMARY`      | Ronde-eindscherm | Sterren, tempo, goed direct/met hint, volgende beloning      |   🟢   |
| `FEAT_WORD_VIDEO`        | Vraagvideo       | Speelt de opdrachtvideo; nette fallback naar de voorleesstem |   🔵   |

## 4. Zeg & Zet

| FEAT-ID                     | Feature                | Verwacht gedrag                                         | Status |
| :-------------------------- | :--------------------- | :------------------------------------------------------ | :----: |
| `FEAT_SCENE_RENDER`         | Scherm rendert         | Piste, opdracht en objectbalk                           |   🟢   |
| `FEAT_SCENE_INSTRUCTION`    | Opdracht               | Altijd als tekst zichtbaar                              |   🟢   |
| `FEAT_SCENE_TAP_PLACE`      | Tik-plaatsing          | Object kiezen en plek tikken                            |   🟢   |
| `FEAT_SCENE_DRAG_PLACE`     | Sleep-plaatsing        | Object naar zone slepen                                 |   🟢   |
| `FEAT_SCENE_KEYBOARD_PLACE` | Toetsenbordplaatsing   | Pijltoetsen + Enter                                     |   🟢   |
| `FEAT_SCENE_MIC`            | Microfoon              | Continu luisteren met stiltestop                        |   👤   |
| `FEAT_SCENE_WAVE`           | Luister-indicator      | Golf + live transcriptie; op mobiel zonder eigen opname |   🔵   |
| `FEAT_SCENE_PARSE`          | Commando-ontleding     | Object + relatie + zone/anker met betrouwbaarheid       |   🟢   |
| `FEAT_SCENE_RETRY`          | Herkansingspaneel      | Mic blijft herstartbaar met typ-alternatief             |   🔵   |
| `FEAT_SCENE_KB_INPUT`       | Overtyp-veld           | Doelzin als spookletters, groen/rood per letter         |   🔵   |
| `FEAT_SCENE_ONE_INPUT`      | Eén invoer tegelijk    | Nooit wave én typ-paneel tegelijk                       |   🔵   |
| `FEAT_SCENE_AUTO_CONFIRM`   | Automatisch bevestigen | Correcte plaatsing meteen bevestigd, geen Klaar-knop    |   🔵   |
| `FEAT_SCENE_HINT`           | Doelzone-hint          | De plek pulseert en licht op                            |   🟢   |
| `FEAT_SCENE_ANCHOR_SAFE`    | Ontbrekend anker       | Geen crash, telt niet als goed                          |   🟢   |
| `FEAT_SCENE_SUMMARY`        | Ronde-eindscherm       | Geoefende woorden en begrippen, sterren                 |   🔵   |
| `FEAT_SCENE_VIDEO`          | Instructievideo        | Opdracht-, hint- en feedbackvideo's                     |   🔵   |

## 5. Zeg & Bouw

| FEAT-ID                    | Feature           | Verwacht gedrag                                         | Status |
| :------------------------- | :---------------- | :------------------------------------------------------ | :----: |
| `FEAT_BOUW_RENDER`         | Scherm rendert    | Bouwkaart, piste en objectbalk                          |   🔵   |
| `FEAT_BOUW_CARD`           | Bouwkaart         | Thema, opdracht en doel zichtbaar                       |   🔵   |
| `FEAT_BOUW_TAP`            | Tik-plaatsing     | Plaatje kiezen en plek tikken                           |   🔵   |
| `FEAT_BOUW_PARSE_COMPOUND` | Samengestelde zin | Eén zin plaatst meerdere objecten                       |   🔵   |
| `FEAT_BOUW_BONUS`          | Compound-bonus    | 2 ⭐ per nieuw passend object, +1 ⭐ bij ≥ 2 in één zin |   🔵   |
| `FEAT_BOUW_SUMMARY`        | Ronde-eindscherm  | Gebouwde objecten, sterren, volgende beloning           |   🔵   |
| `FEAT_BOUW_FREE`           | Vrij bouwen       | Elk plaatje mag, geen doel                              |   🔵   |

## 6. Zeg & Vlieg

| FEAT-ID                  | Feature            | Verwacht gedrag                               | Status |
| :----------------------- | :----------------- | :-------------------------------------------- | :----: |
| `FEAT_FLY_START_OVERLAY` | Start-overlay      | Doelwoorden + privacytekst                    |   🟢   |
| `FEAT_FLY_PLAYER`        | Vliegen            | Held vliegt, afstand loopt op                 |   🟢   |
| `FEAT_FLY_THUMBRAIL`     | Duim-rail          | Regelt de vlieghoogte                         |   🟢   |
| `FEAT_FLY_VOICE`         | Stem-verzamelen    | Naam uitspreken verzamelt het object          |   👤   |
| `FEAT_FLY_OBSTACLES`     | Obstakels          | Circus-obstakels; botsing kost een schildje   |   🔵   |
| `FEAT_FLY_SHIELDS`       | Schildjes          | 3 per ronde, zichtbaar in de HUD              |   🟢   |
| `FEAT_FLY_RECORD`        | Persoonlijk record | Verste vlucht per profiel, gewist bij reset   |   🔵   |
| `FEAT_FLY_SUMMARY`       | Ronde-eindscherm   | Meters, sterren, score, per-woord observaties |   🟢   |

## 7. Beloningen en instellingen

| FEAT-ID              | Feature           | Verwacht gedrag                                          | Status |
| :------------------- | :---------------- | :------------------------------------------------------- | :----: |
| `FEAT_REWARD_RENDER` | Beloningsscherm   | Uitgelichte beloning, sterren, verzamelde items          |   🟢   |
| `FEAT_REWARD_ITEMS`  | Circus-beloningen | Zeven circus-items op de bekende drempels                |   🔵   |
| `FEAT_SET_*`         | Instellingen      | Audio, muziek, hints, rustige beweging, microfoon, reset |   🟢   |
| `FEAT_SET_MOTION`    | Rustige beweging  | Dempt ook de gameplay-animaties                          |   🔵   |

## 8. Transversaal

| FEAT-ID            | Feature             | Verwacht gedrag                                              | Status |
| :----------------- | :------------------ | :----------------------------------------------------------- | :----: |
| `FEAT_X_SPEECH`    | Spraaklaag          | Gedeeld met het strandspel, inclusief de mobiel-vaste regels |   🟢   |
| `FEAT_X_WORD_SAFE` | Woordbescherming    | Ongewenste woorden gemaskeerd, zachte nudge                  |   🔵   |
| `FEAT_X_REWARDS`   | Beloningssysteem    | Eén curve, cumulatief per profiel en per game                |   🟢   |
| `FEAT_X_PRACTICE`  | Oefenobservaties    | Elke poging levert een observatie                            |   🟢   |
| `FEAT_X_RANDOM`    | Randomisatie        | Verse geseede volgorde per ronde                             |   🟢   |
| `FEAT_X_OFFLINE`   | Offline spelen      | Na download volledig speelbaar zonder netwerk                |   🔵   |
| `FEAT_X_PORTRAIT`  | Portret op telefoon | Landschap toont de guard                                     |   🟢   |
| `FEAT_X_A11Y`      | Toegankelijkheid    | 48×48, focus-ring, tekst altijd beschikbaar                  |   🟡   |

---

## 9. Stand van zaken

| Status                       | Aantal |
| :--------------------------- | :----: |
| 🟢 Werkt                     |   28   |
| 🟡 Aanwezig, moet bijgewerkt |   3    |
| 🔵 Ontbreekt nog             |   24   |
| 👤 Handmatig te bevestigen   |   2    |

Elke 🔵 en 🟡 heeft een taak in de [Takenlijst](Takenlijst.md).
