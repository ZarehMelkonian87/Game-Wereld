# Fase 7: Audio En Hints

Status: uitgevoerd.

## Doel

De scene-builder heeft nu werkende audio- en hintknoppen. De hulp blijft positief en bouwt rustig op, zodat het kind zelfstandig kan blijven proberen.

## Uitgevoerd

- Top-HUD audio gekoppeld aan de actieve opdracht.
- Audio-knop in de opdrachtbubble gekoppeld aan dezelfde functie.
- Browser `speechSynthesis` gebruikt voor de MVP.
- Nederlandse stem wordt gekozen wanneer de browser die aanbiedt.
- Fallback-feedback wanneer audio niet beschikbaar is.
- Audioherhalingen worden per opdracht geteld.
- Hintniveau 1: doelwoord herhalen.
- Hintniveau 2: juiste sticker laten oplichten.
- Hintniveau 3: doelzone laten oplichten.
- Hintniveau 4: plaatsbegrip simpel uitleggen.
- Hintgebruik wordt als in-memory oefenevent geregistreerd.
- Hintfeedback gebruikt de ster-mascotte.

## Smoke Test

Getest in de browser op mobiel formaat `390x844`:

- Audio-knop verhoogt `data-active-audio-repeats` naar `1`.
- Hint 1 toont: `Zoek de boot.`
- Hint 2 laat de boot-sticker oplichten.
- Hint 3 laat de doelzone oplichten.
- `data-active-hints-used` loopt op per actieve opdracht.
- `data-hint-event-count` registreert hint-events.

## Bewuste Grenzen

De hint- en audiotellingen staan nu nog in component-state. Persistente opslag per kindprofiel wordt in Fase 14 gebouwd.
