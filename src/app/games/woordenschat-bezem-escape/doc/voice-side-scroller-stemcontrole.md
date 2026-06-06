# Stemcontrole: Zeg & Vlieg

## Status

Dit document legt Fase 3 vast: microfoonbesturing voor `Zeg & Vlieg`.

## Privacyregel

De game gebruikt de microfoon alleen om live volume te meten.

- Er wordt geen audio-opname gemaakt.
- Er wordt geen audiobestand opgeslagen.
- De gemeten volumewaarde blijft lokaal in de browser.
- Voor Fase 3 wordt nog geen woordherkenning gedaan.

## Permission Flow

De game hergebruikt de bestaande microfoon-permission flow:

1. Controleer of de browser microfoon kan gebruiken.
2. Controleer of de pagina veilig genoeg is voor microfoon.
3. Vraag toestemming via de browser-popup.
4. Als microfoon niet werkt, blijven fallback-knoppen beschikbaar.

## Audio-analyse

De game gebruikt een lokale `AudioContext` met `AnalyserNode`.

Per frame:

1. Lees time-domain samples uit de analyser.
2. Bereken RMS-volume.
3. Trek de ruisvloer af.
4. Zet het bruikbare signaal om naar `volumeLevel` van `0` tot `1`.
5. Zet `volumeLevel` om naar verticale input.

## Ruisfilter

De ruisvloer start op `0.012`.

Als het huidige volume laag genoeg is, wordt de ruisvloer rustig bijgewerkt. Zo past de game zich aan aan:

- stille kamers;
- lichte achtergrondruis;
- verschillende telefoonmicrofoons.

De ruisvloer wordt begrensd, zodat een harde stem niet per ongeluk als achtergrondruis wordt geleerd.

## Drempels

De eerste drempels zijn bewust simpel:

| Niveau | Volume | Effect |
|---|---:|---|
| stil | lager dan 0.08 | bezem zakt door natuurlijke val |
| zacht | 0.08 tot 0.45 | bezem stijgt licht |
| goed | 0.45 tot 0.78 | bezem stijgt duidelijk |
| hard | 0.78 tot 1.00 | bezem stijgt snel |

Belangrijk: de game moet schreeuwen niet nodig maken. De drempels zijn voorlopig en moeten later op echte telefoons worden getest.

## Besturing

De side-scroller engine gebruikt een verticale input:

```text
0 = geen steminput, bezem zakt rustig
-1 = maximale steminput, bezem stijgt snel
```

De fallbackknoppen gebruiken dezelfde input:

- `Omhoog` = `-1`
- `Omlaag` = `1`

Hierdoor kan de game zonder microfoon getest worden.

## Pauze En Stoppen

Wanneer de speler pauzeert of opnieuw start:

- animation loop stopt niet volledig, maar game-state pauzeert;
- microfoonstream stopt;
- alle tracks worden gestopt;
- AudioContext wordt gesloten;
- vertical input gaat terug naar `0`.

## UI

De stemmeter toont:

- microfoonstatus;
- volumebalk;
- tekstfeedback;
- privacyregel.

De stemmeter is compact en bedoeld als technische basis. In latere UI-fases kunnen we hem visueel kindvriendelijker maken.

