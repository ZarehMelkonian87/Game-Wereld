# Zeg & Bouw Binnen Luister & Plaats MVP Scope

Dit document legt Fase 9.0 vast voor de spraakgestuurde bediening binnen de bestaande `Luister & Plaats` scene-builder.

## Doel

`Zeg & Bouw` is geen los nieuw spel. Het is dezelfde strandscene en dezelfde gameplay als `Luister & Plaats`, maar de richting wordt omgedraaid:

- Normaal: de app zegt een opdracht en het kind plaatst het plaatje.
- Nieuwe stand: het kind zegt een opdracht en de app plaatst het plaatje.

Het kind maakt zelf een korte Nederlandse plaatszin. De app luistert, herkent het object en de plaats, en plaatst daarna hetzelfde stickerobject in dezelfde strandscene.

Voorbeeld:

1. Het kind tikt op de microfoon.
2. Het kind zegt: `Zet de boot in de zee.`
3. De app toont: `Ik hoorde: Zet de boot in de zee.`
4. De app plaatst de boot in de zee.
5. Het kind kan de plek nog aanpassen.
6. Het kind tikt op `Klaar`.
7. Feedback: `Mooi gezegd! De boot vaart in de zee. +1 Speed!`

## Productbesluit

`Zeg & Bouw` wordt geen apart spel met een andere layout. Het wordt een spraakbediening binnen de bestaande `Luister & Plaats` scene-builder.

Redenen:

- Het kind moet in dezelfde scene blijven, met dezelfde objecttray, dezelfde strandachtergrond en dezelfde geplaatste stickers.
- De logopedische kern blijft hetzelfde: scene bouwen met plaatjes en plaatsbegrippen.
- De nieuwe functie voegt actieve taal toe: het kind geeft zelf de opdracht.
- De microfoonknop en transcript-feedback komen als extra laag in de bestaande scene-builder.
- We voorkomen dat het voelt als een totaal ander spel.

Naam in de UI: `Zeg zelf`.

Interne actie/stand voor implementatie: `speak-and-place`.

## Eerste MVP

De eerste versie blijft klein en controleerbaar.

In scope:

- Strandwereld.
- Bestaande strandachtergrond.
- Bestaande strandobjecten.
- Bestaande scene-zones.
- Bestaande `Luister & Plaats` layout.
- Bestaande objecttray.
- Bestaande plaatsing en verstelbare stickerpositie.
- Korte Nederlandse zinnen.
- Een object per zin.
- Een plaats of zone per zin.
- Spraakherkenning via browser-API waar beschikbaar.
- Fallback als spraakherkenning niet beschikbaar is.
- Positieve feedback.
- Verstelbare objectpositie voordat het resultaat telt.
- Oefenobservaties opslaan, geen diagnose.

Niet in scope:

- Officiele testscore.
- Uitspraakscore.
- Grammaticale beoordeling.
- Lange vrije verhalen.
- Meerdere opdrachten in een zin.
- Audio-opnames bewaren.
- AI-cloudparser.
- Automatische vergelijking met CELF Preschool of PPVT.

## Ondersteunde Objecten

De MVP gebruikt alleen de objecten die al in de strandwereld zitten:

- dolfijn
- boot
- vuurtoren
- vliegtuig
- vlieger
- bal
- parasol
- schelp / schelpen
- krab
- zandkasteel
- handdoek
- zon

## Ondersteunde Plaatsbegrippen

De MVP ondersteunt eerst deze plaatsbegrippen:

- in
- op
- onder
- boven
- naast
- tussen
- links
- rechts
- midden
- dichtbij
- ver weg

De eerste implementatie mag de moeilijke begrippen `tussen`, `dichtbij` en `ver weg` herkennen, maar hoeft ze nog niet perfect automatisch te positioneren. Bij lage zekerheid toont de game eerst een keuze of hint.

## Ondersteunde Zones

De parser koppelt woorden aan bestaande scenezones:

- zee / water
- strand / zand
- lucht / hemel
- eiland
- links
- rechts
- midden

Voorbeeldkoppelingen:

- `in de zee` -> zeezone
- `op het strand` -> strandzone
- `boven de zee` -> luchtzone boven zee
- `op het eiland` -> eilandzone
- `links op het strand` -> linker strandgebied

## Eerste Zinpatronen

De parser moet in de MVP vooral korte, voorspelbare zinnen begrijpen:

- `Zet de [object] in de [zone].`
- `Zet de [object] op de [zone].`
- `Leg de [object] op de [zone].`
- `Plaats de [object] naast de [object].`
- `Zet de [object] boven de [zone].`
- `Zet de [object] onder de [object].`
- `Zet de [object] links.`
- `Zet de [object] rechts.`

Ook korte kindzinnen moeten later vriendelijk verwerkt worden:

- `Boot zee.`
- `Bal strand.`
- `Dolfijn in water.`

Deze korte vormen krijgen minder zekerheid en vragen sneller om bevestiging.

## Feedbackregels

De game corrigeert nooit hard. De feedback moet het kind helpen om opnieuw te proberen of de zin aan te vullen.

Goed herkend:

- `Mooi gezegd! De boot vaart in de zee. +1 Speed!`
- `Goed verteld! De bal ligt op het strand. +1 Speed!`
- `Knappe zin! De vlieger vliegt boven het strand. +1 Speed!`

Object herkend, plek mist:

- `Ik hoorde boot. Waar moet de boot komen?`
- `Goed woord! Zeg nu ook waar de bal moet liggen.`

Plek herkend, object mist:

- `Ik hoorde zee. Welk plaatje moet in de zee?`

Niet goed verstaan:

- `Ik kon het niet goed horen. Probeer het nog eens rustig.`

Onduidelijk of meerdere mogelijkheden:

- `Goed geprobeerd. Bedoel je de boot of de dolfijn?`
- `Bedoel je op het strand of in de zee?`

## Observatiedata

De app bewaart oefendata, geen diagnose. Audio wordt niet opgeslagen.

Per poging bewaren:

- profiel-id
- wereld-id
- modus: `speak-and-place`
- transcript, alleen als tekst en alleen als observatie
- herkend object
- herkend plaatsbegrip
- herkende zone
- parserzekerheid: `hoog`, `twijfel`, `hulp nodig`
- of het object automatisch geplaatst werd
- of het kind de positie handmatig aanpaste
- aantal spraakpogingen
- aantal hints
- of ouder/logopedist hielp
- verdiende speed
- verdiende woordsterren
- datum/tijd

Dashboardlabels:

- zelf gemaakte zinnen
- actief benoemde woorden
- gebruikte plaatsbegrippen
- zinnen zonder hulp
- zinnen met hulp
- opnieuw geprobeerd
- nog oefenen

## Privacy En Toestemming

Voor de eerste echte implementatie moet de app een korte oudermelding tonen voordat de microfoon wordt gebruikt.

Concepttekst:

`Deze oefening gebruikt de microfoon om korte Nederlandse zinnen te herkennen. We bewaren geen geluidsopnames. De app kan wel oefenobservaties bewaren, zoals welk woord geoefend is en of hulp nodig was.`

Knop:

`Ik begrijp het`

Technische regel:

- De app moet eerst browser-support detecteren.
- Als spraakherkenning niet beschikbaar is, blijft de modus bruikbaar met een fallback.
- Voor testen op telefoon moet later gecontroleerd worden of een secure context of HTTPS nodig is.

## UI-Richting

De UI volgt de bestaande app-stijl:

- pastelkleuren
- stickerstijl
- grote microfoonknop
- geen drukke tekst
- altijd zichtbare hintknop
- scene blijft het grootste element
- transcript in korte statusbubble
- bevestiging met `Klaar`
- tweede actie met `Opnieuw zeggen`

Basislayout:

- Boven: compacte HUD met sterren, speed en terugknop.
- Midden: dezelfde strandscene uit `Luister & Plaats`.
- Onder: dezelfde objecttray als fallback en correctie.
- Extra laag: microfoonknop bij de opdrachtbubble of onderin naast `Klaar`.
- Er komt geen aparte statusbubble naast de opdracht; de opdracht en statusinformatie blijven compact rond de bestaande game-UI.

Belangrijk: de tijdelijke `?preview=ui` pagina is alleen een technische component-preview. Dat is niet het echte spelontwerp.

## Technische Richting

Voorgestelde nieuwe onderdelen:

- `logic/speech-recognition.ts`
- `logic/spoken-command-parser.ts`
- `logic/scene-command-executor.ts`
- `components/ui/VoiceCommandButton.tsx`
- Integratie in `SceneBuilderScreen.tsx`
- Later eventueel kleine scene-builder subcomponenten als de file verder opgesplitst wordt.

Nieuwe screen-componenten moeten dezelfde standaard volgen als de recente schermen:

- kleine arrow-function componenten
- logische folderstructuur
- `displayName`
- `data-component`
- leesbaar in DevTools

## Acceptatie Voor Fase 9.0

- [x] De modusnaam is vastgelegd.
- [x] De functie blijft binnen dezelfde `Luister & Plaats` scene-builder.
- [x] De MVP is beperkt tot de strandwereld.
- [x] De MVP gebruikt korte zinnen met een object en een plaats.
- [x] De MVP gebruikt bestaande objecten en zones.
- [x] Feedbackregels zijn vastgelegd.
- [x] Observatiedata is vastgelegd.
- [x] Privacyrichting en oudermelding zijn vastgelegd.
- [x] De functie blijft een oefenmodus en geen toets.
