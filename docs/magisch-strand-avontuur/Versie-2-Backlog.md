# 📋 Versie 2 — wat nog niet gebouwd is

> Alles wat bedacht, ontworpen of gewenst is maar **niet** in de huidige game zit. De rest van het dossier beschrijft uitsluitend wat er wél is. Niets hieruit is nodig om de huidige versie af te maken.

| Veld                  | Waarde                   |
| :-------------------- | :----------------------- |
| **Laatst bijgewerkt** | 2026-09-22               |
| **Status**            | Backlog — nog te plannen |

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

### V2-06 · iOS als geïnstalleerde app

**Wat ontbreekt:** bevestiging dat de spraakherkenning werkt in een iOS-app die vanaf het beginscherm is gestart. Op de iPhone is spraak in Safari bevestigd; Apple heeft de spraak-API in beginscherm-apps lange tijd niet beschikbaar gesteld.

**Als het niet blijkt te werken, zijn de opties:** de spraakmodi op iOS in Safari laten draaien (met een "open in Safari"-knop), of eigen spraakherkenning in de browser via WebAssembly (bv. een Nederlands model van ±40 MB, offline, past in de download-gate). Cloud-spraakherkenning valt af: dat botst met de belofte dat er geen opnames de deur uitgaan.

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
