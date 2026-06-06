# Nieuwe Game Concept Takenlijst: Zeg & Vlieg Side-Scroller

## Doel

De oude Bezem Race wordt vervangen door een nieuwe side-scroller game waarin het kind met de stem vliegt en strandwoorden oefent door objectnamen duidelijk uit te spreken.

De game is een oefenspel, geen toets. Er worden geen officiele CELF Preschool- of PPVT-items, normtabellen of diagnostische scores gebruikt.

## Kernconcept

Het kind vliegt door een strandlevel. De stem bestuurt de hoogte en taalopdrachten bepalen wat het kind moet pakken of ontwijken.

- Stil of zacht praten: de speler zakt rustig.
- Harder geluid of stem: de speler stijgt.
- Objectnaam goed zeggen: het juiste object licht op of wordt verzameld.
- Verkeerde of onduidelijke uitspraak: vriendelijke hint, geen harde game-over.
- Voorbeelden: "boot", "krab", "dolfijn", "schelp", "vlieg omhoog", "ga omlaag".

## Fase 0: Oude Bezem Race Verwijderen

- [x] Oude `RaceScreen` verwijderen.
- [x] Oude `broom-escape-run` mode uit de actieve game-types verwijderen.
- [x] Oude race-instructies uit de content verwijderen.
- [x] Oude raceknop uit spelkeuze en wereldkeuze verwijderen.
- [x] Oude race-state en race-result session storage verwijderen.
- [x] Reward-scherm loskoppelen van oude race-resultaten.
- [x] Side-scroller achtergrond hernoemen naar nieuw voice side-scroller concept.

## Fase 1: Game Design Vastleggen

- [x] Definitieve naam kiezen: `Zeg & Vlieg`.
- [x] Core loop vastleggen: luisteren, vliegen, woord zeggen, object pakken, feedback, beloning.
- [x] Bepalen of het kind alleen objectnamen zegt of ook korte zinnen.
- [x] Bepalen hoe lang een ronde duurt: 45 seconden.
- [x] Bepalen welke strandwoorden in de eerste demo zitten.
- [x] Bepalen welke acties in MVP zitten: omhoog, omlaag, pak object, ontwijk obstakel.
- [x] Game design document toevoegen: `voice-side-scroller-game-design.md`.

## Fase 2: Technische Basis

- [x] Nieuwe gamefolder maken binnen `woordenschat-bezem-escape/screens/voice-side-scroller`.
- [x] Nieuwe route/screen toevoegen zonder de oude race terug te brengen.
- [x] Side-scroller state-model maken: spelerpositie, snelheid, objecten, score, tijd.
- [x] Game-loop bouwen met `requestAnimationFrame`.
- [x] Layout mobile-first maken voor portrait en landscape.
- [x] Canvas of DOM-keuze vastleggen en documenteren.
- [x] Fallback bediening maken voor browsers zonder microfoon.
- [x] Technische basisdocument toevoegen: `voice-side-scroller-technical-basis.md`.

## Fase 3: Stemcontrole

- [x] Microfoon-permission flow hergebruiken uit settings.
- [x] Geluidsvolume meten voor omhoog/omlaag besturing.
- [x] Drempels instelbaar maken: stil, zacht, goed, hard.
- [x] Ruisfilter toevoegen voor stille kamers en telefoonmicrofoons.
- [x] Visuele stemmeter tonen zonder het scherm druk te maken.
- [x] Pauzeknop toevoegen die de microfoon stopt.
- [x] Privacyregel tonen: audio blijft lokaal, geen opname opslaan.
- [x] Stemcontrole documenteren: `voice-side-scroller-stemcontrole.md`.

## Fase 4: Woordherkenning

- [x] Nederlandse spraakherkenning hergebruiken uit `Zeg & Zet`.
- [x] Objectwoorden herkennen: boot, krab, dolfijn, schelp, bal, parasol, zon.
- [x] Synoniemen en kind-uitspraakvarianten per woord documenteren.
- [x] Per object een doelvenster maken: zeg het woord wanneer het object verschijnt.
- [x] Fout/onduidelijk vriendelijk afhandelen met hintvideo of mascot.
- [x] Herhalingsknop toevoegen voor de opdracht.

## Fase 5: Side-Scroller Gameplay

- [x] Strandachtergrond als brede scrollende laag gebruiken.
- [x] Parallax-lagen bepalen: lucht, zee, strand, objecten.
- [x] Speler op bezem laten zweven met stemhoogte.
- [x] Objecten laten binnenkomen van rechts naar links.
- [x] Obstakels toevoegen die passen bij strand: wolk, golf, rots, parasolrand.
- [x] Verzamelobjecten toevoegen: bootster, krabster, schelpster.
- [x] Botsing veilig maken: vertragen en hint geven, geen harde game-over.
- [x] Ronde-einde maken met samenvatting.

## Fase 6: Educatieve Regels

- [x] Elke ronde focust op 3 tot 5 woorden.
- [x] Herkenning registreren: woord gehoord en gekozen.
- [x] Actieve taal registreren: woord zelf gezegd.
- [x] Uitspraak niet streng scoren, alleen observatie vastleggen.
- [x] Hints, herhalingen en hulp apart registreren.
- [x] Woorden die moeilijk blijven vaker laten terugkomen.
- [x] Geen officiele testscore of diagnose tonen.

## Fase 7: UI En UX

- [x] Nieuwe menu-card maken voor de side-scroller.
- [x] Startscherm van de mini-game maken met grote speelknop.
- [x] Microfoonstatus duidelijk tonen.
- [x] Eenvoudige pauze- en terugknop toevoegen.
- [x] Stemindicator kindvriendelijk ontwerpen.
- [x] Score tonen als sterren of woordpunten.
- [x] Geen tekst op drukke plekken over gameplay leggen.
- [x] Alle knoppen bruikbaar maken op telefoonformaat.

## Fase 8: Assets

- [x] Eerste brede strandachtergrond als conceptasset toevoegen.
- [ ] Achtergrond visueel controleren in portrait en landscape.
- [ ] Objectsprites voor side-scroller selecteren uit bestaande strandstickers.
- [ ] Obstacle-sprites maken of genereren.
- [ ] Bezem/avatar animatiestates bepalen.
- [ ] Mascot hint-animaties kiezen.
- [ ] Instructievideo-teksten maken voor de nieuwe game.

## Fase 9: Data En Dashboard

- [ ] Progress-event type voor voice side-scroller toevoegen.
- [ ] Per kindprofiel opslaan: geoefende woorden, uitgesproken woorden, hints, audioherhalingen.
- [ ] Dashboard uitbreiden met `Zeg & Vlieg` observaties.
- [ ] Alleen oefenobservaties tonen, geen diagnose.
- [ ] Exporttekst voor ouder/logopedist toevoegen.

## Fase 10: QA En Acceptatie

- [ ] Testen op iPhone Safari via HTTPS.
- [ ] Testen op Android Chrome via HTTPS.
- [ ] Testen met headset en telefoonmicrofoon.
- [ ] Testen in portrait.
- [ ] Testen in landscape.
- [ ] Testen met microfoon aan/uit.
- [ ] Testen dat de oude Bezem Race niet meer bereikbaar is.
- [ ] Build en typecheck groen maken.
