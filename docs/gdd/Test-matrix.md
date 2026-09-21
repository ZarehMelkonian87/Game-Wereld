# ✅ Test-matrix — Magisch Strand-Avontuur

> Document 4 van 4 in het GDD-dossier. Koppelt **testcases** (`TC_*`) aan de features ([Feature-catalogus](Feature-catalogus.md)) en reisstappen ([User Journey Map](User-Journey-Map.md)). Dit is het document dat bepaalt _hoe_ we verifiëren wat werkt, en dat de coverage-gaten blootlegt.

---

## 0. Leeswijzer

### 0.1 Metadata

| Veld                  | Waarde                                                                                                  |
| :-------------------- | :------------------------------------------------------------------------------------------------------ |
| **Documenttitel**     | Test-matrix — Magisch Strand-Avontuur                                                                   |
| **Documentversie**    | `0.3` (bijgewerkt na afronding `T-01` t/m `T-37`, incl. verificatiebatch `T-10`–`T-18`)                 |
| **Laatst bijgewerkt** | 2026-09-16                                                                                              |
| **Status**            | 🟢 Bijgewerkt — alle geautomatiseerde suites groen; alleen mic-/apparaattests (`T-10`, `T-18`) resteren |
| **Testframework**     | Playwright (`e2e/`), Vitest (unit), axe (a11y)                                                          |

### 0.2 Hoe lees je een testcase

| Kolom                  | Betekenis                                                                             |
| :--------------------- | :------------------------------------------------------------------------------------ |
| **TC-ID**              | Stabiel ID, `TC_<GEBIED>_<NN>`.                                                       |
| **Dekt**               | Welke `FEAT_`/`JRN_` het verifieert.                                                  |
| **Verwacht resultaat** | Het toetsbare criterium (pass/fail).                                                  |
| **Type**               | 🤖 E2E (Playwright) · 🧪 Unit (Vitest) · ♿ a11y (axe) · 👤 Handmatig (apparaat).     |
| **Bestaande test**     | Verwijzing naar een bestaand testbestand, of "nieuw".                                 |
| **Status**             | ✅ Groen · 🔴 Rood (faalt/kapot) · ⚪ Nog niet gedekt · 👤 Alleen handmatig mogelijk. |

### 0.3 Teststrategie

Conform GDD-index sectie 9: **geautomatiseerde tests gaten elke build**, **handmatige tests** richten zich op waar menselijke waarneming telt (geluid, spraakverstaanbaarheid, gevoel). Concreet:

| Laag                     | Middel                               | Dekt                                             |
| :----------------------- | :----------------------------------- | :----------------------------------------------- |
| **E2E**                  | Playwright (`npm run test:e2e`)      | Schermen, navigatie, invoer, feedback, flows     |
| **Unit**                 | Vitest (`npm run test`)              | Parser, rewards, progressie, zones (pure logica) |
| **A11y**                 | axe via Playwright (`test:e2e:a11y`) | 48×48, aria, contrast op kernschermen            |
| **Handmatig (apparaat)** | Tablet/telefoon met mic              | Spraakherkenning, audio-output, hoorbaarheid     |

### 0.4 Bestaande dekking (nulmeting)

| Testbestand                           | Dekt                                                     | Oordeel        |
| :------------------------------------ | :------------------------------------------------------- | :------------- |
| `e2e/magisch-strand-avontuur.spec.ts` | Start, Instellingen, Zeg & Zet (14 tests, 1.1–3.6)       | 🟢 goede basis |
| `e2e/critical-user-journey.spec.ts`   | Onboarding: profiel maken/herstellen → game              | 🟢             |
| `e2e/accessibility.spec.ts`           | axe-audit kernschermen + **mic-geweigerd → toetsenbord** | 🟢             |
| `e2e/pwa-offline.spec.ts`             | Offline download/open, herstel ontbrekende opslag        | 🟢             |
| `e2e/word-choice.spec.ts`             | Kies het Woord: volledige ronde, goed/fout/hint (`T-24`) | 🟢             |
| `e2e/voice-side-scroller.spec.ts`     | Zeg & Vlieg: start-overlay, ronde loopt, scroll (`T-24`) | 🟢             |
| `e2e/reward.spec.ts`                  | Beloningsscherm: render, navigatie (`T-24`)              | 🟢             |
| `e2e/zeg-en-bouw.spec.ts`             | Zeg & Bouw: bouwscherm, plaatsing, ronde-einde (`T-04d`) | 🟢             |
| `e2e/generate-visual-report.spec.ts`  | Visueel screenshotrapport                                | 🟢             |

**Grootste dekkingsgaten:** ✅ opgelost via `T-24` — **Kies het Woord** (`word-choice.spec.ts`), **Zeg & Vlieg** (`voice-side-scroller.spec.ts`) en het **beloningsscherm** (`reward.spec.ts`) hebben nu eigen e2e-suites (groen op chromium-tablet én webkit-tablet). De 4e modus **Zeg & Bouw** (`T-04`) heeft een eigen suite (`zeg-en-bouw.spec.ts`). Unit-dekking uitgebreid met `dynamic-scene-relations.test.ts` (`T-15`), `voiceSideScrollerRecord.test.ts` (`T-11`/`T-12`) en de categorie-/tempo-logica in `progressData.test.ts` (`T-17`). Volledige suite: **49 bestanden, 195 unit-tests groen**.

---

## 1. Onboarding (`JRN_ONBOARD`, `JRN_RETURN`)

| TC-ID       | Dekt                        | Verwacht resultaat                                                | Type | Bestaande test                  | Status |
| :---------- | :-------------------------- | :---------------------------------------------------------------- | :--- | :------------------------------ | :----: |
| `TC_ONB_01` | `JRN_ONBOARD_01..07`        | Welkom → profiel → avatar → naam → thema → game start zonder fout | 🤖   | `critical-user-journey.spec.ts` |   ✅   |
| `TC_ONB_02` | `JRN_RETURN_02`             | Bestaand profiel kiezen behoudt sterren/unlocks/instellingen      | 🤖   | nieuw                           |   ⚪   |
| `TC_ONB_03` | `FEAT_START_STARS` / `T-21` | Nieuw profiel start op **0 ⭐** (niet 120)                        | 🤖   | `T-21` afgerond                 |   ✅   |

---

## 2. Startscherm (`SCR_MSA_START`)

| TC-ID         | Dekt                               | Verwacht resultaat                                               | Type | Bestaande test | Status |
| :------------ | :--------------------------------- | :--------------------------------------------------------------- | :--- | :------------- | :----: |
| `TC_START_01` | `FEAT_START_RENDER`                | Alle basiselementen zichtbaar (titel, mascotte, teller, knoppen) | 🤖   | spec 1.1       |   ✅   |
| `TC_START_02` | `FEAT_START_SETTINGS`              | Instellingenknop → instellingenscherm                            | 🤖   | spec 1.2       |   ✅   |
| `TC_START_03` | `FEAT_START_EXIT`                  | Terug → portaal                                                  | 🤖   | spec 1.3       |   ✅   |
| `TC_START_04` | `FEAT_START_PLAY`, `JRN_ZEGZET_01` | Spelen → moduskeuze                                              | 🤖   | spec 1.4       |   ✅   |

---

## 3. Instellingen (`SCR_MSA_SETTINGS`, `JRN_SETTINGS`)

| TC-ID       | Dekt                                           | Verwacht resultaat                                                                   | Type  | Bestaande test                                     | Status |
| :---------- | :--------------------------------------------- | :----------------------------------------------------------------------------------- | :---- | :------------------------------------------------- | :----: |
| `TC_SET_01` | `FEAT_SET_AUDIO/MUSIC/HINTS`                   | Toggles wijzigen `aria-checked` en persisteren                                       | 🤖    | spec 2.1/2.2                                       |   ✅   |
| `TC_SET_02` | `FEAT_SET_MIC_STATUS`, `FEAT_SET_PRIVACY_CARD` | Mic-/privacystatus correct getoond                                                   | 🤖    | spec 2.3                                           |   ✅   |
| `TC_SET_03` | `FEAT_SET_RESET_OPEN/CONFIRM/CANCEL`           | Reset-dialoog: annuleren behoudt, bevestigen wist                                    | 🤖    | spec 2.4                                           |   ✅   |
| `TC_SET_04` | `FEAT_SET_BACK`                                | Terug behoudt gewijzigde instellingen                                                | 🤖    | spec 2.5                                           |   ✅   |
| `TC_SET_05` | `T-11`                                         | Reset wist **alle** sleutels **én** IndexedDB-observaties (incl. Zeg & Vlieg-record) | 🧪🤖  | `voiceSideScrollerRecord.test.ts` + spec 2.4       |   ✅   |
| `TC_SET_06` | `FEAT_SET_MOTION` / `T-14`                     | `reducedMotion` dempt zware animaties                                                | 👤/🤖 | in browser bevestigd (`[data-app-reduced-motion]`) |   ✅   |
| `TC_SET_07` | `FEAT_SET_DEVTOOLS_TOGGLE` / `T-20`            | Dev-toggle **niet** zichtbaar in productie                                           | 🤖    | `T-20` afgerond                                    |   ✅   |

---

## 4. Zeg & Zet (`SCR_MSA_SCENE_BUILDER`, `JRN_ZEGZET`)

| TC-ID         | Dekt                                            | Verwacht resultaat                                                                                                                               | Type | Bestaande test                                                            |  Status   |
| :------------ | :---------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :--- | :------------------------------------------------------------------------ | :-------: |
| `TC_SCENE_01` | `FEAT_SCENE_RENDER`, `JRN_ZEGZET_02`            | Speelveld, instructie en objectbalk verschijnen                                                                                                  | 🤖   | spec 3.1                                                                  |    ✅     |
| `TC_SCENE_02` | `FEAT_SCENE_KB_*`, `FEAT_SCENE_PARSE`           | Typen + bevestigen plaatst het object                                                                                                            | 🤖   | spec 3.2                                                                  |    ✅     |
| `TC_SCENE_03` | `FEAT_SCENE_MIC/WAVE/STOP`                      | Mic activeert, waveform op hoge positie, Klaar-knop                                                                                              | 🤖   | spec 3.3                                                                  | 🟡 (mock) |
| `TC_SCENE_04` | `FEAT_SCENE_CAROUSEL`, `FEAT_SCENE_TAP_PLACE`   | Sticker selecteren + tikken plaatst object                                                                                                       | 🤖   | spec 3.4                                                                  |    ✅     |
| `TC_SCENE_05` | `FEAT_SCENE_FEEDBACK_ALMOST`, `FEAT_SCENE_HINT` | Fout/geen plaatsing → herstelbare feedback + hint                                                                                                | 🤖   | spec 3.5                                                                  |    ✅     |
| `TC_SCENE_06` | `FEAT_SCENE_FEEDBACK_OK`, `FEAT_SCENE_CONFIRM`  | Goed antwoord → succes + "Volgende"                                                                                                              | 🤖   | spec 3.6                                                                  |    ✅     |
| `TC_SCENE_07` | `FEAT_SCENE_VIDEO` / `T-19`                     | Instructievideo speelt af (of nette fallback zonder foutmelding)                                                                                 | 🤖   | `T-19` afgerond                                                           |    ✅     |
| `TC_SCENE_08` | `FEAT_SCENE_SUMMARY` / `T-03`                   | Aan einde ronde verschijnt een ronde-eindscherm                                                                                                  | 🤖   | `T-03` afgerond                                                           |    ✅     |
| `TC_SCENE_09` | `FEAT_SCENE_DRAG_PLACE`                         | Drag-and-drop naar zone plaatst object                                                                                                           | 🤖   | nieuw                                                                     |    ⚪     |
| `TC_SCENE_10` | `FEAT_SCENE_MIC`, echte spraak                  | Ingesproken commando plaatst juiste object                                                                                                       | 👤   | nieuw                                                                     |    👤     |
| `TC_SCENE_11` | `T-15` / `GAP-08`                               | Opdracht met een **nog niet geplaatst anker** crasht niet en telt niet als goed (geen suggestie/hint, `matches:false` + ontbrekend anker gemeld) | 🧪   | `dynamic-scene-relations.test.ts`                                         |    ✅     |
| `TC_SCENE_12` | `T-50`                                          | Typen openen zet de mic uit en verbergt de wave; mic starten sluit het typ-paneel — nooit beide tegelijk                                         | 🤖   | spec 3.7 (chromium; webkit skip: geen mic-permissie in Playwright-WebKit) |    ✅     |

---

## 5. Kies het Woord (`SCR_MSA_WORD_CHOICE`, `JRN_KIESWOORD`) — ✅ eigen suite (`word-choice.spec.ts`, `T-24`)

| TC-ID        | Dekt                                | Verwacht resultaat                                                                          | Type | Bestaande test                       | Status |
| :----------- | :---------------------------------- | :------------------------------------------------------------------------------------------ | :--- | :----------------------------------- | :----: |
| `TC_WORD_01` | `FEAT_WORD_RENDER/QUESTION/OPTIONS` | Quiz opent met vraag + 2–4 keuzekaarten                                                     | 🤖   | `word-choice.spec.ts`                |   ✅   |
| `TC_WORD_02` | `FEAT_WORD_CORRECT`                 | Goed antwoord → groene rand, bonus zonder hint, nazegzin                                    | 🤖   | `word-choice.spec.ts`                |   ✅   |
| `TC_WORD_03` | `FEAT_WORD_WRONG`                   | Fout antwoord → tip, geen straf, opnieuw mogelijk                                           | 🤖   | `word-choice.spec.ts`                |   ✅   |
| `TC_WORD_04` | `FEAT_WORD_HINT`                    | Hint toont tekst + laat juiste kaart oplichten                                              | 🤖   | `word-choice.spec.ts`                |   ✅   |
| `TC_WORD_05` | `FEAT_WORD_PROGRESS`                | Voortgang loopt 1/12 → 12/12                                                                | 🤖   | `word-choice.spec.ts`                |   ✅   |
| `TC_WORD_06` | `FEAT_WORD_SUMMARY`                 | Na 12 vragen: in-game eindscherm met stats                                                  | 🤖   | `word-choice.spec.ts`                |   ✅   |
| `TC_WORD_07` | `FEAT_WORD_SUMMARY_REPLAY/MENU`     | Opnieuw/Menu werken                                                                         | 🤖   | `word-choice.spec.ts`                |   ✅   |
| `TC_WORD_08` | `T-23`                              | Kaarten flitsen **niet** leeg bij doorschakelen (sticker-preload + WebP)                    | 🤖   | `T-23`/`T-33a` afgerond              |   ✅   |
| `TC_WORD_09` | `FEAT_WORD_AUTO_ADVANCE`            | Goed antwoord → geen Volgende-knop, vraag schakelt vanzelf door; fout antwoord blijft staan | 🤖   | `word-choice.spec.ts` (`T-51`)       |   ✅   |
| `TC_WORD_10` | `FEAT_WORD_SOUND`                   | Goed-/fout-geluid speelt, niet als audio uitstaat; dubbele tik telt niet dubbel             | 🤖   | `WordChoiceScreen.test.tsx` (`T-51`) |   ✅   |

---

## 6. Zeg & Vlieg (`SCR_MSA_VOICE_SCROLLER`, `JRN_ZEGVLIEG`) — ✅ eigen suite (`voice-side-scroller.spec.ts`, `T-24`)

| TC-ID       | Dekt                                 | Verwacht resultaat                                                               | Type | Bestaande test                                         | Status |
| :---------- | :----------------------------------- | :------------------------------------------------------------------------------- | :--- | :----------------------------------------------------- | :----: |
| `TC_FLY_01` | `FEAT_FLY_START_OVERLAY`             | Start-overlay met doelwoorden + privacy                                          | 🤖   | `voice-side-scroller.spec.ts`                          |   ✅   |
| `TC_FLY_02` | `FEAT_FLY_PLAYER`, `FEAT_FLY_HUD`    | Na Start: held vliegt, afstand loopt op (`data-scroll-x` stijgt)                 | 🤖   | `voice-side-scroller.spec.ts`                          |   ✅   |
| `TC_FLY_03` | `FEAT_FLY_THUMBRAIL`                 | Duim-rail verandert vlieghoogte                                                  | 🤖   | `voice-side-scroller.spec.ts`                          |   ✅   |
| `TC_FLY_04` | `FEAT_FLY_OBSTACLES` / `T-22`/`T-30` | Botsing = vriendelijk gevolg (schild/slowdown, geen harde game-over per botsing) | 🧪🤖 | `voiceSideScrollerEngine.test.ts` (logica) + smoke-e2e |   ✅   |
| `TC_FLY_05` | `FEAT_FLY_SUMMARY/SUMMARY_WORLD`     | Ronde-einde toont stats + Opnieuw/Wereld                                         | 🤖   | `voice-side-scroller.spec.ts`                          |   ✅   |
| `TC_FLY_06` | `FEAT_FLY_VOICE`, echte spraak       | Object benoemen verzamelt het + kent punten toe                                  | 👤   | nieuw                                                  |   👤   |

---

## 6b. Zeg & Bouw (`SCR_MSA_ZEG_BOUW`, `JRN_ZEGBOUW`) — ✅ eigen suite (`zeg-en-bouw.spec.ts`, `T-04d`)

> 4e modus, gebouwd in `T-04` (a t/m e). Kind bouwt een strandscène met gesproken/getypte samengestelde opdrachten.

| TC-ID        | Dekt                            | Verwacht resultaat                                                      | Type | Bestaande test                      | Status |
| :----------- | :------------------------------ | :---------------------------------------------------------------------- | :--- | :---------------------------------- | :----: |
| `TC_BOUW_01` | `FEAT_BOUW_RENDER`              | Bouwscherm opent met kaart, objectbalk en zones                         | 🤖   | `zeg-en-bouw.spec.ts`               |   ✅   |
| `TC_BOUW_02` | `FEAT_BOUW_PARSE_COMPOUND`      | Eén zin plaatst meerdere objecten (`parseCompoundPlacements`)           | 🧪   | `compound-placement-parser.test.ts` |   ✅   |
| `TC_BOUW_03` | `FEAT_BOUW_PLACE/BONUS`         | Plaatsing via typen/commando werkt; compound-bonus +1⭐ bij ≥2 objecten | 🤖🧪 | `zeg-en-bouw.spec.ts`               |   ✅   |
| `TC_BOUW_04` | `FEAT_BOUW_WAVE/OVERLAY`        | Live wave + transcript; "Strand af!"-overlay met korte vertraging       | 🤖   | in browser bevestigd (`T-04c` C2b)  |   ✅   |
| `TC_BOUW_05` | `FEAT_BOUW_SUMMARY`             | Ronde-eindscherm met stats + Opnieuw/Menu                               | 🤖   | `zeg-en-bouw.spec.ts`               |   ✅   |
| `TC_BOUW_06` | `FEAT_BOUW_FREE`                | Vrij Bouwen-modus (`T-04e`)                                             | 🤖   | `zeg-en-bouw.spec.ts`               |   ✅   |
| `TC_BOUW_07` | `FEAT_BOUW_VOICE`, echte spraak | Ingesproken samengestelde zin bouwt de scène                            | 👤   | nieuw                               |   👤   |

---

## 7. Beloning (`SCR_MSA_REWARD`, `JRN_REWARD`) — ✅ eigen suite (`reward.spec.ts`, `T-24`)

| TC-ID          | Dekt                                        | Verwacht resultaat                                                            | Type | Bestaande test                 | Status |
| :------------- | :------------------------------------------ | :---------------------------------------------------------------------------- | :--- | :----------------------------- | :----: |
| `TC_REWARD_01` | `FEAT_REWARD_RENDER/FEATURED/STARS/UNLOCKS` | Beloningsscherm toont unlocks + stats                                         | 🤖   | `reward.spec.ts`               |   ✅   |
| `TC_REWARD_02` | `FEAT_REWARD_REPLAY/WORLD`                  | Opnieuw/Wereld navigeren correct (menu-only: geen "Opnieuw")                  | 🤖   | `reward.spec.ts`               |   ✅   |
| `TC_REWARD_03` | `T-01`/`T-02` / `GAP-01`                    | Beloningen ontgrendelen **geleidelijk** volgens de curve (3/8/16/28/42/60/85) | 🧪   | `rewards-and-progress.test.ts` |   ✅   |

---

## 8. Transversaal: toegankelijkheid, spraaklogica, PWA

| TC-ID               | Dekt                       | Verwacht resultaat                                                                                                             | Type | Bestaande test                                                          | Status |
| :------------------ | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------- | :--- | :---------------------------------------------------------------------- | :----: |
| `TC_A11Y_01`        | `FEAT_X_A11Y`              | axe-audit kernschermen zonder overtredingen                                                                                    | ♿   | `accessibility.spec.ts`                                                 |   ✅   |
| `TC_A11Y_02`        | `JRN_MIC_FALLBACK`         | Kernopdracht lukt met **geweigerde mic** via toetsenbord                                                                       | ♿🤖 | `accessibility.spec.ts`                                                 |   ✅   |
| `TC_A11Y_03`        | `T-13`                     | Alle interactieve elementen ≥ 48×48 + `focus-visible` in alle modi                                                             | ♿   | gescopte `:focus-visible`-baseline in `theme.css`, in browser bevestigd |   ✅   |
| `TC_MOTION_01`      | `T-14` / `FEAT_SET_MOTION` | In-app `reducedMotion` dempt gameplay-animaties (niet alleen OS)                                                               | 🤖   | in browser bevestigd (`.bezem-start-flyer` → `animation: none`)         |   ✅   |
| `TC_PROG_01`        | `T-17` / `GAP-16`          | `SCR_PLAT_PROGRESS` toont het volledige observatiemodel: categorie-uitsplitsing (taaldomeinen/ruimtebegrippen) + tempo-inzicht | 🧪🤖 | `progressData.test.ts` + in browser met echte data                      |   ✅   |
| `TC_PARSE_01`       | `FEAT_SCENE_PARSE`         | Parser levert juiste object/relatie/zone + confidence                                                                          | 🧪   | `spoken-command-parser.test.ts`                                         |   ✅   |
| `TC_REWARD_UNIT_01` | `T-01`/`T-02`              | `resolveNewRewardUnlocks` volgt de nieuwe curve                                                                                | 🧪   | `rewards-and-progress.test.ts`                                          |   ✅   |
| `TC_PWA_01`         | `FEAT_X_OFFLINE`           | Offline download → wereld offline speelbaar                                                                                    | 🤖   | `pwa-offline.spec.ts`                                                   |   ✅   |
| `TC_PWA_02`         | opslagherstel              | Herstelt bij ontbrekende duurzame opslag (tijdelijke modus)                                                                    | 🤖   | `pwa-offline.spec.ts`                                                   |   ✅   |
| `TC_PRIV_01`        | `T-12` / `GAP-10`          | Data van profiel A lekt niet naar profiel B                                                                                    | 🧪   | `voiceSideScrollerRecord.test.ts` (+ sleutels per-profiel)              |   ✅   |

---

## 9. Prioritaire toevoegingen (test-gaten) — status

1. ✅ **Regressietests bij de P1-fixes** — allemaal geschreven/afgerond:
   - `TC_REWARD_03` + `TC_REWARD_UNIT_01` bij `T-01`/`T-02` (geleidelijke curve).
   - `TC_SCENE_08` bij `T-03` (ronde-eindscherm Zeg & Zet).
   - `TC_SCENE_07` bij `T-19` (instructievideo).
   - `TC_ONB_03` bij `T-21` (0 sterren bij nieuw profiel).
2. ✅ **Nieuwe modul-suites** (via `T-24` + `T-04d`):
   - `e2e/word-choice.spec.ts` (`TC_WORD_01..07`, `TC_WORD_09`).
   - `e2e/voice-side-scroller.spec.ts` (`TC_FLY_01..05`).
   - `e2e/reward.spec.ts` (`TC_REWARD_01..02`).
   - `e2e/zeg-en-bouw.spec.ts` (`TC_BOUW_01..06`).
3. ✅ **Verificatie-P2's** — `TC_SET_05` (`T-11`), `TC_PRIV_01` (`T-12`), `TC_A11Y_03` (`T-13`), `TC_MOTION_01` (`T-14`), `TC_SCENE_11` (`T-15`), `TC_PROG_01` (`T-17`).
4. ⏳ **Handmatige apparaattests** (mic/audio) — `TC_SCENE_10`, `TC_FLY_06`, `TC_BOUW_07`: draaien op een echte tablet/telefoon; niet automatiseerbaar in CI → apparaattakenlijst (`T-10`/`T-18`, zie GDD-index §12.4).
5. ⚪ **Overgebleven kleine gaten** (geen defect): `TC_ONB_02` (return-profiel behoudt data) en `TC_SCENE_09` (drag-and-drop) — kunnen later een eigen e2e krijgen.

---

## 10. Statusoverzicht

| Status                              | Aantal |
| :---------------------------------- | :----: |
| ✅ Groen (gedekt & werkt)           |   53   |
| 🔴 Rood (test faalt / gedrag kapot) |   0    |
| 🟡 Deels (bv. gemockt)              |   1    |
| ⚪ Nog niet gedekt                  |   2    |
| 👤 Alleen handmatig (apparaat)      |   3    |
| **Totaal**                          | **59** |

**Geen rode testcases meer.** Alle eerder bevestigde defecten (`TC_ONB_03`/`T-21`, `TC_SET_07`/`T-20`, `TC_SCENE_07`/`T-19`, `TC_SCENE_08`/`T-03`, `TC_WORD_08`/`T-23`, `TC_REWARD_03`/`T-01`) zijn opgelost en op ✅ gezet.

**Wat resteert:**

- **2 ⚪ (nog niet gedekt):** `TC_ONB_02` (bestaand profiel behoudt sterren/unlocks/instellingen) en `TC_SCENE_09` (drag-and-drop naar zone) — geen defect, alleen nog geen eigen automatische test.
- **1 🟡:** `TC_SCENE_03` (mic gemockt in e2e; echte mic → `TC_SCENE_10`).
- **3 👤 (apparaat/mic):** `TC_SCENE_10`, `TC_FLY_06`, `TC_BOUW_07` — echte spraakherkenning, alleen op een fysiek toestel te bevestigen (zie apparaattakenlijst `T-10`/`T-18`).

> Dit sluit het GDD-dossier: **GDD-index → Feature-catalogus → User Journey Map → Test-matrix** vormen samen één traceerbare keten van _bedoeling → functie → reis → test → status_.
