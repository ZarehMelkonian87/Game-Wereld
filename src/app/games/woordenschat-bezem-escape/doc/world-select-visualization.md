# Wereldkeuze Visualisatie

Deze visualisatie hoort bij `world-select-concept.md` en `world-list.md`.

## Richting

- `Strand` staat standaard geselecteerd.
- Toekomstige werelden zijn zichtbaar als zachte `Komt later` kaarten.
- De hoofdactie blijft onderaan: `Start wereld`.
- Portrait gebruikt een geselecteerde wereld-preview boven de kaartgrid.
- Landscape gebruikt links de geselecteerde wereld-preview en rechts de wereldgrid.

## Bestanden

- `world-select-concept-visualization.html`
- `world-select-concept-portrait.png`
- `world-select-concept-landscape.png`

## Implementatie-notities Voor Fase 6

- Gebruik in React dezelfde werelddata uit `worlds.ts`.
- Vervang de inline visualisatie-iconen door lucide iconen in `WorldSelectScreen`.
- Gebruik bestaande UI-bouwstenen waar mogelijk: `HudIconButton`, `PrimaryActionButton` en compacte panel/card styles.
- Laat `Start wereld` voorlopig naar het bestaande `GameMenuScreen` gaan.
