# 🎪 GDD & Implementatieplan – Groot Circus-Avontuur

**Project:** Groot Circus-Avontuur (kloon van Magisch Strand-Avontuur, thema = circus)
**Versie:** 1.1 (Analyse, GDD & Implementatieplan – nog niet gebouwd)
**Basisgame:** [Magisch Strand-Avontuur](../src/app/games/magisch-strand-avontuur)
**Doel van dit document:** Vastleggen (1) hoe de bestaande strandgame werkt, (2) wat exact gekopieerd wordt, (3) wat opnieuw gemaakt wordt, (4) de complete circus-woordenlijst en opdrachten, (5) de benodigde afbeeldingen, en (6) de complete tekstlijst voor de video-animaties.

> ⚠️ **Status:** Dit is een plan. Er is nog geen code of asset aangepast. Bouwen start pas na jouw akkoord op de open beslissingen (§12).

### Bevestigde keuzes (v1.1)
- **Titel:** Groot Circus-Avontuur — game-id `groot-circus-avontuur`, icoon 🎪
- **Doelwoorden:** 19 objecten (12 basis + 7 extra dieren: kip, poes, big, muis, beer, zeehond, hond)
- **Assets:** jij levert de afbeeldingen én video-animaties aan; ik bouw eerst met de strand-assets als placeholder zodat de game direct speelbaar is.

---

## 0. Begripsbevestiging – heb ik je goed begrepen?

Jij wilt een **nieuwe game die een exacte kopie is van Magisch Strand-Avontuur**, maar met **circus** als thema. Concreet:

| Onderdeel | Wat jij vraagt | Mijn interpretatie |
| :--- | :--- | :--- |
| **Gameplay** | Blijft exact hetzelfde | Alle 3 spelmodi (Zeg & Zet, Kies het Woord, Zeg & Vlieg), scoring, hints, scaffolding, spraakherkenning, offline-werking → 1-op-1 identiek in logica |
| **UI / menu's / knoppen** | Exacte kopie | Alle componenten in `components/ui/**` en alle schermen → identiek qua structuur en gedrag; alleen thema-teksten/kleuren/afbeeldingen wijzigen |
| **Doelwoordenlijst** | Anders → circuswoorden | Nieuwe 19 objecten + spraak-aliassen + opdrachten die binnen circus passen |
| **Afbeeldingen** | Bijpassend (circus) | Nieuwe sticker-, achtergrond-, logo- en icoon-assets in circusstijl (door jou aangeleverd) |
| **Titel** | Bijpassend | **Groot Circus-Avontuur** |
| **Video-animaties** | Ik lever een tekstlijst; jij maakt de animaties | Complete scriptlijst met alle gesproken teksten per videobestand (§9) |

---

## 1. Analyse van Magisch Strand-Avontuur

### 1.1 High-level concept
Een spraakgestuurde, logopedisch verantwoorde educatieve game voor kinderen van 4–8 jaar (kleuters, groep 1–4, NT2, TOS). Het kind oefent woordenschat, zinsbegrip en ruimtelijke plaatsbegrippen via **luisteren → begrijpen → doen → bekrachtiging**. Multimodale invoer: **tap, drag-and-drop én stem** (Web Speech API, `nl-NL`, 100% lokaal).

### 1.2 Technische architectuur (relevant voor de kloon)

```
src/app/
├─ game-platform/contracts        ← defineGameManifest, GameRuntime, GameRegistryEntry
├─ games/
│  ├─ registry.ts                 ← registreert alle games (hier voegen we de circusgame toe)
│  ├─ catalog-manifests.ts        ← "coming soon" manifesten
│  ├─ magisch-strand-avontuur/    ← BRONGAME (kopiëren)
│  └─ rekenen-strand/             ← 2e game, bewijst dat een game een op zichzelf staande map is
```

**Belangrijkste inzicht:** een game is een **volledig zelfstandige map**. `rekenen-strand` importeert *niets* uit `magisch-strand-avontuur`. Een nieuwe game = **map dupliceren + registreren + content vervangen**. Er is geen gedeelde UI-bibliotheek waar we omheen moeten werken; de UI-bouwstenen leven binnen de game-map zelf (`components/ui/**`) en worden dus mee-gekopieerd (precies wat jij wilt: "exacte kopie van de UI").

### 1.3 De drie spelmodi (blijven identiek)

| Modus | Bestand(en) | Wat het doet |
| :--- | :--- | :--- |
| **1. Zeg & Zet** (SceneBuilder) | `screens/scene-builder/**` | Kind plaatst stickers op een canvas op de juiste plek (via slepen of spraakcommando "zet de … in de …"). Ruimtelijke begrippen. |
| **2. Kies het Woord** | `screens/word-choice/**` | Receptieve woordenschatquiz: "Waar is de …?" → 2–4 keuzekaarten. |
| **3. Zeg & Vlieg** (Voice Side-Scroller) | `screens/voice-side-scroller/**` | Kind vliegt en zegt woorden hardop om objecten te verzamelen; ontwijkt obstakels. Productieve woordenschat. |

Gedeelde bouwstenen: `screens/start`, `screens/adventure-select`, `screens/reward`, `screens/settings`, `components/**`, `logic/**`, `hooks/**`, `state/**`, `runtime/**`.

### 1.4 Contentmodel (dit is de kern die verandert)

Alle spelinhoud zit **data-gedreven** in enkele bestanden:

| Bestand | Inhoud | Verandert voor circus? |
| :--- | :--- | :--- |
| `content.ts` | `beachObjects` (12), `beachZones` (9), 16 scene-opdrachten, 12 keuze-opdrachten, `beachRewards`, `beachWorld` | **Ja – volledig** |
| `types.ts` | `SceneObjectCategory`, `GameWorld.theme`, aliassen van types | **Ja – klein** (categorieën + themalabel) |
| `worlds.ts` | Wereld-selectie definitie (`strand`) | **Ja – klein** |
| `manifest.ts` | id, titel, icon, description, contentVersion, offlinePackage | **Ja** |
| `asset-urls.ts` | Alle `new URL(...)` naar afbeeldingen/video's | **Ja – bestandsnamen** |
| `logic/spoken-command-parser.ts` | Object/zone/concept-aliassen voor spraak | **Ja – object+zone aliassen** |
| `screens/voice-side-scroller/voiceSideScrollerWords.ts` | Vlieg-woorden + aliassen | **Ja – volledig** |
| `assets/**` | Afbeeldingen (47 png, 3 webp), video's (81 mp4), audio (1 mp3) | **Ja – nieuwe assets** |
| `assets/offline-package.source.json` | Offline-pakket metadata | **Ja – id/gameId/contentVersion** |

### 1.5 Datastructuur van een object (`SceneObject`)
```ts
{ id, label, pluralLabel?, article: "de"|"het", category, emoji, assetId, assetPath, description, vocabularyLevel: 1..5, tags[] }
```

### 1.6 Datastructuur van een opdracht (scene-builder)
```ts
sceneTask({ id, level, prompt, objectId, zoneId, relation, anchorObjectIds?, hint, feedbackSentence })
```
De ruimtelijke begrippen zijn: `in, op, onder, boven, naast, tussen, links, rechts, midden, dichtbij, ver weg`. **Deze blijven exact hetzelfde** — alleen de objecten/zones eromheen worden circus.

### 1.7 Scene-zones & geometrie (belangrijk voor hergebruik)
De strandscène heeft 9 zones met vaste geometrie (`visualHintPath`, `x/y/width/height`): `lucht, zee, links-zee, boven-zee, ver-weg-zee, eiland, strand, midden-strand, rechts-strand`. Relatieve zones (`op/naast/dichtbij/tussen` bij een ankerobject) worden **dynamisch** berekend in `logic/dynamic-scene-relations.ts`.

> 💡 **Sleutelbeslissing:** we hergebruiken de **exacte geometrie** (dezelfde `x/y/width/height` en `visualHintPath`-polygonen) en wijzigen alleen `id`, `label`, `description`. Zo hoeven we de zone-wiskunde niet opnieuw uit te vinden en past de nieuwe circusachtergrond op dezelfde bandindeling (boven-band / midden-band / onder-band + landmark rechts).

### 1.8 Beloningen, opslag & privacy (blijven identiek)
- ⭐ Woordsterren + ⚡ Tempo; ontgrendelbare "bezem"-skins.
- Opslag via Dexie/IndexedDB als `PracticeEventV1` records (platform).
- Geen audio-opslag, geen tracking, offline-first PWA.

### 1.9 Kwaliteits-/buildpipeline (moet blijven werken)
`npm run check` = format + lint + typecheck + unit tests + asset-tests + architecture (dependency-cruiser) + doc-links. Verder: `knip` (dead-code), `playwright` (e2e/a11y), `scripts/generate-asset-manifest.mjs` (offline-pakket + asset-report). **Al deze checks moeten groen blijven na het toevoegen van de circusgame.**

---

## 2. GDD – Groot Circus-Avontuur

### 2.1 Elevator pitch
> *"Groot Circus-Avontuur neemt jonge kinderen mee onder de grote circustent. Ze plaatsen artiesten en dieren in de piste, kiezen het juiste woord en roepen circuswoorden hardop om ballonnen en hoepels te verzamelen — en versterken zo spelenderwijs hun woordenschat, zinsbegrip en ruimtelijk inzicht."*

### 2.2 Wat blijft 100% gelijk (gameplay & UX)
- De drie spelmodi, hun regels, scoring, hints (3 hintniveaus + begripsuitleg), scaffolding en foutloos leren.
- Alle schermen, menu's, knoppen, overlays, instellingen, beloningsscherm.
- Spraakherkenning (15s, 2,5s stilte, live golfanimatie, kindertaal-aliassen), toetsenbord-fallback.
- De 11 ruimtelijke plaatsbegrippen.
- Data-architectuur, privacy, toegankelijkheid, offline-werking.

### 2.3 Wat wijzigt (thema-laag)
- **Setting:** strand & zee → **circustent & piste**.
- **Doelwoorden:** 12 strandobjecten → 19 circusobjecten.
- **Scène-zones (labels):** lucht/zee/strand/eiland → nok/piste/vloer/tribune.
- **Afbeeldingen & video's:** strand-assets → circus-assets.
- **Titel, logo, icoon, kleuren.**

---

## 3. Doelwoordenlijst – Circus (19 objecten)

Categorieën: `dieren`, `artiesten` (nieuw), `voertuigen`, `circusspullen` (vervangt `strandspullen`), `decor` (nieuw, vervangt `natuur`).

| # | id | Doelwoord | Lidwoord | Categorie | Meervoud | Verkleinwoord | Niveau | Emoji |
| :- | :-- | :-- | :-- | :-- | :-- | :-- | :-: | :-: |
| 1 | `clown` | clown | de | artiesten | clowns | clowntje | 1 | 🤡 |
| 2 | `acrobaat` | acrobaat | de | artiesten | acrobaten | – | 3 | 🤸 |
| 3 | `leeuw` | leeuw | de | dieren | leeuwen | leeuwtje | 2 | 🦁 |
| 4 | `olifant` | olifant | de | dieren | olifanten | olifantje | 2 | 🐘 |
| 5 | `aap` | aap | de | dieren | apen | aapje | 1 | 🐵 |
| 6 | `kip` | kip | de | dieren | kippen | kipje | 1 | 🐔 |
| 7 | `poes` | poes | de | dieren | poezen | poesje | 1 | 🐱 |
| 8 | `big` | big | de | dieren | biggen | biggetje | 1 | 🐷 |
| 9 | `muis` | muis | de | dieren | muizen | muisje | 1 | 🐭 |
| 10 | `beer` | beer | de | dieren | beren | beertje | 2 | 🐻 |
| 11 | `zeehond` | zeehond | de | dieren | zeehonden | zeehondje | 3 | 🦭 |
| 12 | `hond` | hond | de | dieren | honden | hondje | 1 | 🐕 |
| 13 | `eenwieler` | eenwieler | de | voertuigen | eenwielers | – | 3 | 🚲 |
| 14 | `kanon` | kanon | **het** | voertuigen | kanonnen | kanonnetje | 3 | 💥 |
| 15 | `bal` | bal | de | circusspullen | ballen | balletje | 1 | 🔴 |
| 16 | `hoepel` | hoepel | de | circusspullen | hoepels | hoepeltje | 2 | ⭕ |
| 17 | `ballon` | ballon | de | circusspullen | ballonnen | ballonnetje | 1 | 🎈 |
| 18 | `trommel` | trommel | de | circusspullen | trommels | trommeltje | 2 | 🥁 |
| 19 | `vlag` | vlag | de | decor | vlaggen | vlaggetje | 2 | 🚩 |

> **Let op (het/de):** alleen `kanon` is een het-woord. Alle overige 18 zijn de-woorden. De feedback-generator in `content.ts` gebruikt momenteel altijd "de …"; voor `kanon` corrigeren we dit naar "het kanon" (bekende bug uit de strandgame, zie ook `animation-texts.md`).

### 3.1 Spraak-aliassen & kindertaal (voor `spoken-command-parser.ts` en `voiceSideScrollerWords.ts`)

| id | Aliassen |
| :-- | :-- |
| `clown` | clown, clowns, clowntje, clowntjes, pias, nar |
| `acrobaat` | acrobaat, acrobaten, acrobatje, turner, koorddanser |
| `leeuw` | leeuw, leeuwen, leeuwtje, leeuwtjes, welp |
| `olifant` | olifant, olifanten, olifantje, slurf |
| `aap` | aap, apen, aapje, aapjes, chimpansee |
| `kip` | kip, kippen, kipje, kuiken, hen, haan |
| `poes` | poes, poezen, poesje, kat, katten, katje, kitten |
| `big` | big, biggen, biggetje, varken, varkens |
| `muis` | muis, muizen, muisje, muisjes |
| `beer` | beer, beren, beertje, teddybeer, bruine beer |
| `zeehond` | zeehond, zeehonden, zeehondje, rob, zeeleeuw |
| `hond` | hond, honden, hondje, hondjes, puppy, poedel |
| `eenwieler` | eenwieler, eenwielers, wieler, fiets, eenwielertje |
| `kanon` | kanon, kanonnen, kanonnetje, circuskanon |
| `bal` | bal, ballen, balletje, balletjes, jongleerbal |
| `hoepel` | hoepel, hoepels, hoepeltje, ring, hoela |
| `ballon` | ballon, ballonnen, ballonnetje, luchtballon |
| `trommel` | trommel, trommels, trommeltje, drum |
| `vlag` | vlag, vlaggen, vlaggetje, vlaggetjes |

---

## 4. Scène-ontwerp – de circustent

### 4.1 Zone-mapping (geometrie hergebruikt van strand)

| Circus zone-id | Label | Vervangt (strand) | Ondersteunde begrippen |
| :-- | :-- | :-- | :-- |
| `nok` | bovenin de tent (nok) | `lucht` | boven, links, rechts, midden, ver weg |
| `piste` | piste (de ring) | `zee` | in, op, links, rechts, midden, dichtbij, ver weg |
| `links-piste` | links in de piste | `links-zee` | links, in |
| `boven-piste` | boven de piste | `boven-zee` | boven, ver weg |
| `ver-weg-piste` | ver weg boven de piste | `ver-weg-zee` | ver weg, boven |
| `tribune` | tribune (publiek, rechts) | `eiland` | op, rechts, ver weg |
| `vloer` | vloer (voorgrond) | `strand` | op, naast, tussen, links, rechts, midden, dichtbij, ver weg |
| `midden-vloer` | midden op de vloer | `midden-strand` | midden, op |
| `rechts-vloer` | rechts op de vloer | `rechts-strand` | rechts, op |

> De **achtergrondafbeelding** moet dezelfde 3-bands-indeling volgen: bovenband = nok/tentdak, middenband = piste/ring, onderband = vloer/voorgrond, met een verhoging rechts = tribune. Zo blijven de bestaande zone-polygonen kloppen.

### 4.2 Zone-aliassen (spraak)

| zone-id | Aliassen |
| :-- | :-- |
| `nok` | nok, in de nok, bovenin de tent, boven in de tent, tentdak, hoog in de tent |
| `piste` | piste, ring, manege, in de piste, in de ring, in de manege |
| `links-piste` | links, linkerkant, links in de piste |
| `boven-piste` | boven de piste, boven de ring |
| `ver-weg-piste` | ver weg boven de piste, ver weg in de tent |
| `tribune` | tribune, op de tribune, publiek, bij het publiek |
| `vloer` | vloer, grond, op de vloer, op de grond |
| `midden-vloer` | midden, in het midden, midden op de vloer |
| `rechts-vloer` | rechts, rechterkant, rechts op de vloer |

---

## 5. Opdrachten – Zeg & Zet (23 scene-opdrachten)

Zelfde IDs-schema, niveaus en ruimtelijke begrippen als het strand; `lp-001`–`lp-016` volgen de strandstructuur, `lp-017`–`lp-023` dekken de extra dieren. Ankers gebruiken de dynamische zone-berekening (ongewijzigd).

| ID | Niv | Opdracht (prompt) | object | zone | begrip | anker | Feedbackzin |
| :-- | :-: | :-- | :-- | :-- | :-- | :-- | :-- |
| `lp-001` | 1 | Zet de eenwieler in de piste. | eenwieler | piste | in | – | Goed zo! De eenwieler staat in de piste. |
| `lp-002` | 1 | Zet de leeuw in de piste. | leeuw | piste | in | – | Mooi! De leeuw staat in de piste. |
| `lp-003` | 1 | Leg de bal op de vloer. | bal | vloer | op | – | Ja! De bal ligt op de vloer. |
| `lp-004` | 1 | Zet de vlag op de tribune. | vlag | tribune | op | – | Goed gedaan! De vlag staat op de tribune. |
| `lp-005` | 1 | Zet de ballon boven in de nok. | ballon | nok | boven | – | Goed zo! De ballon zweeft boven in de nok. |
| `lp-006` | 1 | Zet het kanon boven de piste. | kanon | boven-piste | boven | – | Knap! Het kanon staat boven de piste. |
| `lp-007` | 1 | Zet de hoepel op de vloer. | hoepel | vloer | op | – | Ja! De hoepel ligt op de vloer. |
| `lp-008` | 1 | Zet de aap op de trommel. | aap | (dyn) op-trommel | op | trommel | Goed! De aap zit op de trommel. |
| `lp-009` | 2 | Zet de clown naast de hoepel. | clown | (dyn) naast-hoepel | naast | hoepel | Mooi! De clown staat naast de hoepel. |
| `lp-010` | 2 | Zet de olifant rechts op de vloer. | olifant | rechts-vloer | rechts | – | Ja! De olifant staat rechts op de vloer. |
| `lp-011` | 2 | Zet de acrobaat boven de piste. | acrobaat | boven-piste | boven | – | Knap! De acrobaat vliegt boven de piste. |
| `lp-012` | 2 | Leg de trommel midden op de vloer. | trommel | midden-vloer | midden | – | Knap! De trommel staat midden op de vloer. |
| `lp-013` | 2 | Zet de eenwieler links in de piste. | eenwieler | links-piste | links | – | Goed! De eenwieler rijdt links in de piste. |
| `lp-014` | 3 | Zet het kanon ver weg boven de piste. | kanon | ver-weg-piste | ver weg | – | Mooi! Het kanon staat ver weg boven de piste. |
| `lp-015` | 3 | Leg de bal dichtbij de hoepel. | bal | (dyn) dichtbij-hoepel | dichtbij | hoepel | Ja! De bal ligt dichtbij de hoepel. |
| `lp-016` | 3 | Leg de hoepel tussen de bal en de ballon. | hoepel | (dyn) tussen-bal-ballon | tussen | bal, ballon | Knap! De hoepel ligt tussen de bal en de ballon. |
| `lp-017` | 1 | Zet de hond op de vloer. | hond | vloer | op | – | Goed zo! De hond staat op de vloer. |
| `lp-018` | 1 | Zet de zeehond in de piste. | zeehond | piste | in | – | Mooi! De zeehond zit in de piste. |
| `lp-019` | 2 | Zet de poes op de trommel. | poes | (dyn) op-trommel | op | trommel | Goed! De poes zit op de trommel. |
| `lp-020` | 2 | Zet de muis naast de bal. | muis | (dyn) naast-bal | naast | bal | Mooi! De muis zit naast de bal. |
| `lp-021` | 2 | Zet de big rechts op de vloer. | big | rechts-vloer | rechts | – | Ja! De big staat rechts op de vloer. |
| `lp-022` | 3 | Zet de kip tussen de hoepel en de bal. | kip | (dyn) tussen-hoepel-bal | tussen | hoepel, bal | Knap! De kip staat tussen de hoepel en de bal. |
| `lp-023` | 3 | Zet de beer dichtbij de trommel. | beer | (dyn) dichtbij-trommel | dichtbij | trommel | Ja! De beer staat dichtbij de trommel. |

Alle 19 objecten komen minstens één keer voor; `eenwieler`, `kanon`, `bal` en `hoepel` worden (net als `boot`/`vliegtuig` bij het strand) hergebruikt in meerdere opdrachten.

---

## 6. Opdrachten – Kies het Woord (19 keuze-opdrachten)

| ID | Niv | Vraag | doelwoord | keuze-opties | distractor-strategie |
| :-- | :-: | :-- | :-- | :-- | :-- |
| `cw-001` | 1 | Waar is de leeuw? | leeuw | leeuw, eenwieler | different-category |
| `cw-002` | 1 | Waar is de eenwieler? | eenwieler | eenwieler, bal | different-category |
| `cw-003` | 1 | Waar is de bal? | bal | bal, hoepel | same-theme |
| `cw-004` | 2 | Waar is de olifant? | olifant | olifant, leeuw, vlag | same-theme |
| `cw-005` | 2 | Waar is de ballon? | ballon | ballon, hoepel, aap | same-theme |
| `cw-006` | 2 | Waar is de clown? | clown | clown, acrobaat, eenwieler | same-theme |
| `cw-007` | 2 | Waar is de aap? | aap | aap, leeuw, hoepel | same-category |
| `cw-008` | 2 | Waar is de trommel? | trommel | trommel, ballon, bal | same-category |
| `cw-009` | 3 | Waar is de hoepel? | hoepel | hoepel, aap, bal, ballon | same-theme |
| `cw-010` | 3 | Waar is de vlag? | vlag | vlag, kanon, ballon, bal | same-theme |
| `cw-011` | 3 | Waar is het kanon? | kanon | kanon, eenwieler, leeuw, clown | same-category |
| `cw-012` | 3 | Waar is de acrobaat? | acrobaat | acrobaat, clown, olifant, aap | same-category |
| `cw-013` | 1 | Waar is de hond? | hond | hond, kip | different-category |
| `cw-014` | 1 | Waar is de poes? | poes | poes, muis | same-category |
| `cw-015` | 2 | Waar is de big? | big | big, beer, hond | same-category |
| `cw-016` | 2 | Waar is de muis? | muis | muis, kip, poes | same-category |
| `cw-017` | 2 | Waar is de beer? | beer | beer, leeuw, hond | same-category |
| `cw-018` | 2 | Waar is de kip? | kip | kip, poes, muis | same-category |
| `cw-019` | 3 | Waar is de zeehond? | zeehond | zeehond, hond, big, poes | same-category |

> De ronde-lengte (bv. 10 vragen) blijft geregeld door de bestaande randomisatie/groepering (`logic/instruction-groups.ts`, `instruction-randomization.ts`); we vergroten alleen de **pool** waaruit gekozen wordt.

---

## 7. Opdrachten – Zeg & Vlieg (verzamelwoorden)

Verzamelbare objecten (goed uitspreekbaar, herkenbaar): **leeuw, olifant, aap, hond, poes, kip, big, muis, beer, zeehond, clown, bal, ballon, hoepel**.
Obstakels (te ontwijken): circus-varianten van wolk/meeuw/haai/zeeleeuw → bv. **confettiwolk, duif, tijger, jongleerkegel** (of neutraal). Aliassen: zie §3.1.

---

## 8. Benodigde afbeeldingen (door jou aangeleverd)

Alle assets komen in `src/app/games/groot-circus-avontuur/assets/**`. Houd exact dezelfde afmetingen/verhoudingen en transparantie als de strandassets aan zodat de layout niet breekt. Tot ze er zijn, draait de game op de strand-placeholders.

### 8.1 Object-stickers (transparant PNG) — `assets/objects/transparent/`
| Nieuw bestand | Object |
| :-- | :-- |
| `clown-sticker.png` | clown |
| `acrobat-sticker.png` | acrobaat |
| `lion-sticker.png` | leeuw |
| `elephant-sticker.png` | olifant |
| `monkey-sticker.png` | aap |
| `chicken-sticker.png` | kip |
| `cat-sticker.png` | poes |
| `piglet-sticker.png` | big |
| `mouse-sticker.png` | muis |
| `bear-sticker.png` | beer |
| `seal-sticker.png` | zeehond |
| `dog-sticker.png` | hond |
| `unicycle-sticker.png` | eenwieler |
| `cannon-sticker.png` | kanon |
| `ball-sticker.png` | bal |
| `hoop-sticker.png` | hoepel |
| `balloon-sticker.png` | ballon |
| `drum-sticker.png` | trommel |
| `flag-sticker.png` | vlag |

### 8.2 Achtergronden — `assets/backgrounds/` (PNG + WebP, portrait + landscape)
| Nieuw bestand | Inhoud |
| :-- | :-- |
| `circus-board-portrait.png/.webp` | Tent-interieur, 3 banden + tribune rechts (portret) |
| `circus-board-landscape.png/.webp` | Idem (landschap) |
| `circus-voice-side-scroller.png/.webp` | Zij-scroll circusachtergrond |

### 8.3 Logo, wereld-icoon & obstakels
| Nieuw bestand | Inhoud |
| :-- | :-- |
| `assets/logos/start-logo-circus.png` | Titellogo "Groot Circus-Avontuur" |
| `assets/icons/worlds/world-circus.png` | Wereldkaart-icoon circus |
| `assets/objects/side-scroller/*-obstacle.png` | 4 circus-obstakels |
| `manifest.icon` | 🎪 |

### 8.4 Herbruikbaar (kan 1-op-1 gekopieerd blijven, thema-neutraal)
- `assets/icons/avatars/*` (8 avatars), `assets/icons/mascot/*` (7 mascotte-poses), `assets/icons/brooms/*` (skins).
- `assets/audio/background-music.mp3` (optioneel vervangen door circusmuziek).

> De "bezem"-skins en mascotte zijn thema-neutraal genoeg om te hergebruiken; optioneel later hertekenen naar circus. Dit is **geen** blocker voor v1.

---

## 9. Video-animaties – complete tekstlijst

Dit is jouw productielijst (zelfde structuur als het bestaande [`animation-texts.md`](../src/app/games/magisch-strand-avontuur/assets/instructions/animation-texts.md)). Elke regel = één korte clip (2–5s) met Nederlandse voice-over, papieren/sticker-stijl. Bestanden komen in `assets/instructions/`. De app koppelt een video pas als het MP4-bestand bestaat; ontbrekende clips vallen automatisch terug op de spraaksynthese-stem — je kunt dus incrementeel toevoegen.

### 9.1 Zeg & Zet — hoofdopdrachten (`opdracht`)
| ID | Tekst | Bestandsnaam |
| :-- | :-- | :-- |
| lp-001 | Zet de eenwieler in de piste. | `lp-001-opdracht-zet-de-eenwieler-in-de-piste.mp4` |
| lp-002 | Zet de leeuw in de piste. | `lp-002-opdracht-zet-de-leeuw-in-de-piste.mp4` |
| lp-003 | Leg de bal op de vloer. | `lp-003-opdracht-leg-de-bal-op-de-vloer.mp4` |
| lp-004 | Zet de vlag op de tribune. | `lp-004-opdracht-zet-de-vlag-op-de-tribune.mp4` |
| lp-005 | Zet de ballon boven in de nok. | `lp-005-opdracht-zet-de-ballon-boven-in-de-nok.mp4` |
| lp-006 | Zet het kanon boven de piste. | `lp-006-opdracht-zet-het-kanon-boven-de-piste.mp4` |
| lp-007 | Zet de hoepel op de vloer. | `lp-007-opdracht-zet-de-hoepel-op-de-vloer.mp4` |
| lp-008 | Zet de aap op de trommel. | `lp-008-opdracht-zet-de-aap-op-de-trommel.mp4` |
| lp-009 | Zet de clown naast de hoepel. | `lp-009-opdracht-zet-de-clown-naast-de-hoepel.mp4` |
| lp-010 | Zet de olifant rechts op de vloer. | `lp-010-opdracht-zet-de-olifant-rechts-op-de-vloer.mp4` |
| lp-011 | Zet de acrobaat boven de piste. | `lp-011-opdracht-zet-de-acrobaat-boven-de-piste.mp4` |
| lp-012 | Leg de trommel midden op de vloer. | `lp-012-opdracht-leg-de-trommel-midden-op-de-vloer.mp4` |
| lp-013 | Zet de eenwieler links in de piste. | `lp-013-opdracht-zet-de-eenwieler-links-in-de-piste.mp4` |
| lp-014 | Zet het kanon ver weg boven de piste. | `lp-014-opdracht-zet-het-kanon-ver-weg-boven-de-piste.mp4` |
| lp-015 | Leg de bal dichtbij de hoepel. | `lp-015-opdracht-leg-de-bal-dichtbij-de-hoepel.mp4` |
| lp-016 | Leg de hoepel tussen de bal en de ballon. | `lp-016-opdracht-leg-de-hoepel-tussen-de-bal-en-de-ballon.mp4` |
| lp-017 | Zet de hond op de vloer. | `lp-017-opdracht-zet-de-hond-op-de-vloer.mp4` |
| lp-018 | Zet de zeehond in de piste. | `lp-018-opdracht-zet-de-zeehond-in-de-piste.mp4` |
| lp-019 | Zet de poes op de trommel. | `lp-019-opdracht-zet-de-poes-op-de-trommel.mp4` |
| lp-020 | Zet de muis naast de bal. | `lp-020-opdracht-zet-de-muis-naast-de-bal.mp4` |
| lp-021 | Zet de big rechts op de vloer. | `lp-021-opdracht-zet-de-big-rechts-op-de-vloer.mp4` |
| lp-022 | Zet de kip tussen de hoepel en de bal. | `lp-022-opdracht-zet-de-kip-tussen-de-hoepel-en-de-bal.mp4` |
| lp-023 | Zet de beer dichtbij de trommel. | `lp-023-opdracht-zet-de-beer-dichtbij-de-trommel.mp4` |

### 9.2 Zeg & Zet — hint 1: zoek het object (`hint-01`)
| ID | Tekst | Bestandsnaam |
| :-- | :-- | :-- |
| lp-001 | Zoek de eenwieler. | `lp-001-hint-01-zoek-de-eenwieler.mp4` |
| lp-002 | Zoek de leeuw. | `lp-002-hint-01-zoek-de-leeuw.mp4` |
| lp-003 | Zoek de bal. | `lp-003-hint-01-zoek-de-bal.mp4` |
| lp-004 | Zoek de vlag. | `lp-004-hint-01-zoek-de-vlag.mp4` |
| lp-005 | Zoek de ballon. | `lp-005-hint-01-zoek-de-ballon.mp4` |
| lp-006 | Zoek het kanon. | `lp-006-hint-01-zoek-het-kanon.mp4` |
| lp-007 | Zoek de hoepel. | `lp-007-hint-01-zoek-de-hoepel.mp4` |
| lp-008 | Zoek de aap. | `lp-008-hint-01-zoek-de-aap.mp4` |
| lp-009 | Zoek de clown. | `lp-009-hint-01-zoek-de-clown.mp4` |
| lp-010 | Zoek de olifant. | `lp-010-hint-01-zoek-de-olifant.mp4` |
| lp-011 | Zoek de acrobaat. | `lp-011-hint-01-zoek-de-acrobaat.mp4` |
| lp-012 | Zoek de trommel. | `lp-012-hint-01-zoek-de-trommel.mp4` |
| lp-013 | Zoek de eenwieler. | `lp-013-hint-01-zoek-de-eenwieler.mp4` |
| lp-017 | Zoek de hond. | `lp-017-hint-01-zoek-de-hond.mp4` |
| lp-018 | Zoek de zeehond. | `lp-018-hint-01-zoek-de-zeehond.mp4` |
| lp-019 | Zoek de poes. | `lp-019-hint-01-zoek-de-poes.mp4` |
| lp-020 | Zoek de muis. | `lp-020-hint-01-zoek-de-muis.mp4` |
| lp-021 | Zoek de big. | `lp-021-hint-01-zoek-de-big.mp4` |
| lp-022 | Zoek de kip. | `lp-022-hint-01-zoek-de-kip.mp4` |
| lp-023 | Zoek de beer. | `lp-023-hint-01-zoek-de-beer.mp4` |

### 9.3 Zeg & Zet — hint 2: kijk naar het oplichtende plaatje (`hint-02`)
| ID | Tekst | Bestandsnaam |
| :-- | :-- | :-- |
| lp-001 | Kijk naar het plaatje dat oplicht: eenwieler. | `lp-001-hint-02-kijk-naar-eenwieler.mp4` |
| lp-002 | Kijk naar het plaatje dat oplicht: leeuw. | `lp-002-hint-02-kijk-naar-leeuw.mp4` |
| lp-003 | Kijk naar het plaatje dat oplicht: bal. | `lp-003-hint-02-kijk-naar-bal.mp4` |
| lp-004 | Kijk naar het plaatje dat oplicht: vlag. | `lp-004-hint-02-kijk-naar-vlag.mp4` |
| lp-005 | Kijk naar het plaatje dat oplicht: ballon. | `lp-005-hint-02-kijk-naar-ballon.mp4` |
| lp-006 | Kijk naar het plaatje dat oplicht: kanon. | `lp-006-hint-02-kijk-naar-kanon.mp4` |
| lp-007 | Kijk naar het plaatje dat oplicht: hoepel. | `lp-007-hint-02-kijk-naar-hoepel.mp4` |
| lp-008 | Kijk naar het plaatje dat oplicht: aap. | `lp-008-hint-02-kijk-naar-aap.mp4` |
| lp-009 | Kijk naar het plaatje dat oplicht: clown. | `lp-009-hint-02-kijk-naar-clown.mp4` |
| lp-010 | Kijk naar het plaatje dat oplicht: olifant. | `lp-010-hint-02-kijk-naar-olifant.mp4` |
| lp-011 | Kijk naar het plaatje dat oplicht: acrobaat. | `lp-011-hint-02-kijk-naar-acrobaat.mp4` |
| lp-012 | Kijk naar het plaatje dat oplicht: trommel. | `lp-012-hint-02-kijk-naar-trommel.mp4` |
| lp-013 | Kijk naar het plaatje dat oplicht: eenwieler. | `lp-013-hint-02-kijk-naar-eenwieler.mp4` |
| lp-017 | Kijk naar het plaatje dat oplicht: hond. | `lp-017-hint-02-kijk-naar-hond.mp4` |
| lp-018 | Kijk naar het plaatje dat oplicht: zeehond. | `lp-018-hint-02-kijk-naar-zeehond.mp4` |
| lp-019 | Kijk naar het plaatje dat oplicht: poes. | `lp-019-hint-02-kijk-naar-poes.mp4` |
| lp-020 | Kijk naar het plaatje dat oplicht: muis. | `lp-020-hint-02-kijk-naar-muis.mp4` |
| lp-021 | Kijk naar het plaatje dat oplicht: big. | `lp-021-hint-02-kijk-naar-big.mp4` |
| lp-022 | Kijk naar het plaatje dat oplicht: kip. | `lp-022-hint-02-kijk-naar-kip.mp4` |
| lp-023 | Kijk naar het plaatje dat oplicht: beer. | `lp-023-hint-02-kijk-naar-beer.mp4` |

### 9.4 Herbruikbare clips — plek-hint & begripsuitleg
| Type | Tekst | Bestandsnaam |
| :-- | :-- | :-- |
| plek-hint | Kijk naar de plek die oplicht. | `shared-hint-kijk-naar-de-plek-die-oplicht.mp4` |
| begrip in | In betekent binnenin, zoals in de piste. | `concept-in.mp4` |
| begrip op | Op betekent erop, aan de bovenkant. | `concept-op.mp4` |
| begrip onder | Onder betekent lager dan iets anders. | `concept-onder.mp4` |
| begrip boven | Boven betekent hoog, aan de bovenkant. | `concept-boven.mp4` |
| begrip naast | Naast betekent dichtbij aan de zijkant. | `concept-naast.mp4` |
| begrip tussen | Tussen betekent in het midden van twee dingen. | `concept-tussen.mp4` |
| begrip links | Links is de kant van je linkerhand. | `concept-links.mp4` |
| begrip rechts | Rechts is de kant van je rechterhand. | `concept-rechts.mp4` |
| begrip midden | Midden is tussen links en rechts. | `concept-midden.mp4` |
| begrip dichtbij | Dichtbij betekent niet ver weg. | `concept-dichtbij.mp4` |
| begrip ver weg | Ver weg betekent verder naar achteren in de scene. | `concept-ver-weg.mp4` |

### 9.5 Zeg & Zet — positieve feedback (optioneel)
| ID | Tekst | Bestandsnaam |
| :-- | :-- | :-- |
| lp-001 | Goed zo! De eenwieler staat in de piste. +1 Tempo! | `lp-001-feedback-eenwieler-in-de-piste.mp4` |
| lp-002 | Mooi! De leeuw staat in de piste. +1 Tempo! | `lp-002-feedback-leeuw-in-de-piste.mp4` |
| lp-003 | Ja! De bal ligt op de vloer. +1 Tempo! | `lp-003-feedback-bal-op-de-vloer.mp4` |
| lp-004 | Goed gedaan! De vlag staat op de tribune. +1 Tempo! | `lp-004-feedback-vlag-op-de-tribune.mp4` |
| lp-005 | Goed zo! De ballon zweeft boven in de nok. +1 Tempo! | `lp-005-feedback-ballon-in-de-nok.mp4` |
| lp-006 | Knap! Het kanon staat boven de piste. +1 Tempo! | `lp-006-feedback-kanon-boven-de-piste.mp4` |
| lp-007 | Ja! De hoepel ligt op de vloer. +1 Tempo! | `lp-007-feedback-hoepel-op-de-vloer.mp4` |
| lp-008 | Goed! De aap zit op de trommel. +1 Tempo! | `lp-008-feedback-aap-op-de-trommel.mp4` |
| lp-009 | Mooi! De clown staat naast de hoepel. +1 Tempo! | `lp-009-feedback-clown-naast-de-hoepel.mp4` |
| lp-010 | Ja! De olifant staat rechts op de vloer. +1 Tempo! | `lp-010-feedback-olifant-rechts-op-de-vloer.mp4` |
| lp-011 | Knap! De acrobaat vliegt boven de piste. +1 Tempo! | `lp-011-feedback-acrobaat-boven-de-piste.mp4` |
| lp-012 | Knap! De trommel staat midden op de vloer. +1 Tempo! | `lp-012-feedback-trommel-midden-op-de-vloer.mp4` |
| lp-013 | Goed! De eenwieler rijdt links in de piste. +1 Tempo! | `lp-013-feedback-eenwieler-links-in-de-piste.mp4` |
| lp-014 | Mooi! Het kanon staat ver weg boven de piste. +1 Tempo! | `lp-014-feedback-kanon-ver-weg-boven-de-piste.mp4` |
| lp-015 | Ja! De bal ligt dichtbij de hoepel. +1 Tempo! | `lp-015-feedback-bal-dichtbij-de-hoepel.mp4` |
| lp-016 | Knap! De hoepel ligt tussen de bal en de ballon. +1 Tempo! | `lp-016-feedback-hoepel-tussen-bal-en-ballon.mp4` |
| lp-017 | Goed zo! De hond staat op de vloer. +1 Tempo! | `lp-017-feedback-hond-op-de-vloer.mp4` |
| lp-018 | Mooi! De zeehond zit in de piste. +1 Tempo! | `lp-018-feedback-zeehond-in-de-piste.mp4` |
| lp-019 | Goed! De poes zit op de trommel. +1 Tempo! | `lp-019-feedback-poes-op-de-trommel.mp4` |
| lp-020 | Mooi! De muis zit naast de bal. +1 Tempo! | `lp-020-feedback-muis-naast-de-bal.mp4` |
| lp-021 | Ja! De big staat rechts op de vloer. +1 Tempo! | `lp-021-feedback-big-rechts-op-de-vloer.mp4` |
| lp-022 | Knap! De kip staat tussen de hoepel en de bal. +1 Tempo! | `lp-022-feedback-kip-tussen-hoepel-en-bal.mp4` |
| lp-023 | Ja! De beer staat dichtbij de trommel. +1 Tempo! | `lp-023-feedback-beer-dichtbij-de-trommel.mp4` |

### 9.6 Kies het Woord — opdrachtclips
| ID | Niv | Tekst | Bestandsnaam |
| :-- | :-: | :-- | :-- |
| cw-001 | 1 | Waar is de leeuw? | `cw-001-opdracht-waar-is-de-leeuw.mp4` |
| cw-002 | 1 | Waar is de eenwieler? | `cw-002-opdracht-waar-is-de-eenwieler.mp4` |
| cw-003 | 1 | Waar is de bal? | `cw-003-opdracht-waar-is-de-bal.mp4` |
| cw-004 | 2 | Waar is de olifant? | `cw-004-opdracht-waar-is-de-olifant.mp4` |
| cw-005 | 2 | Waar is de ballon? | `cw-005-opdracht-waar-is-de-ballon.mp4` |
| cw-006 | 2 | Waar is de clown? | `cw-006-opdracht-waar-is-de-clown.mp4` |
| cw-007 | 2 | Waar is de aap? | `cw-007-opdracht-waar-is-de-aap.mp4` |
| cw-008 | 2 | Waar is de trommel? | `cw-008-opdracht-waar-is-de-trommel.mp4` |
| cw-009 | 3 | Waar is de hoepel? | `cw-009-opdracht-waar-is-de-hoepel.mp4` |
| cw-010 | 3 | Waar is de vlag? | `cw-010-opdracht-waar-is-de-vlag.mp4` |
| cw-011 | 3 | Waar is het kanon? | `cw-011-opdracht-waar-is-het-kanon.mp4` |
| cw-012 | 3 | Waar is de acrobaat? | `cw-012-opdracht-waar-is-de-acrobaat.mp4` |
| cw-013 | 1 | Waar is de hond? | `cw-013-opdracht-waar-is-de-hond.mp4` |
| cw-014 | 1 | Waar is de poes? | `cw-014-opdracht-waar-is-de-poes.mp4` |
| cw-015 | 2 | Waar is de big? | `cw-015-opdracht-waar-is-de-big.mp4` |
| cw-016 | 2 | Waar is de muis? | `cw-016-opdracht-waar-is-de-muis.mp4` |
| cw-017 | 2 | Waar is de beer? | `cw-017-opdracht-waar-is-de-beer.mp4` |
| cw-018 | 2 | Waar is de kip? | `cw-018-opdracht-waar-is-de-kip.mp4` |
| cw-019 | 3 | Waar is de zeehond? | `cw-019-opdracht-waar-is-de-zeehond.mp4` |

### 9.7 Kies het Woord — hint & feedback (voor voice-over / toekomstige clips)
| ID | Hinttekst | Feedbacktekst |
| :-- | :-- | :-- |
| cw-001 | De leeuw is het dier dat brult. | Ja, dat is de leeuw. +1 Tempo! |
| cw-002 | Op een eenwieler rijd je met één wiel. | Ja, dat is de eenwieler. +1 Tempo! |
| cw-003 | Met een bal kun je gooien of rollen. | Ja, dat is de bal. +1 Tempo! |
| cw-004 | De olifant is groot en heeft een slurf. | Ja, dat is de olifant. +1 Tempo! |
| cw-005 | Een ballon zweeft omhoog in de lucht. | Ja, dat is de ballon. +1 Tempo! |
| cw-006 | De clown maakt grappen en lacht. | Ja, dat is de clown. +1 Tempo! |
| cw-007 | De aap klimt en springt graag. | Ja, dat is de aap. +1 Tempo! |
| cw-008 | Op een trommel maak je muziek. | Ja, dat is de trommel. +1 Tempo! |
| cw-009 | Door een hoepel kun je springen. | Ja, dat is de hoepel. +1 Tempo! |
| cw-010 | Een vlag wappert bovenop de tent. | Ja, dat is de vlag. +1 Tempo! |
| cw-011 | Uit een kanon schiet de acrobaat omhoog. | Ja, dat is het kanon. +1 Tempo! |
| cw-012 | De acrobaat maakt mooie sprongen in de lucht. | Ja, dat is de acrobaat. +1 Tempo! |
| cw-013 | De hond blaft en kwispelt met zijn staart. | Ja, dat is de hond. +1 Tempo! |
| cw-014 | De poes miauwt en heeft zachte pootjes. | Ja, dat is de poes. +1 Tempo! |
| cw-015 | De big is een klein roze varken. | Ja, dat is de big. +1 Tempo! |
| cw-016 | De muis is heel klein en piept. | Ja, dat is de muis. +1 Tempo! |
| cw-017 | De beer is groot en heeft dikke vacht. | Ja, dat is de beer. +1 Tempo! |
| cw-018 | De kip legt eieren en tokt. | Ja, dat is de kip. +1 Tempo! |
| cw-019 | De zeehond klapt en balanceert een bal. | Ja, dat is de zeehond. +1 Tempo! |

### 9.8 Zeg & Vlieg — instructie/feedback
| ID | Type | Tekst | Bestandsnaam |
| :-- | :-- | :-- | :-- |
| zv-001 | start | Zeg het woord en vlieg naar de woordster. | `zv-001-start-zeg-het-woord-en-vlieg.mp4` |
| zv-002 | opdracht | Zeg: leeuw. | `zv-002-opdracht-zeg-leeuw.mp4` |
| zv-003 | opdracht | Zeg: olifant. | `zv-003-opdracht-zeg-olifant.mp4` |
| zv-004 | opdracht | Zeg: aap. | `zv-004-opdracht-zeg-aap.mp4` |
| zv-005 | opdracht | Zeg: hond. | `zv-005-opdracht-zeg-hond.mp4` |
| zv-006 | opdracht | Zeg: poes. | `zv-006-opdracht-zeg-poes.mp4` |
| zv-007 | opdracht | Zeg: kip. | `zv-007-opdracht-zeg-kip.mp4` |
| zv-008 | opdracht | Zeg: beer. | `zv-008-opdracht-zeg-beer.mp4` |
| zv-009 | opdracht | Zeg: bal. | `zv-009-opdracht-zeg-bal.mp4` |
| zv-010 | opdracht | Zeg: ballon. | `zv-010-opdracht-zeg-ballon.mp4` |
| zv-011 | hint | Probeer het woord rustig nog een keer. | `zv-011-hint-probeer-rustig-nog-een-keer.mp4` |
| zv-012 | obstakel | Vlieg om het obstakel heen. | `zv-012-hint-vlieg-om-het-obstakel-heen.mp4` |
| zv-013 | feedback | Goed gehoord. Je krijgt plus één tempo. | `zv-013-feedback-goed-gehoord-plus-tempo.mp4` |
| zv-014 | eindronde | Goed gedaan. Je hebt circuswoorden gezegd. | `zv-014-eindronde-circuswoorden-gezegd.mp4` |

---

## 10. Implementatieplan – wat kopiëren, wat opnieuw

### 10.1 Aanpak: map dupliceren
Nieuwe map: `src/app/games/groot-circus-avontuur/` als **complete kopie** van `magisch-strand-avontuur/`. Daarna gericht aanpassen.

### 10.2 EXACT kopiëren (geen inhoudelijke wijziging, alleen evt. hernoemen van de shell-component)
| Map/bestand | Actie |
| :-- | :-- |
| `components/ui/**` (alle knoppen, displays, infoboxes, toggles, titels/badges) | 1-op-1 kopie ✅ |
| `components/audio/**`, `components/layout/GameStage.tsx`, `TopHud.tsx` | 1-op-1 kopie ✅ |
| `screens/scene-builder/**` (logica, hooks, componenten) | 1-op-1 kopie ✅ |
| `screens/word-choice/**`, `screens/voice-side-scroller/**` (engine, controller, frame, model) | 1-op-1 kopie ✅ |
| `screens/start/**`, `screens/adventure-select/**`, `screens/reward/**`, `screens/settings/**` | 1-op-1 kopie ✅ |
| `logic/**` behalve aliassen-data | 1-op-1 kopie ✅ (geometrie, scene-executor, rewards, progress, settings, speech) |
| `hooks/**`, `state/**`, `runtime/**` | 1-op-1 kopie ✅ |
| `docs/**` (game-interne docs) | kopie + thema-tekst bijwerken |

### 10.3 OPNIEUW maken / aanpassen (thema-laag)
| Bestand | Wijziging |
| :-- | :-- |
| `manifest.ts` | id=`groot-circus-avontuur`, title=`Groot Circus-Avontuur`, icon=`🎪`, description circus, `contentVersion`, offlinePackage-id |
| `content.ts` | Volledig: 19 circusobjecten, 9 circuszones (geometrie hergebruikt), 23 scene-opdrachten (§5), 19 keuze-opdrachten (§6), rewards; `kanon` feedback met "het" |
| `types.ts` | `SceneObjectCategory` → `dieren\|artiesten\|voertuigen\|circusspullen\|decor`; `GameWorld.theme` → `"circus"`; `gameId`-literal type → `groot-circus-avontuur` |
| `worlds.ts` | Wereld `circus` i.p.v. `strand` (label, icon, description, linkedGameWorldId) |
| `asset-urls.ts` | Alle URL-verwijzingen naar circus-bestandsnamen (§8) |
| `logic/spoken-command-parser.ts` | `customObjectAliases` + `customZoneAliases` → circus (§3.1, §4.2) |
| `screens/voice-side-scroller/voiceSideScrollerWords.ts` | Circus-vliegwoorden + aliassen (§7) |
| `assets/**` | Alle nieuwe afbeeldingen/video's (§8, §9) — door jou aangeleverd |
| `assets/offline-package.source.json` | id/gameId/worldId/contentVersion/entry/chunkName/assetSourcePrefix → circus |
| `index.tsx` | Alleen imports/namen (`beachWorld`→`circusWorld`, `BeachBackground`→`CircusBackground`) |
| Componentnamen | `MagischStrandAvontuurShell`→`GrootCircusAvontuurShell`, `BeachBackground`→`CircusBackground` (interne rename, gedrag identiek) |

### 10.4 Platform-integratie (buiten de game-map)
| Bestand | Wijziging |
| :-- | :-- |
| `src/app/games/registry.ts` | Circus-manifest importeren + registry-entry + `load: () => import("./groot-circus-avontuur")` |
| `scripts/generate-asset-manifest.mjs` | `generateAssetManifests()` uitbreiden met circus offline-package path |
| `knip.json` | `ignore`-patronen dupliceren voor de circusmap (zelfde bewust-ongebruikte bestanden) |
| `dependency-cruiser` / tests | Controleren dat nieuwe map de architectuurregels volgt |

### 10.5 Tests
- Unit-tests uit de strandmap mee-kopiëren en teksten aanpassen (o.a. `WordChoiceScreen.test.tsx`, `RibbonTitle.test.tsx`, `spoken-command-parser.test.ts`, `instruction-randomization.test.ts`, `rewards-and-progress.test.ts`, `voiceSideScrollerWords.test.ts`, `scene-geometry-utils.test.ts`, `keyboard-scene-placement.test.ts`).
- E2E: eventueel een circus-variant van de bestaande Playwright-specs.

---

## 11. Volgorde van uitvoeren (voorstel)

1. **Beslissingen bevestigen** (§12).
2. Map dupliceren + hernoemen + registreren; game start met **strand-placeholder-assets** zodat hij meteen draait.
3. `content.ts`, `worlds.ts`, `types.ts`, aliassen en manifest omzetten naar circus (19 objecten).
4. Tests bijwerken → `npm run check` groen krijgen.
5. Jouw nieuwe **afbeeldingen** plaatsen (§8), asset-urls koppelen.
6. Offline-pakket + asset-manifest genereren en verifiëren.
7. **Video-animaties** door jou aanleveren (§9) en incrementeel koppelen.
8. Handmatige speeltest + e2e/a11y.

---

## 12. Open beslissingen (jouw input nodig vóór stap 2)

1. **Scène-namen** — nok / piste / vloer / tribune akkoord? (bepaalt de opdrachtteksten en zone-labels)
2. **Zeg & Vlieg-obstakels** — thematisch circus (confettiwolk/duif/tijger/jongleerkegel) of neutraal houden?
3. **Mascotte & skins** — bezem-skins + mascotte hergebruiken voor v1 (later hertekenen), of meteen circus-varianten?
4. **Achtergrondmuziek** — strandmuziek hergebruiken of lever je circusmuziek aan?
5. **Aantal opdrachten per ronde** — laten zoals de strandgame (randomisatie kiest subset uit de pool), akkoord?

Zodra deze punten bevestigd zijn, start ik met stap 2 (map dupliceren + draaiende game met strand-placeholders).
