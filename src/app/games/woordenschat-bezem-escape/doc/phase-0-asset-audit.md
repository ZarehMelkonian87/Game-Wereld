# Phase 0 Asset Audit

Datum: 2026-05-30

Deze audit hoort bij `Fase 0: Voorbereiding Voor De Bouw`.

## Samenvatting

- De MVP-scope en gameplay-documenten zijn klaar genoeg om de implementatie te starten.
- De huidige prototype-code is bruikbaar als mobiele layout/skeleton, maar gebruikt nog emoji-objecten en een CSS-strandscene.
- Er is een nieuwe productie-assets map gemaakt: `assets/`.
- Strandachtergronden zijn gekopieerd naar `assets/backgrounds/`.
- Bestaande strandobjecten zijn eerst gekopieerd naar `assets/objects/candidates/`, maar de productieversies zijn daarna opnieuw los gegenereerd met chroma-key groen.
- Alle 12 strandobjecten zijn als echte transparante PNG opgeslagen in `assets/objects/transparent/`.
- 8 avatars zijn los gegenereerd en opgeslagen in `assets/icons/avatars/`.
- 6 bezems zijn los gegenereerd en opgeslagen in `assets/icons/brooms/`.
- 7 mascotte-poses zijn los gegenereerd en opgeslagen in `assets/icons/mascot/`.
- Avatar-, mascotte- en bezemsheets blijven alleen bewaard in `assets/source-sheets/` als conceptreferentie.
- Assetmetadata is vastgelegd in `assets/asset-manifest.ts`.

## Belangrijke Technische Bevinding

De oude objectstickers uit `concept-art/generated-images/beach-objects/` hadden geen alpha-kanaal. Ze zagen eruit alsof ze transparant waren, maar de schaakbordachtergrond zat echt in de PNG.

Daarom staan ze nu in:

`assets/objects/candidates/`

Status: alleen bewaren als stijlreferentie. De nieuwe productie-assets staan in `assets/objects/transparent/`.

## Klaar Voor Gebruik

| Asset | Pad | Status |
| --- | --- | --- |
| Strand achtergrond landscape | `assets/backgrounds/beach-board-landscape.png` | Klaar |
| Strand achtergrond portrait | `assets/backgrounds/beach-board-portrait.png` | Klaar |
| Strandobjecten | `assets/objects/transparent/` | Klaar, echte alpha |
| Avatars | `assets/icons/avatars/` | Klaar, echte alpha |
| Bezems | `assets/icons/brooms/` | Klaar, echte alpha |
| Mascotte | `assets/icons/mascot/` | Klaar, echte alpha |

## Productie-Kandidaten Met Open Cleanup

Geen. De oude candidates blijven alleen als referentie bewaard.

## Source Sheets Als Referentie

| Sheet | Pad | Gebruik |
| --- | --- | --- |
| Avatar poses | `assets/source-sheets/child-avatar-character-sheet.png` | Later avatar poses uitsnijden |
| Avatar lineup | `assets/source-sheets/child-avatar-lineup-8.png` | Later profiel/karakter keuze |
| Ster mascotte | `assets/source-sheets/star-mascot-character-sheet.png` | Later hint- en feedback-iconen |
| Bezemset | `assets/source-sheets/magical-broom-set.png` | Later broom/reward iconen |

## Beslissing Voor De Volgende Stap

Voor Fase 1 kunnen we doorgaan met data en content. Voor Fase 2 gebruiken we:

1. `assets/objects/transparent/` voor alle scene-objecten;
2. `assets/icons/avatars/` voor profiel/avatar;
3. `assets/icons/brooms/` voor speed/rewards/race;
4. `assets/icons/mascot/` voor hints en feedback.
