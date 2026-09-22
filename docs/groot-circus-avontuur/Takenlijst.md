# 🧱 Takenlijst — Groot Circus-Avontuur

> Volledig bouwplan om Groot Circus-Avontuur op hetzelfde niveau te brengen als [Magisch Strand-Avontuur](../magisch-strand-avontuur/GDD-index.md): gameplay gelijktrekken, content afmaken, media produceren, testen en vrijgeven.

| Veld                  | Waarde                                                                  |
| :-------------------- | :---------------------------------------------------------------------- |
| **Laatst bijgewerkt** | 2026-09-22                                                              |
| **Uitgangspunt**      | Code van het strandspel overnemen; bestaande circus-assets hergebruiken |
| **Status game**       | 🔵 `coming-soon` — vergrendelde kaart in de catalogus                   |

**Statuslegenda:** ⬜ open · 🟦 in uitvoering · ✅ klaar
**Type:** 🔧 code · 🎨 ontwerp/asset · 🔍 test · 📄 documentatie

---

## 0. Wat er al staat

| Onderdeel                            | Stand                                                |
| :----------------------------------- | :--------------------------------------------------- |
| Content: 19 objecten, 9 zones        | ✅ compleet in `content.ts`                          |
| 23 Zeg & Zet-opdrachten              | ✅ met hints, feedbackzinnen en dynamische zones     |
| 19 Kies het Woord-vragen             | ✅ met oplopende afleiderstrategie                   |
| 13 Zeg & Vlieg-woorden + aliassen    | ✅ inclusief kindertaalvarianten                     |
| Stickers (19 stuks, PNG)             | 🟡 aanwezig, moeten nog naar WebP                    |
| Achtergronden (tent, side-scroller)  | ✅ PNG + WebP aanwezig                               |
| Logo, mascotte, avatars, wereldicoon | ✅ aanwezig                                          |
| Achtergrondmuziek                    | ✅ aanwezig                                          |
| Vier spelmodi                        | 🟡 drie aanwezig (oude versie), Zeg & Bouw ontbreekt |
| Instructievideo's                    | ⬜ nul — de volledige productielijst staat in §3     |
| Feedbackgeluiden                     | ⬜ nog niet                                          |

De code is afgetakt van het strandspel van vóór een reeks verbeteringen. Fase 1 haalt die achterstand in.

---

## 1. Fase 1 — gameplay gelijktrekken met het strandspel

> Werkwijze per taak: neem het bestand uit `src/app/games/magisch-strand-avontuur/` over, vervang strand-termen door circus-termen, en neem de bijbehorende test mee. Niets opnieuw bedenken.

| Taak     | Type | Wat                                                                                                                          | Bron uit het strandspel                                       | Status |
| :------- | :--: | :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------ | :----: |
| **C-01** |  🔧  | **Vierde modus Zeg & Bouw**: scherm, state-hook, ronde-eindscherm en bouwkaarten (circus-kaarten in §2.1)                    | `screens/zeg-en-bouw/*`, `logic/zeg-en-bouw-cards.ts`         |   ⬜   |
| **C-02** |  🔧  | **Ontgrendeling per modus** (0 / 3 / 8 / 14 ⭐) met de leerlijnvolgorde in het moduskeuzescherm                              | `logic/mode-unlocks.ts`                                       |   ⬜   |
| **C-03** |  🔧  | **Automatisch bevestigen** in Zeg & Zet: "Klaar"-knop weg, goede plaatsing wordt meteen bevestigd                            | `useScenePlacementHandlers.ts`                                |   ⬜   |
| **C-04** |  🔧  | **Automatisch doorgaan** in Kies het Woord (1,8 s; 2,6 s bij een beloning), "Volgende"-knop weg, dubbele tik genegeerd       | `screens/word-choice/useWordChoiceState.ts`                   |   ⬜   |
| **C-05** |  🔧  | **Goed/fout-geluiden** aansluiten, met respect voor de audio-instelling                                                      | `logic/feedback-sounds.ts`                                    |   ⬜   |
| **C-06** |  🔧  | **Overtyp-veld**: doelzin als spookletters, groen/rood per letter, Enter bevestigt, geen "Bijvoorbeeld"-regel                | `components/ui/inputs-toggles/InputSentenceField.tsx`         |   ⬜   |
| **C-07** |  🔧  | **Eén invoer tegelijk**: typen openen zet de mic uit, mic starten sluit het typ-paneel                                       | `useSpokenCommandControlsState.ts`                            |   ⬜   |
| **C-08** |  🔧  | **Spraakgolf** met de mobiel-vaste regel: audio-reactief op desktop, luister-animatie zonder eigen opname op telefoon/tablet | `components/ui/MicWaveBars.tsx`                               |   ⬜   |
| **C-09** |  🔧  | **Herkansingspaneel** bij een spraakfout: mic blijft herstartbaar, met typ-alternatief                                       | `scene-builder/components/SpeechRetryPanel.tsx`               |   ⬜   |
| **C-10** |  🔧  | **Ronde-eindscherm voor Zeg & Zet** (geoefende woorden en begrippen, sterren, volgende beloning)                             | `scene-builder/components/SceneBuilderRoundSummary.tsx`       |   ⬜   |
| **C-11** |  🔧  | **Persoonlijk record** in Zeg & Vlieg, per profiel bewaard en gewist bij reset                                               | `voice-side-scroller/voiceSideScrollerRecord.ts`              |   ⬜   |
| **C-12** |  🔧  | **Woordbescherming**: ongewenste woorden gemaskeerd, zachte nudge in plaats van straf                                        | `logic/word-safety.ts`                                        |   ⬜   |
| **C-13** |  🔧  | **Rustige beweging** koppelen aan de gameplay-animaties, niet alleen aan de OS-voorkeur                                      | `logic/useReducedMotionSetting.ts`                            |   ⬜   |
| **C-14** |  🔧  | **Samengestelde zinnen** (één zin plaatst meerdere objecten) voor Zeg & Bouw                                                 | `parseCompoundPlacements` in `logic/spoken-command-parser.ts` |   ⬜   |
| **C-15** |  🔧  | **Opruimen**: dode `world-select`-staat uit `game-screen-preview.ts` en de losse `LblKeyboardExample` verwijderen            | strandspel heeft die al niet meer                             |   ⬜   |
| **C-16** |  🔧  | **Portret-guard en download-gate** verifiëren op telefoon (platformbreed, zou vanzelf moeten werken)                         | `src/app/platform/`                                           |   ⬜   |

**Klaar wanneer:** een diff tussen de twee gamemappen alleen nog verschillen laat zien in content, teksten en assets — niet meer in mechaniek.

---

## 2. Fase 2 — content afmaken

| Taak     | Type | Wat                                                                                                               | Status |
| :------- | :--: | :---------------------------------------------------------------------------------------------------------------- | :----: |
| **N-01** |  🎨  | **Vijf bouwkaarten** vastleggen in `logic/zeg-en-bouw-cards.ts` (voorstel in §2.1)                                |   ⬜   |
| **N-02** |  🎨  | **Beloningen** circus-eigen maken: zeven items op dezelfde drempels (3 · 8 · 16 · 28 · 42 · 60 · 85 ⭐), zie A-03 |   ⬜   |
| **N-03** |  📄  | Woordenlijst bijwerken zodra de bouwkaarten definitief zijn                                                       |   ⬜   |

### 2.1 Voorstel bouwkaarten

| Kaart                 | Opdracht                                                   | Doel | Passende objecten                        |
| :-------------------- | :--------------------------------------------------------- | :--: | :--------------------------------------- |
| `build-dierenshow`    | Maak een dierenshow! Zet 3 dieren in de piste.             |  3   | leeuw, olifant, aap, beer, zeehond, hond |
| `build-clownsshow`    | Maak een clownsshow! Zet 2 dingen van de clown neer.       |  2   | clown, kegel, hoepel                     |
| `build-kleine-dieren` | Zet 3 kleine dieren op de vloer.                           |  3   | muis, poes, kip, big, hond               |
| `build-hoog-in-tent`  | Wat hangt er hoog in de tent? Zet 2 dingen boven de piste. |  2   | ballon, acrobaat, vlag                   |
| `build-jouw-circus`   | Maak jouw mooiste circus! Kies zelf 3 dingen.              |  3   | alles mag                                |

---

## 3. Fase 3 — media produceren

Dit is het grootste blok. Alle bestandsnamen liggen vast, zodat de code ze meteen vindt en je incrementeel kunt toevoegen. Zolang een video ontbreekt, valt de game terug op de voorleesstem — de game blijft dus altijd speelbaar.

**Productieregels** (gelijk aan het strandspel): clips van 2–5 seconden · dezelfde sticker- en papierstijl als de plaatjes · geen tekst in beeld, de voice-over draagt de opdracht · rustige, duidelijke Nederlandse uitspraak · 480p, enkele honderden kB per clip · bestandsnamen in kebab-case zonder spaties · map: `src/app/games/groot-circus-avontuur/assets/instructions/`.

### 3.1 Video's bij de plaatsingsopdrachten — 23 opdrachten × 4 = 92 clips

Per opdracht vier clips: de opdracht zelf, twee hints en de positieve feedback.

| ID     | Bestandsnaam                                                      | Gesproken tekst                               | Wat je in beeld ziet                                                                        |
| :----- | :---------------------------------------------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------------------------ |
| lp-001 | `lp-001-opdracht-zet-de-eenwieler-in-de-piste.mp4`                | Zet de eenwieler in de piste.                 | De piste met de eenwieler in de objectbalk; een hand pakt het en zet het op de juiste plek. |
| lp-001 | `lp-001-hint-01-zoek-de-eenwieler.mp4`                            | Zoek de eenwieler.                            | De objectbalk onderin; de eenwieler licht op en wipt even.                                  |
| lp-001 | `lp-001-hint-02-kijk-naar-eenwieler.mp4`                          | Kijk naar het plaatje dat oplicht: eenwieler. | Alleen de eenwieler blijft helder, de rest vervaagt.                                        |
| lp-001 | `lp-001-feedback-de-eenwieler-staat-in-de-piste.mp4`              | De eenwieler staat in de piste.               | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-002 | `lp-002-opdracht-zet-de-leeuw-in-de-piste.mp4`                    | Zet de leeuw in de piste.                     | De piste met de leeuw in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-002 | `lp-002-hint-01-zoek-de-leeuw.mp4`                                | Zoek de leeuw.                                | De objectbalk onderin; de leeuw licht op en wipt even.                                      |
| lp-002 | `lp-002-hint-02-kijk-naar-leeuw.mp4`                              | Kijk naar het plaatje dat oplicht: leeuw.     | Alleen de leeuw blijft helder, de rest vervaagt.                                            |
| lp-002 | `lp-002-feedback-de-leeuw-staat-in-de-piste.mp4`                  | De leeuw staat in de piste.                   | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-003 | `lp-003-opdracht-leg-de-kegel-op-de-vloer.mp4`                    | Leg de kegel op de vloer.                     | De piste met de kegel in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-003 | `lp-003-hint-01-zoek-de-kegel.mp4`                                | Zoek de kegel.                                | De objectbalk onderin; de kegel licht op en wipt even.                                      |
| lp-003 | `lp-003-hint-02-kijk-naar-kegel.mp4`                              | Kijk naar het plaatje dat oplicht: kegel.     | Alleen de kegel blijft helder, de rest vervaagt.                                            |
| lp-003 | `lp-003-feedback-de-kegel-staat-op-de-vloer.mp4`                  | De kegel staat op de vloer.                   | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-004 | `lp-004-opdracht-zet-de-vlag-op-de-tribune.mp4`                   | Zet de vlag op de tribune.                    | De piste met de vlag in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-004 | `lp-004-hint-01-zoek-de-vlag.mp4`                                 | Zoek de vlag.                                 | De objectbalk onderin; de vlag licht op en wipt even.                                       |
| lp-004 | `lp-004-hint-02-kijk-naar-vlag.mp4`                               | Kijk naar het plaatje dat oplicht: vlag.      | Alleen de vlag blijft helder, de rest vervaagt.                                             |
| lp-004 | `lp-004-feedback-de-vlag-staat-op-de-tribune.mp4`                 | De vlag staat op de tribune.                  | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-005 | `lp-005-opdracht-zet-de-ballon-boven-in-de-nok.mp4`               | Zet de ballon boven in de nok.                | De piste met de ballon in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-005 | `lp-005-hint-01-zoek-de-ballon.mp4`                               | Zoek de ballon.                               | De objectbalk onderin; de ballon licht op en wipt even.                                     |
| lp-005 | `lp-005-hint-02-kijk-naar-ballon.mp4`                             | Kijk naar het plaatje dat oplicht: ballon.    | Alleen de ballon blijft helder, de rest vervaagt.                                           |
| lp-005 | `lp-005-feedback-de-ballon-zweeft-boven-in-de-nok.mp4`            | De ballon zweeft boven in de nok.             | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-006 | `lp-006-opdracht-zet-het-kanon-boven-de-piste.mp4`                | Zet het kanon boven de piste.                 | De piste met het kanon in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-006 | `lp-006-hint-01-zoek-het-kanon.mp4`                               | Zoek het kanon.                               | De objectbalk onderin; het kanon licht op en wipt even.                                     |
| lp-006 | `lp-006-hint-02-kijk-naar-kanon.mp4`                              | Kijk naar het plaatje dat oplicht: kanon.     | Alleen het kanon blijft helder, de rest vervaagt.                                           |
| lp-006 | `lp-006-feedback-het-kanon-staat-boven-de-piste.mp4`              | Het kanon staat boven de piste.               | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-007 | `lp-007-opdracht-zet-de-hoepel-op-de-vloer.mp4`                   | Zet de hoepel op de vloer.                    | De piste met de hoepel in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-007 | `lp-007-hint-01-zoek-de-hoepel.mp4`                               | Zoek de hoepel.                               | De objectbalk onderin; de hoepel licht op en wipt even.                                     |
| lp-007 | `lp-007-hint-02-kijk-naar-hoepel.mp4`                             | Kijk naar het plaatje dat oplicht: hoepel.    | Alleen de hoepel blijft helder, de rest vervaagt.                                           |
| lp-007 | `lp-007-feedback-de-hoepel-ligt-op-de-vloer.mp4`                  | De hoepel ligt op de vloer.                   | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-008 | `lp-008-opdracht-zet-de-aap-op-de-trommel.mp4`                    | Zet de aap op de trommel.                     | De piste met de aap in de objectbalk; een hand pakt het en zet het op de juiste plek.       |
| lp-008 | `lp-008-hint-01-zoek-de-aap.mp4`                                  | Zoek de aap.                                  | De objectbalk onderin; de aap licht op en wipt even.                                        |
| lp-008 | `lp-008-hint-02-kijk-naar-aap.mp4`                                | Kijk naar het plaatje dat oplicht: aap.       | Alleen de aap blijft helder, de rest vervaagt.                                              |
| lp-008 | `lp-008-feedback-de-aap-zit-op-de-trommel.mp4`                    | De aap zit op de trommel.                     | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-009 | `lp-009-opdracht-zet-de-clown-naast-de-hoepel.mp4`                | Zet de clown naast de hoepel.                 | De piste met de clown in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-009 | `lp-009-hint-01-zoek-de-clown.mp4`                                | Zoek de clown.                                | De objectbalk onderin; de clown licht op en wipt even.                                      |
| lp-009 | `lp-009-hint-02-kijk-naar-clown.mp4`                              | Kijk naar het plaatje dat oplicht: clown.     | Alleen de clown blijft helder, de rest vervaagt.                                            |
| lp-009 | `lp-009-feedback-de-clown-staat-naast-de-hoepel.mp4`              | De clown staat naast de hoepel.               | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-010 | `lp-010-opdracht-zet-de-olifant-rechts-op-de-vloer.mp4`           | Zet de olifant rechts op de vloer.            | De piste met de olifant in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-010 | `lp-010-hint-01-zoek-de-olifant.mp4`                              | Zoek de olifant.                              | De objectbalk onderin; de olifant licht op en wipt even.                                    |
| lp-010 | `lp-010-hint-02-kijk-naar-olifant.mp4`                            | Kijk naar het plaatje dat oplicht: olifant.   | Alleen de olifant blijft helder, de rest vervaagt.                                          |
| lp-010 | `lp-010-feedback-de-olifant-staat-rechts-op-de-vloer.mp4`         | De olifant staat rechts op de vloer.          | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-011 | `lp-011-opdracht-zet-de-acrobaat-boven-de-piste.mp4`              | Zet de acrobaat boven de piste.               | De piste met de acrobaat in de objectbalk; een hand pakt het en zet het op de juiste plek.  |
| lp-011 | `lp-011-hint-01-zoek-de-acrobaat.mp4`                             | Zoek de acrobaat.                             | De objectbalk onderin; de acrobaat licht op en wipt even.                                   |
| lp-011 | `lp-011-hint-02-kijk-naar-acrobaat.mp4`                           | Kijk naar het plaatje dat oplicht: acrobaat.  | Alleen de acrobaat blijft helder, de rest vervaagt.                                         |
| lp-011 | `lp-011-feedback-de-acrobaat-vliegt-boven-de-piste.mp4`           | De acrobaat vliegt boven de piste.            | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-012 | `lp-012-opdracht-leg-de-trommel-midden-op-de-vloer.mp4`           | Leg de trommel midden op de vloer.            | De piste met de trommel in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-012 | `lp-012-hint-01-zoek-de-trommel.mp4`                              | Zoek de trommel.                              | De objectbalk onderin; de trommel licht op en wipt even.                                    |
| lp-012 | `lp-012-hint-02-kijk-naar-trommel.mp4`                            | Kijk naar het plaatje dat oplicht: trommel.   | Alleen de trommel blijft helder, de rest vervaagt.                                          |
| lp-012 | `lp-012-feedback-de-trommel-staat-midden-op-de-vloer.mp4`         | De trommel staat midden op de vloer.          | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-013 | `lp-013-opdracht-zet-de-eenwieler-links-in-de-piste.mp4`          | Zet de eenwieler links in de piste.           | De piste met de eenwieler in de objectbalk; een hand pakt het en zet het op de juiste plek. |
| lp-013 | `lp-013-hint-01-zoek-de-eenwieler.mp4`                            | Zoek de eenwieler.                            | De objectbalk onderin; de eenwieler licht op en wipt even.                                  |
| lp-013 | `lp-013-hint-02-kijk-naar-eenwieler.mp4`                          | Kijk naar het plaatje dat oplicht: eenwieler. | Alleen de eenwieler blijft helder, de rest vervaagt.                                        |
| lp-013 | `lp-013-feedback-de-eenwieler-rijdt-links-in-de-piste.mp4`        | De eenwieler rijdt links in de piste.         | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-014 | `lp-014-opdracht-zet-het-kanon-ver-weg-boven-de-piste.mp4`        | Zet het kanon ver weg boven de piste.         | De piste met het kanon in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-014 | `lp-014-hint-01-zoek-het-kanon.mp4`                               | Zoek het kanon.                               | De objectbalk onderin; het kanon licht op en wipt even.                                     |
| lp-014 | `lp-014-hint-02-kijk-naar-kanon.mp4`                              | Kijk naar het plaatje dat oplicht: kanon.     | Alleen het kanon blijft helder, de rest vervaagt.                                           |
| lp-014 | `lp-014-feedback-het-kanon-staat-ver-weg-boven-de-piste.mp4`      | Het kanon staat ver weg boven de piste.       | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-015 | `lp-015-opdracht-leg-de-kegel-dichtbij-de-hoepel.mp4`             | Leg de kegel dichtbij de hoepel.              | De piste met de kegel in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-015 | `lp-015-hint-01-zoek-de-kegel.mp4`                                | Zoek de kegel.                                | De objectbalk onderin; de kegel licht op en wipt even.                                      |
| lp-015 | `lp-015-hint-02-kijk-naar-kegel.mp4`                              | Kijk naar het plaatje dat oplicht: kegel.     | Alleen de kegel blijft helder, de rest vervaagt.                                            |
| lp-015 | `lp-015-feedback-de-kegel-staat-dichtbij-de-hoepel.mp4`           | De kegel staat dichtbij de hoepel.            | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-016 | `lp-016-opdracht-leg-de-hoepel-tussen-de-kegel-en-de-ballon.mp4`  | Leg de hoepel tussen de kegel en de ballon.   | De piste met de hoepel in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-016 | `lp-016-hint-01-zoek-de-hoepel.mp4`                               | Zoek de hoepel.                               | De objectbalk onderin; de hoepel licht op en wipt even.                                     |
| lp-016 | `lp-016-hint-02-kijk-naar-hoepel.mp4`                             | Kijk naar het plaatje dat oplicht: hoepel.    | Alleen de hoepel blijft helder, de rest vervaagt.                                           |
| lp-016 | `lp-016-feedback-de-hoepel-ligt-tussen-de-kegel-en-de-ballon.mp4` | De hoepel ligt tussen de kegel en de ballon.  | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-017 | `lp-017-opdracht-zet-de-hond-op-de-vloer.mp4`                     | Zet de hond op de vloer.                      | De piste met de hond in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-017 | `lp-017-hint-01-zoek-de-hond.mp4`                                 | Zoek de hond.                                 | De objectbalk onderin; de hond licht op en wipt even.                                       |
| lp-017 | `lp-017-hint-02-kijk-naar-hond.mp4`                               | Kijk naar het plaatje dat oplicht: hond.      | Alleen de hond blijft helder, de rest vervaagt.                                             |
| lp-017 | `lp-017-feedback-de-hond-staat-op-de-vloer.mp4`                   | De hond staat op de vloer.                    | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-018 | `lp-018-opdracht-zet-de-zeehond-in-de-piste.mp4`                  | Zet de zeehond in de piste.                   | De piste met de zeehond in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-018 | `lp-018-hint-01-zoek-de-zeehond.mp4`                              | Zoek de zeehond.                              | De objectbalk onderin; de zeehond licht op en wipt even.                                    |
| lp-018 | `lp-018-hint-02-kijk-naar-zeehond.mp4`                            | Kijk naar het plaatje dat oplicht: zeehond.   | Alleen de zeehond blijft helder, de rest vervaagt.                                          |
| lp-018 | `lp-018-feedback-de-zeehond-zit-in-de-piste.mp4`                  | De zeehond zit in de piste.                   | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-019 | `lp-019-opdracht-zet-de-poes-op-de-trommel.mp4`                   | Zet de poes op de trommel.                    | De piste met de poes in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-019 | `lp-019-hint-01-zoek-de-poes.mp4`                                 | Zoek de poes.                                 | De objectbalk onderin; de poes licht op en wipt even.                                       |
| lp-019 | `lp-019-hint-02-kijk-naar-poes.mp4`                               | Kijk naar het plaatje dat oplicht: poes.      | Alleen de poes blijft helder, de rest vervaagt.                                             |
| lp-019 | `lp-019-feedback-de-poes-zit-op-de-trommel.mp4`                   | De poes zit op de trommel.                    | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-020 | `lp-020-opdracht-zet-de-muis-naast-de-kegel.mp4`                  | Zet de muis naast de kegel.                   | De piste met de muis in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-020 | `lp-020-hint-01-zoek-de-muis.mp4`                                 | Zoek de muis.                                 | De objectbalk onderin; de muis licht op en wipt even.                                       |
| lp-020 | `lp-020-hint-02-kijk-naar-muis.mp4`                               | Kijk naar het plaatje dat oplicht: muis.      | Alleen de muis blijft helder, de rest vervaagt.                                             |
| lp-020 | `lp-020-feedback-de-muis-zit-naast-de-kegel.mp4`                  | De muis zit naast de kegel.                   | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-021 | `lp-021-opdracht-zet-de-big-rechts-op-de-vloer.mp4`               | Zet de big rechts op de vloer.                | De piste met de big in de objectbalk; een hand pakt het en zet het op de juiste plek.       |
| lp-021 | `lp-021-hint-01-zoek-de-big.mp4`                                  | Zoek de big.                                  | De objectbalk onderin; de big licht op en wipt even.                                        |
| lp-021 | `lp-021-hint-02-kijk-naar-big.mp4`                                | Kijk naar het plaatje dat oplicht: big.       | Alleen de big blijft helder, de rest vervaagt.                                              |
| lp-021 | `lp-021-feedback-de-big-staat-rechts-op-de-vloer.mp4`             | De big staat rechts op de vloer.              | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-022 | `lp-022-opdracht-zet-de-kip-tussen-de-hoepel-en-de-kegel.mp4`     | Zet de kip tussen de hoepel en de kegel.      | De piste met de kip in de objectbalk; een hand pakt het en zet het op de juiste plek.       |
| lp-022 | `lp-022-hint-01-zoek-de-kip.mp4`                                  | Zoek de kip.                                  | De objectbalk onderin; de kip licht op en wipt even.                                        |
| lp-022 | `lp-022-hint-02-kijk-naar-kip.mp4`                                | Kijk naar het plaatje dat oplicht: kip.       | Alleen de kip blijft helder, de rest vervaagt.                                              |
| lp-022 | `lp-022-feedback-de-kip-staat-tussen-de-hoepel-en-de-kegel.mp4`   | De kip staat tussen de hoepel en de kegel.    | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |
| lp-023 | `lp-023-opdracht-zet-de-beer-dichtbij-de-trommel.mp4`             | Zet de beer dichtbij de trommel.              | De piste met de beer in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-023 | `lp-023-hint-01-zoek-de-beer.mp4`                                 | Zoek de beer.                                 | De objectbalk onderin; de beer licht op en wipt even.                                       |
| lp-023 | `lp-023-hint-02-kijk-naar-beer.mp4`                               | Kijk naar het plaatje dat oplicht: beer.      | Alleen de beer blijft helder, de rest vervaagt.                                             |
| lp-023 | `lp-023-feedback-de-beer-staat-dichtbij-de-trommel.mp4`           | De beer staat dichtbij de trommel.            | Het voorwerp staat op zijn plek en beweegt kort vrolijk (wiebel, sprankel).                 |

### 3.2 Video's bij de quizvragen — 19 clips

| ID     | Bestandsnaam                               | Gesproken tekst       | Wat je in beeld ziet                                                      |
| :----- | :----------------------------------------- | :-------------------- | :------------------------------------------------------------------------ |
| cw-001 | `cw-001-opdracht-waar-is-de-leeuw.mp4`     | Waar is de leeuw?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-002 | `cw-002-opdracht-waar-is-de-eenwieler.mp4` | Waar is de eenwieler? | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-003 | `cw-003-opdracht-waar-is-de-kegel.mp4`     | Waar is de kegel?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-004 | `cw-004-opdracht-waar-is-de-olifant.mp4`   | Waar is de olifant?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-005 | `cw-005-opdracht-waar-is-de-ballon.mp4`    | Waar is de ballon?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-006 | `cw-006-opdracht-waar-is-de-clown.mp4`     | Waar is de clown?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-007 | `cw-007-opdracht-waar-is-de-aap.mp4`       | Waar is de aap?       | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-008 | `cw-008-opdracht-waar-is-de-trommel.mp4`   | Waar is de trommel?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-009 | `cw-009-opdracht-waar-is-de-hoepel.mp4`    | Waar is de hoepel?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-010 | `cw-010-opdracht-waar-is-de-vlag.mp4`      | Waar is de vlag?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-011 | `cw-011-opdracht-waar-is-het-kanon.mp4`    | Waar is het kanon?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-012 | `cw-012-opdracht-waar-is-de-acrobaat.mp4`  | Waar is de acrobaat?  | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-013 | `cw-013-opdracht-waar-is-de-hond.mp4`      | Waar is de hond?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-014 | `cw-014-opdracht-waar-is-de-poes.mp4`      | Waar is de poes?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-015 | `cw-015-opdracht-waar-is-de-big.mp4`       | Waar is de big?       | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-016 | `cw-016-opdracht-waar-is-de-muis.mp4`      | Waar is de muis?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-017 | `cw-017-opdracht-waar-is-de-beer.mp4`      | Waar is de beer?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-018 | `cw-018-opdracht-waar-is-de-kip.mp4`       | Waar is de kip?       | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-019 | `cw-019-opdracht-waar-is-de-zeehond.mp4`   | Waar is de zeehond?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |

### 3.3 Gedeelde video's — 12 clips

Niet aan één opdracht gebonden; overal herbruikbaar.

| Bestandsnaam                                    | Gesproken tekst                                   | Wat je in beeld ziet                                        |
| :---------------------------------------------- | :------------------------------------------------ | :---------------------------------------------------------- |
| `shared-hint-kijk-naar-de-plek-die-oplicht.mp4` | Kijk naar de plek die oplicht.                    | De piste met één oplichtende, pulserende zone.              |
| `concept-in.mp4`                                | In betekent binnenin, zoals in de piste.          | Een kegel rolt de piste in en blijft binnen de rand liggen. |
| `concept-op.mp4`                                | Op betekent erop, aan de bovenkant.               | Een aap springt bovenop een trommel en blijft zitten.       |
| `concept-boven.mp4`                             | Boven betekent hoog, aan de bovenkant.            | Een ballon zweeft omhoog tot hoog in de nok.                |
| `concept-onder.mp4`                             | Onder betekent lager dan iets anders.             | Een muis loopt onder een opgetilde hoepel door.             |
| `concept-links.mp4`                             | Links is de kant van je linkerhand.               | Een clown loopt naar links; de linkerkant licht kort op.    |
| `concept-rechts.mp4`                            | Rechts is de kant van je rechterhand.             | Een clown loopt naar rechts; de rechterkant licht kort op.  |
| `concept-midden.mp4`                            | Midden is tussen links en rechts.                 | Een trommel schuift precies naar het midden van de vloer.   |
| `concept-naast.mp4`                             | Naast betekent dichtbij aan de zijkant.           | Een poes gaat naast een kegel zitten, opzij.                |
| `concept-tussen.mp4`                            | Tussen betekent in het midden van twee dingen.    | Een kip stapt tussen een hoepel en een kegel in.            |
| `concept-dichtbij.mp4`                          | Dichtbij betekent niet ver weg.                   | Een beer schuifelt dicht naar een trommel toe.              |
| `concept-ver-weg.mp4`                           | Ver weg betekent verder naar achteren in de tent. | Een kanon wordt kleiner en schuift naar de achtergrond.     |

### 3.4 Afbeeldingen en geluid

| Taak     | Type | Wat                                                                                                                                                                                                                                                                                                               | Status |
| :------- | :--: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----: |
| **A-01** |  🎨  | **19 stickers naar WebP** (max 512 px, 30–50 kB) uit de bestaande PNG's: `acrobat`, `pin`, `balloon`, `bear`, `cannon`, `cat`, `chicken`, `clown`, `dog`, `drum`, `elephant`, `flag`, `hoop`, `lion`, `monkey`, `mouse`, `piglet`, `seal`, `unicycle` → `*-sticker.webp`                                          |   ⬜   |
| **A-02** |  🎨  | **Vier obstakels voor Zeg & Vlieg** vervangen (de huidige zijn strand-eigen: haai, zeeleeuw, meeuw, wolk). Nieuw: `confetti-obstacle.png` (wolk confetti), `spotlight-obstacle.png` (schuin schijnend spotlicht), `balloon-bunch-obstacle.png` (tros ballonnen), `flag-garland-obstacle.png` (slinger vlaggetjes) |   ⬜   |
| **A-03** |  🎨  | **Zeven beloningsplaatjes** op dezelfde drempels: `reward-01-sticker-clown` (3 ⭐) · `reward-02-tentkleur-rood` (8 ⭐) · `reward-03-sticker-leeuw` (16 ⭐) · `reward-04-confetti-spoor` (28 ⭐) · `reward-05-circusbezem` (42 ⭐) · `reward-06-sticker-acrobaat` (60 ⭐) · `reward-07-gouden-tent` (85 ⭐)        |   ⬜   |
| **A-04** |  🎨  | **Feedbackgeluiden**: `feedback-correct.wav` en `feedback-wrong.wav` uit het strandspel kopiëren (Kenney, CC0 — hergebruik toegestaan)                                                                                                                                                                            |   ⬜   |
| **A-05** |  🎨  | **Achtergrondmuziek** beoordelen: nu dezelfde als het strandspel. Eventueel een circusdeuntje; anders laten staan                                                                                                                                                                                                 |   ⬜   |
| **A-06** |  🎨  | **Mascotte** beoordelen: nu de strandmascotte (ster). Eventueel een circusdirecteur of jongleur-ster                                                                                                                                                                                                              |   ⬜   |

> De achtergronden (`circus-board-portrait/landscape`, `circus-voice-side-scroller`), het logo (`start-logo-circus.png`) en het wereldicoon (`world-circus.png`) staan er al.

### 3.5 Productievolgorde

1. **A-01** stickers naar WebP — zonder dit flitsen de keuzekaarten leeg.
2. **A-04** geluiden kopiëren — vijf minuten werk, direct effect.
3. **§3.2** de 19 quizvideo's — Kies het Woord is de instapmodus die elk kind als eerste ziet.
4. **§3.3** de 12 gedeelde video's — de begripsuitleg is bij elke opdracht herbruikbaar.
5. **§3.1** de 92 opdrachtvideo's — begin bij `lp-001` t/m `lp-008` (niveau 1), dan niveau 2, dan 3.
6. **A-02** en **A-03** obstakels en beloningen — nodig vóór de release, niet vóór het testen.

---

## 4. Fase 4 — testen

| Taak     | Type | Wat                                                                                                                                                          | Status |
| :------- | :--: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :----: |
| **T-01** |  🔍  | **Unit-tests overnemen** voor alles uit fase 1: bouwkaarten, ontgrendeling, woordbescherming, record, spraakgolf, quizgedrag                                 |   ⬜   |
| **T-02** |  🔍  | **E2e `groot-circus-avontuur.spec.ts`**: startscherm, instellingen, Zeg & Zet (render, typen, mic, tik, feedback, doorgaan)                                  |   ⬜   |
| **T-03** |  🔍  | **E2e `circus-word-choice.spec.ts`**: render, goed/fout, automatisch doorgaan, volledige ronde van 19 vragen                                                 |   ⬜   |
| **T-04** |  🔍  | **E2e `circus-zeg-en-bouw.spec.ts`**: bouwkaart, tik-flow, samengestelde zin, vrij bouwen                                                                    |   ⬜   |
| **T-05** |  🔍  | **E2e `circus-voice-side-scroller.spec.ts`**: start-overlay, HUD, schildjes, ronde loopt                                                                     |   ⬜   |
| **T-06** |  🔍  | **E2e `circus-reward.spec.ts`**: beloningsscherm en navigatie                                                                                                |   ⬜   |
| **T-07** |  🔍  | **Axe-audit** van de circusschermen toevoegen aan de a11y-suite                                                                                              |   ⬜   |
| **T-08** |  🔍  | **Toestelcheck**: spraak in alle modi op Android en iOS, geluid, rustige beweging, portret-guard — zie [checklist](../toegankelijkheid/release-checklist.md) |   ⬜   |

---

## 5. Fase 5 — vrijgeven

| Taak     | Type | Wat                                                                                                                                                  | Status |
| :------- | :--: | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :----: |
| **R-01** |  🔧  | **Offline-pakket** bijwerken: nieuwe video's, WebP-stickers en geluiden in `offline-package.source.json`; manifest opnieuw genereren en meecommitten |   ⬜   |
| **R-02** |  🔧  | **Bundelbudget** controleren: gamechunk ≤ 250 kB gzip, pakket ≤ 200 MB (boven 50 MB vraagt de gate om bevestiging)                                   |   ⬜   |
| **R-03** |  🔧  | **`releaseStatus` op `available`** in `manifest.ts` — hiermee verdwijnt "Binnenkort beschikbaar" en wordt de kaart speelbaar                         |   ⬜   |
| **R-04** |  📄  | **Dossier bijwerken**: statussen in Feature-catalogus en Test-matrix op 🟢; de zone Speciale Woordenschat toont dan twee speelbare games             |   ⬜   |
| **R-05** |  🔍  | **Regressie op het strandspel**: bewijzen dat de tweede game de eerste nergens raakt (gedeelde platformlaag)                                         |   ⬜   |

---

## 6. Volgorde in het kort

```
Fase 1 (code gelijktrekken) ──┐
                              ├──> Fase 4 (testen) ──> Fase 5 (vrijgeven)
Fase 2 (content) ─> Fase 3 (media) ──┘
```

Fase 1 en 2 kunnen parallel lopen met het begin van fase 3: de game is speelbaar zonder video's, dus wachten op media is niet nodig.

## 7. Bewust buiten scope

- **Nieuwe spelmechaniek.** Elke afwijking van het strandspel maakt onderhoud dubbel zo duur. Ideeën horen in de [v2-backlog van het strandspel](../magisch-strand-avontuur/Versie-2-Backlog.md), zodat ze in beide games tegelijk landen.
- **Een derde wereld.** Eerst twee werelden goed af.
- **Een gedeelde UI-bibliotheek tussen de twee games.** Bewust niet — zie [ADR-005](../architectuur/adr-005-gamemodulecontract.md). Kopiëren is hier goedkoper dan koppelen.
