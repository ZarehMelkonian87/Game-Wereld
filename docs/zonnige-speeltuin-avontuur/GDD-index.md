# 🛝 GDD — Zonnige Speeltuin-Avontuur

> **Algemeen game design document.** Zonnige Speeltuin-Avontuur is een woordenschatgame met **exact dezelfde gameplay als [Magisch Strand-Avontuur](../magisch-strand-avontuur/GDD-index.md)**; alleen de wereld, de woorden en de plaatjes verschillen.

| Veld                  | Waarde                                               |
| :-------------------- | :--------------------------------------------------- |
| **Documentversie**    | `1.0`                                                |
| **Laatst bijgewerkt** | 2026-09-22                                           |
| **Status**            | 🔵 Nog te bouwen — alleen de catalogus-kaart bestaat |
| **Bouwplan**          | [Takenlijst](Takenlijst.md)                          |
| **Game-id**           | `zonnige-speeltuin-avontuur`                         |

## Het dossier

| Document                                  | Wat je er vindt                                                          |
| :---------------------------------------- | :----------------------------------------------------------------------- |
| [**Takenlijst**](Takenlijst.md)           | Volledig bouwplan: code, content, video's, afbeeldingen, geluiden, tests |
| [Voor begeleiders](Voor-begeleiders.md)   | Niet-technische introductie voor logopedisten, ouders en leerkrachten    |
| [Woordenlijst](Woordenlijst.md)           | Exact elk woord, plaatsbegrip en opdracht                                |
| **GDD (dit document)**                    | Concept, wereld, schermen                                                |
| [Kies het Woord](Modus-Kies-het-Woord.md) | Mechanica per modus                                                      |
| [Zeg & Zet](Modus-Zeg-en-Zet.md)          | Mechanica per modus                                                      |
| [Zeg & Bouw](Modus-Zeg-en-Bouw.md)        | Mechanica per modus                                                      |
| [Zeg & Vlieg](Modus-Zeg-en-Vlieg.md)      | Mechanica per modus                                                      |
| [Feature-catalogus](Feature-catalogus.md) | Elke functie met testhaak en status                                      |
| [User Journey Map](User-Journey-Map.md)   | De reizen die een kind door de game maakt                                |
| [Test-matrix](Test-matrix.md)             | Welke test bewijst welke functie                                         |

---

## 1. Uitgangspunt: één spel, meerdere werelden

Er wordt **geen nieuwe spelmechaniek** bedacht. Elk scherm, elke knop, de hulpladder, het beloningssysteem, de spraakherkenning, de opslag en de toegankelijkheidsregels worden overgenomen uit het strandspel. Dat is een bewuste keuze: een kind dat één wereld kent kan meteen in de volgende spelen, en elke verbetering aan het strandspel landt hier vanzelf ook.

**Wat verschilt:** de wereld (een speeltuin met een glijbaan, een schommel, een zandbak en een grasveld.), de 14 woorden, de plekken en alle plaatjes, video's en geluiden.

> Voor de werking van een onderdeel geldt de [strand-GDD](../magisch-strand-avontuur/GDD-index.md) als bron; dit document beschrijft alleen wat speeltuin-eigen is.

## 2. De wereld

Een speeltuin met een glijbaan, een schommel, een zandbak en een grasveld. Het kind zet spullen en dieren neer op het grasveld met de glijbaan, de zandbak en het pad.

| Plek               | Wat het kind ziet                    |
| :----------------- | :----------------------------------- |
| `lucht`            | De lucht boven de speeltuin.         |
| `grasveld`         | Het grasveld in het midden.          |
| `links-grasveld`   | Linkerkant van het grasveld.         |
| `boven-grasveld`   | Luchtgebied boven het grasveld.      |
| `ver-weg-grasveld` | Een plek ver weg boven het grasveld. |
| `heuvel`           | Het heuveltje achteraan.             |
| `pad`              | Het pad op de voorgrond.             |
| `midden-pad`       | Midden van het pad.                  |
| `rechts-pad`       | Rechterkant van het pad.             |

Daarnaast ontstaan plekken **rondom voorwerpen** zodra die er staan (naast, tussen, dichtbij).

## 3. De inhoud in het kort

| Onderdeel             |    Aantal     | Toelichting                            |
| :-------------------- | :-----------: | :------------------------------------- |
| Doelwoorden           |      14       | zie de [woordenlijst](Woordenlijst.md) |
| Plaatsbegrippen       |      11       | identiek aan het strandspel            |
| Zones                 | 9 + dynamisch | speeltuin-eigen                        |
| Zeg & Zet-opdrachten  |      16       | `lp-001` … `lp-016`                    |
| Kies het Woord-vragen |      14       | `cw-001` … `cw-014`                    |
| Zeg & Bouw-kaarten    |       5       | thema's uit deze wereld                |
| Zeg & Vlieg-woorden   |       8       | de best uitspreekbare woorden          |

## 4. Schermen

Identiek aan het strandspel: startscherm, avontuur kiezen, de vier modusschermen, beloningen en instellingen, plus dezelfde overlays (typ-paneel, spraakgolf, privacynotice, ronde-eindschermen, portret-guard).

## 5. Leerlijn en ontgrendeling

```
Kies het Woord (0 ⭐) → Zeg & Zet (3 ⭐) → Zeg & Bouw (8 ⭐) → Zeg & Vlieg (14 ⭐)
```

Sterren zijn per profiel én per game: elke wereld wordt van voren af aan doorlopen.

## 6. Wat overal gelijk blijft

Spraakherkenning met de drie mobiel-vaste regels, de vier invoermethoden, de hulpladder, foutloos leren, het observatiemodel, opslag en privacy, de download-gate, portret op telefoon, de toegankelijkheidsregels en de prestatiebudgetten. Platformbrede afspraken: [architectuur](../architectuur/README.md), [interactiecontract](../toegankelijkheid/interactiecontract.md), [runbooks](../runbooks/release.md).

## 7. Stand van zaken

In de catalogus staat de kaart met het wereldicoon en **"Binnenkort beschikbaar"**; er is nog geen code en er zijn nog geen assets. Het volledige bouwplan staat in de [Takenlijst](Takenlijst.md).
