# 🧱 Takenlijst — Slimme School-Avontuur

> Volledig bouwplan. De game bestaat nu alleen als vergrendelde kaart in de catalogus; alles hieronder moet nog gemaakt worden. Uitgangspunt: **de code van [Magisch Strand-Avontuur](../magisch-strand-avontuur/GDD-index.md) kopiëren** en alleen content en assets vervangen.

| Veld                  | Waarde                                                |
| :-------------------- | :---------------------------------------------------- |
| **Laatst bijgewerkt** | 2026-09-22                                            |
| **Game-id**           | `slimme-school-avontuur`                              |
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

> Kopieer `src/app/games/magisch-strand-avontuur/` naar `src/app/games/slimme-school-avontuur/` en vervang daarna uitsluitend content, teksten en assets. Neem de tests mee.

| Taak     | Type | Wat                                                                                                                                     | Status |
| :------- | :--: | :-------------------------------------------------------------------------------------------------------------------------------------- | :----: |
| **C-01** |  🔧  | Gamemap aanmaken als kopie van het strandspel; namen en id's omzetten naar `slimme-school-avontuur`                                     |   ⬜   |
| **C-02** |  🔧  | `manifest.ts` in de gamemap; de placeholder uit `catalog-manifests.ts` verwijderen en de game in de registry zetten met een lazy loader |   ⬜   |
| **C-03** |  🔧  | `content.ts` vullen: 14 objecten met lidwoord, meervoud, categorie, niveau en sticker                                                   |   ⬜   |
| **C-04** |  🔧  | Zones vastleggen met hun polygonen en ondersteunde begrippen (9 stuks)                                                                  |   ⬜   |
| **C-05** |  🔧  | 16 Zeg & Zet-opdrachten met hint, nazegzin en (waar nodig) ankerobjecten                                                                |   ⬜   |
| **C-06** |  🔧  | 14 Kies het Woord-vragen met oplopende afleiderstrategie                                                                                |   ⬜   |
| **C-07** |  🔧  | 5 bouwkaarten voor Zeg & Bouw (§2.1)                                                                                                    |   ⬜   |
| **C-08** |  🔧  | Zeg & Vlieg-woorden en kindertaal-aliassen (8 woorden)                                                                                  |   ⬜   |
| **C-09** |  🔧  | Aliassen voor objecten, zones en begrippen in de commando-parser                                                                        |   ⬜   |
| **C-10** |  🔧  | Beloningstabel met school-items op de bekende drempels (§3.4)                                                                           |   ⬜   |
| **C-11** |  🔧  | Offline-pakket: `offline-package.source.json` + manifest genereren                                                                      |   ⬜   |
| **C-12** |  🔧  | Vite-chunk en dependency-cruiser-regel voor de nieuwe gamemap                                                                           |   ⬜   |

**Klaar wanneer:** een diff met het strandspel alleen nog verschillen in content, teksten en assets laat zien.

## 2. Fase 2 — content vastleggen

Het ontwerp staat al in de [woordenlijst](Woordenlijst.md); deze fase is het invoeren en nalopen ervan met een taalkundige blik (lidwoorden, meervouden, of de zinnen natuurlijk klinken voor een kind van vier).

### 2.1 De vijf bouwkaarten

| Kaart             | Opdracht                                         | Doel | Passende objecten     |
| :---------------- | :----------------------------------------------- | :--: | :-------------------- |
| `build-schrijven` | Zet 2 dingen neer waarmee je schrijft of tekent. |  2   | pen, potlood, gum     |
| `build-knutselen` | Zet 2 dingen neer waarmee je knutselt.           |  2   | schaar, lijm, potlood |
| `build-meubels`   | Zet 3 meubels in de klas.                        |  3   | tafel, stoel, kast    |
| `build-meenemen`  | Zet 2 dingen neer die je meeneemt naar school.   |  2   | rugzak, jas, boek     |
| `build-jouw-klas` | Maak jouw mooiste klas! Kies zelf 3 dingen.      |  3   | alles mag             |

---

## 3. Fase 3 — media produceren

**Productieregels:** clips van 2–5 seconden · sticker- en papierstijl · geen tekst in beeld, de voice-over draagt de opdracht · rustige Nederlandse uitspraak · 480p, enkele honderden kB · kebab-case bestandsnamen · map `assets/instructions/`.

Zolang een video ontbreekt, leest de stem de opdracht voor — de game is dus speelbaar vóórdat de media klaar zijn.

### 3.1 Video's bij de plaatsingsopdrachten — 16 × 4 = 64 clips

| ID     | Bestandsnaam                                                    | Gesproken tekst                             | Wat je in beeld ziet                                                                       |
| :----- | :-------------------------------------------------------------- | :------------------------------------------ | :----------------------------------------------------------------------------------------- |
| lp-001 | `lp-001-opdracht-zet-het-bord-op-de-muur.mp4`                   | Zet het bord op de muur.                    | De wereld met het bord in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-001 | `lp-001-hint-01-zoek-het-bord.mp4`                              | Zoek het bord.                              | De objectbalk onderin; het bord licht op en wipt even.                                     |
| lp-001 | `lp-001-hint-02-kijk-naar-bord.mp4`                             | Kijk naar het plaatje dat oplicht: bord.    | Alleen het bord blijft helder, de rest vervaagt.                                           |
| lp-001 | `lp-001-feedback-het-bord-hangt-op-de-muur.mp4`                 | Het bord hangt op de muur.                  | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-002 | `lp-002-opdracht-zet-de-tafel-op-de-vloer.mp4`                  | Zet de tafel op de vloer.                   | De wereld met de tafel in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-002 | `lp-002-hint-01-zoek-de-tafel.mp4`                              | Zoek de tafel.                              | De objectbalk onderin; de tafel licht op en wipt even.                                     |
| lp-002 | `lp-002-hint-02-kijk-naar-tafel.mp4`                            | Kijk naar het plaatje dat oplicht: tafel.   | Alleen de tafel blijft helder, de rest vervaagt.                                           |
| lp-002 | `lp-002-feedback-de-tafel-staat-op-de-vloer.mp4`                | De tafel staat op de vloer.                 | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-003 | `lp-003-opdracht-zet-de-stoel-op-de-vloer.mp4`                  | Zet de stoel op de vloer.                   | De wereld met de stoel in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-003 | `lp-003-hint-01-zoek-de-stoel.mp4`                              | Zoek de stoel.                              | De objectbalk onderin; de stoel licht op en wipt even.                                     |
| lp-003 | `lp-003-hint-02-kijk-naar-stoel.mp4`                            | Kijk naar het plaatje dat oplicht: stoel.   | Alleen de stoel blijft helder, de rest vervaagt.                                           |
| lp-003 | `lp-003-feedback-de-stoel-staat-op-de-vloer.mp4`                | De stoel staat op de vloer.                 | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-004 | `lp-004-opdracht-zet-de-klok-op-de-muur.mp4`                    | Zet de klok op de muur.                     | De wereld met de klok in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-004 | `lp-004-hint-01-zoek-de-klok.mp4`                               | Zoek de klok.                               | De objectbalk onderin; de klok licht op en wipt even.                                      |
| lp-004 | `lp-004-hint-02-kijk-naar-klok.mp4`                             | Kijk naar het plaatje dat oplicht: klok.    | Alleen de klok blijft helder, de rest vervaagt.                                            |
| lp-004 | `lp-004-feedback-de-klok-hangt-op-de-muur.mp4`                  | De klok hangt op de muur.                   | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-005 | `lp-005-opdracht-zet-de-kast-bij-de-muur.mp4`                   | Zet de kast bij de muur.                    | De wereld met de kast in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-005 | `lp-005-hint-01-zoek-de-kast.mp4`                               | Zoek de kast.                               | De objectbalk onderin; de kast licht op en wipt even.                                      |
| lp-005 | `lp-005-hint-02-kijk-naar-kast.mp4`                             | Kijk naar het plaatje dat oplicht: kast.    | Alleen de kast blijft helder, de rest vervaagt.                                            |
| lp-005 | `lp-005-feedback-de-kast-staat-bij-de-muur.mp4`                 | De kast staat bij de muur.                  | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-006 | `lp-006-opdracht-leg-het-boek-op-de-tafel.mp4`                  | Leg het boek op de tafel.                   | De wereld met het boek in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-006 | `lp-006-hint-01-zoek-het-boek.mp4`                              | Zoek het boek.                              | De objectbalk onderin; het boek licht op en wipt even.                                     |
| lp-006 | `lp-006-hint-02-kijk-naar-boek.mp4`                             | Kijk naar het plaatje dat oplicht: boek.    | Alleen het boek blijft helder, de rest vervaagt.                                           |
| lp-006 | `lp-006-feedback-het-boek-ligt-op-de-tafel.mp4`                 | Het boek ligt op de tafel.                  | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-007 | `lp-007-opdracht-zet-de-rugzak-op-de-vloer.mp4`                 | Zet de rugzak op de vloer.                  | De wereld met de rugzak in de objectbalk; een hand pakt het en zet het op de juiste plek.  |
| lp-007 | `lp-007-hint-01-zoek-de-rugzak.mp4`                             | Zoek de rugzak.                             | De objectbalk onderin; de rugzak licht op en wipt even.                                    |
| lp-007 | `lp-007-hint-02-kijk-naar-rugzak.mp4`                           | Kijk naar het plaatje dat oplicht: rugzak.  | Alleen de rugzak blijft helder, de rest vervaagt.                                          |
| lp-007 | `lp-007-feedback-de-rugzak-staat-op-de-vloer.mp4`               | De rugzak staat op de vloer.                | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-008 | `lp-008-opdracht-leg-de-liniaal-op-de-tafel.mp4`                | Leg de liniaal op de tafel.                 | De wereld met de liniaal in de objectbalk; een hand pakt het en zet het op de juiste plek. |
| lp-008 | `lp-008-hint-01-zoek-de-liniaal.mp4`                            | Zoek de liniaal.                            | De objectbalk onderin; de liniaal licht op en wipt even.                                   |
| lp-008 | `lp-008-hint-02-kijk-naar-liniaal.mp4`                          | Kijk naar het plaatje dat oplicht: liniaal. | Alleen de liniaal blijft helder, de rest vervaagt.                                         |
| lp-008 | `lp-008-feedback-de-liniaal-ligt-op-de-tafel.mp4`               | De liniaal ligt op de tafel.                | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-009 | `lp-009-opdracht-leg-de-pen-naast-het-boek.mp4`                 | Leg de pen naast het boek.                  | De wereld met de pen in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-009 | `lp-009-hint-01-zoek-de-pen.mp4`                                | Zoek de pen.                                | De objectbalk onderin; de pen licht op en wipt even.                                       |
| lp-009 | `lp-009-hint-02-kijk-naar-pen.mp4`                              | Kijk naar het plaatje dat oplicht: pen.     | Alleen de pen blijft helder, de rest vervaagt.                                             |
| lp-009 | `lp-009-feedback-de-pen-ligt-naast-het-boek.mp4`                | De pen ligt naast het boek.                 | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-010 | `lp-010-opdracht-zet-de-jas-rechts-in-de-klas.mp4`              | Zet de jas rechts in de klas.               | De wereld met de jas in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-010 | `lp-010-hint-01-zoek-de-jas.mp4`                                | Zoek de jas.                                | De objectbalk onderin; de jas licht op en wipt even.                                       |
| lp-010 | `lp-010-hint-02-kijk-naar-jas.mp4`                              | Kijk naar het plaatje dat oplicht: jas.     | Alleen de jas blijft helder, de rest vervaagt.                                             |
| lp-010 | `lp-010-feedback-de-jas-hangt-rechts-in-de-klas.mp4`            | De jas hangt rechts in de klas.             | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-011 | `lp-011-opdracht-zet-de-klok-boven-de-tafels.mp4`               | Zet de klok boven de tafels.                | De wereld met de klok in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-011 | `lp-011-hint-01-zoek-de-klok.mp4`                               | Zoek de klok.                               | De objectbalk onderin; de klok licht op en wipt even.                                      |
| lp-011 | `lp-011-hint-02-kijk-naar-klok.mp4`                             | Kijk naar het plaatje dat oplicht: klok.    | Alleen de klok blijft helder, de rest vervaagt.                                            |
| lp-011 | `lp-011-feedback-de-klok-hangt-boven-de-tafels.mp4`             | De klok hangt boven de tafels.              | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-012 | `lp-012-opdracht-zet-de-stoel-midden-op-de-vloer.mp4`           | Zet de stoel midden op de vloer.            | De wereld met de stoel in de objectbalk; een hand pakt het en zet het op de juiste plek.   |
| lp-012 | `lp-012-hint-01-zoek-de-stoel.mp4`                              | Zoek de stoel.                              | De objectbalk onderin; de stoel licht op en wipt even.                                     |
| lp-012 | `lp-012-hint-02-kijk-naar-stoel.mp4`                            | Kijk naar het plaatje dat oplicht: stoel.   | Alleen de stoel blijft helder, de rest vervaagt.                                           |
| lp-012 | `lp-012-feedback-de-stoel-staat-midden-op-de-vloer.mp4`         | De stoel staat midden op de vloer.          | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-013 | `lp-013-opdracht-leg-de-schaar-links-in-de-klas.mp4`            | Leg de schaar links in de klas.             | De wereld met de schaar in de objectbalk; een hand pakt het en zet het op de juiste plek.  |
| lp-013 | `lp-013-hint-01-zoek-de-schaar.mp4`                             | Zoek de schaar.                             | De objectbalk onderin; de schaar licht op en wipt even.                                    |
| lp-013 | `lp-013-hint-02-kijk-naar-schaar.mp4`                           | Kijk naar het plaatje dat oplicht: schaar.  | Alleen de schaar blijft helder, de rest vervaagt.                                          |
| lp-013 | `lp-013-feedback-de-schaar-ligt-links-in-de-klas.mp4`           | De schaar ligt links in de klas.            | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-014 | `lp-014-opdracht-zet-de-rugzak-ver-weg-in-de-klas.mp4`          | Zet de rugzak ver weg in de klas.           | De wereld met de rugzak in de objectbalk; een hand pakt het en zet het op de juiste plek.  |
| lp-014 | `lp-014-hint-01-zoek-de-rugzak.mp4`                             | Zoek de rugzak.                             | De objectbalk onderin; de rugzak licht op en wipt even.                                    |
| lp-014 | `lp-014-hint-02-kijk-naar-rugzak.mp4`                           | Kijk naar het plaatje dat oplicht: rugzak.  | Alleen de rugzak blijft helder, de rest vervaagt.                                          |
| lp-014 | `lp-014-feedback-de-rugzak-staat-ver-weg-in-de-klas.mp4`        | De rugzak staat ver weg in de klas.         | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-015 | `lp-015-opdracht-leg-de-gum-dichtbij-het-potlood.mp4`           | Leg de gum dichtbij het potlood.            | De wereld met de gum in de objectbalk; een hand pakt het en zet het op de juiste plek.     |
| lp-015 | `lp-015-hint-01-zoek-de-gum.mp4`                                | Zoek de gum.                                | De objectbalk onderin; de gum licht op en wipt even.                                       |
| lp-015 | `lp-015-hint-02-kijk-naar-gum.mp4`                              | Kijk naar het plaatje dat oplicht: gum.     | Alleen de gum blijft helder, de rest vervaagt.                                             |
| lp-015 | `lp-015-feedback-de-gum-ligt-dichtbij-het-potlood.mp4`          | De gum ligt dichtbij het potlood.           | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |
| lp-016 | `lp-016-opdracht-leg-de-lijm-tussen-de-schaar-en-het-boek.mp4`  | Leg de lijm tussen de schaar en het boek.   | De wereld met de lijm in de objectbalk; een hand pakt het en zet het op de juiste plek.    |
| lp-016 | `lp-016-hint-01-zoek-de-lijm.mp4`                               | Zoek de lijm.                               | De objectbalk onderin; de lijm licht op en wipt even.                                      |
| lp-016 | `lp-016-hint-02-kijk-naar-lijm.mp4`                             | Kijk naar het plaatje dat oplicht: lijm.    | Alleen de lijm blijft helder, de rest vervaagt.                                            |
| lp-016 | `lp-016-feedback-de-lijm-ligt-tussen-de-schaar-en-het-boek.mp4` | De lijm ligt tussen de schaar en het boek.  | Het voorwerp staat op zijn plek en beweegt kort vrolijk.                                   |

### 3.2 Video's bij de quizvragen — 14 clips

| ID     | Bestandsnaam                              | Gesproken tekst      | Wat je in beeld ziet                                                      |
| :----- | :---------------------------------------- | :------------------- | :------------------------------------------------------------------------ |
| cw-001 | `cw-001-opdracht-waar-is-het-boek.mp4`    | Waar is het boek?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-002 | `cw-002-opdracht-waar-is-de-liniaal.mp4`  | Waar is de liniaal?  | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-003 | `cw-003-opdracht-waar-is-de-pen.mp4`      | Waar is de pen?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-004 | `cw-004-opdracht-waar-is-de-tafel.mp4`    | Waar is de tafel?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-005 | `cw-005-opdracht-waar-is-de-klok.mp4`     | Waar is de klok?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-006 | `cw-006-opdracht-waar-is-de-schaar.mp4`   | Waar is de schaar?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-007 | `cw-007-opdracht-waar-is-de-rugzak.mp4`   | Waar is de rugzak?   | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-008 | `cw-008-opdracht-waar-is-de-stoel.mp4`    | Waar is de stoel?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-009 | `cw-009-opdracht-waar-is-het-potlood.mp4` | Waar is het potlood? | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-010 | `cw-010-opdracht-waar-is-de-gum.mp4`      | Waar is de gum?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-011 | `cw-011-opdracht-waar-is-de-kast.mp4`     | Waar is de kast?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-012 | `cw-012-opdracht-waar-is-het-bord.mp4`    | Waar is het bord?    | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-013 | `cw-013-opdracht-waar-is-de-jas.mp4`      | Waar is de jas?      | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |
| cw-014 | `cw-014-opdracht-waar-is-de-lijm.mp4`     | Waar is de lijm?     | De keuzekaarten in beeld; de mascotte kijkt vragend, geen kaart licht op. |

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
| **A-05** |  🎨  | **Logo en wereldicoon** — het icoon bestaat al (`world-school.webp`); een startlogo moet nog           |   ⬜   |
| **A-06** |  🎨  | **Feedbackgeluiden**: `feedback-correct.wav` en `feedback-wrong.wav` uit het strandspel kopiëren (CC0) |   ⬜   |
| **A-07** |  🎨  | **Achtergrondmuziek** kiezen of die van het strandspel hergebruiken                                    |   ⬜   |
| **A-08** |  🎨  | **Mascotte** hergebruiken of een wereld-eigen variant tekenen                                          |   ⬜   |

#### Stickers (A-01)

| Bestandsnaam            | Woord   | Wat erop staat                  |
| :---------------------- | :------ | :------------------------------ |
| `book-sticker.webp`     | boek    | Een boek om in te lezen.        |
| `pen-sticker.webp`      | pen     | Een pen om mee te schrijven.    |
| `pencil-sticker.webp`   | potlood | Een potlood om mee te tekenen.  |
| `scissors-sticker.webp` | schaar  | Een schaar om mee te knippen.   |
| `glue-sticker.webp`     | lijm    | Lijm om mee te plakken.         |
| `eraser-sticker.webp`   | gum     | Een gum om mee uit te vegen.    |
| `backpack-sticker.webp` | rugzak  | Een rugzak vol schoolspullen.   |
| `desk-sticker.webp`     | tafel   | Een tafel om aan te werken.     |
| `chair-sticker.webp`    | stoel   | Een stoel om op te zitten.      |
| `cupboard-sticker.webp` | kast    | Een kast vol spullen.           |
| `board-sticker.webp`    | bord    | Het schoolbord voor in de klas. |
| `clock-sticker.webp`    | klok    | De klok aan de muur.            |
| `ruler-sticker.webp`    | liniaal | Een liniaal om mee te meten.    |
| `coat-sticker.webp`     | jas     | Een jas aan de kapstok.         |

#### Obstakels (A-02)

| Bestandsnaam                 | Wat je ziet                          |
| :--------------------------- | :----------------------------------- |
| `papiervlieger-obstacle.png` | een rondtollend papieren vliegtuigje |
| `verfvlek-obstacle.png`      | een spat verf                        |
| `boekenstapel-obstacle.png`  | een wankele stapel boeken            |
| `prullenbak-obstacle.png`    | een omgevallen prullenbak            |

#### Beloningen (A-03)

| Drempel | Bestandsnaam                |
| :------ | :-------------------------- |
| 3 ⭐    | `reward-01-sticker-boek`    |
| 8 ⭐    | `reward-02-bordkleur-groen` |
| 16 ⭐   | `reward-03-sticker-potlood` |
| 28 ⭐   | `reward-04-sterren-spoor`   |
| 42 ⭐   | `reward-05-schoolbezem`     |
| 60 ⭐   | `reward-06-sticker-rugzak`  |
| 85 ⭐   | `reward-07-gouden-klok`     |

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
