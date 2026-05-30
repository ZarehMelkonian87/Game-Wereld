# Echte Implementatie Takenlijst

Deze checklist is de praktische bouw-roadmap voor `+1 Woordenschat Bezem Escape`.

Doel: het spel stap voor stap echt speelbaar maken, met gebruik van de bestaande gameplay-documenten, concept-art, objectafbeeldingen en de mobiele app-structuur.

## Bronnen Die Altijd Gevolgd Moeten Worden

Gebruik deze bestanden als bron van waarheid voordat een onderdeel wordt gebouwd:

- `doc/game-design-document.md` - volledig Game Design Document.
- `doc/mvp-scope.md` - eerste MVP-afbakening.
- `doc/gameplay.md` - professionele gameplay-beschrijving.
- `doc/scene-builder-gameplay.md` - regels voor Luister & Plaats.
- `doc/broom-race-gameplay.md` - regels voor Bezem Escape-run.
- `doc/educational-content-matrix.md` - taalgebieden en oefenstructuur.
- `doc/voorbeeldopdrachten-50.md` - eerste 50 Nederlandse opdrachten.
- `doc/reward-system.md` - beloningen, +1 Speed en stickers.
- `doc/parent-therapist-dashboard.md` - voortgangsdashboard zonder diagnose.
- `concept-art/art-direction-bible.md` - visuele stijlregels.
- `concept-art/style-prompt.md` - vaste stijlprompt.
- `concept-art/ui-rules.md` - harde UI-regels.
- `concept-art/ui-mockups.md` - schermindeling en mobiele UI-richting.

## Beschikbare Concept-Art En Objectbeelden

Gebruik deze beelden als referentie of als basis voor productie-assets:

- `concept-art/generated-images/beach-scene-board-landscape.png`
- `concept-art/generated-images/beach-scene-board-portrait.png`
- `concept-art/generated-images/mobile-ui-mockups-sheet.png`
- `concept-art/generated-images/child-avatar-character-sheet.png`
- `concept-art/generated-images/child-avatar-lineup-8.png`
- `concept-art/generated-images/star-mascot-character-sheet.png`
- `concept-art/generated-images/magical-broom-set.png`
- `concept-art/generated-images/beach-objects/dolphin-sticker.png`
- `concept-art/generated-images/beach-objects/sailboat-sticker.png`
- `concept-art/generated-images/beach-objects/lighthouse-sticker.png`
- `concept-art/generated-images/beach-objects/beach-ball-sticker.png`
- `concept-art/generated-images/beach-objects/beach-umbrella-sticker.png`
- `concept-art/generated-images/beach-objects/crab-beach-towel-sticker.png`
- `concept-art/generated-images/beach-objects/seashells-sticker.png`
- `concept-art/generated-images/beach-objects/sandcastle-sticker.png`
- `concept-art/generated-images/beach-objects/kite-sticker.png`
- `concept-art/generated-images/beach-objects/airplane-sticker.png`

Let op: `handdoek` en `zon` zitten al in de educatieve content, maar hebben nog aparte productie-sticker nodig.

## Harde Implementatieregels

- [ ] Bouw mobile-first.
- [ ] Ondersteun portrait en landscape.
- [ ] Volg de bestaande Game Wereld app-stijl.
- [ ] Gebruik geen willekeurige losse UI-stijlen.
- [ ] Gebruik de concept-art stijl consequent.
- [ ] Houd knoppen minimaal 44px aanraakbaar.
- [ ] Houd audio- en hintknoppen altijd zichtbaar tijdens gameplay.
- [ ] Gebruik geen harde game-over.
- [ ] Gebruik positieve feedback.
- [ ] Gebruik geen officiele CELF Preschool- of PPVT-items.
- [ ] Gebruik geen officiele scoring, normtabellen of diagnoseclaims.
- [ ] Toon voortgang alleen als oefenobservatie.
- [ ] Houd kindprofieldata gescheiden per profiel.

## Fase 0: Voorbereiding Voor De Bouw

- [x] Controleer alle gameplay-documenten en accepteer de MVP-scope.
- [x] Controleer welke delen van de bestaande prototype-code bruikbaar blijven.
- [x] Maak een duidelijke productie-assets map binnen de game-map, bijvoorbeeld `assets/`.
- [x] Bepaal welke concept-art direct bruikbaar is en welke alleen referentie blijft.
- [x] Kopieer goedgekeurde productie-assets vanuit `concept-art/generated-images`.
- [x] Laat originele concept-art bestanden ongewijzigd.
- [x] Controleer of alle sticker-objecten echte transparante achtergronden hebben.
- [x] Maak schone transparante versies als een sticker geen echte alpha heeft.
- [x] Maak ontbrekende sticker-assets voor `handdoek` en `zon`.
- [x] Maak losse broom-, avatar- en mascot-iconen met echte transparantie.
- [x] Optimaliseer alle productiebeelden voor mobiel gebruik.
- [x] Leg assetmetadata vast: id, naam, categorie, bestandspad, standaardgrootte.

## Fase 1: Content En Data Fundament

- [ ] Werk het strand-contentmodel bij met alle 12 objecten.
- [ ] Voeg objecten toe: dolfijn, boot, vuurtoren, vliegtuig, vlieger, bal, parasol, schelp, krab, zandkasteel, handdoek, zon.
- [ ] Voeg alle plaatsbegrippen toe: in, op, onder, boven, naast, tussen, links, rechts, midden, dichtbij, ver weg.
- [ ] Maak een typed model voor scene-builder opdrachten.
- [ ] Maak een typed model voor woordkeuze-opdrachten.
- [ ] Maak een typed model voor race-opdrachten.
- [ ] Maak een typed model voor beloningen.
- [ ] Maak een typed model voor oefen-events.
- [ ] Maak een typed model voor voortgang per kindprofiel.
- [ ] Zet MVP-opdrachten uit de documenten om naar gestructureerde data.
- [ ] Geef elke opdracht een vaste id.
- [ ] Voeg tags toe voor taalgebied, moeilijkheid, object, begrip en game-modus.
- [ ] Voeg veilige feedbackteksten toe per opdrachtsoort.

## Fase 2: Productie-Assets In De UI

- [ ] Vervang emoji/object placeholders door echte stickerbeelden.
- [ ] Vervang de CSS-strandscene door de strandscene achtergrondafbeelding.
- [ ] Gebruik de portrait achtergrond in portrait mode.
- [ ] Gebruik de landscape achtergrond in landscape mode.
- [ ] Toon stickerobjecten in de objectenbalk.
- [ ] Toon geplaatste stickerobjecten in de scene.
- [ ] Gebruik de broom-afbeelding voor speed en race.
- [ ] Gebruik de mascot-afbeelding voor hints en feedback.
- [ ] Gebruik avatar-afbeeldingen voor profiel/karakter waar mogelijk.
- [ ] Zorg dat alle assets scherp blijven op mobiel.
- [ ] Zorg dat stickerobjecten niet te klein worden op telefoon.
- [ ] Zorg dat stickerobjecten elkaar niet onduidelijk overlappen.

## Fase 3: Mobiele Scene Builder Layout

- [ ] Bouw de scene-builder als eerste echte speelmodus.
- [ ] Houd de scene groot en centraal.
- [ ] Houd de objectenbalk onderaan in portrait.
- [ ] Houd de objectenbalk goed bereikbaar in landscape.
- [ ] Toon de huidige opdracht in een korte opdrachtbubble.
- [ ] Toon audio-knop altijd zichtbaar.
- [ ] Toon hint-knop altijd zichtbaar.
- [ ] Toon speed-meter als magische broom energy bar.
- [ ] Toon sterren of woordsterren compact.
- [ ] Maak de terugknop kindveilig, bijvoorbeeld parent-only of hold-actie.
- [ ] Controleer dat niets buiten beeld valt op kleine telefoons.
- [ ] Controleer dat tekst niet over knoppen of objecten valt.

## Fase 4: Luister & Plaats Interactie

- [ ] Maak state voor actieve opdracht.
- [ ] Maak state voor geselecteerd object.
- [ ] Maak state voor gekozen doelzone.
- [ ] Maak state voor geplaatste objecten.
- [ ] Laat kind een object selecteren met tikken.
- [ ] Laat kind een doelplek kiezen met tikken.
- [ ] Voeg bevestigknop toe voor jonge kinderen.
- [ ] Controleer of het juiste object gekozen is.
- [ ] Controleer of de juiste zone gekozen is.
- [ ] Controleer of het juiste plaatsbegrip is toegepast.
- [ ] Toon correcte feedback met doelwoord en zin.
- [ ] Toon bijna-goed feedback zonder hard `fout`.
- [ ] Herhaal het juiste woord na antwoord.
- [ ] Herhaal de juiste plaatszin na antwoord.
- [ ] Verhoog +1 Speed bij goede taalactie.
- [ ] Verhoog woordster bij goede taak.
- [ ] Ga pas door als de opdracht veilig is afgerond.

## Fase 5: Dropzones En Plaatslogica

- [ ] Definieer vaste zones: lucht, zee, strand, eiland, handdoek.
- [ ] Definieer horizontale zones: links, midden, rechts.
- [ ] Definieer relatieve zones: boven, onder, naast, tussen, dichtbij, ver weg.
- [ ] Toon zones alleen wanneer dat helpt.
- [ ] Laat de doelzone oplichten bij hint.
- [ ] Laat objecten netjes snappen naar de gekozen plek.
- [ ] Ondersteun `in`.
- [ ] Ondersteun `op`.
- [ ] Ondersteun `onder`.
- [ ] Ondersteun `boven`.
- [ ] Ondersteun `naast`.
- [ ] Ondersteun `tussen`.
- [ ] Ondersteun `links`.
- [ ] Ondersteun `rechts`.
- [ ] Ondersteun `midden`.
- [ ] Ondersteun `dichtbij`.
- [ ] Ondersteun `ver weg`.

## Fase 6: Drag-And-Drop Op Mobiel

- [ ] Bouw pointer-based drag voor touch en muis.
- [ ] Houd tikken als alternatief voor drag-and-drop.
- [ ] Verhoog sticker iets tijdens slepen.
- [ ] Toon sleepfeedback zonder layout shift.
- [ ] Detecteer dropzone via pointerpositie.
- [ ] Snap object naar geldige plek.
- [ ] Zet object terug bij ongeldige plek.
- [ ] Voorkom dat slepen de pagina laat scrollen.
- [ ] Test drag-and-drop in portrait.
- [ ] Test drag-and-drop in landscape.
- [ ] Test drag-and-drop op telefoon via lokaal netwerk.

## Fase 7: Audio En Hints

- [ ] Koppel audio-knop aan de opdrachttekst.
- [ ] Gebruik browser speech synthesis voor MVP.
- [ ] Kies Nederlandse stem als beschikbaar.
- [ ] Toon fallback als audio niet beschikbaar is.
- [ ] Tel audioherhalingen per opdracht.
- [ ] Maak hint niveau 1: herhaal sleutelwoord.
- [ ] Maak hint niveau 2: laat juiste sticker oplichten.
- [ ] Maak hint niveau 3: laat doelzone oplichten.
- [ ] Maak hint niveau 4: leg het plaatsbegrip simpel uit.
- [ ] Registreer hintgebruik in oefen-events.
- [ ] Gebruik mascot voor hintfeedback.

## Fase 8: Kies Het Woord Modus

- [ ] Bouw de woordkeuze-layout.
- [ ] Toon antwoordopties als grote stickercards.
- [ ] Begin met 2 antwoordopties.
- [ ] Ondersteun later 3 antwoordopties.
- [ ] Ondersteun later 4 antwoordopties.
- [ ] Speel vraag af via audio-knop: `Waar is de ...?`.
- [ ] Controleer gekozen antwoord.
- [ ] Herhaal het juiste woord na antwoord.
- [ ] Geef +1 Speed bij correct herkennen.
- [ ] Registreer herkend zonder hulp.
- [ ] Registreer herkend met hint.
- [ ] Markeer moeilijke woorden voor herhaling.

## Fase 9: Actieve Taal En Zinnen

- [ ] Voeg optionele vraag toe: `Wat zie je?`.
- [ ] Voeg ouder/logopedist knoppen toe: goed, bijna goed, met hulp.
- [ ] Registreer actief benoemde woorden.
- [ ] Voeg korte zinsnazeg-opdrachten toe als bezemspreuk.
- [ ] Voeg ouder/logopedist beoordeling toe voor zinsnazeggen.
- [ ] Registreer korte zin goed.
- [ ] Registreer gedeeltelijk herhaald.
- [ ] Registreer met hulp.
- [ ] Houd deze stap optioneel als de eerste MVP te groot wordt.

## Fase 10: +1 Speed En Beloningen

- [ ] Geef +1 Speed voor goede taalactie.
- [ ] Geef extra beloning voor zonder hint.
- [ ] Geef normale beloning voor met hint.
- [ ] Trek geen beloningen af bij fouten.
- [ ] Toon broom energy bar.
- [ ] Animeer speed-meter kort bij winst.
- [ ] Tel woordsterren per ronde.
- [ ] Ontgrendel eerste sticker.
- [ ] Ontgrendel eerste nieuwe bezemkleur.
- [ ] Toon beloning met mascot celebration.
- [ ] Sla vrijgespeelde beloningen per profiel op.

## Fase 11: Scene Afronden En Race Starten

- [ ] Bepaal MVP-completeregel, bijvoorbeeld 5 goede plaatsopdrachten.
- [ ] Detecteer wanneer de scene compleet genoeg is.
- [ ] Toon korte positieve scene-complete feedback.
- [ ] Laat geplaatste objecten zichtbaar.
- [ ] Toon knop `Start race`.
- [ ] Neem geoefende woorden mee naar de race.
- [ ] Neem geoefende plaatsbegrippen mee naar de race.
- [ ] Bewaar de scene-state voor de race.

## Fase 12: Bezem Escape-run MVP

- [ ] Bouw race-scherm in dezelfde strandstijl.
- [ ] Toon avatar op magische bezem.
- [ ] Toon korte opdrachtbubble tijdens race.
- [ ] Toon audio- en hintknop.
- [ ] Toon speed-meter en sterren.
- [ ] Maak race 30 seconden voor MVP.
- [ ] Bouw simpele besturing: links/rechts en springen of swipe.
- [ ] Maak obstakels uit eerder geplaatste objecten.
- [ ] Maak verzamelsterren rond geoefende woorden.
- [ ] Ondersteun race-opdracht `onder`.
- [ ] Ondersteun race-opdracht `boven`.
- [ ] Ondersteun race-opdracht `links`.
- [ ] Ondersteun race-opdracht `rechts`.
- [ ] Ondersteun race-opdracht `tussen`.
- [ ] Geef +1 Speed bij correcte race-actie.
- [ ] Vertraag vriendelijk bij fout.
- [ ] Geef hint bij fout.
- [ ] Eindig zonder harde game-over.

## Fase 13: Resultaat- En Beloningsscherm

- [ ] Toon geoefende woorden.
- [ ] Toon geoefende plaatsbegrippen.
- [ ] Toon aantal goede acties.
- [ ] Toon gebruikte hints.
- [ ] Toon audioherhalingen voor ouder/logopedist.
- [ ] Toon verdiende speed.
- [ ] Toon verdiende sterren.
- [ ] Toon nieuwe sticker of bezemkleur.
- [ ] Voeg knop `Nog een keer` toe.
- [ ] Voeg knop `Kies wereld` toe.
- [ ] Voeg knop `Terug naar menu` toe.

## Fase 14: Voortgang Opslaan Per Kindprofiel

- [ ] Koppel gameprogress aan bestaand kindprofiel.
- [ ] Sla oefen-events op in localStorage of bestaande app-opslag.
- [ ] Sla geoefende woorden op.
- [ ] Sla herkende woorden op.
- [ ] Sla actief benoemde woorden op.
- [ ] Sla geoefende plaatsbegrippen op.
- [ ] Sla begrippen die moeilijk waren op.
- [ ] Sla zinsbegripresultaten op.
- [ ] Sla zinsnazegpogingen op.
- [ ] Sla aanwijzingen-volgen resultaten op.
- [ ] Sla categorie-resultaten op.
- [ ] Sla correct zonder hulp op.
- [ ] Sla correct met hulp op.
- [ ] Sla hulp nodig op.
- [ ] Sla hints en audioherhalingen op.
- [ ] Houd alle data gescheiden per profiel.

## Fase 15: Ouder/Logopedist Dashboard

- [ ] Bouw sectie `Vandaag geoefend`.
- [ ] Bouw woordenlijst met status per woord.
- [ ] Bouw plaatsbegrippen-overzicht.
- [ ] Bouw zinnen begrijpen overzicht.
- [ ] Bouw actieve woordenschat overzicht.
- [ ] Bouw zinnen herhalen overzicht.
- [ ] Bouw aanwijzingen volgen overzicht.
- [ ] Bouw categorieen overzicht.
- [ ] Bouw aanbevolen volgende oefening.
- [ ] Bouw export/deelbare samenvatting.
- [ ] Gebruik labels: `Gaat goed`, `Oefenen`, `Met hulp`, `Nog moeilijk`.
- [ ] Toon geen diagnose.
- [ ] Toon geen officiele testscore.
- [ ] Vergelijk niet met normgroepen.

## Fase 16: Navigatie En Schermen

- [ ] Laat game starten vanuit het bestaande hoofdmenu.
- [ ] Voeg wereldkeuze toe met Strandwereld.
- [ ] Voeg game-modus keuze toe.
- [ ] Voeg scene-builder entry toe.
- [ ] Voeg woordkeuze entry toe.
- [ ] Voeg race entry pas toe na scene-completion.
- [ ] Voeg beloningen/stickers entry toe.
- [ ] Voeg instellingen entry toe.
- [ ] Houd menu's rustig en kindvriendelijk.
- [ ] Gebruik dezelfde buttonstijl als de app.

## Fase 17: Instellingen

- [ ] Voeg audio aan/uit toe.
- [ ] Voeg hints aan/uit of hints-niveau toe.
- [ ] Voeg reduced motion toe.
- [ ] Voeg reset voortgang toe met ouderbevestiging.
- [ ] Voeg korte oudertekst toe dat data oefenobservatie is.

## Fase 18: QA En Mobiele Test

- [ ] Draai production build.
- [ ] Smoke test route `/games/language/woordenschat-bezem-escape`.
- [ ] Test op 390x844 portrait.
- [ ] Test op 844x390 landscape.
- [ ] Test via lokaal netwerk op telefoon.
- [ ] Controleer geen horizontale overflow.
- [ ] Controleer geen tekstoverlap.
- [ ] Controleer geen onbruikbare kleine knoppen.
- [ ] Controleer dat audio-knop zichtbaar blijft.
- [ ] Controleer dat hint-knop zichtbaar blijft.
- [ ] Controleer dat objectenbalk bruikbaar is.
- [ ] Controleer dat drag werkt.
- [ ] Controleer dat tik-alternatief werkt.
- [ ] Controleer dat voortgang per profiel apart blijft.
- [ ] Controleer dat dashboard geen diagnose of testscore toont.
- [ ] Controleer dat UI-regels uit concept-art gevolgd worden.

## Fase 19: Git En Publicatie

- [ ] Controleer alle gewijzigde bestanden.
- [ ] Sluit losse, niet-gerelateerde bestanden uit.
- [ ] Draai build voor commit.
- [ ] Maak commit voor eerste implementatiemijlpaal.
- [ ] Push naar GitHub wanneer gevraagd.

## MVP Definition Of Done

De eerste speelbare MVP is klaar wanneer:

- [ ] het kind de game kan openen vanuit Game Wereld;
- [ ] het kind minstens 5 strandplaatsopdrachten kan spelen;
- [ ] het kind minstens 1 woordkeuze-ronde kan spelen;
- [ ] audio en hintknoppen werken;
- [ ] stickers uit de concept-art zichtbaar zijn in de game;
- [ ] speed en woordsterren oplopen;
- [ ] scene-completion de race kan starten;
- [ ] race minstens 5 strandopdrachten gebruikt;
- [ ] beloningsscherm verschijnt na de ronde;
- [ ] voortgang per kindprofiel wordt opgeslagen;
- [ ] dashboard oefenobservaties toont;
- [ ] portrait en landscape goed werken op telefoon;
- [ ] er geen officiele testscore of diagnoseclaim zichtbaar is.
