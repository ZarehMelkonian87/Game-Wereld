# 🎮 GDD-index — Magisch Strand-Avontuur

> **Bron van waarheid op hoofdlijn.** Dit document beschrijft *wat* de game is en *hoe* die bedoeld is te werken. Alle details staan in de gekoppelde detaildocumenten en in de drie zusterdocumenten (Feature-catalogus, User Journey Map, Test-matrix). Waar het *bedoelde* ontwerp afwijkt van de *werkelijke* code, wordt dat expliciet vastgelegd in sectie 11.

---

## 0. Documentbeheer & Leeswijzer

### 0.1 Metadata

| Veld | Waarde |
| :--- | :--- |
| **Documenttitel** | GDD-index — Magisch Strand-Avontuur |
| **Onderdeel van** | +1 Woordenschat Platform (Game-Wereld) |
| **Game-ID** | `magisch-strand-avontuur` |
| **Documentversie** | `1.1` (verwerkt eerste review-feedback + takenlijst) |
| **Laatst bijgewerkt** | 2026-09-11 |
| **Status** | 🟢 Compleet (sectie 0–12) — basis voor de 3 zusterdocumenten |
| **Eigenaar** | Zareh Melkonian |
| **Doelgroep document** | Game-developers, educatieve ontwerpers, logopedisten/orthopedagogen, QA |
| **Contentversie (code)** | `magisch-strand-avontuur-2026.07` (bron: [manifest.ts](../../src/app/games/magisch-strand-avontuur/manifest.ts)) |

### 0.2 Doel van dit document

De GDD-index is het **hoogste, overkoepelende ontwerpdocument**. Het is bewust kort en verwijzend: elk deel geeft de essentie en wijst door naar een detaildocument of naar de broncode. Zo blijft de index leesbaar en actueel, terwijl de granulaire waarheid dicht bij de code leeft.

Dit document beschrijft **hoe de game bedoeld is**. Het is nadrukkelijk **niet** een verslag van wat op dit moment wel of niet werkt — dat is de taak van de **Feature-catalogus** en de **Test-matrix**. De index en die twee documenten verwijzen naar elkaar via stabiele ID's (zie 0.4).

### 0.3 De vier samenhangende documenten

Dit dossier bestaat uit vier documenten die samen één geheel vormen. Elk heeft een eigen rol en een eigen ID-reeks:

| # | Document | Vraag die het beantwoordt | Primaire ID-reeks |
| :-- | :--- | :--- | :--- |
| 1 | **GDD-index** (dit document) | *Wat is de game en hoe is die bedoeld?* | `SCR_*` (schermen) |
| 2 | **Feature-catalogus** | *Uit welke concrete functionaliteiten bestaat de game, en werken die?* | `FEAT_*` |
| 3 | **User Journey Map** | *Welke stappen doorloopt de gebruiker, van start tot beloning?* | `JRN_*` |
| 4 | **Test-matrix** | *Hoe verifiëren we elke feature en journey-stap?* | `TC_*` |

De samenhang loopt als een ketting:

```
Scherm (SCR_*)  ─→  Feature (FEAT_*)  ─→  Journey-stap (JRN_*)  ─→  Testcase (TC_*)
   GDD-index         Feature-catalogus      User Journey Map        Test-matrix
```

Elke feature verwijst naar het scherm waarop hij leeft; elke journey-stap verwijst naar de features die hij gebruikt; elke testcase verwijst naar de feature(s) en journey-stap(pen) die hij dekt. Zo is voor elk onderdeel traceerbaar: *bedoeling → functie → gebruikersreis → test → status.*

### 0.4 ID-conventies

Stabiele, mensleesbare ID's zijn de ruggengraat van dit dossier. Ze veranderen niet als teksten of implementatie wijzigen. De game gebruikt al `data-testid`-attributen en interne enums; die sluiten hierop aan.

| Prefix | Betekenis | Voorbeeld | Bron in code |
| :--- | :--- | :--- | :--- |
| `SCR_` | Scherm of overlay | `SCR_MSA_START` | `GameScreenPreview`-enum, `routes.tsx` |
| `FEAT_` | Concrete functionaliteit | `FEAT_VOICE_SCENE_PLACE` | Feature-catalogus |
| `JRN_` | Stap in een gebruikersreis | `JRN_ONBOARD_03_AVATAR` | User Journey Map |
| `TC_` | Testcase | `TC_SCENE_MIC_HAPPY` | `e2e/*.spec.ts` |
| `MODE_` | Spelmodus | `MODE_ZEG_ZET` | `BezemEscapeMode`-type |
| `WORD_` | Doelwoord uit curriculum | `WORD_DOLFIJN` | `content.ts` / `worlds.ts` |
| `CONCEPT_` | Ruimtelijk begrip | `CONCEPT_ONDER` | `SpatialConcept`-type |

**Naamgevingsregels voor `SCR_`:** platformschermen krijgen `SCR_PLAT_*` (bv. `SCR_PLAT_WELCOME`), game-schermen krijgen `SCR_MSA_*` (Magisch Strand-Avontuur). Zie de volledige lijst in sectie 3.

### 0.5 Statuslabels

Waar dit dossier de *werkelijkheid* rapporteert (Feature-catalogus, Test-matrix, en sectie 11 van dit document), gebruiken we één vaste set labels:

| Label | Betekenis |
| :--- | :--- |
| 🟢 **Werkt** | Geïmplementeerd en geverifieerd (test of handmatig). |
| 🟡 **Deels** | Aanwezig maar met bekende gebreken of onvolledig. |
| 🔴 **Kapot** | Aanwezig in code/ontwerp maar werkt niet zoals bedoeld. |
| ⚪ **Niet getest** | Onbekend of het werkt; nog niet geverifieerd. |
| 🔵 **Gepland** | Ontworpen/voorzien, nog niet gebouwd. |
| ⚫ **Dood** | Bestaat in code maar wordt niet gebruikt/bereikt (kandidaat voor opruimen). |

### 0.6 Changelog

| Versie | Datum | Auteur | Wijziging |
| :--- | :--- | :--- | :--- |
| 0.1 | 2026-09-11 | Zareh Melkonian | Eerste opzet. Sectie 0 (Documentbeheer & Leeswijzer) en sectie 1 (Executive Summary & High Concept) uitgewerkt. |
| 0.2 | 2026-09-11 | Zareh Melkonian | Sectie 2 (Doelgroep & Pedagogisch Fundament) en sectie 3 (Schermarchitectuur / Screen Map) uitgewerkt. |
| 0.3 | 2026-09-11 | Zareh Melkonian | Sectie 4 (Core Gameplay Loop & Spelmodi) en sectie 5 (Invoer & Spraaktechnologie) uitgewerkt, geankerd aan de werkelijke code. |
| 0.4 | 2026-09-11 | Zareh Melkonian | Sectie 6 (Content & Curriculum) en sectie 7 (Beloningen, Progressie & Economie) uitgewerkt. Drie conflicterende beloningsdefinities in de code vastgelegd. |
| 0.5 | 2026-09-11 | Zareh Melkonian | Sectie 8 (Data, Opslag & Privacy) en sectie 9 (Toegankelijkheid & Non-functionele Eisen) uitgewerkt. |
| 1.0 | 2026-09-11 | Zareh Melkonian | Sectie 10 (Feature-overzicht) en sectie 11 (Bekende Gaten & Openstaande Punten) uitgewerkt. GDD-index inhoudelijk compleet; klaar als basis voor Feature-catalogus, User Journey Map en Test-matrix. |
| 1.1 | 2026-09-11 | Zareh Melkonian | Review-beslissingen verwerkt: één moduskeuzescherm (`SCR_MSA_MODE_SELECT`), alle 3 modi krijgen een in-game ronde-eindscherm, `zeg-en-bouw` krijgt een eigen scherm, data-gestuurde rondelengte is de norm, **één** beloningssysteem gekozen. Sectie 12 (Takenlijst) toegevoegd als levend register. |
| 1.2 | 2026-09-11 | Zareh Melkonian | [Feature-catalogus](Feature-catalogus.md) opgesteld (70 features). Taak `T-18` toegevoegd (alle ⚪-features verifiëren). |
| 1.3 | 2026-09-11 | Zareh Melkonian | Live verificatieronde in de browser uitgevoerd (46 features geverifieerd 🟢). Nieuwe taken `T-19`–`T-23` toegevoegd (o.a. defecte instructievideo, zichtbare dev-toggle, sterren-per-profiel). |
| 1.4 | 2026-09-11 | Zareh Melkonian | [User Journey Map](User-Journey-Map.md) opgesteld (9 reizen, `JRN_*`). Geen nieuwe taken. |
| 1.5 | 2026-09-11 | Zareh Melkonian | [Test-matrix](Test-matrix.md) opgesteld (41 testcases, `TC_*`). Dekkingsgaten benoemd (Kies het Woord, Zeg & Vlieg, Beloning zonder e2e). Taak `T-24` toegevoegd. **Alle 4 dossierdocumenten compleet.** |

### 0.7 Verwante bestaande documentatie

Deze index consolideert en vervangt op termijn de bestaande, deels aspirationele documentatie. Tijdens de overgang blijven die als naslag beschikbaar:

- [src/app/games/magisch-strand-avontuur/docs/GDD.md](../../src/app/games/magisch-strand-avontuur/docs/GDD.md) — oude GDD (v2.0), wordt bron voor de detaildocumenten.
- [docs/UX_Design_Specification_Magisch_Strand_Avontuur.md](../UX_Design_Specification_Magisch_Strand_Avontuur.md) — UX-specificatie.
- [src/app/games/magisch-strand-avontuur/docs/01–05](../../src/app/games/magisch-strand-avontuur/docs/) — pedagogisch fundament, curriculum, gameplay, schermen, beloningen.

---

## 1. Executive Summary & High Concept

### 1.1 Elevator pitch

> *"Magisch Strand-Avontuur is een spraakgestuurde, educatieve web-game (PWA) waarin kinderen van 4–8 jaar op een magische strandwereld hun woordenschat, zinsbegrip en ruimtelijke oriëntatie oefenen — door te luisteren, te kijken, aan te raken én hardop te spreken. Kinderen plaatsen stickers op het strand, kiezen het juiste woord in een quiz, of vliegen op een bezem langs objecten die ze bij naam noemen."*

### 1.2 In één oogopslag

| Aspect | Invulling |
| :--- | :--- |
| **Genre** | Educatieve serious game / logopedische oefenomgeving |
| **Domein** | Spraak- en taalontwikkeling: woordenschat, zinsbegrip, ruimtelijke taal |
| **Doelgroep** | Kinderen 4–8 jaar (kleuters/groep 1–4), inclusief NT2/meertalig en kinderen met TOS |
| **Platform** | Cross-platform web (PWA); primair touchscreen-tablets (iPad/Android), ook desktopbrowsers |
| **Oriëntaties** | Portret én landschap (bron: `supportedOrientations` in [manifest.ts](../../src/app/games/magisch-strand-avontuur/manifest.ts)) |
| **Capabilities** | `audio`, `microphone`, `offline-package` |
| **Aantal spelmodi** | 3 speelbare modi (zie 1.4) |
| **Thema/wereld** | Strand (één actieve wereld; verdere werelden gepland) |
| **Taal** | Nederlands (`nl-NL`) |

### 1.3 Unieke verkoop- & speelpunten (USP's)

1. **Multimodale, gelijkwaardige invoer** — elke opdracht kan met **aanraken (tap)**, **slepen (drag-and-drop)** én **stem (microfoon)** worden uitgevoerd. Geen enkel kind wordt uitgesloten: er is altijd een toetsenbord-fallback voor stille omgevingen of als spraak faalt.
2. **Kindvriendelijke, geduldige spraakherkenning** — ontworpen om níet voortijdig af te breken: ruime opnameduur, adaptieve stiltetimer, live golfanimatie en ondersteuning voor kindertaal-varianten (bv. "krap" voor "krab").
3. **Logopedisch verantwoord, foutarm leren** — geen afstraffing of faalervaring. Bij twijfel verschijnen visuele hints, lichten doelzones op en kunnen instructies onbeperkt herhaald worden. Het kind bepaalt het tempo.
4. **Privacy-first & offline** — spraak wordt lokaal in de browser verwerkt en niet opgeslagen; geen tracking, advertenties of aankopen. De game is als PWA offline speelbaar.
5. **Observatie zonder toetsdruk** — voortgang wordt geregistreerd als procesobservaties (welke woorden/begrippen geoefend, met/zonder hulp), niet als scores of cijfers.

### 1.4 De drie spelmodi (kern)

De game biedt één samenhangende leertrap via drie modi, oplopend van herkennen naar zelf produceren:

| Modus-ID | Naam | Kernactie | Talige focus |
| :--- | :--- | :--- | :--- |
| `MODE_KIES_WOORD` | **Kies het Woord** | Tik de juiste keuzekaart aan | Receptief: woordherkenning |
| `MODE_ZEG_ZET` | **Zeg & Zet** | Plaats een object op de juiste plek (tik/sleep/spreek) | Relationeel: zinsbegrip + ruimtelijke taal |
| `MODE_ZEG_VLIEG` | **Zeg & Vlieg** | Vlieg langs objecten en spreek hun naam uit | Productief: actief benoemen |
| `MODE_ZEG_BOUW` 🔵 | **Zeg & Bouw** *(gepland)* | Eigen modus + scherm, mechanica nog te ontwerpen | Nog te bepalen |

> Detail per modus staat in sectie 4 en in het gameplay-detaildocument. Er komt een **4e modus** `MODE_ZEG_BOUW` (`zeg-en-bouw`) met een eigen scherm; die is nog te ontwerpen en te bouwen (zie 4.6 en [T-04](#12-takenlijst)).

### 1.5 "Wat maakt de game af" (definition of done, op hoofdlijn)

De game is "af" wanneer een kind uit de doelgroep zelfstandig — of met minimale begeleiding — de volledige reis kan doorlopen: opstarten → profiel/avatar → strandwereld kiezen → een modus spelen → beloning ontvangen → opnieuw of stoppen, waarbij elke invoermethode (tap, sleep, stem, toetsenbord) betrouwbaar werkt en er nergens een doodlopende of foutieve staat optreedt. De exacte, toetsbare criteria hiervoor worden vastgelegd in de **Test-matrix**.

---

## 2. Doelgroep & Pedagogisch Fundament

> Dit is de **hoofdlijn**. De volledige wetenschappelijke onderbouwing staat in het detaildocument [01-pedagogisch-en-logopedisch-fundament.md](../../src/app/games/magisch-strand-avontuur/docs/01-pedagogisch-en-logopedisch-fundament.md).

### 2.1 Waarom deze game bestaat

De game richt zich op de kritieke fase waarin kinderen hun **receptieve** woordenschat (begrijpen wat je hoort) omzetten in **actieve** woordenschat (zelf woorden gebruiken en articuleren), en waarin **ruimtelijke begrippen** en **complexere zinsstructuren** worden verworven. Traditionele oefenvormen (werkbladen, passieve video) spreken meestal één zintuig aan en lokken geen actieve taalproductie uit; deze game combineert horen, zien, doen én zeggen in één vloeiende loop.

### 2.2 Spelerpersona's

| Persona-ID | Wie | Kenmerken | Belangrijkste ontwerpimplicatie |
| :--- | :--- | :--- | :--- |
| `PERS_KLEUTER` | Reguliere kleuter (4–5 jr) | Ontluikende woordenschat; leert via beeld-klank-koppeling; intuïtief met touch | Grote touch-targets, tap-first, korte opdrachten |
| `PERS_TOS` | Kind met Taalontwikkelingsstoornis (4–8 jr) | Moeite met complexe zinnen en abstracte voorzetsels (`onder`, `tussen`); lagere auditieve verwerkingssnelheid | Oplichtende doelzones, onbeperkte herhaling, videomodel, extra tijd |
| `PERS_NT2` | Meertalig / NT2-kind (5–8 jr) | Leert Nederlands als tweede taal | Uitgesproken lidwoorden (`de boot`, `het vliegtuig`), duidelijke uitspraakmodellen, nazegzinnen |
| `PERS_BEGELEIDER` | Ouder / logopedist / leerkracht | Wil zien waar gerichte stimulering nodig is | Observatiedata per profiel, begeleiderspaneel, geen toetsdruk |

### 2.3 Didactische pijlers

1. **Dual Coding (Paivio) & multimodale koppeling** — auditieve input + visuele representatie + motorische handeling + verbale output activeren gelijktijdig, voor diepe semantische verankering.
2. **De logopedische leertrap (receptief → relationeel → productief)** — direct gekoppeld aan de drie modi:

   ```
   RECEPTIEF            RELATIONEEL           PRODUCTIEF
   Herkennen      →     Plaatsen in       →   Zelf benoemen
   (Kies het Woord)     context               (Zeg & Vlieg)
                        (Zeg & Zet)
   ```

3. **Concretisering van abstracte ruimtelijke begrippen** — dynamische ankerobjecten en oplichtende zones maken relationele begrippen (`tussen`, `naast`) zichtbaar en ervaarbaar.
4. **Foutloos leren & scaffolding (Vygotsky)** — een oplopende hulpladder zonder faalervaring:

   | Scaffold | Ingreep |
   | :--- | :--- |
   | 0 | Zelfstandige poging (bonus bij succes zonder hulp) |
   | 1 | Visuele hint: doelzone pulseert / foute keuzekaarten vallen weg |
   | 2 | Auditieve herhaling: instructie onbeperkt opnieuw beluisterbaar |
   | 3 | Videomodel: animatie toont de handeling |
   | ✓ | Positieve bekrachtiging: nooit een "fout!"-geluid of verlies van voortgang |

### 2.4 Observatie zonder toetsdruk

De game verzamelt op de achtergrond **procesobservaties** (geen cijfers): welke woorden/begrippen het kind zelfstandig beheerst, hulpbehoefte per domein, aantal audio-herhalingen, en reactietijd/tempo. Deze data is de basis voor het voortgangsoverzicht en wordt lokaal per profiel opgeslagen (zie sectie 8). Het onderliggende record is `BezemEscapePracticeEvent` (bron: [types.ts](../../src/app/games/magisch-strand-avontuur/types.ts)).

### 2.5 Meetbare leerdoelen (hoofdlijn)

| Domein-ID | Leerdoel | Modus die het traint |
| :--- | :--- | :--- |
| `receptive-vocabulary` | Doelwoord herkennen tussen afleiders | Kies het Woord |
| `sentence-comprehension` | Een gesproken opdracht begrijpen en uitvoeren | Zeg & Zet |
| `spatial-language` | Ruimtelijke begrippen correct toepassen | Zeg & Zet |
| `active-vocabulary` | Doelwoord zelfstandig en verstaanbaar benoemen | Zeg & Vlieg |

> De volledige lijst taaldomeinen staat als `LanguageDomain`-type in [types.ts](../../src/app/games/magisch-strand-avontuur/types.ts); het curriculum met woorden en begrippen wordt in sectie 6 samengevat.

---

## 3. Schermarchitectuur (Screen Map)

> Dit is het **skelet** van het hele dossier: elk scherm en elke overlay heeft een stabiel `SCR_`-ID. De Feature-catalogus hangt features onder deze ID's; de User Journey Map rijgt ze aaneen tot reizen; de Test-matrix test ze. Statuslabels (🟢🟡🔴⚪🔵⚫) volgen de legenda uit sectie 0.5 en drukken hier uit of het scherm *bereikbaar en gerenderd* is — niet of alle features erin werken (dat staat in de Feature-catalogus).

### 3.1 Twee niveaus

De gebruiker beweegt door **twee lagen**:

- **Platform-laag** (`SCR_PLAT_*`) — de +1 Woordenschat-schil rondom alle games: welkom, profiel, avatar, themakeuze, gamelijst, instellingen, voortgang. Aangestuurd door React Router (bron: [routes.tsx](../../src/app/routes.tsx)).
- **Game-laag** (`SCR_MSA_*`) — de interne schermen van Magisch Strand-Avontuur. Aangestuurd door een interne state-machine, niet door de router (bron: [index.tsx](../../src/app/games/magisch-strand-avontuur/index.tsx) en de `GameScreenPreview`-enum in [logic/game-screen-preview.ts](../../src/app/games/magisch-strand-avontuur/logic/game-screen-preview.ts)).

### 3.2 Platform-schermen (`SCR_PLAT_*`)

| Scherm-ID | Route | Component | Doel | Status |
| :--- | :--- | :--- | :--- | :--: |
| `SCR_PLAT_WELCOME` | `/` | `WelcomeScreen` | Welkomstscherm, instap in de app | ⚪ |
| `SCR_PLAT_PROFILE_SELECT` | `/profiles` | `ProfileSelectScreen` | Kindprofiel kiezen of aanmaken | ⚪ |
| `SCR_PLAT_AVATAR_SELECT` | `/avatar` | `AvatarSelectScreen` | Avatar kiezen + naam bevestigen | ⚪ |
| `SCR_PLAT_HOME` | `/home` | `HomeScreen` | Thema/wereld kiezen | ⚪ |
| `SCR_PLAT_GAMES_LIST` | `/games/:theme` | `GamesListScreen` | Game kiezen binnen een thema | ⚪ |
| `SCR_PLAT_GAME_PLAY` | `/games/:theme/:gameId` | `GamePlayScreen` | Host die de gekozen game laadt en draait | ⚪ |
| `SCR_PLAT_SETTINGS` | `/settings` | `SettingsScreen` | Platformbrede instellingen | ⚪ |
| `SCR_PLAT_PROGRESS` | `/progress` | `ProgressScreen` | Voortgangsoverzicht per profiel | ⚪ |

### 3.3 Game-schermen (`SCR_MSA_*`)

De game rendert precies één van deze schermen tegelijk, gestuurd door de `screenPreview`-staat.

| Scherm-ID | `screenPreview` | Component | Modus | Doel | Status |
| :--- | :--- | :--- | :--- | :--- | :--: |
| `SCR_MSA_START` | `start` | `StartScreen` | — | Titelscherm met speelknop, sterrenteller, instellingen | ⚪ |
| `SCR_MSA_MODE_SELECT` | `mode-select` | `AdventureSelectScreen` | — | **Avontuur kiezen**: wereld + spelmodus in één scherm | ⚪ |
| `SCR_MSA_SCENE_BUILDER` | `scene-builder` | `SceneBuilderScreen` | `MODE_ZEG_ZET` | Object plaatsen op het strand via tap/sleep/stem | ⚪ |
| `SCR_MSA_ZEG_BOUW` | *(nieuw)* | *(nog te bouwen)* | `MODE_ZEG_BOUW` | 🔵 Eigen scherm voor de `zeg-en-bouw`-modus (zie 4.6) | 🔵 |
| `SCR_MSA_WORD_CHOICE` | `word-choice` | `WordChoiceScreen` | `MODE_KIES_WOORD` | Woordkeuze-quiz (aantal vragen data-gestuurd) | ⚪ |
| `SCR_MSA_VOICE_SCROLLER` | `voice-side-scroller` | `VoiceSideScrollerScreen` | `MODE_ZEG_VLIEG` | Vliegen en objecten hardop benoemen | ⚪ |
| `SCR_MSA_REWARD` | `reward` | `RewardScreen` | — | Beloningsoverzicht (sterren, bezems, stickers) | ⚪ |
| `SCR_MSA_SETTINGS` | `settings` | `GameSettingsScreen` | — | Audio, microfoon/privacy, voortgang resetten | ⚪ |
| `SCR_MSA_DASHBOARD` | `dashboard` | — (niet gerenderd) | — | Bestaat in de enum maar wordt **niet** gerenderd in `index.tsx` | ⚫ |

> **Beslissing (review):** `world-select` en `mode-select` deden hetzelfde (één component, `AdventureSelectScreen`). We houden **één** scherm aan: **`SCR_MSA_MODE_SELECT`** ("Avontuur kiezen"). De redundante `world-select`-staat wordt opgeruimd (zie [T-05](#12-takenlijst)).
>
> ⚫ **`SCR_MSA_DASHBOARD`** is een dode staat (staat in de `GameScreenPreview`-enum, maar `index.tsx` rendert het niet en valt terug op de scene-builder). Opruimen — zie sectie 11 / [T-06](#12-takenlijst).
>
> 🔵 **`SCR_MSA_ZEG_BOUW`** is nog te bouwen: de modus `zeg-en-bouw` bestaat wel als type maar heeft nog geen eigen scherm (zie 4.6 / [T-04](#12-takenlijst)).

### 3.4 Overlays & modals (`SCR_MSA_OV_*`)

Overlays verschijnen *boven* een scherm en hebben hun eigen gedrag en tests.

| Overlay-ID | Component | Verschijnt op | Doel | Status |
| :--- | :--- | :--- | :--- | :--: |
| `SCR_MSA_OV_KEYBOARD` | `TypedCommandFallback` / `CardModalKeyboardInput` | Scene Builder | Toetsenbord-fallback voor commando's (stille omgeving / spraak faalt) | ⚪ |
| `SCR_MSA_OV_SPEECH_WAVE` | `SpeechWaveAnimation` | Scene Builder | Live luister-indicator: golfanimatie, "Ik luister…", transcriptie, Klaar-knop | ⚪ |
| `SCR_MSA_OV_VOICE_PRIVACY` | `VoicePrivacyNotice` | Scene Builder | Privacy-toelichting bij eerste microfoongebruik | ⚪ |
| `SCR_MSA_OV_SUCCESS_TOAST` | `FloatingSuccessToast` | Scene Builder | Positieve feedback bij goed antwoord | ⚪ |
| `SCR_MSA_OV_RESET_CONFIRM` | `ConfirmResetDialog` | Instellingen | Bevestiging vóór het resetten van voortgang | ⚪ |
| `SCR_MSA_OV_ZEGVLIEG_START` | `VoiceSideScrollerStartOverlay` / `CardModalZegVliegStart` | Zeg & Vlieg | Startuitleg vóór de vliegronde | ⚪ |
| `SCR_MSA_OV_ZEGVLIEG_SUMMARY` | `VoiceSideScrollerRoundSummary` | Zeg & Vlieg | Ronde-resultaat: meters, sterren, score | ⚪ |
| `SCR_MSA_OV_WORDCHOICE_SUMMARY` | `WordChoiceRoundSummary` | Kies het Woord | In-game eindscherm: sterren, tempo, goed direct/met hint | ⚪ |
| `SCR_MSA_OV_ZONE_DEVTOOLS` | `SceneZoneDevTools` | Scene Builder | **Dev-only** zone-editor (`?dev=true` / `?zoneDevTools=true`) | ⚪ |
| `SCR_MSA_OV_UI_PREVIEW` | `UiBuildingBlocksPreview` | — | **Dev-only** UI-componentcatalogus (`?preview=ui`) | ⚪ |

### 3.5 Navigatiestroom (game-laag)

```
                                   SCR_PLAT_GAME_PLAY (host)
                                            │
                                            ▼
                                     SCR_MSA_START ◄────────────┐
                                            │                   │
                          ┌─────────────────┼───────────┐       │
                          ▼                 ▼           ▼        │
                  SCR_MSA_MODE_SELECT  SCR_MSA_SETTINGS  (Terug → platform)
                          │
       ┌──────────────────┼──────────────┬──────────────────────┐
       ▼                  ▼              ▼                       ▼
SCR_MSA_SCENE_BUILDER  SCR_MSA_ZEG_BOUW  SCR_MSA_WORD_CHOICE  SCR_MSA_VOICE_SCROLLER
       │                  │              │                       │
       │   (elke modus eindigt met een eigen in-game ronde-eindscherm, zie 4.5)
       └──────────────────┴──────┬───────┴───────────────────────┘
                                 ▼
                           SCR_MSA_REWARD
                                 │
                  ┌──────────────┴──────────────┐
                  ▼                              ▼
        (Opnieuw → zelfde modus)     (Menu → SCR_MSA_MODE_SELECT)
```

> De precieze knoppen, teruggangen en randgevallen (bv. "Terug" vanuit een modus, afbreken midden in een ronde) worden per stap vastgelegd in de **User Journey Map**.

### 3.6 Beslissingen & openstaande vragen bij de screen map

- ✅ **Besloten:** `world-select` en `mode-select` worden **één** scherm — `SCR_MSA_MODE_SELECT`. De redundante `world-select`-staat en de navigatie ernaartoe (bv. `StartScreen.onPlay`) worden opgeruimd → [T-05](#12-takenlijst).
- ✅ **Besloten:** `SCR_MSA_DASHBOARD` (⚫) wordt **opgeruimd** uit de enum → [T-06](#12-takenlijst).
- ✅ **Besloten:** de modus `zeg-en-bouw` **krijgt een eigen scherm** (`SCR_MSA_ZEG_BOUW`) → [T-04](#12-takenlijst).
- **Platformstatussen (⚪):** nog niet geverifieerd of alle acht platformschermen bereikbaar en foutloos renderen; dit is werk voor de Test-matrix.

---

## 4. Core Gameplay Loop & Spelmodi

> Dit deel beschrijft de **werkelijke** spellogica zoals die in de code zit (bron: `screens/*` en `logic/*`), niet alleen de bedoeling. Afwijkingen tussen de oude documentatie en de code zijn expliciet gemarkeerd met ⚠️ en verzameld in sectie 11.

### 4.1 Algemene core loop

Alle drie de modi delen dezelfde onderliggende cyclus:

```
┌────────────┐   ┌────────────┐   ┌────────────┐   ┌───────────────┐
│ 1. HOOR/ZIE│ → │ 2. BEGRIJP │ → │ 3. ACTIE   │ → │ 4. BEKRACHTIG │
│  opdracht  │   │  & verwerk │   │ tap/sleep/ │   │  feedback +   │
│ (audio+    │   │            │   │  stem      │   │  beloning     │
│  beeld)    │   │            │   │            │   │               │
└────────────┘   └────────────┘   └────────────┘   └───────┬───────┘
       ▲                                                    │
       └───────────────── 5. PROGRESSIE ────────────────────┘
                   (volgende opdracht of ronde-einde)
```

Bij **elke** actie — goed óf fout — schrijft de game een observatie weg (`runtime.practice.append(...)`, zie sectie 2.4/8). Er is nooit straf: een fout leidt tot een vriendelijke tip en het kind mag opnieuw.

### 4.2 `MODE_KIES_WOORD` — Kies het Woord

**Scherm:** `SCR_MSA_WORD_CHOICE` · **Bron:** [useWordChoiceState.ts](../../src/app/games/magisch-strand-avontuur/screens/word-choice/useWordChoiceState.ts) · **Talige focus:** receptief (woordherkenning)

**Loop:**
1. Een ronde bestaat uit een reeks vragen; het aantal is **data-gestuurd** (`instructions.length`), niet hardcoded. ✅ Dit is de correcte, bewust gekozen aanpak: de rondelengte volgt de content en is dus variabel. De oude GDD ("10 vragen") wordt hierop aangepast → [T-07](#12-takenlijst).
2. De bovenbalk toont de vraag (bv. *"Waar is de dolfijn?"*) met spraaksynthese en optioneel een instructievideo.
3. Het kind tikt een keuzekaart aan (`answerOptions`, 2–4 kaarten):
   - **Goed** → `feedback.kind = "correct"`; kaart licht groen op, succestekst; als er **geen hint** is gebruikt volgt een **bonus** (`+1` extra ster én tempo).
   - **Fout** → `feedback.kind = "almost"`; vriendelijke tip (`feedbackCopy.almost` of de hint); woord wordt als "moeilijk" onthouden; geen verlies.
4. **Hint** (indien aan in instellingen): toont `instruction.hint` en markeert de vraag als "met hulp".
5. **Audio herhalen**: onbeperkt; elke herhaling wordt geteld (`audioRepeatsByInstruction`).
6. Na de laatste vraag: `isCompleted = true` → in-game **eindscherm** (`SCR_MSA_OV_WORDCHOICE_SUMMARY`) met sterren, tempo, en aantal goed direct/met hint. Knoppen: **Opnieuw** (`restartRound`) of **Menu**.

**Beloning per goed antwoord:** `earnedWordStars = instruction.reward.wordStars + (bonus ? 1 : 0)`, idem voor tempo. Bonus = geen hint gebruikt.

### 4.3 `MODE_ZEG_ZET` — Zeg & Zet (Scene Builder)

**Scherm:** `SCR_MSA_SCENE_BUILDER` · **Bron:** [screens/scene-builder/](../../src/app/games/magisch-strand-avontuur/screens/scene-builder/) · **Talige focus:** relationeel (zinsbegrip + ruimtelijke taal)

**Loop:**
1. De opdracht wordt gesproken en getoond (bv. *"Zet de boot in de zee"*), met mascotte en instructiekaart.
2. Het kind voert de plaatsing uit via één van **drie** invoerwegen (zie sectie 5):
   - **Tap:** object in de `ObjectCarousel` selecteren → op het strand tikken (`scene-tap-target`).
   - **Sleep:** drag-and-drop van object naar doelzone.
   - **Stem:** microfoon → commando inspreken → parser bepaalt object + relatie + zone.
3. De plaatsing wordt vergeleken met de doelzone(s) van de instructie (`placement.zoneId`, `relation`, `anchorObjectIds`).
   - **Goed** → `scene-builder-feedback` met `data-kind="correct"`; `FloatingSuccessToast` (`SCR_MSA_OV_SUCCESS_TOAST`); actieknop wordt **Volgende**.
   - **Bijna/fout** → `data-kind="almost"`; herstelbare feedback, geen straf; object kan opnieuw opgepakt/geplaatst worden.
4. **Hint** (`TargetZoneHint`): de doelzone pulseert/licht op (`target-zone-hint-boundary`, `target-zone-hint-magic-rings`).
5. **Toetsenbord-fallback** (`SCR_MSA_OV_KEYBOARD`): typ het commando als spraak niet kan.

**Detail zone-matching en geometrie:** zie [logic/scene-zones.ts](../../src/app/games/magisch-strand-avontuur/logic/scene-zones.ts) en `screens/scene-builder/logic/scene-geometry-utils.ts` — wordt in het gameplay-detaildocument uitgewerkt.

### 4.4 `MODE_ZEG_VLIEG` — Zeg & Vlieg (Voice Side-Scroller)

**Scherm:** `SCR_MSA_VOICE_SCROLLER` · **Bron:** [screens/voice-side-scroller/](../../src/app/games/magisch-strand-avontuur/screens/voice-side-scroller/) · **Talige focus:** productief (actief benoemen)

**Statusmachine** (`VoiceSideScrollerStatus`): `ready` → `running` → `game-over`.

**Loop:**
1. **Start-overlay** (`SCR_MSA_OV_ZEGVLIEG_START`) legt de ronde uit.
2. Tijdens `running` vliegt de held continu van links naar rechts; `scrollX` en `distance` lopen op.
3. **Besturing:** een duim-rail regelt traploos de vlieghoogte (`playerY`).
4. **Doelen** (`VoiceSideScrollerTarget`): als een object (boot, krab, dolfijn, …) in beeld komt, spreekt het kind de naam uit → bij herkenning wordt het object verzameld (score + tempo-boost + educatie-observatie per woord).
5. **Obstakels** (`cloud`, `seagull`, `shark`, `sea-lion`): raken geeft een `collisionSlowdownMs`-vertraging en telt `obstacleHits` — geen "game over"-straf per botsing, wel snelheidsverlies.
6. **Ronde-einde** (`game-over` → `SCR_MSA_OV_ZEGVLIEG_SUMMARY`): meters, sterren, score en per-woord observaties.

**Educatie-tracking:** per doelwoord wordt bijgehouden of het herkend is, aantal pogingen, hints en of extra oefening nodig is (`VoiceSideScrollerWordEducationState`).

### 4.5 Samenvattend: verschillen tussen de modi

| Aspect | Kies het Woord | Zeg & Zet | Zeg & Vlieg |
| :--- | :--- | :--- | :--- |
| Kernvaardigheid | Herkennen | Plaatsen in context | Zelf benoemen |
| Invoer | Tap | Tap / sleep / stem / toetsenbord | Stem + duim-rail |
| Realtime? | Nee (per vraag) | Nee (per opdracht) | Ja (continu, frame-loop) |
| Ronde-einde | In-game summary | 🔴 **In-game summary (nog te bouwen)** | In-game summary |
| Fout = straf? | Nee | Nee | Nee (alleen snelheidsverlies) |

> 🔴 **Te fixen (review-beslissing):** **alle drie** de modi moeten een eigen **in-game ronde-eindscherm** krijgen. Kies het Woord en Zeg & Vlieg hebben dit al (`SCR_MSA_OV_WORDCHOICE_SUMMARY`, `SCR_MSA_OV_ZEGVLIEG_SUMMARY`). **Zeg & Zet loopt nu door richting het beloningsscherm zonder eigen samenvatting — dat is niet correct** en moet worden rechtgezet met een eigen ronde-einde (`SCR_MSA_OV_SCENE_SUMMARY`). Zie [T-03](#12-takenlijst). Hetzelfde geldt voor de nieuwe modus `zeg-en-bouw` zodra die er is.

### 4.6 Beslissingen (review)

- ✅ **Rondelengte Kies het Woord** — de **data-gestuurde** aanpak (`instructions.length`) is de **correcte methode**. De oude GDD ("10 vragen") is achterhaald en moet worden aangepast → [T-07](#12-takenlijst). Rondes zijn dus variabel van lengte, afhankelijk van de content.
- ✅ **Modus `zeg-en-bouw`** — krijgt een **eigen scherm** (`SCR_MSA_ZEG_BOUW`) en wordt een volwaardige, aparte modus naast Zeg & Zet → [T-04](#12-takenlijst). De exacte mechanica van deze modus moet nog worden ontworpen.
- ✅ **Beloningen** — er komt **één** beloningssysteem (zie sectie 7). De oude GDD (4 bezems op 0/10/25/50) is achterhaald en wordt aangepast → [T-09](#12-takenlijst).

---

## 5. Invoer & Spraaktechnologie

> Bron: [hooks/useDutchSpeechRecognition.ts](../../src/app/games/magisch-strand-avontuur/hooks/useDutchSpeechRecognition.ts), [logic/spoken-command-parser.ts](../../src/app/games/magisch-strand-avontuur/logic/spoken-command-parser.ts), [logic/speech-recognition.ts](../../src/app/games/magisch-strand-avontuur/logic/speech-recognition.ts), [logic/microphone-permission.ts](../../src/app/games/magisch-strand-avontuur/logic/microphone-permission.ts).

### 5.1 Vier gelijkwaardige invoermethoden

| Methode | Waar | Kernprincipe |
| :--- | :--- | :--- |
| **Tap** | Alle modi | Grote touch-targets; primaire methode voor de jongste kinderen |
| **Drag-and-drop** | Zeg & Zet | Object naar zone slepen; motorische verankering |
| **Stem (microfoon)** | Zeg & Zet, Zeg & Vlieg | Web Speech API via het platform-runtime-contract |
| **Toetsenbord** | Zeg & Zet (`SCR_MSA_OV_KEYBOARD`) | Fallback voor stille omgevingen of falende spraak |

**Ontwerpregel:** elke gesproken opdracht moet óók via tap/sleep/toetsenbord uitvoerbaar zijn. Spraak is nooit de enige weg (toegankelijkheid + robuustheid).

### 5.2 Spraakherkenning — configuratie per scherm

De hook `useDutchSpeechRecognition` wordt **per scherm anders geconfigureerd**. De werkelijke waarden:

| Parameter | Hook-default | Zeg & Zet | Zeg & Vlieg |
| :--- | :--- | :--- | :--- |
| `continuous` | `false` | `true` | `true` |
| `interimResults` | `false` | `true` | `true` |
| `maxAlternatives` | `3` | (default 3) | `8` |
| `autoStopMs` | `15000` | `25000` | `0` (geen auto-stop) |
| `silenceStopMs` | — | `4000` | — |
| `restartOnEnd` | `false` | `false` | `true` |
| **Taal** | `nl-NL` | `nl-NL` | `nl-NL` |

> ⚠️ **Let op:** de waarden in de oude GDD (`continuous: true`, `maxAlternatives: 8`, `silenceStopMs: 2500`) waren slechts **voorbeelden**, geen vastgestelde norm. De tabel hierboven geeft de **huidige** waarden in de code. De **definitief juiste** waarden per scherm moeten nog worden **getest en bepaald** (bv. hoeveel stiltetijd een kind echt nodig heeft) → [T-10](#12-takenlijst). Werk daarna zowel deze tabel als de oude GDD bij → [T-09](#12-takenlijst).

**Statussen** (`VoiceRecognitionStatus`): `idle` → `processing` → `listening` → `heard` / `error` / `unsupported`. Bij Zeg & Vlieg herstart de sessie automatisch (`restartOnEnd`) zodat het kind meerdere objecten achter elkaar kan benoemen.

### 5.3 Commando-ontleding (Zeg & Zet)

`parseSpokenPlacementCommand` ontleedt een gesproken zin in drie delen — **object**, **ruimtelijk begrip** en **zone/anker** — en bepaalt een betrouwbaarheidsniveau:

| Confidence | Betekenis | Gevolg in UI |
| :--- | :--- | :--- |
| `high` | object + relatie + (zone óf anker) herkend | Commando wordt uitgevoerd |
| `needs-choice` | object + één van (relatie/zone) herkend | Vraag om verduidelijking / keuze |
| `needs-help` | te weinig herkend | Toon hulp / stel toetsenbord voor |

**Robuustheid:** de parser normaliseert transcripties (kleine letters, accenten weg, leestekens weg), ondersteunt **kindertaal- en synoniem-aliassen** (bv. `krab` ← "krabben"; `boot` ← "bootje", "zeilboot", "schip"; `vlieger` ← "kite"), en kent aliassen voor zones (bv. `zee` ← "water", "in het water") en begrippen (bv. `onder` ← "beneden", "laag"). Bij meerdere kandidaten wint het langste/meest specifieke alias en een vaste prioriteit voor ruimtelijke begrippen (`tussen` > `naast` > `onder` > …).

### 5.4 Foutafhandeling & kindvriendelijke meldingen

Elke foutcode krijgt een geruststellende, Nederlandse melding (bron: `getSpeechRecognitionErrorMessage`):

| Foutcode | Melding (kindtaal) |
| :--- | :--- |
| `no-speech` | "Ik hoorde nog geen zin. Probeer het nog eens rustig." |
| `not-allowed` / `service-not-allowed` | "De microfoon mag nog niet gebruikt worden. Controleer de toestemming." |
| `audio-capture` | "Ik kan de microfoon niet vinden. Controleer de microfoon van dit apparaat." |
| `network` | "Spraakherkenning heeft nu geen verbinding. Probeer het later opnieuw." |
| `language-not-supported` | "Nederlandse spraakherkenning wordt in deze browser niet ondersteund." |

Ondersteuningsproblemen worden apart gemeld (bv. onveilige context/HTTP i.p.v. HTTPS, of ontbrekende API → "Gebruik de fallback of probeer Chrome"). Elke fout wordt gelogd via `diagnostics.log` met herstelpad `typed-input-or-retry`.

### 5.5 Microfoontoestemming & privacy

- Toestemming wordt beheerd via [logic/microphone-permission.ts](../../src/app/games/magisch-strand-avontuur/logic/microphone-permission.ts) en is zichtbaar in de instellingen (`settings-microphone-permission-message`, `settings-request-microphone-button`).
- **Privacy-uitgangspunt:** spraak wordt lokaal in de browser verwerkt en **niet opgeslagen**; alleen de (tekst)transcriptie wordt kortstondig gebruikt voor herkenning. Zie sectie 8 en `SCR_MSA_OV_VOICE_PRIVACY`.

### 5.6 Randgevallen om te testen (input naar Test-matrix)

- Microfoon geweigerd → valt de UI netjes terug op toetsenbord?
- Geen spraak / onverstaanbaar → juiste melding + herstel?
- Onveilige context (HTTP) op mobiel → correcte support-melding?
- Spraak niet ondersteund in browser → fallback zichtbaar?
- Zeg & Vlieg: meerdere objecten snel achter elkaar → herstart de sessie correct?

---

## 6. Content & Curriculum

> **Enige bron van waarheid voor content:** [content.ts](../../src/app/games/magisch-strand-avontuur/content.ts). Alle aantallen hieronder zijn geteld in die file (contentversie `magisch-strand-avontuur-2026.07`). De wereld heet intern `beach-world-1` ("Strandwereld", aanbevolen leeftijd 4–7 jaar).

### 6.1 Doelwoorden (objecten)

De strandwereld bevat op dit moment **12 objecten** (`beachObjects`). De "10" uit de oude GDD was slechts een **voorbeeld**; **12 is correct** en het aantal kan in de toekomst **groeien** (meer objecten, meer werelden). De woordenschat is dus een uitbreidbare lijst, geen vast getal — de oude GDD moet hierop worden aangepast → [T-08](#12-takenlijst).

| Woord-ID | Label | Lidwoord | Categorie | Niveau | Meervoud |
| :--- | :--- | :--- | :--- | :--: | :--- |
| `WORD_DOLFIJN` | dolfijn | de | dieren | 2 | dolfijnen |
| `WORD_BOOT` | boot | de | voertuigen | 1 | boten |
| `WORD_VUURTOREN` | vuurtoren | de | plekken | 3 | vuurtorens |
| `WORD_VLIEGTUIG` | vliegtuig | **het** | voertuigen | 2 | vliegtuigen |
| `WORD_VLIEGER` | vlieger | de | strandspullen | 2 | vliegers |
| `WORD_BAL` | bal | de | strandspullen | 1 | ballen |
| `WORD_PARASOL` | parasol | de | strandspullen | 2 | parasols |
| `WORD_SCHELP` | schelp | de | strandspullen | 2 | schelpen |
| `WORD_KRAB` | krab | de | dieren | 2 | krabben |
| `WORD_ZANDKASTEEL` | zandkasteel | **het** | strandspullen | 2 | zandkastelen |
| `WORD_HANDDOEK` | handdoek | de | strandspullen | 1 | handdoeken |
| `WORD_ZON` | zon | de | natuur | 1 | zonnen |

> Elk object heeft ook een `emoji`, een `assetPath` (transparante PNG-sticker) en `tags`. De lidwoorden `de`/`het` zijn didactisch belangrijk voor NT2 (vgl. `het vliegtuig`, `het zandkasteel`). De kindertaal-/synoniem-aliassen per woord staan in sectie 5.3.

### 6.2 Ruimtelijke begrippen

11 begrippen (`beachSpatialConcepts`), didactisch oplopend van concreet naar relationeel:

| Type | Begrippen (`CONCEPT_*`) |
| :--- | :--- |
| Absoluut / statisch | `in`, `op`, `boven`, `onder` |
| Lateraal | `links`, `rechts`, `midden` |
| Relationeel (t.o.v. anker) | `naast`, `tussen`, `dichtbij`, `ver weg` |

### 6.3 Scène-zones

De scene kent **9 vaste zones** (`beachZones`), elk met een polygon-hintpad en een lijst ondersteunde begrippen:

`lucht`, `zee`, `links-zee`, `boven-zee`, `ver-weg-zee`, `eiland`, `strand`, `midden-strand`, `rechts-strand`.

Daarnaast zijn er **dynamische, relationele zones** die tijdens het spel worden berekend uit de actuele positie van ankerobjecten (bv. `handdoek-zone`, `naast-schelp`, `dichtbij-parasol`, `tussen-bal-zandkasteel`). ⚠️ Deze staan **niet** in `beachZones` maar worden runtime bepaald — een testrisico: een opdracht als `lp-008` verwijst naar `handdoek-zone` die alleen bestaat als het ankerobject geplaatst is.

### 6.4 Opdrachten (instructies)

| Modus | Aantal | ID-reeks | Niveaus |
| :--- | :--: | :--- | :--- |
| Zeg & Zet (`sceneBuilderInstructions`) | **16** | `lp-001` … `lp-016` | 1–3 |
| Kies het Woord (`vocabularyChoiceInstructions`) | **12** | `cw-001` … `cw-012` | 1–3 |

> ⚠️ **Belangrijk:** Kies het Woord heeft **12** vragen in de content, niet "10" zoals de oude GDD stelt. Het aantal keuzekaarten per vraag loopt op van 2 (niveau 1) naar 4 (niveau 3), met een `distractorStrategy` die moeilijker wordt (`different-category` → `same-theme` → `same-category`).

**Opbouw van een Zeg & Zet-opdracht** (voorbeeld `lp-016`, niveau 3):
- *Prompt/audio:* "Leg de schelp tussen de bal en het zandkasteel."
- *Object:* `schelp` · *Relatie:* `tussen` · *Ankers:* `bal`, `zandkasteel` · *Zone:* `tussen-bal-zandkasteel` (dynamisch)
- *Hint:* "Tussen betekent in het midden van twee dingen."
- *Beloning:* `{ speed: 1, wordStars: 1 }`

De opdrachten lopen didactisch op: niveau 1 = statische plaatsing in één zone (`in de zee`, `op het strand`); niveau 2 = lateraal/relatief (`rechts`, `naast`, `midden`); niveau 3 = complex relationeel met meerdere ankers (`dichtbij`, `ver weg`, `tussen`).

### 6.5 Feedbackteksten

Elke opdracht draagt een `feedbackCopy`-object met kindvriendelijke varianten (`correct`, `almost`, `tryAgain`, `repeatAfterSuccess`). De nazegzin (`repeatAfterSuccess`) ontdoet de succestekst van uitroepen ("Goed zo!") zodat het kind een schone modelzin nazegt. Dit is didactisch bewust (uitspraakmodel).

### 6.6 Openstaande punten (sectie 11)

- ✅ Woordenlijst is uitbreidbaar; 12 correct → oude GDD aanpassen ([T-08](#12-takenlijst)).
- ✅ Rondelengte data-gestuurd → oude GDD aanpassen ([T-07](#12-takenlijst)).
- ⚠️ Content is momenteel **één vaste set** per modus; er bestaat randomisatielogica ([instruction-randomization.ts](../../src/app/games/magisch-strand-avontuur/logic/instruction-randomization.ts)) — te documenteren hoe/of die de volgorde of selectie beïnvloedt → [T-16](#12-takenlijst).

---

## 7. Beloningen, Progressie & Economie

> **Beslissing (review):** er komt **één** beloningssysteem. De drie bestaande definities (7.2) worden teruggebracht tot één bron van waarheid. De gekozen methode staat in 7.2.b.

### 7.1 Valuta

| Valuta | Symbool | Verdiend bij | Basis | Bonus |
| :--- | :--: | :--- | :--- | :--- |
| **Woordsterren** | ⭐ | Elk goed antwoord | `reward.wordStars` (= 1) | `+1` als **geen hint** gebruikt |
| **Tempo** | ⚡ | Elk goed antwoord | `reward.speed` (= 1) | `+1` als **geen hint** gebruikt |

Per goede actie zonder hint verdient het kind dus ⭐×2 en ⚡×2; mét hint ⭐×1 en ⚡×1 (bron: [useWordChoiceState.ts](../../src/app/games/magisch-strand-avontuur/screens/word-choice/useWordChoiceState.ts), `handleAnswerSelect`).

### 7.2.a De drie bestaande definities (worden geconsolideerd)

Vandaag bestaan er drie definities naast elkaar. Deze worden vervangen door één (7.2.b):

| # | Waar gedefinieerd | Inhoud | Drempels | Nu gebruikt? | Lot |
| :-- | :--- | :--- | :--- | :--- | :--- |
| **A** | [logic/rewards.ts](../../src/app/games/magisch-strand-avontuur/logic/rewards.ts) `firstRewardUnlocks` | 2 items | sticker: ≥1 ⭐; kleur: ≥1 ⚡ | ✅ enige actieve | *Mechanisme behouden, inhoud vervangen* |
| **B** | [content.ts](../../src/app/games/magisch-strand-avontuur/content.ts) `beachRewards` | 4 items | 5 / 10 / 15 / 20 ⭐ | ❌ dode data | *Verwijderen* |
| **C** | oude GDD.md | 4 bezems | 0 / 10 / 25 / 50 ⭐ | ❌ alleen doc | *Verwijderen* |

**Waarom het nu niet werkt:** het actieve systeem (A) geeft al zijn unlocks weg bij de **allereerste** goede actie (drempel ≥1) en stopt daarna. Er is geen opbouw, geen doel om naartoe te werken — dat verklaart waarom het "niet af voelt".

### 7.2.b ✅ Het gekozen systeem: "Strandschat" — één oplopende verzamelcurve

**Eén bron van waarheid, één valuta, één resolver.** Dit is de aanbevolen methode omdat die past bij het concept (educatief, foutloos leren, jonge kinderen die verzamelen leuk vinden) en meteen het progressie-probleem oplost.

**Ontwerpprincipes:**

1. **Eén valuta stuurt de progressie: ⭐ woordsterren** (`totalWordStars`, cumulatief over alle sessies). ⚡ Tempo blijft een *in-ronde* gevoel/boost, maar bepaalt géén unlocks — zo hoeven we maar één meter te bewaken.
2. **Eén reward-tabel** (`strandRewards`) als enige bron: een geordende lijst verzamelbare items, elk met een **oplopende** drempel. Types: `sticker`, `broom-skin`, `broom-color`, `broom-trail` (allemaal cosmetisch — nooit iets dat leren blokkeert).
3. **Eén resolver** (`resolveNewRewardUnlocks({ totalWordStars, unlockedRewardIds })`) die alle schermen aanroepen. Verwijdert het onderscheid A/B/C.
4. **Oplopende curve** zodat er altijd een volgend doel is. Voorbeeldwaarden (nog te **tunen en testen** → [T-02](#12-takenlijst)):

   | Volgorde | Item (voorbeeld) | Type | Drempel ⭐ |
   | :--: | :--- | :--- | :--: |
   | 1 | Schelp-sticker | sticker | 3 |
   | 2 | Zeeblauwe bezemkleur | broom-color | 6 |
   | 3 | Dolfijn-sticker | sticker | 10 |
   | 4 | Strand-sprankel (trail) | broom-trail | 15 |
   | 5 | Strandbezem (skin) | broom-skin | 22 |
   | 6 | Ster-helper sticker | sticker | 30 |
   | 7 | Gouden bezem (skin) | broom-skin | 45 |

5. **Uitbreidbaar:** meer items of werelden = regels toevoegen aan één tabel; de resolver en UI blijven gelijk.

**Wat dit vervangt/oplost:** systeem A wordt qua *mechanisme* behouden maar gevoed door de nieuwe tabel; B (`beachWorld.rewards`) en C (oude GDD) worden verwijderd. Zie [T-01](#12-takenlijst) (implementatie) en [T-02](#12-takenlijst) (curve tunen).

> **Nog te beslissen bij implementatie:** definitieve itemlijst, assets en exacte drempels. De structuur hierboven ligt vast; de getallen zijn voorbeelden.

### 7.3 Waar beloningen verschijnen

- **Tijdens het spel:** nieuwe unlocks worden direct getoond bij een goed antwoord (rewardLabels in de feedback), en opgeslagen.
- **Beloningsscherm** (`SCR_MSA_REWARD`, [RewardScreen.tsx](../../src/app/games/magisch-strand-avontuur/screens/reward/RewardScreen.tsx)): toont de "featured" beloning (`newRewards[0] ?? firstRewardUnlocks[0]`) en de ontgrendelde items — eveneens gevoed door systeem A.

### 7.4 Progressie- & observatiemodel

Naast valuta houdt de game een rijk **observatiemodel** bij (`BezemEscapeProgress`, bron: [types.ts](../../src/app/games/magisch-strand-avontuur/types.ts) + [logic/progress.ts](../../src/app/games/magisch-strand-avontuur/logic/progress.ts)). Per profiel:

- `totalWordStars`, `totalSpeed` — cumulatieve valuta
- `practicedWords`, `recognizedWords`, `activelyNamedWords` — per woord, hoe vaak geoefend/herkend/zelf benoemd
- `spatialConcepts[concept]` en `languageDomains[domain]` — elk met `practiced / correctWithoutHelp / correctWithHelp / needsPractice`
- `misunderstoodSpeechAttempts`, `selfMadeSentences(WithHelp/WithoutHelp)`, `autoExecutedSpokenCommands`
- `attempts[]` — de volledige lijst ruwe `BezemEscapePracticeEvent`-records
- `unlockedRewards[]`

Dit model voedt het platform-voortgangsscherm (`SCR_PLAT_PROGRESS`) en is de basis voor begeleiders-inzicht — zonder cijfers of toetsdruk (zie sectie 2.4).

### 7.5 Instellingen die de economie beïnvloeden

Per-profiel instellingen (`BezemEscapeSettings`, bron: [logic/settings.ts](../../src/app/games/magisch-strand-avontuur/logic/settings.ts), default alles aan behalve `reducedMotion`):

| Instelling | Default | Effect op economie/gameplay |
| :--- | :--: | :--- |
| `audioEnabled` | aan | Uit → gesproken opdracht vervalt; UI vraagt samen hardop te lezen |
| `hintsEnabled` | aan | Uit → geen hints; beïnvloedt indirect de bonus (geen hint = bonus) |
| `musicEnabled` | aan | Achtergrondmuziek aan/uit |
| `reducedMotion` | uit | Beperkt animaties (toegankelijkheid, zie sectie 9) |

### 7.6 Opslag (vooruitblik naar sectie 8)

Valuta en unlocks worden lokaal bewaard onder sleutels als `magisch-strand-avontuur:{profileId}:unlocked-rewards` en `…:settings`. De rijke observaties lopen via het platform-`practice`-kanaal naar IndexedDB. Details in sectie 8.

### 7.7 Openstaande punten (sectie 11)

- ✅ **Besloten:** één beloningssysteem ("Strandschat", 7.2.b). Implementeren → [T-01](#12-takenlijst); curve tunen → [T-02](#12-takenlijst).
- ✅ **Besloten:** `beachWorld.rewards` (systeem B) verwijderen → onderdeel van [T-01](#12-takenlijst).
- ⚠️ Bevestigen dat het platform-voortgangsscherm het volledige observatiemodel correct weergeeft → [T-17](#12-takenlijst).

---

## 8. Data, Opslag & Privacy

> Hoofdlijn. De architecturale besluiten staan in de platform-ADR's: [adr-001 (IndexedDB/Dexie & migratie)](../architecture/adr-001-indexeddb-dexie-en-migratiebeleid.md), [adr-002 (practice-events projector & retentie)](../architecture/adr-002-practice-events-projector-en-retentie.md), [adr-003 (offline-pakketten & performancebudgetten)](../architecture/adr-003-workbox-offlinepakketten-en-performancebudgetten.md).

### 8.1 Twee opslaglagen

De game slaat data op via het platform-runtime-contract (`RuntimeStorage` en het `practice`-kanaal), in twee lagen:

| Laag | Waarvoor | Techniek | Kenmerk |
| :--- | :--- | :--- | :--- |
| **Lichte key-value** | Instellingen, gekozen wereld, unlocks, privacy-akkoord | `RuntimeStorage` (per profiel) | Klein, synchroon, direct leesbaar |
| **Rijke observaties** | `BezemEscapePracticeEvent`-records | IndexedDB via Dexie (platform) | Groeit mee; onderworpen aan retentiebeleid |

### 8.2 Opslagsleutels (game-niveau)

Alle game-sleutels zijn geprefixt met `magisch-strand-avontuur:`. Per profiel:

| Sleutel | Inhoud |
| :--- | :--- |
| `…:{profileId}:settings` | Audio/muziek/hints/reducedMotion (`BezemEscapeSettings`) |
| `…:{profileId}:selected-world` | Laatst gekozen wereld |
| `…:{profileId}:unlocked-rewards` | Lijst ontgrendelde beloning-ID's (systeem A, zie 7.2) |
| `…:{profileId}:voice-privacy:{VERSION}` | Of de microfoon-privacynotice is geaccepteerd |

Niet-profielgebonden sleutels/events: `…:reward-result`, `…:zone-visual-hint-overrides` (dev-tool), en de events `…:settings-changed`, `…:foreground-audio-start/end`.

> **Versiebeheer privacynotice:** de sleutel bevat een versiedatum (`VOICE_PRIVACY_NOTICE_VERSION = "2026-06-01"`). Wijzigt de privacytekst, dan verandert de versie en wordt opnieuw om akkoord gevraagd — een bewust privacy-ontwerp.

### 8.3 Wat wél en niet wordt opgeslagen (privacy)

**Uitgangspunt (AVG/COPPA-vriendelijk):**

- ✅ **Wel:** tekstuele oefenobservaties (welk woord/begrip, met/zonder hulp, reactietijd), instellingen, unlocks — allemaal **lokaal** per profiel.
- ❌ **Niet:** géén geluidsopnames, géén audio-uploads, géén externe tracking, géén cookies/advertenties/aankopen.

De microfoon zet uitsluitend een **korte zin om naar tekst**; die tekst kan als oefenobservatie bij de voortgang komen. Officiële formulering (bron: [logic/voice-privacy.ts](../../src/app/games/magisch-strand-avontuur/logic/voice-privacy.ts), getoond in `SCR_MSA_OV_VOICE_PRIVACY` en de instellingen):

> *"De app bewaart geen geluidsopnames. De microfoon wordt alleen gebruikt om een korte zin naar tekst om te zetten. Die tekstzin kan als oefenobservatie bij de voortgang staan."*

### 8.4 Betrouwbaarheid & integriteit

- **Veilige tijdsafronding:** reactietijden/tijdsduren worden geheeltallig en niet-negatief afgerond (`Math.round(Math.max(0, ms))`) om schemavalidatiefouten in de database te voorkomen.
- **Schema-validatie:** instellingen en unlocks worden met `zod` gevalideerd bij lezen/schrijven; bij corrupte data valt de game terug op defaults (geen crash).
- **Retentie:** het aantal bewaarde `attempts` valt onder het platform-retentiebeleid (zie adr-002).

### 8.5 Offline & synchronisatie

De game is als PWA offline speelbaar; assets worden via een offline-pakket voorzien (`offlinePackages` in [manifest.ts](../../src/app/games/magisch-strand-avontuur/manifest.ts), `magisch-strand-avontuur-beach-v1`). Mediasynchronisatie en cache-strategie vallen onder adr-003 en de PWA-laag (`src/app/pwa/`).

### 8.6 Openstaande punten (sectie 11)

- Bevestigen dat "voortgang resetten" (`SCR_MSA_OV_RESET_CONFIRM`) **alle** relevante sleutels én de IndexedDB-observaties wist (niet alleen de valuta).
- Bevestigen dat data strikt per profiel gescheiden blijft (geen lekken tussen kindprofielen).

---

## 9. Toegankelijkheid & Non-functionele Eisen

> De toegankelijkheidsregels zijn **normatief** vastgelegd in [docs/accessibility/gedeeld-interactiecontract.md](../accessibility/gedeeld-interactiecontract.md). Deze sectie vat de eisen samen die specifiek voor deze game gelden.

### 9.1 Toegankelijkheid (a11y)

| Eis | Concreet |
| :--- | :--- |
| **Touch-targets** | Kindgerichte doelen minimaal **48×48 CSS-pixels** |
| **Toetsenbord/focus** | Elke interactieve primitive heeft een zichtbare `focus-visible`-ring (niet alleen kleur); focus volgt de leesvolgorde |
| **Semantiek** | Native `button type="button"`; icon-only knoppen hebben een expliciete `aria-label` |
| **Voortgang** | `role="meter"` met naam, min, max en actuele waarde |
| **Toggles/selectie** | `aria-pressed=true|false` (de `false` mag niet worden weggelaten) |
| **Tekst altijd beschikbaar** | Opdracht, fout en succes zijn altijd als **tekst** aanwezig; audio/video is aanvullend, nooit exclusief |
| **Beweging** | `MotionConfig reducedMotion="user"` als gedeelde bron; `reducedMotion`-instelling per profiel |
| **Betekenis van knoppen** | "Terug" = één niveau terug; "Verlaten" = terug naar menu/app — nooit hetzelfde icoon met wisselende betekenis |

**Multimodale gelijkwaardigheid (kernprincipe):** elk gesproken commando is óók via tap/sleep/toetsenbord uitvoerbaar (zie sectie 5.1). Geen enkele leerhandeling mag uitsluitend via spraak of uitsluitend via hover bereikbaar zijn.

**Foutloos leren als a11y-principe:** onbeperkte herhaling van instructies zonder tijdstraf; geen "fout!"-geluid; geen verlies van voortgang (zie sectie 2.3).

### 9.2 Non-functionele eisen

| Categorie | Eis / uitgangspunt |
| :--- | :--- |
| **Platform** | Cross-platform web (PWA); Chrome/Safari/Edge; primair tablets |
| **Oriëntatie** | Portret én landschap ondersteund (`supportedOrientations`) met safe-area insets |
| **Offline** | Speelbaar zonder netwerk na installatie offline-pakket |
| **Performance** | Onder de platform-performancebudgetten (adr-003); vloeiende frame-loop in Zeg & Vlieg |
| **Robuustheid** | Geen blokkerende console-/pagina-fouten; degradeert netjes bij ontbrekende spraak/audio |
| **Privacy/veiligheid** | Lokaal, geen tracking (zie sectie 8) |
| **Taal** | Volledig Nederlands (`nl-NL`), inclusief kindvriendelijke foutmeldingen |

### 9.3 Kwaliteitspoorten (samengevat)

De game valt onder de platform-kwaliteitspoorten (lint, types, unit- en e2e-tests, dependency-cruiser/knip). Zie [docs/architecture/quality-gate-report-2026-07.md](../architecture/quality-gate-report-2026-07.md) en de release-checklist. De concrete, toetsbare acceptatiecriteria per feature/scherm komen in de **Test-matrix**.

### 9.4 Openstaande punten (sectie 11)

- Verifiëren dat álle interactieve elementen in de drie modi voldoen aan 48×48 en `focus-visible` (nog niet integraal getest → ⚪).
- Verifiëren dat `reducedMotion` daadwerkelijk alle zware animaties (parallax, sparkles, vlieg-loop) dempt.
- Landschap/portret-gedrag per scherm bevestigen (met name Zeg & Vlieg en Scene Builder).

---

## 10. Feature-overzicht (samenvatting)

> Dit is een **kaart op hoofdlijn** naar de features, gegroepeerd per scherm. De **volledige** lijst — met per feature een beschrijving, acceptatiecriteria, `data-testid`, verwachte staat en een **status** (🟢🟡🔴⚪🔵⚫) — komt in de **Feature-catalogus** (`FEAT_*`). Dit overzicht dient om te zien *dat* een gebied bestaat en *waar* het hoort; niet om te oordelen of het werkt.

### 10.1 Featuregroepen per scherm

| Scherm (`SCR_*`) | Featuregroep | Voorbeeld-features (indicatief) |
| :--- | :--- | :--- |
| `SCR_MSA_START` | Titel & navigatie | Speelknop, sterrenteller, instellingenknop, terug naar platform |
| `SCR_MSA_MODE_SELECT` | Avontuur kiezen | Wereldkeuze + kaarten voor de modi, start-avontuur-knop, onderbalk-navigatie, beloningen openen |
| `SCR_MSA_SCENE_BUILDER` | Opdracht & instructie | Gesproken/getoonde opdracht, instructievideoknop, mascotte |
| | Invoer: tap/sleep | Object selecteren in carrousel, tikken op strand, drag-and-drop |
| | Invoer: stem | Microfoon, `SpeechWaveAnimation`, commando-parser, Klaar-knop |
| | Invoer: toetsenbord | Fallback-veld, verzenden, sluiten |
| | Feedback & hint | Succes-toast, herstelbare feedback, oplichtende doelzone |
| `SCR_MSA_WORD_CHOICE` | Quizloop | Vraag + audio, 2–4 keuzekaarten, goed/fout-feedback, voortgang, hint, audio herhalen |
| | Eindscherm | In-game samenvatting (sterren, tempo, goed direct/met hint), Opnieuw/Menu |
| `SCR_MSA_VOICE_SCROLLER` | Vlieg-loop | Start-overlay, duim-rail hoogtecontrole, frame-loop, obstakels |
| | Stem-verzamelen | Woordherkenning op zichtbare objecten, score/boost, per-woord observatie |
| | Ronde-einde | Samenvatting (meters, sterren, score) |
| `SCR_MSA_REWARD` | Beloningsweergave | Featured beloning, ontgrendelde items, opnieuw/wereld |
| `SCR_MSA_SETTINGS` | Instellingen | Audio/muziek/hints/reducedMotion-toggles |
| | Microfoon & privacy | Toestemming aanvragen, status, privacykaart |
| | Voortgang resetten | Reset-knop, bevestigingsdialoog (annuleren/bevestigen) |
| **Platform** (`SCR_PLAT_*`) | Onboarding & schil | Welkom, profielkeuze, avatar+naam, themakeuze, gamelijst, voortgang |

### 10.2 Transversale features (over meerdere schermen heen)

| Feature-domein | Waar actief | Kern |
| :--- | :--- | :--- |
| Spraakherkenning | Zeg & Zet, Zeg & Vlieg | Hook + parser + foutafhandeling (sectie 5) |
| Beloning/economie | Alle modi + Reward | Sterren/tempo, unlocks (sectie 7) |
| Observatie/voortgang | Alle modi → Progress | `PracticeEvent`-registratie (sectie 8) |
| Audio/spraaksynthese | Alle schermen | Opdracht voorlezen, nazegzin, geluidseffecten |
| Instellingen-respect | Alle modi | `audioEnabled`/`hintsEnabled`/`reducedMotion` beïnvloeden gedrag |
| Toegankelijkheid | Alle schermen | Interactiecontract (sectie 9) |

### 10.3 Van dit overzicht naar de Feature-catalogus

In de Feature-catalogus krijgt elke regel hierboven een eigen `FEAT_`-ID, een verwacht gedrag, een testhaak (`data-testid`) en een status. Voorbeeld van hoe één regel straks wordt uitgewerkt:

```
FEAT_SCENE_MIC_PLACE
  Scherm:        SCR_MSA_SCENE_BUILDER
  Beschrijving:  Kind spreekt een plaatsingscommando; parser voert de plaatsing uit bij confidence "high".
  Testhaak:      data-testid="repeat-spoken-command", speech-stop-button
  Verwacht:      Bij "Zet de boot in de zee" verschijnt de boot in zone 'zee' + succesfeedback.
  Journey:       JRN_ZEGZET_04_SPREEK
  Test:          TC_SCENE_MIC_HAPPY, TC_SCENE_MIC_DENIED
  Status:        ⚪ (nog te verifiëren)
```

---

## 11. Bekende Gaten & Openstaande Punten

> Dit register bundelt **alle** afwijkingen tussen bedoeld ontwerp en werkelijke code die tijdens het opstellen van deze index zijn gevonden, mét de review-beslissing per punt. Elk punt is gekoppeld aan een taak in **sectie 12 (Takenlijst)**. Prioriteit: **P1** = raakt kernbeleving, **P2** = inconsistentie/opruiming/verificatie, **P3** = documentatie-bijwerking.

### 11.1 Register (bevinding → beslissing → taak)

| ID | Prio | Gebied | Bevinding | Beslissing | Taak |
| :--- | :--: | :--- | :--- | :--- | :--- |
| `GAP-01` | **P1** | Beloningen | Drie conflicterende definities; het actieve systeem geeft alles weg bij de 1e actie → geen progressie | Eén systeem: "Strandschat" (7.2.b) | [T-01](#12-takenlijst), [T-02](#12-takenlijst) |
| `GAP-02` | **P1** | Beloningen | `beachWorld.rewards` (systeem B) is dode data | Verwijderen | [T-01](#12-takenlijst) |
| `GAP-15` | **P1** | Modi | Zeg & Zet heeft **geen** in-game ronde-eindscherm; loopt door naar reward | Alle 3 (straks 4) modi krijgen een eigen ronde-einde | [T-03](#12-takenlijst) |
| `GAP-04` | P2 | Modi | `zeg-en-bouw` bestaat als type, zonder eigen scherm | Eigen scherm + volwaardige modus | [T-04](#12-takenlijst) |
| `GAP-14` | P2 | Schermen | `world-select` en `mode-select` doen hetzelfde (dubbel) | Eén scherm: `SCR_MSA_MODE_SELECT` | [T-05](#12-takenlijst) |
| `GAP-03` | P2 | Schermen | `SCR_MSA_DASHBOARD` is een dode staat | Opruimen uit de enum | [T-06](#12-takenlijst) |
| `GAP-05` | P2 | Spraak | Spraakconfig verschilt per scherm; oude GDD-getallen waren voorbeelden | Juiste waarden testen + doc bijwerken | [T-10](#12-takenlijst), [T-09](#12-takenlijst) |
| `GAP-08` | P2 | Content | Dynamische zones bestaan alleen runtime → risico bij ontbrekend anker | Robuustheid testen/borgen | [T-15](#12-takenlijst) |
| `GAP-09` | P2 | Opslag | Onbevestigd of "reset" álles wist (keys + IndexedDB) | Verifiëren | [T-11](#12-takenlijst) |
| `GAP-10` | P2 | Privacy | Onbevestigd of profielen strikt gescheiden zijn | Verifiëren | [T-12](#12-takenlijst) |
| `GAP-11` | P2 | A11y | 48×48 + `focus-visible` niet integraal geverifieerd | Toevoegen aan a11y-tests | [T-13](#12-takenlijst) |
| `GAP-12` | P2 | A11y | Onbevestigd of `reducedMotion` alle zware animaties dempt | Verifiëren | [T-14](#12-takenlijst) |
| `GAP-06` | P3 | Content | Woordenlijst is uitbreidbaar; 12 correct (GDD zei 10) | Oude GDD aanpassen | [T-08](#12-takenlijst) |
| `GAP-07` | P3 | Content | Rondelengte is data-gestuurd (GDD zei "10") | Oude GDD aanpassen | [T-07](#12-takenlijst) |
| `GAP-13` | P3 | Content | Effect randomisatielogica niet gedocumenteerd | Documenteren | [T-16](#12-takenlijst) |
| `GAP-16` | P2 | Voortgang | Onbevestigd of `SCR_PLAT_PROGRESS` het volledige observatiemodel toont | Verifiëren | [T-17](#12-takenlijst) |

### 11.2 Status van dit document

De GDD-index is met v1.1 **inhoudelijk compleet** als bron van waarheid op hoofdlijn, inclusief de review-beslissingen. De volgende stap is het opstellen van de drie zusterdocumenten, die elk `SCR_*`-, `FEAT_*`- en taak-verwijzingen uit dit document overnemen:

1. **Feature-catalogus** (`FEAT_*`) — werkt sectie 10 volledig uit, met status per feature.
2. **User Journey Map** (`JRN_*`) — rijgt de schermen uit sectie 3 aaneen tot concrete reizen.
3. **Test-matrix** (`TC_*`) — koppelt testcases aan features, journey-stappen en de taken uit sectie 12.

---

## 12. Takenlijst

> **Levend register** van alle implementatie-, verificatie- en documentatietaken die uit dit document volgen. Deze lijst wordt **bijgehouden en uitgebreid** naarmate we de Feature-catalogus, User Journey Map en Test-matrix opstellen (die leveren vrijwel zeker nieuwe taken op).
>
> **Statuslegenda:** ⬜ Open · 🟦 In uitvoering · ✅ Klaar · ⏸️ Geparkeerd
> **Type:** 🔧 Code · 🎨 Ontwerp/beslissing · 🔍 Verificatie/test · 📄 Documentatie

### 12.1 Openstaande taken

| Taak | Prio | Type | Omschrijving | Bron | Status |
| :--- | :--: | :--: | :--- | :--- | :--: |
| **T-01** | **P1** | 🔧 | **Eén beloningssysteem** bouwen: één `strandRewards`-tabel + één resolver; systeem B (`beachWorld.rewards`) en de oude 2-item lijst vervangen/verwijderen | GAP-01, GAP-02 | ⬜ |
| **T-02** | **P1** | 🎨 | Beloningscurve (drempels/items van "Strandschat") ontwerpen, tunen en testen met echte spelsessies | GAP-01 / 7.2.b | ⬜ |
| **T-03** | **P1** | 🔧 | **Zeg & Zet** een eigen in-game ronde-eindscherm geven (`SCR_MSA_OV_SCENE_SUMMARY`), gelijk aan de andere modi | GAP-15 / 4.5 | ⬜ |
| **T-04** | P2 | 🎨🔧 | Modus **`zeg-en-bouw`** ontwerpen én een eigen scherm bouwen (`SCR_MSA_ZEG_BOUW`) | GAP-04 / 4.6 | ⬜ |
| **T-05** | P2 | 🔧 | `world-select` en `mode-select` samenvoegen tot **één** scherm `SCR_MSA_MODE_SELECT`; redundante staat/route opruimen (o.a. `StartScreen.onPlay`) | GAP-14 / 3.6 | ⬜ |
| **T-06** | P2 | 🔧 | Dode staat `dashboard` uit `GameScreenPreview` verwijderen | GAP-03 / 3.3 | ⬜ |
| **T-07** | P3 | 📄 | Oude `docs/GDD.md`: rondelengte = data-gestuurd (niet "10 vragen") | GAP-07 / 6.4 | ⬜ |
| **T-08** | P3 | 📄 | Oude `docs/GDD.md`: woordenlijst = uitbreidbaar, nu 12 (niet vast 10) | GAP-06 / 6.1 | ⬜ |
| **T-09** | P3 | 📄 | Oude `docs/GDD.md`: spraakconfig-waarden waren voorbeelden; verwijzen naar geteste waarden | GAP-05 / 5.2 | ⬜ |
| **T-10** | P2 | 🔍🎨 | Juiste spraakparameters per scherm bepalen en testen (stiltetijd, auto-stop, alternatieven) | GAP-05 / 5.2 | ⬜ |
| **T-11** | P2 | 🔍 | Verifiëren dat "voortgang resetten" **alle** sleutels én IndexedDB-observaties wist | GAP-09 / 8.6 | ⬜ |
| **T-12** | P2 | 🔍 | Verifiëren dat data strikt per kindprofiel gescheiden blijft (geen lek) | GAP-10 / 8.6 | ⬜ |
| **T-13** | P2 | 🔍 | Verifiëren dat alle interactieve elementen 48×48 + `focus-visible` halen in alle modi | GAP-11 / 9.4 | ⬜ |
| **T-14** | P2 | 🔍 | Verifiëren dat `reducedMotion` alle zware animaties dempt (parallax, sparkles, vlieg-loop) | GAP-12 / 9.4 | ⬜ |
| **T-15** | P2 | 🔍🔧 | Robuustheid dynamische zones testen (opdracht met anker dat nog niet geplaatst is) | GAP-08 / 6.3 | ⬜ |
| **T-16** | P3 | 📄 | Effect van `instruction-randomization.ts` op volgorde/selectie documenteren | GAP-13 / 6.6 | ⬜ |
| **T-17** | P2 | 🔍 | Verifiëren dat `SCR_PLAT_PROGRESS` het volledige observatiemodel correct toont | GAP-16 / 7.7 | ⬜ |
| **T-18** | P2 | 🔍 | Resterende ⚪-features verifiëren (o.a. op een echt apparaat met microfoon voor spraak/audio) | Feature-catalogus §0.5 | ⬜ |
| **T-19** | **P1** | 🔧 | **Instructievideo speelt niet af** ("De video-opdracht kan niet worden afgespeeld") in Zeg & Zet en Kies het Woord — video-assets of afspeellogica repareren | Feature-catalogus §0.5 | ⬜ |
| **T-20** | P2 | 🔧 | "Zone Editor (DevTools)"-toggle verbergen voor eindgebruikers in productie (staat nu in het instellingenscherm) | Feature-catalogus §0.5 | ⬜ |
| **T-21** | P2 | 🔍🔧 | Sterrenteller toont **120 ⭐** bij een net aangemaakt profiel — onderzoeken of sterren per-profiel resetten (raakt `GAP-10`) | Feature-catalogus §0.5 | ⬜ |
| **T-22** | P3 | 📄 | GDD-index 4.4 nuanceren: obstakel-botsing in Zeg & Vlieg kan **game-over** veroorzaken (waargenomen) | Feature-catalogus §0.5 | ⬜ |
| **T-23** | P3 | 🔧 | Kies het Woord: kaarten flitsen kort leeg bij doorschakelen — afbeeldingen preloaden | Feature-catalogus §0.5 | ⬜ |
| **T-24** | P2 | 🔍 | Nieuwe e2e-suites voor de ongedekte modi: `word-choice.spec.ts`, `voice-side-scroller.spec.ts`, `reward.spec.ts` | [Test-matrix](Test-matrix.md) §9 | ⬜ |

### 12.2 Aanbevolen volgorde

1. **P1 eerst** — `T-01`, `T-02`, `T-03`: het beloningssysteem en de ontbrekende ronde-eindes zijn de meest voelbare "voelt niet af"-oorzaken.
2. **Structuur opschonen** — `T-04`, `T-05`, `T-06`: dubbele/dode schermen en de nieuwe modus.
3. **Verifiëren via de Test-matrix** — `T-10` t/m `T-17`: bepalen wat écht kapot is versus alleen ongetest.
4. **Documentatie bijwerken** — `T-07`, `T-08`, `T-09`, `T-16`.

### 12.3 Afgeronde taken

*(nog geen — hier verhuizen taken naartoe zodra ze op ✅ staan)*
