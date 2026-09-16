# 🗺️ User Journey Map — Magisch Strand-Avontuur

> Document 3 van 4 in het GDD-dossier. Rijgt de schermen uit sectie 3 van de [GDD-index](GDD-index.md) en de features uit de [Feature-catalogus](Feature-catalogus.md) aaneen tot **concrete gebruikersreizen**. Elke reis is een keten van stappen (`JRN_*`) met doel, actie, verwacht resultaat, betrokken features en een status uit de live verificatie (2026-09-11).

---

## 0. Leeswijzer

### 0.1 Metadata

| Veld | Waarde |
| :--- | :--- |
| **Documenttitel** | User Journey Map — Magisch Strand-Avontuur |
| **Documentversie** | `0.3` (bijgewerkt na afronding `T-01` t/m `T-37`, incl. 4e modus Zeg & Bouw) |
| **Laatst bijgewerkt** | 2026-09-16 |
| **Status** | 🟢 Bijgewerkt — alle happy-paths werken; alleen mic-/apparaatstappen resteren (`T-10`/`T-18`) |
| **Bron** | [GDD-index](GDD-index.md) (schermen) + [Feature-catalogus](Feature-catalogus.md) (features) + verificatieronde |

### 0.2 Hoe lees je een reis

- **Reis-ID** `JRN_<REIS>` — bv. `JRN_ONBOARD`. Elke reis heeft genummerde **stappen** `JRN_<REIS>_<NN>`.
- Elke stap koppelt aan een **scherm** (`SCR_*`) en de **features** (`FEAT_*`) die de gebruiker daar raakt.
- **Status** volgt de legenda uit de Feature-catalogus: 🟢 werkt · 🟡 deels · 🔴 kapot · ⚪ niet getest · 🔵 gepland · ⚫ dood.
- **Personas** (uit GDD-index 2.2): `PERS_KLEUTER`, `PERS_TOS`, `PERS_NT2`, `PERS_BEGELEIDER`.

### 0.3 Overzicht van de reizen

| Reis-ID | Naam | Persona('s) | Trigger | Status |
| :--- | :--- | :--- | :--- | :--: |
| `JRN_ONBOARD` | Eerste keer opstarten tot spelklaar | alle kinderen + `PERS_BEGELEIDER` | App voor het eerst openen | 🟢 |
| `JRN_RETURN` | Terugkerend kind pakt de draad op | alle kinderen | App opnieuw openen | ⚪ |
| `JRN_ZEGZET` | Een ronde Zeg & Zet spelen | `PERS_TOS`, `PERS_NT2` | Modus Zeg & Zet kiezen | 🟢 |
| `JRN_KIESWOORD` | Een ronde Kies het Woord spelen | `PERS_KLEUTER`, `PERS_NT2` | Modus Kies het Woord kiezen | 🟢 |
| `JRN_ZEGVLIEG` | Een ronde Zeg & Vlieg spelen | `PERS_TOS` (productief) | Modus Zeg & Vlieg kiezen | 🟢 (mic-stap ⚪) |
| `JRN_ZEGBOUW` | Een ronde Zeg & Bouw spelen | `PERS_TOS`, `PERS_NT2` | Modus Zeg & Bouw kiezen | 🟢 (mic-stap ⚪) |
| `JRN_SETTINGS` | Instellingen aanpassen / voortgang resetten | `PERS_BEGELEIDER` | Instellingen openen | 🟢 |
| `JRN_REWARD` | Beloningen bekijken | alle kinderen | Beloning openen | 🟢 |
| `JRN_MIC_FALLBACK` | Spraak lukt niet → toetsenbord (zijpad) | alle kinderen | Mic geweigerd/onbeschikbaar | 🟡 |

---

## 1. `JRN_ONBOARD` — Eerste keer opstarten tot spelklaar

**Doel:** een nieuw kind komt van "app openen" tot "in de game, klaar om te spelen".
**Voorwaarden:** geen profiel aanwezig. **Uitkomst:** kind staat op het startscherm van de game.

| Stap-ID | Scherm | Actie van de gebruiker | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_ONBOARD_01` | `SCR_PLAT_WELCOME` | Tikt op **START** | Naar profielkeuze | `FEAT_PLAT_WELCOME` | 🟢 |
| `JRN_ONBOARD_02` | `SCR_PLAT_PROFILE_SELECT` | Tikt op **Nieuw speler** | Naar avatarkeuze | `FEAT_PLAT_PROFILE_CREATE` | 🟢 |
| `JRN_ONBOARD_03` | `SCR_PLAT_AVATAR_SELECT` | Kiest een avatar | Avatar geselecteerd, naar naamstap | `FEAT_PLAT_AVATAR_PICK` | 🟢 |
| `JRN_ONBOARD_04` | `SCR_PLAT_AVATAR_SELECT` | Typt naam, tikt **LET'S GO!** | Profiel aangemaakt, naar home | `FEAT_PLAT_NAME_CONFIRM` | 🟢 |
| `JRN_ONBOARD_05` | `SCR_PLAT_HOME` | Kiest thema **Speciale Woordenschat** | Naar gamelijst van dat thema | `FEAT_PLAT_THEME_PICK` | 🟢 |
| `JRN_ONBOARD_06` | `SCR_PLAT_GAMES_LIST` | Tikt op **Magisch Strand-Avontuur** | Game laadt (host) | `FEAT_PLAT_GAME_PICK`, `FEAT_PLAT_GAME_HOST` | 🟢 |
| `JRN_ONBOARD_07` | `SCR_MSA_START` | Ziet titelscherm | Startscherm met **Spelen**, sterrenteller, instellingen | `FEAT_START_RENDER` | 🟢 |

**Bevinding:** volledige onboarding werkt (live doorlopen). ✅ Het eerdere probleem (sterrenteller toonde 120 ⭐ bij een nieuw profiel) is opgelost via `T-21`: sterren zijn per-profiel en een nieuw profiel start op 0 ⭐.

**Ondersteuning per persona:** de flow is puur tap-gebaseerd (geen lezen vereist voor `PERS_KLEUTER`); een `PERS_BEGELEIDER` doet doorgaans stap 02–04 samen met het kind.

---

## 2. `JRN_RETURN` — Terugkerend kind pakt de draad op

**Doel:** een kind met een bestaand profiel start opnieuw en gaat verder.
**Voorwaarden:** minstens één profiel bestaat (opgeslagen in de browser).

| Stap-ID | Scherm | Actie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_RETURN_01` | `SCR_PLAT_WELCOME` | Tikt **START** | Naar profielkeuze | `FEAT_PLAT_WELCOME` | 🟢 |
| `JRN_RETURN_02` | `SCR_PLAT_PROFILE_SELECT` | Kiest **bestaand** profiel | Behoudt sterren/voortgang, naar home | `FEAT_PLAT_PROFILE_PICK` | ⚪ |
| `JRN_RETURN_03` | `SCR_PLAT_HOME` → game | Zoals `JRN_ONBOARD_05..07` | Terug in de game | — | ⚪ |

**Te verifiëren:** dat het kiezen van een bestaand profiel de eerder opgeslagen sterren/unlocks/instellingen correct terugzet (raakt `T-21`, `GAP-10`).

---

## 3. `JRN_ZEGZET` — Een ronde Zeg & Zet spelen

**Doel:** het kind voert luister-/plaatsingsopdrachten uit (zinsbegrip + ruimtelijke taal).
**Kernpersona:** `PERS_TOS`, `PERS_NT2`.

| Stap-ID | Scherm | Actie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_ZEGZET_01` | `SCR_MSA_START` | Tikt **Spelen** | Naar avontuur kiezen | `FEAT_START_PLAY` | 🟢 |
| `JRN_ZEGZET_02` | `SCR_MSA_MODE_SELECT` | Kiest **Zeg & Zet**, tikt **Start Spel** | Scene Builder opent met opdracht | `FEAT_MODE_CARD_ZEGZET`, `FEAT_MODE_START` | 🟢 |
| `JRN_ZEGZET_03` | `SCR_MSA_SCENE_BUILDER` | Hoort/leest de opdracht | Opdracht zichtbaar (bv. "Zet de vuurtoren op het eiland") | `FEAT_SCENE_INSTRUCTION`, `FEAT_SCENE_AUDIO` | 🟢 / ⚪ |
| `JRN_ZEGZET_04a` | idem | **Tap:** kiest object → tikt op de plek | Object geplaatst in zone | `FEAT_SCENE_CAROUSEL`, `FEAT_SCENE_TAP_PLACE` | 🟢 |
| `JRN_ZEGZET_04b` | idem | **Stem:** spreekt commando in | Object geplaatst via parser | `FEAT_SCENE_MIC`, `FEAT_SCENE_PARSE` | ⚪ (mic) |
| `JRN_ZEGZET_04c` | idem | **Toetsenbord:** typt de zin, **Gebruik zin** | Object geplaatst via parser | `FEAT_SCENE_KB_*`, `FEAT_SCENE_PARSE` | 🟢 |
| `JRN_ZEGZET_05` | idem | Tikt **Klaar** | Succesfeedback + "+1 Tempo!" + sterren | `FEAT_SCENE_FEEDBACK_OK`, `FEAT_SCENE_CONFIRM` | 🟢 |
| `JRN_ZEGZET_06` | idem | Tikt **Volgende** | Volgende opdracht verschijnt | `FEAT_SCENE_CONFIRM` | 🟢 |
| `JRN_ZEGZET_07` | idem | Herhaalt tot ronde klaar | **Ronde-eindscherm** met samenvatting | `FEAT_SCENE_SUMMARY` | 🟢 |
| `JRN_ZEGZET_08` | `SCR_MSA_REWARD` | Ziet beloning | Beloningsoverzicht | `FEAT_REWARD_*` | 🟢 |

**Zijpaden:**
- **Twijfel/fout:** kind tikt **Hint** → doelzone/plaatje licht op (`FEAT_SCENE_HINT` 🟢). Foute plaatsing → herstelbare feedback, geen straf (`FEAT_SCENE_FEEDBACK_ALMOST` 🟢).
- **Video-instructie:** kind tikt de video-knop → ✅ speelt af / nette fallback (`FEAT_SCENE_VIDEO`, `T-19` opgelost).

**Eerder knelpunt (opgelost):** `JRN_ZEGZET_07` had **geen ronde-eindscherm** (`GAP-15`); via `T-03` verschijnt nu een `SceneBuilderRoundSummary` aan het einde van de ronde.

---

## 4. `JRN_KIESWOORD` — Een ronde Kies het Woord spelen

**Doel:** het kind herkent het juiste woord tussen afleiders (receptieve woordenschat).
**Kernpersona:** `PERS_KLEUTER`, `PERS_NT2`.

| Stap-ID | Scherm | Actie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_KIESWOORD_01` | `SCR_MSA_MODE_SELECT` | Kiest **Kies het Woord**, **Start Spel** | Quiz opent (vraag 1/12) | `FEAT_MODE_CARD_KIESWOORD` | 🟢 |
| `JRN_KIESWOORD_02` | `SCR_MSA_WORD_CHOICE` | Hoort/leest de vraag | Vraag + 2–4 keuzekaarten | `FEAT_WORD_QUESTION`, `FEAT_WORD_OPTIONS` | 🟢 |
| `JRN_KIESWOORD_03` | idem | Tikt de juiste kaart | Groene rand + "Bonus zonder hint" + nazegzin | `FEAT_WORD_CORRECT` | 🟢 |
| `JRN_KIESWOORD_04` | idem | Tikt **Volgende** | Volgende vraag; voortgangsbalk +1 | `FEAT_WORD_NEXT`, `FEAT_WORD_PROGRESS` | 🟢 |
| `JRN_KIESWOORD_05` | idem | Herhaalt t/m vraag 12 | **In-game eindscherm** (sterren/tempo/goed) | `FEAT_WORD_SUMMARY` | 🟢 |
| `JRN_KIESWOORD_06` | eindscherm | Tikt **Opnieuw** of **Menu** | Herstart óf terug naar moduskeuze | `FEAT_WORD_SUMMARY_REPLAY/MENU` | 🟢 |

**Zijpaden:**
- **Fout antwoord:** rode ✗ + vriendelijke tip, geen straf, kind mag opnieuw (`FEAT_WORD_WRONG` 🟢).
- **Hint:** hinttekst + de juiste kaart licht op (`FEAT_WORD_HINT` 🟢).
- **Video-opdracht:** de vraag wordt via de instructievideo aangeboden en kan herspeeld worden (de losse TTS-voorleesfunctie `FEAT_WORD_AUDIO` is verwijderd — `T-25`).

**Bevindingen:** ronde = **12 vragen** (live: "Voortgang 1/12"), volgorde gerandomiseerd. ✅ Kaart-flits opgelost via `T-23` (sticker-preload) + `T-33a` (WebP); eind-/replay-scherm gedekt in `word-choice.spec.ts` (`T-24`).

---

## 5. `JRN_ZEGVLIEG` — Een ronde Zeg & Vlieg spelen

**Doel:** het kind benoemt objecten hardop tijdens het vliegen (actieve woordproductie).

| Stap-ID | Scherm | Actie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_ZEGVLIEG_01` | `SCR_MSA_MODE_SELECT` | Kiest **Zeg & Vlieg**, **Start Spel** | Start-overlay met doelwoorden | `FEAT_MODE_CARD_ZEGVLIEG` | 🟢 |
| `JRN_ZEGVLIEG_02` | `SCR_MSA_VOICE_SCROLLER` | Tikt **Start** | Held vliegt, afstand loopt | `FEAT_FLY_START_OVERLAY`, `FEAT_FLY_PLAYER` | 🟢 |
| `JRN_ZEGVLIEG_03` | idem | Beweegt de **duim-rail** | Vlieghoogte verandert | `FEAT_FLY_THUMBRAIL` | 🟢 |
| `JRN_ZEGVLIEG_04` | idem | Ziet object → **spreekt de naam** | Object verzameld (+punten/tempo) | `FEAT_FLY_TARGETS`, `FEAT_FLY_VOICE` | ⚪ (mic) |
| `JRN_ZEGVLIEG_05` | idem | Ontwijkt obstakels | Botsing → vriendelijk gevolg (schild/slowdown), geen harde game-over | `FEAT_FLY_OBSTACLES` | 🟢 |
| `JRN_ZEGVLIEG_06` | `SCR_MSA_OV_ZEGVLIEG_SUMMARY` | Ronde eindigt | Samenvatting (meters/sterren/score, incl. record) | `FEAT_FLY_SUMMARY` | 🟢 |
| `JRN_ZEGVLIEG_07` | idem | Tikt **Opnieuw** of **Wereld** | Herstart óf terug naar moduskeuze | `FEAT_FLY_SUMMARY_WORLD` | 🟢 |

**Bevinding:** de kern-loop (vliegen, obstakels, ronde-einde) werkt en is gedekt in `voice-side-scroller.spec.ts` (`T-24`). ✅ De game-over-per-botsing is verzacht via `T-22`/`T-30` (schildjes/combo/record); GDD 4.4 genuanceerd. Het **benoemen** (`FEAT_FLY_VOICE`) vraagt een echte mic → `T-18`.

---

## 6. `JRN_ZEGBOUW` — Een ronde Zeg & Bouw spelen 🟢

**Doel:** het kind bouwt een strandscène met **samengestelde** opdrachten (één zin plaatst meerdere objecten) — zinsbegrip + actieve productie. Gebouwd in `T-04`.
**Kernpersona:** `PERS_TOS`, `PERS_NT2`.

| Stap-ID | Scherm | Actie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_ZEGBOUW_01` | `SCR_MSA_MODE_SELECT` | Kiest **Zeg & Bouw**, **Start Spel** | Bouwscherm opent | `FEAT_MODE_CARD_ZEGBOUW` | 🟢 |
| `JRN_ZEGBOUW_02` | `SCR_MSA_ZEG_BOUW` | Ziet kaart + objectbalk + zones | Bouwveld en opdracht zichtbaar | `FEAT_BOUW_RENDER` | 🟢 |
| `JRN_ZEGBOUW_03a` | idem | **Toetsenbord:** typt één zin met meerdere objecten | Objecten geplaatst via `parseCompoundPlacements` (+compound-bonus) | `FEAT_BOUW_PARSE_COMPOUND`, `FEAT_BOUW_PLACE`, `FEAT_BOUW_BONUS` | 🟢 |
| `JRN_ZEGBOUW_03b` | idem | **Stem:** spreekt de zin in | Live wave + transcript, objecten geplaatst | `FEAT_BOUW_WAVE`, `FEAT_BOUW_VOICE` | ⚪ (mic) |
| `JRN_ZEGBOUW_04` | idem | Rondt het strand af | "Strand af!"-overlay met korte vertraging (kind ziet scène eerst) | `FEAT_BOUW_OVERLAY` | 🟢 |
| `JRN_ZEGBOUW_05` | `ZegBouwRoundSummary` | Ronde eindigt | Samenvatting + Opnieuw/Menu | `FEAT_BOUW_SUMMARY` | 🟢 |
| `JRN_ZEGBOUW_06` | idem | Kiest **Vrij Bouwen** | Vrije-bouwmodus zonder vaste opdracht | `FEAT_BOUW_FREE` | 🟢 |

**Bevinding:** typ-route end-to-end geverifieerd en gedekt in `zeg-en-bouw.spec.ts` (`T-04d`); de gesproken samengestelde zin (`FEAT_BOUW_VOICE`) vraagt een echte mic → `T-18`.

---

## 7. `JRN_SETTINGS` — Instellingen aanpassen / voortgang resetten

**Doel:** een begeleider stelt audio/muziek/hints/beweging in, of reset de voortgang.
**Kernpersona:** `PERS_BEGELEIDER`.

| Stap-ID | Scherm | Actie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_SETTINGS_01` | `SCR_MSA_START` / `MODE_SELECT` | Tikt instellingen/opties | Instellingenscherm opent | `FEAT_START_SETTINGS` / `FEAT_MODE_SETTINGS` | 🟢 |
| `JRN_SETTINGS_02` | `SCR_MSA_SETTINGS` | Schakelt toggles | Instelling wijzigt en blijft behouden (incl. `reducedMotion` → gameplay) | `FEAT_SET_AUDIO/MUSIC/HINTS/MOTION` | 🟢 |
| `JRN_SETTINGS_03` | idem | Bekijkt microfoon/privacy | Correcte status ("Microfoon geblokkeerd") | `FEAT_SET_MIC_STATUS`, `FEAT_SET_PRIVACY_CARD` | 🟢 |
| `JRN_SETTINGS_04` | idem | Tikt **Reset voortgang** → **Resetten** | Bevestiging vereist, dan **alles** wissen (keys + IndexedDB + record) | `FEAT_SET_RESET_OPEN/CONFIRM` | 🟢 |
| `JRN_SETTINGS_05` | idem | Of tikt **Annuleren** | Dialoog sluit, geen dataverlies | `FEAT_SET_RESET_CANCEL` | 🟢 |
| `JRN_SETTINGS_06` | idem | Tikt **Terug** | Terug met behoud van instellingen | `FEAT_SET_BACK` | 🟢 |

**Bevindingen:** ✅ De dev-toggle is niet meer zichtbaar voor eindgebruikers (`T-20`). ✅ "Resetten" wist nu álles incl. het Zeg & Vlieg-record (`T-11`, unit-getest). Handmatig op apparaat te bevestigen: haal een record, reset, controleer dat het weg is (zie apparaattakenlijst).

---

## 8. `JRN_REWARD` — Beloningen bekijken

| Stap-ID | Scherm | Actie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_REWARD_01` | `SCR_MSA_MODE_SELECT` | Tikt **Beloning** | Beloningsscherm opent | `FEAT_MODE_REWARDS` | 🟢 |
| `JRN_REWARD_02` | `SCR_MSA_REWARD` | Bekijkt unlocks + stats | Uitgelichte beloning, sterren, samenvatting | `FEAT_REWARD_*` | 🟢 |
| `JRN_REWARD_03` | idem | Tikt **Opnieuw** / **Wereld** | Herstart óf terug naar moduskeuze | `FEAT_REWARD_REPLAY/WORLD` | 🟢 |

**Bevinding:** ✅ scherm werkt en is gedekt in `reward.spec.ts` (`T-24`). Het beloningssysteem is geconsolideerd tot één "Strandschat"-curve (`T-01`) met afgestemde drempels (`T-02`). Let op: vanuit het menu geopend toont het scherm géén "Opnieuw" (menu-only), elke modus heeft zijn eigen ronde-eindscherm.

---

## 9. `JRN_MIC_FALLBACK` — Spraak lukt niet → toetsenbord (zijpad)

**Doel:** borgen dat een kind zonder werkende microfoon tóch de opdracht kan doen (toegankelijkheid).

| Stap-ID | Scherm | Situatie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_MIC_FALLBACK_01` | `SCR_MSA_SCENE_BUILDER` | Tikt mic; toestemming geweigerd/onbeschikbaar | Vriendelijke melding, geen doodlopende staat | `FEAT_SCENE_MIC_MSG` | ⚪ |
| `JRN_MIC_FALLBACK_02` | idem | Privacy-notice wijst op alternatief | "Werkt spraak niet? Typ dezelfde zin." | `FEAT_SCENE_PRIVACY`, `FEAT_SCENE_PRIVACY_FALLBACK` | 🟢 |
| `JRN_MIC_FALLBACK_03` | idem | Opent toetsenbord en typt de zin | Opdracht wordt via parser uitgevoerd | `FEAT_SCENE_KB_*`, `FEAT_SCENE_PARSE` | 🟢 |

**Bevinding:** het fallback-pad werkt (privacy-notice → toetsenbord → parser, live bevestigd). De exacte melding bij een geweigerde mic (`JRN_MIC_FALLBACK_01`) is nog te testen op een apparaat met mic (`T-18`).

---

## 10. Reis-statusoverzicht & knelpunten

| Reis | Happy-path status | Resterend |
| :--- | :--: | :--- |
| `JRN_ONBOARD` | 🟢 | — (`T-21` opgelost) |
| `JRN_RETURN` | ⚪ | Profiel-persistentie nog geen eigen automatische test (`TC_ONB_02`) |
| `JRN_ZEGZET` | 🟢 | Mic-stap `04b` op apparaat (`T-18`); overige opgelost (`T-03`, `T-19`) |
| `JRN_KIESWOORD` | 🟢 | — (`T-23` opgelost, eind-/replay gedekt) |
| `JRN_ZEGVLIEG` | 🟢 | Benoemen (`04`) vraagt echte mic (`T-18`); `T-22` opgelost |
| `JRN_ZEGBOUW` | 🟢 | Gesproken zin (`03b`) op apparaat (`T-18`); typ-route gedekt |
| `JRN_SETTINGS` | 🟢 | Reset-volledigheid handmatig op apparaat bevestigen (`T-11` unit-getest) |
| `JRN_REWARD` | 🟢 | — (`T-01`/`T-02` afgerond) |
| `JRN_MIC_FALLBACK` | 🟢 | Mic-weigering-melding op apparaat (`T-18`) |

Deze reizen zijn de directe invoer voor de **Test-matrix** (document 4): elke `JRN_*`-stap wordt één of meer testcases (`TC_*`).

> Alle knelpunten uit de verificatieronde van 2026-09-11 zijn opgelost; wat resteert zijn **mic-/apparaatstappen** (`T-10`/`T-18`) en twee kleine automatiseringsgaten (`TC_ONB_02`, `TC_SCENE_09`).
