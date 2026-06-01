# Zeg En Bouw Takenlijst

Doel: de bestaande `Luister & Plaats` scene-builder uitbreiden met een spraakbediening waarin het kind zelf een Nederlandse zin uitspreekt, bijvoorbeeld `Zet de boot in de zee.`, waarna de game de zin begrijpt en het object zelf in dezelfde scene plaatst.

Deze functie is bedoeld als oefening voor actieve taal, zinsbouw, woordenschat en plaatsbegrippen. Het is geen test, geen diagnose en geen vervanging van logopedische beoordeling.

## Kernidee

- Het kind blijft in dezelfde strandscene als `Luister & Plaats`.
- Het kind kiest of hoort in deze stand geen opdracht van de app.
- Het kind maakt zelf een korte zin.
- De app probeert de zin te herkennen.
- De app haalt uit de zin:
  - welk object genoemd wordt;
  - welk plaatsbegrip genoemd wordt;
  - waar het object moet komen.
- De game plaatst het object automatisch in de scene.
- Het kind krijgt positieve feedback en kan de zin eventueel verbeteren.

Voorbeeldflow:

1. Kind tikt op de microfoonknop.
2. Kind zegt: `Zet de boot in de zee.`
3. Game toont kort: `Ik hoorde: Zet de boot in de zee.`
4. Game plaatst de boot in de zee.
5. Feedback: `Mooi gezegd! De boot vaart in de zee. +1 Speed!`

Belangrijk: de tijdelijke `?preview=ui` pagina is alleen een technische test voor de microfoonknop. Het echte spel moet dezelfde layout en gameplay houden als `Luister & Plaats`.

## Harde Regels

- [ ] Mobile-first bouwen.
- [ ] Werken in portrait en landscape.
- [ ] Microfoonknop groot en duidelijk maken.
- [ ] Nooit zeggen dat het kind fout praat.
- [ ] Geen harde game-over gebruiken.
- [ ] Geen officiele CELF- of PPVT-scoring gebruiken.
- [ ] Geen diagnoseclaims tonen.
- [ ] Geen audio opslaan.
- [ ] Alleen transcript en oefenobservaties opslaan als dat nodig is.
- [ ] Ouder/logopedist moet kunnen zien dat dit oefendata is, geen testdata.
- [ ] Spraakherkenning moet een duidelijke fallback hebben als de browser het niet ondersteunt.
- [ ] Voor mobiel testen met microfoon rekening houden met HTTPS of secure context.

## Fase 9.0: Ontwerp En Scope Vastleggen

Resultaat: zie `speak-and-place-scope.md`. Correctie na visuele review: `Zeg & Bouw` wordt geen los scherm of ander spel, maar een spraakbediening binnen dezelfde `Luister & Plaats` scene-builder.

- [x] Nieuwe functienaam vastleggen: `Zeg zelf` binnen `Luister & Plaats`.
- [x] Bepalen dat de functie direct in de bestaande scene-builder komt, niet als apart spel.
- [x] Eerste MVP beperken tot de strandwereld.
- [x] Eerste MVP beperken tot korte zinnen met 1 object en 1 plaats.
- [x] Eerste MVP beperken tot bestaande objecten en zones.
- [x] Bepalen welke feedbackteksten gebruikt worden.
- [x] Bepalen welke observatiedata bewaard wordt.
- [x] Bepalen hoe ouder/logopedist toestemming of uitleg krijgt over microfoongebruik.

Acceptatie:

- [x] Er is een duidelijke MVP-scope.
- [x] De functie blijft oefening en geen toets.
- [x] De functie gebruikt alleen bestaande strandcontent.

## Fase 9.1: Spraakherkenning Basis

Resultaat: basis staat in `logic/speech-recognition.ts`, `hooks/useDutchSpeechRecognition.ts`, `components/ui/VoiceCommandButton.tsx` en `components/ui/VoiceCommandStatus.tsx`. De knop is tijdelijk technisch te proberen via de UI-preview met `?preview=ui`; dat is niet het definitieve game-scherm.

- [x] Browser support detecteren voor `SpeechRecognition` en `webkitSpeechRecognition`.
- [x] Nederlandse taal instellen: `nl-NL`.
- [x] Een kleine speech-recognition wrapper maken.
- [x] Start luisteren via microfoonknop.
- [x] Stop luisteren automatisch na een korte zin.
- [x] Toon luisterstatus: luisteren, verwerken, klaar, niet ondersteund.
- [x] Toon het herkende transcript kindvriendelijk en kort.
- [x] Voeg fallback toe: ouder kan de zin handmatig kiezen of opnieuw laten proberen.

Acceptatie:

- [x] Op desktop werkt de microfoonknop waar ondersteund.
- [x] Op mobiel verschijnt een nette melding als microfoon of browser niet geschikt is.
- [x] De app crasht niet als spraakherkenning ontbreekt.

Notitie: een echte gesproken microfoontest op telefoon blijft onderdeel van Fase 9.8, omdat de lokale netwerkmodus mogelijk HTTPS nodig heeft.

## Fase 9.2: Nederlandse Zinparser

Resultaat: zie `logic/spoken-command-parser.ts`. De parser herkent objecten, plaatsbegrippen, zones, ankervoorwerpen en zekerheid, maar plaatst nog niets in de scene. Dat gebeurt pas in Fase 9.3.

- [x] Parser maken voor korte Nederlandse opdrachten.
- [x] Transcript normaliseren: kleine letters, leestekens weg, extra spaties weg.
- [x] Objectwoorden herkennen:
  - [x] dolfijn
  - [x] boot / bootje / zeilboot
  - [x] vuurtoren
  - [x] vliegtuig
  - [x] vlieger
  - [x] bal
  - [x] parasol
  - [x] schelp / schelpen
  - [x] krab
  - [x] zandkasteel
  - [x] handdoek
  - [x] zon
- [x] Plaatswoorden herkennen:
  - [x] in
  - [x] op
  - [x] onder
  - [x] boven
  - [x] naast
  - [x] tussen
  - [x] links
  - [x] rechts
  - [x] midden
  - [x] dichtbij
  - [x] ver weg
- [x] Scenezones herkennen:
  - [x] zee / water
  - [x] strand / zand
  - [x] lucht / hemel
  - [x] eiland
  - [x] links
  - [x] rechts
  - [x] midden
- [x] Parserresultaat teruggeven met object, plaatsbegrip, zone en zekerheid.
- [x] Onvolledige zinnen herkennen, bijvoorbeeld alleen `boot zee`.
- [x] Onduidelijke zinnen netjes markeren als `hulp nodig`.

Acceptatie:

- [x] `Zet de boot in de zee.` wordt herkend als boot + in + zee.
- [x] `Leg de bal op het strand.` wordt herkend als bal + op + strand.
- [x] `Zet de vlieger boven het strand.` wordt herkend als vlieger + boven + strand/lucht.
- [x] Onduidelijke zinnen veroorzaken geen verkeerde automatische actie zonder controle.

## Fase 9.3: Automatisch Plaatsen In De Scene

Resultaat: zie `logic/scene-command-executor.ts`. De executor zet een parserresultaat om naar een plaatsbare pending sticker in dezelfde `Luister & Plaats` scene. Voor technische QA kan dit tijdelijk getest worden met `?screen=scene-builder&spokenCommandPreview=Zet%20de%20boot%20in%20de%20zee`.

- [x] Executor maken die parserresultaat omzet naar een scene-placement.
- [x] Object plaatsen op het centrum van de juiste zone.
- [x] Plaatsing visueel laten landen met zachte animatie.
- [x] Het geplaatste object blijft hetzelfde stickerbeeld, geen checkmark.
- [x] Het kind kan de positie nog aanpassen voor bevestiging.
- [x] Knop toevoegen: `Klaar`.
- [x] Knop toevoegen: `Opnieuw zeggen`.
- [x] Bij lage zekerheid eerst keuze tonen: `Bedoelde je boot?`
- [x] Bij meerdere mogelijke zones keuze tonen: `Bedoelde je zee of strand?`

Acceptatie:

- [x] Correct herkende zin plaatst het juiste object.
- [x] Object snapt niet verplicht naar een vreemd centrum als het kind de positie wijzigt.
- [x] Het kind kan de plaatsing corrigeren voordat de opdracht definitief telt.

## Fase 9.4: UI Voor Zeg & Bouw

Resultaat: de bestaande `SceneBuilderScreen` heeft nu een compacte `Zeg zelf` microfoonknop naast de opdrachtbubble. De strandscene, objecttray, HUD, speedbar en `Klaar` flow blijven hetzelfde.

- [x] Geen aparte andere game-layout maken.
- [x] Bestaande `SceneBuilderScreen` uitbreiden met een `Zeg zelf` stand.
- [x] De strandscene, objecttray, HUD, speedbar en `Klaar` flow behouden.
- [x] Microfoonknop altijd zichtbaar maken.
- [x] Audio/hintknoppen niet laten concurreren met microfoon.
- [x] Korte statusbubble maken:
  - [x] `Zeg een zin.`
  - [x] `Ik luister...`
  - [x] `Ik hoorde: ...`
  - [x] `Wil je dit zo plaatsen?`
- [x] Geen lange uitlegtekst tonen aan het kind.
- [x] Hulpknop uitleg laten geven: `Zeg bijvoorbeeld: Zet de boot in de zee.`
- [x] Portrait layout testen.
- [x] Landscape layout testen.

Acceptatie:

- [x] Kind ziet duidelijk wat hij moet doen.
- [x] UI blijft dezelfde game als `Luister & Plaats`.
- [x] Er is geen overlap met tray, HUD of scene.

## Fase 9.5: Vriendelijke Correctie En Hints

Resultaat: `scene-command-executor.ts` geeft nu veilige feedback per situatie en `SceneBuilderScreen` toont de juiste visuele hint: object in de tray of zone in de scene.

- [x] Feedback maken voor goed herkende zin.
- [x] Feedback maken voor bijna goed.
- [x] Feedback maken voor niet verstaan.
- [x] Feedback maken voor onbekend woord.
- [x] Feedback maken voor ontbrekende plek.
- [x] Feedback maken voor ontbrekend object.
- [x] Nooit alleen `fout` tonen.
- [x] Voorbeeldzinnen aanbieden als hulp.
- [x] Visuele hint tonen op object of zone.

Voorbeeldteksten:

- [x] `Mooi gezegd! Ik hoorde: Zet de boot in de zee.`
- [x] `Ik hoorde de boot. Waar moet de boot komen?`
- [x] `Bijna! Ik hoorde boot en zee. Zeg ook een plaatswoord, zoals in of op.`
- [x] `Ik kon het niet goed horen. Probeer het nog eens rustig.`
- [x] `Goed geprobeerd. Ik ken dat woord nog niet in deze strandwereld.`

Acceptatie:

- [x] Feedback voelt veilig en positief.
- [x] Het kind krijgt altijd een nieuwe kans.
- [x] Hints helpen zonder de opdracht direct over te nemen.

## Fase 9.6: Speed, Beloning En Voortgang

Resultaat: gesproken opdrachten worden nu als oefenobservatie opgeslagen onder modus `zeg-en-bouw`, met aparte speed-beloning voor zelf gemaakte zinnen.

- [x] +1 Speed geven voor herkende objectnaam.
- [x] +1 Speed geven voor herkend plaatsbegrip.
- [x] +1 Speed geven voor correcte plaatsing.
- [x] +2 Speed mogelijk maken voor volledige zelfstandige zin zonder hulp.
- [x] Geen straf bij niet verstaan.
- [x] Oefenevent opslaan met modus `zeg-en-bouw`.
- [x] Transcript optioneel opslaan als observatie, niet als audio.
- [x] Bewaren of het kind hulp nodig had.
- [x] Bewaren welk object actief benoemd werd.
- [x] Bewaren welk plaatsbegrip actief gebruikt werd.
- [x] Bewaren of de app de zin automatisch kon uitvoeren.

Dashboardvelden:

- [x] Zelf gemaakte zinnen.
- [x] Actief benoemde woorden.
- [x] Gebruikte plaatsbegrippen.
- [x] Zinnen zonder hulp.
- [x] Zinnen met hulp.
- [x] Niet verstaan / opnieuw geprobeerd.

Acceptatie:

- [x] Dashboard toont oefenobservaties, geen diagnose.
- [x] Ouders/logopedist kunnen zien welke woorden en begrippen spontaan gebruikt zijn.

## Fase 9.7: Privacy En Mobiele Techniek

Resultaat: de app toont nu bij eerste microfoongebruik een privacyuitleg, bewaart geen audio en biedt een typ-fallback wanneer spraakherkenning niet beschikbaar is. De mobiele testafspraken staan in `phase-9-7-privacy-mobile-tech.md`.

- [x] Uitleg toevoegen dat microfoon alleen gebruikt wordt voor deze oefening.
- [x] Geen geluidsopnames bewaren.
- [x] Bij eerste gebruik een oudervriendelijke melding tonen.
- [x] Feature-detectie en QA-plan voor Android Chrome vastleggen.
- [x] Feature-detectie en QA-plan voor iPhone Safari vastleggen.
- [x] Fallback bepalen voor browsers zonder goede ondersteuning.
- [x] Lokale netwerk-test met mobiel voorbereiden.
- [x] HTTPS-dev optie onderzoeken voor microfoontoegang op telefoon.
- [ ] Documenteren hoe we lokaal testen met telefoon.

Acceptatie:

- [ ] De functie is veilig uit te leggen aan ouders.
- [ ] De app heeft een fallback als spraakherkenning niet beschikbaar is.
- [ ] Mobiele testvoorwaarden zijn duidelijk.

## Fase 9.8: QA En Acceptatie

- [ ] Testen met 10 voorbeeldzinnen.
- [ ] Testen met korte zinnen.
- [ ] Testen met zinnen met uitspraakvariatie.
- [ ] Testen met achtergrondgeluid.
- [ ] Testen in portrait.
- [ ] Testen in landscape.
- [ ] Testen op kleine telefoon.
- [ ] Testen dat objecten niet buiten beeld vallen.
- [ ] Testen dat geplaatste objecten verstelbaar blijven.
- [ ] Testen dat voortgang correct wordt opgeslagen.
- [ ] Build draaien.
- [ ] Browser smoke test uitvoeren.

Acceptatie:

- [ ] Kind kan zelf een zin zeggen.
- [ ] Game kan minstens de basiszinnen automatisch uitvoeren.
- [ ] Onduidelijke zinnen worden veilig afgehandeld.
- [ ] De modus voelt als spel, niet als toets.

## Eerste Voorbeeldzinnen Voor De MVP

- [ ] `Zet de boot in de zee.`
- [ ] `Zet de dolfijn in de zee.`
- [ ] `Leg de bal op het strand.`
- [ ] `Zet de vuurtoren op het eiland.`
- [ ] `Zet de vlieger boven het strand.`
- [ ] `Zet het vliegtuig boven de zee.`
- [ ] `Leg de schelpen op het strand.`
- [ ] `Zet de krab op de handdoek.`
- [ ] `Zet het zandkasteel naast de schelpen.`
- [ ] `Zet de parasol op het strand.`

## Niet In De Eerste MVP

- [ ] Vrije lange verhalen automatisch begrijpen.
- [ ] Meerdere stappen in een zin automatisch uitvoeren.
- [ ] Volledige grammaticale beoordeling.
- [ ] Uitspraakscore geven.
- [ ] Officiele testvergelijking of normscore.
- [ ] Audio-opnames bewaren.
- [ ] AI-cloudparser gebruiken zonder apart privacybesluit.
