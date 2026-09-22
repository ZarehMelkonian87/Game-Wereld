# 🧱 Takenlijst — Zonnige Speeltuin-Avontuur

> Volledig bouwplan. De game bestaat nu alleen als vergrendelde kaart in de catalogus; alles hieronder moet nog gemaakt worden. Uitgangspunt: **de code van [Magisch Strand-Avontuur](../magisch-strand-avontuur/GDD-index.md) kopiëren** en alleen content en assets vervangen.

| Veld                  | Waarde                                                |
| :-------------------- | :---------------------------------------------------- |
| **Laatst bijgewerkt** | 2026-09-22                                            |
| **Game-id**           | `zonnige-speeltuin-avontuur`                          |
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

> Kopieer `src/app/games/magisch-strand-avontuur/` naar `src/app/games/zonnige-speeltuin-avontuur/` en vervang daarna uitsluitend content, teksten en assets. Neem de tests mee.

| Taak     | Type | Wat                                                                                                                                     | Status |
| :------- | :--: | :-------------------------------------------------------------------------------------------------------------------------------------- | :----: |
| **C-01** |  🔧  | Gamemap aanmaken als kopie van het strandspel; namen en id's omzetten naar `zonnige-speeltuin-avontuur`                                 |   ⬜   |
| **C-02** |  🔧  | `manifest.ts` in de gamemap; de placeholder uit `catalog-manifests.ts` verwijderen en de game in de registry zetten met een lazy loader |   ⬜   |
| **C-03** |  🔧  | `content.ts` vullen: 14 objecten met lidwoord, meervoud, categorie, niveau en sticker                                                   |   ⬜   |
| **C-04** |  🔧  | Zones vastleggen met hun polygonen en ondersteunde begrippen (9 stuks)                                                                  |   ⬜   |
| **C-05** |  🔧  | 16 Zeg & Zet-opdrachten met hint, nazegzin en (waar nodig) ankerobjecten                                                                |   ⬜   |
| **C-06** |  🔧  | 14 Kies het Woord-vragen met oplopende afleiderstrategie                                                                                |   ⬜   |
| **C-07** |  🔧  | 5 bouwkaarten voor Zeg & Bouw (§2.1)                                                                                                    |   ⬜   |
| **C-08** |  🔧  | Zeg & Vlieg-woorden en kindertaal-aliassen (8 woorden)                                                                                  |   ⬜   |
| **C-09** |  🔧  | Aliassen voor objecten, zones en begrippen in de commando-parser                                                                        |   ⬜   |
| **C-10** |  🔧  | Beloningstabel met speeltuin-items op de bekende drempels (§3.4)                                                                        |   ⬜   |
| **C-11** |  🔧  | Offline-pakket: `offline-package.source.json` + manifest genereren                                                                      |   ⬜   |
| **C-12** |  🔧  | Vite-chunk en dependency-cruiser-regel voor de nieuwe gamemap                                                                           |   ⬜   |

**Klaar wanneer:** een diff met het strandspel alleen nog verschillen in content, teksten en assets laat zien.

## 2. Fase 2 — content vastleggen

Het ontwerp staat al in de [woordenlijst](Woordenlijst.md); deze fase is het invoeren en nalopen ervan met een taalkundige blik (lidwoorden, meervouden, of de zinnen natuurlijk klinken voor een kind van vier).

### 2.1 De vijf bouwkaarten

| Kaart                  | Opdracht                                              | Doel | Passende objecten                |
| :--------------------- | :---------------------------------------------------- | :--: | :------------------------------- |
| `build-klimmen`        | Zet 2 dingen neer waar je op kunt klimmen of glijden. |  2   | glijbaan, klimrek, schommel, wip |
| `build-zandbak`        | Zet 2 dingen neer waarmee je in het zand speelt.      |  2   | schep, emmer, zandbak            |
| `build-rijden`         | Zet 2 dingen neer waarop je kunt rijden.              |  2   | fiets, step                      |
| `build-buiten`         | Zet 3 dingen neer die buiten horen.                   |  3   | boom, vogel, vlinder, bank       |
| `build-jouw-speeltuin` | Maak jouw mooiste speeltuin! Kies zelf 3 dingen.      |  3   | alles mag                        |

---

## 3. Fase 3 — media produceren

**Productieregels:** clips van 2–5 seconden · sticker- en papierstijl · geen tekst in beeld, de voice-over draagt de opdracht · rustige Nederlandse uitspraak · 480p, enkele honderden kB · kebab-case bestandsnamen · map `assets/instructions/`.

Zolang een video ontbreekt, leest de stem de opdracht voor — de game is dus speelbaar vóórdat de media klaar zijn.

### 3.1 Video's bij de plaatsingsopdrachten — 16 × 4 = 64 clips

| ID     | Bestandsnaam                                                     | Gesproken tekst                              | Wat je in beeld ziet                                                                        |
| :----- | :--------------------------------------------------------------- | :------------------------------------------- | :------------------------------------------------------------------------------------------ |
| lp-001 | `lp-001-opdracht-zet-de-glijbaan-op-het-grasveld.mp4`            | Zet de glijbaan op het grasveld.             | De wereld met de glijbaan in de objectbalk; een hand pakt het en zet het op de juiste plek. |
| lp-001 | `lp-001-hint-01-zoek-de-glijbaan.mp4`                            | Zoek de glijbaan.                            | De objectbalk onderin; de glijbaan licht op en wipt even.                                   |
| lp-001 | `lp-001-hint-02-kijk-naar-glijbaan.mp4`                          | Kijk naar het plaatje dat oplicht: glijbaan. | Alleen de glijbaan blijft helder, de rest vervaagt.                                         |
| lp-001 | `lp-001-feedback-de-glijbaan-staat-op-het-grasveld.mp4`          | De glijbaan staat op het grasveld.           | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-002 | `lp-002-opdracht-zet-de-schommel-op-het-grasveld.mp4`            | Zet de schommel op het grasveld.             | De wereld met de schommel in de objectbalk; een hand pakt het en zet het op de juiste plek. |
| lp-002 | `lp-002-hint-01-zoek-de-schommel.mp4`                            | Zoek de schommel.                            | De objectbalk onderin; de schommel licht op en wipt even.                                   |
| lp-002 | `lp-002-hint-02-kijk-naar-schommel.mp4`                          | Kijk naar het plaatje dat oplicht: schommel. | Alleen de schommel blijft helder, de rest vervaagt.                                         |
| lp-002 | `lp-002-feedback-de-schommel-staat-op-het-grasveld.mp4`          | De schommel staat op het grasveld.           | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-003 | `lp-003-opdracht-leg-de-bal-op-het-pad.mp4`                      | Leg de bal op het pad.                       | De wereld met de bal in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-003 | `lp-003-hint-01-zoek-de-bal.mp4`                                 | Zoek de bal.                                 | De objectbalk onderin; de bal licht op en wipt even.                                        |
| lp-003 | `lp-003-hint-02-kijk-naar-bal.mp4`                               | Kijk naar het plaatje dat oplicht: bal.      | Alleen de bal blijft helder, de rest vervaagt.                                              |
| lp-003 | `lp-003-feedback-de-bal-ligt-op-het-pad.mp4`                     | De bal ligt op het pad.                      | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-004 | `lp-004-opdracht-zet-de-boom-op-de-heuvel.mp4`                   | Zet de boom op de heuvel.                    | De wereld met de boom in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-004 | `lp-004-hint-01-zoek-de-boom.mp4`                                | Zoek de boom.                                | De objectbalk onderin; de boom licht op en wipt even.                                       |
| lp-004 | `lp-004-hint-02-kijk-naar-boom.mp4`                              | Kijk naar het plaatje dat oplicht: boom.     | Alleen de boom blijft helder, de rest vervaagt.                                             |
| lp-004 | `lp-004-feedback-de-boom-staat-op-de-heuvel.mp4`                 | De boom staat op de heuvel.                  | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-005 | `lp-005-opdracht-zet-de-vogel-boven-de-speeltuin.mp4`            | Zet de vogel boven de speeltuin.             | De wereld met de vogel in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-005 | `lp-005-hint-01-zoek-de-vogel.mp4`                               | Zoek de vogel.                               | De objectbalk onderin; de vogel licht op en wipt even.                                      |
| lp-005 | `lp-005-hint-02-kijk-naar-vogel.mp4`                             | Kijk naar het plaatje dat oplicht: vogel.    | Alleen de vogel blijft helder, de rest vervaagt.                                            |
| lp-005 | `lp-005-feedback-de-vogel-vliegt-boven-de-speeltuin.mp4`         | De vogel vliegt boven de speeltuin.          | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-006 | `lp-006-opdracht-zet-de-vlinder-boven-het-grasveld.mp4`          | Zet de vlinder boven het grasveld.           | De wereld met de vlinder in de objectbalk; een hand pakt het en zet het op de juiste plek.  |
| lp-006 | `lp-006-hint-01-zoek-de-vlinder.mp4`                             | Zoek de vlinder.                             | De objectbalk onderin; de vlinder licht op en wipt even.                                    |
| lp-006 | `lp-006-hint-02-kijk-naar-vlinder.mp4`                           | Kijk naar het plaatje dat oplicht: vlinder.  | Alleen de vlinder blijft helder, de rest vervaagt.                                          |
| lp-006 | `lp-006-feedback-de-vlinder-fladdert-boven-het-grasveld.mp4`     | De vlinder fladdert boven het grasveld.      | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-007 | `lp-007-opdracht-zet-de-zandbak-op-het-grasveld.mp4`             | Zet de zandbak op het grasveld.              | De wereld met de zandbak in de objectbalk; een hand pakt het en zet het op de juiste plek.  |
| lp-007 | `lp-007-hint-01-zoek-de-zandbak.mp4`                             | Zoek de zandbak.                             | De objectbalk onderin; de zandbak licht op en wipt even.                                    |
| lp-007 | `lp-007-hint-02-kijk-naar-zandbak.mp4`                           | Kijk naar het plaatje dat oplicht: zandbak.  | Alleen de zandbak blijft helder, de rest vervaagt.                                          |
| lp-007 | `lp-007-feedback-de-zandbak-staat-op-het-grasveld.mp4`           | De zandbak staat op het grasveld.            | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-008 | `lp-008-opdracht-leg-de-schep-in-de-zandbak.mp4`                 | Leg de schep in de zandbak.                  | De wereld met de schep in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-008 | `lp-008-hint-01-zoek-de-schep.mp4`                               | Zoek de schep.                               | De objectbalk onderin; de schep licht op en wipt even.                                      |
| lp-008 | `lp-008-hint-02-kijk-naar-schep.mp4`                             | Kijk naar het plaatje dat oplicht: schep.    | Alleen de schep blijft helder, de rest vervaagt.                                            |
| lp-008 | `lp-008-feedback-de-schep-ligt-in-de-zandbak.mp4`                | De schep ligt in de zandbak.                 | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-009 | `lp-009-opdracht-zet-de-emmer-naast-de-schep.mp4`                | Zet de emmer naast de schep.                 | De wereld met de emmer in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-009 | `lp-009-hint-01-zoek-de-emmer.mp4`                               | Zoek de emmer.                               | De objectbalk onderin; de emmer licht op en wipt even.                                      |
| lp-009 | `lp-009-hint-02-kijk-naar-emmer.mp4`                             | Kijk naar het plaatje dat oplicht: emmer.    | Alleen de emmer blijft helder, de rest vervaagt.                                            |
| lp-009 | `lp-009-feedback-de-emmer-staat-naast-de-schep.mp4`              | De emmer staat naast de schep.               | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-010 | `lp-010-opdracht-zet-de-fiets-rechts-op-het-pad.mp4`             | Zet de fiets rechts op het pad.              | De wereld met de fiets in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-010 | `lp-010-hint-01-zoek-de-fiets.mp4`                               | Zoek de fiets.                               | De objectbalk onderin; de fiets licht op en wipt even.                                      |
| lp-010 | `lp-010-hint-02-kijk-naar-fiets.mp4`                             | Kijk naar het plaatje dat oplicht: fiets.    | Alleen de fiets blijft helder, de rest vervaagt.                                            |
| lp-010 | `lp-010-feedback-de-fiets-staat-rechts-op-het-pad.mp4`           | De fiets staat rechts op het pad.            | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-011 | `lp-011-opdracht-zet-de-wip-links-op-het-grasveld.mp4`           | Zet de wip links op het grasveld.            | De wereld met de wip in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-011 | `lp-011-hint-01-zoek-de-wip.mp4`                                 | Zoek de wip.                                 | De objectbalk onderin; de wip licht op en wipt even.                                        |
| lp-011 | `lp-011-hint-02-kijk-naar-wip.mp4`                               | Kijk naar het plaatje dat oplicht: wip.      | Alleen de wip blijft helder, de rest vervaagt.                                              |
| lp-011 | `lp-011-feedback-de-wip-staat-links-op-het-grasveld.mp4`         | De wip staat links op het grasveld.          | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-012 | `lp-012-opdracht-zet-de-bank-midden-op-het-pad.mp4`              | Zet de bank midden op het pad.               | De wereld met de bank in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-012 | `lp-012-hint-01-zoek-de-bank.mp4`                                | Zoek de bank.                                | De objectbalk onderin; de bank licht op en wipt even.                                       |
| lp-012 | `lp-012-hint-02-kijk-naar-bank.mp4`                              | Kijk naar het plaatje dat oplicht: bank.     | Alleen de bank blijft helder, de rest vervaagt.                                             |
| lp-012 | `lp-012-feedback-de-bank-staat-midden-op-het-pad.mp4`            | De bank staat midden op het pad.             | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-013 | `lp-013-opdracht-zet-het-klimrek-op-het-grasveld.mp4`            | Zet het klimrek op het grasveld.             | De wereld met het klimrek in de objectbalk; een hand pakt het en zet het op de juiste plek. |
| lp-013 | `lp-013-hint-01-zoek-het-klimrek.mp4`                            | Zoek het klimrek.                            | De objectbalk onderin; het klimrek licht op en wipt even.                                   |
| lp-013 | `lp-013-hint-02-kijk-naar-klimrek.mp4`                           | Kijk naar het plaatje dat oplicht: klimrek.  | Alleen het klimrek blijft helder, de rest vervaagt.                                         |
| lp-013 | `lp-013-feedback-het-klimrek-staat-op-het-grasveld.mp4`          | Het klimrek staat op het grasveld.           | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-014 | `lp-014-opdracht-zet-de-vogel-ver-weg-boven-het-grasveld.mp4`    | Zet de vogel ver weg boven het grasveld.     | De wereld met de vogel in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-014 | `lp-014-hint-01-zoek-de-vogel.mp4`                               | Zoek de vogel.                               | De objectbalk onderin; de vogel licht op en wipt even.                                      |
| lp-014 | `lp-014-hint-02-kijk-naar-vogel.mp4`                             | Kijk naar het plaatje dat oplicht: vogel.    | Alleen de vogel blijft helder, de rest vervaagt.                                            |
| lp-014 | `lp-014-feedback-de-vogel-vliegt-ver-weg-boven-het-grasveld.mp4` | De vogel vliegt ver weg boven het grasveld.  | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-015 | `lp-015-opdracht-zet-de-step-dichtbij-de-bank.mp4`               | Zet de step dichtbij de bank.                | De wereld met de step in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-015 | `lp-015-hint-01-zoek-de-step.mp4`                                | Zoek de step.                                | De objectbalk onderin; de step licht op en wipt even.                                       |
| lp-015 | `lp-015-hint-02-kijk-naar-step.mp4`                              | Kijk naar het plaatje dat oplicht: step.     | Alleen de step blijft helder, de rest vervaagt.                                             |
| lp-015 | `lp-015-feedback-de-step-staat-dichtbij-de-bank.mp4`             | De step staat dichtbij de bank.              | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |
| lp-016 | `lp-016-opdracht-leg-de-bal-tussen-de-emmer-en-de-schep.mp4`     | Leg de bal tussen de emmer en de schep.      | De wereld met de bal in de objectbalk; een hand pakt het en zet het op de juiste plek.      |
| lp-016 | `lp-016-hint-01-zoek-de-bal.mp4`                                 | Zoek de bal.                                 | De objectbalk onderin; de bal licht op en wipt even.                                        |
| lp-016 | `lp-016-hint-02-kijk-naar-bal.mp4`                               | Kijk naar het plaatje dat oplicht: bal.      | Alleen de bal blijft helder, de rest vervaagt.                                              |
| lp-016 | `lp-016-feedback-de-bal-ligt-tussen-de-emmer-en-de-schep.mp4`    | De bal ligt tussen de emmer en de schep.     | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                    |

### 3.2 Video's bij de quizvragen — 14 clips

| ID     | Bestandsnaam                              | Gesproken tekst      | Wat je in beeld ziet                                                      |
| :----- | :---------------------------------------- | :------------------- | :------------------------------------------------------------------------ |
| cw-001 | `cw-001-opdracht-waar-is-de-bal.mp4`      | Waar is de bal?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-002 | `cw-002-opdracht-waar-is-de-fiets.mp4`    | Waar is de fiets?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-003 | `cw-003-opdracht-waar-is-de-schommel.mp4` | Waar is de schommel? | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-004 | `cw-004-opdracht-waar-is-de-zandbak.mp4`  | Waar is de zandbak?  | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-005 | `cw-005-opdracht-waar-is-de-glijbaan.mp4` | Waar is de glijbaan? | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-006 | `cw-006-opdracht-waar-is-de-step.mp4`     | Waar is de step?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-007 | `cw-007-opdracht-waar-is-de-emmer.mp4`    | Waar is de emmer?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-008 | `cw-008-opdracht-waar-is-de-boom.mp4`     | Waar is de boom?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-009 | `cw-009-opdracht-waar-is-de-vlinder.mp4`  | Waar is de vlinder?  | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-010 | `cw-010-opdracht-waar-is-het-klimrek.mp4` | Waar is het klimrek? | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-011 | `cw-011-opdracht-waar-is-de-wip.mp4`      | Waar is de wip?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-012 | `cw-012-opdracht-waar-is-de-schep.mp4`    | Waar is de schep?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-013 | `cw-013-opdracht-waar-is-de-vogel.mp4`    | Waar is de vogel?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-014 | `cw-014-opdracht-waar-is-de-bank.mp4`     | Waar is de bank?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |

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

| Taak     | Type | Wat                                                                                                                                  | Status |
| :------- | :--: | :----------------------------------------------------------------------------------------------------------------------------------- | :----: |
| **A-01** |  🎨  | **14 stickers** (WebP, max 512 px, 30–50 kB) — zie de tabel hieronder                                                                |   ⬜   |
| **A-02** |  🎨  | **Vier obstakels** voor Zeg & Vlieg (PNG met transparantie)                                                                          |   ⬜   |
| **A-03** |  🎨  | **Zeven beloningsplaatjes** op de bekende drempels                                                                                   |   ⬜   |
| **A-04** |  🎨  | **Achtergrond** van de wereld in portret én landschap (WebP), plus een brede vliegachtergrond                                        |   ⬜   |
| **A-05** |  🎨  | **Logo en wereldicoon** — het icoon bestaat al (`src/app/games/catalog-assets/worlds/world-playground.webp`); een startlogo moet nog |   ⬜   |
| **A-06** |  🎨  | **Feedbackgeluiden**: `feedback-correct.wav` en `feedback-wrong.wav` uit het strandspel kopiëren (CC0)                               |   ⬜   |
| **A-07** |  🎨  | **Achtergrondmuziek** kiezen of die van het strandspel hergebruiken                                                                  |   ⬜   |
| **A-08** |  🎨  | **Mascotte** hergebruiken of een wereld-eigen variant tekenen                                                                        |   ⬜   |

#### Stickers (A-01)

| Bestandsnaam                 | Woord    | Wat erop staat                      |
| :--------------------------- | :------- | :---------------------------------- |
| `swing-sticker.webp`         | schommel | Een schommel die heen en weer gaat. |
| `slide-sticker.webp`         | glijbaan | Een glijbaan om vanaf te glijden.   |
| `sandbox-sticker.webp`       | zandbak  | Een zandbak vol zand.               |
| `seesaw-sticker.webp`        | wip      | Een wip die op en neer gaat.        |
| `climbingframe-sticker.webp` | klimrek  | Een klimrek om in te klimmen.       |
| `ball-sticker.webp`          | bal      | Een bal om mee te spelen.           |
| `scooter-sticker.webp`       | step     | Een step om op te rijden.           |
| `bike-sticker.webp`          | fiets    | Een fiets met twee wielen.          |
| `shovel-sticker.webp`        | schep    | Een schep voor in het zand.         |
| `bucket-sticker.webp`        | emmer    | Een emmertje voor zandtaartjes.     |
| `tree-sticker.webp`          | boom     | Een grote boom met bladeren.        |
| `bench-sticker.webp`         | bank     | Een bankje om op te zitten.         |
| `butterfly-sticker.webp`     | vlinder  | Een vlinder die rondfladdert.       |
| `bird-sticker.webp`          | vogel    | Een vogel in de lucht.              |

#### Obstakels (A-02)

| Bestandsnaam           | Wat je ziet             |
| :--------------------- | :---------------------- |
| `vlieger-obstacle.png` | een losgeraakte vlieger |
| `boomtak-obstacle.png` | een dikke boomtak       |
| `ballon-obstacle.png`  | een wegzwevende ballon  |
| `wolk-obstacle.png`    | een dikke witte wolk    |

#### Beloningen (A-03)

| Drempel | Bestandsnaam                 |
| :------ | :--------------------------- |
| 3 ⭐    | `reward-01-sticker-bal`      |
| 8 ⭐    | `reward-02-padkleur-blauw`   |
| 16 ⭐   | `reward-03-sticker-vlinder`  |
| 28 ⭐   | `reward-04-zand-spoor`       |
| 42 ⭐   | `reward-05-speeltuinbezem`   |
| 60 ⭐   | `reward-06-sticker-glijbaan` |
| 85 ⭐   | `reward-07-gouden-schommel`  |

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
