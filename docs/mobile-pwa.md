# Mobile PWA Basis

## Doel

De app moet als webversie blijven werken en op Android als geinstalleerde web-app openen alsof het een gewone mobiele app is.

## Minimale Target

- Android Chrome.
- Samsung Galaxy A56 formaat: groot portrait-scherm met FHD+ resolutie.
- Portrait en landscape blijven ondersteund.

## PWA Gedrag

De app gebruikt:

- `manifest.webmanifest`;
- app-iconen voor Android startscherm;
- `display: fullscreen`;
- `display_override` met fallback naar `standalone`;
- `viewport-fit=cover` voor safe-area ondersteuning;
- service worker voor installbaarheid en app-shell caching.

## Belangrijk

Een website kan de browserbalk niet zelf volledig verbergen zolang de gebruiker hem normaal in Chrome opent. De fullscreen ervaring werkt wanneer de gebruiker de app via Android Chrome toevoegt aan het startscherm en daarna via het app-icoon opent.

## Installeren Op Android

1. Open de HTTPS URL in Chrome.
2. Tik op het Chrome menu.
3. Kies `Toevoegen aan startscherm` of `App installeren`.
4. Open daarna `Game Wereld` vanaf het startscherm.

Dan opent de app zonder normale browserbalk.
