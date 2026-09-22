# ADR-006 — Spraakherkenning via de Web Speech API

**Status:** geaccepteerd · **Datum:** 2026-09-22

## Context

Spraak is de kern van de game. Er zijn drie realistische opties: de Web Speech API van de browser, een eigen model in de browser via WebAssembly (bijvoorbeeld een Nederlands Vosk-model van ±40 MB), of spraakherkenning in de cloud.

Een eerdere eigen "on-device" heuristiek bleek geen echte herkenning te doen (ze gaf vrijwel altijd hetzelfde woord terug) en is verwijderd.

## Besluit

**De Web Speech API**, benaderd via één runtime-laag (`createBrowserSpeechRecognition`), met Nederlands (`nl-NL`) en per modus eigen instellingen.

Cloud-spraakherkenning valt af: die botst met de belofte dat er geen opnames het apparaat verlaten en met offline spelen. WebAssembly blijft achter de hand voor het geval een platform de API niet biedt.

**Drie mobiel-vaste regels**, gevonden door meten op toestel en vastgelegd met tests:

1. **De herkenner is de enige eigenaar van de microfoon.** Geen ander onderdeel opent tegelijk een `getUserMedia`-stream. De audio-reactieve golfanimatie doet dat nog wel op desktop, maar op telefoon en tablet niet: daar deelt de herkenner de microfoon niet met een WebRTC-opname en krijgt hij stilte.
2. **Een leeg resultaat is geen "geen match".** Android stuurt bij het begin van spreken resultaten zonder tekst; die worden genegeerd. Alleen een echt `nomatch`-event telt.
3. **"Definitief" zonder zekerheid geldt als tussentijds.** Android markeert in continue modus elk tussenresultaat als definitief met zekerheid 0 en voegt het als nieuw segment toe. Zonder correctie plakt de app de tussenstanden aan elkaar ("zet zet zet de …") of verwerkt ze het eerste woord al als hele zin.

**Altijd een gelijkwaardig alternatief.** Elke gesproken opdracht is ook via tikken, slepen of typen uit te voeren, met dezelfde parser en dezelfde oefenuitkomst. Een geweigerde microfoon is een capabilitystatus met uitleg, geen blokkade.

**Diagnose in de app.** Het microfoon-diagnosescherm toont per toestel de omgeving, of de API aanwezig is, de toestemmingsstatus en wat de herkenner per stap teruggeeft — inclusief een watchdog die een hangende sessie zichtbaar maakt.

## Openstaand

Of de API beschikbaar is in een **vanaf het beginscherm geïnstalleerde iOS-app** is nog niet gemeten; Apple heeft die lange tijd niet aangeboden. Zie de taak in de [Versie 2-backlog](../magisch-strand-avontuur/Versie-2-Backlog.md).

## Gevolgen

Geen modeldownload, geen servertkosten en echte herkenning in alle geteste browsers. De prijs is afhankelijkheid van browserverschillen — vandaar dat de drie regels hierboven met tests zijn vastgelegd.
