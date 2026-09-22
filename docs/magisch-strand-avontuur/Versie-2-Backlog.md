# 📋 Versie 2 — wat nog niet gebouwd is

> Alles wat bedacht, ontworpen of gewenst is maar **niet** in de huidige game zit. De rest van het dossier beschrijft uitsluitend wat er wél is. Niets hieruit is nodig om de huidige versie af te maken.

| Veld                  | Waarde                   |
| :-------------------- | :----------------------- |
| **Laatst bijgewerkt** | 2026-09-22               |
| **Status**            | Backlog — nog te plannen |

## Overzicht

| Taak                                                                                                      | Prioriteit | Omvang                     |
| :-------------------------------------------------------------------------------------------------------- | :--------- | :------------------------- |
| [V2-01 Zeg & Bouw: plaatsen t.o.v. objecten](#v2-01--zeg--bouw-plaatsen-ten-opzichte-van-andere-objecten) | hoog       | middel                     |
| [V2-06 iOS als geïnstalleerde app](#v2-06--ios-als-geïnstalleerde-app--spraak-meten-en-zo-nodig-oplossen) | hoog       | meten → klein/middel/groot |
| [V2-02 Sterren uit Zeg & Vlieg](#v2-02--zeg--vlieg-draagt-sterren-bij-aan-het-profieltotaal)              | midden     | klein                      |
| [V2-04 Eigen UX voor desktop](#v2-04--eigen-ux-voor-de-desktopbrowser)                                    | midden     | middel                     |
| [V2-05 Regressie over alle viewports](#v2-05--regressieverificatie-over-alle-viewports)                   | midden     | middel                     |
| [V2-03 Meer content en werelden](#v2-03--meer-content-woorden-werelden-en-opdrachten)                     | laag       | groot                      |
| [V2-07 Wachttijd na spreken op Android](#v2-07--wachttijd-na-het-spreken-op-android)                      | laag       | onderzoek                  |
| [V2-08 Audio-reactieve wave op mobiel](#v2-08--audio-reactieve-wave-op-mobiel)                            | laag       | onderzoek                  |
| [V2-09 Twee kleine testgaten](#v2-09--twee-kleine-testgaten)                                              | laag       | klein                      |

---

## 1. Gameplay

### V2-01 · Zeg & Bouw: plaatsen ten opzichte van andere objecten

**Wat ontbreekt:** de samengestelde parser plaatst objecten op **benoemde zones**. Een relatie of volgorde ten opzichte van andere **objecten** wordt niet berekend: "zet de bal **tussen** de schelp en de handdoek" wordt niet correct uitgevoerd, en "tussen" wordt in deze modus niet begrepen.

**Waarom haalbaar:** de bouwsteen bestaat al voor Zeg & Zet (ankerobjecten + echte `op`/`naast`/`tussen`/`dichtbij`-evaluatie). Het werk is die logica naar het compound-pad uitbreiden, inclusief volgorde ("A tussen B en C").

**Prioriteit:** hoog binnen v2 — dit kwam uit een echte speeltest.

### V2-02 · Zeg & Vlieg draagt sterren bij aan het profieltotaal

**Wat ontbreekt:** Zeg & Vlieg kent een score, combo en record per ronde, maar levert géén ⭐ op voor het cumulatieve profieltotaal. De drie andere modi doen dat wel. Wie veel vliegt, ziet zijn beloningen dus niet opschuiven.

**Aandachtspunt:** de modus is de laatste in de leerlijn; sterren daar moeten de unlock-curve niet ontregelen.

### V2-03 · Meer content: woorden, werelden en opdrachten

**Wat ontbreekt:** één wereld (strand) met 12 woorden, 16 plaatsingsopdrachten, 12 quizvragen en 5 bouwkaarten. De structuur is uitbreidbaar zonder codewijziging; er is alleen nog geen tweede wereld.

**Bij uitbreiding nodig:** nieuwe stickers (WebP, 30–50 kB) en instructievideo's (480p), plus zones en aliassen per wereld.

---

## 2. Platform

### V2-04 · Eigen UX voor de desktopbrowser

**Wat ontbreekt:** telefoon en tablet hebben een eigen, ontworpen layout; de desktopversie draait nog op de bestaande layout met streaming (geen download-gate). Er is geen apart desktopontwerp gemaakt of doorgevoerd.

**Werkwijze:** eerst samen een ontwerp, dan pas bouwen — zoals bij telefoon en tablet.

### V2-05 · Regressieverificatie over alle viewports

**Wat ontbreekt:** een automatische verificatie die per viewport (telefoon, tablet, desktop) bewijst dat de gate, de portret-guard en de gameplay zich gedragen zoals bedoeld. Nu draait de e2e-suite op één tabletviewport; desktopgedrag wordt handmatig gecontroleerd.

### V2-06 · iOS als geïnstalleerde app — spraak meten en zo nodig oplossen

**Taak.** Vaststellen of de spraakherkenning werkt wanneer de game op een iPhone of iPad **vanaf het beginscherm** is gestart (geïnstalleerde PWA), en op basis daarvan de oplossing kiezen en bouwen.

**Waarom:** op de iPhone is spraak bevestigd **in Safari**. De geïnstalleerde variant is niet apart gemeten, en Apple heeft de spraak-API in beginscherm-apps lange tijd niet aangeboden (WebKit-bug 225298, jarenlang zonder fix). Zolang dat onbekend is, weten we niet of een kind dat de app op het beginscherm zet ineens zonder spraak zit.

**Stap 1 — meten (klein).** Op iPhone én iPad: app op het beginscherm zetten, openen, _Instellingen → Microfoon-diagnose_ doorlopen (vier stappen) en het rapport bewaren. Noteer de iOS-versie en of Dicteren aanstaat.

**Stap 2 — oplossing kiezen, afhankelijk van de uitkomst:**

| Uitkomst                                    | Oplossing                                                                                                                                               | Omvang |
| :------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :----- |
| Werkt gewoon                                | Niets bouwen; het rapport in de Test-matrix vastleggen                                                                                                  | klein  |
| API ontbreekt of de sessie blijft hangen    | **A.** Spraakmodi op iOS in Safari laten draaien: een duidelijke "Open in Safari"-knop bij de microfoon, of de app op iOS niet als standalone aanbieden | middel |
| Idem, en het beginscherm-icoon moet blijven | **B.** Eigen spraakherkenning in de browser via WebAssembly (Nederlands model ±40 MB, offline, past binnen de download-gate)                            | groot  |

Cloud-spraakherkenning valt in beide gevallen af: die botst met de belofte dat er geen opnames het apparaat verlaten, en met offline spelen.

**Klaar wanneer:** er per iOS-variant een diagnoserapport is, de keuze is vastgelegd in [ADR-006](../architectuur/adr-006-spraakherkenning.md), en een kind op iOS elke spraakmodus kan spelen — of een begrijpelijke uitleg krijgt hoe dat wél kan.

---

## 3. Verfijning

### V2-07 · Wachttijd na het spreken op Android

**Wat speelt:** na de laatste lettergreep duurt het 1–2 seconden voordat Android het definitieve resultaat geeft. Dat voelt als "er gebeurt niets". Dit is het gedrag van de herkenner zelf; korter maken kan alleen door eerder te verwerken, met meer kans op halve zinnen.

**Mogelijke richting:** tussentijdse voortgang duidelijker tonen, of de stiltetimer per platform ijken met echte kinderen.

### V2-08 · Audio-reactieve wave op mobiel

**Wat ontbreekt:** op telefoon en tablet toont de wave een luister-animatie in plaats van het echte stemvolume, omdat een eigen microfoonopname daar de spraakherkenner blokkeert. Een alternatief (bijvoorbeeld volumeniveaus afleiden uit de herkenner zelf) is niet onderzocht.

### V2-09 · Twee kleine testgaten

- **Drag-and-drop** in Zeg & Zet werkt en is handmatig bevestigd, maar heeft nog geen eigen e2e-test (slepen is lastig te automatiseren).
- **Terugkerend profiel**: dat sterren en unlocks bewaard blijven is gedekt via de opslagtests, maar niet als eigen doorlopende reis.

---

## 4. Andere games in de catalogus

**Groot Circus-Avontuur** staat in de code en in de catalogus als "Binnenkort beschikbaar": de modi zijn er, maar de game is niet af en niet getest voor kinderen. **Taal & Lezen**, **Rekenen & Getallen** en **Wereldoriëntatie** zijn vergrendelde zones met een placeholder.

Dit dossier beschrijft uitsluitend Magisch Strand-Avontuur. Wordt Groot Circus-Avontuur opgepakt, dan verdient die game een eigen dossier in dezelfde opzet.
