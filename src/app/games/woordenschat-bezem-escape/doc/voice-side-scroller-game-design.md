# Game Design: Zeg & Vlieg Side-Scroller

## Status

Dit document legt Fase 1 vast voor de nieuwe game die de oude Bezem Race vervangt.

De game is een oefenspel voor thuisgebruik. De game gebruikt geen officiele CELF Preschool- of PPVT-items, normtabellen, diagnostische scores of medische conclusies.

## Definitieve Werknaam

**Zeg & Vlieg**

Reden:

- De naam is kort en duidelijk voor jonge kinderen.
- De naam vertelt direct wat het kind doet: iets zeggen en vliegen.
- De naam past bij de bestaande modus `Zeg & Zet`.
- De naam maakt duidelijk dat dit een nieuwe stemgame is, niet de oude Bezem Race.

Technische slug:

```text
voice-side-scroller
```

Zichtbare titel in de app:

```text
Zeg & Vlieg
```

## Korte Samenvatting

Het kind vliegt op een magische bezem door een strandwereld. Klik/touch-knoppen besturen de hoogte van de bezem. Tijdens het vliegen verschijnen strandobjecten. De game vraagt een woord, bijvoorbeeld `boot`. Het kind zegt het woord. Als het woord goed genoeg herkend wordt, licht het object op en kan het kind het verzamelen.

De gameplay voelt als een simpele side-scroller, maar het leerdoel is actieve woordenschat, uitspraakpogingen, luisterbegrip en zelfvertrouwen bij spreken.

## Doelgroep

- Jonge kinderen van ongeveer 4 tot 8 jaar.
- Kinderen die extra willen oefenen met Nederlandse woorden.
- Kinderen die woordenschat en actieve taal nodig hebben.
- Thuisgebruik samen met ouder/verzorger.
- Eventueel bespreekbaar met logopedist als oefenobservatie, niet als test.

## Core Loop

1. De speler kiest `Zeg & Vlieg`.
2. De game gebruikt spraakherkenning wanneer het kind een objectwoord moet zeggen.
3. De speler ziet een korte opdrachtvideo of hoort een opdracht.
4. De speler vliegt automatisch vooruit door een strandlevel.
5. De speler bestuurt de hoogte met knoppen:
   - `Omhoog`: bezem stijgt;
   - `Omlaag`: bezem daalt.
6. Een doelobject verschijnt, bijvoorbeeld een boot.
7. De game toont: `Noem wat je ziet`.
8. Het kind zegt `boot`.
9. Bij herkenning krijgt het kind:
   - object verzameld;
   - +1 Speed;
   - +1 Woordster;
   - positieve feedback.
10. Bij onduidelijke herkenning krijgt het kind een vriendelijke hint en een nieuwe kans.
11. Na 45 seconden toont de game een korte beloning en oefensamenvatting.

## MVP Taalvorm

Voor de eerste versie oefent het kind vooral losse objectwoorden.

MVP:

- `boot`
- `krab`
- `dolfijn`
- `schelp`
- `bal`
- `parasol`
- `zon`

Niet in MVP, wel later:

- korte zinnen, zoals `Pak de boot`;
- plaatszinnen, zoals `De boot is in de zee`;
- richtingstaal, zoals `vlieg omhoog`;
- categorieopdrachten, zoals `pak het dier`.

Reden:

De stemcontrole zelf is al technisch en cognitief nieuw. Daarom start de eerste versie met korte, herkenbare woorden. Korte zinnen komen pas wanneer de basisbesturing betrouwbaar en leuk voelt.

## Ronde Duur

MVP-ronde:

```text
45 seconden
```

Reden:

- 30 seconden is vaak te kort om microfoon, ritme en woorden te begrijpen.
- 60 seconden kan voor jonge kinderen te lang worden.
- 45 seconden is kort genoeg voor `nog een keer`, maar lang genoeg voor 5 tot 8 woordpogingen.

Later kunnen rondes adaptief worden:

- 30 seconden voor oefenen of lage concentratie;
- 45 seconden standaard;
- 60 seconden voor oudere kinderen of herhaling.

## Eerste Strandwoorden

### MVP Woorden

| Woord | Type | Waarom |
|---|---|---|
| boot | voertuig | Bekend, kort, duidelijk visueel object. |
| krab | dier | Kort woord, leuk strandobject. |
| dolfijn | dier | Motiverend en herkenbaar. |
| schelp | strandspul | Goed voor strandwoordenschat. |
| bal | strandspul | Zeer herkenbaar, makkelijk beginwoord. |
| parasol | strandspul | Iets langer woord, geschikt als stap omhoog. |
| zon | natuur | Kort woord, goede visuele target bovenin. |

### Later Toevoegen

- vuurtoren
- vliegtuig
- vlieger
- zandkasteel
- handdoek

Deze woorden zijn nuttig, maar voor de eerste demo iets complexer of langer. Ze komen na de basisronde.

## MVP Acties

### Klikbesturing

De bezem beweegt omhoog of omlaag met klik/touch-knoppen.

- Geen knop: bezem zakt rustig.
- `Omhoog`: bezem stijgt.
- `Omlaag`: bezem daalt.

De stem wordt niet gebruikt voor beweging, zodat het kind rustig objectnamen kan uitspreken.

### Object Pakken

Wanneer het juiste object in beeld komt:

1. De game geeft een opdracht, bijvoorbeeld `Zeg boot`.
2. Het kind zegt het woord.
3. Bij herkenning wordt het object verzamelbaar.
4. De speler vliegt erdoorheen of het object vliegt naar de speler.

### Obstakels Ontwijken

MVP-obstakels:

- wolk;
- meeuw;
- haai;
- zeeleeuw.

Bij botsing:

- game-over;
- ronde stopt direct;
- vriendelijke feedback;
- speler kan opnieuw starten.

### Hulp En Herhaling

Altijd zichtbaar:

- herhaal opdracht;
- pauze;
- vliegknoppen.

Hintregels:

- Eerst de opdracht herhalen.
- Daarna doelobject laten oplichten.
- Daarna het woord langzaam voordoen.

## Eerste Levelstructuur

De eerste ronde gebruikt een brede strandachtergrond met drie hoogtezones:

- hoog: lucht, wolken, zon, vlieger;
- midden: horizon, boot, dolfijnsprong;
- laag: strand, krab, schelp, bal, parasol.

Objecten komen van rechts naar links. De speler blijft ongeveer links/midden in beeld.

## Beloning

Na een ronde ziet het kind:

- aantal verzamelde woordsterren;
- woorden geoefend;
- nieuwe speed;
- eventueel sticker of bezemtrail.

Voorbeeldtekst:

```text
Goed gevlogen!
Je hebt boot, krab en dolfijn geoefend.
+5 Woordsterren
```

## Oefendata

Per ronde bewaren we alleen oefenobservaties:

- profiel-id;
- ronde-id;
- geoefende woorden;
- woorden herkend door spraakherkenning;
- woorden met hulp;
- aantal hints;
- aantal herhalingen;
- microfoon beschikbaar ja/nee;
- ronde voltooid ja/nee;
- sterren en speed.

Niet bewaren:

- audio-opnames;
- officiele testscore;
- normvergelijking;
- diagnose.

## Acceptatie Voor Fase 1

Fase 1 is klaar wanneer:

- de werknaam gekozen is;
- de core loop vastligt;
- de MVP-taalvorm vastligt;
- de ronde-duur gekozen is;
- de eerste strandwoorden gekozen zijn;
- de MVP-acties gekozen zijn;
- de takenlijst voor Fase 1 is bijgewerkt.
