# Fase 18 - QA En Mobiele Test

## Uitgevoerd

- Production build gedraaid met `npm run build`.
- Route smoke test lokaal:
  - `http://localhost:3000/games/language/woordenschat-bezem-escape` -> `200`.
- Route smoke test lokaal netwerk:
  - `http://192.168.1.79:3000/games/language/woordenschat-bezem-escape` -> `200`.
- Mobiele browserchecks zijn per fase uitgevoerd voor:
  - scene-builder;
  - woordkeuze;
  - race;
  - beloning;
  - dashboard;
  - game-menu.

## Resultaat

- Geen build-errors.
- Geen route-fouten op localhost.
- Geen route-fouten op lokaal netwerk.
- Bij eerdere browserchecks was er geen horizontale overflow in portrait en landscape.
- Audio- en hintknoppen blijven zichtbaar in gameplay-schermen.
- Objecttray blijft bruikbaar in scene-builder.
- Drag en tik-alternatief zijn eerder getest.
- Dashboard toont geen diagnose en geen officiele testscore.

## Opmerking

Tijdens de laatste settings-check was de Codex browser-pane tijdelijk niet beschikbaar. De settings-code is wel via production build geverifieerd. De settings-route moet bij de volgende visuele ronde opnieuw in de browser worden bekeken.

## Build-Waarschuwing

Vite geeft een chunk-size waarschuwing omdat de app-bundel groter is dan 500 kB. Dat blokkeert de build niet. Optimalisatie via lazy loading/code splitting kan later als aparte performance-taak worden opgepakt.
