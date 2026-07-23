# ADR-005 — Evaluatie van het gamecontract na twee echte games

Status: geaccepteerd  
Datum: 23 juli 2026  
Eigenaar: repository-eigenaar

## Context

Het `GameRuntime`- en manifestcontract is oorspronkelijk uit één grote woordenschatgame afgeleid. “Schelpen Tellen” is als tweede, inhoudelijk andere game gebouwd om te toetsen welke abstracties werkelijk algemeen zijn.

## Bewijs

| Aspect         | Magisch Strand-Avontuur                              | Schelpen Tellen                           |
| -------------- | ---------------------------------------------------- | ----------------------------------------- |
| Domein         | woordenschat en ruimtelijke relaties                 | hoeveelheid-cijferkoppeling 1–5           |
| Interactie     | kiezen, plaatsen, typen, optionele spraak en vliegen | tellen en cijferknoppen                   |
| State          | meerdere controllers en spelmodi                     | lokale fase-/rondestate                   |
| Productiechunk | circa 87 kB gzip                                     | circa 1,7 kB gzip                         |
| Offlinepakket  | code plus circa 172 MB media                         | alleen code, circa 4,6 kB ongecomprimeerd |
| Oefencontract  | taak, skills, outcome, hulp en responstijd           | hetzelfde contract                        |

De tweede implementatie vereiste geen wijziging aan routes, profielrepositories, databaseschema, projectorsemantiek of `GameRuntime`. Wel kwamen twee onterechte eerste-gameaannames boven:

1. de voortgangsfeature filterde hardcoded op `strand-bezem-escape`;
2. de assetmanifestgenerator kende maar één game-entry.

Beide zijn naar game-onafhankelijke iteratie over events/manifests/pakketbronnen omgezet. De projector zelf bleef ongewijzigd.

## Besluit

- `GameRuntime` versie 1 en manifestcontract versie 1 blijven ongewijzigd.
- Bestaande platformprimitives `GameShell`, `GamePanel`, `GameButton` en `GameProgressBar` zijn aantoonbaar gedeeld.
- Er wordt geen generieke round-engine, gamecontrollerbasis of contenttemplate geëxtraheerd; de semantiek van beide games verschilt te sterk.
- Manifests blijven buiten handmatig benoemde game-implementatiechunks. Dit voorkomt chunkcycli en houdt metadata licht.
- Offlinepakketgeneratie accepteert per game een entry en assetprefix.
- Er komt geen Redux-, Zustand- of state-machinedependency. De kleine game is helder met lokale React-state; de grote game heeft begrensde controllers. Er is geen profiler- of complexiteitsbewijs voor een extra library.

## Gevolgen

Een volgende game heeft manifest, implementatie, domeinregels, tests, registryentry en eventueel pakketbron nodig. Nieuwe gedeelde abstracties moeten nog steeds een harde grens beschermen of twee bestaande consumers met dezelfde semantiek vereenvoudigen.
