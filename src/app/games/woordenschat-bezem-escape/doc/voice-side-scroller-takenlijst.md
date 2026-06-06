# Nieuwe Game Concept Takenlijst: Zeg & Vlieg Side-Scroller

## Doel

De oude Bezem Race wordt vervangen door een nieuwe side-scroller game waarin het kind met klik/touch-knoppen vliegt en strandwoorden oefent door objectnamen duidelijk uit te spreken.

De game is een oefenspel, geen toets. Er worden geen officiele CELF Preschool- of PPVT-items, normtabellen of diagnostische scores gebruikt.

## Kernconcept

Het kind vliegt door een strandlevel. Knoppen besturen de hoogte en spraak bepaalt welke objecten het kind pakt.

- Knop `Omhoog`: de speler stijgt.
- Knop `Omlaag`: de speler daalt.
- Objectnaam goed zeggen: een zichtbaar object wordt verzameld.
- Verkeerde of onduidelijke uitspraak: vriendelijke hint, geen harde game-over.
- Voorbeelden: "boot", "krab", "dolfijn", "schelp".

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

## Fase 3: Besturing En Spraak

- [x] Beweging loskoppelen van stemvolume.
- [x] Klik/touch-knoppen gebruiken voor omhoog/omlaag.
- [x] Spraak alleen gebruiken voor het noemen van objectwoorden.
- [x] Stemmeterkaart verwijderen om meer ruimte voor de game-stage te maken.
- [x] Pauzeknop stopt woordherkenning.
- [x] Privacyregel tonen: de app slaat geen opname op.
- [x] Besturing documenteren: `voice-side-scroller-stemcontrole.md`.

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
- [x] Speler op bezem laten zweven met klik/touch-knoppen.
- [x] Objecten laten binnenkomen van rechts naar links.
- [x] Obstakels toevoegen die passen bij strand: wolk, meeuw, haai, zeeleeuw.
- [x] Verzamelobjecten toevoegen: bootster, krabster, schelpster.
- [x] Botsing met obstakel maakt game-over.
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
- [x] Actieve woordherkenning duidelijk tonen.
- [x] Eenvoudige pauze- en terugknop toevoegen.
- [x] Knopbediening kindvriendelijk ontwerpen.
- [x] Score tonen als sterren of woordpunten.
- [x] Geen tekst op drukke plekken over gameplay leggen.
- [x] Alle knoppen bruikbaar maken op telefoonformaat.

## Fase 8: Assets

- [x] Eerste brede strandachtergrond als conceptasset toevoegen.
- [x] Achtergrond visueel controleren in portrait en landscape.
- [x] Objectsprites voor side-scroller selecteren uit bestaande strandstickers.
- [x] Obstacle-sprites maken of genereren.
- [x] Bezem/avatar animatiestates bepalen.
- [x] Mascot hint-animaties kiezen.
- [x] Instructievideo-teksten maken voor de nieuwe game.

## Fase 9: Data En Dashboard

- [x] Progress-event type voor voice side-scroller toevoegen.
- [x] Per kindprofiel opslaan: geoefende woorden, uitgesproken woorden, hints, audioherhalingen.
- [x] Dashboard uitbreiden met `Zeg & Vlieg` observaties.
- [x] Alleen oefenobservaties tonen, geen diagnose.
- [x] Exporttekst voor ouder/logopedist toevoegen.

## Fase 10: QA En Acceptatie

- [ ] Testen op iPhone Safari via HTTPS. Handmatig op toestel nodig.
- [ ] Testen op Android Chrome via HTTPS. Handmatig op toestel nodig.
- [ ] Testen met headset en telefoonmicrofoon. Handmatig op toestel nodig.
- [x] Testen in portrait.
- [x] Testen in landscape.
- [ ] Testen met spraakherkenning aan/uit. Woordherkenning UI gecontroleerd; echte permission-test blijft handmatig.
- [x] Testen dat de oude Bezem Race niet meer bereikbaar is.
- [x] Build en typecheck groen maken.
- [x] QA-document toevoegen: `voice-side-scroller-qa-acceptatie.md`.
