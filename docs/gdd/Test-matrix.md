# ✅ Test-matrix — Magisch Strand-Avontuur

> Document 4 van 4 in het GDD-dossier. Koppelt **testcases** (`TC_*`) aan de features ([Feature-catalogus](Feature-catalogus.md)) en reisstappen ([User Journey Map](User-Journey-Map.md)). Dit is het document dat bepaalt *hoe* we verifiëren wat werkt, en dat de coverage-gaten blootlegt.

---

## 0. Leeswijzer

### 0.1 Metadata

| Veld | Waarde |
| :--- | :--- |
| **Documenttitel** | Test-matrix — Magisch Strand-Avontuur |
| **Documentversie** | `0.1` |
| **Laatst bijgewerkt** | 2026-09-11 |
| **Status** | 🟡 Concept — bestaande dekking in kaart, gaten benoemd |
| **Testframework** | Playwright (`e2e/`), Vitest (unit), axe (a11y) |

### 0.2 Hoe lees je een testcase

| Kolom | Betekenis |
| :--- | :--- |
| **TC-ID** | Stabiel ID, `TC_<GEBIED>_<NN>`. |
| **Dekt** | Welke `FEAT_`/`JRN_` het verifieert. |
| **Verwacht resultaat** | Het toetsbare criterium (pass/fail). |
| **Type** | 🤖 E2E (Playwright) · 🧪 Unit (Vitest) · ♿ a11y (axe) · 👤 Handmatig (apparaat). |
| **Bestaande test** | Verwijzing naar een bestaand testbestand, of "nieuw". |
| **Status** | ✅ Groen · 🔴 Rood (faalt/kapot) · ⚪ Nog niet gedekt · 👤 Alleen handmatig mogelijk. |

### 0.3 Teststrategie

Conform GDD-index sectie 9: **geautomatiseerde tests gaten elke build**, **handmatige tests** richten zich op waar menselijke waarneming telt (geluid, spraakverstaanbaarheid, gevoel). Concreet:

| Laag | Middel | Dekt |
| :--- | :--- | :--- |
| **E2E** | Playwright (`npm run test:e2e`) | Schermen, navigatie, invoer, feedback, flows |
| **Unit** | Vitest (`npm run test`) | Parser, rewards, progressie, zones (pure logica) |
| **A11y** | axe via Playwright (`test:e2e:a11y`) | 48×48, aria, contrast op kernschermen |
| **Handmatig (apparaat)** | Tablet/telefoon met mic | Spraakherkenning, audio-output, hoorbaarheid |

### 0.4 Bestaande dekking (nulmeting)

| Testbestand | Dekt | Oordeel |
| :--- | :--- | :--- |
| `e2e/magisch-strand-avontuur.spec.ts` | Start, Instellingen, Zeg & Zet (14 tests, 1.1–3.6) | 🟢 goede basis |
| `e2e/critical-user-journey.spec.ts` | Onboarding: profiel maken/herstellen → game | 🟢 |
| `e2e/accessibility.spec.ts` | axe-audit kernschermen + **mic-geweigerd → toetsenbord** | 🟢 |
| `e2e/pwa-offline.spec.ts` | Offline download/open, herstel ontbrekende opslag | 🟢 |
| `e2e/generate-visual-report.spec.ts` | Visueel screenshotrapport | 🟢 |

**Grootste dekkingsgaten:** **Kies het Woord** en **Zeg & Vlieg** hebben **géén** e2e-tests, en het **beloningsscherm** evenmin. Dit zijn prioritaire toevoegingen (zie sectie 9).

---

## 1. Onboarding (`JRN_ONBOARD`, `JRN_RETURN`)

| TC-ID | Dekt | Verwacht resultaat | Type | Bestaande test | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `TC_ONB_01` | `JRN_ONBOARD_01..07` | Welkom → profiel → avatar → naam → thema → game start zonder fout | 🤖 | `critical-user-journey.spec.ts` | ✅ |
| `TC_ONB_02` | `JRN_RETURN_02` | Bestaand profiel kiezen behoudt sterren/unlocks/instellingen | 🤖 | nieuw | ⚪ |
| `TC_ONB_03` | `FEAT_START_STARS` / `T-21` | Nieuw profiel start op **0 ⭐** (niet 120) | 🤖 | nieuw | 🔴 |

---

## 2. Startscherm (`SCR_MSA_START`)

| TC-ID | Dekt | Verwacht resultaat | Type | Bestaande test | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `TC_START_01` | `FEAT_START_RENDER` | Alle basiselementen zichtbaar (titel, mascotte, teller, knoppen) | 🤖 | spec 1.1 | ✅ |
| `TC_START_02` | `FEAT_START_SETTINGS` | Instellingenknop → instellingenscherm | 🤖 | spec 1.2 | ✅ |
| `TC_START_03` | `FEAT_START_EXIT` | Terug → portaal | 🤖 | spec 1.3 | ✅ |
| `TC_START_04` | `FEAT_START_PLAY`, `JRN_ZEGZET_01` | Spelen → moduskeuze | 🤖 | spec 1.4 | ✅ |

---

## 3. Instellingen (`SCR_MSA_SETTINGS`, `JRN_SETTINGS`)

| TC-ID | Dekt | Verwacht resultaat | Type | Bestaande test | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `TC_SET_01` | `FEAT_SET_AUDIO/MUSIC/HINTS` | Toggles wijzigen `aria-checked` en persisteren | 🤖 | spec 2.1/2.2 | ✅ |
| `TC_SET_02` | `FEAT_SET_MIC_STATUS`, `FEAT_SET_PRIVACY_CARD` | Mic-/privacystatus correct getoond | 🤖 | spec 2.3 | ✅ |
| `TC_SET_03` | `FEAT_SET_RESET_OPEN/CONFIRM/CANCEL` | Reset-dialoog: annuleren behoudt, bevestigen wist | 🤖 | spec 2.4 | ✅ |
| `TC_SET_04` | `FEAT_SET_BACK` | Terug behoudt gewijzigde instellingen | 🤖 | spec 2.5 | ✅ |
| `TC_SET_05` | `T-11` | Reset wist **alle** sleutels **én** IndexedDB-observaties | 🤖 | nieuw | ⚪ |
| `TC_SET_06` | `FEAT_SET_MOTION` / `T-14` | `reducedMotion` dempt zware animaties | 👤/🤖 | nieuw | ⚪ |
| `TC_SET_07` | `FEAT_SET_DEVTOOLS_TOGGLE` / `T-20` | Dev-toggle **niet** zichtbaar in productie | 🤖 | nieuw | 🔴 |

---

## 4. Zeg & Zet (`SCR_MSA_SCENE_BUILDER`, `JRN_ZEGZET`)

| TC-ID | Dekt | Verwacht resultaat | Type | Bestaande test | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `TC_SCENE_01` | `FEAT_SCENE_RENDER`, `JRN_ZEGZET_02` | Speelveld, instructie en objectbalk verschijnen | 🤖 | spec 3.1 | ✅ |
| `TC_SCENE_02` | `FEAT_SCENE_KB_*`, `FEAT_SCENE_PARSE` | Typen + bevestigen plaatst het object | 🤖 | spec 3.2 | ✅ |
| `TC_SCENE_03` | `FEAT_SCENE_MIC/WAVE/STOP` | Mic activeert, waveform op hoge positie, Klaar-knop | 🤖 | spec 3.3 | 🟡 (mock) |
| `TC_SCENE_04` | `FEAT_SCENE_CAROUSEL`, `FEAT_SCENE_TAP_PLACE` | Sticker selecteren + tikken plaatst object | 🤖 | spec 3.4 | ✅ |
| `TC_SCENE_05` | `FEAT_SCENE_FEEDBACK_ALMOST`, `FEAT_SCENE_HINT` | Fout/geen plaatsing → herstelbare feedback + hint | 🤖 | spec 3.5 | ✅ |
| `TC_SCENE_06` | `FEAT_SCENE_FEEDBACK_OK`, `FEAT_SCENE_CONFIRM` | Goed antwoord → succes + "Volgende" | 🤖 | spec 3.6 | ✅ |
| `TC_SCENE_07` | `FEAT_SCENE_VIDEO` / `T-19` | Instructievideo speelt af (of nette fallback zonder foutmelding) | 🤖 | nieuw | 🔴 |
| `TC_SCENE_08` | `FEAT_SCENE_SUMMARY` / `T-03` | Aan einde ronde verschijnt een ronde-eindscherm | 🤖 | nieuw | 🔴 |
| `TC_SCENE_09` | `FEAT_SCENE_DRAG_PLACE` | Drag-and-drop naar zone plaatst object | 🤖 | nieuw | ⚪ |
| `TC_SCENE_10` | `FEAT_SCENE_MIC`, echte spraak | Ingesproken commando plaatst juiste object | 👤 | nieuw | 👤 |

---

## 5. Kies het Woord (`SCR_MSA_WORD_CHOICE`, `JRN_KIESWOORD`) — ⚠️ geen bestaande tests

| TC-ID | Dekt | Verwacht resultaat | Type | Bestaande test | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `TC_WORD_01` | `FEAT_WORD_RENDER/QUESTION/OPTIONS` | Quiz opent met vraag + 2–4 keuzekaarten | 🤖 | nieuw | ⚪ |
| `TC_WORD_02` | `FEAT_WORD_CORRECT` | Goed antwoord → groene rand, bonus zonder hint, nazegzin | 🤖 | nieuw | ⚪ |
| `TC_WORD_03` | `FEAT_WORD_WRONG` | Fout antwoord → tip, geen straf, opnieuw mogelijk | 🤖 | nieuw | ⚪ |
| `TC_WORD_04` | `FEAT_WORD_HINT` | Hint toont tekst + laat juiste kaart oplichten | 🤖 | nieuw | ⚪ |
| `TC_WORD_05` | `FEAT_WORD_PROGRESS` | Voortgang loopt 1/12 → 12/12 | 🤖 | nieuw | ⚪ |
| `TC_WORD_06` | `FEAT_WORD_SUMMARY` | Na 12 vragen: in-game eindscherm met stats | 🤖 | nieuw | ⚪ |
| `TC_WORD_07` | `FEAT_WORD_SUMMARY_REPLAY/MENU` | Opnieuw/Menu werken | 🤖 | nieuw | ⚪ |
| `TC_WORD_08` | `T-23` | Kaarten flitsen **niet** leeg bij doorschakelen | 🤖 | nieuw | 🔴 |

---

## 6. Zeg & Vlieg (`SCR_MSA_VOICE_SCROLLER`, `JRN_ZEGVLIEG`) — ⚠️ geen bestaande tests

| TC-ID | Dekt | Verwacht resultaat | Type | Bestaande test | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `TC_FLY_01` | `FEAT_FLY_START_OVERLAY` | Start-overlay met doelwoorden + privacy | 🤖 | nieuw | ⚪ |
| `TC_FLY_02` | `FEAT_FLY_PLAYER`, `FEAT_FLY_HUD` | Na Start: held vliegt, afstand loopt op | 🤖 | nieuw | ⚪ |
| `TC_FLY_03` | `FEAT_FLY_THUMBRAIL` | Duim-rail verandert vlieghoogte | 🤖 | nieuw | ⚪ |
| `TC_FLY_04` | `FEAT_FLY_OBSTACLES` | Botsing geeft het verwachte gevolg (slowdown/game-over) | 🤖 | nieuw | ⚪ |
| `TC_FLY_05` | `FEAT_FLY_SUMMARY/SUMMARY_WORLD` | Ronde-einde toont stats + Opnieuw/Wereld | 🤖 | nieuw | ⚪ |
| `TC_FLY_06` | `FEAT_FLY_VOICE`, echte spraak | Object benoemen verzamelt het + kent punten toe | 👤 | nieuw | 👤 |

---

## 7. Beloning (`SCR_MSA_REWARD`, `JRN_REWARD`) — ⚠️ geen bestaande tests

| TC-ID | Dekt | Verwacht resultaat | Type | Bestaande test | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `TC_REWARD_01` | `FEAT_REWARD_RENDER/FEATURED/STARS/UNLOCKS` | Beloningsscherm toont unlocks + stats | 🤖 | nieuw | ⚪ |
| `TC_REWARD_02` | `FEAT_REWARD_REPLAY/WORLD` | Opnieuw/Wereld navigeren correct | 🤖 | nieuw | ⚪ |
| `TC_REWARD_03` | `T-01` / `GAP-01` | Beloningen ontgrendelen **geleidelijk** volgens de curve (niet alles bij 1e actie) | 🤖 | nieuw | 🔴 |

---

## 8. Transversaal: toegankelijkheid, spraaklogica, PWA

| TC-ID | Dekt | Verwacht resultaat | Type | Bestaande test | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `TC_A11Y_01` | `FEAT_X_A11Y` | axe-audit kernschermen zonder overtredingen | ♿ | `accessibility.spec.ts` | ✅ |
| `TC_A11Y_02` | `JRN_MIC_FALLBACK` | Kernopdracht lukt met **geweigerde mic** via toetsenbord | ♿🤖 | `accessibility.spec.ts` | ✅ |
| `TC_A11Y_03` | `T-13` | Alle interactieve elementen ≥ 48×48 + `focus-visible` in alle 3 modi | ♿ | nieuw (uitbreiden) | ⚪ |
| `TC_PARSE_01` | `FEAT_SCENE_PARSE` | Parser levert juiste object/relatie/zone + confidence | 🧪 | `spoken-command-parser.test.ts` | ✅ |
| `TC_REWARD_UNIT_01` | `T-01` | `resolveNewRewardUnlocks` volgt de nieuwe curve | 🧪 | `rewards-and-progress.test.ts` (aanpassen) | ⚪ |
| `TC_PWA_01` | `FEAT_X_OFFLINE` | Offline download → wereld offline speelbaar | 🤖 | `pwa-offline.spec.ts` | ✅ |
| `TC_PWA_02` | opslagherstel | Herstelt bij ontbrekende duurzame opslag (tijdelijke modus) | 🤖 | `pwa-offline.spec.ts` | ✅ |
| `TC_PRIV_01` | `T-12` / `GAP-10` | Data van profiel A lekt niet naar profiel B | 🤖 | nieuw | ⚪ |

---

## 9. Prioritaire toevoegingen (test-gaten)

Op volgorde van waarde:

1. **Regressietests bij de P1-fixes** — schrijf de test *tegelijk* met de fix, zodat het gedrag geborgd blijft:
   - `TC_REWARD_03` + `TC_REWARD_UNIT_01` bij `T-01` (één beloningssysteem, geleidelijke curve).
   - `TC_SCENE_08` bij `T-03` (ronde-eindscherm Zeg & Zet).
   - `TC_SCENE_07` bij `T-19` (instructievideo).
   - `TC_ONB_03` bij `T-21` (0 sterren bij nieuw profiel).
2. **Nieuwe modul-suites** voor de ongedekte modi:
   - `e2e/word-choice.spec.ts` (`TC_WORD_01..08`).
   - `e2e/voice-side-scroller.spec.ts` (`TC_FLY_01..05`).
   - `e2e/reward.spec.ts` (`TC_REWARD_01..02`).
3. **Verificatie-P2's** — `TC_SET_05` (reset volledig), `TC_PRIV_01` (profielscheiding), `TC_A11Y_03` (48×48/focus), `TC_SET_06` (reducedMotion).
4. **Handmatige apparaattests** (mic/audio) — `TC_SCENE_10`, `TC_FLY_06`: draaien op een echte tablet/telefoon; niet automatiseerbaar in CI.

> Deze toevoegingen bundelen we in taak **`T-24`** (nieuwe e2e-suites voor Kies het Woord, Zeg & Vlieg en Beloning) — toegevoegd aan GDD-index sectie 12.

---

## 10. Statusoverzicht

| Status | Aantal |
| :--- | :--: |
| ✅ Groen (gedekt & werkt) | 18 |
| 🔴 Rood (test faalt / gedrag kapot) | 5 |
| 🟡 Deels (bv. gemockt) | 1 |
| ⚪ Nog niet gedekt | 15 |
| 👤 Alleen handmatig (apparaat) | 2 |
| **Totaal** | **41** |

**De 5 rode testcases** (`TC_ONB_03`, `TC_SET_07`, `TC_SCENE_07`, `TC_SCENE_08`, `TC_WORD_08`, `TC_REWARD_03`) corresponderen 1-op-1 met de bevestigde defecten en zijn de scherpste graadmeter: zodra de bijbehorende taak (`T-19`, `T-20`, `T-03`, `T-21`, `T-23`, `T-01`) klaar is, moet de test groen worden.

> Dit sluit het GDD-dossier: **GDD-index → Feature-catalogus → User Journey Map → Test-matrix** vormen samen één traceerbare keten van *bedoeling → functie → reis → test → status*.
