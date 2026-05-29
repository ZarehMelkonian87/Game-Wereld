# +1 Woordenschat Bezem Escape

## Categorie

Taal, woordenschat, zinsbegrip, plaatsbegrippen en aanwijzingen volgen.

De game is geinspireerd op oefendomeinen die ook in logopedische observatie voorkomen, zoals receptieve woordenschat, zinnen begrijpen, actieve woordenschat en ruimtelijke begrippen. De game gebruikt geen officiele testitems, normtabellen of diagnostische scores.

## MVP Doel

Maak eerst een kleine speelbare stranddemo waarin het kind:

- een gesproken opdracht hoort;
- het juiste strandplaatje kiest;
- het plaatje op de juiste plek in de scene zet;
- speed en woordsterren verdient;
- daarna een korte bezemrace speelt met dezelfde woorden en plaatsbegrippen.

## Eerste Scope

- Wereld: strand.
- Plaatjes: dolfijn, boot, vuurtoren, vliegtuig, vlieger, bal, parasol, schelp, krab, zandkasteel.
- Plaatsbegrippen: in, op, naast, onder, boven.
- Modi:
  - Luister & Plaats.
  - Kies het Woord.
  - Bezem Escape-run.
- Beloning: bezemkleur of sticker.
- Opslag: lokale voortgang per kindprofiel.

## Core Loop

1. Luisteren naar de opdracht.
2. Begrijpen welk woord en welke plaats bedoeld worden.
3. Plaatje kiezen.
4. Plaatje plaatsen of antwoord kiezen.
5. Positieve feedback krijgen.
6. Speed en woordsterren verdienen.
7. Racen met de bezem.
8. Beloning ontvangen.
9. Voortgang opslaan.

## Leerdoelen

- Woorden herkennen: het kind hoort een woord en kiest het juiste plaatje.
- Woorden gebruiken: het kind benoemt wat het ziet.
- Zinnen begrijpen: het kind voert een gesproken opdracht uit.
- Plaatsbegrippen oefenen: in, op, naast, onder, boven.
- Aanwijzingen volgen: eerst eenstaps, later tweestaps opdrachten.
- Taalproductie stimuleren: ouder of begeleider kan aangeven of het kind een woord of zin zelf heeft gezegd.

## Data Die Deze Game Rapporteert

Per oefenmoment bewaart de game observatiedata, geen officiele score:

- kindprofiel id;
- game id;
- wereld id;
- modus;
- opdracht id;
- doelwoord;
- plaatsbegrip;
- moeilijkheidsniveau;
- correct zonder hulp;
- correct met hulp;
- hint gebruikt;
- audio herhaald;
- aantal pogingen;
- reactietijd als observatie;
- verdiende speed;
- verdiende woordsterren.

## Eerste Implementatie Taken

1. Game-map en documenten maken.
2. Game registreren in `src/app/data/games.ts`.
3. Strandcontentmodel maken met objecten, zones, opdrachten en beloningen.
4. Mobiele layout bouwen.
5. Luister & Plaats interactie bouwen.
6. Kies het Woord interactie bouwen.
7. Bezem Escape-run interactie bouwen.
8. Voortgang lokaal opslaan.
9. Resultaat- en beloningsscherm bouwen.

## Mobiele Layout

De eerste mobiele layout bevat:

- een compacte header met terugknop, titel en speed;
- drie grote modusknoppen voor Plaats, Kies en Race;
- een opdrachtpaneel met audio-, hint- en volgende-knop;
- een strandscene met lucht, zee, strand, eiland, objecten en doelzone-highlight;
- een objectenbalk met tikbare en voorlopig sleepbare plaatjes;
- een duidelijke actieknop voor "Ik heb het gedaan";
- een aparte hulpknop voor ouder/begeleider;
- responsive indeling voor portrait en landscape.
