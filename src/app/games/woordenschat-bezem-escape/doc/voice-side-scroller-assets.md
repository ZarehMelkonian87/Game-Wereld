# Zeg & Vlieg: Assets

Dit document beschrijft Fase 8.

## Achtergrond

De side-scroller gebruikt:

- `assets/backgrounds/beach-voice-side-scroller.png`

De achtergrond wordt als brede horizontale laag gebruikt. In de UI liggen daar rustige parallax-lagen overheen voor lucht, zee en zand.

## Objectsprites

De woordsterren gebruiken bestaande strandstickers:

| Woord | Asset |
| --- | --- |
| boot | `objects/transparent/sailboat-sticker.png` |
| krab | `objects/transparent/crab-sticker.png` |
| dolfijn | `objects/transparent/dolphin-sticker.png` |
| schelp | `objects/transparent/seashells-sticker.png` |
| bal | `objects/transparent/beach-ball-sticker.png` |
| parasol | `objects/transparent/beach-umbrella-sticker.png` |
| zon | `objects/transparent/sun-sticker.png` |

## Obstakels

Voor de eerste demo zijn de obstacle-sprites:

| Obstakel | Asset |
| --- | --- |
| wolk | `objects/side-scroller/cloud-obstacle.svg` |
| golf | `objects/side-scroller/wave-obstacle.svg` |
| rots | `objects/side-scroller/rock-obstacle.svg` |
| parasolrand | `objects/transparent/beach-umbrella-sticker.png` |

De SVG-obstakels zijn gemaakt als eenvoudige sticker-assets met dikke rand, witte stickerlijn en zachte kleuren.

## Bezem En Avatar States

Voor de MVP gebruiken we bestaande productie-assets:

| State | Bezem | Avatar |
| --- | --- | --- |
| vliegen | `icons/brooms/broom-01-basic.png` | `icons/avatars/avatar-01.png` |
| vertraagd | `icons/brooms/broom-02-beach.png` | `icons/avatars/avatar-01.png` |
| boost | `icons/brooms/broom-06-speed.png` | `icons/avatars/avatar-01.png` |

Latere uitbreiding kan aparte avatarposes toevoegen, maar de huidige MVP houdt het rustig en herkenbaar.

## Mascot States

| Moment | Asset |
| --- | --- |
| start | `icons/mascot/mascot-01-neutral.png` |
| hint | `icons/mascot/mascot-06-hint.png` |
| ronde klaar | `icons/mascot/mascot-05-celebration.png` |

## Instructievideo's

Voor `Zeg & Vlieg` zijn de eerste productie-teksten toegevoegd aan `assets/instructions/animation-texts.md`.

De clips zijn nog niet verplicht voor de MVP, omdat de game nu via tekst en spraakherkenning werkt. Ze kunnen later gebruikt worden voor kindvriendelijke opdrachtanimaties.
