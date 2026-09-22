# ✅ Test-matrix — Magisch Strand-Avontuur

> Welke test bewijst welke functie. Koppelt testcases aan de [Feature-catalogus](Feature-catalogus.md) en de [User Journey Map](User-Journey-Map.md).

| Veld                  | Waarde                                                               |
| :-------------------- | :------------------------------------------------------------------- |
| **Documentversie**    | `1.0` (opgeschoond)                                                  |
| **Laatst bijgewerkt** | 2026-09-22                                                           |
| **Frameworks**        | Playwright (e2e + axe), Vitest (unit/component), node:test (scripts) |
| **Status**            | 🟢 Alles groen                                                       |

**Type:** 🤖 e2e · 🧪 unit · ♿ a11y · 👤 handmatig op toestel.
**Status:** ✅ groen · 👤 handmatig bevestigd.

---

## 0. Testsuites

| Suite                                 | Dekt                                                               |
| :------------------------------------ | :----------------------------------------------------------------- |
| `e2e/magisch-strand-avontuur.spec.ts` | Startscherm, instellingen, Zeg & Zet (1.1–3.7)                     |
| `e2e/word-choice.spec.ts`             | Kies het Woord: render, goed/fout, auto-doorgaan, volledige ronde  |
| `e2e/zeg-en-bouw.spec.ts`             | Zeg & Bouw: bouwkaart, tik-flow, samengestelde zin, vrij bouwen    |
| `e2e/voice-side-scroller.spec.ts`     | Zeg & Vlieg: start-overlay, HUD, schildjes, ronde loopt            |
| `e2e/reward.spec.ts`                  | Beloningsscherm                                                    |
| `e2e/critical-user-journey.spec.ts`   | Onboarding, profielherstel, vergrendelde zone, export, verwijderen |
| `e2e/pwa-offline.spec.ts`             | Download, verificatie, offline spelen, opslagherstel               |
| `e2e/accessibility.spec.ts`           | axe-audit kernschermen + kernopdracht met geweigerde microfoon     |
| `e2e/generate-visual-report.spec.ts`  | Visueel screenshotrapport                                          |
| Vitest (21 testbestanden in de game)  | Parser, beloningen, zones, engine, randomisatie, componenten       |

Volledige suite: **260 unit-tests** en **37 e2e-tests** (chromium-tablet) groen; webkit-tablet draait nachtelijk.

---

## 1. Onboarding en platform

| TC-ID       | Dekt                    | Verwacht resultaat                                                    | Type | Test                            | Status |
| :---------- | :---------------------- | :-------------------------------------------------------------------- | :--- | :------------------------------ | :----: |
| `TC_ONB_01` | `JRN_ONBOARD`           | Welkom → profiel → avatar → naam → zone → game zonder fout            | 🤖   | `critical-user-journey.spec.ts` |   ✅   |
| `TC_ONB_02` | `FEAT_START_STARS`      | Nieuw profiel start op 0 ⭐                                           | 🤖   | `reward.spec.ts`                |   ✅   |
| `TC_ONB_03` | `FEAT_PLAT_ZONE_LOCKED` | Zone zonder speelbare game is vergrendeld en reageert niet op een tik | 🤖   | `critical-user-journey.spec.ts` |   ✅   |
| `TC_ONB_04` | `FEAT_PLAT_EXPORT`      | Export bevat oefenpogingen zonder naam of transcript                  | 🤖   | `critical-user-journey.spec.ts` |   ✅   |
| `TC_ONB_05` | opslagherstel           | Ontbrekende duurzame opslag → zichtbare tijdelijke modus              | 🤖   | `pwa-offline.spec.ts`           |   ✅   |

## 2. Download en offline

| TC-ID       | Dekt                       | Verwacht resultaat                                             | Type | Test                        | Status |
| :---------- | :------------------------- | :------------------------------------------------------------- | :--- | :-------------------------- | :----: |
| `TC_PWA_01` | `FEAT_PLAT_GATE`           | Download → verificatie → wereld daarna offline speelbaar       | 🤖   | `pwa-offline.spec.ts`       |   ✅   |
| `TC_PWA_02` | `FEAT_X_OFFLINE`           | Zonder netwerk opent het gedownloade pakket gewoon             | 🤖   | `pwa-offline.spec.ts`       |   ✅   |
| `TC_PWA_03` | service-worker-update      | Nieuwe versie meldt zich en werkt bij na "Nu bijwerken"        | 🤖   | `pwa-offline.spec.ts`       |   ✅   |
| `TC_PWA_04` | basispaden op GitHub Pages | Alle assets en manifesten laden onder de `/Game-Wereld/`-basis | 🧪   | `resolve-base-path` + build |   ✅   |

## 3. Startscherm en instellingen

| TC-ID         | Dekt                                | Verwacht resultaat                                         | Type | Test                              | Status |
| :------------ | :---------------------------------- | :--------------------------------------------------------- | :--- | :-------------------------------- | :----: |
| `TC_START_01` | `FEAT_START_RENDER`                 | Alle basiselementen zichtbaar                              | 🤖   | spec 1.1                          |   ✅   |
| `TC_START_02` | `FEAT_START_SETTINGS`               | Instellingenknop opent het instellingenscherm              | 🤖   | spec 1.2                          |   ✅   |
| `TC_START_03` | `FEAT_START_EXIT`                   | Terug leidt naar de spellenlijst                           | 🤖   | spec 1.3                          |   ✅   |
| `TC_START_04` | `FEAT_START_PLAY`                   | Spelen leidt naar moduskeuze                               | 🤖   | spec 1.4                          |   ✅   |
| `TC_SET_01`   | `FEAT_SET_AUDIO/MUSIC/HINTS/MOTION` | Toggles wijzigen en blijven bewaard                        | 🤖   | spec 2.1/2.2                      |   ✅   |
| `TC_SET_02`   | `FEAT_SET_MIC_STATUS/PRIVACY_CARD`  | Microfoon- en privacystatus correct getoond                | 🤖   | spec 2.3                          |   ✅   |
| `TC_SET_03`   | `FEAT_SET_RESET_*`                  | Annuleren behoudt, bevestigen wist alles                   | 🤖   | spec 2.4                          |   ✅   |
| `TC_SET_04`   | `FEAT_SET_BACK`                     | Terug behoudt de gewijzigde instellingen                   | 🤖   | spec 2.5                          |   ✅   |
| `TC_SET_05`   | reset-volledigheid                  | Reset wist sleutels, observaties én het Zeg & Vlieg-record | 🧪   | `voiceSideScrollerRecord.test.ts` |   ✅   |
| `TC_SET_06`   | `FEAT_SET_MOTION`                   | Rustige beweging dempt de animaties zonder vertraging      | 👤   | op toestel                        |   👤   |

## 4. Kies het Woord

| TC-ID        | Dekt                       | Verwacht resultaat                                             | Type | Test                              | Status |
| :----------- | :------------------------- | :------------------------------------------------------------- | :--- | :-------------------------------- | :----: |
| `TC_WORD_01` | `FEAT_WORD_RENDER/OPTIONS` | Quiz opent met vraagpaneel, keuzekaarten en voortgang          | 🤖   | `word-choice.spec.ts`             |   ✅   |
| `TC_WORD_02` | `FEAT_WORD_CORRECT`        | Goed antwoord → succesfeedback met nazegzin en bonus           | 🤖   | `word-choice.spec.ts`             |   ✅   |
| `TC_WORD_03` | `FEAT_WORD_WRONG`          | Fout antwoord → vriendelijke tip, de vraag blijft staan        | 🤖   | `word-choice.spec.ts`             |   ✅   |
| `TC_WORD_04` | `FEAT_WORD_AUTO_ADVANCE`   | Geen Volgende-knop; de vraag schakelt vanzelf door             | 🤖🧪 | `word-choice.spec.ts` + component |   ✅   |
| `TC_WORD_05` | `FEAT_WORD_SOUND`          | Goed/fout-geluid speelt, niet als audio uitstaat               | 🧪   | `WordChoiceScreen.test.tsx`       |   ✅   |
| `TC_WORD_06` | dubbele tik                | Tweede tik tijdens het doorschakelen telt niet dubbel          | 🧪   | `WordChoiceScreen.test.tsx`       |   ✅   |
| `TC_WORD_07` | `FEAT_WORD_SUMMARY/*`      | Volledige ronde eindigt met eindscherm; Opnieuw en Menu werken | 🤖   | `word-choice.spec.ts`             |   ✅   |
| `TC_WORD_08` | `FEAT_WORD_HINT`           | Hint toont tekst en laat de juiste kaart oplichten             | 🤖   | `word-choice.spec.ts`             |   ✅   |

## 5. Zeg & Zet

| TC-ID         | Dekt                          | Verwacht resultaat                                                                | Type | Test                                | Status |
| :------------ | :---------------------------- | :-------------------------------------------------------------------------------- | :--- | :---------------------------------- | :----: |
| `TC_SCENE_01` | `FEAT_SCENE_RENDER`           | Speelveld, instructie en objectbalk verschijnen                                   | 🤖   | spec 3.1                            |   ✅   |
| `TC_SCENE_02` | `FEAT_SCENE_KB_*`             | Overtyp-laag kleurt per letter; fout + Backspace herstelt; zin plaatst het object | 🤖   | spec 3.2                            |   ✅   |
| `TC_SCENE_03` | `FEAT_SCENE_MIC/WAVE`         | Microfoon activeert, wave verschijnt op de hoge positie                           | 🤖   | spec 3.3 (chromium)                 |   ✅   |
| `TC_SCENE_04` | `FEAT_SCENE_TAP_PLACE`        | Sticker kiezen en tikken plaatst het object                                       | 🤖   | spec 3.4                            |   ✅   |
| `TC_SCENE_05` | `FEAT_SCENE_FEEDBACK_ALMOST`  | Onduidelijk commando → herstelbare feedback, geen doorschakeling                  | 🤖   | spec 3.5                            |   ✅   |
| `TC_SCENE_06` | `FEAT_SCENE_AUTO_CONFIRM`     | Goed commando plaatst en bevestigt automatisch, door naar de volgende opdracht    | 🤖   | spec 3.6                            |   ✅   |
| `TC_SCENE_07` | `FEAT_SCENE_ONE_INPUT`        | Nooit wave én typ-paneel tegelijk, in beide richtingen                            | 🤖   | spec 3.7                            |   ✅   |
| `TC_SCENE_08` | `FEAT_SCENE_PARSE`            | Parser levert object, relatie, zone en betrouwbaarheid                            | 🧪   | `spoken-command-parser.test.ts`     |   ✅   |
| `TC_SCENE_09` | `FEAT_SCENE_ANCHOR_SAFE`      | Opdracht met ongeplaatst anker crasht niet en telt niet als goed                  | 🧪   | `dynamic-scene-relations.test.ts`   |   ✅   |
| `TC_SCENE_10` | `FEAT_SCENE_KEYBOARD_PLACE`   | Toetsenbordcursor plaatst in de juiste zone                                       | 🧪   | `keyboard-scene-placement.test.ts`  |   ✅   |
| `TC_SCENE_11` | zone-geometrie                | Punt-in-zone en kleinste-zone-keuze kloppen                                       | 🧪   | `scene-geometry-utils.test.ts`      |   ✅   |
| `TC_SCENE_12` | `FEAT_SCENE_SUMMARY`          | Ronde-eindscherm toont geoefende woorden en begrippen                             | 🧪   | `SceneBuilderRoundSummary.test.tsx` |   ✅   |
| `TC_SCENE_13` | `FEAT_SCENE_MIC` echte spraak | Ingesproken commando plaatst het juiste object                                    | 👤   | toestel (A56, iPhone)               |   👤   |

## 6. Zeg & Bouw

| TC-ID        | Dekt                       | Verwacht resultaat                                           | Type | Test                                | Status |
| :----------- | :------------------------- | :----------------------------------------------------------- | :--- | :---------------------------------- | :----: |
| `TC_BOUW_01` | `FEAT_BOUW_RENDER`         | Bouwkaart, strand en objectbalk verschijnen                  | 🤖   | `zeg-en-bouw.spec.ts`               |   ✅   |
| `TC_BOUW_02` | `FEAT_BOUW_TAP`            | Plaatje kiezen vraagt om een plek; tikken plaatst            | 🤖   | `zeg-en-bouw.spec.ts`               |   ✅   |
| `TC_BOUW_03` | `FEAT_BOUW_PARSE_COMPOUND` | Eén zin plaatst meerdere objecten                            | 🧪   | `compound-placement-parser.test.ts` |   ✅   |
| `TC_BOUW_04` | `FEAT_BOUW_BONUS`          | 2 ⭐ per nieuw passend object, +1 ⭐ compound-bonus          | 🧪   | `zeg-en-bouw-cards.test.ts`         |   ✅   |
| `TC_BOUW_05` | `FEAT_BOUW_SUMMARY/NEXT`   | Kaart af → eindscherm; Volgende strand geeft een verse kaart | 🤖   | `zeg-en-bouw.spec.ts`               |   ✅   |
| `TC_BOUW_06` | `FEAT_BOUW_FREE`           | Vrij bouwen: elk plaatje mag, geen doel of eindscherm        | 🤖   | `zeg-en-bouw.spec.ts`               |   ✅   |
| `TC_BOUW_07` | `FEAT_BOUW_VOICE`          | Ingesproken samengestelde zin bouwt de scène                 | 👤   | toestel                             |   👤   |

## 7. Zeg & Vlieg

| TC-ID       | Dekt                             | Verwacht resultaat                                           | Type | Test                              | Status |
| :---------- | :------------------------------- | :----------------------------------------------------------- | :--- | :-------------------------------- | :----: |
| `TC_FLY_01` | `FEAT_FLY_START_OVERLAY/SHIELDS` | Stage, HUD en 3 schildjes met start-overlay                  | 🤖   | `voice-side-scroller.spec.ts`     |   ✅   |
| `TC_FLY_02` | `FEAT_FLY_PLAYER`                | Na Start loopt de afstand op                                 | 🤖   | `voice-side-scroller.spec.ts`     |   ✅   |
| `TC_FLY_03` | `FEAT_FLY_OBSTACLES/COMBO`       | Botsing kost een schildje en breekt de combo; geen game-over | 🧪   | `voiceSideScrollerEngine.test.ts` |   ✅   |
| `TC_FLY_04` | `FEAT_FLY_RECORD`                | Record wordt per profiel bewaard en bij reset gewist         | 🧪   | `voiceSideScrollerRecord.test.ts` |   ✅   |
| `TC_FLY_05` | woordselectie                    | Niet-gemeesterde woorden komen vaker terug                   | 🧪   | `voiceSideScrollerWords.test.ts`  |   ✅   |
| `TC_FLY_06` | `FEAT_FLY_VOICE`                 | Object benoemen verzamelt het en geeft punten                | 👤   | toestel                           |   👤   |

## 8. Beloningen en voortgang

| TC-ID          | Dekt                    | Verwacht resultaat                              | Type | Test                             | Status |
| :------------- | :---------------------- | :---------------------------------------------- | :--- | :------------------------------- | :----: |
| `TC_REWARD_01` | `FEAT_REWARD_*`         | Beloningsscherm toont titel, sterren en kaart   | 🤖   | `reward.spec.ts`                 |   ✅   |
| `TC_REWARD_02` | `FEAT_REWARD_MENU_ONLY` | Vanuit het menu geen "Opnieuw"-knop             | 🤖   | `reward.spec.ts`                 |   ✅   |
| `TC_REWARD_03` | `FEAT_X_REWARDS`        | Unlocks volgen de curve 3/8/16/28/42/60/85      | 🧪   | `rewards-and-progress.test.ts`   |   ✅   |
| `TC_REWARD_04` | `FEAT_MODE_UNLOCK`      | Modi openen bij 0/3/8/14 ⭐                     | 🧪   | `mode-unlocks.test.ts`           |   ✅   |
| `TC_PROG_01`   | `FEAT_PLAT_PROGRESS`    | Voortgangsscherm toont categorieën en tempo     | 🧪🤖 | `progressData.test.ts` + journey |   ✅   |
| `TC_PROG_02`   | `FEAT_X_PRACTICE`       | Elke poging levert een observatie, ook bij fout | 🧪   | `practice-observations.test.ts`  |   ✅   |

## 9. Transversaal

| TC-ID          | Dekt                 | Verwacht resultaat                                                         | Type | Test                                | Status |
| :------------- | :------------------- | :------------------------------------------------------------------------- | :--- | :---------------------------------- | :----: |
| `TC_A11Y_01`   | `FEAT_X_A11Y`        | axe-audit op alle kernschermen zonder overtredingen                        | ♿   | `accessibility.spec.ts`             |   ✅   |
| `TC_A11Y_02`   | `JRN_MIC_FALLBACK`   | Kernopdracht lukt volledig met geweigerde microfoon via het toetsenbord    | ♿🤖 | `accessibility.spec.ts`             |   ✅   |
| `TC_A11Y_03`   | 48×48 + focus-ring   | Alle interactieve elementen halen de norm                                  | ♿   | gescopte baseline + audit           |   ✅   |
| `TC_SPEECH_01` | `FEAT_X_SPEECH`      | Continue segmenten worden correct samengevoegd                             | 🧪   | `browserSpeech.test.ts`             |   ✅   |
| `TC_SPEECH_02` | Android-quirks       | Lege events genegeerd; "definitief zonder zekerheid" geldt als tussentijds | 🧪   | `browserSpeech.test.ts`             |   ✅   |
| `TC_SPEECH_03` | verouderde segmenten | Tussenstanden worden niet aan elkaar geplakt ("zet zet zet de …")          | 🧪   | `browserSpeech.test.ts`             |   ✅   |
| `TC_SPEECH_04` | mic-eigenaarschap    | Op telefoon/tablet opent de wave geen eigen opname                         | 🧪   | `MicWaveBars.test.tsx`              |   ✅   |
| `TC_SPEECH_05` | `FEAT_X_WORD_SAFE`   | Ongewenste woorden gemaskeerd, zachte nudge                                | 🧪   | `word-safety.test.ts`               |   ✅   |
| `TC_X_RANDOM`  | `FEAT_X_RANDOM`      | Elke ronde krijgt een verse, geseede volgorde                              | 🧪   | `instruction-randomization.test.ts` |   ✅   |
| `TC_PRIV_01`   | `FEAT_X_PRIVACY`     | Data van profiel A lekt niet naar profiel B                                | 🧪   | `voiceSideScrollerRecord.test.ts`   |   ✅   |

---

## 10. Statusoverzicht

| Status                            | Aantal |
| :-------------------------------- | :----: |
| ✅ Geautomatiseerd en groen       |   45   |
| 👤 Handmatig bevestigd op toestel |   5    |
| 🔴 Rood                           |   0    |
| **Totaal**                        | **50** |

De 👤-cases vragen een echte microfoon of hoorbaar geluid en zijn daarom niet in CI te draaien. Ze zijn doorlopen op een Samsung Galaxy A56 (Chrome, geïnstalleerde app) en een iPhone (Safari).
