# Magisch Strand-Avontuur

Spraakgestuurde, educatieve game voor kinderen van 4–8 jaar: woordenschat, zinsbegrip en ruimtelijke taal, in vier spelmodi (Kies het Woord, Zeg & Zet, Zeg & Bouw, Zeg & Vlieg).

**De volledige documentatie staat in [`docs/magisch-strand-avontuur/`](../../../../docs/magisch-strand-avontuur/GDD-index.md):**

| Document                                                                           | Inhoud                                          |
| :--------------------------------------------------------------------------------- | :---------------------------------------------- |
| [GDD](../../../../docs/magisch-strand-avontuur/GDD-index.md)                       | Concept, doelgroep, schermen, gedeelde systemen |
| [Kies het Woord](../../../../docs/magisch-strand-avontuur/Modus-Kies-het-Woord.md) | Mechanica per modus                             |
| [Zeg & Zet](../../../../docs/magisch-strand-avontuur/Modus-Zeg-en-Zet.md)          | Mechanica per modus                             |
| [Zeg & Bouw](../../../../docs/magisch-strand-avontuur/Modus-Zeg-en-Bouw.md)        | Mechanica per modus                             |
| [Zeg & Vlieg](../../../../docs/magisch-strand-avontuur/Modus-Zeg-en-Vlieg.md)      | Mechanica per modus                             |
| [Feature-catalogus](../../../../docs/magisch-strand-avontuur/Feature-catalogus.md) | Elke functie met testhaak en status             |
| [User Journey Map](../../../../docs/magisch-strand-avontuur/User-Journey-Map.md)   | De reizen door de game                          |
| [Test-matrix](../../../../docs/magisch-strand-avontuur/Test-matrix.md)             | Welke test bewijst welke functie                |
| [Versie 2-backlog](../../../../docs/magisch-strand-avontuur/Versie-2-Backlog.md)   | Wat nog niet gebouwd is                         |

## Codeoriëntatie

| Map           | Inhoud                                                             |
| :------------ | :----------------------------------------------------------------- |
| `screens/`    | Eén map per scherm/modus, met eigen state-hook                     |
| `logic/`      | Pure logica: parsers, zones, beloningen, randomisatie (geen React) |
| `components/` | Gedeelde UI-bouwstenen van deze game                               |
| `content.ts`  | Enige bron van waarheid voor woorden, zones en opdrachten          |
| `manifest.ts` | Catalogusmetadata en het offline-pakket                            |
