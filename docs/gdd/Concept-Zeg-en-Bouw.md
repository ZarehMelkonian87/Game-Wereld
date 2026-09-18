# 🧱 Conceptvoorstel — Modus "Zeg & Bouw"

> **Startpunt ter bespreking** (jij zou het idee aanleveren; dit is mijn voorstel om op te reageren). Beschrijft de volledige bedoelde gameplay + user journey van de geplande 4e modus `MODE_ZEG_BOUW` / scherm `SCR_MSA_ZEG_BOUW`, vóórdat er code komt. Sluit aan op de [GDD-index](GDD-index.md), [Feature-catalogus](Feature-catalogus.md) en [User Journey Map](User-Journey-Map.md).

---

## 0. Metadata

| Veld | Waarde |
| :--- | :--- |
| **Documentversie** | `1.0` (concept vastgesteld) |
| **Laatst bijgewerkt** | 2026-09-13 |
| **Status** | ✅ Concept vastgesteld — implementatie gepland als **laatste**, ná de 3 bestaande modi |
| **Modus-ID / Scherm** | `MODE_ZEG_BOUW` / `SCR_MSA_ZEG_BOUW` |
| **Umbrella-taak** | `T-04` (ontwerpen + bouwen) |

---

## ✅ Besluiten (2026-09-13)

| # | Onderwerp | Besluit |
| :-- | :--- | :--- |
| 1 | **Varianten** | **Beide** worden geïmplementeerd: A (Bouwopdracht) én B (Vrij Bouwen). |
| 2 | **Compound-zinnen** | **Ja** — "meerdere dingen in één zin" is de kern (bv. *"de boot en de dolfijn in de zee"*). |
| 3 | **Thema's** | Akkoord: vaarstrand, dierenstrand, speelstrand, luchtstrand, feeststrand. |
| 4 | **Volgorde** | Akkoord: Kies het Woord → Zeg & Zet → **Zeg & Bouw** → Zeg & Vlieg. |
| 5 | **Doelstrengheid** | **Soepel/los** — een bouwkaart telt af op "N passende objecten uit het thema"; het kind kiest zelf wélke en wáár (binnen geldige zones). Niet-passend → vriendelijke tip, geen straf. |

> ⏳ **Planning:** de bouw van Zeg & Bouw komt **als laatste**. Eerst maken we de drie bestaande modi (Kies het Woord, Zeg & Zet, Zeg & Vlieg) goed werkend; pas daarna starten de bouwtaken `T-04a`–`T-04e`.

---

## 1. Waarom deze modus? (de pedagogische plek)

De drie bestaande modi dekken de leertrap **receptief → relationeel → productief**, maar telkens met **korte, door de app gedicteerde** taal:

| Modus | Wat het kind doet | Taalproductie |
| :--- | :--- | :--- |
| Kies het Woord | Herkent één woord | Geen (alleen kiezen) |
| Zeg & Zet | Plaatst **één** object per opdracht (app dicteert) | Kort, nazeggen |
| Zeg & Vlieg | Benoemt losse woorden onder tijdsdruk | Losse woorden |

**Wat ontbreekt:** het kind zelf **langere, samengestelde zinnen laten maken** en **met eigen keuzes iets opbouwen**. Dit is de hoogste trede van taalproductie (van losse woorden → naar zinnen → naar eigen verhaal) en past bij het `selfMadeSentences`-observatiemodel dat al in de code zit maar nog nauwelijks gevoed wordt.

**Zeg & Bouw vult dat gat:** het kind **bouwt een heel strand** door zélf te bepalen wát en in welke volgorde, en wordt aangemoedigd om **meerdere dingen in één zin** te zeggen.

> **Het scherpe verschil met Zeg & Zet:** Zeg & Zet zegt *"Zet de boot in de zee"* (één ding, app bepaalt). Zeg & Bouw zegt *"Bouw een vaarstrand"* en het kind mag zelf zeggen *"Ik zet de boot in de zee en de vuurtoren op het eiland"* (meerdere dingen, kind bepaalt hoe).

---

## 2. Concept in één zin

> *"In Zeg & Bouw bouwt het kind een eigen strand door hardop te vertellen wat er moet komen — het mag meerdere dingen in één zin zeggen — en werkt zo toe naar een vrolijk, compleet tafereel."*

**Kernvaardigheid:** samengestelde/zelf-geformuleerde zinnen (taalproductie) + creatieve constructie + keuzevrijheid.

---

## 3. Twee varianten

**Beide varianten worden geïmplementeerd** (besluit 1). Variant A is de gestructureerde, meetbare kern; variant B is de vrije, creatieve speelhoek. Het kind kan tussen beide kiezen.

### Variant A — Bouwopdracht (begeleid)
- Het kind krijgt een **bouwkaart** met een **thema-doel**, bv. *"Bouw een feeststrand"* of *"Maak een dierenstrand"*.
- De kaart toont **welke soorten dingen** erin horen (bv. 3 objecten uit een categorie), maar **niet exact waar** — het kind kiest de invulling.
- Het kind bouwt door te spreken; **meerdere objecten per zin** mag (*"de krab en de dolfijn in de zee"*).
- Klaar als het doel gehaald is → viering + beloning.
- **Meetbaar:** aantal zelf-geformuleerde zinnen, gebruikte woorden/begrippen, hulpbehoefte.

### Variant B — Vrij Bouwen (sandbox, uitbreiding)
- **Geen doel, geen fout.** Het kind bouwt vrij zijn eigen strand.
- De mascotte **benoemt vriendelijk mee** wat het kind bouwt (*"Wat mooi! Je hebt een boot, een zon en een dolfijn gemaakt."*).
- Sterk voor **eigenaarschap, creativiteit en spontane taal**; ideaal als afsluiter of "speelhoek".
- Kan later een **screenshot/deel-knop** krijgen ("laat je strand aan papa/mama zien") — buiten scope voor v1.

---

## 4. Core gameplay loop (variant A)

```
┌──────────────┐   ┌──────────────┐   ┌──────────────────┐   ┌───────────────┐
│ 1. BOUWKAART │ → │ 2. VERTEL    │ → │ 3. BOUW          │ → │ 4. COMPLEET   │
│  toont doel  │   │  wat erin    │   │ objecten         │   │  viering +    │
│ (bv. feest)  │   │  moet (spraak│   │ verschijnen op   │   │  beloning     │
│              │   │  /tap/typen) │   │ het strand       │   │               │
└──────────────┘   └──────────────┘   └────────┬─────────┘   └──────┬────────┘
       ▲                                        │ (nog niet compleet)│
       │                                        ▼                    │
       │                          "Mooi! Wat wil je nog toevoegen?"  │
       └──────────────────────────────────────────────────── volgende bouwkaart
```

- **Geen straf:** een object dat niet in het thema past → vriendelijke tip (*"Een vliegtuig hoort niet op een dierenstrand — wat dan wel?"*), geen verlies.
- **Hint-ladder** zoals elders: mascotte-suggestie → oplichtende plek → voordoen.

---

## 5. Schermen & UI

**Hoofdscherm `SCR_MSA_ZEG_BOUW`** — hergebruikt grotendeels de Scene Builder-opzet (strandcanvas + carrousel + instructiekaart), met verschillen:

| Element | Zeg & Zet | Zeg & Bouw |
| :--- | :--- | :--- |
| Instructiekaart | "Zet de X op Y" | Bouwkaart met thema-doel + voortgang (bv. "2/4 gebouwd") |
| Doel | 1 object per opdracht | Compleet tafereel (meerdere objecten) |
| Vrijheid | Vast object + zone | Kind kiest objecten (binnen thema) |
| Spraak | Enkel commando | **Meerdere objecten per zin** aangemoedigd |

**Overlays (voorstel):**
- `SCR_MSA_OV_BOUWKAART` — toont het bouwdoel bij de start van een kaart.
- `SCR_MSA_OV_ZEGBOUW_SUMMARY` — ronde-eindscherm (welke woorden/zinnen, sterren) — consistent met de andere modi (zie `GAP-15`/`T-03`).
- Hergebruik: `SCR_MSA_OV_SPEECH_WAVE` (mét de nieuwe live wave + woord-voor-woord tekst uit `T-27`), `SCR_MSA_OV_KEYBOARD`, `SCR_MSA_OV_VOICE_PRIVACY`, `SCR_MSA_OV_SUCCESS_TOAST`.

---

## 6. User journey `JRN_ZEGBOUW`

| Stap-ID | Scherm | Actie | Verwacht resultaat |
| :--- | :--- | :--- | :--- |
| `JRN_ZEGBOUW_01` | `SCR_MSA_MODE_SELECT` | Kiest **Zeg & Bouw**, Start | Bouwkaart-overlay verschijnt |
| `JRN_ZEGBOUW_02` | `SCR_MSA_OV_BOUWKAART` | Ziet/hoort het thema-doel | "Bouw een feeststrand met 3 dingen!" |
| `JRN_ZEGBOUW_03` | `SCR_MSA_ZEG_BOUW` | Vertelt wat erin moet (spraak/tap/typen) | Object(en) verschijnen; voortgang telt op |
| `JRN_ZEGBOUW_04` | idem | Voegt meer toe (evt. compound zin) | Meerdere objecten in één beurt geplaatst |
| `JRN_ZEGBOUW_05` | idem | Doel bereikt | Viering + Strandschat-beloning |
| `JRN_ZEGBOUW_06` | `SCR_MSA_OV_ZEGBOUW_SUMMARY` | Ronde-einde | Samenvatting (zinnen, woorden, sterren) + Opnieuw/Menu |

**Zijpaden:** object buiten thema → vriendelijke tip; twijfel → hint; spraak lukt niet → toetsenbord (zoals `JRN_MIC_FALLBACK`).

---

## 7. Content: bouwkaarten & thema's

**Voorstel voor thema-bouwkaarten** (elk = een doel + toegestane objecten uit de bestaande 12):

| Bouwkaart-ID | Thema | Doel (voorbeeld) | Objecten (uit bestaande set) |
| :--- | :--- | :--- | :--- |
| `build-vaarstrand` | Varen | "3 dingen die kunnen varen/drijven" | boot, dolfijn, … |
| `build-dierenstrand` | Dieren | "Zet de dieren op het strand" | krab, dolfijn, … |
| `build-speelstrand` | Spelen | "Maak een speelstrand" | bal, vlieger, zandkasteel, parasol |
| `build-luchtstrand` | Lucht | "Wat vliegt er boven het strand?" | vliegtuig, vlieger, zon |
| `build-feeststrand` | Vrij thema | "Maak jouw mooiste strand (4 dingen)" | vrije keuze |

- **Compound-commando's:** de parser haalt nu al meerdere objecten uit een zin (`objectMatches`, `anchorObjectIds`). Voor Zeg & Bouw breiden we dat uit zodat *elk* genoemd object geplaatst wordt (niet alleen doel + anker). → nieuwe taak (zie §10).
- **Randomisatie:** bouwkaarten en objectvolgorde random per ronde (sluit aan op `T-29`).

---

## 8. Invoer (hergebruik + uitbreiding)

- **Spraak:** hergebruikt de spraak-hook + parser; met de **live wave + woord-voor-woord transcriptie** (`T-27`) en het **woordfilter** (`T-28`).
- **Compound parsing:** uitbreiding van `spoken-command-parser.ts` om meerdere plaatsingen uit één zin te halen.
- **Tap & toetsenbord:** volwaardige alternatieven (toegankelijkheid), net als elders.

---

## 9. Beloningen (Strandschat)

- Sluit volledig aan op het bestaande **Strandschat**-systeem (GDD-index §7): ⭐ per goede toevoeging, `+1` bonus voor een zelf-geformuleerde (compound) zin zonder hint → beloont juist de kernvaardigheid van deze modus.
- Draagt bij aan het cumulatieve per-profiel totaal en dus aan unlocks.

---

## 10. Toegankelijkheid & foutloos leren

- Geen "fout"/"game over": buiten-thema of onduidelijke spraak → vriendelijke tip.
- Onbeperkt herhalen, tap/toetsenbord-alternatief, `reducedMotion`-respect.
- "Tekst altijd beschikbaar": het thema-doel staat ook als tekst, niet alleen audio.

---

## 11. Plek in de leertrap & unlock-volgorde

Zeg & Bouw is qua taalproductie **zwaarder dan Zeg & Zet** (zelf zinnen maken) maar **zonder de tijdsdruk van Zeg & Vlieg**. Voorstel voor de volgorde (bouwt voort op de besloten `T-31` unlock Kies→Zet→Vlieg):

```
Kies het Woord  →  Zeg & Zet  →  Zeg & Bouw  →  Zeg & Vlieg
(herkennen)        (plaatsen)     (zelf bouwen)   (snel benoemen)
```

→ Zeg & Bouw komt vóór Zeg & Vlieg (eerst rustig zelf zinnen leren maken, dan onder tijdsdruk toepassen). **Open vraag** (§12): akkoord met deze plek?

---

## 12. Besluiten

Alle open vragen zijn besloten — zie de **Besluiten-tabel bovenaan** dit document (varianten A+B, compound-zinnen, de 5 thema's, volgorde Kies→Zet→Bouw→Vlieg, en soepele doelstrengheid). Er zijn geen openstaande keuzes meer voor het concept; de resterende details (exacte teksten, assets) komen bij de bouw.

---

## 13. Afhankelijkheden & benodigde taken (na goedkeuring)

Zeg & Bouw leunt op werk dat al gepland staat — bouw het daarom **ná** die bouwstenen:

| Hangt af van | Waarom |
| :--- | :--- |
| `T-27` (live wave + transcriptie) | Kind moet zien wat het zegt bij langere zinnen |
| `T-28` (woordfilter) | Vrije/creatieve spraak → bescherming nodig |
| `T-29` (randomisatie) | Bouwkaarten/objecten willekeurig |
| `T-31` (unlock-volgorde) | Zeg & Bouw krijgt een plek in de trap |
| Parser-uitbreiding | Meerdere plaatsingen uit één zin (nieuw) |

**Voorgestelde vervolgtaken (concept → bouw), op te nemen in de takenlijst na jouw akkoord:**
- `T-04a` — Concept vaststellen (dit document) + GDD/Journey Map bijwerken.
- `T-04b` — Parser uitbreiden voor compound plaatsingen.
- `T-04c` — Scherm `SCR_MSA_ZEG_BOUW` + bouwkaarten (variant A) bouwen.
- `T-04d` — Ronde-eindscherm + Strandschat-koppeling.
- `T-04e` — (optioneel) Variant B Vrij Bouwen.

---

## 14. Voorlopige ID's (voor de andere documenten)

- **Scherm:** `SCR_MSA_ZEG_BOUW` · **Overlays:** `SCR_MSA_OV_BOUWKAART`, `SCR_MSA_OV_ZEGBOUW_SUMMARY`
- **Features (indicatief):** `FEAT_BOUW_RENDER`, `FEAT_BOUW_CARD`, `FEAT_BOUW_SPEAK_MULTI`, `FEAT_BOUW_PROGRESS`, `FEAT_BOUW_COMPLETE`, `FEAT_BOUW_SUMMARY`, `FEAT_BOUW_FREE` (variant B)
- **Journey:** `JRN_ZEGBOUW_01..06`
- **Tests:** `TC_BOUW_01..` (nieuwe suite `e2e/zeg-en-bouw.spec.ts`)
