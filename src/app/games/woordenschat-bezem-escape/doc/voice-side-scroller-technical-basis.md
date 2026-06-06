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
  VoiceSideScrollerObstacleLayer.tsx
  VoiceSideScrollerGameplayFeedback.tsx
  VoiceSideScrollerRoundSummary.tsx
  VoiceSideScrollerStatusPanel.tsx
  VoiceSideScrollerVoiceMeter.tsx
  VoiceSideScrollerFallbackControls.tsx
  useVoiceSideScrollerController.ts
  useVoiceSideScrollerMicrophone.ts
  useVoiceSideScrollerWordRecognition.ts
  voiceSideScrollerEngine.ts
  voiceSideScrollerFrame.ts
  voiceSideScrollerModel.ts
  voiceSideScrollerSelectors.ts
  voiceSideScrollerWords.ts
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
- `obstacles`: strandobstakels die veilig botsing kunnen geven;
- `collisionSlowdownMs`: korte vertraging na botsing;
- `gameplayFeedback`: tijdelijke kindvriendelijke feedback;
- `speed`: taal-speedwaarde;
- `stars`: scorewaarde;
- `obstacleHits`;
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
- nieuwe obstakelposities;
- veilige botsing met tijdelijke vertraging;
- resterende tijd;
- status `finished` bij ronde-einde.

## Stemcontrole En Fallback Controls

Vanaf Fase 3 heeft de screen echte microfoonbesturing via live volumemeting. De fallback-knoppen blijven beschikbaar voor browsers zonder microfoon of tijdens development:

- `Omhoog`
- `Omlaag`

Deze knoppen sturen dezelfde verticale input als de microfoonmeter.

## Woordherkenning

Vanaf Fase 4 gebruikt de side-scroller dezelfde Nederlandse spraakherkenningsbasis als `Zeg & Zet`.

- `useVoiceSideScrollerMicrophone` meet volume voor omhoog/omlaag vliegen.
- `useVoiceSideScrollerWordRecognition` luistert naar het actieve objectwoord.
- `voiceSideScrollerWords` bevat de doelwoorden en uitspraakvarianten.
- `collectVoiceSideScrollerTarget` geeft een ster en `+1 Speed` als het actieve woord wordt herkend.

De eerste MVP-woorden zijn: boot, krab, dolfijn, schelp, bal, parasol en zon.

## Side-Scroller Gameplay

Vanaf Fase 5 bevat de stage:

- parallax-lagen voor lucht, zee en strand;
- woordsterren rond de strandobjecten;
- strandobstakels: wolk, golf, rots en parasolrand;
- veilige botsingen zonder game-over;
- einde-ronde samenvatting met sterren, speed, hints en geoefende woorden.

## Mobiele Layout

De screen gebruikt:

- full-screen stage;
- portrait layout met HUD boven, stage midden, controls onder;
- landscape layout met HUD boven, stage links, opdracht/controls rechts;
- safe-area padding;
- geen pagina-scroll.

## Nog Niet In De Technische Basis

- dashboard-events;
- menu-card in wereldkeuze.

Die onderdelen horen bij latere fases.
