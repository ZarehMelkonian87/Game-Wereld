# GAME UX/UI SPECIFICATION DOCUMENT
## Strand-bezem-escape ("Magisch Strand Avontuur")
### Gestandaardiseerde Interface Componenten, Naming Conventions, Functionaliteiten & UX Flow Specificatie

---

### Metadata
- **Projectnaam:** Strand-bezem-escape (Magisch Strand Avontuur)
- **Document Versie:** v1.0 (Definitieve UI/UX Standaardisatie)
- **Auteur:** Senior Game UX/UI Designer & Technical Product Owner
- **Doelgroep:** Game Developers, UI/UX Designers, Edu-Tech Content Creators, QA Testers
- **Bestandsloctie (.docx):** [UX_Design_Specification_Strand_Bezem_Escape.docx](file:///Users/melkonian/git/Game-Wereld/docs/UX_Design_Specification_Strand_Bezem_Escape.docx)

---

## 1. Inleiding & UX Ontwerpprincipes

Dit document bevat het officiële User Experience (UX) en User Interface (UI) ontwerpdocument voor de educatieve game **Strand-bezem-escape** (commerciële titel: *Magisch Strand Avontuur*). 

Het doel van dit document is het standaardiseren van alle menu's, knoppen, statustellers, interactiekaarten en feedbackelementen. Door eenduidige naamgeving (naming conventions) en heldere functionaliteitsomschrijvingen te hanteren, wordt de overdracht naar software-engineers en gamedesigners gestroomlijnd.

### Kernprincipes van Strand-bezem-escape UX
1. **Kindvriendelijke Ergonomie:** Knoppen hebben een minimale touch-target van `48x48dp` met duidelijke, herkenbare iconografie.
2. **Directe Multimodale Feedback:** Elk interactief element reageert visueel (schaalverandering/pulse op click) en auditief (klank/click sound effect).
3. **Hoge Contrasten & Helderheid:** Gebruik van speelse, warme strandkleuren met hoge leesbaarheid en duidelijke contours om focus te behouden.
4. **Inclusiviteit & Privacy:** Toegankelijkheidsopties zoals rustige beweging (reduced motion) en transparante microfoon-permissies.

---

## 2. Gestandaardiseerde UI Naming Conventions

Om verwarring in de codebase en het design-systeem te voorkomen, hanteren we een gestandaardiseerde prefix-structuur voor alle UI-onderdelen in de applicatie:

| Prefix | Component Type | Voorbeeld ID |
| :--- | :--- | :--- |
| **SCR_** | Scherm / View | `SCR_MAIN_TITLE`, `SCR_ADVENTURE_SELECT` |
| **BTN_** | Interactieve Knop | `BTN_PRIMARY_PLAY`, `BTN_NAV_BACK` |
| **CARD_** | Selectie- of Informatiekaart | `CARD_GAME_ZEG_ZET`, `CARD_REWARD_SHOWCASE` |
| **TOGGLE_** | Aan/Uit Schakelaar | `TOGGLE_AUDIO`, `TOGGLE_REDUCED_MOTION` |
| **DSP_** | Weergave / Statusteller | `DSP_STAR_COUNTER`, `DSP_STICKER_PROGRESS` |
| **TTL_** | Titel / Header Capsule | `TTL_HEADER_PILL`, `TTL_SECTION_TITLE` |
| **INFOBOX_** | Melding / Waarschuwingsvak | `INFOBOX_SPEECH_STATUS`, `INFOBOX_MIC_BLOCKED` |
| **DOCK_** | Onderste Actie- / Navigatiebalk | `DOCK_SELECTION_FOOTER`, `DOCK_REWARD_ACTIONS` |

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
| **TOGGLE_AUDIO** | Audio Schakelaar | Schakelt gesproken opdrachten en video-audio in/uit. Subtitel: *'Laat opdrachtspraak en video's horen.'* | Witte kaart met luidspreker-icoon en groene Toggle Switch (Aan) | Toggle Audio State |
| **TOGGLE_MUSIC** | Muziek Schakelaar | Schakelt de achtergrondmuziek in/uit. Subtitel: *'Zachte muziek op de achtergrond.'* | Witte kaart met muzieknoot-icoon en grijze Toggle Switch (Uit) | Toggle BGM State |
| **TOGGLE_HINTS** | Hints Schakelaar | Schakelt mascottesubsidie en automatische hints in/uit. Subtitel: *'Laat de mascotte helpen wanneer nodig.'* | Witte kaart met lamp-icoon en groene Toggle Switch (Aan) | Toggle Hint System |
| **TOGGLE_REDUCED_MOTION** | Rustige Beweging Toggle | Vermindert animaties en pulse-effecten voor rustige ervaring. Subtitel: *'Minder beweging en minder pulse-effecten.'* | Witte kaart met oog-kruis icoon en grijze Toggle Switch (Uit) | Toggle Accessibility |
| **TOGGLE_DEVTOOLS** | Zone Editor Toggle | Opent interactieve zone-locatie editor voor ontwikkelaars. Subtitel: *'Open de interactieve zone-locatie editor.'* | Witte kaart met sleutel-icoon en grijze Toggle Switch (Uit) | Developer Mode |
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
| **CARD_REWARD_SHOWCASE** | Sticker Showcase Kaart | Centraal kader dat de verdiende sticker (bijv. Schelp Sticker) en regenboog-ster badge toont. | Creme achtergrond met gele rand en sticker-illustratie | Reward Showcase |
| **DSP_STICKER_PROGRESS_PILL** | Sticker Voortgangsbadge | Toont de voortgang van de stickerverzameling (bijv. '0/30' met ster-icoon). | Gele afgeronde pil met ster-icoon | Progress Indicator |
| **LBL_STICKER_NAME** | Sticker Naam Label | Tekstlabel onder de stickerweergave: 'Schelp Sticker'. | Vetgedrukte donkere tekst | Item Identification |
| **STAT_BOX_GOED** | Statistiek: GOED | Toont het aantal foutloos beantwoorde vragen (bijv. 'GOED: 0'). | Lichtgroene capsule pil met groene rand | Score Counter |
| **STAT_BOX_TEMPO** | Statistiek: TEMPO | Toont de behaalde snelheidsbonuspuntenscore (bijv. 'TEMPO: +0'). | Lichtblauwe capsule pil met blauwe rand | Speed Bonus Counter |
| **STAT_BOX_HINTS** | Statistiek: HINTS | Toont het aantal geraadpleegde hints tijdens de sessie (bijv. 'HINTS: 0'). | Lichtoranje capsule pil met oranje rand | Assist Counter |
| **STAT_BOX_AUDIO** | Statistiek: AUDIO | Toont het aantal keren dat geluid/opdracht is herhaald (bijv. 'AUDIO: 0'). | Witte capsule pil met grijze rand | Audio Replay Counter |
| **STAT_BOX_STERREN** | Statistiek: STERREN | Toont het totale aantal netto gewonnen beloningssterren (bijv. 'STERREN: +0'). | Zachtgouden capsule pil met gouden rand | Total Currency Awarded |
| **SEC_WORDS_PRACTICED** | Woorden Sectie | Overzicht van geoefende woorden. Status: 'nog geen woorden' (wanneer leeg). | Titel met pill-tag 'nog geen woorden' | Vocabulary Summary |
| **SEC_SPATIAL_WORDS** | Plaatswoorden Sectie | Overzicht van geoefende ruimtelijke plaatswoorden (bijv. 'in', 'op', 'onder'). Status: 'nog geen plaatswoorden'. | Titel met pill-tag 'nog geen plaatswoorden' | Grammar/Spatial Summary |
| **BANNER_REWARD_SUMMARY** | Beloning Samenvatting | Onderste trofee-banner: 'Beloning: Schelp Sticker' met trofee-icoon. | Gele afgeronde banner met trofee-icoon | Reward Highlight |
| **BTN_ACTION_REPLAY** | Opnieuw Knop | Herstart direct de zojuist gespeelde minigame of sessie. | Groene capsule knop met herlaad/refresh-icoon en tekst 'Opnieuw' | Replay Session |
| **BTN_ACTION_WORLD** | Wereld Knop | Navigeert naar de overkoepelende Wereldkaart van Game-Wereld. | Groene capsule knop met wereldbol-icoon en tekst 'Wereld' | Open World Map |
| **BTN_ACTION_MENU** | Menu Knop | Navigeert terug naar het Hoofdscherm (`SCR_MAIN_TITLE`). | Groene capsule knop met home-icoon en tekst 'Menu' | Open Main Menu |

---

## 7. Component States & Geluidseffecten Matrix

| State Name | Visuele Transformatie | Audio Effect (SFX) | Haptische Feedback |
| :--- | :--- | :--- | :--- |
| **DEFAULT / IDLE** | Normale schaal 1.0x, standaard schaduw en helderheid. | Geen geluid | Geen trilling |
| **HOVER / FOCUS** | Subtiele vergroting (scale 1.05x), verhoogde schaduw, lichte glow. | Zachte hoorbare tick / pop | Geen trilling |
| **PRESSED / ACTIVE** | Gekrompen schaal (scale 0.95x), verlaagde schaduw (ingedrukt effect). | Helder geluidsklik `btn_click.mp3` | Lichte haptische tik (5ms) |
| **DISABLED / LOCKED** | 50% transparantie (opacity 0.5), slot-icoon overlay, geen hover-effect. | Foutgeluid `buzz_disabled.mp3` | Korte dubbele trilling |
