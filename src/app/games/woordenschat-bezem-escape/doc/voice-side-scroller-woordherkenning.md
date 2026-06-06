# Zeg & Vlieg: Woordherkenning

Dit document beschrijft Fase 4 van de nieuwe side-scroller. De game gebruikt Nederlandse spraakherkenning als oefenmechaniek, niet als officiele toets of diagnose.

## Doel

Het kind vliegt met stemvolume en zegt het actieve strandwoord wanneer het object verschijnt. Als het woord wordt herkend, verzamelt de game het object en krijgt het kind `+1 Speed` en een woordster.

## MVP-Woorden

| Doelwoord | Uitspraakvarianten en synoniemen |
| --- | --- |
| boot | boot, bootje, zeilboot, schip |
| krab | krab, krabben |
| dolfijn | dolfijn, dolfin, dolfijnen |
| schelp | schelp, schelpje, schelpen, schelpjes |
| bal | bal, strandbal, beachbal |
| parasol | parasol, strandparasol |
| zon | zon, zonnetje |

## Gameplay-Regel

1. Het actieve object licht op.
2. De opdracht toont `Zeg: [woord]`.
3. De app luistert kort naar Nederlandse spraak.
4. Bij een herkenning wordt het object verzameld.
5. Bij onduidelijke herkenning krijgt het kind vriendelijke feedback en kan de opdracht opnieuw worden gestart met `Herhaal`.

## Vriendelijke Correctie

De game zegt niet hard dat iets fout is. De feedback blijft oefengericht:

- `Goed gehoord: boot. +1 Speed!`
- `Bijna. Ik hoorde "..." . Zeg rustig: boot.`
- `Ik hoorde nog geen woord. Probeer het nog eens rustig.`

## Technische Keuze

De side-scroller hergebruikt `useDutchSpeechRecognition`. De woordmatch zit in `voiceSideScrollerWords.ts`, zodat de matching later per wereld kan worden uitgebreid zonder de UI of engine aan te passen.

Stemvolume en woordherkenning zijn bewust gescheiden:

- `useVoiceSideScrollerMicrophone` stuurt de vlieghoogte.
- `useVoiceSideScrollerWordRecognition` controleert het actieve objectwoord.

## Acceptatie

- De eerste demo herkent boot, krab, dolfijn, schelp, bal, parasol en zon.
- Synoniemen en kind-uitspraakvarianten staan vastgelegd.
- Het actieve woord kan opnieuw worden beluisterd of geprobeerd met de herhaalknop.
- Correcte herkenning geeft `+1 Speed` en een ster.
- Onduidelijke herkenning geeft vriendelijke hulp, geen game-over.
