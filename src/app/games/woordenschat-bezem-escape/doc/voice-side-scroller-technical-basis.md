# Technische Basis: Zeg & Vlieg

## Status

Dit document legt Fase 2 vast: de technische basis voor de nieuwe voice side-scroller.

## Route

De screen is lokaal te openen via:

```text
/games/language/woordenschat-bezem-escape?screen=voice-side-scroller
```

Alias:

```text
/games/language/woordenschat-bezem-escape?screen=zeg-en-vlieg
```

## Mapstructuur

```text
screens/voice-side-scroller/
  VoiceSideScrollerScreen.tsx
  VoiceSideScrollerHud.tsx
  VoiceSideScrollerStage.tsx
  VoiceSideScrollerBackground.tsx
  VoiceSideScrollerPlayer.tsx
  VoiceSideScrollerTargetLayer.tsx
  VoiceSideScrollerStatusPanel.tsx
  VoiceSideScrollerFallbackControls.tsx
  useVoiceSideScrollerController.ts
  voiceSideScrollerEngine.ts
  voiceSideScrollerFrame.ts
  voiceSideScrollerModel.ts
  voiceSideScrollerSelectors.ts
  useVoiceSideScrollerMicrophone.ts
  index.ts
```

## Renderingkeuze

Voor de MVP gebruiken we **DOM + CSS transforms**, geen canvas.

Reden:

- De game gebruikt bestaande PNG-stickerassets.
- DOM-lagen zijn sneller te inspecteren in DevTools.
- Kleine componenten blijven leesbaar en testbaar.
- UI, knoppen en overlays kunnen dezelfde app-stijl blijven gebruiken.
- Voor deze simpele side-scroller is canvas nog niet nodig.

Canvas blijft een optie voor later als we veel objecten, particles, physics of complexere collision nodig hebben.

## State Model

De eerste state bevat:

- `status`: ready, running, paused, finished;
- `playerY`: genormaliseerde verticale spelerpositie;
- `scrollX`: achtergrondscroll;
- `targets`: objecten die van rechts naar links bewegen;
- `speed`: toekomstige speedwaarde;
- `stars`: toekomstige scorewaarde;
- `elapsedMs`;
- `timeLeftMs`.

De ronde duurt standaard `45_000ms`.

## Game Loop

De controller gebruikt `requestAnimationFrame`.

De pure engine krijgt per frame:

- huidige state;
- `deltaMs`;
- fallback vertical input.

De engine rekent daarna:

- nieuwe spelerhoogte;
- nieuwe scrollpositie;
- nieuwe objectposities;
- resterende tijd;
- status `finished` bij ronde-einde.

## Stemcontrole En Fallback Controls

Vanaf Fase 3 heeft de screen echte microfoonbesturing via live volumemeting. De fallback-knoppen blijven beschikbaar voor browsers zonder microfoon of tijdens development:

- `Omhoog`
- `Omlaag`

Deze knoppen sturen dezelfde verticale input als de microfoonmeter.

## Mobiele Layout

De screen gebruikt:

- full-screen stage;
- portrait layout met HUD boven, stage midden, controls onder;
- landscape layout met HUD boven, stage links, opdracht/controls rechts;
- safe-area padding;
- geen pagina-scroll.

## Nog Niet In De Technische Basis

- woordherkenning;
- collisions;
- score toekennen;
- dashboard-events;
- menu-card in wereldkeuze.

Die onderdelen horen bij latere fases.
