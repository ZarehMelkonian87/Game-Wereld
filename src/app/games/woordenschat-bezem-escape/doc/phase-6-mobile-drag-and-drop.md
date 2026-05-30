# Fase 6: Drag-And-Drop Op Mobiel

Status: uitgevoerd.

## Doel

De scene-builder ondersteunt nu pointer-based drag-and-drop voor touch en muis. Tikken blijft bestaan als rustig alternatief voor jonge kinderen.

## Uitgevoerd

- Pointer-based drag voor stickers in de objecttray.
- Drag-preview volgt de vinger/muis als losse overlay.
- De oorspronkelijke tray blijft stabiel, zonder layout shift.
- Sticker krijgt geselecteerde/actieve styling tijdens drag.
- Dropzone wordt bepaald met de pointerpositie bij loslaten.
- Loslaten op een geldige scenezone kiest die zone.
- Loslaten buiten de scene zet het object terug en geeft vriendelijke feedback.
- Tikken op sticker en daarna scene blijft werken.
- Stickerknoppen gebruiken `touch-none` om scrollen tijdens drag te voorkomen.

## Smoke Test

Getest met browser-automatisering:

- Portrait `390x844`: boot naar zee slepen kiest zone `zee`.
- Na `Klaar` wordt de boot geplaatst en stijgt speed naar `1`.
- Landscape `844x390`: boot naar zee slepen kiest zone `zee`.
- Drag-preview verdwijnt na loslaten.
- Er is geen horizontale overflow.

## Lokaal Netwerk

De Vite-server draait met `--host 0.0.0.0`. De route is lokaal via het netwerk bereikbaar getest via:

`http://192.168.1.79:3000/games/language/woordenschat-bezem-escape`

Let op: het IP-adres kan per netwerk veranderen.
