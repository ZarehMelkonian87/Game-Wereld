# Gameplay Design Document

## Project

**Game:** +1 Woordenschat Bezem Escape
**Game id:** `woordenschat-bezem-escape`
**Genre:** mobile-first educatieve taalgame met lichte race-progressie
**Status:** MVP design in voorbereiding
**Documenttype:** gameplay design document
**Doelgroep:** jonge kinderen, ongeveer 4 tot 7 jaar
**Gebruikssituatie:** thuis met ouder/verzorger, later eventueel samen met logopedist

## Design Intent

`+1 Woordenschat Bezem Escape` vertaalt een papieren logopediespel naar een mobiele game. Het kind bouwt een scene door plaatjes op de juiste plek te zetten en gebruikt daarna dezelfde woorden en plaatsbegrippen in een korte bezemrace.

De game moet voelen als een spel, niet als een toets. De taaltraining zit in de acties die het kind toch al wil doen: luisteren, kiezen, plaatsen, vliegen, belonen en opnieuw proberen.

De game gebruikt taalvaardigheden die lijken op domeinen uit logopedische observatie, zoals woordenschat, zinsbegrip, woordgebruik en aanwijzingen volgen. De game gebruikt geen officiele testitems, normtabellen, diagnostische scoring of medische claims.

## Product Goals

- Kinderen motiveren om dagelijks korte taalrondes te spelen.
- Woordenschat oefenen via herkenning, plaatsing en herhaling.
- Plaatsbegrippen oefenen in een concrete visuele scene.
- Ouders eenvoudige observaties geven over wat goed gaat en wat oefening nodig heeft.
- Een schaalbaar gameformat maken waarin later meer werelden en taalmodi passen.

## Non Goals

- Geen officiele CELF Preschool- of PPVT-afname.
- Geen normscore, diagnose of klinisch oordeel.
- Geen harde game-over.
- Geen ingewikkelde menu's of tekstuele uitleg voor het kind.
- Geen lange levels die veel concentratie vragen.

## Player Fantasy

Het kind helpt een magische bezem sneller te worden. Elke goede taalactie geeft meer speed. Eerst bouwt het kind de wereld, daarna vliegt het met de bezem door diezelfde wereld.

De centrale belofte:

> Ik maak de wereld goed, mijn bezem wordt sneller, en daarna mag ik racen.

## Design Pillars

### 1. Taal Is De Motor

Speed komt niet uit willekeurig klikken, maar uit taalacties:

- woord herkennen;
- opdracht begrijpen;
- plaatje plaatsen;
- plaatsbegrip toepassen;
- woord of zin benoemen;
- aanwijzing volgen.

### 2. Veilig Proberen

Fouten worden behandeld als oefenmomenten. Het kind krijgt hints, herhaling en een nieuwe kans.

### 3. Korte Ronde, Snelle Beloning

Een volledige speelsessie moet kort kunnen zijn:

- 2 tot 4 minuten voor een oefenronde;
- 30 tot 60 seconden voor een race;
- directe feedback na elke opdracht.

### 4. Mobile First

De game wordt primair ontworpen voor telefoon:

- grote touch targets;
- eenvoudige schermen;
- portrait en landscape;
- weinig tekst;
- duidelijke audio-actie;
- visuele feedback.

### 5. Herhaling Zonder Saaiheid

Dezelfde woorden komen terug in meerdere contexten:

- kiezen;
- plaatsen;
- benoemen;
- race-opdracht;
- beloningsoverzicht.

## Target Audience

### Primary Player

Een jong kind dat extra oefening nodig heeft met Nederlandse taal. Het kind kan nog moeite hebben met:

- woordenschat;
- zinnen begrijpen;
- zelf woorden vinden;
- plaatsbegrippen;
- meerstaps aanwijzingen.

### Secondary User

Ouder, verzorger of logopedist. Deze gebruiker helpt bij:

- starten van de sessie;
- uitleggen als het kind vastloopt;
- beoordelen van actieve taal;
- bekijken van voortgang.

## Game Structure

De game bestaat uit drie lagen:

1. **Scene bouwen:** het kind plaatst objecten in de strandwereld.
2. **Taalactie:** elke plaatsing of keuze traint een woord, zin of begrip.
3. **Escape-run:** de gebouwde scene wordt gebruikt als racebaan.

## Core Loop

1. App geeft een korte audio-opdracht.
2. Kind luistert en kijkt naar de scene.
3. Kind kiest of sleept een plaatje.
4. Kind bevestigt de actie.
5. App controleert woord en/of plek.
6. App geeft vriendelijke feedback.
7. Kind krijgt speed en woordsterren.
8. Nieuwe opdracht start.
9. Na genoeg opdrachten start de race.
10. Race gebruikt dezelfde woorden opnieuw.
11. Kind krijgt beloning en voortgang.

## Session Loop

Een speelsessie bestaat uit:

1. Kies game.
2. Kies of start strandwereld.
3. Speel 5 tot 10 taalopdrachten.
4. Verzamel speed.
5. Speel korte race.
6. Bekijk beloning.
7. Sla voortgang op.
8. Bied "nog een keer" aan.

## MVP Scope

### Wereld

Eerste wereld: Strandwereld.

### Objecten

- dolfijn;
- boot;
- vuurtoren;
- vliegtuig;
- vlieger;
- bal;
- parasol;
- schelp;
- krab;
- zandkasteel.

### Plaatsbegrippen

- in;
- op;
- naast;
- onder;
- boven.

### Game Modes

MVP bevat:

- Luister & Plaats;
- Kies het Woord;
- Bezem Escape-run.

Niet in MVP, wel later:

- Vertel & Bouw;
- Herhaal de Toverspreuk;
- Categorie Race;
- Woordstructuur;
- actieve taal met ouder/logopedist-keurknoppen;
- dashboard met taalobservaties.

## Screen Flow

```text
Hoofdmenu
-> Word Quest
-> +1 Bezem Escape
-> Game Screen
   -> Mode: Luister & Plaats
   -> Mode: Kies het Woord
   -> Mode: Bezem Escape-run
-> Resultaat
-> Beloning
-> Terug of opnieuw
```

## Main Game Screen

Het hoofdscherm bevat:

- compacte header met terugknop, titel en speed;
- modusknoppen;
- opdrachtpaneel;
- strandscene;
- objectenbalk;
- bevestigknop;
- hulpknop.

### Header

Toont:

- terugknop;
- wereldnaam;
- game titel;
- huidige speed.

### Mode Selector

Drie knoppen:

- Plaats;
- Kies;
- Race.

De actieve modus is visueel duidelijk gemarkeerd.

### Instruction Panel

Toont:

- opdrachttekst voor ouder/begeleider;
- audio-knop;
- hint-knop;
- volgende-knop voor demo/debug en later level flow.

### Scene Area

Toont:

- lucht;
- zee;
- strand;
- eiland;
- objecten;
- doelzone-highlight;
- bezem als speler-object.

### Object Tray

Toont beschikbare plaatjes. In MVP kan het kind tikken. Drag-and-drop wordt daarna toegevoegd.

### Action Bar

Bevat:

- hoofdactie: "Ik heb het gedaan";
- hulpknop.

## Controls

### Portrait

Gebruik:

- scene centraal;
- objecten onder de scene;
- actieknop onderaan;
- modusknoppen bovenaan;
- geen horizontale scroll behalve waar expliciet nodig.

### Landscape

Gebruik:

- opdrachten en modi links;
- scene rechts;
- objectenbalk onder de scene;
- actieknop zichtbaar binnen viewport.

### Touch Target Rules

- hoofdknoppen minimaal 44px hoog;
- objecten minimaal 44px breed en hoog;
- knoplabels mogen niet uit de knop vallen;
- actieknop moet altijd bereikbaar blijven;
- geen horizontale body overflow.

## Mode 1: Luister & Plaats

### Gameplay

Het kind hoort een opdracht en plaatst het juiste object op de juiste plek.

Voorbeeld:

> Zet de boot in het water.

### Player Actions

1. Luister naar audio.
2. Kies object.
3. Plaats object in zone.
4. Bevestig.

### Success Condition

Correct als:

- het gekozen object overeenkomt met `targetObjectIds`;
- de gekozen plek overeenkomt met `targetZoneIds`;
- bij relationele opdrachten later ook de verhouding klopt, zoals naast of onder.

### Feedback

Bij correct:

> Goed zo! De boot vaart in het water. +1 Speed!

Bij bijna correct:

> Bijna! De boot hoort in het water. Sleep hem naar de zee.

### MVP Implementation

Eerst:

- tikken op object;
- doelzone tonen;
- bevestigen via knop;
- feedback tonen.

Daarna:

- echte drag-and-drop;
- snap naar zone;
- object blijft in scene staan;
- geplaatste scene wordt input voor race.

## Mode 2: Kies Het Woord

### Gameplay

Het kind hoort een woord en kiest het juiste plaatje uit meerdere opties.

Voorbeeld:

> Waar is de dolfijn?

### Difficulty

- niveau 1: 2 opties;
- niveau 2: 3 opties;
- niveau 3: 4 opties;
- niveau 4: afleiders uit dezelfde categorie.

### Success Condition

Correct als het gekozen object overeenkomt met het doelwoord.

### Feedback

Bij correct:

> Ja, dat is de dolfijn. +1 Speed!

Bij fout:

> Goed geprobeerd. Kijk, dit is de dolfijn.

De app herhaalt het doelwoord en laat het juiste plaatje duidelijk zien.

## Mode 3: Bezem Escape-run

### Gameplay

Na een reeks taalopdrachten verandert de strandscene in een korte race. Objecten uit de scene worden poorten, obstakels of verzamelobjecten.

Voorbeeldopdrachten:

- Vlieg onder het vliegtuig door.
- Vlieg boven de boot.
- Pak de schelp naast de bal.

### Player Actions

MVP:

- tik links/rechts of omhoog/omlaag;
- later swipe of drag voor sturen.

### Speed

De startsnelheid van de run is gebaseerd op taalpunten uit de oefenfase.

Voorbeeld:

- 0 tot 2 speed: langzaam;
- 3 tot 5 speed: normaal;
- 6 of meer speed: snel met boostmomenten.

### Race Length

- MVP: 30 seconden;
- later uitbreidbaar naar 45 of 60 seconden.

### Fail State

Geen harde game-over. Bij botsing of verkeerd pad:

- bezem vertraagt kort;
- opdracht wordt herhaald;
- kind krijgt een nieuwe kans.

## Progression

### Short Term

Per opdracht:

- +1 Speed;
- +1 Woordster;
- positieve feedback.

### Medium Term

Per ronde:

- aantal geoefende woorden;
- moeilijke begrippen;
- behaalde sterren;
- eventueel beloning.

### Long Term

Per profiel:

- vrijgespeelde stickers;
- bezemkleuren;
- werelden;
- voortgang per woord en begrip.

## Reward System

### Currency

- Speed: directe motivatie tijdens de ronde.
- Woordsterren: voortgang en beloningen.

### Rewards

MVP:

- Blauwe Bezem;
- Dolfijn Sticker;
- Strandster Sticker.

Later:

- trails;
- avatars;
- nieuwe werelden;
- scene-decoraties;
- stickerboek.

## Difficulty Design

### Makkelijker Maken

- minder antwoordopties;
- kortere zinnen;
- doelzone laten oplichten;
- audio automatisch herhalen;
- object visueel laten pulsen;
- hint zonder straf.

### Moeilijker Maken

- meer antwoordopties;
- afleiders uit dezelfde categorie;
- langere zinnen;
- relationele plaatsbegrippen;
- twee stappen in een opdracht;
- minder visuele hints;
- kind zelf laten benoemen.

## Adaptive Rules

De game mag later automatisch aanpassen:

- 3 correcte antwoorden zonder hint: niveau omhoog;
- 2 hints achter elkaar: niveau tijdelijk omlaag;
- 2 fouten op hetzelfde begrip: begrip vaker herhalen;
- lange reactietijd: extra visuele ondersteuning tonen.

## Feedback Rules

### Tone

Feedback is rustig, positief en concreet.

### Never Say

- fout;
- verkeerd;
- nee;
- jammer, verloren.

### Use Instead

- Bijna.
- Goed geprobeerd.
- Kijk nog eens.
- De boot hoort in het water.
- Probeer het nog een keer.

### Feedback Formula

```text
Bevestig poging
-> herhaal doelwoord
-> leg begrip kort uit
-> geef nieuwe kans of beloning
```

Voorbeeld:

> Bijna! De bal moet naast de parasol. Naast betekent dichtbij aan de zijkant.

## Educational Mapping

Deze mapping is bedoeld voor ontwerp en observatie, niet voor officiele scoring.

| Domein | In-game oefening | Voorbeeld |
| --- | --- | --- |
| Receptieve woordenschat | woord horen en plaatje kiezen | Waar is de dolfijn? |
| Zinnen begrijpen | gesproken opdracht uitvoeren | Zet de boot in het water. |
| Actieve woordenschat | woord benoemen met oudercheck | Wat zie je? |
| Zinnen herhalen | later toverspreuk nazeggen | De boot vaart op zee. |
| Woordstructuur | later vormen kiezen | een schelp, twee schelpen |
| Begrippen volgen | plaats, kleur, aantal, volgorde | Zet de bal naast de parasol. |
| Categorieen | later poorten kiezen | dolfijn naar dieren |

## Data And Telemetry

Per poging opslaan:

- `profileId`;
- `gameId`;
- `worldId`;
- `mode`;
- `instructionId`;
- `targetWords`;
- `spatialConcepts`;
- `assistance`;
- `isCorrect`;
- `attempts`;
- `audioRepeats`;
- `reactionTimeMs`;
- `speedEarned`;
- `wordStarsEarned`;
- `playedAt`.

Per profiel aggregeren:

- geoefende woorden;
- herkende woorden;
- actief benoemde woorden;
- moeilijke begrippen;
- hints gebruikt;
- audio herhalingen;
- sterren;
- beloningen.

## Observation Dashboard

Dashboard moet simpele taal gebruiken:

- Woordenschat: groeiend, stabiel, extra oefenen.
- Zinnen begrijpen: goed, soms hulp, moeilijk.
- Plaatsbegrippen: goed, met hint, oefenen.
- Aanwijzingen volgen: 1-staps goed, 2-staps oefenen.
- Actieve taal: zelf gezegd, met hulp, nog oefenen.

Voorbeeld:

- Dolfijn: herkend en benoemd.
- Vuurtoren: herkend, benoemen met hulp.
- Naast: goed.
- Onder: goed na herhaling.
- Tussen: later oefenen.

## Content Structure

### World

Een wereld bevat:

- id;
- naam;
- thema;
- objecten;
- zones;
- opdrachten;
- beloningen.

### Object

Een object bevat:

- id;
- label;
- meervoud;
- categorie;
- visuele representatie;
- korte beschrijving;
- woordenschatniveau.

### Instruction

Een opdracht bevat:

- id;
- modus;
- niveau;
- prompt;
- audioText;
- doelobjecten;
- doelzones;
- plaatsbegrippen;
- taaldomeinen;
- antwoordopties;
- hint;
- feedback;
- beloning.

## First Demo Content

### Strandobjecten

| Object | Categorie | Niveau |
| --- | --- | --- |
| dolfijn | dieren | 2 |
| boot | voertuigen | 1 |
| vuurtoren | plekken | 3 |
| vliegtuig | voertuigen | 2 |
| vlieger | strandspullen | 2 |
| bal | strandspullen | 1 |
| parasol | strandspullen | 2 |
| schelp | strandspullen | 2 |
| krab | dieren | 2 |
| zandkasteel | strandspullen | 2 |

### Eerste 30 Opdrachten

#### Luister & Plaats

1. Zet de boot in het water.
2. Zet de dolfijn in de zee.
3. Zet de bal op het strand.
4. Zet de vuurtoren op het eiland.
5. Zet het vliegtuig boven de boot.
6. Leg de schelp naast de bal.
7. Zet de parasol naast het zandkasteel.
8. Zet de krab onder de parasol.
9. Zet de vlieger boven het strand.
10. Zet het zandkasteel op het strand.
11. Zet het vliegtuig boven de vuurtoren.
12. Zet de krab naast de schelp.

#### Kies Het Woord

13. Waar is de dolfijn?
14. Waar is de boot?
15. Waar is de vuurtoren?
16. Waar is de parasol?
17. Waar is de schelp?
18. Waar is de vlieger?
19. Waar is de bal?
20. Waar is de krab?
21. Waar is het zandkasteel?

#### Bezem Escape-run

22. Vlieg onder het vliegtuig door.
23. Vlieg boven de boot.
24. Pak de schelp naast de bal.
25. Ga naar de parasol op het strand.
26. Vlieg langs de vuurtoren op het eiland.
27. Vlieg onder de vlieger door.
28. Pak de bal op het strand.
29. Vlieg boven het zandkasteel.
30. Pak de krab naast de schelp.

## Implementation Milestones

### Milestone 1: Foundation

- game-map;
- gameplay document;
- contentmodel;
- route;
- mobiele layout.

### Milestone 2: Luister & Plaats

- object selecteren;
- doelzone selecteren;
- antwoord controleren;
- feedback tonen;
- speed/sterren updaten.

### Milestone 3: Kies Het Woord

- antwoordopties renderen;
- keuze controleren;
- niveau 1 tot 3 opties ondersteunen;
- woordherkenning opslaan.

### Milestone 4: Bezem Escape-run

- korte race-state;
- spelerbezem;
- obstakels/targets uit scene;
- eenvoudige besturing;
- score naar resultaat.

### Milestone 5: Progress And Rewards

- localStorage per profiel;
- beloningen vrijspelen;
- resultaatkaart;
- dashboarddata voorbereiden.

## Acceptance Criteria For MVP Layout

- Game is bereikbaar via `/games/language/woordenschat-bezem-escape`.
- Portrait layout werkt op 390x844 zonder horizontale overflow.
- Landscape layout werkt op 844x390 zonder horizontale overflow.
- Alle zichtbare knoppen zijn minimaal 44px hoog en breed.
- Scene, objectenbalk en actieknop zijn zichtbaar op mobiel.
- De drie modi zijn zichtbaar en wisselbaar.
- De opdrachttekst komt uit het contentmodel.
- Objecten komen uit het contentmodel.
- Doelzone-highlight komt uit het contentmodel.

## Open Design Questions

- Wordt drag-and-drop de hoofdinteractie of blijft tikken ook volledig ondersteund?
- Hoeveel opdrachten moet een ronde hebben voordat de race start?
- Moet ouderbeoordeling voor actieve taal al in MVP zitten of pas na de eerste speelbare demo?
- Welke beloning is voor het kind het meest motiverend: sticker, bezemkleur of nieuwe wereld?
- Moet audio eerst via browser speech synthesis of via opgenomen stemmen?

## Future Expansion

Later uitbreiden met:

- Boerderijwereld;
- Schoolwereld;
- Boswereld;
- Ruimtewereld;
- Onderwaterwereld;
- Vertel & Bouw;
- Herhaal de Toverspreuk;
- Categorie Race;
- Woordstructuur;
- meervoud en werkwoorden;
- links/rechts/tussen/voor/achter;
- ouder/logopedist-dashboard;
- exporteerbare voortgangsnotities.
