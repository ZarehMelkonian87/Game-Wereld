# Startscherm Visualisatie

Deze visualisatie hoort bij `start-screen-concept.md`.

## Voorkeursrichting: V2

Na visuele feedback is V2 de richting die we verder gebruiken. Deze versie voelt meer als een echte kindergame-startpagina:

- groot speels logo;
- kind op magische bezem als hoofdbeeld;
- strandwereld als achtergrond;
- score bovenin;
- audio linksboven;
- settings rechtsboven in plaats van hint;
- grote groene `Spelen` knop;
- blauwe ouder/logopedist knop onderaan.

Bestanden:

- `start-screen-concept-v2.html`
- `../assets/logos/start-logo-b-generated-magenta.png`

Tijdelijke concept- en QA-PNG's zijn na review verwijderd.

Logo-opmerking:

- De definitieve transparante logo-asset is uit een magenta chroma-key bron gemaakt.
- Groen wordt niet gebruikt als chroma-key, omdat het woord `Escape` groen/blauwgroen is.
- Hierdoor blijven de groene letters intact bij transparant maken.

## Oude Eerste Schets

## Portrait

Bestand: `start-screen-concept-portrait.svg`

Opbouw:

1. Bovenin een rustige logo-kaart.
2. In het midden de stermascot met magische bezem.
3. Daaronder een grote `Speel` knop.
4. Onderaan drie kleinere acties: `Werelden`, `Groei`, `Opties`.

Doel: het kind ziet meteen waar het moet drukken om te spelen.

## Landscape

Bestand: `start-screen-concept-landscape.svg`

Opbouw:

1. Links het logo.
2. Rechts mascot met bezem.
3. Grote `Speel` knop rechts onder de hero.
4. Secundaire acties links onderin.

Doel: alle belangrijke elementen blijven zichtbaar zonder scroll.

## Beslissing Voor Implementatie

- `Speel` blijft de grootste actie.
- `Werelden`, `Groei` en `Opties` blijven secundair.
- De achtergrond blijft vrolijk maar rustig.
- Er komen geen extra uitlegteksten op het scherm.
- De eerste implementatie mag deze compositie volgen, maar hoeft niet pixel-perfect te zijn.
