# Fase 3: Mobiele Scene Builder Layout

Status: uitgevoerd.

## Doel

De scene-builder is nu de eerste echte speelmodus voor `+1 Woordenschat Bezem Escape`. De layout is mobile-first opgebouwd, met portrait als primaire speelrichting en landscape als speelbare compacte variant.

## Uitgevoerd

- De standaard game-route opent direct de `Luister & Plaats` scene-builder.
- De actieve opdracht komt uit de gestructureerde contentdata.
- De objecttray gebruikt de 12 strandobjecten uit het contentmodel en koppelt die aan productie-stickers.
- De scene blijft het grootste visuele gebied.
- De objecttray staat onderaan in portrait.
- De objecttray blijft onderaan bereikbaar in landscape en kan horizontaal scrollen.
- De opdrachtbubble toont alleen de korte opdrachttekst met een audio-knop.
- De top-HUD houdt audio, hint, sterren en een kindveilige ouder-terugknop zichtbaar.
- De speedmeter gebruikt het beginner-bezem icoon als broom energy bar.
- Alle zichtbare knoppen blijven minimaal 44px aanraakbaar.

## Testresultaten

Getest met de lokale Vite app op:

- `390x844` portrait
- `844x390` landscape

Resultaat:

- Geen horizontale body-overflow.
- Geen verticale pagina-scroll.
- Geen kapotte afbeeldingen.
- Geen knoppen kleiner dan 44px.
- De scene, statusbalk en objecttray vallen binnen beeld.
- De opdrachttekst past binnen de opdrachtbubble.

## Screenshots

- `doc/phase-3-scene-builder-layout-portrait.png`
- `doc/phase-3-scene-builder-layout-landscape.png`

## Bewuste Grenzen

Deze fase bouwt nog geen echte interactie. Drag-and-drop, plaatslogica, hints, audio-afspelen en feedback horen bij Fase 4 tot en met Fase 7.
