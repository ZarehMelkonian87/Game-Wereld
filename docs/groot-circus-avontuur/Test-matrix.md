# ✅ Test-matrix — Groot Circus-Avontuur

> Welke test bewijst welke functie. De opzet is één op één overgenomen van het [strandspel](../magisch-strand-avontuur/Test-matrix.md): dezelfde testcases, dezelfde bewijslast, circus-content.

| Veld                  | Waarde                                         |
| :-------------------- | :--------------------------------------------- |
| **Documentversie**    | `1.0`                                          |
| **Laatst bijgewerkt** | 2026-09-22                                     |
| **Status**            | 🔵 Suites nog te schrijven (taken T-01 … T-08) |

**Type:** 🤖 e2e · 🧪 unit · ♿ a11y · 👤 handmatig op toestel.
**Status:** ✅ groen · 🔵 nog te schrijven.

---

## 1. Bestaande dekking

| Wat                              | Stand                                                              |
| :------------------------------- | :----------------------------------------------------------------- |
| 11 unit-testbestanden in de game | ✅ parser, beloningen, randomisatie, zone-geometrie, quiz, woorden |
| E2e-suites                       | 🔵 nog geen enkele                                                 |
| Axe-audit van de circusschermen  | 🔵 nog niet in de a11y-suite                                       |

## 2. Testcases

| TC-ID          | Dekt                             | Verwacht resultaat                                                       | Type | Suite                                | Status |
| :------------- | :------------------------------- | :----------------------------------------------------------------------- | :--- | :----------------------------------- | :----: |
| `TC_GCA_01`    | `FEAT_GCA_CARD`                  | De kaart staat in de zone; vergrendeld zolang `coming-soon`              | 🤖   | `critical-user-journey.spec.ts`      |   ✅   |
| `TC_GCA_02`    | `FEAT_GCA_GATE`                  | Op telefoon/tablet pas spelen na 100% download                           | 🤖   | `circus-pwa-offline.spec.ts`         |   🔵   |
| `TC_START_01`  | `FEAT_START_*`                   | Startscherm toont alle basiselementen; navigatie werkt                   | 🤖   | `groot-circus-avontuur.spec.ts`      |   🔵   |
| `TC_MODE_01`   | `FEAT_MODE_UNLOCK`               | Modi openen bij 0 / 3 / 8 / 14 ⭐                                        | 🧪   | `mode-unlocks.test.ts`               |   🔵   |
| `TC_WORD_01`   | `FEAT_WORD_RENDER/OPTIONS`       | Quiz opent met vraagpaneel en 2–4 keuzekaarten                           | 🤖   | `circus-word-choice.spec.ts`         |   🔵   |
| `TC_WORD_02`   | `FEAT_WORD_CORRECT/WRONG`        | Goed → succes met juist lidwoord; fout → tip, vraag blijft staan         | 🤖   | `circus-word-choice.spec.ts`         |   🔵   |
| `TC_WORD_03`   | `FEAT_WORD_AUTO_ADVANCE`         | Geen Volgende-knop; schakelt vanzelf door; dubbele tik telt niet dubbel  | 🤖🧪 | `circus-word-choice.spec.ts`         |   🔵   |
| `TC_WORD_04`   | `FEAT_WORD_SUMMARY`              | Ronde van 19 vragen eindigt met het eindscherm                           | 🤖   | `circus-word-choice.spec.ts`         |   🔵   |
| `TC_SCENE_01`  | `FEAT_SCENE_RENDER`              | Piste, opdracht en objectbalk verschijnen                                | 🤖   | `groot-circus-avontuur.spec.ts`      |   🔵   |
| `TC_SCENE_02`  | `FEAT_SCENE_KB_INPUT`            | Overtyp-laag kleurt per letter; fout + Backspace herstelt                | 🤖   | `groot-circus-avontuur.spec.ts`      |   🔵   |
| `TC_SCENE_03`  | `FEAT_SCENE_AUTO_CONFIRM`        | Goede plaatsing wordt meteen bevestigd; door naar de volgende opdracht   | 🤖   | `groot-circus-avontuur.spec.ts`      |   🔵   |
| `TC_SCENE_04`  | `FEAT_SCENE_ONE_INPUT`           | Nooit wave én typ-paneel tegelijk                                        | 🤖   | `groot-circus-avontuur.spec.ts`      |   🔵   |
| `TC_SCENE_05`  | `FEAT_SCENE_PARSE`               | Parser levert object, relatie, zone en betrouwbaarheid (circus-aliassen) | 🧪   | `spoken-command-parser.test.ts`      |   ✅   |
| `TC_SCENE_06`  | `FEAT_SCENE_ANCHOR_SAFE`         | Opdracht met ongeplaatst anker crasht niet en telt niet als goed         | 🧪   | `dynamic-scene-relations.test.ts`    |   🔵   |
| `TC_SCENE_07`  | `FEAT_SCENE_SUMMARY`             | Ronde-eindscherm toont geoefende woorden en begrippen                    | 🧪   | `SceneBuilderRoundSummary.test.tsx`  |   🔵   |
| `TC_BOUW_01`   | `FEAT_BOUW_RENDER/CARD`          | Bouwkaart, piste en objectbalk verschijnen                               | 🤖   | `circus-zeg-en-bouw.spec.ts`         |   🔵   |
| `TC_BOUW_02`   | `FEAT_BOUW_PARSE_COMPOUND`       | Eén zin plaatst meerdere objecten                                        | 🧪   | `compound-placement-parser.test.ts`  |   🔵   |
| `TC_BOUW_03`   | `FEAT_BOUW_BONUS`                | 2 ⭐ per nieuw passend object, +1 ⭐ compound-bonus                      | 🧪   | `zeg-en-bouw-cards.test.ts`          |   🔵   |
| `TC_BOUW_04`   | `FEAT_BOUW_FREE`                 | Vrij bouwen: elk plaatje mag, geen doel                                  | 🤖   | `circus-zeg-en-bouw.spec.ts`         |   🔵   |
| `TC_FLY_01`    | `FEAT_FLY_START_OVERLAY/SHIELDS` | Stage, HUD en 3 schildjes met start-overlay                              | 🤖   | `circus-voice-side-scroller.spec.ts` |   🔵   |
| `TC_FLY_02`    | `FEAT_FLY_OBSTACLES`             | Botsing kost een schildje en breekt de combo                             | 🧪   | `voiceSideScrollerEngine.test.ts`    |   🔵   |
| `TC_FLY_03`    | `FEAT_FLY_RECORD`                | Record per profiel bewaard en bij reset gewist                           | 🧪   | `voiceSideScrollerRecord.test.ts`    |   🔵   |
| `TC_FLY_04`    | woordselectie                    | Niet-gemeesterde woorden komen vaker terug                               | 🧪   | `voiceSideScrollerWords.test.ts`     |   ✅   |
| `TC_REWARD_01` | `FEAT_REWARD_RENDER/ITEMS`       | Beloningsscherm toont de circus-items op de juiste drempels              | 🤖🧪 | `circus-reward.spec.ts`              |   🔵   |
| `TC_A11Y_01`   | `FEAT_X_A11Y`                    | axe-audit van de circusschermen zonder overtredingen                     | ♿   | `accessibility.spec.ts`              |   🔵   |
| `TC_A11Y_02`   | `JRN_MIC_FALLBACK`               | Kernopdracht lukt met geweigerde microfoon via het toetsenbord           | ♿🤖 | `accessibility.spec.ts`              |   🔵   |
| `TC_X_SAFE`    | `FEAT_X_WORD_SAFE`               | Ongewenste woorden gemaskeerd, zachte nudge                              | 🧪   | `word-safety.test.ts`                |   🔵   |
| `TC_X_RANDOM`  | `FEAT_X_RANDOM`                  | Elke ronde krijgt een verse, geseede volgorde                            | 🧪   | `instruction-randomization.test.ts`  |   ✅   |
| `TC_DEV_01`    | spraak op toestel                | Alle spraakmodi werken op Android en iOS                                 | 👤   | toestelcheck                         |   🔵   |
| `TC_DEV_02`    | geluid en beweging               | Feedbackgeluiden hoorbaar; rustige beweging dempt zonder vertraging      | 👤   | toestelcheck                         |   🔵   |

---

## 3. Stand van zaken

| Status              | Aantal |
| :------------------ | :----: |
| ✅ Groen            |   4    |
| 🔵 Nog te schrijven |   26   |

**Definitie van klaar voor de release:** alle 🔵 zijn ✅, de volledige e2e-suite is groen op chromium-tablet, en de toestelcheck is doorlopen op Android en iOS. Pas dan gaat `releaseStatus` op `available` (taak R-03 in de [Takenlijst](Takenlijst.md)).
