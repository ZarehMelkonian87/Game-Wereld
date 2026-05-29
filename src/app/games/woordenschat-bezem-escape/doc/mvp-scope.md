# Eerste MVP Scope

## Doel

De eerste MVP van `+1 Woordenschat Bezem Escape` moet een kleine, speelbare en testbare versie zijn van de kernervaring:

```text
Luisteren -> begrijpen -> plaatje kiezen -> plaatje plaatsen -> speed verdienen -> korte race -> beloning
```

De MVP hoeft nog niet alle latere logopedische functies te bevatten. Het doel is om eerst te bewijzen dat de basis-gameplay werkt op mobiel en dat het kind de taalopdrachten begrijpt als onderdeel van het spel.

## MVP Principes

- Mobile-first: telefoon is het hoofdplatform.
- Spelgevoel voorop: het kind ervaart het als spel, niet als toets.
- Korte rondes: een sessie moet binnen enkele minuten te spelen zijn.
- Positieve correctie: geen harde foutmeldingen.
- Observeerbaar: de app bewaart oefendata, geen officiele scores.
- Uitbreidbaar: nieuwe werelden en opdrachten moeten later makkelijk toe te voegen zijn.

## In Scope

### Wereld

MVP bevat precies een wereld:

- Strandwereld.

### Objecten

MVP bevat tien strandobjecten:

| Id | Label | Categorie | Leerdoel |
| --- | --- | --- | --- |
| `dolfijn` | dolfijn | dieren | woordherkenning, in de zee |
| `boot` | boot | voertuigen | woordherkenning, in/op water |
| `vuurtoren` | vuurtoren | plekken | complexer zelfstandig naamwoord |
| `vliegtuig` | vliegtuig | voertuigen | boven/onder |
| `vlieger` | vlieger | strandspullen | verwarring met vliegtuig oefenen |
| `bal` | bal | strandspullen | eenvoudig woord |
| `parasol` | parasol | strandspullen | naast/onder |
| `schelp` | schelp | strandspullen | strandwoord |
| `krab` | krab | dieren | dierwoord, onder/naast |
| `zandkasteel` | zandkasteel | strandspullen | samengesteld woord |

### Plaatsbegrippen

MVP bevat vijf plaatsbegrippen:

- in;
- op;
- naast;
- onder;
- boven.

### Game Modes

MVP bevat drie modi.

#### 1. Luister & Plaats

Het kind hoort een opdracht, kiest een object en plaatst of bevestigt dit in de scene.

Voorbeeld:

> Zet de boot in het water.

#### 2. Kies Het Woord

Het kind hoort een woord en kiest het juiste plaatje uit meerdere opties.

Voorbeeld:

> Waar is de dolfijn?

#### 3. Bezem Escape-run

Het kind speelt een korte race waarin woorden en plaatsbegrippen terugkomen als race-opdrachten.

Voorbeeld:

> Vlieg onder het vliegtuig door.

### Beloningen

MVP bevat eenvoudige beloningen:

- speed;
- woordsterren;
- Blauwe Bezem;
- Dolfijn Sticker;
- Strandster Sticker.

### Mobiele Layout

MVP moet bruikbaar zijn in:

- portrait;
- landscape;
- kleine telefoons;
- grotere telefoons.

Minimale eisen:

- geen horizontale overflow;
- zichtbare knoppen minimaal 44px;
- objecten zijn goed tikbaar;
- actieknop is bereikbaar;
- opdracht en scene zijn duidelijk zichtbaar.

### Data

MVP bewaart oefendata per kindprofiel.

Minimaal bewaren:

- opdracht id;
- modus;
- doelwoord;
- plaatsbegrip;
- correct of niet;
- hint gebruikt;
- audio herhaald;
- aantal pogingen;
- verdiende speed;
- verdiende woordsterren;
- datum/tijd.

## Out Of Scope Voor MVP

Deze onderdelen komen later:

- officiele testscore of normering;
- diagnostische conclusie;
- meer werelden;
- volledige dashboardanalyse;
- ouder/logopedist-keurknoppen voor actieve taal;
- stemherkenning;
- opgenomen stemmen;
- uitgebreide avatar/beloningwinkel;
- multiplayer of tweede speler;
- complexe drag-and-drop physics;
- geavanceerde racebaan;
- account-sync naar cloud.

## MVP User Flow

```text
1. Kind kiest Word Quest.
2. Kind opent +1 Bezem Escape.
3. Game toont Strandwereld.
4. Kind kiest of start Luister & Plaats.
5. App geeft korte opdracht.
6. Kind kiest object.
7. Kind kiest of bevestigt doelplek.
8. App geeft feedback.
9. Kind verdient speed en woordster.
10. Na meerdere opdrachten start korte race.
11. Kind volgt race-opdrachten.
12. Game toont resultaat en beloning.
13. Voortgang wordt opgeslagen.
```

## MVP Acceptance Criteria

De MVP is klaar wanneer:

- de game vanuit het menu geopend kan worden;
- de strandwereld zichtbaar is;
- de drie modi zichtbaar zijn;
- Luister & Plaats minstens vijf opdrachten speelbaar heeft;
- Kies Het Woord minstens vijf opdrachten speelbaar heeft;
- Bezem Escape-run minstens een korte demo-run heeft;
- feedback positief en kindvriendelijk is;
- speed en woordsterren zichtbaar oplopen;
- voortgang lokaal wordt opgeslagen;
- mobiel portrait en landscape bruikbaar zijn;
- er geen diagnostische claims in UI of data staan.

## Eerste Release Definition

Een eerste interne testversie is voldoende als:

- ouder en kind samen een volledige ronde kunnen spelen;
- het kind zonder uitleg de belangrijkste knoppen kan vinden;
- het kind begrijpt dat goede taalacties speed geven;
- ouder kan zien welke woorden en begrippen geoefend zijn;
- technische fouten de sessie niet blokkeren.
