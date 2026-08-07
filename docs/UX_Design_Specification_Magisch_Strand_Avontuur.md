# COMPLETE GAME UX/UI SPECIFICATION DOCUMENT (ALL 9 SCREENS)
## Magisch Strand Avontuur
### Gestandaardiseerde Interface Componenten, Naming Conventions, Gameplay Flows & Modal Specificatie

---

### Metadata
- **Projectnaam:** Magisch Strand Avontuur
- **Document Versie:** v2.0 (Volledige Schermspecificatie - 9 Schermen)
- **Auteur:** Senior Game UX/UI Designer & Technical Product Owner
- **Aantal Schermen:** 9 Unieke Schermen & Modals (Menu's, Modals, Gameplay, Overlays)
- **Doelgroep:** Game Developers, UI/UX Designers, Edu-Tech Content Creators, QA Testers
- **Bestandsloctie (.docx):** [UX_Design_Specification_Magisch_Strand_Avontuur.docx](file:///Users/melkonian/git/Game-Wereld/docs/UX_Design_Specification_Magisch_Strand_Avontuur.docx)

---

## 1. Inleiding & UX Ontwerpprincipes

Dit document bevat het volledige en geharmoniseerde User Experience (UX) en User Interface (UI) ontwerpdocument voor alle **9 schermen en overlays** van Magisch Strand Avontuur. 

Met alle menu's, gameplay-omgevingen, instructiemodals, invoeroverlays en beloningsschermen vastgelegd in gestandaardiseerde tabellen, vormt dit de definitieve blauwdruk voor ontwikkeling, design-systemen en test-acceptatie.

### Kernprincipes van Magisch Strand Avontuur UX
1. **Kindvriendelijke Ergonomie:** Knoppen hebben een minimale touch-target van `48x48dp` met duidelijke, herkenbare iconografie.
2. **Directe Multimodale Feedback:** Elk interactief element reageert visueel (schaalverandering/pulse op click) en auditief (klank/click sound effect).
3. **Multimodale Invoer:** Ondersteuning voor gesproken antwoorden (microfoon), slepen & neerzetten (drag & drop) en tekstinvoer (toetsenbord overlay).
4. **Inclusiviteit & Privacy:** Geen bewaarde spraakopnames, opties voor rustige beweging (reduced motion) en directe toegankelijkheid.

---

## 2. Gestandaardiseerde UI Naming Conventions

Om verwarring in de codebase en het design-systeem te voorkomen, hanteren we een gestandaardiseerde prefix-structuur voor alle UI-onderdelen in de applicatie:

| Prefix | Component Type | Voorbeeld ID |
| :--- | :--- | :--- |
| **SCR_** | Scherm / View | `SCR_MAIN_TITLE`, `SCR_ZEG_ZET_GAME` |
| **BTN_** | Interactieve Knop | `BTN_PRIMARY_PLAY`, `BTN_ACTION_KLAAR` |
| **CARD_** | Selectie-, Modal- of Informatiekaart | `CARD_GAME_ZEG_ZET`, `CARD_MODAL_KEYBOARD` |
| **TOGGLE_** | Aan/Uit Schakelaar | `TOGGLE_AUDIO`, `TOGGLE_REDUCED_MOTION` |
| **DSP_** | Weergave / Statusteller | `DSP_STAR_COUNTER`, `DSP_DISTANCE_COUNTER` |
| **TTL_** | Titel / Header Capsule | `TTL_HEADER_PILL`, `TTL_MODAL_TITLE` |
| **INFOBOX_** | Melding / Waarschuwingsvak | `INFOBOX_SPEECH_STATUS`, `INFOBOX_VIDEO_ERROR` |
| **CANVAS_** | Interactief Spelveld / Substraat | `CANVAS_BEACH_OCEAN`, `CANVAS_FLIGHT_ARENA` |
| **TRAY_** | Asset Palet / Keuzebalk | `TRAY_STICKER_PALETTE` |
| **DOCK_** | Onderste Actie- / Navigatiebalk | `DOCK_SELECTION_FOOTER`, `DOCK_FLIGHT_CONTROLS` |

---

## 3. Scherm 1: Hoofdscherm / Titelmenu (`SCR_MAIN_TITLE`)

Het Hoofdscherm dient als de primaire landingspagina van Magisch Strand Avontuur. Het zet direct een vrolijke, uitnodigende sfeer neer met het merklogo, het hoofdpersonage op de vliegende strandbezem, en snelle toegang tot de spelstart en instellingen.

| Element Code Name | Visuele Naam | Functionaliteit & Omschrijving | Visuele Stijl | Doel / Actie |
| :--- | :--- | :--- | :--- | :--- |
| **BTN_NAV_BACK** | Terug Knop | Sluit de game en keert terug naar de overkoepelende app-omgeving. | Witte cirkel knop met donkere pijl-links | Navigate Back |
| **BTN_AUDIO_TOGGLE_QUICK** | Snelle Audio Knop | Schakelt audio/geluid direct in of uit vanuit het hoofdscherm. | Witte cirkel knop met luidspreker-icoon | Toggle Audio |
| **DSP_STAR_COUNTER** | Sterrenteller | Toont het huidige aantal verzamelde beloningssterren van de speler (bijv. 120). | Witte capsule pil met gouden rand en ster | Read Only Display |
| **BTN_SETTINGS_GEAR** | Instellingen Knop | Opent het uitgebreide instellingen- en privacy-menu. | Gele afgeronde knop met donker tandwiel | Open `SCR_SETTINGS_PRIVACY` |
| **IMG_GAME_LOGO** | Titel Logo | Visueel logo 'MAGISCH STRAND AVONTUUR' met 3D-effecten en strandthema. | Gele/Blauwe 3D typografie met decoratie | Visual Branding |
| **IMG_HERO_CHARACTER** | Mascotte Illustratie | Hero-illustratie van de jongen op de vliegende strandbezem met de regenboogster. | Kleurrijke karakter-art op strandachtergrond | Visual Engagement |
| **BTN_PRIMARY_PLAY** | Spelen Knop | Hoofdactieknop om het spel te starten en het avontuur te kiezen. | Grote groen-gebolde pilknop met Play-icoon | Open `SCR_ADVENTURE_SELECT` |

---

## 4. Scherm 2: Spel Selectiescherm / Kies Avontuur (`SCR_ADVENTURE_SELECT`)

In het Spel Selectiescherm kiest de speler uit drie beschikbare minigames / leermodi. Elke spelkaart is voorzien van een eigen icoon, titel, korte instructietoelichting en interactie-indicator.

| Element Code Name | Visuele Naam | Functionaliteit & Omschrijving | Visuele Stijl | Doel / Actie |
| :--- | :--- | :--- | :--- | :--- |
| **BTN_NAV_BACK** | Terug Knop | Navigeert terug naar het Hoofdscherm. | Witte cirkel knop met pijl-links | Open `SCR_MAIN_TITLE` |
| **TTL_HEADER_PILL** | Header Titel | Schermtitel capsule met de tekst 'Kies avontuur'. | Witte afgeronde pill-header | Static Title |
| **DSP_STAR_COUNTER** | Sterrenteller | Toont actueel aantal verdiende sterren (120). | Witte capsule pil met ster | Read Only Display |
| **LBL_SECTION_TITLE** | Sectielabel | Subtitel boven de spellijst: 'Kies spel'. | Donkergrijze vetgedrukte tekst | Section Divider |
| **CARD_GAME_ZEG_ZET** | Spelkaart: Zeg & Zet | Selecteert de luister-, spreek- of typ-opdracht minigame. Subtitel: *'Luister, spreek of typ en zet het plaatje op de goede plek.'* | Witte afgeronde kaart met groene rand, spreekwolk-icoon & radio-selectie | Select Minigame 1 |
| **CARD_GAME_KIES_WOORD** | Spelkaart: Kies het Woord | Selecteert de meervoudige keuze minigame. Subtitel: *'Hoor een woord en kies het juiste plaatje.'* | Witte kaart met lichtblauwe rand, boek-icoon & pijl-rechts | Select Minigame 2 |
| **CARD_GAME_ZEG_VLIEG** | Spelkaart: Zeg & Vlieg | Selecteert de spraakgestuurde bezem-vlieggame. Subtitel: *'Vlieg met je stem en zeg het strandwoord.'* | Zachtgele kaart met gouden rand, microfoon/bezem-icoon & pijl-rechts | Select Minigame 3 |
| **BTN_PRIMARY_START** | Start Spel Knop | Start direct de op dat moment geselecteerde minigame. | Brede groene knop onderaan met Play-icoon | Launch Active Game |
| **BTN_SECONDARY_REWARD** | Beloning Knop | Navigeert naar het resultatenoverzicht en het stickerboek. | Creme knop met gele rand en cadeau-icoon | Open `SCR_REWARD_SUMMARY` |
| **BTN_SECONDARY_OPTIONS** | Opties Knop | Opent het instellingenmenu voor geluid, hints en devtools. | Witte knop met blauwe/grijze rand en tandwiel | Open `SCR_SETTINGS_PRIVACY` |

---

## 5. Scherm 3: Instellingen & Privacy Menu (`SCR_SETTINGS_PRIVACY`)

Het Instellingenscherm biedt volledige controle over de audio, spraakbegeleiding, animatie-intensiteit, ontwikkelopties (DevTools) en transparante microfoon-toestemmingen voor spraakherkenning.

| Element Code Name | Visuele Naam | Functionaliteit & Omschrijving | Visuele Stijl | Doel / Actie |
| :--- | :--- | :--- | :--- | :--- |
| **BTN_NAV_MENU** | Menu Knop | Sluit het instellingenscherm en keert terug naar de vorige pagina. | Witte pilknop met pijl-links en tekst 'Menu' | Return to Sender |
| **TTL_HEADER_PILL** | Header Titel | Schermtitel capsule met de tekst 'Instellingen'. | Witte afgeronde capsule header | Static Title |
| **TOGGLE_AUDIO** | Audio Schakelaar | Schakelt gesproken opdrachten en video-audio in/uit. | Witte kaart met luidspreker-icoon en groene Toggle Switch (Aan) | Toggle Audio State |
| **TOGGLE_MUSIC** | Muziek Schakelaar | Schakelt de achtergrondmuziek in/uit. | Witte kaart met muzieknoot-icoon en grijze Toggle Switch (Uit) | Toggle BGM State |
| **TOGGLE_HINTS** | Hints Schakelaar | Schakelt mascottesubsidie en automatische hints in/uit. | Witte kaart met lamp-icoon en groene Toggle Switch (Aan) | Toggle Hint System |
| **TOGGLE_REDUCED_MOTION** | Rustige Beweging Toggle | Vermindert animaties en pulse-effecten voor rustige ervaring. | Witte kaart met oog-kruis icoon en grijze Toggle Switch (Uit) | Toggle Accessibility |
| **TOGGLE_DEVTOOLS** | Zone Editor Toggle | Opent interactieve zone-locatie editor voor ontwikkelaars. | Witte kaart met sleutel-icoon en grijze Toggle Switch (Uit) | Developer Mode |
| **CARD_PRIVACY_SECTION** | Privacy Container | Gele achtergrondkaart met schild-icoon die alle microfooninformatie bundelt. | Gele afgeronde container met schild-icoon 'Microfoon en privacy' | Grouping Container |
| **LBL_PRIVACY_DESC** | Privacy Uitleg | Omschrijving: *'De microfoon wordt alleen gebruikt om korte zinnen naar tekst om te zetten.'* | Donkergrijze tekst onder privacy-titel | Informational Text |
| **DROPDOWN_PRIVACY_FAQ** | FAQ Dropdown | Uitklapbare knop: *'Waarom gebruiken we de microfoon?'* met pijl-omlaag. | Lichtblauwe pilknop met dropdown pijl | Toggle FAQ Details |
| **INFOBOX_SPEECH_STATUS** | Status Infoblok | Blauw vak: *'Spraakherkenning is beschikbaar. Als spraak niet werkt op telefoon, typ dezelfde zin.'* | Lichtblauw afgerond vak met telefoon-icoon | Status Notification |
| **INFOBOX_PERMISSION_NOTICE** | Toestemming Infoblok | Geel vak: *'Deze pagina mag een browser-popup voor microfoontoestemming tonen.'* | Lichtgeel vak met oranje rand | Permission Alert |
| **BTN_MIC_RECHECK** | Controleer Opnieuw Knop | Herstart de spraakherkenningstest en vraagt opnieuw browser-toestemming. | Groene brede knop met microfoon-icoon | Trigger Mic Permission |
| **LBL_MIC_INSTRUCTION** | Instructietekst | Ondersteunende tekst: *'Tik op de knop om microfoontoegang te vragen.'* | Kleine grijze instructietekst | Instructional Label |
| **INFOBOX_MIC_BLOCKED_ALERT** | Geblokkeerd Waarschuwing | Waarschuwingsvak onderaan: *'Microfoon is geblokkeerd. Zet microfoontoegang aan in de browserinstellingen...'* | Oranje/Rood omrand waarschuwingsvak | Error State Alert |

---

## 6. Scherm 4: Beloning & Resultaten Scherm (`SCR_REWARD_SUMMARY`)

Het Beloningsscherm wordt getoond na het voltooien van een sessie of bij het openen van het stickeroverzicht. Het geeft gedetailleerde feedback op de geleverde prestatie, verzamelde stickers, geoefende woorden en verdiende beloningssterren.

| Element Code Name | Visuele Naam | Functionaliteit & Omschrijving | Visuele Stijl | Doel / Actie |
| :--- | :--- | :--- | :--- | :--- |
| **TTL_HEADER_PILL** | Header Titel | Schermtitel capsule met de tekst 'Beloning'. | Witte afgeronde capsule header | Static Title |
| **CARD_REWARD_SHOWCASE** | Sticker Showcase Kaart | Centraal kader dat de verdiende sticker (Schelp Sticker) en regenboog-ster badge toont. | Creme achtergrond met gele rand en sticker-illustratie | Reward Showcase |
| **DSP_STICKER_PROGRESS_PILL** | Sticker Voortgangsbadge | Toont de voortgang van de stickerverzameling ('0/30' met ster-icoon). | Gele afgeronde pil met ster-icoon | Progress Indicator |
| **LBL_STICKER_NAME** | Sticker Naam Label | Tekstlabel onder de stickerweergave: 'Schelp Sticker'. | Vetgedrukte donkere tekst | Item Identification |
| **STAT_BOX_GOED** | Statistiek: GOED | Toont het aantal foutloos beantwoorde vragen ('GOED: 0'). | Lichtgroene capsule pil met groene rand | Score Counter |
| **STAT_BOX_TEMPO** | Statistiek: TEMPO | Toont de behaalde snelheidsbonuspuntenscore ('TEMPO: +0'). | Lichtblauwe capsule pil met blauwe rand | Speed Bonus Counter |
| **STAT_BOX_HINTS** | Statistiek: HINTS | Toont het aantal geraadpleegde hints tijdens de sessie ('HINTS: 0'). | Lichtoranje capsule pil met oranje rand | Assist Counter |
| **STAT_BOX_AUDIO** | Statistiek: AUDIO | Toont het aantal keren dat geluid/opdracht is herhaald ('AUDIO: 0'). | Witte capsule pil met grijze rand | Audio Replay Counter |
| **STAT_BOX_STERREN** | Statistiek: STERREN | Toont het totale aantal netto gewonnen beloningssterren ('STERREN: +0'). | Zachtgouden capsule pil met gouden rand | Total Currency Awarded |
| **SEC_WORDS_PRACTICED** | Woorden Sectie | Overzicht van geoefende woorden. Status: 'nog geen woorden'. | Titel met pill-tag 'nog geen woorden' | Vocabulary Summary |
| **SEC_SPATIAL_WORDS** | Plaatswoorden Sectie | Overzicht van geoefende ruimtelijke plaatswoorden. Status: 'nog geen plaatswoorden'. | Titel met pill-tag 'nog geen plaatswoorden' | Grammar/Spatial Summary |
| **BANNER_REWARD_SUMMARY** | Beloning Samenvatting | Onderste trofee-banner: 'Beloning: Schelp Sticker' met trofee-icoon. | Gele afgeronde banner met trofee-icoon | Reward Highlight |
| **BTN_ACTION_REPLAY** | Opnieuw Knop | Herstart direct de zojuist gespeelde minigame of sessie. | Groene capsule knop met refresh-icoon | Replay Session |
| **BTN_ACTION_WORLD** | Wereld Knop | Navigeert naar de overkoepelende Wereldkaart van Game-Wereld. | Groene capsule knop met wereldbol-icoon | Open World Map |
| **BTN_ACTION_MENU** | Menu Knop | Navigeert terug naar het Hoofdscherm (`SCR_MAIN_TITLE`). | Groene capsule knop met home-icoon | Open Main Menu |

---

## 7. Scherm 5: Zeg & Vlieg Start & Instructie Modal (`SCR_ZEG_VLIEG_START`)

Dit scherm opent als instructie-modal voordat de spreek- en vliegopdracht begint. Het toont de spelregels, de te noemen doelwoorden, een privacygarantie en besturingsknoppen.

| Element Code Name | Visuele Naam | Functionaliteit & Omschrijving | Visuele Stijl | Doel / Actie |
| :--- | :--- | :--- | :--- | :--- |
| **BTN_NAV_HOME** | Home Knop | Verlaat de minigame en keert terug naar het avontuur-selectiescherm. | Afgeronde vierkante knop met home-icoon | Exit to Menu |
| **DSP_DISTANCE_COUNTER** | Afstandsbar | Toont de afgelegde afstand en het doel (bijv. 'Afstand 0m', progress bar `0/100`). | Blauwe capsule met voortgangsbalk | Distance Tracker |
| **DSP_LEVEL_TROPHY_BADGE** | Level & Score Badge | Toont trofeebadge '0', sterren '0' en actueel level 'Level 1'. | Blauwe pil met trofee en sterren-icoon | Score & Level Display |
| **CARD_MODAL_ZEG_VLIEG_START** | Instructie Card Modal | Centraal wit venster met de instructies en instellingen van Zeg & Vlieg. | Witte kaart met afgeronde hoeken en schaduw | Instruction Container |
| **BADGE_MODAL_STAR_HEADER** | Ster Mascotte Header | Badge met vrolijke regenboogster-mascotte boven de titel. | Gele afgeronde vierkante badge | Visual Mascot Header |
| **TTL_MODAL_TITLE** | Modal Titel | Titel van de minigame: 'Zeg & Vlieg'. | Donkerblauwe vetgedrukte titel | Minigame Title |
| **LBL_MODAL_INSTRUCTION** | Instructietekst | Spelregels: *'Vlieg zo ver mogelijk. Noem plaatjes die je ziet. Raak geen obstakel.'* | Donkergrijze instructietekst | Game Objective |
| **CONTAINER_TARGET_WORDS** | Doelwoorden Container | Verzameling van te noemen strandwoorden met ster-iconen. | Raster van gele pil-tags met sterren | Target Vocabulary List |
| **CHIP_WORD_TAGS** | Doelwoord Chips | Individuele chips: *'parasol'*, *'zon'*, *'schelp'*, *'dolfijn'*, *'krab'*, *'boot'*, *'bal'*. | Gele capsules met ster-icoon en tekst | Vocabulary Tag Item |
| **INFOBOX_PRIVACY_NOTE** | Privacy Garantiestempel | Groene pil met schild-icoon: *'We slaan geen opname op.'* | Groen afgerond vak met schild-icoon | Privacy Assurance |
| **BTN_PRIMARY_START_FLY** | Start Knop | Start direct de actieve vlieg-gameplay (`SCR_ZEG_VLIEG_ACTIVE`). | Grote brede groene knop met Play-icoon | Launch Flight Gameplay |
| **PANEL_FLY_CONTROLS_OVERLAY** | Onderste Besturingsbalk | Informatiekaart 'Zeg & Vlieg' met actieknoppen voor handmatige besturing. | Witte en gele containers onderaan | Flight Controls Footer |
| **BTN_MANUAL_FLY_UP** | Omhoog Knop | Beweegt de strandbezem handmatig omhoog als spraak niet wordt gebruikt. | Groene knop met pijl-omhoog | Manual Flight UP |
| **BTN_MANUAL_FLY_DOWN** | Omlaag Knop | Beweegt de strandbezem handmatig omlaag. | Groene knop met pijl-omlaag | Manual Flight DOWN |

---

## 8. Scherm 6: Kies het Woord Quiz Gameplay (`SCR_KIES_WOORD_GAME`)

Een interactieve luister- en kiesquiz waarbij kinderen de gesproken vraag horen (bijv. *"Waar is de krab?"*) en uit grote afbeeldingenkaarten het juiste antwoord aantikken.

| Element Code Name | Visuele Naam | Functionaliteit & Omschrijving | Visuele Stijl | Doel / Actie |
| :--- | :--- | :--- | :--- | :--- |
| **BTN_NAV_BACK** | Terug Knop | Verlaat de quiz en keert terug naar het spel-selectiescherm. | Witte cirkel knop met pijl-links | Navigate Back |
| **BTN_AUDIO_TOGGLE** | Audio Knop | Schakelt gesproken vraag en geluidseffecten in of uit. | Blauwe cirkel knop met luidspreker-icoon | Toggle Audio |
| **DSP_STAR_COUNTER** | Sterrenteller | Toont actueel verdiende beloningssterren ('0'). | Gele capsule pil met ster | Score Display |
| **BTN_HINT_ASSIST** | Hint Knop | Vraagt een visuele/gesproken hint aan bij de mascotte. | Gele afgeronde knop met gloeilamp-icoon | Trigger Hint |
| **CARD_QUESTION_PROMPT** | Vraagstelling Card | Bovenvak met mascottesticker, de vraagtekst en herhaalknop. | Witte afgeronde container met schaduw | Question Banner |
| **IMG_MASCOT_SPEAKER** | Mascotte Badge | Illustratie van de sterrenfeemascotte die de vraag uitspreekt. | Ronde badge met regenboogster | Visual Speaker Badge |
| **LBL_QUESTION_TEXT** | Vraagtekst | Gesproken/geschreven vraag: *'Waar is de krab?'* | Donkerblauwe vetgedrukte vraagtekst | Question Prompt |
| **BTN_AUDIO_REPLAY_PROMPT** | Herhaal Audio Knop | Herhaalt het afspelen van de gesproken vraagzin. | Blauwe cirkel knop met luidspreker-icoon | Replay Question SFX |
| **GRID_CHOICE_CARDS** | Keuzekaarten Raster | Raster van grote afbeeldingenkaarten waar de speler uit kiest. | Kaartenraster (Dolfijn, Krab, Schelpen) | Answer Options Grid |
| **CARD_CHOICE_DOLPHIN** | Keuzekaart: Dolfijn | Afbeelding van een dolfijn (foutief antwoord bij 'krab'). | Witte kaart met grijze rand en illustratie | Option 1 Selection |
| **CARD_CHOICE_CRAB** | Keuzekaart: Krab | Afbeelding van een krab (correct antwoord op 'Waar is de krab?'). | Witte kaart met grijze rand en illustratie | Option 2 (Correct) |
| **CARD_CHOICE_SHELLS** | Keuzekaart: Schelpen | Afbeelding van schelpen en zeester (foutief antwoord). | Witte kaart met grijze rand en illustratie | Option 3 Selection |
| **FOOTER_QUIZ_PROGRESS** | Onderste Voortgangsbalk | Voortgangsbalk voor 'Tempo' (`0/10`) en beloningsvoortgang (`0/30` sterren). | Gele afgeronde balk met groene progressbar | Quiz Progress Footer |

---

## 9. Scherm 7: Zeg & Zet Drag & Drop Gameplay (`SCR_ZEG_ZET_GAME`)

In deze drag & drop minigame voert de speler ruimtelijke opdrachten uit (bijv. *"Zet de boot in de zee."*) door stickers vanuit de onderste paletbalk naar het strand te slepen.

| Element Code Name | Visuele Naam | Functionaliteit & Omschrijving | Visuele Stijl | Doel / Actie |
| :--- | :--- | :--- | :--- | :--- |
| **BTN_NAV_BACK** | Terug Knop | Verlaat de opdracht en keert terug naar het avontuurscherm. | Witte cirkel knop met pijl-links | Navigate Back |
| **DSP_STAR_COUNTER** | Sterrenteller | Toont actuele sterrenstand ('0'). | Gele capsule pil met ster | Score Display |
| **BTN_HINT_ASSIST** | Hint Knop | Toont waar het object geplaatst moet worden. | Gele knop met lamp-icoon | Trigger Placement Hint |
| **BTN_ACTION_KLAAR** | Klaar Knop | Valideert of de objecten op de juiste positie op het strand geplaatst zijn. | Groene knop met vinkje-icoon en tekst 'Klaar' | Validate Placement |
| **CARD_TASK_HEADER** | Opdracht Header Card | Container met de te voltooien instructie en microfoon/toetsenbord knoppen. | Witte afgeronde header met schaduw | Task Instruction Header |
| **LBL_TASK_SENTENCE** | Opdrachtzin | Instructie: *'Zet de boot in de zee.'* | Vetgedrukte instructietekst | Placement Directive |
| **BTN_TASK_AUDIO** | Microfoon Knop | Spreekt de opdracht in of luistert naar het antwoord. | Groene cirkel knop met microfoon-icoon | Voice Record Action |
| **BTN_TASK_KEYBOARD_TOGGLE** | Toetsenbord Knop | Opent het typ-modal voor handmatige tekstinvoer (`SCR_ZEG_ZET_KEYBOARD_OVERLAY`). | Blauwe cirkel knop met toetsenbord-icoon | Open Keyboard Modal |
| **CANVAS_BEACH_OCEAN_SCENE** | Interactieve Strandscene | Achtergrond met interactieve dropposities (zee, strand, palmeiland). | Kleurrijke strand- en zee-art met dropzones | Drag & Drop Canvas |
| **INFOBOX_VIDEO_ERROR_BANNER** | Fallback Melding | Staat toe dat bij videostoringen de audio of tekst gelezen kan worden. | Witte en gele afgeronde meldingskaart | Fallback Notification |
| **TRAY_STICKER_PALETTE** | Sticker Keuzebalk | Onderste carrousel met sleepbare objectstickers. | Zachtgele afgeronde palletbalk | Sticker Item Carousel |
| **STICKER_ITEMS** | Sleepbare Stickers | Stickers: Dolfijn, Boot, Vuurtoren, Vliegtuig, Vlieger. | Kleurrijke omrande afbeeldingen | Draggable Sticker Objects |
| **BTN_TRAY_NEXT** | Volgende Stickers Knop | Bladert naar de volgende set stickers in het palet. | Witte cirkel met pijl-rechts | Scroll Carousel |

---

## 10. Scherm 8: Zeg & Zet Typ de Zin Modal Overlay (`SCR_ZEG_ZET_KEYBOARD_OVERLAY`)

Een toegankelijkheids- overlay modal waarin kinderen of begeleiders de opdrachtzin handmatig kunnen intypen als spraakherkenning niet beschikbaar of gewenst is.

| Element Code Name | Visuele Naam | Functionaliteit & Omschrijving | Visuele Stijl | Doel / Actie |
| :--- | :--- | :--- | :--- | :--- |
| **CARD_MODAL_KEYBOARD_INPUT** | Typ Modal Container | Pop-up venster dat opent wanneer op de toetsenbordknop wordt getikt. | Witte afgeronde kaart met blauwe rand en schaduw | Modal Container |
| **BADGE_KEYBOARD_HEADER** | Toetsenbord Badge | Blauwe cirkel met toetsenbord-icoon bovenaan de modal. | Blauwe badge met toetsenbord-icoon | Modal Header Icon |
| **TTL_KEYBOARD_MODAL** | Modal Titel | Titel: *'TYP DE ZIN'*. | Donkerblauwe vetgedrukte titel | Modal Header Text |
| **LBL_KEYBOARD_EXAMPLE** | Voorbeeldtekst | Instructie: *'Bijvoorbeeld: Zet de boot in de zee.'* | Grijze instructietekst | Input Guidance |
| **INPUT_SENTENCE_FIELD** | Tekstinvoerveld | Invoerveld waarin de speler de zin kan typen (*'Zet de boot in de zee.'*). | Witte afgeronde rechthoek met blauwe rand | Text Input Field |
| **BTN_KEYBOARD_SUBMIT** | Gebruik Zin Knop | Bevestigt de getypte zin en verwerkt deze als antwoord. | Brede blauwe knop met witte tekst 'Gebruik zin' | Submit Input |
| **BTN_KEYBOARD_CLOSE** | Sluit Knop | Sluit de typ-overlay zonder de voerwijziging op te slaan. | Witte afgeronde knop met tekst 'Sluit' | Dismiss Modal |

---

## 11. Scherm 9: Zeg & Vlieg Actieve Vlieg Gameplay (`SCR_ZEG_VLIEG_ACTIVE`)

De arcade-vlieggame waarin de speler de strandbezem in de lucht bestuurt door geleerde strandwoorden in de microfoon uit te spreken (of de Omhoog/Omlaag knoppen te gebruiken) om obstakels zoals meeuwen en haaien te ontwijken.

| Element Code Name | Visuele Naam | Functionaliteit & Omschrijving | Visuele Stijl | Doel / Actie |
| :--- | :--- | :--- | :--- | :--- |
| **BTN_NAV_HOME** | Home Knop | Onderbreekt het vliegen en keert terug naar het menu. | Witte vierkante knop met home-icoon | Pause / Exit Game |
| **BAR_DISTANCE_PROGRESS** | Afstandsmeter | Toont gevlogen meters (*'Afstand 44m'*, geel gevulde balk `44/100`). | Blauwe capsule met gele progressbar | Realtime Progress |
| **DSP_FLIGHT_SCORE_BADGE** | Score & Level Badge | Toont trofee '44', sterren '0' en actueel level (*'Level 1'*). | Blauwe badge met trofee en ster-icoon | Flight Stats Display |
| **CANVAS_FLIGHT_ARENA** | Vlieg Arena Canvas | Scrollende 2D-wereld waarin het personage vliegt en obstakels ontwijkt. | Dynamische strand- en luchtomgeving | 2D Physics World |
| **SPRITE_FLYING_HERO** | Speler Personage | Jongen op de vliegende strandbezem (beweegt verticaal op spraak/knoppen). | Geanimeerde spraakgestuurde avatar | Player Avatar Sprite |
| **SPRITE_OBSTACLE_SEAGULL** | Obstakel: Meeuw | Vliegende meeuw in de lucht die ontweken moet worden. | Vogel sprite | Air Obstacle Hazard |
| **SPRITE_OBSTACLE_SHARK** | Obstakel: Haai | Springende haai uit het water. | Haai sprite met ster-item | Water Hazard |
| **SPRITE_COLLECTIBLE_ITEMS** | Verzamelbare Items | Sterren en strandballen die extra punten opleveren. | Glimmende sterren en strandbal sprites | Bonus Collectible |
| **SLIDER_HEIGHT_CONTROL** | Hoogte-indicator Slider | Verticale slider aan de rechterzijde die de actuele vlieghoogte toont. | Transparante balk met rode positie-indicator | Height Position Meter |
| **CARD_MIC_SPEECH_PROMPT** | Spraak Statusbalk | Kaart onderaan: *'Noem wat je ziet'* met microfoonstatus. | Witte afgeronde container met mascotte | Speech Recognition Dock |
| **BTN_FLY_UP** | Omhoog Knop | Handmatige besturingsknop om te stijgen. | Groene knop met pijl-omhoog 'Omhoog' | Manual Altitude UP |
| **BTN_FLY_DOWN** | Omlaag Knop | Handmatige besturingsknop om te dalen. | Groene knop met pijl-omlaag 'Omlaag' | Manual Altitude DOWN |

---

## 12. Component States & Geluidseffecten Matrix

| State Name | Visuele Transformatie | Audio Effect (SFX) | Haptische Feedback |
| :--- | :--- | :--- | :--- |
| **DEFAULT / IDLE** | Normale schaal 1.0x, standaard schaduw en helderheid. | Geen geluid | Geen trilling |
| **HOVER / FOCUS** | Subtiele vergroting (scale 1.05x), verhoogde schaduw, lichte glow. | Zachte hoorbare tick / pop | Geen trilling |
| **PRESSED / ACTIVE** | Gekrompen schaal (scale 0.95x), verlaagde schaduw (ingedrukt effect). | Helder geluidsklik `btn_click.mp3` | Lichte haptische tik (5ms) |
| **DISABLED / LOCKED** | 50% transparantie (opacity 0.5), slot-icoon overlay, geen hover-effect. | Foutgeluid `buzz_disabled.mp3` | Korte dubbele trilling |

---

## 13. Developer Architectuur: Mappenstructuur & Component Opsplitsing

Om de ontwikkelbaarheid en vindbaarheid voor developers te optimaliseren, zijn alle 9 schermen en hun sub-componenten opgesplitst in een modulaire componentenhiërarchie.

### 13.1 Voorgestelde Mappenstructuur (`src/app/games/magisch-strand-avontuur/`)

```text
src/app/games/magisch-strand-avontuur/
├── components/                             # Herbepaalbare Atomic UI Componenten
│   ├── ui/
│   │   ├── buttons/                        # BTN_* (Generieke & Navigatie Knoppen)
│   │   │   ├── BtnNavBack.tsx              # BTN_NAV_BACK
│   │   │   ├── BtnNavMenu.tsx              # BTN_NAV_MENU
│   │   │   ├── BtnNavHome.tsx              # BTN_NAV_HOME
│   │   │   ├── BtnAudioToggle.tsx          # BTN_AUDIO_TOGGLE / BTN_AUDIO_TOGGLE_QUICK
│   │   │   ├── BtnSettingsGear.tsx         # BTN_SETTINGS_GEAR
│   │   │   ├── BtnPrimaryPlay.tsx          # BTN_PRIMARY_PLAY / BTN_PRIMARY_START
│   │   │   ├── BtnSecondary.tsx            # BTN_SECONDARY_REWARD / BTN_SECONDARY_OPTIONS
│   │   │   ├── BtnAction.tsx               # BTN_ACTION_KLAAR / REPLAY / WORLD / MENU
│   │   │   └── BtnDirectional.tsx          # BTN_MANUAL_FLY_UP / DOWN / BTN_FLY_UP / DOWN
│   │   ├── displays/                       # DSP_* & BAR_* & SLIDER_* (Statustellers)
│   │   │   ├── DspStarCounter.tsx          # DSP_STAR_COUNTER
│   │   │   ├── DspDistanceCounter.tsx      # DSP_DISTANCE_COUNTER / BAR_DISTANCE_PROGRESS
│   │   │   ├── DspStickerProgress.tsx      # DSP_STICKER_PROGRESS_PILL
│   │   │   ├── DspFlightScore.tsx          # DSP_FLIGHT_SCORE_BADGE / DSP_LEVEL_TROPHY_BADGE
│   │   │   └── SliderHeightControl.tsx     # SLIDER_HEIGHT_CONTROL
│   │   ├── titles-badges/                  # TTL_* & BADGE_* & STAT_BOX_*
│   │   │   ├── TtlHeaderPill.tsx           # TTL_HEADER_PILL
│   │   │   ├── TtlModalTitle.tsx           # TTL_MODAL_TITLE / TTL_KEYBOARD_MODAL
│   │   │   ├── BadgeModalHeader.tsx        # BADGE_MODAL_STAR_HEADER / BADGE_KEYBOARD_HEADER
│   │   │   └── StatBoxPill.tsx             # STAT_BOX_GOED / TEMPO / HINTS / AUDIO / STERREN
│   │   ├── infoboxes/                      # INFOBOX_* (Meldingen & Privacy)
│   │   │   ├── InfoboxSpeechStatus.tsx     # INFOBOX_SPEECH_STATUS
│   │   │   ├── InfoboxPermission.tsx       # INFOBOX_PERMISSION_NOTICE / INFOBOX_MIC_BLOCKED_ALERT
│   │   │   ├── InfoboxPrivacyNote.tsx      # INFOBOX_PRIVACY_NOTE
│   │   │   └── InfoboxVideoError.tsx       # INFOBOX_VIDEO_ERROR_BANNER
│   │   └── inputs-toggles/                 # TOGGLE_* & INPUT_* & DROPDOWN_*
│   │       ├── ToggleSwitch.tsx            # TOGGLE_AUDIO / MUSIC / HINTS / REDUCED_MOTION / DEVTOOLS
│   │       ├── InputSentenceField.tsx      # INPUT_SENTENCE_FIELD
│   │       └── DropdownPrivacyFaq.tsx      # DROPDOWN_PRIVACY_FAQ
│   └── audio/                              # Geluidseffecten en Audio Management State
├── screens/                                # SCR_* (Schermen & Scherm-specifieke Features)
│   ├── start/                              # SCR_MAIN_TITLE (Scherm 1)
│   │   ├── MainTitleScreen.tsx
│   │   └── components/
│   │       ├── ImgGameLogo.tsx             # IMG_GAME_LOGO
│   │       └── ImgHeroCharacter.tsx        # IMG_HERO_CHARACTER
│   ├── adventure-select/                   # SCR_ADVENTURE_SELECT (Scherm 2)
│   │   ├── AdventureSelectScreen.tsx
│   │   └── components/
│   │       ├── CardGameZegZet.tsx          # CARD_GAME_ZEG_ZET
│   │       ├── CardGameKiesWoord.tsx       # CARD_GAME_KIES_WOORD
│   │       └── CardGameZegVlieg.tsx        # CARD_GAME_ZEG_VLIEG
│   ├── settings/                           # SCR_SETTINGS_PRIVACY (Scherm 3)
│   │   ├── SettingsPrivacyScreen.tsx
│   │   └── components/
│   │       └── CardPrivacySection.tsx      # CARD_PRIVACY_SECTION
│   ├── reward/                             # SCR_REWARD_SUMMARY (Scherm 4)
│   │   ├── RewardSummaryScreen.tsx
│   │   └── components/
│   │       ├── CardRewardShowcase.tsx      # CARD_REWARD_SHOWCASE
│   │       ├── BannerRewardSummary.tsx     # BANNER_REWARD_SUMMARY
│   │       └── SecWordsPracticed.tsx        # SEC_WORDS_PRACTICED / SEC_SPATIAL_WORDS
│   ├── word-choice/                        # SCR_KIES_WOORD_GAME (Scherm 6)
│   │   ├── WordChoiceScreen.tsx
│   │   └── components/
│   │       ├── CardQuestionPrompt.tsx      # CARD_QUESTION_PROMPT / LBL_QUESTION_TEXT
│   │       ├── GridChoiceCards.tsx          # GRID_CHOICE_CARDS / CARD_CHOICE_*
│   │       └── FooterQuizProgress.tsx       # FOOTER_QUIZ_PROGRESS
│   ├── scene-builder/                      # SCR_ZEG_ZET_GAME (Scherm 7 & 8)
│   │   ├── SceneBuilderScreen.tsx
│   │   └── components/
│   │       ├── CardTaskHeader.tsx          # CARD_TASK_HEADER / LBL_TASK_SENTENCE
│   │       ├── CanvasBeachOcean.tsx        # CANVAS_BEACH_OCEAN_SCENE
│   │       ├── TrayStickerPalette.tsx      # TRAY_STICKER_PALETTE / STICKER_ITEMS
│   │       └── ModalKeyboardInput.tsx      # SCR_ZEG_ZET_KEYBOARD_OVERLAY / CARD_MODAL_KEYBOARD_INPUT
│   └── voice-side-scroller/                # SCR_ZEG_VLIEG_START & SCR_ZEG_VLIEG_ACTIVE (Scherm 5 & 9)
│       ├── VoiceSideScrollerScreen.tsx
│       └── components/
│           ├── ModalZegVliegStart.tsx       # SCR_ZEG_VLIEG_START / CARD_MODAL_ZEG_VLIEG_START
│           ├── ContainerTargetWords.tsx      # CONTAINER_TARGET_WORDS / CHIP_WORD_TAGS
│           ├── CanvasFlightArena.tsx        # CANVAS_FLIGHT_ARENA
│           ├── SpritesFlightHazards.tsx      # SPRITE_FLYING_HERO / SEAGULL / SHARK / COLLECTIBLE
│           └── CardMicSpeechPrompt.tsx      # CARD_MIC_SPEECH_PROMPT
```

---

### 13.2 Complete Volledige Component-Lookup Matrix (Alle 9 Schermen)

Onderstaande tabel toont de exacte koppeling tussen de **UX Code Name** en het **Bestandspad / Component Naam** voor ontwikkelaars.

| UX Element Code Name | Scherm / Context | Component Type | Bestandspad | Component Exporter Naam |
| :--- | :--- | :--- | :--- | :--- |
| **SCR_MAIN_TITLE** | Scherm 1 | Screen View | `screens/start/MainTitleScreen.tsx` | `MainTitleScreen` |
| **BTN_NAV_BACK** | Schermen 1, 2, 6, 7 | Shared UI Button | `components/ui/buttons/BtnNavBack.tsx` | `BtnNavBack` |
| **BTN_AUDIO_TOGGLE_QUICK** | Scherm 1 | Shared UI Button | `components/ui/buttons/BtnAudioToggle.tsx` | `BtnAudioToggle` |
| **DSP_STAR_COUNTER** | Schermen 1, 2, 6, 7 | Shared UI Display | `components/ui/displays/DspStarCounter.tsx` | `DspStarCounter` |
| **BTN_SETTINGS_GEAR** | Scherm 1 | Shared UI Button | `components/ui/buttons/BtnSettingsGear.tsx` | `BtnSettingsGear` |
| **IMG_GAME_LOGO** | Scherm 1 | Feature Image | `screens/start/components/ImgGameLogo.tsx` | `ImgGameLogo` |
| **IMG_HERO_CHARACTER** | Scherm 1 | Feature Image | `screens/start/components/ImgHeroCharacter.tsx` | `ImgHeroCharacter` |
| **BTN_PRIMARY_PLAY** | Scherm 1 | Shared UI Button | `components/ui/buttons/BtnPrimaryPlay.tsx` | `BtnPrimaryPlay` |
| **SCR_ADVENTURE_SELECT** | Scherm 2 | Screen View | `screens/adventure-select/AdventureSelectScreen.tsx` | `AdventureSelectScreen` |
| **TTL_HEADER_PILL** | Schermen 2, 3, 4 | Shared UI Title | `components/ui/titles-badges/TtlHeaderPill.tsx` | `TtlHeaderPill` |
| **LBL_SECTION_TITLE** | Scherm 2 | Shared UI Label | `components/ui/titles-badges/TtlHeaderPill.tsx` | `LblSectionTitle` |
| **CARD_GAME_ZEG_ZET** | Scherm 2 | Feature Card | `screens/adventure-select/components/CardGameZegZet.tsx` | `CardGameZegZet` |
| **CARD_GAME_KIES_WOORD** | Scherm 2 | Feature Card | `screens/adventure-select/components/CardGameKiesWoord.tsx` | `CardGameKiesWoord` |
| **CARD_GAME_ZEG_VLIEG** | Scherm 2 | Feature Card | `screens/adventure-select/components/CardGameZegVlieg.tsx` | `CardGameZegVlieg` |
| **BTN_PRIMARY_START** | Scherm 2 | Shared UI Button | `components/ui/buttons/BtnPrimaryPlay.tsx` | `BtnPrimaryStart` |
| **BTN_SECONDARY_REWARD** | Scherm 2 | Shared UI Button | `components/ui/buttons/BtnSecondary.tsx` | `BtnSecondaryReward` |
| **BTN_SECONDARY_OPTIONS** | Scherm 2 | Shared UI Button | `components/ui/buttons/BtnSecondary.tsx` | `BtnSecondaryOptions` |
| **SCR_SETTINGS_PRIVACY** | Scherm 3 | Screen View | `screens/settings/SettingsPrivacyScreen.tsx` | `SettingsPrivacyScreen` |
| **BTN_NAV_MENU** | Schermen 3, 4 | Shared UI Button | `components/ui/buttons/BtnNavMenu.tsx` | `BtnNavMenu` |
| **TOGGLE_AUDIO** | Scherm 3 | Shared UI Switch | `components/ui/inputs-toggles/ToggleSwitch.tsx` | `ToggleAudio` |
| **TOGGLE_MUSIC** | Scherm 3 | Shared UI Switch | `components/ui/inputs-toggles/ToggleSwitch.tsx` | `ToggleMusic` |
| **TOGGLE_HINTS** | Scherm 3 | Shared UI Switch | `components/ui/inputs-toggles/ToggleSwitch.tsx` | `ToggleHints` |
| **TOGGLE_REDUCED_MOTION** | Scherm 3 | Shared UI Switch | `components/ui/inputs-toggles/ToggleSwitch.tsx` | `ToggleReducedMotion` |
| **TOGGLE_DEVTOOLS** | Scherm 3 | Shared UI Switch | `components/ui/inputs-toggles/ToggleSwitch.tsx` | `ToggleDevtools` |
| **CARD_PRIVACY_SECTION** | Scherm 3 | Feature Container | `screens/settings/components/CardPrivacySection.tsx` | `CardPrivacySection` |
| **LBL_PRIVACY_DESC** | Scherm 3 | Feature Label | `screens/settings/components/CardPrivacySection.tsx` | `LblPrivacyDesc` |
| **DROPDOWN_PRIVACY_FAQ** | Scherm 3 | Shared UI Control | `components/ui/inputs-toggles/DropdownPrivacyFaq.tsx` | `DropdownPrivacyFaq` |
| **INFOBOX_SPEECH_STATUS** | Scherm 3 | Shared UI Infobox | `components/ui/infoboxes/InfoboxSpeechStatus.tsx` | `InfoboxSpeechStatus` |
| **INFOBOX_PERMISSION_NOTICE**| Scherm 3 | Shared UI Infobox | `components/ui/infoboxes/InfoboxPermission.tsx` | `InfoboxPermissionNotice` |
| **BTN_MIC_RECHECK** | Scherm 3 | Shared UI Button | `components/ui/buttons/BtnMicRecheck.tsx` | `BtnMicRecheck` |
| **INFOBOX_MIC_BLOCKED_ALERT**| Scherm 3 | Shared UI Infobox | `components/ui/infoboxes/InfoboxPermission.tsx` | `InfoboxMicBlockedAlert` |
| **SCR_REWARD_SUMMARY** | Scherm 4 | Screen View | `screens/reward/RewardSummaryScreen.tsx` | `RewardSummaryScreen` |
| **CARD_REWARD_SHOWCASE** | Scherm 4 | Feature Card | `screens/reward/components/CardRewardShowcase.tsx` | `CardRewardShowcase` |
| **DSP_STICKER_PROGRESS_PILL**| Scherm 4 | Shared UI Display | `components/ui/displays/DspStickerProgress.tsx` | `DspStickerProgressPill` |
| **STAT_BOX_GOED** | Scherm 4 | Shared UI Stat | `components/ui/titles-badges/StatBoxPill.tsx` | `StatBoxGoed` |
| **STAT_BOX_TEMPO** | Scherm 4 | Shared UI Stat | `components/ui/titles-badges/StatBoxPill.tsx` | `StatBoxTempo` |
| **STAT_BOX_HINTS** | Scherm 4 | Shared UI Stat | `components/ui/titles-badges/StatBoxPill.tsx` | `StatBoxHints` |
| **STAT_BOX_AUDIO** | Scherm 4 | Shared UI Stat | `components/ui/titles-badges/StatBoxPill.tsx` | `StatBoxAudio` |
| **STAT_BOX_STERREN** | Scherm 4 | Shared UI Stat | `components/ui/titles-badges/StatBoxPill.tsx` | `StatBoxSterren` |
| **SEC_WORDS_PRACTICED** | Scherm 4 | Feature Section | `screens/reward/components/SecWordsPracticed.tsx` | `SecWordsPracticed` |
| **SEC_SPATIAL_WORDS** | Scherm 4 | Feature Section | `screens/reward/components/SecWordsPracticed.tsx` | `SecSpatialWords` |
| **BANNER_REWARD_SUMMARY** | Scherm 4 | Feature Banner | `screens/reward/components/BannerRewardSummary.tsx` | `BannerRewardSummary` |
| **BTN_ACTION_REPLAY** | Scherm 4 | Shared UI Button | `components/ui/buttons/BtnAction.tsx` | `BtnActionReplay` |
| **BTN_ACTION_WORLD** | Scherm 4 | Shared UI Button | `components/ui/buttons/BtnAction.tsx` | `BtnActionWorld` |
| **BTN_ACTION_MENU** | Scherm 4 | Shared UI Button | `components/ui/buttons/BtnAction.tsx` | `BtnActionMenu` |
| **SCR_ZEG_VLIEG_START** | Scherm 5 | Modal Screen | `screens/voice-side-scroller/components/ModalZegVliegStart.tsx` | `SCR_ZEG_VLIEG_START` |
| **BTN_NAV_HOME** | Schermen 5, 9 | Shared UI Button | `components/ui/buttons/BtnNavHome.tsx` | `BtnNavHome` |
| **DSP_DISTANCE_COUNTER** | Schermen 5, 9 | Shared UI Display | `components/ui/displays/DspDistanceCounter.tsx` | `DspDistanceCounter` |
| **DSP_LEVEL_TROPHY_BADGE** | Scherm 5 | Shared UI Badge | `components/ui/displays/DspFlightScore.tsx` | `DspLevelTrophyBadge` |
| **CARD_MODAL_ZEG_VLIEG_START**| Scherm 5 | Feature Modal Card | `screens/voice-side-scroller/components/ModalZegVliegStart.tsx` | `CardModalZegVliegStart` |
| **BADGE_MODAL_STAR_HEADER** | Schermen 5, 8 | Shared UI Badge | `components/ui/titles-badges/BadgeModalHeader.tsx` | `BadgeModalStarHeader` |
| **TTL_MODAL_TITLE** | Schermen 5, 8 | Shared UI Title | `components/ui/titles-badges/TtlModalTitle.tsx` | `TtlModalTitle` |
| **CONTAINER_TARGET_WORDS** | Scherm 5 | Feature Container | `screens/voice-side-scroller/components/ContainerTargetWords.tsx` | `ContainerTargetWords` |
| **CHIP_WORD_TAGS** | Scherm 5 | Feature Chip Item | `screens/voice-side-scroller/components/ContainerTargetWords.tsx` | `ChipWordTags` |
| **INFOBOX_PRIVACY_NOTE** | Scherm 5 | Shared UI Infobox | `components/ui/infoboxes/InfoboxPrivacyNote.tsx` | `InfoboxPrivacyNote` |
| **BTN_PRIMARY_START_FLY** | Scherm 5 | Shared UI Button | `components/ui/buttons/BtnPrimaryPlay.tsx` | `BtnPrimaryStartFly` |
| **PANEL_FLY_CONTROLS_OVERLAY**| Scherm 5 | Feature Overlay | `screens/voice-side-scroller/components/ModalZegVliegStart.tsx` | `PanelFlyControlsOverlay` |
| **BTN_MANUAL_FLY_UP** | Scherm 5 | Shared UI Controls | `components/ui/buttons/BtnDirectional.tsx` | `BtnManualFlyUp` |
| **BTN_MANUAL_FLY_DOWN** | Scherm 5 | Shared UI Controls | `components/ui/buttons/BtnDirectional.tsx` | `BtnManualFlyDown` |
| **SCR_KIES_WOORD_GAME** | Scherm 6 | Screen View | `screens/word-choice/WordChoiceScreen.tsx` | `WordChoiceScreen` |
| **BTN_AUDIO_TOGGLE** | Scherm 6 | Shared UI Button | `components/ui/buttons/BtnAudioToggle.tsx` | `BtnAudioToggle` |
| **BTN_HINT_ASSIST** | Schermen 6, 7 | Shared UI Button | `components/ui/buttons/BtnAction.tsx` | `BtnHintAssist` |
| **CARD_QUESTION_PROMPT** | Scherm 6 | Feature Banner | `screens/word-choice/components/CardQuestionPrompt.tsx` | `CardQuestionPrompt` |
| **IMG_MASCOT_SPEAKER** | Scherm 6 | Feature Badge | `screens/word-choice/components/CardQuestionPrompt.tsx` | `ImgMascotSpeaker` |
| **LBL_QUESTION_TEXT** | Scherm 6 | Feature Label | `screens/word-choice/components/CardQuestionPrompt.tsx` | `LblQuestionText` |
| **BTN_AUDIO_REPLAY_PROMPT** | Scherm 6 | Shared UI Button | `components/ui/buttons/BtnAudioToggle.tsx` | `BtnAudioReplayPrompt` |
| **GRID_CHOICE_CARDS** | Scherm 6 | Feature Grid | `screens/word-choice/components/GridChoiceCards.tsx` | `GridChoiceCards` |
| **CARD_CHOICE_DOLPHIN** | Scherm 6 | Feature Option | `screens/word-choice/components/GridChoiceCards.tsx` | `CardChoiceDolphin` |
| **CARD_CHOICE_CRAB** | Scherm 6 | Feature Option | `screens/word-choice/components/GridChoiceCards.tsx` | `CardChoiceCrab` |
| **CARD_CHOICE_SHELLS** | Scherm 6 | Feature Option | `screens/word-choice/components/GridChoiceCards.tsx` | `CardChoiceShells` |
| **FOOTER_QUIZ_PROGRESS** | Scherm 6 | Feature Footer | `screens/word-choice/components/FooterQuizProgress.tsx` | `FooterQuizProgress` |
| **SCR_ZEG_ZET_GAME** | Scherm 7 | Screen View | `screens/scene-builder/SceneBuilderScreen.tsx` | `SceneBuilderScreen` |
| **BTN_ACTION_KLAAR** | Scherm 7 | Shared UI Button | `components/ui/buttons/BtnAction.tsx` | `BtnActionKlaar` |
| **CARD_TASK_HEADER** | Scherm 7 | Feature Header | `screens/scene-builder/components/CardTaskHeader.tsx` | `CardTaskHeader` |
| **LBL_TASK_SENTENCE** | Scherm 7 | Feature Text | `screens/scene-builder/components/CardTaskHeader.tsx` | `LblTaskSentence` |
| **BTN_TASK_AUDIO** | Scherm 7 | Shared UI Button | `components/ui/buttons/BtnAudioToggle.tsx` | `BtnTaskAudio` |
| **BTN_TASK_KEYBOARD_TOGGLE** | Scherm 7 | Shared UI Button | `components/ui/buttons/BtnAction.tsx` | `BtnTaskKeyboardToggle` |
| **CANVAS_BEACH_OCEAN_SCENE** | Scherm 7 | Interactive Canvas| `screens/scene-builder/components/CanvasBeachOcean.tsx` | `CanvasBeachOceanScene` |
| **INFOBOX_VIDEO_ERROR_BANNER**| Scherm 7 | Shared UI Infobox | `components/ui/infoboxes/InfoboxVideoError.tsx` | `InfoboxVideoErrorBanner` |
| **TRAY_STICKER_PALETTE** | Scherm 7 | Feature Carousel | `screens/scene-builder/components/TrayStickerPalette.tsx` | `TrayStickerPalette` |
| **STICKER_ITEMS** | Scherm 7 | Feature Item | `screens/scene-builder/components/TrayStickerPalette.tsx` | `StickerItems` |
| **BTN_TRAY_NEXT** | Scherm 7 | Shared UI Button | `components/ui/buttons/BtnDirectional.tsx` | `BtnTrayNext` |
| **SCR_ZEG_ZET_KEYBOARD_OVERLAY**| Scherm 8 | Modal Overlay | `screens/scene-builder/components/ModalKeyboardInput.tsx` | `SCR_ZEG_ZET_KEYBOARD_OVERLAY` |
| **CARD_MODAL_KEYBOARD_INPUT**| Scherm 8 | Feature Modal Card | `screens/scene-builder/components/ModalKeyboardInput.tsx` | `CardModalKeyboardInput` |
| **BADGE_KEYBOARD_HEADER** | Scherm 8 | Shared UI Badge | `components/ui/titles-badges/BadgeModalHeader.tsx` | `BadgeKeyboardHeader` |
| **TTL_KEYBOARD_MODAL** | Scherm 8 | Shared UI Title | `components/ui/titles-badges/TtlModalTitle.tsx` | `TtlModalTitle` |
| **LBL_KEYBOARD_EXAMPLE** | Scherm 8 | Feature Text | `screens/scene-builder/components/ModalKeyboardInput.tsx` | `LblKeyboardExample` |
| **INPUT_SENTENCE_FIELD** | Scherm 8 | Shared UI Input | `components/ui/inputs-toggles/InputSentenceField.tsx` | `InputSentenceField` |
| **BTN_KEYBOARD_SUBMIT** | Scherm 8 | Shared UI Button | `components/ui/buttons/BtnPrimaryPlay.tsx` | `BtnKeyboardSubmit` |
| **BTN_KEYBOARD_CLOSE** | Scherm 8 | Shared UI Button | `components/ui/buttons/BtnSecondary.tsx` | `BtnKeyboardClose` |
| **SCR_ZEG_VLIEG_ACTIVE** | Scherm 9 | Screen View | `screens/voice-side-scroller/VoiceSideScrollerScreen.tsx`| `VoiceSideScrollerScreen` |
| **BAR_DISTANCE_PROGRESS** | Scherm 9 | Shared UI Progress| `components/ui/displays/DspDistanceCounter.tsx` | `BarDistanceProgress` |
| **DSP_FLIGHT_SCORE_BADGE** | Scherm 9 | Shared UI Display | `components/ui/displays/DspFlightScore.tsx` | `DspFlightScoreBadge` |
| **CANVAS_FLIGHT_ARENA** | Scherm 9 | 2D Game World | `screens/voice-side-scroller/components/CanvasFlightArena.tsx` | `CanvasFlightArena` |
| **SPRITE_FLYING_HERO** | Scherm 9 | Game Sprite | `screens/voice-side-scroller/components/SpritesFlightHazards.tsx` | `SpriteFlyingHero` |
| **SPRITE_OBSTACLE_SEAGULL** | Scherm 9 | Game Sprite | `screens/voice-side-scroller/components/SpritesFlightHazards.tsx` | `SpriteObstacleSeagull` |
| **SPRITE_OBSTACLE_SHARK** | Scherm 9 | Game Sprite | `screens/voice-side-scroller/components/SpritesFlightHazards.tsx` | `SpriteObstacleShark` |
| **SPRITE_COLLECTIBLE_ITEMS** | Scherm 9 | Game Sprite | `screens/voice-side-scroller/components/SpritesFlightHazards.tsx` | `SpriteCollectibleItems` |
| **SLIDER_HEIGHT_CONTROL** | Scherm 9 | Shared UI Control | `components/ui/displays/SliderHeightControl.tsx` | `SliderHeightControl` |
| **CARD_MIC_SPEECH_PROMPT** | Scherm 9 | Feature Dock | `screens/voice-side-scroller/components/CardMicSpeechPrompt.tsx` | `CardMicSpeechPrompt` |
| **BTN_FLY_UP** | Scherm 9 | Shared UI Button | `components/ui/buttons/BtnDirectional.tsx` | `BtnFlyUp` |
| **BTN_FLY_DOWN** | Scherm 9 | Shared UI Button | `components/ui/buttons/BtnDirectional.tsx` | `BtnFlyDown` |

---

## 14. IDE Quick-Search Guide voor Ontwikkelaars

Om te zorgen dat een developer direct bij het juiste component terechtkomt als hij een Code Name zoals `BTN_NAV_BACK` of `CARD_GAME_ZEG_ZET` zoekt:

1. **JSDoc `@uxId` Annotatie in elk Component:**
   Elke React/TypeScript component bevat bovenaan de bestandscode een standaard JSDoc block:
   ```typescript
   /**
    * @uxId BTN_NAV_BACK
    * @screens SCR_MAIN_TITLE | SCR_ADVENTURE_SELECT | SCR_KIES_WOORD_GAME | SCR_ZEG_ZET_GAME
    * @description Universele terugknop voor navigatie naar het vorige scherm of hoofdmenu.
    */
   export const BtnNavBack: React.FC<BtnNavBackProps> = ({ onClick }) => { ... };
   ```

2. **IDE Snelzoeken:**
   - Druk in VS Code of Antigravity op `Cmd+Shift+F` (Mac) of `Ctrl+Shift+F` (Windows).
   - Typ de exacte code naam in (bijv. `BTN_NAV_BACK` meegenomen).
   - De IDE springt direct naar de `@uxId` header van het bijbehorende `.tsx` bestand.

