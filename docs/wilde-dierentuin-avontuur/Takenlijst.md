# 🧱 Takenlijst — Wilde Dierentuin-Avontuur

> Volledig bouwplan. De game bestaat nu alleen als vergrendelde kaart in de catalogus; alles hieronder moet nog gemaakt worden. Uitgangspunt: **de code van [Magisch Strand-Avontuur](../magisch-strand-avontuur/GDD-index.md) kopiëren** en alleen content en assets vervangen.

| Veld                  | Waarde                                                |
| :-------------------- | :---------------------------------------------------- |
| **Laatst bijgewerkt** | 2026-09-22                                            |
| **Game-id**           | `wilde-dierentuin-avontuur`                           |
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

> Kopieer `src/app/games/magisch-strand-avontuur/` naar `src/app/games/wilde-dierentuin-avontuur/` en vervang daarna uitsluitend content, teksten en assets. Neem de tests mee.

| Taak     | Type | Wat                                                                                                                                     | Status |
| :------- | :--: | :-------------------------------------------------------------------------------------------------------------------------------------- | :----: |
| **C-01** |  🔧  | Gamemap aanmaken als kopie van het strandspel; namen en id's omzetten naar `wilde-dierentuin-avontuur`                                  |   ⬜   |
| **C-02** |  🔧  | `manifest.ts` in de gamemap; de placeholder uit `catalog-manifests.ts` verwijderen en de game in de registry zetten met een lazy loader |   ⬜   |
| **C-03** |  🔧  | `content.ts` vullen: 14 objecten met lidwoord, meervoud, categorie, niveau en sticker                                                   |   ⬜   |
| **C-04** |  🔧  | Zones vastleggen met hun polygonen en ondersteunde begrippen (9 stuks)                                                                  |   ⬜   |
| **C-05** |  🔧  | 16 Zeg & Zet-opdrachten met hint, nazegzin en (waar nodig) ankerobjecten                                                                |   ⬜   |
| **C-06** |  🔧  | 14 Kies het Woord-vragen met oplopende afleiderstrategie                                                                                |   ⬜   |
| **C-07** |  🔧  | 5 bouwkaarten voor Zeg & Bouw (§2.1)                                                                                                    |   ⬜   |
| **C-08** |  🔧  | Zeg & Vlieg-woorden en kindertaal-aliassen (8 woorden)                                                                                  |   ⬜   |
| **C-09** |  🔧  | Aliassen voor objecten, zones en begrippen in de commando-parser                                                                        |   ⬜   |
| **C-10** |  🔧  | Beloningstabel met dierentuin-items op de bekende drempels (§3.4)                                                                       |   ⬜   |
| **C-11** |  🔧  | Offline-pakket: `offline-package.source.json` + manifest genereren                                                                      |   ⬜   |
| **C-12** |  🔧  | Vite-chunk en dependency-cruiser-regel voor de nieuwe gamemap                                                                           |   ⬜   |

**Klaar wanneer:** een diff met het strandspel alleen nog verschillen in content, teksten en assets laat zien.

## 2. Fase 2 — content vastleggen

Het ontwerp staat al in de [woordenlijst](Woordenlijst.md); deze fase is het invoeren en nalopen ervan met een taalkundige blik (lidwoorden, meervouden, of de zinnen natuurlijk klinken voor een kind van vier).

### 2.1 De vijf bouwkaarten

| Kaart                   | Opdracht                                          | Doel | Passende objecten                  |
| :---------------------- | :------------------------------------------------ | :--: | :--------------------------------- |
| `build-waterdieren`     | Zet 2 dieren in de vijver.                        |  2   | krokodil, nijlpaard, pinguin       |
| `build-grotedieren`     | Zet 3 grote dieren op het gras.                   |  3   | giraf, olifant, leeuw, beer, zebra |
| `build-klimmers`        | Zet 2 dieren neer die klimmen of vliegen.         |  2   | aap, papegaai, slang               |
| `build-verblijf`        | Zet 2 dingen neer die bij het verblijf horen.     |  2   | hek, boom, emmer, rots             |
| `build-jouw-dierentuin` | Maak jouw mooiste dierentuin! Kies zelf 3 dieren. |  3   | alles mag                          |

---

## 3. Fase 3 — media produceren

**Productieregels:** clips van 2–5 seconden · sticker- en papierstijl · geen tekst in beeld, de voice-over draagt de opdracht · rustige Nederlandse uitspraak · 480p, enkele honderden kB · kebab-case bestandsnamen · map `assets/instructions/`.

Zolang een video ontbreekt, leest de stem de opdracht voor — de game is dus speelbaar vóórdat de media klaar zijn.

### 3.1 Video's bij de plaatsingsopdrachten — 16 × 4 = 64 clips

| ID     | Bestandsnaam                                                     | Gesproken tekst                               | Wat je in beeld ziet                                                                          |
| :----- | :--------------------------------------------------------------- | :-------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| lp-001 | `lp-001-opdracht-zet-de-krokodil-in-de-vijver.mp4`               | Zet de krokodil in de vijver.                 | De wereld met de krokodil in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-001 | `lp-001-hint-01-zoek-de-krokodil.mp4`                            | Zoek de krokodil.                             | De objectbalk onderin; de krokodil licht op en wipt even.                                     |
| lp-001 | `lp-001-hint-02-kijk-naar-krokodil.mp4`                          | Kijk naar het plaatje dat oplicht: krokodil.  | Alleen de krokodil blijft helder, de rest vervaagt.                                           |
| lp-001 | `lp-001-feedback-de-krokodil-ligt-in-de-vijver.mp4`              | De krokodil ligt in de vijver.                | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-002 | `lp-002-opdracht-zet-de-leeuw-op-de-rots.mp4`                    | Zet de leeuw op de rots.                      | De wereld met de leeuw in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-002 | `lp-002-hint-01-zoek-de-leeuw.mp4`                               | Zoek de leeuw.                                | De objectbalk onderin; de leeuw licht op en wipt even.                                        |
| lp-002 | `lp-002-hint-02-kijk-naar-leeuw.mp4`                             | Kijk naar het plaatje dat oplicht: leeuw.     | Alleen de leeuw blijft helder, de rest vervaagt.                                              |
| lp-002 | `lp-002-feedback-de-leeuw-ligt-op-de-rots.mp4`                   | De leeuw ligt op de rots.                     | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-003 | `lp-003-opdracht-zet-de-giraf-op-het-gras.mp4`                   | Zet de giraf op het gras.                     | De wereld met de giraf in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-003 | `lp-003-hint-01-zoek-de-giraf.mp4`                               | Zoek de giraf.                                | De objectbalk onderin; de giraf licht op en wipt even.                                        |
| lp-003 | `lp-003-hint-02-kijk-naar-giraf.mp4`                             | Kijk naar het plaatje dat oplicht: giraf.     | Alleen de giraf blijft helder, de rest vervaagt.                                              |
| lp-003 | `lp-003-feedback-de-giraf-staat-op-het-gras.mp4`                 | De giraf staat op het gras.                   | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-004 | `lp-004-opdracht-zet-de-olifant-op-het-gras.mp4`                 | Zet de olifant op het gras.                   | De wereld met de olifant in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-004 | `lp-004-hint-01-zoek-de-olifant.mp4`                             | Zoek de olifant.                              | De objectbalk onderin; de olifant licht op en wipt even.                                      |
| lp-004 | `lp-004-hint-02-kijk-naar-olifant.mp4`                           | Kijk naar het plaatje dat oplicht: olifant.   | Alleen de olifant blijft helder, de rest vervaagt.                                            |
| lp-004 | `lp-004-feedback-de-olifant-staat-op-het-gras.mp4`               | De olifant staat op het gras.                 | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-005 | `lp-005-opdracht-zet-de-papegaai-boven-de-dierentuin.mp4`        | Zet de papegaai boven de dierentuin.          | De wereld met de papegaai in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-005 | `lp-005-hint-01-zoek-de-papegaai.mp4`                            | Zoek de papegaai.                             | De objectbalk onderin; de papegaai licht op en wipt even.                                     |
| lp-005 | `lp-005-hint-02-kijk-naar-papegaai.mp4`                          | Kijk naar het plaatje dat oplicht: papegaai.  | Alleen de papegaai blijft helder, de rest vervaagt.                                           |
| lp-005 | `lp-005-feedback-de-papegaai-vliegt-boven-de-dierentuin.mp4`     | De papegaai vliegt boven de dierentuin.       | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-006 | `lp-006-opdracht-zet-het-nijlpaard-in-de-vijver.mp4`             | Zet het nijlpaard in de vijver.               | De wereld met het nijlpaard in de objectbalk; een hand pakt het en zet het op de juiste plek. |
| lp-006 | `lp-006-hint-01-zoek-het-nijlpaard.mp4`                          | Zoek het nijlpaard.                           | De objectbalk onderin; het nijlpaard licht op en wipt even.                                   |
| lp-006 | `lp-006-hint-02-kijk-naar-nijlpaard.mp4`                         | Kijk naar het plaatje dat oplicht: nijlpaard. | Alleen het nijlpaard blijft helder, de rest vervaagt.                                         |
| lp-006 | `lp-006-feedback-het-nijlpaard-ligt-in-de-vijver.mp4`            | Het nijlpaard ligt in de vijver.              | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-007 | `lp-007-opdracht-zet-de-boom-op-het-gras.mp4`                    | Zet de boom op het gras.                      | De wereld met de boom in de objectbalk; een hand pakt het en zet het op de juiste plek.       |
| lp-007 | `lp-007-hint-01-zoek-de-boom.mp4`                                | Zoek de boom.                                 | De objectbalk onderin; de boom licht op en wipt even.                                         |
| lp-007 | `lp-007-hint-02-kijk-naar-boom.mp4`                              | Kijk naar het plaatje dat oplicht: boom.      | Alleen de boom blijft helder, de rest vervaagt.                                               |
| lp-007 | `lp-007-feedback-de-boom-staat-op-het-gras.mp4`                  | De boom staat op het gras.                    | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-008 | `lp-008-opdracht-zet-de-aap-op-de-boom.mp4`                      | Zet de aap op de boom.                        | De wereld met de aap in de objectbalk; een hand pakt het en zet het op de juiste plek.        |
| lp-008 | `lp-008-hint-01-zoek-de-aap.mp4`                                 | Zoek de aap.                                  | De objectbalk onderin; de aap licht op en wipt even.                                          |
| lp-008 | `lp-008-hint-02-kijk-naar-aap.mp4`                               | Kijk naar het plaatje dat oplicht: aap.       | Alleen de aap blijft helder, de rest vervaagt.                                                |
| lp-008 | `lp-008-feedback-de-aap-zit-op-de-boom.mp4`                      | De aap zit op de boom.                        | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-009 | `lp-009-opdracht-leg-de-slang-naast-de-rots.mp4`                 | Leg de slang naast de rots.                   | De wereld met de slang in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-009 | `lp-009-hint-01-zoek-de-slang.mp4`                               | Zoek de slang.                                | De objectbalk onderin; de slang licht op en wipt even.                                        |
| lp-009 | `lp-009-hint-02-kijk-naar-slang.mp4`                             | Kijk naar het plaatje dat oplicht: slang.     | Alleen de slang blijft helder, de rest vervaagt.                                              |
| lp-009 | `lp-009-feedback-de-slang-ligt-naast-de-rots.mp4`                | De slang ligt naast de rots.                  | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-010 | `lp-010-opdracht-zet-de-zebra-rechts-op-het-gras.mp4`            | Zet de zebra rechts op het gras.              | De wereld met de zebra in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-010 | `lp-010-hint-01-zoek-de-zebra.mp4`                               | Zoek de zebra.                                | De objectbalk onderin; de zebra licht op en wipt even.                                        |
| lp-010 | `lp-010-hint-02-kijk-naar-zebra.mp4`                             | Kijk naar het plaatje dat oplicht: zebra.     | Alleen de zebra blijft helder, de rest vervaagt.                                              |
| lp-010 | `lp-010-feedback-de-zebra-staat-rechts-op-het-gras.mp4`          | De zebra staat rechts op het gras.            | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-011 | `lp-011-opdracht-zet-de-pinguin-boven-de-vijver.mp4`             | Zet de pinguïn boven de vijver.               | De wereld met de pinguïn in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-011 | `lp-011-hint-01-zoek-de-pinguin.mp4`                             | Zoek de pinguïn.                              | De objectbalk onderin; de pinguïn licht op en wipt even.                                      |
| lp-011 | `lp-011-hint-02-kijk-naar-pinguin.mp4`                           | Kijk naar het plaatje dat oplicht: pinguïn.   | Alleen de pinguïn blijft helder, de rest vervaagt.                                            |
| lp-011 | `lp-011-feedback-de-pinguin-springt-boven-de-vijver.mp4`         | De pinguïn springt boven de vijver.           | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-012 | `lp-012-opdracht-zet-het-hek-midden-op-het-gras.mp4`             | Zet het hek midden op het gras.               | De wereld met het hek in de objectbalk; een hand pakt het en zet het op de juiste plek.       |
| lp-012 | `lp-012-hint-01-zoek-het-hek.mp4`                                | Zoek het hek.                                 | De objectbalk onderin; het hek licht op en wipt even.                                         |
| lp-012 | `lp-012-hint-02-kijk-naar-hek.mp4`                               | Kijk naar het plaatje dat oplicht: hek.       | Alleen het hek blijft helder, de rest vervaagt.                                               |
| lp-012 | `lp-012-feedback-het-hek-staat-midden-op-het-gras.mp4`           | Het hek staat midden op het gras.             | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-013 | `lp-013-opdracht-zet-de-beer-links-bij-de-vijver.mp4`            | Zet de beer links bij de vijver.              | De wereld met de beer in de objectbalk; een hand pakt het en zet het op de juiste plek.       |
| lp-013 | `lp-013-hint-01-zoek-de-beer.mp4`                                | Zoek de beer.                                 | De objectbalk onderin; de beer licht op en wipt even.                                         |
| lp-013 | `lp-013-hint-02-kijk-naar-beer.mp4`                              | Kijk naar het plaatje dat oplicht: beer.      | Alleen de beer blijft helder, de rest vervaagt.                                               |
| lp-013 | `lp-013-feedback-de-beer-staat-links-bij-de-vijver.mp4`          | De beer staat links bij de vijver.            | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-014 | `lp-014-opdracht-zet-de-papegaai-ver-weg-boven-de-vijver.mp4`    | Zet de papegaai ver weg boven de vijver.      | De wereld met de papegaai in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-014 | `lp-014-hint-01-zoek-de-papegaai.mp4`                            | Zoek de papegaai.                             | De objectbalk onderin; de papegaai licht op en wipt even.                                     |
| lp-014 | `lp-014-hint-02-kijk-naar-papegaai.mp4`                          | Kijk naar het plaatje dat oplicht: papegaai.  | Alleen de papegaai blijft helder, de rest vervaagt.                                           |
| lp-014 | `lp-014-feedback-de-papegaai-vliegt-ver-weg-boven-de-vijver.mp4` | De papegaai vliegt ver weg boven de vijver.   | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-015 | `lp-015-opdracht-zet-de-emmer-dichtbij-de-olifant.mp4`           | Zet de emmer dichtbij de olifant.             | De wereld met de emmer in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-015 | `lp-015-hint-01-zoek-de-emmer.mp4`                               | Zoek de emmer.                                | De objectbalk onderin; de emmer licht op en wipt even.                                        |
| lp-015 | `lp-015-hint-02-kijk-naar-emmer.mp4`                             | Kijk naar het plaatje dat oplicht: emmer.     | Alleen de emmer blijft helder, de rest vervaagt.                                              |
| lp-015 | `lp-015-feedback-de-emmer-staat-dichtbij-de-olifant.mp4`         | De emmer staat dichtbij de olifant.           | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |
| lp-016 | `lp-016-opdracht-zet-de-aap-tussen-de-boom-en-het-hek.mp4`       | Zet de aap tussen de boom en het hek.         | De wereld met de aap in de objectbalk; een hand pakt het en zet het op de juiste plek.        |
| lp-016 | `lp-016-hint-01-zoek-de-aap.mp4`                                 | Zoek de aap.                                  | De objectbalk onderin; de aap licht op en wipt even.                                          |
| lp-016 | `lp-016-hint-02-kijk-naar-aap.mp4`                               | Kijk naar het plaatje dat oplicht: aap.       | Alleen de aap blijft helder, de rest vervaagt.                                                |
| lp-016 | `lp-016-feedback-de-aap-zit-tussen-de-boom-en-het-hek.mp4`       | De aap zit tussen de boom en het hek.         | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                      |

### 3.2 Video's bij de quizvragen — 14 clips

| ID     | Bestandsnaam                                | Gesproken tekst        | Wat je in beeld ziet                                                      |
| :----- | :------------------------------------------ | :--------------------- | :------------------------------------------------------------------------ |
| cw-001 | `cw-001-opdracht-waar-is-de-leeuw.mp4`      | Waar is de leeuw?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-002 | `cw-002-opdracht-waar-is-de-aap.mp4`        | Waar is de aap?        | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-003 | `cw-003-opdracht-waar-is-de-giraf.mp4`      | Waar is de giraf?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-004 | `cw-004-opdracht-waar-is-de-zebra.mp4`      | Waar is de zebra?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-005 | `cw-005-opdracht-waar-is-de-slang.mp4`      | Waar is de slang?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-006 | `cw-006-opdracht-waar-is-de-beer.mp4`       | Waar is de beer?       | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-007 | `cw-007-opdracht-waar-is-de-olifant.mp4`    | Waar is de olifant?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-008 | `cw-008-opdracht-waar-is-de-boom.mp4`       | Waar is de boom?       | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-009 | `cw-009-opdracht-waar-is-de-pinguin.mp4`    | Waar is de pinguïn?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-010 | `cw-010-opdracht-waar-is-de-krokodil.mp4`   | Waar is de krokodil?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-011 | `cw-011-opdracht-waar-is-het-nijlpaard.mp4` | Waar is het nijlpaard? | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-012 | `cw-012-opdracht-waar-is-de-papegaai.mp4`   | Waar is de papegaai?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-013 | `cw-013-opdracht-waar-is-het-hek.mp4`       | Waar is het hek?       | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-014 | `cw-014-opdracht-waar-is-de-emmer.mp4`      | Waar is de emmer?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |

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

| Taak     | Type | Wat                                                                                                                           | Status |
| :------- | :--: | :---------------------------------------------------------------------------------------------------------------------------- | :----: |
| **A-01** |  🎨  | **14 stickers** (WebP, max 512 px, 30–50 kB) — zie de tabel hieronder                                                         |   ⬜   |
| **A-02** |  🎨  | **Vier obstakels** voor Zeg & Vlieg (PNG met transparantie)                                                                   |   ⬜   |
| **A-03** |  🎨  | **Zeven beloningsplaatjes** op de bekende drempels                                                                            |   ⬜   |
| **A-04** |  🎨  | **Achtergrond** van de wereld in portret én landschap (WebP), plus een brede vliegachtergrond                                 |   ⬜   |
| **A-05** |  🎨  | **Logo en wereldicoon** — het icoon bestaat al (`src/app/games/catalog-assets/worlds/world-zoo.webp`); een startlogo moet nog |   ⬜   |
| **A-06** |  🎨  | **Feedbackgeluiden**: `feedback-correct.wav` en `feedback-wrong.wav` uit het strandspel kopiëren (CC0)                        |   ⬜   |
| **A-07** |  🎨  | **Achtergrondmuziek** kiezen of die van het strandspel hergebruiken                                                           |   ⬜   |
| **A-08** |  🎨  | **Mascotte** hergebruiken of een wereld-eigen variant tekenen                                                                 |   ⬜   |

#### Stickers (A-01)

| Bestandsnaam             | Woord     | Wat erop staat                |
| :----------------------- | :-------- | :---------------------------- |
| `giraffe-sticker.webp`   | giraf     | Een giraf met een lange nek.  |
| `elephant-sticker.webp`  | olifant   | Een olifant met een slurf.    |
| `lion-sticker.webp`      | leeuw     | Een leeuw met een manen.      |
| `monkey-sticker.webp`    | aap       | Een aap die in de boom klimt. |
| `zebra-sticker.webp`     | zebra     | Een zebra met strepen.        |
| `penguin-sticker.webp`   | pinguïn   | Een pinguïn die waggelt.      |
| `snake-sticker.webp`     | slang     | Een slang die kronkelt.       |
| `bear-sticker.webp`      | beer      | Een grote bruine beer.        |
| `crocodile-sticker.webp` | krokodil  | Een krokodil in het water.    |
| `parrot-sticker.webp`    | papegaai  | Een kleurige papegaai.        |
| `hippo-sticker.webp`     | nijlpaard | Een nijlpaard in de vijver.   |
| `tree-sticker.webp`      | boom      | Een hoge boom met bladeren.   |
| `fence-sticker.webp`     | hek       | Een hek om het verblijf.      |
| `bucket-sticker.webp`    | emmer     | Een emmer met dierenvoer.     |

#### Obstakels (A-02)

| Bestandsnaam               | Wat je ziet               |
| :------------------------- | :------------------------ |
| `net-obstacle.png`         | een gespannen net         |
| `tak-obstacle.png`         | een zwiepende tak         |
| `waterstraal-obstacle.png` | een spuitende waterstraal |
| `vogelzwerm-obstacle.png`  | een zwerm vogels          |

#### Beloningen (A-03)

| Drempel | Bestandsnaam                 |
| :------ | :--------------------------- |
| 3 ⭐    | `reward-01-sticker-aap`      |
| 8 ⭐    | `reward-02-hekkleur-groen`   |
| 16 ⭐   | `reward-03-sticker-giraf`    |
| 28 ⭐   | `reward-04-voetsporen-spoor` |
| 42 ⭐   | `reward-05-dierentuinbezem`  |
| 60 ⭐   | `reward-06-sticker-leeuw`    |
| 85 ⭐   | `reward-07-gouden-leeuw`     |

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
