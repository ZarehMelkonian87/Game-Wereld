# 🗺️ User Journey Map — Magisch Strand-Avontuur

> Document 3 van 4 in het GDD-dossier. Rijgt de schermen uit sectie 3 van de [GDD-index](GDD-index.md) en de features uit de [Feature-catalogus](Feature-catalogus.md) aaneen tot **concrete gebruikersreizen**. Elke reis is een keten van stappen (`JRN_*`) met doel, actie, verwacht resultaat, betrokken features en een status uit de live verificatie (2026-09-11).

---

## 0. Leeswijzer

### 0.1 Metadata

| Veld | Waarde |
| :--- | :--- |
| **Documenttitel** | User Journey Map — Magisch Strand-Avontuur |
| **Documentversie** | `0.1` |
| **Laatst bijgewerkt** | 2026-09-11 |
| **Status** | 🟡 Concept — happy-paths live geverifieerd, zijpaden deels |
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
| `JRN_ZEGZET` | Een ronde Zeg & Zet spelen | `PERS_TOS`, `PERS_NT2` | Modus Zeg & Zet kiezen | 🟡 |
| `JRN_KIESWOORD` | Een ronde Kies het Woord spelen | `PERS_KLEUTER`, `PERS_NT2` | Modus Kies het Woord kiezen | 🟡 |
| `JRN_ZEGVLIEG` | Een ronde Zeg & Vlieg spelen | `PERS_TOS` (productief) | Modus Zeg & Vlieg kiezen | 🟡 |
| `JRN_ZEGBOUW` | Een ronde Zeg & Bouw spelen | n.t.b. | Modus Zeg & Bouw kiezen | 🔵 |
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

**Bevinding:** volledige onboarding werkt (live doorlopen). ⚠️ Op `JRN_ONBOARD_07` toont de sterrenteller **120 ⭐** voor een net aangemaakt profiel — zie `T-21` (sterren mogelijk niet per-profiel).

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
| `JRN_ZEGZET_07` | idem | Herhaalt tot ronde klaar | **Ronde-eindscherm** met samenvatting | `FEAT_SCENE_SUMMARY` | 🔴 |
| `JRN_ZEGZET_08` | `SCR_MSA_REWARD` | Ziet beloning | Beloningsoverzicht | `FEAT_REWARD_*` | 🟢 |

**Zijpaden:**
- **Twijfel/fout:** kind tikt **Hint** → doelzone/plaatje licht op (`FEAT_SCENE_HINT` 🟢). Foute plaatsing → herstelbare feedback, geen straf (`FEAT_SCENE_FEEDBACK_ALMOST` ⚪, nog te testen).
- **Video-instructie:** kind tikt de video-knop → 🔴 **speelt niet af** (`FEAT_SCENE_VIDEO`, `T-19`).

**Belangrijkste knelpunt in deze reis:** `JRN_ZEGZET_07` — er is **geen ronde-eindscherm**; de modus gaat opdracht-na-opdracht door (`GAP-15`, `T-03`). Daardoor voelt "een ronde afronden" onaf.

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
| `JRN_KIESWOORD_05` | idem | Herhaalt t/m vraag 12 | **In-game eindscherm** (sterren/tempo/goed) | `FEAT_WORD_SUMMARY` | ⚪ |
| `JRN_KIESWOORD_06` | eindscherm | Tikt **Opnieuw** of **Menu** | Herstart óf terug naar moduskeuze | `FEAT_WORD_SUMMARY_REPLAY/MENU` | ⚪ |

**Zijpaden:**
- **Fout antwoord:** rode ✗ + vriendelijke tip, geen straf, kind mag opnieuw (`FEAT_WORD_WRONG` 🟢).
- **Hint:** hinttekst + de juiste kaart licht op (`FEAT_WORD_HINT` 🟢).
- **Audio herhalen:** onbeperkt (`FEAT_WORD_AUDIO` ⚪, geluid niet hoorbaar getest).

**Bevindingen:** ronde = **12 vragen** (live: "Voortgang 1/12"), volgorde gerandomiseerd. Kaarten flitsen kort leeg bij doorschakelen (`T-23`).

---

## 5. `JRN_ZEGVLIEG` — Een ronde Zeg & Vlieg spelen

**Doel:** het kind benoemt objecten hardop tijdens het vliegen (actieve woordproductie).

| Stap-ID | Scherm | Actie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_ZEGVLIEG_01` | `SCR_MSA_MODE_SELECT` | Kiest **Zeg & Vlieg**, **Start Spel** | Start-overlay met doelwoorden | `FEAT_MODE_CARD_ZEGVLIEG` | 🟢 |
| `JRN_ZEGVLIEG_02` | `SCR_MSA_VOICE_SCROLLER` | Tikt **Start** | Held vliegt, afstand loopt | `FEAT_FLY_START_OVERLAY`, `FEAT_FLY_PLAYER` | 🟢 |
| `JRN_ZEGVLIEG_03` | idem | Beweegt de **duim-rail** | Vlieghoogte verandert | `FEAT_FLY_THUMBRAIL` | 🟢 |
| `JRN_ZEGVLIEG_04` | idem | Ziet object → **spreekt de naam** | Object verzameld (+punten/tempo) | `FEAT_FLY_TARGETS`, `FEAT_FLY_VOICE` | ⚪ (mic) |
| `JRN_ZEGVLIEG_05` | idem | Ontwijkt obstakels | Botsing → snelheidsverlies / game-over | `FEAT_FLY_OBSTACLES` | 🟢 |
| `JRN_ZEGVLIEG_06` | `SCR_MSA_OV_ZEGVLIEG_SUMMARY` | Ronde eindigt | Samenvatting (meters/sterren/score) | `FEAT_FLY_SUMMARY` | 🟢 |
| `JRN_ZEGVLIEG_07` | idem | Tikt **Opnieuw** of **Wereld** | Herstart óf terug naar moduskeuze | `FEAT_FLY_SUMMARY_WORLD` | 🟢 |

**Bevinding:** een botsing leidde live tot **"Game over — Je raakte een obstakel"**. De kern-loop (vliegen, obstakels, ronde-einde) werkt; het **benoemen** (`FEAT_FLY_VOICE`) vraagt een echte mic. Doc-nuance → `T-22`.

---

## 6. `JRN_ZEGBOUW` — Een ronde Zeg & Bouw spelen 🔵

**Status:** gepland. Modus en scherm (`SCR_MSA_ZEG_BOUW`) bestaan nog niet; mechanica is nog te ontwerpen (`T-04`). De reis wordt uitgewerkt zodra het ontwerp er is.

---

## 7. `JRN_SETTINGS` — Instellingen aanpassen / voortgang resetten

**Doel:** een begeleider stelt audio/muziek/hints/beweging in, of reset de voortgang.
**Kernpersona:** `PERS_BEGELEIDER`.

| Stap-ID | Scherm | Actie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_SETTINGS_01` | `SCR_MSA_START` / `MODE_SELECT` | Tikt instellingen/opties | Instellingenscherm opent | `FEAT_START_SETTINGS` / `FEAT_MODE_SETTINGS` | 🟢 |
| `JRN_SETTINGS_02` | `SCR_MSA_SETTINGS` | Schakelt toggles | Instelling wijzigt en blijft behouden | `FEAT_SET_AUDIO/MUSIC/HINTS/MOTION` | ⚪ |
| `JRN_SETTINGS_03` | idem | Bekijkt microfoon/privacy | Correcte status ("Microfoon geblokkeerd") | `FEAT_SET_MIC_STATUS`, `FEAT_SET_PRIVACY_CARD` | 🟢 |
| `JRN_SETTINGS_04` | idem | Tikt **Reset voortgang** → **Resetten** | Bevestiging vereist, dan wissen | `FEAT_SET_RESET_OPEN/CONFIRM` | 🟢 / ⚪ |
| `JRN_SETTINGS_05` | idem | Of tikt **Annuleren** | Dialoog sluit, geen dataverlies | `FEAT_SET_RESET_CANCEL` | 🟢 |
| `JRN_SETTINGS_06` | idem | Tikt **Terug** | Terug met behoud van instellingen | `FEAT_SET_BACK` | ⚪ |

**Bevindingen:** dialoog en annuleren werken. ⚠️ De toggle **"Zone Editor (DevTools)"** is hier zichtbaar voor eindgebruikers (`T-20`). Of "Resetten" écht álles wist (incl. IndexedDB) → `T-11`.

---

## 8. `JRN_REWARD` — Beloningen bekijken

| Stap-ID | Scherm | Actie | Verwacht resultaat | Features | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `JRN_REWARD_01` | `SCR_MSA_MODE_SELECT` | Tikt **Beloning** | Beloningsscherm opent | `FEAT_MODE_REWARDS` | 🟢 |
| `JRN_REWARD_02` | `SCR_MSA_REWARD` | Bekijkt unlocks + stats | Uitgelichte beloning, sterren, samenvatting | `FEAT_REWARD_*` | 🟢 |
| `JRN_REWARD_03` | idem | Tikt **Opnieuw** / **Wereld** | Herstart óf terug naar moduskeuze | `FEAT_REWARD_REPLAY/WORLD` | 🟢 |

**Bevinding:** scherm werkt. Inhoud hangt aan het beloningssysteem dat nog geconsolideerd wordt (`T-01`).

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

| Reis | Happy-path status | Grootste knelpunt |
| :--- | :--: | :--- |
| `JRN_ONBOARD` | 🟢 | Sterren tonen 120 bij nieuw profiel (`T-21`) |
| `JRN_RETURN` | ⚪ | Nog te verifiëren (profiel-persistentie) |
| `JRN_ZEGZET` | 🟡 | **Geen ronde-eindscherm** (`T-03`); video kapot (`T-19`) |
| `JRN_KIESWOORD` | 🟡 | Eindscherm niet uitgespeeld; kaart-flits (`T-23`) |
| `JRN_ZEGVLIEG` | 🟡 | Benoemen vraagt echte mic (`T-18`) |
| `JRN_ZEGBOUW` | 🔵 | Bestaat nog niet (`T-04`) |
| `JRN_SETTINGS` | 🟢 | Dev-toggle zichtbaar (`T-20`); reset-volledigheid (`T-11`) |
| `JRN_REWARD` | 🟢 | Beloningsinhoud (`T-01`) |
| `JRN_MIC_FALLBACK` | 🟡 | Mic-weigering-melding nog te testen (`T-18`) |

Deze reizen zijn de directe invoer voor de **Test-matrix** (document 4): elke `JRN_*`-stap wordt één of meer testcases (`TC_*`).

> Geen nieuwe taken uit deze map bovenop de bestaande `T-01`–`T-23`; alle knelpunten verwijzen naar bestaande taken.
