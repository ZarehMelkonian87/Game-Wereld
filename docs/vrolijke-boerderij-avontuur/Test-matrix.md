# ✅ Test-matrix — Vrolijke Boerderij-Avontuur

> Welke test bewijst welke functie. Eén op één overgenomen van het [strandspel](../magisch-strand-avontuur/Test-matrix.md): dezelfde testcases, dezelfde bewijslast, boerderij-content.

| Veld                  | Waarde                          |
| :-------------------- | :------------------------------ |
| **Documentversie**    | `1.0`                           |
| **Laatst bijgewerkt** | 2026-09-22                      |
| **Status**            | 🔵 Alle suites nog te schrijven |

**Type:** 🤖 e2e · 🧪 unit · ♿ a11y · 👤 handmatig op toestel.

| TC-ID          | Dekt                       | Verwacht resultaat                                                          | Type | Status |
| :------------- | :------------------------- | :-------------------------------------------------------------------------- | :--- | :----: |
| `TC_CARD_01`   | `FEAT_CARD_LOCK`           | De kaart staat vergrendeld in de zone met "Binnenkort beschikbaar"          | 🤖   |   ✅   |
| `TC_CARD_02`   | `FEAT_GATE`                | Op telefoon/tablet pas spelen na 100% download                              | 🤖   |   🔵   |
| `TC_START_01`  | `FEAT_START_*`             | Startscherm toont alle basiselementen; navigatie werkt                      | 🤖   |   🔵   |
| `TC_MODE_01`   | `FEAT_MODE_UNLOCK`         | Modi openen bij 0 / 3 / 8 / 14 ⭐                                           | 🧪   |   🔵   |
| `TC_WORD_01`   | `FEAT_WORD_RENDER`         | Quiz opent met vraagpaneel en 2–4 keuzekaarten                              | 🤖   |   🔵   |
| `TC_WORD_02`   | `FEAT_WORD_CORRECT/WRONG`  | Goed → succes met juist lidwoord; fout → tip, vraag blijft staan            | 🤖   |   🔵   |
| `TC_WORD_03`   | `FEAT_WORD_AUTO_ADVANCE`   | Geen Volgende-knop; schakelt vanzelf door                                   | 🤖   |   🔵   |
| `TC_WORD_04`   | `FEAT_WORD_SUMMARY`        | Ronde van 14 vragen eindigt met het eindscherm                              | 🤖   |   🔵   |
| `TC_SCENE_01`  | `FEAT_SCENE_RENDER`        | Wereld, opdracht en objectbalk verschijnen                                  | 🤖   |   🔵   |
| `TC_SCENE_02`  | `FEAT_SCENE_KB_INPUT`      | Overtyp-laag kleurt per letter; Backspace herstelt                          | 🤖   |   🔵   |
| `TC_SCENE_03`  | `FEAT_SCENE_AUTO_CONFIRM`  | Goede plaatsing meteen bevestigd; door naar de volgende opdracht            | 🤖   |   🔵   |
| `TC_SCENE_04`  | `FEAT_SCENE_ONE_INPUT`     | Nooit wave én typ-paneel tegelijk                                           | 🤖   |   🔵   |
| `TC_SCENE_05`  | `FEAT_SCENE_PARSE`         | Parser levert object, relatie, zone en betrouwbaarheid (boerderij-aliassen) | 🧪   |   🔵   |
| `TC_SCENE_06`  | dynamische zones           | Opdracht met ongeplaatst anker crasht niet en telt niet als goed            | 🧪   |   🔵   |
| `TC_SCENE_07`  | `FEAT_SCENE_SUMMARY`       | Ronde-eindscherm toont geoefende woorden en begrippen                       | 🧪   |   🔵   |
| `TC_BOUW_01`   | `FEAT_BOUW_RENDER/CARD`    | Bouwkaart, wereld en objectbalk verschijnen                                 | 🤖   |   🔵   |
| `TC_BOUW_02`   | `FEAT_BOUW_PARSE_COMPOUND` | Eén zin plaatst meerdere objecten                                           | 🧪   |   🔵   |
| `TC_BOUW_03`   | `FEAT_BOUW_BONUS`          | 2 ⭐ per nieuw passend object, +1 ⭐ compound-bonus                         | 🧪   |   🔵   |
| `TC_BOUW_04`   | `FEAT_BOUW_FREE`           | Vrij bouwen: elk plaatje mag, geen doel                                     | 🤖   |   🔵   |
| `TC_FLY_01`    | `FEAT_FLY_*`               | Stage, HUD en 3 schildjes met start-overlay                                 | 🤖   |   🔵   |
| `TC_FLY_02`    | `FEAT_FLY_OBSTACLES`       | Botsing kost een schildje en breekt de combo                                | 🧪   |   🔵   |
| `TC_FLY_03`    | record                     | Record per profiel bewaard en bij reset gewist                              | 🧪   |   🔵   |
| `TC_REWARD_01` | `FEAT_X_REWARDS`           | Beloningen ontgrendelen volgens de curve 3/8/16/28/42/60/85                 | 🧪   |   🔵   |
| `TC_A11Y_01`   | `FEAT_X_A11Y`              | axe-audit van de schermen zonder overtredingen                              | ♿   |   🔵   |
| `TC_A11Y_02`   | `JRN_MIC_FALLBACK`         | Kernopdracht lukt met geweigerde microfoon via het toetsenbord              | ♿🤖 |   🔵   |
| `TC_X_SAFE`    | `FEAT_X_WORD_SAFE`         | Ongewenste woorden gemaskeerd, zachte nudge                                 | 🧪   |   🔵   |
| `TC_X_RANDOM`  | `FEAT_X_RANDOM`            | Elke ronde krijgt een verse, geseede volgorde                               | 🧪   |   🔵   |
| `TC_DEV_01`    | spraak op toestel          | Alle spraakmodi werken op Android en iOS                                    | 👤   |   🔵   |
| `TC_DEV_02`    | geluid en beweging         | Feedbackgeluiden hoorbaar; rustige beweging dempt zonder vertraging         | 👤   |   🔵   |

**Definitie van klaar voor de release:** alle 🔵 zijn ✅, de e2e-suite is groen op chromium-tablet, en de toestelcheck is doorlopen op Android en iOS. Pas dan gaat `releaseStatus` op `available` (taak R-03 in de [Takenlijst](Takenlijst.md)).
