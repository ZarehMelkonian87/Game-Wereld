# 🗺️ User Journey Map — Magisch Strand-Avontuur

> De reizen die een kind (of begeleider) door de game maakt, stap voor stap. Koppelt schermen uit de [GDD](GDD-index.md) aan functies uit de [Feature-catalogus](Feature-catalogus.md).

| Veld                  | Waarde                           |
| :-------------------- | :------------------------------- |
| **Documentversie**    | `1.0` (opgeschoond)              |
| **Laatst bijgewerkt** | 2026-09-22                       |
| **Status**            | 🟢 Alle reizen werken end-to-end |

**Legenda:** 🟢 werkt (geautomatiseerd of op toestel) · 👤 werkt, handmatig bevestigd (microfoon).

| Reis               | Naam                                | Persona's                         |
| :----------------- | :---------------------------------- | :-------------------------------- |
| `JRN_ONBOARD`      | Eerste keer opstarten tot spelklaar | alle kinderen + `PERS_BEGELEIDER` |
| `JRN_DOWNLOAD`     | Game downloaden op telefoon/tablet  | `PERS_BEGELEIDER`                 |
| `JRN_RETURN`       | Terugkerend kind pakt de draad op   | alle kinderen                     |
| `JRN_KIESWOORD`    | Een ronde Kies het Woord            | `PERS_KLEUTER`, `PERS_NT2`        |
| `JRN_ZEGZET`       | Een ronde Zeg & Zet                 | `PERS_TOS`, `PERS_NT2`            |
| `JRN_ZEGBOUW`      | Een ronde Zeg & Bouw                | `PERS_TOS`, `PERS_NT2`            |
| `JRN_ZEGVLIEG`     | Een ronde Zeg & Vlieg               | `PERS_TOS`                        |
| `JRN_REWARD`       | Beloningen bekijken                 | alle kinderen                     |
| `JRN_SETTINGS`     | Instellingen / voortgang resetten   | `PERS_BEGELEIDER`                 |
| `JRN_MIC_FALLBACK` | Spraak lukt niet → typen (zijpad)   | alle kinderen                     |

---

## 1. `JRN_ONBOARD` — van app openen tot spelklaar

| Stap | Scherm                    | Actie                            | Verwacht resultaat                         | Status |
| :--- | :------------------------ | :------------------------------- | :----------------------------------------- | :----: |
| 01   | `SCR_PLAT_WELCOME`        | Tikt **START**                   | Naar profielkeuze                          |   🟢   |
| 02   | `SCR_PLAT_PROFILE_SELECT` | Tikt **NIEUWE SPELER**           | Naar avatarkeuze                           |   🟢   |
| 03   | `SCR_PLAT_AVATAR_SELECT`  | Kiest een avatar                 | Avatar geselecteerd                        |   🟢   |
| 04   | idem                      | Typt naam, tikt **LET'S GO!**    | Profiel aangemaakt, naar zones             |   🟢   |
| 05   | `SCR_PLAT_HOME`           | Kiest **Speciale Woordenschat**  | Naar de spellenlijst van die zone          |   🟢   |
| 06   | `SCR_PLAT_GAMES_LIST`     | Tikt **Magisch Strand-Avontuur** | Game laadt (of eerst de download-gate)     |   🟢   |
| 07   | `SCR_MSA_START`           | Ziet het titelscherm             | Spelen, sterrenteller (0 ⭐), instellingen |   🟢   |

Een begeleider doet meestal stap 02–04 samen met het kind; de rest is puur tikken en vraagt geen leesvaardigheid.

## 2. `JRN_DOWNLOAD` — game downloaden (telefoon/tablet)

| Stap | Scherm                | Actie                 | Verwacht resultaat                                          | Status |
| :--- | :-------------------- | :-------------------- | :---------------------------------------------------------- | :----: |
| 01   | `SCR_PLAT_GAMES_LIST` | Ziet de kaart         | `📥 37 MB`; spelen is vergrendeld                           |   🟢   |
| 02   | idem                  | Tikt de downloadknop  | Op wifi start de download; op 4G/5G eerst een bewuste keuze |   🟢   |
| 03   | download-modal        | Wacht                 | Fase 1–3 met percentage; Play blijft vergrendeld            |   🟢   |
| 04   | idem                  | Sluit het venster     | Download loopt door; de kaart toont de voortgangsring       |   🟢   |
| 05   | idem                  | 100%                  | "Download voltooid!" + **Klaar! Start avontuur**            |   🟢   |
| 06   | `SCR_PLAT_GAMES_LIST` | Tikt 🗑️ **Verwijder** | In-app bevestiging; daarna staat de kaart weer op `📥`      |   🟢   |

Op desktop bestaat deze reis niet: daar is de game direct speelbaar.

## 3. `JRN_RETURN` — terugkerend kind

| Stap | Scherm                    | Actie                  | Verwacht resultaat                            | Status |
| :--- | :------------------------ | :--------------------- | :-------------------------------------------- | :----: |
| 01   | `SCR_PLAT_WELCOME`        | Tikt **START**         | Naar profielkeuze                             |   🟢   |
| 02   | `SCR_PLAT_PROFILE_SELECT` | Kiest bestaand profiel | Sterren, unlocks en instellingen staan er nog |   🟢   |
| 03   | game                      | Speelt verder          | Ontgrendelde modi blijven open                |   🟢   |

## 4. `JRN_KIESWOORD` — een ronde Kies het Woord

| Stap | Scherm                | Actie                                    | Verwacht resultaat                                    | Status |
| :--- | :-------------------- | :--------------------------------------- | :---------------------------------------------------- | :----: |
| 01   | `SCR_MSA_MODE_SELECT` | Kiest **Kies het Woord**, **Start spel** | Quiz opent op vraag 1/12                              |   🟢   |
| 02   | `SCR_MSA_WORD_CHOICE` | Hoort/leest de vraag                     | Vraag + 2–4 keuzekaarten                              |   🟢   |
| 03   | idem                  | Tikt de juiste kaart                     | Groene rand, goed-geluid, nazegzin, bonus zonder hint |   🟢   |
| 04   | idem                  | Wacht ±2 s                               | Volgende vraag komt vanzelf; voortgang +1             |   🟢   |
| 05   | idem                  | Herhaalt t/m vraag 12                    | Ronde-eindscherm met sterren en tempo                 |   🟢   |
| 06   | eindscherm            | Tikt **Opnieuw** of **Menu**             | Verse ronde óf terug naar moduskeuze                  |   🟢   |

**Zijpaden:** fout antwoord → vriendelijke tip en zacht geluid, de vraag blijft staan (🟢). Hint → tekst + juiste kaart licht op (🟢).

## 5. `JRN_ZEGZET` — een ronde Zeg & Zet

| Stap | Scherm                  | Actie                                    | Verwacht resultaat                               | Status |
| :--- | :---------------------- | :--------------------------------------- | :----------------------------------------------- | :----: |
| 01   | `SCR_MSA_MODE_SELECT`   | Kiest **Zeg & Zet**, **Start spel**      | Speelveld met opdracht en objectbalk             |   🟢   |
| 02   | `SCR_MSA_SCENE_BUILDER` | Hoort/leest de opdracht                  | Opdracht zichtbaar als tekst                     |   🟢   |
| 03a  | idem                    | **Tikken:** object kiezen → plek tikken  | Object geplaatst                                 |   🟢   |
| 03b  | idem                    | **Slepen:** object naar de zone          | Object geplaatst                                 |   🟢   |
| 03c  | idem                    | **Spreken:** commando inspreken          | Parser plaatst het object                        |   👤   |
| 03d  | idem                    | **Typen:** spookletters overtypen, Enter | Parser plaatst het object                        |   🟢   |
| 04   | idem                    | —                                        | Goede plaatsing wordt **meteen** bevestigd       |   🟢   |
| 05   | idem                    | Herhaalt tot de ronde klaar is           | Ronde-eindscherm met geoefende woorden/begrippen |   🟢   |

**Zijpaden:** hint → doelzone licht op (🟢); video-instructie speelt af of valt netjes terug op tekst (🟢); fout → herstelbare feedback, object opnieuw oppakken (🟢).

## 6. `JRN_ZEGBOUW` — een ronde Zeg & Bouw

| Stap | Scherm                | Actie                                     | Verwacht resultaat                                | Status |
| :--- | :-------------------- | :---------------------------------------- | :------------------------------------------------ | :----: |
| 01   | `SCR_MSA_MODE_SELECT` | Kiest **Zeg & Bouw**, **Start spel**      | Bouwkaart, strand en objectbalk                   |   🟢   |
| 02   | `SCR_MSA_ZEG_BOUW`    | Leest de bouwopdracht                     | Thema + doel zichtbaar ("zet 2 dingen die varen") |   🟢   |
| 03a  | idem                  | **Tikken:** plaatje kiezen → plek tikken  | Object geplaatst, +2 ⭐                           |   🟢   |
| 03b  | idem                  | **Typen/spreken:** één zin, meer objecten | Alle objecten geplaatst, +1 ⭐ compound-bonus     | 🟢/👤  |
| 04   | idem                  | Haalt het kaartdoel                       | Scène blijft even staan, dan "Strand af!"         |   🟢   |
| 05   | eindscherm            | Ziet de samenvatting                      | Gebouwde objecten, sterren, volgende beloning     |   🟢   |
| 06   | idem                  | **Volgende strand** of **Menu**           | Verse bouwkaart óf moduskeuze                     |   🟢   |
| 07   | bouwscherm            | Tikt **Vrij bouwen**                      | Alles mag, geen doel; de mascotte benoemt mee     |   🟢   |

## 7. `JRN_ZEGVLIEG` — een ronde Zeg & Vlieg

| Stap | Scherm                   | Actie                          | Verwacht resultaat                                   | Status |
| :--- | :----------------------- | :----------------------------- | :--------------------------------------------------- | :----: |
| 01   | `SCR_MSA_MODE_SELECT`    | Kiest **Zeg & Vlieg**          | Start-overlay met de doelwoorden                     |   🟢   |
| 02   | `SCR_MSA_VOICE_SCROLLER` | Tikt **Start**                 | Held vliegt, afstand loopt op                        |   🟢   |
| 03   | idem                     | Beweegt de duim-rail           | Vlieghoogte verandert                                |   🟢   |
| 04   | idem                     | Ziet object → **zegt de naam** | Object verzameld, tempo-boost, combo loopt           |   👤   |
| 05   | idem                     | Raakt een obstakel             | Eén schildje eraf + korte vertraging, geen game-over |   🟢   |
| 06   | idem                     | Laatste schildje op            | Ronde-eindscherm: meters, sterren, record            |   🟢   |
| 07   | eindscherm               | **Opnieuw** of **Wereld**      | Verse ronde óf moduskeuze                            |   🟢   |

## 8. `JRN_REWARD` — beloningen bekijken

| Stap | Scherm                | Actie               | Verwacht resultaat                              | Status |
| :--- | :-------------------- | :------------------ | :---------------------------------------------- | :----: |
| 01   | `SCR_MSA_MODE_SELECT` | Tikt **Beloningen** | Beloningsscherm opent                           |   🟢   |
| 02   | `SCR_MSA_REWARD`      | Bekijkt unlocks     | Uitgelichte beloning, sterren, verzamelde items |   🟢   |
| 03   | idem                  | Tikt **Wereld**     | Terug naar moduskeuze (geen "Opnieuw" via menu) |   🟢   |

## 9. `JRN_SETTINGS` — instellingen en resetten

| Stap | Scherm             | Actie                            | Verwacht resultaat                                | Status |
| :--- | :----------------- | :------------------------------- | :------------------------------------------------ | :----: |
| 01   | `SCR_MSA_START`    | Tikt instellingen                | Game-instellingen openen                          |   🟢   |
| 02   | `SCR_MSA_SETTINGS` | Schakelt toggles                 | Instelling wijzigt en blijft bewaard              |   🟢   |
| 03   | idem               | Bekijkt microfoon en privacy     | Correcte status en uitleg                         |   🟢   |
| 04   | idem               | **Reset voortgang** → bevestigen | Sleutels, observaties én het record worden gewist |   🟢   |
| 05   | idem               | Of **Annuleren**                 | Dialoog sluit, niets verloren                     |   🟢   |
| 06   | idem               | **Terug**                        | Terug met behoud van instellingen                 |   🟢   |

## 10. `JRN_MIC_FALLBACK` — spraak lukt niet

| Stap | Scherm                               | Situatie                            | Verwacht resultaat                            | Status |
| :--- | :----------------------------------- | :---------------------------------- | :-------------------------------------------- | :----: |
| 01   | `SCR_MSA_SCENE_BUILDER` / `ZEG_BOUW` | Microfoon geweigerd of afwezig      | Vriendelijke melding, geen doodlopende staat  |   🟢   |
| 02   | idem                                 | Privacy-notice wijst op het typen   | "Werkt spraak niet? Typ dezelfde zin."        |   🟢   |
| 03   | idem                                 | Kind typt de zin over               | Opdracht wordt via dezelfde parser uitgevoerd |   🟢   |
| 04   | platform-instellingen                | Begeleider opent Microfoon-diagnose | Rapport toont waar het misgaat, kopieerbaar   |   🟢   |

Deze reis is met een geweigerde microfoon end-to-end geautomatiseerd in de a11y-suite: de kernopdracht is volledig met het toetsenbord af te maken.
