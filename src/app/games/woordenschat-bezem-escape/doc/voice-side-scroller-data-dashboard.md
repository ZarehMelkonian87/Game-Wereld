# Zeg & Vlieg: Data En Dashboard

## Doel

Fase 9 legt vast welke oefendata `Zeg & Vlieg` bewaart en hoe die data in het ouder/logopedist-dashboard wordt getoond.

De data is bedoeld voor oefenobservatie. Het dashboard geeft geen diagnose, geen officiele score en geen vergelijking met CELF Preschool, PPVT of normtabellen.

## Progress-event

Elke herkenningspoging in `Zeg & Vlieg` wordt opgeslagen als een normaal `BezemEscapePracticeEvent` met `mode: "zeg-en-vlieg"`.

Daarnaast krijgt het event een specifiek `voiceSideScroller` blok:

```ts
voiceSideScroller: {
  targetWord: string;
  spokenTranscript?: string;
  isRecognized: boolean;
  wordAttempts: number;
  hintsUsed: number;
  audioRepeats: number;
}
```

Hiermee blijft de algemene voortgang bruikbaar voor gedeelde dashboards, maar kan `Zeg & Vlieg` ook eigen observaties tonen.

## Per Kindprofiel

De data wordt opgeslagen onder het actieve kindprofiel in dezelfde lokale progress-store als de rest van `+1 Woordenschat Bezem Escape`.

Per kind wordt bewaard:

- Geoefende woorden.
- Herkende woorden.
- Actief uitgesproken woorden.
- Gesproken transcript, als de browser dit teruggeeft.
- Aantal woordpogingen per doelobject.
- Hints.
- Audioherhalingen.
- Verdiende speed en woordsterren.
- Tijdstip van het oefenmoment.

## Dashboardweergave

Het dashboard heeft een aparte sectie `Zeg & Vlieg`.

Per woord toont het dashboard:

- Hoe vaak het woord geoefend is.
- Hoe vaak het woord herkend is.
- Hoeveel hints nodig waren.
- Hoeveel audioherhalingen zijn gebruikt.

De status gebruikt alleen eenvoudige oefenlabels:

- `Gaat goed`
- `Met hulp`
- `Oefenen`
- `Nog moeilijk`

## Exporttekst

De kopieerbare samenvatting bevat nu ook `Zeg & Vlieg`:

- Aantal geoefende woorden.
- Aantal woordpogingen.
- Aantal herkende woorden.
- Aantal hints.
- Aantal audioherhalingen.
- Woorden die extra oefening nodig hebben.

De exporttekst eindigt expliciet met de melding dat het oefenobservatie is en geen diagnose of officiele testscore.

## Backward Compatibility

Oude `zeg-en-vlieg` events zonder `voiceSideScroller` blok blijven zichtbaar. Het dashboard gebruikt dan fallbackdata uit de algemene eventvelden:

- `targetWords[0]`
- `spokenTranscript`
- `attempts`
- `hintsUsed`
- `audioRepeats`
- `isCorrect`

Nieuwe events bewaren de volledige specifieke observatiegegevens.
