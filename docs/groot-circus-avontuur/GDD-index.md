# 🎪 GDD — Groot Circus-Avontuur

> **Algemeen game design document.** Groot Circus-Avontuur is de tweede woordenschatgame: **dezelfde gameplay als [Magisch Strand-Avontuur](../magisch-strand-avontuur/GDD-index.md), andere wereld**. Alleen de woorden, de plekken en de plaatjes verschillen.

| Veld                  | Waarde                                                                                             |
| :-------------------- | :------------------------------------------------------------------------------------------------- |
| **Documentversie**    | `1.0`                                                                                              |
| **Laatst bijgewerkt** | 2026-09-22                                                                                         |
| **Status**            | 🔵 In aanbouw — content staat, gameplay moet gelijkgetrokken worden                                |
| **Bouwplan**          | [Takenlijst](Takenlijst.md) — alles wat er nog moet gebeuren                                       |
| **Bron van waarheid** | De code onder [`src/app/games/groot-circus-avontuur/`](../../src/app/games/groot-circus-avontuur/) |

## Het dossier

| Document                                  | Wat je er vindt                                                          |
| :---------------------------------------- | :----------------------------------------------------------------------- |
| [**Takenlijst**](Takenlijst.md)           | Volledig bouwplan: code, content, video's, afbeeldingen, geluiden, tests |
| [Voor begeleiders](Voor-begeleiders.md)   | Niet-technische introductie voor logopedisten, ouders en leerkrachten    |
| [Woordenlijst](Woordenlijst.md)           | Exact elk woord, plaatsbegrip en opdracht in de game                     |
| **GDD (dit document)**                    | Concept, schermen, gedeelde systemen                                     |
| [Kies het Woord](Modus-Kies-het-Woord.md) | Mechanica per modus                                                      |
| [Zeg & Zet](Modus-Zeg-en-Zet.md)          | Mechanica per modus                                                      |
| [Zeg & Bouw](Modus-Zeg-en-Bouw.md)        | Mechanica per modus                                                      |
| [Zeg & Vlieg](Modus-Zeg-en-Vlieg.md)      | Mechanica per modus                                                      |
| [Feature-catalogus](Feature-catalogus.md) | Elke functie met testhaak en status                                      |
| [User Journey Map](User-Journey-Map.md)   | De reizen die een kind door de game maakt                                |
| [Test-matrix](Test-matrix.md)             | Welke test bewijst welke functie                                         |

---

## 1. Uitgangspunt: één spel, twee werelden

Magisch Strand-Avontuur is uitgespeeld, getest en werkt. Groot Circus-Avontuur voegt **geen nieuwe spelmechaniek** toe: elk scherm, elke knop, elke hulpladder en elke beloning werkt precies hetzelfde. Dat is een bewuste keuze:

- een kind dat het strandspel kent, kan meteen spelen;
- alles wat aan het strandspel verbeterd is (automatisch bevestigen, automatisch doorgaan, overtyp-hulp, mobiel-vaste spraak) geldt ook hier;
- er hoeft niets opnieuw bedacht of getest te worden — alleen gevuld.

**Wat verschilt:** de wereld (circustent in plaats van strand), de woorden (19 in plaats van 12), de plekken (piste, nok, tribune in plaats van zee, lucht, strand) en alle plaatjes, video's en geluiden.

**Wat identiek is:** de vier spelmodi, de leerlijn en ontgrendeling, de hulpladder, het beloningssysteem, de spraakherkenning, de opslag en privacy, de toegankelijkheidsregels en de download-gate.

> Voor de werking van een onderdeel geldt de [strand-GDD](../magisch-strand-avontuur/GDD-index.md) als bron; dit document beschrijft alleen wat circus-eigen is.

## 2. De wereld

Een circustent van binnen: een ronde **piste** in het midden, de **nok** hoog onder het tentdak, de **tribune** met publiek aan de rechterkant, en de **vloer** op de voorgrond waar het kind spullen neerzet.

| Plek            | Wat het kind ziet                  |
| :-------------- | :--------------------------------- |
| `nok`           | bovenin de tent, onder het tentdak |
| `piste`         | de ronde piste midden in de tent   |
| `links-piste`   | linkerkant van de piste            |
| `boven-piste`   | de lucht boven de piste            |
| `ver-weg-piste` | ver weg boven de piste             |
| `tribune`       | de tribune met publiek, rechts     |
| `vloer`         | de vloer op de voorgrond           |
| `midden-vloer`  | midden op de vloer                 |
| `rechts-vloer`  | rechterkant van de vloer           |

Daarnaast ontstaan plekken **rondom voorwerpen** zodra die er staan: op de trommel, naast de hoepel, dichtbij de kegel, tussen de kegel en de ballon.

## 3. De inhoud in het kort

| Onderdeel             |    Aantal     | Toelichting                                         |
| :-------------------- | :-----------: | :-------------------------------------------------- |
| Doelwoorden           |      19       | artiesten, dieren, voertuigen, circusspullen, decor |
| Plaatsbegrippen       |      11       | identiek aan het strandspel                         |
| Zones                 | 9 + dynamisch | circus-eigen                                        |
| Zeg & Zet-opdrachten  |      23       | `lp-001` … `lp-023`                                 |
| Kies het Woord-vragen |      19       | `cw-001` … `cw-019`                                 |
| Zeg & Bouw-kaarten    |       5       | nog te maken, zie [Takenlijst](Takenlijst.md)       |
| Zeg & Vlieg-woorden   |      13       | de best uitspreekbare dieren en spullen             |

De volledige lijst — elk woord met lidwoord en meervoud, elke opdracht letterlijk — staat in de [woordenlijst](Woordenlijst.md).

**Circus is rijker aan dieren dan het strand:** leeuw, olifant, aap, kip, poes, big, muis, beer, zeehond en hond. Dat maakt de afleiders in Kies het Woord op niveau 2 en 3 lastiger (poes tegenover muis, beer tegenover hond) en dus taalkundig waardevoller.

## 4. Schermen

Identiek aan het strandspel, met circus-namen:

| Scherm-ID                | Component                 | Modus                                     |
| :----------------------- | :------------------------ | :---------------------------------------- |
| `SCR_GCA_START`          | `StartScreen`             | —                                         |
| `SCR_GCA_MODE_SELECT`    | `AdventureSelectScreen`   | — (wereld + modus)                        |
| `SCR_GCA_WORD_CHOICE`    | `WordChoiceScreen`        | [Kies het Woord](Modus-Kies-het-Woord.md) |
| `SCR_GCA_SCENE_BUILDER`  | `SceneBuilderScreen`      | [Zeg & Zet](Modus-Zeg-en-Zet.md)          |
| `SCR_GCA_ZEG_BOUW`       | `ZegBouwScreen`           | [Zeg & Bouw](Modus-Zeg-en-Bouw.md) 🔵     |
| `SCR_GCA_VOICE_SCROLLER` | `VoiceSideScrollerScreen` | [Zeg & Vlieg](Modus-Zeg-en-Vlieg.md)      |
| `SCR_GCA_REWARD`         | `RewardScreen`            | —                                         |
| `SCR_GCA_SETTINGS`       | `GameSettingsScreen`      | —                                         |

Plus dezelfde overlays: typ-paneel, spraakgolf, privacynotice, succes-toast, ronde-eindschermen, resetbevestiging en de portret-guard op telefoons.

## 5. Leerlijn en ontgrendeling

Identiek aan het strandspel:

```
Kies het Woord (0 ⭐) → Zeg & Zet (3 ⭐) → Zeg & Bouw (8 ⭐) → Zeg & Vlieg (14 ⭐)
```

Sterren zijn **per profiel en per game**: een kind dat het strandspel heeft uitgespeeld begint in het circus gewoon opnieuw bij nul, zodat de leerlijn ook hier van voren af aan wordt doorlopen.

## 6. Beloningen

Dezelfde curve (3 · 8 · 16 · 28 · 42 · 60 · 85 ⭐), maar met **circus-items** in plaats van strand-items — zie de [Takenlijst](Takenlijst.md) voor de exacte lijst en de benodigde plaatjes.

## 7. Wat overal gelijk blijft

Spraakherkenning (inclusief de drie mobiel-vaste regels), de vier invoermethoden, de hulpladder, foutloos leren, het observatiemodel, opslag en privacy, de download-gate, portret op telefoon, de toegankelijkheidsregels en de prestatiebudgetten: allemaal ongewijzigd overgenomen. De platformbrede afspraken staan in [architectuur](../architectuur/README.md), [interactiecontract](../toegankelijkheid/interactiecontract.md) en de [runbooks](../runbooks/release.md).

## 8. Stand van zaken

De game staat in de catalogus als **"Binnenkort beschikbaar"** (vergrendelde kaart, deep link toont het binnenkort-scherm). De code is een aftakking van het strandspel van vóór een reeks verbeteringen; de content (19 woorden, 9 zones, 42 opdrachten) staat er al, de stickers ook. Wat er nog moet gebeuren — en in welke volgorde — staat volledig uitgewerkt in de [Takenlijst](Takenlijst.md).
