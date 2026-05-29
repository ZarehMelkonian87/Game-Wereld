# Development Task Checklist

Deze checklist is de centrale takenlijst voor `+1 Woordenschat Bezem Escape`. Werk taken af van boven naar beneden, tenzij een latere taak eerst nodig blijkt.

## Phase 1: Foundation

- [x] Game-map maken: `src/app/games/woordenschat-bezem-escape`.
- [x] Documentatiemap maken: `doc`.
- [x] Concept-art map maken.
- [x] Art direction bible maken.
- [x] Vaste stijlprompt voor afbeeldingen vastleggen.
- [x] Mobile UI mockup sheet maken en documenteren.
- [x] UI-style regels voor concept art vastleggen.
- [x] Visual direction voor concept art vastleggen.
- [x] Compleet game design document maken.
- [x] Professioneel gameplay design document maken.
- [x] Scene-builder gameplay design document maken.
- [x] Broom escape race gameplay design document maken.
- [x] Reward system design document maken.
- [x] Parent/logopedist dashboard design document maken.
- [x] Eerste MVP-scope document maken.
- [x] Educational content matrix voor strandwereld maken.
- [x] Concrete voorbeeldopdrachten document maken.
- [x] 50 Nederlandse voorbeeldopdrachten voor strandwereld maken.
- [x] Nieuwe echte implementatie-takenlijst maken.
- [x] Game registreren in `src/app/data/games.ts`.
- [x] Game exporteren via `src/app/games/index.ts`.
- [x] Game route toevoegen: `/games/language/woordenschat-bezem-escape`.
- [x] Game openen vanuit de Word Quest game-lijst.
- [x] TypeScript types maken voor wereld, objecten, zones, opdrachten en voortgang.
- [x] Eerste strandcontentmodel maken.
- [x] Eerste 30 demo-opdrachten toevoegen.
- [x] Eerste beloningen toevoegen.

## Phase 2: Mobile Layout

- [x] Mobiele header bouwen met terugknop, titel en speed.
- [x] Modusknoppen bouwen voor Plaats, Kies en Race.
- [x] Opdrachtpaneel bouwen met audio-, hint- en volgende-knop.
- [x] Strandscene bouwen met lucht, zee, strand en eiland.
- [x] Objecten uit het contentmodel tonen in de scene.
- [x] Doelzone-highlight tonen op basis van opdracht.
- [x] Objectenbalk bouwen met tikbare plaatjes.
- [x] Hoofdactieknop bouwen: "Ik heb het gedaan".
- [x] Hulpknop bouwen.
- [x] Portrait layout testen op telefoonformaat.
- [x] Landscape layout testen op telefoonformaat.
- [x] Controleren dat zichtbare knoppen minimaal 44px zijn.
- [x] Controleren dat er geen horizontale overflow is.

## Phase 3: Luister & Plaats Interactie

- [ ] State maken voor actieve opdracht.
- [ ] State maken voor geselecteerd object.
- [ ] State maken voor gekozen doelzone.
- [ ] Tikken op object koppelen aan antwoordcontrole.
- [ ] Tikken op doelzone mogelijk maken.
- [ ] Bevestigknop koppelen aan controlelogica.
- [ ] Controleren of object correct is.
- [ ] Controleren of zone correct is.
- [ ] Correcte feedback tonen.
- [ ] Vriendelijke hint tonen bij fout of bijna goed.
- [ ] Speed verhogen bij correct antwoord.
- [ ] Woordster verhogen bij correct antwoord.
- [ ] Pogingen tellen.
- [ ] Hintgebruik tellen.
- [ ] Audio-herhaling tellen.
- [ ] Volgende opdracht automatisch klaarzetten.

## Phase 4: Drag And Drop

- [ ] Drag-start voor objecten robuust maken op mobiel.
- [ ] Dropzones interactief maken.
- [ ] Object snap naar juiste zone.
- [ ] Object visueel terugzetten bij verkeerde zone.
- [ ] Geplaatste objecten bewaren in scene-state.
- [ ] Scene-objecten niet laten overlappen op kleine schermen.
- [ ] Tappen als alternatief voor drag-and-drop behouden.

## Phase 5: Kies Het Woord

- [ ] Modus `choose-word` eigen layout geven.
- [ ] Antwoordopties uit `answerOptions` tonen.
- [ ] Niveau 1 met 2 opties ondersteunen.
- [ ] Niveau 2 met 3 opties ondersteunen.
- [ ] Niveau 3 met 4 opties ondersteunen.
- [ ] Correcte keuze controleren.
- [ ] Verkeerde keuze vriendelijk corrigeren.
- [ ] Doelwoord visueel herhalen na antwoord.
- [ ] Herkende woorden opslaan.
- [ ] Moeilijke woorden markeren voor herhaling.

## Phase 6: Audio

- [ ] Audio-knop koppelen aan opdrachttekst.
- [ ] Browser speech synthesis onderzoeken.
- [ ] Nederlandse stem selecteren als beschikbaar.
- [ ] Fallback tonen als audio niet beschikbaar is.
- [ ] Audio-herhalingen registreren.
- [ ] Later opgenomen stemmen ondersteunen.

## Phase 7: Bezem Escape-run

- [ ] Race-state maken.
- [ ] Startvoorwaarden bepalen na aantal taalopdrachten.
- [ ] Bezem als speler-object besturen.
- [ ] Eenvoudige links/rechts of omhoog/omlaag besturing bouwen.
- [ ] Racebaan maken op basis van strandscene.
- [ ] Obstakels maken uit geplaatste objecten.
- [ ] Verzamelobjecten maken uit doelwoorden.
- [ ] Race-opdrachten tonen.
- [ ] Correct pad of object controleren.
- [ ] Speed uit taalpunten gebruiken.
- [ ] Geen harde game-over gebruiken.
- [ ] Race afronden na 30 seconden.

## Phase 8: Feedback And Rewards

- [ ] Feedbackcomponent bouwen.
- [ ] Correcte feedback tonen met doelwoord en plaatszin.
- [ ] Bijna-goed feedback tonen met uitleg.
- [ ] Beloning tonen na ronde.
- [ ] Woordsterren optellen.
- [ ] Speed optellen.
- [ ] Blauwe Bezem vrijspelen.
- [ ] Dolfijn Sticker vrijspelen.
- [ ] Strandster Sticker vrijspelen.
- [ ] "Nog een keer" knop toevoegen.

## Phase 9: Progress Storage

- [ ] Progress-datamodel koppelen aan bestaand profiel.
- [ ] Poging opslaan per opdracht.
- [ ] Geoefende woorden opslaan.
- [ ] Herkende woorden opslaan.
- [ ] Plaatsbegrippen per resultaat opslaan.
- [ ] Correct zonder hulp opslaan.
- [ ] Correct met hint opslaan.
- [ ] Hulp nodig opslaan.
- [ ] Reactietijd als observatie opslaan.
- [ ] Verdiende speed en sterren opslaan.
- [ ] Vrijgespeelde beloningen opslaan.

## Phase 10: Result Screen

- [ ] Resultaatscherm na ronde bouwen.
- [ ] Geoefende woorden tonen.
- [ ] Geoefende plaatsbegrippen tonen.
- [ ] Aantal correcte antwoorden tonen.
- [ ] Hints en audioherhalingen tonen voor ouder.
- [ ] Nieuwe beloning tonen.
- [ ] Terug naar gameknop toevoegen.
- [ ] Terug naar hoofdmenu toevoegen.

## Phase 11: Parent And Therapist Dashboard

- [ ] Dashboarddata uit gameprogress halen.
- [ ] Woordenschatstatus tonen.
- [ ] Zinsbegripstatus tonen.
- [ ] Plaatsbegrippenstatus tonen.
- [ ] Actieve taal later toevoegen.
- [ ] Moeilijke woorden tonen.
- [ ] Moeilijke begrippen tonen.
- [ ] Laatste sessie samenvatten.
- [ ] Geen diagnostische claims tonen.

## Phase 12: Content Expansion

- [ ] Nieuwe plaatsbegrippen toevoegen: tussen, voor, achter.
- [ ] Links en rechts toevoegen.
- [ ] Twee-staps opdrachten toevoegen.
- [ ] Actieve woordenschat-opdrachten toevoegen.
- [ ] Zinnen herhalen toevoegen.
- [ ] Woordcategorieen toevoegen.
- [ ] Boerderijwereld ontwerpen.
- [ ] Schoolwereld ontwerpen.
- [ ] Boswereld ontwerpen.
- [ ] Ruimtewereld ontwerpen.

## Phase 13: QA And Polish

- [ ] Testen op kleine telefoon.
- [ ] Testen op grote telefoon.
- [ ] Testen in portrait.
- [ ] Testen in landscape.
- [ ] Touch targets opnieuw controleren.
- [ ] Tekstoverlap controleren.
- [ ] Scene-overlap controleren.
- [ ] Geen horizontale overflow controleren.
- [ ] Build draaien.
- [ ] Browser smoke test uitvoeren.
- [ ] Oudervriendelijke teksten nalopen.
- [ ] Kindvriendelijke feedback nalopen.
