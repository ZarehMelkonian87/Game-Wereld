# Game Design Document

## Project Summary

**Naam:** +1 Woordenschat Bezem Escape
**Type:** mobile-first educatieve kinderspel
**Genre:** taalspel, scene-builder, korte speed escape-run
**Doelgroep:** jonge kinderen van ongeveer 4 tot 7 jaar
**Gebruik:** thuis met ouder/verzorger, later eventueel samen met logopedist
**Platform:** mobiel eerst, speelbaar in portrait en landscape

`+1 Woordenschat Bezem Escape` combineert een logopedisch schermspel met de motivatie van een speed escape-game. Het kind bouwt eerst een scene door losse plaatjes op de juiste plek te zetten. Elke goede taalactie geeft `+1 Speed` aan een magische bezem. Daarna verandert dezelfde scene in een korte race waarin dezelfde woorden, plaatsbegrippen en aanwijzingen terugkomen.

De game is een oefen- en observatiespel. De game gebruikt geen officiele CELF Preschool- of PPVT-items, geen normtabellen en geen diagnostische claims.

## Design Goals

- Het kind moet het spel willen spelen omdat het voelt als een race- en verzamelgame.
- De taaltraining moet natuurlijk in de gameplay zitten.
- De game moet geschikt zijn voor korte dagelijkse oefenmomenten.
- De interface moet rustig, duidelijk en kindvriendelijk zijn.
- Ouder of logopedist moet later kunnen zien wat geoefend is.
- Nieuwe werelden, woorden en opdrachten moeten later makkelijk toegevoegd kunnen worden.

## Non Goals

- Geen officiele taaltest.
- Geen diagnose.
- Geen score vergelijken met normgroepen.
- Geen harde game-over.
- Geen lange tekstuitleg voor kinderen.
- Geen willekeurige UI-stijlen buiten de bestaande appstijl.

## Core Experience

Het kind ervaart:

```text
Ik hoor een opdracht.
Ik kies een plaatje.
Ik zet het plaatje goed neer.
Mijn bezem krijgt speed.
Ik race door mijn eigen scene.
Ik krijg sterren en beloningen.
Ik wil nog een keer spelen.
```

## Game Loop

### Moment-To-Moment Loop

1. De app geeft een korte gesproken opdracht.
2. Het kind bekijkt de scene en losse plaatjes.
3. Het kind kiest of sleept een plaatje.
4. Het kind plaatst het plaatje op de juiste plek.
5. Het kind bevestigt met een grote actieknop.
6. De game controleert object en plaats.
7. De game geeft vriendelijke feedback.
8. Het kind krijgt speed en woordsterren.
9. De volgende opdracht start.

### Session Loop

1. Kind kiest de game vanuit Word Quest.
2. Kind komt in Strandwereld.
3. Kind speelt 5 tot 10 taalopdrachten.
4. Kind verzamelt speed.
5. Bezem Escape-run start.
6. Kind gebruikt dezelfde woorden in race-opdrachten.
7. Game toont resultaat en beloning.
8. Voortgang wordt opgeslagen.
9. Kind kan opnieuw spelen.

### Long-Term Loop

1. Kind oefent woorden en begrippen meerdere dagen.
2. Game herhaalt moeilijke woorden vaker.
3. Kind spaart woordsterren.
4. Kind speelt bezemkleuren, stickers en werelden vrij.
5. Ouder ziet eenvoudige voortgang in dashboard.

## Main Screens

### 1. Game Entry

Doel: kind en ouder komen vanuit de bestaande app bij deze game.

Elementen:

- titel;
- game-icoon;
- korte beschrijving;
- startknop;
- eventueel laatst gespeelde wereld.

Regels:

- gebruikt bestaande Game Wereld card-stijl;
- geen aparte landingpage;
- direct speelbaar.

### 2. Game Screen

Doel: centrale speelruimte voor alle MVP-modi.

Elementen:

- header met terugknop, titel en speed;
- tabs voor Plaats, Kies en Race;
- opdrachtpaneel;
- strandscene;
- objectenbalk;
- actieknop;
- hulpknop.

Portrait:

- header bovenaan;
- tabs onder header;
- opdracht boven scene;
- scene centraal;
- objectenbalk onder scene;
- actieknop onderaan.

Landscape:

- opdracht en tabs links;
- scene rechts;
- objectenbalk onder scene;
- actieknop zichtbaar binnen viewport.

### 3. Luister & Plaats

Doel: zinsbegrip, woordenschat en plaatsbegrippen oefenen.

Voorbeeld:

> Zet de boot in het water.

Kindactie:

- object kiezen;
- doelplek kiezen of object slepen;
- bevestigen.

Feedback:

> Goed zo! De boot vaart in het water. +1 Speed!

### 4. Kies Het Woord

Doel: receptieve woordenschat oefenen.

Voorbeeld:

> Waar is de dolfijn?

Kindactie:

- juiste plaatje kiezen uit 2, 3 of 4 opties.

Feedback:

> Ja, dat is de dolfijn. +1 Speed!

### 5. Bezem Escape-run

Doel: woorden en plaatsbegrippen opnieuw gebruiken in een snelle spelvorm.

Voorbeeld:

> Vlieg onder het vliegtuig door.

Kindactie:

- bezem sturen;
- juiste poort, object of route kiezen;
- obstakels vermijden zonder harde game-over.

### 6. Resultaat En Beloning

Doel: belonen en kort samenvatten.

Toont:

- geoefende woorden;
- geoefende plaatsbegrippen;
- speed;
- woordsterren;
- nieuwe sticker of bezemkleur;
- knop voor opnieuw spelen.

### 7. Ouder/Logopedist Dashboard

Doel: eenvoudige observaties tonen.

Toont later:

- geoefende woorden;
- herkende woorden;
- moeilijke woorden;
- begrippen die goed gaan;
- begrippen die hulp nodig hebben;
- hints en audioherhalingen;
- 1-staps en 2-staps aanwijzingen.

Belangrijk:

- geen diagnose;
- geen officiele score;
- alleen oefenobservaties.

## Art Style

### Direction

De visuele stijl is helder, vriendelijk en leesbaar. De game mag magisch en speels voelen, maar niet druk. De scene moet rustig genoeg blijven zodat het kind de objecten goed kan zien.

Kernwoorden:

- vrolijk;
- veilig;
- helder;
- magisch;
- kindvriendelijk;
- overzichtelijk.

### App UI Versus Game Scene

Belangrijke regel:

```text
App UI volgt Game Wereld stijl.
Game scene volgt strand/bezem thema.
```

Dus:

- tabs, menu's, knoppen en panels volgen de bestaande appstijl;
- de strandscene mag eigen kleuren en objecten gebruiken;
- de UI mag nooit willekeurig of losstaand aanvoelen.

### Color Direction

Basis:

- luchtblauw voor lucht;
- cyan/blauw voor zee;
- warm geel voor strand;
- groen voor positieve actie;
- geel voor hints;
- paars/fuchsia voor magie en beloning.

Vermijden:

- harde rode foutkleur;
- te donkere scene;
- te veel paars als hoofdkleur;
- drukke patronen;
- willekeurige gradients per knop.

## Character Design

### Magische Bezem

De bezem is het centrale karakter van de game.

Functie:

- visualiseert speed;
- wordt sterker door taalacties;
- vliegt in de escape-run;
- krijgt later kleuren en trails.

Ontwerpregels:

- vriendelijk;
- herkenbaar op klein scherm;
- niet eng;
- simpele vorm;
- duidelijke beweging;
- ruimte voor kleurvarianten.

MVP:

- een eenvoudige bezem-visual;
- speedbadge in de header;
- later animatie/trail.

### Kindprofiel Avatar

Het kind heeft al een profiel/avatar in de app.

In deze game:

- avatar blijft onderdeel van profielbeheer;
- avatar hoeft niet zichtbaar in de hele game;
- resultaat en dashboard mogen profielnaam/avatar tonen.

### Helper Character Later

Later kan een helper toegevoegd worden, bijvoorbeeld een vriendelijke tovenaarstem of strandgids.

MVP:

- geen extra character nodig;
- audio en feedbacktekst zijn voldoende.

## Object Design

### MVP Objecten

| Object | Rol | Educatief doel |
| --- | --- | --- |
| dolfijn | dier in zee | woordenschat, in |
| boot | voertuig op water | woordenschat, in/op |
| vuurtoren | plek/object op eiland | complex woord |
| vliegtuig | object in lucht | boven/onder |
| vlieger | strandobject in lucht | onderscheid met vliegtuig |
| bal | eenvoudig strandobject | basiswoord, op/naast |
| parasol | strandobject | naast/onder |
| schelp | klein strandobject | woordenschat |
| krab | dier op strand | dierenwoord |
| zandkasteel | samengesteld woord | woordstructuur later |

### Object Art Rules

Objecten moeten:

- direct herkenbaar zijn;
- groot genoeg zijn voor mobiel;
- een duidelijk silhouet hebben;
- contrasteren met de achtergrond;
- niet te gedetailleerd zijn;
- consistent in stijl zijn.

MVP mag emoji's tijdelijk gebruiken. Later vervangen we die door eigen consistente assets.

## UI Design

### UI Principles

- Alle UI volgt bestaande Game Wereld appstijl.
- Geen random knoppen of tabstijlen.
- Kind moet binnen een seconde zien wat de hoofdactie is.
- Ouder moet de opdracht kunnen lezen.
- Kind hoeft niet veel tekst te lezen.

### Buttons

Primaire knoppen:

- groen of cyan;
- dikke border;
- duidelijke iconen;
- minimaal 44px hoog;
- korte tekst.

Voorbeelden:

- Ik heb het gedaan;
- Volgende;
- Start race.

Secundaire knoppen:

- Audio;
- Hint;
- Reset;
- Terug;
- Hulp.

### Tabs

Tabs:

- Plaats;
- Kies;
- Race.

Regels:

- actieve tab duidelijk gevuld;
- inactieve tabs lichter;
- korte labels op kleine schermen;
- maximaal drie tabs in MVP.

### Panels

Panels voor:

- opdracht;
- feedback;
- objectenbalk;
- resultaat.

Regels:

- duidelijke achtergrond;
- stevige border;
- korte tekst;
- geen nested cards zonder noodzaak.

## Eerste Strandwereld

### Scene Layout

De scene bestaat uit:

- lucht bovenaan;
- zee in het midden;
- strand onderaan;
- eiland rechts in/naast zee;
- objecten verdeeld over de scene;
- doelzones die kunnen oplichten.

### Zones

Eerste zones:

- zee;
- strand;
- lucht;
- eiland;
- plek naast parasol;
- onder parasol.

### Scene Rules

- scene moet rustig blijven;
- doelzones mogen alleen zichtbaar zijn als hint of actieve opdracht;
- objecten mogen niet te veel overlappen;
- belangrijke objecten moeten tikbaar blijven;
- scene moet in portrait en landscape leesbaar blijven.

## Educatieve Opdrachten

### Taalgebieden

De game oefent:

- receptieve woordenschat;
- zinnen begrijpen;
- actieve woordenschat later;
- zinnen herhalen later;
- woordstructuur later;
- begrippen en aanwijzingen volgen;
- woordcategorieen later.

### MVP Opdrachtsoorten

#### Luister & Plaats

Voorbeelden:

- Zet de boot in het water.
- Zet de dolfijn in de zee.
- Leg de schelp naast de bal.
- Zet de krab onder de parasol.
- Zet het vliegtuig boven de boot.

#### Kies Het Woord

Voorbeelden:

- Waar is de dolfijn?
- Waar is de boot?
- Waar is de vuurtoren?
- Waar is de parasol?
- Waar is de schelp?

#### Bezem Escape-run

Voorbeelden:

- Vlieg onder het vliegtuig door.
- Vlieg boven de boot.
- Pak de schelp naast de bal.
- Ga naar de parasol op het strand.
- Pak de krab naast de schelp.

### Feedback Rules

Niet gebruiken:

- fout;
- verkeerd;
- nee;
- verloren.

Wel gebruiken:

- Bijna!
- Goed geprobeerd.
- Kijk nog eens naar de zee.
- De boot hoort in het water.
- Probeer het nog een keer.

## Rewards

### Directe Beloning

Per goede actie:

- +1 Speed;
- +1 Woordster;
- positieve feedback;
- korte animatie later.

### Sterkere Beloning Later

- woord zelf benoemd: +2 Speed;
- zin zelf gemaakt: +2 Speed;
- zonder hint correct: extra woordster.

### Unlocks

MVP:

- Blauwe Bezem;
- Dolfijn Sticker;
- Strandster Sticker.

Later:

- bezemkleuren;
- trails;
- avatars;
- nieuwe werelden;
- stickerboek;
- scene-decoraties.

## Kindprofielen

### Doel

Elk kind heeft eigen voortgang.

Per profiel bewaren:

- gespeelde rondes;
- geoefende woorden;
- herkende woorden;
- moeilijke woorden;
- plaatsbegrippen;
- hints;
- audioherhalingen;
- speed;
- sterren;
- beloningen.

### Privacy En Veiligheid

MVP gebruikt lokale opslag. Geen externe data-uitwisseling nodig.

## Ouder/Logopedist Dashboard

### Doel

Het dashboard geeft eenvoudige observaties zodat ouder of logopedist kan zien wat geoefend is.

### Dashboard Secties

1. Vandaag geoefend.
2. Woorden die goed gaan.
3. Woorden met hulp.
4. Plaatsbegrippen die goed gaan.
5. Plaatsbegrippen om te herhalen.
6. Hints en audioherhalingen.
7. Laatste sessies.

### Voorbeeldobservatie

```text
Vandaag geoefend:
- Dolfijn: herkend en benoemd.
- Vuurtoren: herkend, benoemen met hulp.
- Naast: goed.
- Onder: goed na herhaling.
- 2-staps aanwijzingen: later oefenen.
```

### Dashboard Regels

- geen diagnose;
- geen normscore;
- geen label zoals taalachterstand;
- wel: oefenen, groeiend, met hulp, extra herhalen.

## MVP Version

### MVP Must Have

- strandwereld;
- 10 objecten;
- 5 plaatsbegrippen;
- Luister & Plaats;
- Kies Het Woord;
- eenvoudige Bezem Escape-run;
- speed en woordsterren;
- lokale voortgang per profiel;
- positieve feedback;
- portrait en landscape bruikbaar.

### MVP Should Have

- hints;
- audio via browser speech;
- eenvoudige beloning;
- resultaatkaart.

### MVP Could Have

- eerste stickerboek;
- simpele bezemkleur selectie;
- oudernotities.

### MVP Will Not Have

- officiele testscore;
- stemherkenning;
- cloudaccount;
- meerdere werelden;
- uitgebreide animaties;
- volledige dashboardanalyse.

## Expansion Plan

### Phase 1: Strand MVP

- Luister & Plaats speelbaar;
- Kies Het Woord speelbaar;
- korte race-demo;
- lokale voortgang.

### Phase 2: Taalproductie

- actieve woordenschat;
- ouder/logopedist-keurknoppen;
- zinnen herhalen;
- meer feedbackdata.

### Phase 3: Woordcategorieen En Structuur

- categoriepoorten;
- enkelvoud/meervoud;
- werkwoorden;
- tegenstellingen;
- bijvoeglijke naamwoorden.

### Phase 4: Meer Werelden

- boerderij;
- school;
- bos;
- ruimte;
- onderwaterwereld.

### Phase 5: Dashboard

- overzicht per domein;
- sessiegeschiedenis;
- moeilijke woorden;
- exporteerbare observaties.

### Phase 6: Art Polish

- eigen objectassets;
- bezemanimaties;
- beloninganimaties;
- consistente scene-art per wereld.

## Design Approval Checklist

Voor programmeren aan nieuwe features moeten deze punten duidelijk zijn:

- [ ] GDD is akkoord.
- [ ] MVP-scope is akkoord.
- [ ] Voorbeeldopdrachten zijn akkoord.
- [ ] UI-regels zijn akkoord.
- [ ] Concept-art richting is akkoord.
- [ ] Nieuwe UI volgt bestaande Game Wereld stijl.
- [ ] Nieuwe feature heeft plek in takenlijst.
