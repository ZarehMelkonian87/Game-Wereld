# 🧱 Takenlijst — Vrolijke Boerderij-Avontuur

> Volledig bouwplan. De game bestaat nu alleen als vergrendelde kaart in de catalogus; alles hieronder moet nog gemaakt worden. Uitgangspunt: **de code van [Magisch Strand-Avontuur](../magisch-strand-avontuur/GDD-index.md) kopiëren** en alleen content en assets vervangen.

| Veld                  | Waarde                                                |
| :-------------------- | :---------------------------------------------------- |
| **Laatst bijgewerkt** | 2026-09-22                                            |
| **Game-id**           | `vrolijke-boerderij-avontuur`                         |
| **Status**            | 🔵 `coming-soon` — vergrendelde kaart in de catalogus |

**Statuslegenda:** ⬜ open · 🟦 in uitvoering · ✅ klaar
**Type:** 🔧 code · 🎨 ontwerp/asset · 🔍 test · 📄 documentatie

## 0. Wat er al staat

| Onderdeel                         | Stand                                                                                                 |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------- |
| Catalogus-kaart met wereldicoon   | ✅ zichtbaar met "Binnenkort beschikbaar"                                                             |
| Manifest (`catalog-manifests.ts`) | ✅ titel, beschrijving, icoon, zone Speciale Woordenschat                                             |
| Ontwerp van de content            | ✅ 14 woorden, 9 zones, 16 opdrachten, 14 vragen, 5 bouwkaarten (zie [woordenlijst](Woordenlijst.md)) |
| Code                              | ⬜ nog geen gamemodule                                                                                |
| Afbeeldingen, video's, geluiden   | ⬜ niets                                                                                              |

---

## 1. Fase 1 — de gamemodule opzetten

> Kopieer `src/app/games/magisch-strand-avontuur/` naar `src/app/games/vrolijke-boerderij-avontuur/` en vervang daarna uitsluitend content, teksten en assets. Neem de tests mee.

| Taak     | Type | Wat                                                                                                                                     | Status |
| :------- | :--: | :-------------------------------------------------------------------------------------------------------------------------------------- | :----: |
| **C-01** |  🔧  | Gamemap aanmaken als kopie van het strandspel; namen en id's omzetten naar `vrolijke-boerderij-avontuur`                                |   ⬜   |
| **C-02** |  🔧  | `manifest.ts` in de gamemap; de placeholder uit `catalog-manifests.ts` verwijderen en de game in de registry zetten met een lazy loader |   ⬜   |
| **C-03** |  🔧  | `content.ts` vullen: 14 objecten met lidwoord, meervoud, categorie, niveau en sticker                                                   |   ⬜   |
| **C-04** |  🔧  | Zones vastleggen met hun polygonen en ondersteunde begrippen (9 stuks)                                                                  |   ⬜   |
| **C-05** |  🔧  | 16 Zeg & Zet-opdrachten met hint, nazegzin en (waar nodig) ankerobjecten                                                                |   ⬜   |
| **C-06** |  🔧  | 14 Kies het Woord-vragen met oplopende afleiderstrategie                                                                                |   ⬜   |
| **C-07** |  🔧  | 5 bouwkaarten voor Zeg & Bouw (§2.1)                                                                                                    |   ⬜   |
| **C-08** |  🔧  | Zeg & Vlieg-woorden en kindertaal-aliassen (8 woorden)                                                                                  |   ⬜   |
| **C-09** |  🔧  | Aliassen voor objecten, zones en begrippen in de commando-parser                                                                        |   ⬜   |
| **C-10** |  🔧  | Beloningstabel met boerderij-items op de bekende drempels (§3.4)                                                                        |   ⬜   |
| **C-11** |  🔧  | Offline-pakket: `offline-package.source.json` + manifest genereren                                                                      |   ⬜   |
| **C-12** |  🔧  | Vite-chunk en dependency-cruiser-regel voor de nieuwe gamemap                                                                           |   ⬜   |

**Klaar wanneer:** een diff met het strandspel alleen nog verschillen in content, teksten en assets laat zien.

## 2. Fase 2 — content vastleggen

Het ontwerp staat al in de [woordenlijst](Woordenlijst.md); deze fase is het invoeren en nalopen ervan met een taalkundige blik (lidwoorden, meervouden, of de zinnen natuurlijk klinken voor een kind van vier).

### 2.1 De vijf bouwkaarten

| Kaart                  | Opdracht                                         | Doel | Passende objecten          |
| :--------------------- | :----------------------------------------------- | :--: | :------------------------- |
| `build-weidedieren`    | Maak een wei vol dieren! Zet 3 dieren in de wei. |  3   | koe, paard, schaap, varken |
| `build-erfdieren`      | Zet 2 dieren op het erf.                         |  2   | geit, ezel, konijn, eend   |
| `build-werkspullen`    | Zet 2 dingen neer waarmee de boer werkt.         |  2   | tractor, kruiwagen, emmer  |
| `build-etenstijd`      | Zet 2 dingen neer die met eten te maken hebben.  |  2   | appel, emmer, hooibaal     |
| `build-jouw-boerderij` | Maak jouw mooiste boerderij! Kies zelf 3 dingen. |  3   | alles mag                  |

---

## 3. Fase 3 — media produceren

**Productieregels:** clips van 2–5 seconden · sticker- en papierstijl · geen tekst in beeld, de voice-over draagt de opdracht · rustige Nederlandse uitspraak · 480p, enkele honderden kB · kebab-case bestandsnamen · map `assets/instructions/`.

Zolang een video ontbreekt, leest de stem de opdracht voor — de game is dus speelbaar vóórdat de media klaar zijn.

### 3.1 Video's bij de plaatsingsopdrachten — 16 × 4 = 64 clips

| ID     | Bestandsnaam                                                       | Gesproken tekst                               | Wat je in beeld ziet                                                                         |
| :----- | :----------------------------------------------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------------------------- |
| lp-001 | `lp-001-opdracht-zet-de-koe-in-de-wei.mp4`                         | Zet de koe in de wei.                         | De wereld met de koe in de objectbalk; een hand pakt het en zet het op de juiste plek.       |
| lp-001 | `lp-001-hint-01-zoek-de-koe.mp4`                                   | Zoek de koe.                                  | De objectbalk onderin; de koe licht op en wipt even.                                         |
| lp-001 | `lp-001-hint-02-kijk-naar-koe.mp4`                                 | Kijk naar het plaatje dat oplicht: koe.       | Alleen de koe blijft helder, de rest vervaagt.                                               |
| lp-001 | `lp-001-feedback-de-koe-staat-in-de-wei.mp4`                       | De koe staat in de wei.                       | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-002 | `lp-002-opdracht-zet-de-eend-in-de-vijver.mp4`                     | Zet de eend in de vijver.                     | De wereld met de eend in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-002 | `lp-002-hint-01-zoek-de-eend.mp4`                                  | Zoek de eend.                                 | De objectbalk onderin; de eend licht op en wipt even.                                        |
| lp-002 | `lp-002-hint-02-kijk-naar-eend.mp4`                                | Kijk naar het plaatje dat oplicht: eend.      | Alleen de eend blijft helder, de rest vervaagt.                                              |
| lp-002 | `lp-002-feedback-de-eend-zwemt-in-de-vijver.mp4`                   | De eend zwemt in de vijver.                   | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-003 | `lp-003-opdracht-zet-de-tractor-op-het-erf.mp4`                    | Zet de tractor op het erf.                    | De wereld met de tractor in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-003 | `lp-003-hint-01-zoek-de-tractor.mp4`                               | Zoek de tractor.                              | De objectbalk onderin; de tractor licht op en wipt even.                                     |
| lp-003 | `lp-003-hint-02-kijk-naar-tractor.mp4`                             | Kijk naar het plaatje dat oplicht: tractor.   | Alleen de tractor blijft helder, de rest vervaagt.                                           |
| lp-003 | `lp-003-feedback-de-tractor-staat-op-het-erf.mp4`                  | De tractor staat op het erf.                  | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-004 | `lp-004-opdracht-zet-de-schuur-op-het-erf.mp4`                     | Zet de schuur op het erf.                     | De wereld met de schuur in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-004 | `lp-004-hint-01-zoek-de-schuur.mp4`                                | Zoek de schuur.                               | De objectbalk onderin; de schuur licht op en wipt even.                                      |
| lp-004 | `lp-004-hint-02-kijk-naar-schuur.mp4`                              | Kijk naar het plaatje dat oplicht: schuur.    | Alleen de schuur blijft helder, de rest vervaagt.                                            |
| lp-004 | `lp-004-feedback-de-schuur-staat-op-het-erf.mp4`                   | De schuur staat op het erf.                   | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-005 | `lp-005-opdracht-zet-de-geit-op-het-erf.mp4`                       | Zet de geit op het erf.                       | De wereld met de geit in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-005 | `lp-005-hint-01-zoek-de-geit.mp4`                                  | Zoek de geit.                                 | De objectbalk onderin; de geit licht op en wipt even.                                        |
| lp-005 | `lp-005-hint-02-kijk-naar-geit.mp4`                                | Kijk naar het plaatje dat oplicht: geit.      | Alleen de geit blijft helder, de rest vervaagt.                                              |
| lp-005 | `lp-005-feedback-de-geit-staat-op-het-erf.mp4`                     | De geit staat op het erf.                     | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-006 | `lp-006-opdracht-zet-het-paard-in-de-wei.mp4`                      | Zet het paard in de wei.                      | De wereld met het paard in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-006 | `lp-006-hint-01-zoek-het-paard.mp4`                                | Zoek het paard.                               | De objectbalk onderin; het paard licht op en wipt even.                                      |
| lp-006 | `lp-006-hint-02-kijk-naar-paard.mp4`                               | Kijk naar het plaatje dat oplicht: paard.     | Alleen het paard blijft helder, de rest vervaagt.                                            |
| lp-006 | `lp-006-feedback-het-paard-staat-in-de-wei.mp4`                    | Het paard staat in de wei.                    | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-007 | `lp-007-opdracht-zet-de-emmer-op-het-erf.mp4`                      | Zet de emmer op het erf.                      | De wereld met de emmer in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-007 | `lp-007-hint-01-zoek-de-emmer.mp4`                                 | Zoek de emmer.                                | De objectbalk onderin; de emmer licht op en wipt even.                                       |
| lp-007 | `lp-007-hint-02-kijk-naar-emmer.mp4`                               | Kijk naar het plaatje dat oplicht: emmer.     | Alleen de emmer blijft helder, de rest vervaagt.                                             |
| lp-007 | `lp-007-feedback-de-emmer-staat-op-het-erf.mp4`                    | De emmer staat op het erf.                    | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-008 | `lp-008-opdracht-zet-het-konijn-op-de-hooibaal.mp4`                | Zet het konijn op de hooibaal.                | De wereld met het konijn in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-008 | `lp-008-hint-01-zoek-het-konijn.mp4`                               | Zoek het konijn.                              | De objectbalk onderin; het konijn licht op en wipt even.                                     |
| lp-008 | `lp-008-hint-02-kijk-naar-konijn.mp4`                              | Kijk naar het plaatje dat oplicht: konijn.    | Alleen het konijn blijft helder, de rest vervaagt.                                           |
| lp-008 | `lp-008-feedback-het-konijn-zit-op-de-hooibaal.mp4`                | Het konijn zit op de hooibaal.                | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-009 | `lp-009-opdracht-zet-de-ezel-naast-de-kruiwagen.mp4`               | Zet de ezel naast de kruiwagen.               | De wereld met de ezel in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-009 | `lp-009-hint-01-zoek-de-ezel.mp4`                                  | Zoek de ezel.                                 | De objectbalk onderin; de ezel licht op en wipt even.                                        |
| lp-009 | `lp-009-hint-02-kijk-naar-ezel.mp4`                                | Kijk naar het plaatje dat oplicht: ezel.      | Alleen de ezel blijft helder, de rest vervaagt.                                              |
| lp-009 | `lp-009-feedback-de-ezel-staat-naast-de-kruiwagen.mp4`             | De ezel staat naast de kruiwagen.             | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-010 | `lp-010-opdracht-zet-het-schaap-rechts-op-het-erf.mp4`             | Zet het schaap rechts op het erf.             | De wereld met het schaap in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-010 | `lp-010-hint-01-zoek-het-schaap.mp4`                               | Zoek het schaap.                              | De objectbalk onderin; het schaap licht op en wipt even.                                     |
| lp-010 | `lp-010-hint-02-kijk-naar-schaap.mp4`                              | Kijk naar het plaatje dat oplicht: schaap.    | Alleen het schaap blijft helder, de rest vervaagt.                                           |
| lp-010 | `lp-010-feedback-het-schaap-staat-rechts-op-het-erf.mp4`           | Het schaap staat rechts op het erf.           | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-011 | `lp-011-opdracht-zet-de-appel-boven-de-wei.mp4`                    | Zet de appel boven de wei.                    | De wereld met de appel in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-011 | `lp-011-hint-01-zoek-de-appel.mp4`                                 | Zoek de appel.                                | De objectbalk onderin; de appel licht op en wipt even.                                       |
| lp-011 | `lp-011-hint-02-kijk-naar-appel.mp4`                               | Kijk naar het plaatje dat oplicht: appel.     | Alleen de appel blijft helder, de rest vervaagt.                                             |
| lp-011 | `lp-011-feedback-de-appel-zweeft-boven-de-wei.mp4`                 | De appel zweeft boven de wei.                 | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-012 | `lp-012-opdracht-leg-de-hooibaal-midden-op-het-erf.mp4`            | Leg de hooibaal midden op het erf.            | De wereld met de hooibaal in de objectbalk; een hand pakt het en zet het op de juiste plek.  |
| lp-012 | `lp-012-hint-01-zoek-de-hooibaal.mp4`                              | Zoek de hooibaal.                             | De objectbalk onderin; de hooibaal licht op en wipt even.                                    |
| lp-012 | `lp-012-hint-02-kijk-naar-hooibaal.mp4`                            | Kijk naar het plaatje dat oplicht: hooibaal.  | Alleen de hooibaal blijft helder, de rest vervaagt.                                          |
| lp-012 | `lp-012-feedback-de-hooibaal-ligt-midden-op-het-erf.mp4`           | De hooibaal ligt midden op het erf.           | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-013 | `lp-013-opdracht-zet-het-varken-links-in-de-wei.mp4`               | Zet het varken links in de wei.               | De wereld met het varken in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-013 | `lp-013-hint-01-zoek-het-varken.mp4`                               | Zoek het varken.                              | De objectbalk onderin; het varken licht op en wipt even.                                     |
| lp-013 | `lp-013-hint-02-kijk-naar-varken.mp4`                              | Kijk naar het plaatje dat oplicht: varken.    | Alleen het varken blijft helder, de rest vervaagt.                                           |
| lp-013 | `lp-013-feedback-het-varken-staat-links-in-de-wei.mp4`             | Het varken staat links in de wei.             | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-014 | `lp-014-opdracht-zet-de-kruiwagen-ver-weg-boven-de-wei.mp4`        | Zet de kruiwagen ver weg boven de wei.        | De wereld met de kruiwagen in de objectbalk; een hand pakt het en zet het op de juiste plek. |
| lp-014 | `lp-014-hint-01-zoek-de-kruiwagen.mp4`                             | Zoek de kruiwagen.                            | De objectbalk onderin; de kruiwagen licht op en wipt even.                                   |
| lp-014 | `lp-014-hint-02-kijk-naar-kruiwagen.mp4`                           | Kijk naar het plaatje dat oplicht: kruiwagen. | Alleen de kruiwagen blijft helder, de rest vervaagt.                                         |
| lp-014 | `lp-014-feedback-de-kruiwagen-staat-ver-weg-boven-de-wei.mp4`      | De kruiwagen staat ver weg boven de wei.      | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-015 | `lp-015-opdracht-zet-de-emmer-dichtbij-de-koe.mp4`                 | Zet de emmer dichtbij de koe.                 | De wereld met de emmer in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-015 | `lp-015-hint-01-zoek-de-emmer.mp4`                                 | Zoek de emmer.                                | De objectbalk onderin; de emmer licht op en wipt even.                                       |
| lp-015 | `lp-015-hint-02-kijk-naar-emmer.mp4`                               | Kijk naar het plaatje dat oplicht: emmer.     | Alleen de emmer blijft helder, de rest vervaagt.                                             |
| lp-015 | `lp-015-feedback-de-emmer-staat-dichtbij-de-koe.mp4`               | De emmer staat dichtbij de koe.               | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |
| lp-016 | `lp-016-opdracht-leg-de-appel-tussen-de-emmer-en-de-hooibaal.mp4`  | Leg de appel tussen de emmer en de hooibaal.  | De wereld met de appel in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-016 | `lp-016-hint-01-zoek-de-appel.mp4`                                 | Zoek de appel.                                | De objectbalk onderin; de appel licht op en wipt even.                                       |
| lp-016 | `lp-016-hint-02-kijk-naar-appel.mp4`                               | Kijk naar het plaatje dat oplicht: appel.     | Alleen de appel blijft helder, de rest vervaagt.                                             |
| lp-016 | `lp-016-feedback-de-appel-ligt-tussen-de-emmer-en-de-hooibaal.mp4` | De appel ligt tussen de emmer en de hooibaal. | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                     |

### 3.2 Video's bij de quizvragen — 14 clips

| ID     | Bestandsnaam                               | Gesproken tekst       | Wat je in beeld ziet                                                      |
| :----- | :----------------------------------------- | :-------------------- | :------------------------------------------------------------------------ |
| cw-001 | `cw-001-opdracht-waar-is-de-koe.mp4`       | Waar is de koe?       | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-002 | `cw-002-opdracht-waar-is-de-geit.mp4`      | Waar is de geit?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-003 | `cw-003-opdracht-waar-is-de-tractor.mp4`   | Waar is de tractor?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-004 | `cw-004-opdracht-waar-is-het-paard.mp4`    | Waar is het paard?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-005 | `cw-005-opdracht-waar-is-de-eend.mp4`      | Waar is de eend?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-006 | `cw-006-opdracht-waar-is-de-ezel.mp4`      | Waar is de ezel?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-007 | `cw-007-opdracht-waar-is-het-konijn.mp4`   | Waar is het konijn?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-008 | `cw-008-opdracht-waar-is-de-schuur.mp4`    | Waar is de schuur?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-009 | `cw-009-opdracht-waar-is-het-varken.mp4`   | Waar is het varken?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-010 | `cw-010-opdracht-waar-is-het-schaap.mp4`   | Waar is het schaap?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-011 | `cw-011-opdracht-waar-is-de-hooibaal.mp4`  | Waar is de hooibaal?  | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-012 | `cw-012-opdracht-waar-is-de-kruiwagen.mp4` | Waar is de kruiwagen? | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-013 | `cw-013-opdracht-waar-is-de-appel.mp4`     | Waar is de appel?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-014 | `cw-014-opdracht-waar-is-de-emmer.mp4`     | Waar is de emmer?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |

### 3.3 Gedeelde video's — 12 clips

| Bestandsnaam                                    | Gesproken tekst                                | Wat je in beeld ziet                                             |
| :---------------------------------------------- | :--------------------------------------------- | :--------------------------------------------------------------- |
| `shared-hint-kijk-naar-de-plek-die-oplicht.mp4` | Kijk naar de plek die oplicht.                 | De wereld met één oplichtende, pulserende zone.                  |
| `concept-in.mp4`                                | In betekent binnenin.                          | Een voorwerp gaat een omsloten plek in en blijft binnen de rand. |
| `concept-op.mp4`                                | Op betekent erop, aan de bovenkant.            | Een voorwerp komt bovenop iets anders te staan.                  |
| `concept-boven.mp4`                             | Boven betekent hoog, aan de bovenkant.         | Een voorwerp zweeft omhoog naar de bovenkant van het beeld.      |
| `concept-onder.mp4`                             | Onder betekent lager dan iets anders.          | Een voorwerp schuift onder iets anders door.                     |
| `concept-links.mp4`                             | Links is de kant van je linkerhand.            | Een voorwerp schuift naar links; links licht kort op.            |
| `concept-rechts.mp4`                            | Rechts is de kant van je rechterhand.          | Een voorwerp schuift naar rechts; rechts licht kort op.          |
| `concept-midden.mp4`                            | Midden is tussen links en rechts.              | Een voorwerp schuift precies naar het midden.                    |
| `concept-naast.mp4`                             | Naast betekent dichtbij aan de zijkant.        | Een voorwerp komt opzij van een ander te staan.                  |
| `concept-tussen.mp4`                            | Tussen betekent in het midden van twee dingen. | Een voorwerp stapt tussen twee andere in.                        |
| `concept-dichtbij.mp4`                          | Dichtbij betekent niet ver weg.                | Een voorwerp schuift dicht naar een ander toe.                   |
| `concept-ver-weg.mp4`                           | Ver weg betekent verder naar achteren.         | Een voorwerp wordt kleiner en schuift naar de achtergrond.       |

### 3.4 Afbeeldingen en geluid

| Taak     | Type | Wat                                                                                                    | Status |
| :------- | :--: | :----------------------------------------------------------------------------------------------------- | :----: |
| **A-01** |  🎨  | **14 stickers** (WebP, max 512 px, 30–50 kB) — zie de tabel hieronder                                  |   ⬜   |
| **A-02** |  🎨  | **Vier obstakels** voor Zeg & Vlieg (PNG met transparantie)                                            |   ⬜   |
| **A-03** |  🎨  | **Zeven beloningsplaatjes** op de bekende drempels                                                     |   ⬜   |
| **A-04** |  🎨  | **Achtergrond** van de wereld in portret én landschap (WebP), plus een brede vliegachtergrond          |   ⬜   |
| **A-05** |  🎨  | **Logo en wereldicoon** — het icoon bestaat al (`world-boerderij.webp`); een startlogo moet nog        |   ⬜   |
| **A-06** |  🎨  | **Feedbackgeluiden**: `feedback-correct.wav` en `feedback-wrong.wav` uit het strandspel kopiëren (CC0) |   ⬜   |
| **A-07** |  🎨  | **Achtergrondmuziek** kiezen of die van het strandspel hergebruiken                                    |   ⬜   |
| **A-08** |  🎨  | **Mascotte** hergebruiken of een wereld-eigen variant tekenen                                          |   ⬜   |

#### Stickers (A-01)

| Bestandsnaam               | Woord     | Wat erop staat                      |
| :------------------------- | :-------- | :---------------------------------- |
| `cow-sticker.webp`         | koe       | Een koe die in de wei staat.        |
| `goat-sticker.webp`        | geit      | Een geit die gras eet.              |
| `horse-sticker.webp`       | paard     | Een paard dat door de wei draaft.   |
| `pig-sticker.webp`         | varken    | Een roze varken bij de schuur.      |
| `sheep-sticker.webp`       | schaap    | Een wollig schaap in de wei.        |
| `duck-sticker.webp`        | eend      | Een eend die in de vijver zwemt.    |
| `donkey-sticker.webp`      | ezel      | Een ezel met lange oren.            |
| `rabbit-sticker.webp`      | konijn    | Een konijn dat huppelt.             |
| `tractor-sticker.webp`     | tractor   | Een tractor die over het erf rijdt. |
| `wheelbarrow-sticker.webp` | kruiwagen | Een kruiwagen vol hooi.             |
| `bucket-sticker.webp`      | emmer     | Een emmer met melk.                 |
| `haybale-sticker.webp`     | hooibaal  | Een grote baal hooi.                |
| `apple-sticker.webp`       | appel     | Een rode appel van de boom.         |
| `barn-sticker.webp`        | schuur    | De rode schuur van de boer.         |

#### Obstakels (A-02)

| Bestandsnaam              | Wat je ziet                 |
| :------------------------ | :-------------------------- |
| `hooivork-obstacle.png`   | een rechtopstaande hooivork |
| `bijenzwerm-obstacle.png` | een zoemende zwerm bijen    |
| `regenwolk-obstacle.png`  | een donkere regenwolk       |
| `hek-obstacle.png`        | een houten hek              |

#### Beloningen (A-03)

| Drempel | Bestandsnaam                |
| :------ | :-------------------------- |
| 3 ⭐    | `reward-01-sticker-koe`     |
| 8 ⭐    | `reward-02-erfkleur-groen`  |
| 16 ⭐   | `reward-03-sticker-paard`   |
| 28 ⭐   | `reward-04-hooi-spoor`      |
| 42 ⭐   | `reward-05-boerenbezem`     |
| 60 ⭐   | `reward-06-sticker-tractor` |
| 85 ⭐   | `reward-07-gouden-molen`    |

### 3.5 Productievolgorde

1. **A-01** stickers — zonder plaatjes is geen enkele modus speelbaar.
2. **A-04** achtergronden — daarna staat de wereld er.
3. **A-06** geluiden kopiëren — vijf minuten werk.
4. **§3.2** de 14 quizvideo's — Kies het Woord is de instapmodus.
5. **§3.3** de 12 gedeelde video's.
6. **§3.1** de 64 opdrachtvideo's, te beginnen bij niveau 1.
7. **A-02**, **A-03**, **A-05** — nodig vóór de release, niet vóór het testen.

**Totaal aan video's: 90.**

---

## 4. Fase 4 — testen

| Taak     | Type | Wat                                                                             | Status |
| :------- | :--: | :------------------------------------------------------------------------------ | :----: |
| **T-01** |  🔍  | Unit-tests meenemen uit het strandspel en op deze content richten               |   ⬜   |
| **T-02** |  🔍  | E2e-suite voor Zeg & Zet (render, typen, mic, tik, feedback, doorgaan)          |   ⬜   |
| **T-03** |  🔍  | E2e-suite voor Kies het Woord (volledige ronde van 14 vragen)                   |   ⬜   |
| **T-04** |  🔍  | E2e-suite voor Zeg & Bouw (bouwkaart, samengestelde zin, vrij bouwen)           |   ⬜   |
| **T-05** |  🔍  | E2e-suite voor Zeg & Vlieg (start-overlay, HUD, schildjes)                      |   ⬜   |
| **T-06** |  🔍  | E2e-suite voor het beloningsscherm                                              |   ⬜   |
| **T-07** |  🔍  | Axe-audit van de nieuwe schermen                                                |   ⬜   |
| **T-08** |  🔍  | Toestelcheck: spraak, geluid, rustige beweging, portret-guard op Android en iOS |   ⬜   |

## 5. Fase 5 — vrijgeven

| Taak     | Type | Wat                                                                 | Status |
| :------- | :--: | :------------------------------------------------------------------ | :----: |
| **R-01** |  🔧  | Offline-pakket compleet maken en het manifest meecommitten          |   ⬜   |
| **R-02** |  🔧  | Bundelbudget controleren (gamechunk ≤ 250 kB gzip, pakket ≤ 200 MB) |   ⬜   |
| **R-03** |  🔧  | `releaseStatus` op `available` — de kaart wordt speelbaar           |   ⬜   |
| **R-04** |  📄  | Dossier bijwerken: statussen op 🟢                                  |   ⬜   |
| **R-05** |  🔍  | Regressie op de al vrijgegeven games                                |   ⬜   |

## 6. Bewust buiten scope

- **Nieuwe spelmechaniek.** Elke afwijking maakt onderhoud duurder; ideeën horen in de [v2-backlog van het strandspel](../magisch-strand-avontuur/Versie-2-Backlog.md).
- **Gedeelde code tussen de games.** Bewust niet — zie [ADR-005](../architectuur/adr-005-gamemodulecontract.md).
