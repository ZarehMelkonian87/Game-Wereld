# 🏗️ Modus — Zeg & Bouw

> Productieve modus: het kind bouwt zelf een strandscène met samengestelde zinnen. Hoort bij de [GDD](GDD-index.md).

| Veld             | Waarde                                                                                                                                                                                                                                               |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Modus-ID**     | `MODE_ZEG_BOUW` (`zeg-en-bouw`)                                                                                                                                                                                                                      |
| **Scherm**       | `SCR_MSA_ZEG_BOUW` · [`screens/zeg-en-bouw/`](../../src/app/games/magisch-strand-avontuur/screens/zeg-en-bouw/)                                                                                                                                      |
| **Logica**       | [`logic/zeg-en-bouw-cards.ts`](../../src/app/games/magisch-strand-avontuur/logic/zeg-en-bouw-cards.ts) + `parseCompoundPlacements` in [`logic/spoken-command-parser.ts`](../../src/app/games/magisch-strand-avontuur/logic/spoken-command-parser.ts) |
| **Ontgrendeld**  | Vanaf 8 ⭐                                                                                                                                                                                                                                           |
| **Talige focus** | Productief: zelf een zin met meerdere onderdelen maken                                                                                                                                                                                               |
| **Status**       | 🟢 Gebouwd, getest (e2e `zeg-en-bouw.spec.ts`, 6 tests + unit)                                                                                                                                                                                       |

---

## 1. Waarom deze modus

Bij Zeg & Zet voert het kind één opdracht van de game uit. Hier draait het om: het kind bedenkt **zelf** wat er op het strand komt en zegt dat in **één zin met meerdere objecten** ("Zet de boot in de zee en leg de bal naast de parasol"). Dat is een stap richting vrije taalproductie, zonder de tijdsdruk van Zeg & Vlieg.

## 2. Twee varianten

| Variant              | Doel                                                                  | Einde                           |
| :------------------- | :-------------------------------------------------------------------- | :------------------------------ |
| **A · Bouwopdracht** | Een thema-kaart: "zet N passende dingen neer"                         | Kaart af → ronde-eindscherm     |
| **B · Vrij bouwen**  | Geen doel: elk plaatje mag, de mascotte benoemt mee wat er gebouwd is | Geen einde; het kind stopt zelf |

Schakelen kan met de knop **Vrij bouwen** / **Bouwopdracht** op het bouwscherm.

## 3. De bouwkaarten (variant A)

Vijf kaarten, per ronde geschud:

| Kaart            | Opdracht                                                         | Doel | Passende objecten                            |
| :--------------- | :--------------------------------------------------------------- | :--: | :------------------------------------------- |
| **Vaarstrand**   | "Bouw een vaarstrand! Zet 2 dingen die kunnen varen of drijven." |  2   | boot, dolfijn, vuurtoren                     |
| **Dierenstrand** | "Maak een dierenstrand! Zet 2 dieren of schelpen op het strand." |  2   | krab, dolfijn, schelp                        |
| **Speelstrand**  | "Maak een speelstrand! Zet 3 speeldingen neer."                  |  3   | bal, vlieger, zandkasteel, parasol, handdoek |
| **Luchtstrand**  | "Wat vliegt er boven het strand? Zet 2 dingen in de lucht."      |  2   | vliegtuig, vlieger, zon                      |
| **Feeststrand**  | "Maak jouw mooiste strand! Kies zelf 3 dingen."                  |  3   | alles mag                                    |

Het doel is bewust **soepel**: het kind kiest zelf welke passende objecten en waar ze komen. Een niet-passend object levert een vriendelijke tip op, geen straf. Dubbel plaatsen telt één keer; verplaatsen levert geen extra sterren op.

## 4. Bouwen

| Weg         | Hoe                                                                                                |
| :---------- | :------------------------------------------------------------------------------------------------- |
| **Tikken**  | Plaatje kiezen in de balk → op het strand tikken. Zonder keuze: "Kies eerst een plaatje onderaan." |
| **Spreken** | Eén zin met meerdere objecten; live wave + transcriptie                                            |
| **Typen**   | Hetzelfde typ-paneel als Zeg & Zet, inclusief overtyp-hulp                                         |

`parseCompoundPlacements` splitst de zin in losse plaatsingen en voert ze allemaal uit. De zin mag koppelwoorden bevatten ("en", "daarna") en verschillende zones noemen.

## 5. Beloning

| Situatie                                   | Sterren                  |
| :----------------------------------------- | :----------------------- |
| Elk nieuw, passend object                  | 2 ⭐                     |
| Eén zin die **2 of meer** objecten plaatst | +1 ⭐ compound-bonus     |
| Vrij bouwen                                | geen sterren (vrij spel) |

## 6. Ronde-einde

Zodra het doel van de kaart gehaald is, blijft de scène eerst nog even staan — het kind ziet wat het gebouwd heeft — en verschijnt dan de "Strand af!"-overlay met een korte viering. Daarna toont `ZegBouwRoundSummary` de gebouwde objecten, de verdiende sterren en de eerstvolgende beloning, met **Volgende strand** (verse kaart) en **Menu**.

In vrij bouwen is er geen doel en geen eindscherm: het kind bouwt door tot het zelf stopt.

## 7. Wat deze modus (nog) niet doet

De samengestelde parser plaatst op **benoemde zones**. Een relatie of volgorde ten opzichte van andere **objecten** — "zet de bal **tussen** de schelp en de handdoek" — wordt hier nog niet berekend; dat kan Zeg & Zet wel. Dit staat als taak in de [Versie 2-backlog](Versie-2-Backlog.md).

## 8. Testhaken

`zeg-bouw-screen`, `zeg-bouw-card`, `zeg-bouw-progress`, `zeg-bouw-tap-target`, `zeg-bouw-feedback`, `zeg-bouw-complete`, `zeg-bouw-summary-objects`, `zeg-bouw-next-card-button`, `zeg-bouw-menu-button`, `zeg-bouw-mode-toggle`, `zeg-bouw-next-reward`.
