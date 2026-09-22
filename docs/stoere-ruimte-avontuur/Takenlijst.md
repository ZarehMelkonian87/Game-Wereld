# 🧱 Takenlijst — Stoere Ruimte-Avontuur

> Volledig bouwplan. De game bestaat nu alleen als vergrendelde kaart in de catalogus; alles hieronder moet nog gemaakt worden. Uitgangspunt: **de code van [Magisch Strand-Avontuur](../magisch-strand-avontuur/GDD-index.md) kopiëren** en alleen content en assets vervangen.

| Veld                  | Waarde                                                |
| :-------------------- | :---------------------------------------------------- |
| **Laatst bijgewerkt** | 2026-09-22                                            |
| **Game-id**           | `stoere-ruimte-avontuur`                              |
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

> Kopieer `src/app/games/magisch-strand-avontuur/` naar `src/app/games/stoere-ruimte-avontuur/` en vervang daarna uitsluitend content, teksten en assets. Neem de tests mee.

| Taak     | Type | Wat                                                                                                                                     | Status |
| :------- | :--: | :-------------------------------------------------------------------------------------------------------------------------------------- | :----: |
| **C-01** |  🔧  | Gamemap aanmaken als kopie van het strandspel; namen en id's omzetten naar `stoere-ruimte-avontuur`                                     |   ⬜   |
| **C-02** |  🔧  | `manifest.ts` in de gamemap; de placeholder uit `catalog-manifests.ts` verwijderen en de game in de registry zetten met een lazy loader |   ⬜   |
| **C-03** |  🔧  | `content.ts` vullen: 14 objecten met lidwoord, meervoud, categorie, niveau en sticker                                                   |   ⬜   |
| **C-04** |  🔧  | Zones vastleggen met hun polygonen en ondersteunde begrippen (9 stuks)                                                                  |   ⬜   |
| **C-05** |  🔧  | 16 Zeg & Zet-opdrachten met hint, nazegzin en (waar nodig) ankerobjecten                                                                |   ⬜   |
| **C-06** |  🔧  | 14 Kies het Woord-vragen met oplopende afleiderstrategie                                                                                |   ⬜   |
| **C-07** |  🔧  | 5 bouwkaarten voor Zeg & Bouw (§2.1)                                                                                                    |   ⬜   |
| **C-08** |  🔧  | Zeg & Vlieg-woorden en kindertaal-aliassen (8 woorden)                                                                                  |   ⬜   |
| **C-09** |  🔧  | Aliassen voor objecten, zones en begrippen in de commando-parser                                                                        |   ⬜   |
| **C-10** |  🔧  | Beloningstabel met ruimte-items op de bekende drempels (§3.4)                                                                           |   ⬜   |
| **C-11** |  🔧  | Offline-pakket: `offline-package.source.json` + manifest genereren                                                                      |   ⬜   |
| **C-12** |  🔧  | Vite-chunk en dependency-cruiser-regel voor de nieuwe gamemap                                                                           |   ⬜   |

**Klaar wanneer:** een diff met het strandspel alleen nog verschillen in content, teksten en assets laat zien.

## 2. Fase 2 — content vastleggen

Het ontwerp staat al in de [woordenlijst](Woordenlijst.md); deze fase is het invoeren en nalopen ervan met een taalkundige blik (lidwoorden, meervouden, of de zinnen natuurlijk klinken voor een kind van vier).

### 2.1 De vijf bouwkaarten

| Kaart               | Opdracht                                           | Doel | Passende objecten                     |
| :------------------ | :------------------------------------------------- | :--: | :------------------------------------ |
| `build-hemel`       | Zet 3 dingen aan de hemel.                         |  3   | ster, maan, planeet, komeet, aarde    |
| `build-reizen`      | Zet 2 dingen neer waarmee je door de ruimte reist. |  2   | raket, satelliet                      |
| `build-maanbezoek`  | Zet 2 dingen op de maan.                           |  2   | astronaut, marsmannetje, robot, steen |
| `build-uitrusting`  | Zet 2 spullen van de astronaut neer.               |  2   | helm, ruimtepak, telescoop            |
| `build-jouw-ruimte` | Maak jouw mooiste heelal! Kies zelf 3 dingen.      |  3   | alles mag                             |

---

## 3. Fase 3 — media produceren

**Productieregels:** clips van 2–5 seconden · sticker- en papierstijl · geen tekst in beeld, de voice-over draagt de opdracht · rustige Nederlandse uitspraak · 480p, enkele honderden kB · kebab-case bestandsnamen · map `assets/instructions/`.

Zolang een video ontbreekt, leest de stem de opdracht voor — de game is dus speelbaar vóórdat de media klaar zijn.

### 3.1 Video's bij de plaatsingsopdrachten — 16 × 4 = 64 clips

| ID     | Bestandsnaam                                                            | Gesproken tekst                                    | Wat je in beeld ziet                                                                             |
| :----- | :---------------------------------------------------------------------- | :------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| lp-001 | `lp-001-opdracht-zet-de-raket-op-de-grond.mp4`                          | Zet de raket op de grond.                          | De wereld met de raket in de objectbalk; een hand pakt het en zet het op de juiste plek.         |
| lp-001 | `lp-001-hint-01-zoek-de-raket.mp4`                                      | Zoek de raket.                                     | De objectbalk onderin; de raket licht op en wipt even.                                           |
| lp-001 | `lp-001-hint-02-kijk-naar-raket.mp4`                                    | Kijk naar het plaatje dat oplicht: raket.          | Alleen de raket blijft helder, de rest vervaagt.                                                 |
| lp-001 | `lp-001-feedback-de-raket-staat-op-de-grond.mp4`                        | De raket staat op de grond.                        | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-002 | `lp-002-opdracht-zet-de-ster-in-de-hemel.mp4`                           | Zet de ster in de hemel.                           | De wereld met de ster in de objectbalk; een hand pakt het en zet het op de juiste plek.          |
| lp-002 | `lp-002-hint-01-zoek-de-ster.mp4`                                       | Zoek de ster.                                      | De objectbalk onderin; de ster licht op en wipt even.                                            |
| lp-002 | `lp-002-hint-02-kijk-naar-ster.mp4`                                     | Kijk naar het plaatje dat oplicht: ster.           | Alleen de ster blijft helder, de rest vervaagt.                                                  |
| lp-002 | `lp-002-feedback-de-ster-staat-in-de-hemel.mp4`                         | De ster staat in de hemel.                         | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-003 | `lp-003-opdracht-zet-de-astronaut-op-de-maanvlakte.mp4`                 | Zet de astronaut op de maanvlakte.                 | De wereld met de astronaut in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-003 | `lp-003-hint-01-zoek-de-astronaut.mp4`                                  | Zoek de astronaut.                                 | De objectbalk onderin; de astronaut licht op en wipt even.                                       |
| lp-003 | `lp-003-hint-02-kijk-naar-astronaut.mp4`                                | Kijk naar het plaatje dat oplicht: astronaut.      | Alleen de astronaut blijft helder, de rest vervaagt.                                             |
| lp-003 | `lp-003-feedback-de-astronaut-loopt-op-de-maanvlakte.mp4`               | De astronaut loopt op de maanvlakte.               | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-004 | `lp-004-opdracht-leg-het-ruimtepak-op-de-maanvlakte.mp4`                | Leg het ruimtepak op de maanvlakte.                | De wereld met het ruimtepak in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-004 | `lp-004-hint-01-zoek-het-ruimtepak.mp4`                                 | Zoek het ruimtepak.                                | De objectbalk onderin; het ruimtepak licht op en wipt even.                                      |
| lp-004 | `lp-004-hint-02-kijk-naar-ruimtepak.mp4`                                | Kijk naar het plaatje dat oplicht: ruimtepak.      | Alleen het ruimtepak blijft helder, de rest vervaagt.                                            |
| lp-004 | `lp-004-feedback-het-ruimtepak-ligt-op-de-maanvlakte.mp4`               | Het ruimtepak ligt op de maanvlakte.               | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-005 | `lp-005-opdracht-leg-de-steen-in-de-krater.mp4`                         | Leg de steen in de krater.                         | De wereld met de steen in de objectbalk; een hand pakt het en zet het op de juiste plek.         |
| lp-005 | `lp-005-hint-01-zoek-de-steen.mp4`                                      | Zoek de steen.                                     | De objectbalk onderin; de steen licht op en wipt even.                                           |
| lp-005 | `lp-005-hint-02-kijk-naar-steen.mp4`                                    | Kijk naar het plaatje dat oplicht: steen.          | Alleen de steen blijft helder, de rest vervaagt.                                                 |
| lp-005 | `lp-005-feedback-de-steen-ligt-in-de-krater.mp4`                        | De steen ligt in de krater.                        | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-006 | `lp-006-opdracht-zet-de-robot-op-de-grond.mp4`                          | Zet de robot op de grond.                          | De wereld met de robot in de objectbalk; een hand pakt het en zet het op de juiste plek.         |
| lp-006 | `lp-006-hint-01-zoek-de-robot.mp4`                                      | Zoek de robot.                                     | De objectbalk onderin; de robot licht op en wipt even.                                           |
| lp-006 | `lp-006-hint-02-kijk-naar-robot.mp4`                                    | Kijk naar het plaatje dat oplicht: robot.          | Alleen de robot blijft helder, de rest vervaagt.                                                 |
| lp-006 | `lp-006-feedback-de-robot-staat-op-de-grond.mp4`                        | De robot staat op de grond.                        | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-007 | `lp-007-opdracht-zet-de-maan-boven-de-maanvlakte.mp4`                   | Zet de maan boven de maanvlakte.                   | De wereld met de maan in de objectbalk; een hand pakt het en zet het op de juiste plek.          |
| lp-007 | `lp-007-hint-01-zoek-de-maan.mp4`                                       | Zoek de maan.                                      | De objectbalk onderin; de maan licht op en wipt even.                                            |
| lp-007 | `lp-007-hint-02-kijk-naar-maan.mp4`                                     | Kijk naar het plaatje dat oplicht: maan.           | Alleen de maan blijft helder, de rest vervaagt.                                                  |
| lp-007 | `lp-007-feedback-de-maan-staat-boven-de-maanvlakte.mp4`                 | De maan staat boven de maanvlakte.                 | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-008 | `lp-008-opdracht-zet-de-helm-op-de-steen.mp4`                           | Zet de helm op de steen.                           | De wereld met de helm in de objectbalk; een hand pakt het en zet het op de juiste plek.          |
| lp-008 | `lp-008-hint-01-zoek-de-helm.mp4`                                       | Zoek de helm.                                      | De objectbalk onderin; de helm licht op en wipt even.                                            |
| lp-008 | `lp-008-hint-02-kijk-naar-helm.mp4`                                     | Kijk naar het plaatje dat oplicht: helm.           | Alleen de helm blijft helder, de rest vervaagt.                                                  |
| lp-008 | `lp-008-feedback-de-helm-staat-op-de-steen.mp4`                         | De helm staat op de steen.                         | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-009 | `lp-009-opdracht-zet-het-marsmannetje-naast-de-robot.mp4`               | Zet het marsmannetje naast de robot.               | De wereld met het marsmannetje in de objectbalk; een hand pakt het en zet het op de juiste plek. |
| lp-009 | `lp-009-hint-01-zoek-het-marsmannetje.mp4`                              | Zoek het marsmannetje.                             | De objectbalk onderin; het marsmannetje licht op en wipt even.                                   |
| lp-009 | `lp-009-hint-02-kijk-naar-marsmannetje.mp4`                             | Kijk naar het plaatje dat oplicht: marsmannetje.   | Alleen het marsmannetje blijft helder, de rest vervaagt.                                         |
| lp-009 | `lp-009-feedback-het-marsmannetje-staat-naast-de-robot.mp4`             | Het marsmannetje staat naast de robot.             | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-010 | `lp-010-opdracht-zet-de-aarde-rechts-in-beeld.mp4`                      | Zet de aarde rechts in beeld.                      | De wereld met de aarde in de objectbalk; een hand pakt het en zet het op de juiste plek.         |
| lp-010 | `lp-010-hint-01-zoek-de-aarde.mp4`                                      | Zoek de aarde.                                     | De objectbalk onderin; de aarde licht op en wipt even.                                           |
| lp-010 | `lp-010-hint-02-kijk-naar-aarde.mp4`                                    | Kijk naar het plaatje dat oplicht: aarde.          | Alleen de aarde blijft helder, de rest vervaagt.                                                 |
| lp-010 | `lp-010-feedback-de-aarde-staat-rechts-in-beeld.mp4`                    | De aarde staat rechts in beeld.                    | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-011 | `lp-011-opdracht-zet-de-telescoop-op-de-grond.mp4`                      | Zet de telescoop op de grond.                      | De wereld met de telescoop in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-011 | `lp-011-hint-01-zoek-de-telescoop.mp4`                                  | Zoek de telescoop.                                 | De objectbalk onderin; de telescoop licht op en wipt even.                                       |
| lp-011 | `lp-011-hint-02-kijk-naar-telescoop.mp4`                                | Kijk naar het plaatje dat oplicht: telescoop.      | Alleen de telescoop blijft helder, de rest vervaagt.                                             |
| lp-011 | `lp-011-feedback-de-telescoop-staat-op-de-grond.mp4`                    | De telescoop staat op de grond.                    | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-012 | `lp-012-opdracht-zet-de-satelliet-midden-in-beeld.mp4`                  | Zet de satelliet midden in beeld.                  | De wereld met de satelliet in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-012 | `lp-012-hint-01-zoek-de-satelliet.mp4`                                  | Zoek de satelliet.                                 | De objectbalk onderin; de satelliet licht op en wipt even.                                       |
| lp-012 | `lp-012-hint-02-kijk-naar-satelliet.mp4`                                | Kijk naar het plaatje dat oplicht: satelliet.      | Alleen de satelliet blijft helder, de rest vervaagt.                                             |
| lp-012 | `lp-012-feedback-de-satelliet-zweeft-midden-in-beeld.mp4`               | De satelliet zweeft midden in beeld.               | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-013 | `lp-013-opdracht-zet-de-planeet-links-in-de-hemel.mp4`                  | Zet de planeet links in de hemel.                  | De wereld met de planeet in de objectbalk; een hand pakt het en zet het op de juiste plek.       |
| lp-013 | `lp-013-hint-01-zoek-de-planeet.mp4`                                    | Zoek de planeet.                                   | De objectbalk onderin; de planeet licht op en wipt even.                                         |
| lp-013 | `lp-013-hint-02-kijk-naar-planeet.mp4`                                  | Kijk naar het plaatje dat oplicht: planeet.        | Alleen de planeet blijft helder, de rest vervaagt.                                               |
| lp-013 | `lp-013-feedback-de-planeet-staat-links-in-de-hemel.mp4`                | De planeet staat links in de hemel.                | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-014 | `lp-014-opdracht-zet-de-komeet-ver-weg-in-de-hemel.mp4`                 | Zet de komeet ver weg in de hemel.                 | De wereld met de komeet in de objectbalk; een hand pakt het en zet het op de juiste plek.        |
| lp-014 | `lp-014-hint-01-zoek-de-komeet.mp4`                                     | Zoek de komeet.                                    | De objectbalk onderin; de komeet licht op en wipt even.                                          |
| lp-014 | `lp-014-hint-02-kijk-naar-komeet.mp4`                                   | Kijk naar het plaatje dat oplicht: komeet.         | Alleen de komeet blijft helder, de rest vervaagt.                                                |
| lp-014 | `lp-014-feedback-de-komeet-vliegt-ver-weg-in-de-hemel.mp4`              | De komeet vliegt ver weg in de hemel.              | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-015 | `lp-015-opdracht-leg-de-steen-dichtbij-de-raket.mp4`                    | Leg de steen dichtbij de raket.                    | De wereld met de steen in de objectbalk; een hand pakt het en zet het op de juiste plek.         |
| lp-015 | `lp-015-hint-01-zoek-de-steen.mp4`                                      | Zoek de steen.                                     | De objectbalk onderin; de steen licht op en wipt even.                                           |
| lp-015 | `lp-015-hint-02-kijk-naar-steen.mp4`                                    | Kijk naar het plaatje dat oplicht: steen.          | Alleen de steen blijft helder, de rest vervaagt.                                                 |
| lp-015 | `lp-015-feedback-de-steen-ligt-dichtbij-de-raket.mp4`                   | De steen ligt dichtbij de raket.                   | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |
| lp-016 | `lp-016-opdracht-zet-de-helm-tussen-het-marsmannetje-en-de-steen.mp4`   | Zet de helm tussen het marsmannetje en de steen.   | De wereld met de helm in de objectbalk; een hand pakt het en zet het op de juiste plek.          |
| lp-016 | `lp-016-hint-01-zoek-de-helm.mp4`                                       | Zoek de helm.                                      | De objectbalk onderin; de helm licht op en wipt even.                                            |
| lp-016 | `lp-016-hint-02-kijk-naar-helm.mp4`                                     | Kijk naar het plaatje dat oplicht: helm.           | Alleen de helm blijft helder, de rest vervaagt.                                                  |
| lp-016 | `lp-016-feedback-de-helm-staat-tussen-het-marsmannetje-en-de-steen.mp4` | De helm staat tussen het marsmannetje en de steen. | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                         |

### 3.2 Video's bij de quizvragen — 14 clips

| ID     | Bestandsnaam                                   | Gesproken tekst           | Wat je in beeld ziet                                                      |
| :----- | :--------------------------------------------- | :------------------------ | :------------------------------------------------------------------------ |
| cw-001 | `cw-001-opdracht-waar-is-de-raket.mp4`         | Waar is de raket?         | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-002 | `cw-002-opdracht-waar-is-de-ster.mp4`          | Waar is de ster?          | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-003 | `cw-003-opdracht-waar-is-de-maan.mp4`          | Waar is de maan?          | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-004 | `cw-004-opdracht-waar-is-de-robot.mp4`         | Waar is de robot?         | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-005 | `cw-005-opdracht-waar-is-het-marsmannetje.mp4` | Waar is het marsmannetje? | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-006 | `cw-006-opdracht-waar-is-de-helm.mp4`          | Waar is de helm?          | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-007 | `cw-007-opdracht-waar-is-de-telescoop.mp4`     | Waar is de telescoop?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-008 | `cw-008-opdracht-waar-is-de-aarde.mp4`         | Waar is de aarde?         | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-009 | `cw-009-opdracht-waar-is-de-astronaut.mp4`     | Waar is de astronaut?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-010 | `cw-010-opdracht-waar-is-de-satelliet.mp4`     | Waar is de satelliet?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-011 | `cw-011-opdracht-waar-is-de-planeet.mp4`       | Waar is de planeet?       | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-012 | `cw-012-opdracht-waar-is-de-komeet.mp4`        | Waar is de komeet?        | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-013 | `cw-013-opdracht-waar-is-de-steen.mp4`         | Waar is de steen?         | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-014 | `cw-014-opdracht-waar-is-het-ruimtepak.mp4`    | Waar is het ruimtepak?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |

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
| **A-05** |  🎨  | **Logo en wereldicoon** — het icoon bestaat al (`world-space.webp`); een startlogo moet nog            |   ⬜   |
| **A-06** |  🎨  | **Feedbackgeluiden**: `feedback-correct.wav` en `feedback-wrong.wav` uit het strandspel kopiëren (CC0) |   ⬜   |
| **A-07** |  🎨  | **Achtergrondmuziek** kiezen of die van het strandspel hergebruiken                                    |   ⬜   |
| **A-08** |  🎨  | **Mascotte** hergebruiken of een wereld-eigen variant tekenen                                          |   ⬜   |

#### Stickers (A-01)

| Bestandsnaam             | Woord        | Wat erop staat                        |
| :----------------------- | :----------- | :------------------------------------ |
| `rocket-sticker.webp`    | raket        | Een raket die de lucht in gaat.       |
| `moon-sticker.webp`      | maan         | De maan met kraters.                  |
| `star-sticker.webp`      | ster         | Een fonkelende ster.                  |
| `telescope-sticker.webp` | telescoop    | Een telescoop om sterren te bekijken. |
| `planet-sticker.webp`    | planeet      | Een planeet met een ring.             |
| `earth-sticker.webp`     | aarde        | De aarde met blauw water.             |
| `astronaut-sticker.webp` | astronaut    | Een astronaut in een pak.             |
| `robot-sticker.webp`     | robot        | Een robot die rondrijdt.              |
| `satellite-sticker.webp` | satelliet    | Een satelliet die rondjes draait.     |
| `comet-sticker.webp`     | komeet       | Een komeet met een staart.            |
| `helmet-sticker.webp`    | helm         | Een helm voor de astronaut.           |
| `spacesuit-sticker.webp` | ruimtepak    | Het ruimtepak van de astronaut.       |
| `rock-sticker.webp`      | steen        | Een maansteen.                        |
| `alien-sticker.webp`     | marsmannetje | Een groen marsmannetje.               |

#### Obstakels (A-02)

| Bestandsnaam              | Wat je ziet                |
| :------------------------ | :------------------------- |
| `meteoriet-obstacle.png`  | een rondtollende meteoriet |
| `ruimtepuin-obstacle.png` | een stuk ruimtepuin        |
| `stofwolk-obstacle.png`   | een wolk maanstof          |
| `satelliet-obstacle.png`  | een oude satelliet         |

#### Beloningen (A-03)

| Drempel | Bestandsnaam                  |
| :------ | :---------------------------- |
| 3 ⭐    | `reward-01-sticker-ster`      |
| 8 ⭐    | `reward-02-raketkleur-rood`   |
| 16 ⭐   | `reward-03-sticker-maan`      |
| 28 ⭐   | `reward-04-sterrenstof-spoor` |
| 42 ⭐   | `reward-05-ruimtebezem`       |
| 60 ⭐   | `reward-06-sticker-astronaut` |
| 85 ⭐   | `reward-07-gouden-planeet`    |

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
