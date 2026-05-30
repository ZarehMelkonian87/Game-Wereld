# Fase 5: Dropzones En Plaatslogica

Status: uitgevoerd.

## Doel

De scene-builder gebruikt nu echte zones uit het strand-contentmodel. Een tik op de scene wordt omgerekend naar procentposities en gekoppeld aan de kleinste passende zone. Daardoor kan dezelfde plaatslogica later worden gebruikt voor drag-and-drop, hints en race-opdrachten.

## Uitgevoerd

- Zone-helper toegevoegd in `logic/scene-zones.ts`.
- Vaste zones worden ondersteund: `lucht`, `zee`, `strand`, `eiland`, `handdoek`.
- Horizontale zones worden ondersteund: `links-zee`, `rechts-strand`, `midden-strand`.
- Relatieve zones worden ondersteund: `boven-zee`, `naast-parasol`, `naast-schelp`, `dichtbij-parasol`, `tussen-bal-zandkasteel`, `ver-weg-zee`.
- Scene-tap kiest nu de echte zone op basis van de tikpositie.
- De game controleert of de gekozen zone het gevraagde plaatsbegrip ondersteunt.
- De gekozen plek krijgt een groene marker.
- Bij een moeilijke of verkeerde plek licht de doelzone geel op.
- Geplaatste objecten snappen naar het midden van hun doelzone.

## Ondersteunde Plaatsbegrippen

De scene-builder declareert deze begrippen als ondersteund:

- `in`
- `op`
- `onder`
- `boven`
- `naast`
- `tussen`
- `links`
- `rechts`
- `midden`
- `dichtbij`
- `ver weg`

## Smoke Test

Getest op mobiel formaat `390x844`:

- `Boot` kiezen en op het strand tikken geeft vriendelijke bijna-goed feedback.
- De doelzone `zee` licht op na de verkeerde plek.
- Speed blijft `0` na verkeerde zone.
- `Boot` kiezen en in de zee tikken plaatst de boot.
- Speed gaat naar `1` en woordsterren naar `1/30`.

## Bewuste Grenzen

Fase 5 gebruikt nog tikken als bediening. Pointer-based drag-and-drop komt in Fase 6.
