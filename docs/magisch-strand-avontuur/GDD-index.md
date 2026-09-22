# 🎮 GDD — Magisch Strand-Avontuur

> **Algemeen game design document.** Beschrijft de game zoals die nu is: gebouwd, getest en werkend. Details per spelmodus staan in vier eigen documenten (§4). Wat nog niet gebouwd is, staat níet hier maar in de [Versie 2-backlog](Versie-2-Backlog.md).

| Veld                  | Waarde                                                                                                 |
| :-------------------- | :----------------------------------------------------------------------------------------------------- |
| **Documentversie**    | `1.0` (opgeschoond dossier)                                                                            |
| **Laatst bijgewerkt** | 2026-09-22                                                                                             |
| **Status**            | 🟢 Actueel — beschrijft de werkende, geteste game                                                      |
| **Bron van waarheid** | De code onder [`src/app/games/magisch-strand-avontuur/`](../../src/app/games/magisch-strand-avontuur/) |

## Het dossier

| Document                                  | Wat je er vindt                                                            |
| :---------------------------------------- | :------------------------------------------------------------------------- |
| **GDD (dit document)**                    | Concept, doelgroep, schermen, gedeelde systemen (spraak, beloningen, data) |
| [Kies het Woord](Modus-Kies-het-Woord.md) | Volledige mechanica van de quiz-modus                                      |
| [Zeg & Zet](Modus-Zeg-en-Zet.md)          | Volledige mechanica van de plaatsingsmodus                                 |
| [Zeg & Bouw](Modus-Zeg-en-Bouw.md)        | Volledige mechanica van de bouwmodus                                       |
| [Zeg & Vlieg](Modus-Zeg-en-Vlieg.md)      | Volledige mechanica van de vliegmodus                                      |
| [Feature-catalogus](Feature-catalogus.md) | Elke functie met testhaak en status                                        |
| [User Journey Map](User-Journey-Map.md)   | De reizen die een kind door de game maakt                                  |
| [Test-matrix](Test-matrix.md)             | Welke test bewijst welke functie                                           |
| [Versie 2-backlog](Versie-2-Backlog.md)   | Alles wat bedacht maar (nog) niet gebouwd is                               |

**ID-conventies:** `SCR_*` scherm · `FEAT_*` functie · `JRN_*` reisstap · `TC_*` testcase · `WORD_*`/`CONCEPT_*` content.

---

## 1. Concept

### 1.1 Pitch

> _Magisch Strand-Avontuur is een spraakgestuurde, educatieve web-game (PWA) waarin kinderen van 4–8 jaar op een strandwereld hun woordenschat, zinsbegrip en ruimtelijke oriëntatie oefenen — door te luisteren, kijken, aanraken én hardop te spreken._

### 1.2 In één oogopslag

| Aspect           | Invulling                                                                 |
| :--------------- | :------------------------------------------------------------------------ |
| **Genre**        | Educatieve serious game / logopedische oefenomgeving                      |
| **Domein**       | Woordenschat, zinsbegrip, ruimtelijke taal                                |
| **Doelgroep**    | 4–8 jaar (groep 1–4), inclusief NT2/meertalig en kinderen met TOS         |
| **Platform**     | PWA: telefoon, tablet en desktopbrowser                                   |
| **Oriëntatie**   | Telefoon: **alleen portret**. Tablet/desktop: portret én landschap        |
| **Capabilities** | `audio`, `microphone`, `offline-package`                                  |
| **Spelmodi**     | 4, allemaal gebouwd en gedekt met tests                                   |
| **Wereld**       | Strand (`beach-world-1`), contentversie `magisch-strand-avontuur-2026.07` |
| **Taal**         | Nederlands (`nl-NL`), ook alle foutmeldingen                              |

### 1.3 Wat de game onderscheidt

1. **Gelijkwaardige invoer** — elke opdracht kan met tikken, slepen, spreken én typen. Spraak is nooit de enige weg.
2. **Geduldige spraakherkenning** — ruime opnameduur, stiltetimer, live golfanimatie, kindertaal-aliassen ("krap" → krab).
3. **Foutloos leren** — geen straf, geen faalgeluid, geen verlies van voortgang. Bij twijfel volgt hulp.
4. **Privacy-first en offline** — spraak wordt lokaal naar tekst omgezet en niet opgeslagen; de game is offline speelbaar.
5. **Observatie zonder toetsdruk** — voortgang is een procesobservatie, geen cijfer.

---

## 2. Doelgroep & didactiek

### 2.1 Persona's

| Persona           | Wie                                | Ontwerpimplicatie                                                   |
| :---------------- | :--------------------------------- | :------------------------------------------------------------------ |
| `PERS_KLEUTER`    | Reguliere kleuter (4–5 jr)         | Grote touch-targets, tap-first, korte opdrachten                    |
| `PERS_TOS`        | Kind met taalontwikkelingsstoornis | Oplichtende doelzones, onbeperkte herhaling, videomodel, extra tijd |
| `PERS_NT2`        | Meertalig / NT2-kind (5–8 jr)      | Lidwoorden uitgesproken (`de boot`, `het vliegtuig`), nazegzinnen   |
| `PERS_BEGELEIDER` | Ouder, logopedist of leerkracht    | Observatiedata per profiel, instellingen, geen toetsdruk            |

### 2.2 De leertrap

De vier modi vormen samen één oplopende lijn, en zijn in die volgorde ontgrendeld:

```
RECEPTIEF          RELATIONEEL       PRODUCTIEF (bouwen)   PRODUCTIEF (tempo)
Herkennen     →    Plaatsen in    →  Zelf een scène    →   Benoemen onder
                   context           samenstellen          tijdsdruk
Kies het Woord     Zeg & Zet         Zeg & Bouw            Zeg & Vlieg
0 ⭐               3 ⭐              8 ⭐                  14 ⭐
```

Drempels staan in [`logic/mode-unlocks.ts`](../../src/app/games/magisch-strand-avontuur/logic/mode-unlocks.ts). Alleen Kies het Woord en Zeg & Zet leveren sterren op, dus de drempels zijn altijd haalbaar (geen deadlock).

### 2.3 Hulpladder (scaffolding)

| Trede | Ingreep                                                              |
| :---- | :------------------------------------------------------------------- |
| 0     | Zelfstandige poging — bonus bij succes zonder hulp                   |
| 1     | Visuele hint: doelzone pulseert / de juiste kaart licht op           |
| 2     | Herhaling: instructie onbeperkt opnieuw                              |
| 3     | Videomodel: animatie toont de handeling                              |
| ✓     | Bekrachtiging: nooit een "fout!"-geluid, nooit verlies van voortgang |

### 2.4 Leerdoelen

| Domein                   | Leerdoel                                       | Modus                   |
| :----------------------- | :--------------------------------------------- | :---------------------- |
| `receptive-vocabulary`   | Doelwoord herkennen tussen afleiders           | Kies het Woord          |
| `sentence-comprehension` | Een gesproken opdracht begrijpen en uitvoeren  | Zeg & Zet, Zeg & Bouw   |
| `spatial-language`       | Ruimtelijke begrippen correct toepassen        | Zeg & Zet               |
| `active-vocabulary`      | Doelwoord zelfstandig en verstaanbaar benoemen | Zeg & Vlieg, Zeg & Bouw |

---

## 3. Schermarchitectuur

De gebruiker beweegt door twee lagen: de **platform-schil** (React Router, [`routes.tsx`](../../src/app/routes.tsx)) en de **game-laag** (interne state-machine, `GameScreenPreview`).

### 3.1 Platform-schermen

| Scherm-ID                 | Route                   | Doel                                                 |
| :------------------------ | :---------------------- | :--------------------------------------------------- |
| `SCR_PLAT_WELCOME`        | `/`                     | Welkom, instap                                       |
| `SCR_PLAT_PROFILE_SELECT` | `/profiles`             | Kindprofiel kiezen of aanmaken                       |
| `SCR_PLAT_AVATAR_SELECT`  | `/avatar`               | Avatar kiezen + naam                                 |
| `SCR_PLAT_HOME`           | `/home`                 | Zone (thema) kiezen                                  |
| `SCR_PLAT_GAMES_LIST`     | `/games/:theme`         | Game kiezen; hier zit de **download-gate** (§8)      |
| `SCR_PLAT_GAME_PLAY`      | `/games/:theme/:gameId` | Host die de game laadt                               |
| `SCR_PLAT_SETTINGS`       | `/settings`             | Platforminstellingen, voortgangsexport, mic-diagnose |
| `SCR_PLAT_PROGRESS`       | `/progress`             | Voortgang per profiel                                |

### 3.2 Game-schermen

De game rendert precies één scherm tegelijk.

| Scherm-ID                | `screenPreview`       | Component                 | Modus                                     |
| :----------------------- | :-------------------- | :------------------------ | :---------------------------------------- |
| `SCR_MSA_START`          | `start`               | `StartScreen`             | —                                         |
| `SCR_MSA_MODE_SELECT`    | `mode-select`         | `AdventureSelectScreen`   | — (wereld + modus in één scherm)          |
| `SCR_MSA_WORD_CHOICE`    | `word-choice`         | `WordChoiceScreen`        | [Kies het Woord](Modus-Kies-het-Woord.md) |
| `SCR_MSA_SCENE_BUILDER`  | `scene-builder`       | `SceneBuilderScreen`      | [Zeg & Zet](Modus-Zeg-en-Zet.md)          |
| `SCR_MSA_ZEG_BOUW`       | `zeg-en-bouw`         | `ZegBouwScreen`           | [Zeg & Bouw](Modus-Zeg-en-Bouw.md)        |
| `SCR_MSA_VOICE_SCROLLER` | `voice-side-scroller` | `VoiceSideScrollerScreen` | [Zeg & Vlieg](Modus-Zeg-en-Vlieg.md)      |
| `SCR_MSA_REWARD`         | `reward`              | `RewardScreen`            | —                                         |
| `SCR_MSA_SETTINGS`       | `settings`            | `GameSettingsScreen`      | —                                         |

### 3.3 Overlays

| Overlay-ID                      | Component                       | Waar                         |
| :------------------------------ | :------------------------------ | :--------------------------- |
| `SCR_MSA_OV_KEYBOARD`           | `TypedCommandFallback`          | Zeg & Zet, Zeg & Bouw        |
| `SCR_MSA_OV_SPEECH_WAVE`        | `SpeechWaveAnimation`           | Zeg & Zet, Zeg & Bouw        |
| `SCR_MSA_OV_VOICE_PRIVACY`      | `VoicePrivacyNotice`            | Bij eerste microfoongebruik  |
| `SCR_MSA_OV_SUCCESS_TOAST`      | `FloatingSuccessToast`          | Zeg & Zet                    |
| `SCR_MSA_OV_SCENE_SUMMARY`      | `SceneBuilderRoundSummary`      | Zeg & Zet                    |
| `SCR_MSA_OV_WORDCHOICE_SUMMARY` | `WordChoiceRoundSummary`        | Kies het Woord               |
| `SCR_MSA_OV_ZEGBOUW_SUMMARY`    | `ZegBouwRoundSummary`           | Zeg & Bouw                   |
| `SCR_MSA_OV_ZEGVLIEG_START`     | `VoiceSideScrollerStartOverlay` | Zeg & Vlieg                  |
| `SCR_MSA_OV_ZEGVLIEG_SUMMARY`   | `VoiceSideScrollerRoundSummary` | Zeg & Vlieg                  |
| `SCR_MSA_OV_RESET_CONFIRM`      | `ConfirmResetDialog`            | Instellingen                 |
| `SCR_MSA_OV_PORTRAIT_GUARD`     | `PortraitGuard`                 | Telefoon in landschap        |
| `SCR_MSA_OV_ZONE_DEVTOOLS`      | `SceneZoneDevTools`             | Zeg & Zet, **dev-only**      |
| `SCR_MSA_OV_UI_PREVIEW`         | `UiBuildingBlocksPreview`       | **dev-only** (`?preview=ui`) |

### 3.4 Navigatie

```
SCR_PLAT_GAME_PLAY → SCR_MSA_START ──┬── SCR_MSA_SETTINGS
                                     └── SCR_MSA_MODE_SELECT ──┬── SCR_MSA_WORD_CHOICE
                                                               ├── SCR_MSA_SCENE_BUILDER
                                                               ├── SCR_MSA_ZEG_BOUW
                                                               ├── SCR_MSA_VOICE_SCROLLER
                                                               └── SCR_MSA_REWARD
```

Elke modus eindigt met een **eigen in-game ronde-eindscherm** met Opnieuw en Menu; niemand komt in een doodlopende staat.

---

## 4. Gedeelde core loop

Alle modi delen dezelfde cyclus:

```
1. HOOR/ZIE opdracht → 2. BEGRIJP → 3. ACTIE (tik/sleep/stem/typ) → 4. BEKRACHTIG → 5. VOLGENDE
```

Bij **elke** actie — goed of fout — schrijft de game een observatie weg via `runtime.practice.append(...)`. Een fout leidt tot een vriendelijke tip; het kind mag opnieuw.

**Randomisatie is de norm.** Elke ronde krijgt een verse, geseede volgorde ([`instruction-randomization.ts`](../../src/app/games/magisch-strand-avontuur/logic/instruction-randomization.ts)): Zeg & Zet respecteert daarbij ankervolgorde, Kies het Woord schudt ook de antwoordkaarten, Zeg & Vlieg schudt doelwoorden met positie-jitter, Zeg & Bouw schudt de bouwkaarten.

De vier modi in het kort:

| Aspect          | Kies het Woord | Zeg & Zet                  | Zeg & Bouw                | Zeg & Vlieg          |
| :-------------- | :------------- | :------------------------- | :------------------------ | :------------------- |
| Kernvaardigheid | Herkennen      | Plaatsen in context        | Zelf een scène bouwen     | Benoemen onder tempo |
| Invoer          | Tik            | Tik / sleep / stem / typen | Tik / stem / typen        | Stem + duim-rail     |
| Realtime        | Nee            | Nee                        | Nee                       | Ja (frame-loop)      |
| Sterren         | Ja             | Ja                         | Ja (incl. compound-bonus) | In-ronde score       |
| Ontgrendeld bij | 0 ⭐           | 3 ⭐                       | 8 ⭐                      | 14 ⭐                |

---

## 5. Invoer & spraak

### 5.1 Vier gelijkwaardige methoden

| Methode | Waar                               | Kernprincipe                                        |
| :------ | :--------------------------------- | :-------------------------------------------------- |
| Tik     | Alle modi                          | Grote touch-targets (≥ 48×48)                       |
| Slepen  | Zeg & Zet                          | Object naar zone; motorische verankering            |
| Stem    | Zeg & Zet, Zeg & Bouw, Zeg & Vlieg | Web Speech API via het platform-runtime-contract    |
| Typen   | Zeg & Zet, Zeg & Bouw              | Overtyp-veld; fallback bij stilte of falende spraak |

**Ontwerpregel:** elke gesproken opdracht is ook zonder stem uitvoerbaar.

### 5.2 Configuratie per modus

`useDutchSpeechRecognition` wordt per scherm anders ingesteld (waarden uit de code, bevestigd op toestel):

| Parameter           | Zeg & Zet / Zeg & Bouw | Zeg & Vlieg        |
| :------------------ | :--------------------- | :----------------- |
| `continuous`        | `true`                 | `true`             |
| `interimResults`    | `true`                 | `true`             |
| `maxAlternatives`   | 3                      | 8                  |
| `autoStopMs`        | 25 000                 | 0 (geen auto-stop) |
| `silenceStopMs`     | 4 000                  | —                  |
| `restartOnEnd`      | `false`                | `true`             |
| `latestSegmentOnly` | `true`                 | `true`             |

Statussen: `idle` → `processing` → `listening` → `heard` / `error` / `unsupported`.

### 5.3 Mobiel-vaste herkenning

Spraak werkt op telefoon en tablet pas betrouwbaar sinds drie ingrepen in [`browserSpeech.ts`](../../src/app/game-platform/runtime/browserSpeech.ts) en `MicWaveBars`. Ze zijn bevestigd op een Samsung Galaxy A56 (Chrome, geïnstalleerde app) en op iPhone:

1. **De wave neemt de microfoon niet meer af.** De audio-reactieve golfanimatie opende een eigen `getUserMedia`-stream; op mobiel deelt de spraakherkenner de microfoon niet met een WebRTC-opname en kreeg hij stilte. Op telefoon/tablet toont de wave nu een luister-animatie zonder opname; op desktop blijft hij audio-reactief.
2. **Lege resultaat-events worden genegeerd.** Android stuurt bij het begin van spreken een reeks `onresult`-events zonder tekst; die werden als "geen match" doorgegeven en zetten de UI op fout. Alleen een echt `nomatch`-event telt.
3. **"Definitief zonder zekerheid" geldt als tussentijds.** Android markeert in continue modus elk tussenresultaat als `isFinal` met zekerheid 0 en voegt het als nieuw segment toe. Zonder correctie verwerkte het spel het eerste woord al als hele zin ("zet zet zet de …"). Verouderde tussenstanden worden nu overgeslagen; de zin wordt verwerkt bij het echte eindresultaat of na de stiltetimer.

Een **microfoon-diagnosescherm** (platform-instellingen → Microfoon-diagnose, route `/diagnose/microfoon`) toont op elk toestel of de API aanwezig is, wat de toestemmingsstatus is en wat de herkenner per stap teruggeeft; het rapport is met één knop te kopiëren.

### 5.4 Kindvriendelijke foutmeldingen

| Foutcode                              | Melding                                                                      |
| :------------------------------------ | :--------------------------------------------------------------------------- |
| `no-speech`                           | "Ik hoorde nog geen zin. Probeer het nog eens rustig."                       |
| `not-allowed` / `service-not-allowed` | "De microfoon mag nog niet gebruikt worden. Controleer de toestemming."      |
| `audio-capture`                       | "Ik kan de microfoon niet vinden. Controleer de microfoon van dit apparaat." |
| `network`                             | "Spraakherkenning heeft nu geen verbinding. Probeer het later opnieuw."      |
| `language-not-supported`              | "Nederlandse spraakherkenning wordt in deze browser niet ondersteund."       |

Elke fout wordt gelogd met herstelpad `typed-input-or-retry`; de UI biedt altijd het typ-alternatief.

### 5.5 Woordbescherming

Ongewenste woorden worden gemaskeerd in de live transcriptie en leiden tot een zachte nudge ("Oei, laten we mooie woorden gebruiken"), nooit tot straf. Gedeelde logica: [`logic/word-safety.ts`](../../src/app/games/magisch-strand-avontuur/logic/word-safety.ts).

---

## 6. Content

> Enige bron van waarheid: [`content.ts`](../../src/app/games/magisch-strand-avontuur/content.ts).

### 6.1 Doelwoorden (12)

| Woord-ID           | Label       | Lidwoord | Categorie     | Niveau |
| :----------------- | :---------- | :------- | :------------ | :----: |
| `WORD_DOLFIJN`     | dolfijn     | de       | dieren        |   2    |
| `WORD_BOOT`        | boot        | de       | voertuigen    |   1    |
| `WORD_VUURTOREN`   | vuurtoren   | de       | plekken       |   3    |
| `WORD_VLIEGTUIG`   | vliegtuig   | **het**  | voertuigen    |   2    |
| `WORD_VLIEGER`     | vlieger     | de       | strandspullen |   2    |
| `WORD_BAL`         | bal         | de       | strandspullen |   1    |
| `WORD_PARASOL`     | parasol     | de       | strandspullen |   2    |
| `WORD_SCHELP`      | schelp      | de       | strandspullen |   2    |
| `WORD_KRAB`        | krab        | de       | dieren        |   2    |
| `WORD_ZANDKASTEEL` | zandkasteel | **het**  | strandspullen |   2    |
| `WORD_HANDDOEK`    | handdoek    | de       | strandspullen |   1    |
| `WORD_ZON`         | zon         | de       | natuur        |   1    |

De lijst is uitbreidbaar: meer objecten of werelden betekent regels toevoegen, geen code wijzigen. Elk object draagt lidwoord, meervoud, emoji, sticker en kindertaal-aliassen — de lidwoorden worden overal in teksten gebruikt ("het zandkasteel", niet "de zandkasteel").

### 6.2 Ruimtelijke begrippen (11)

| Type                       | Begrippen                                |
| :------------------------- | :--------------------------------------- |
| Absoluut                   | `in`, `op`, `boven`, `onder`             |
| Lateraal                   | `links`, `rechts`, `midden`              |
| Relationeel (t.o.v. anker) | `naast`, `tussen`, `dichtbij`, `ver weg` |

### 6.3 Zones (9 vast + dynamisch)

Vast: `lucht`, `zee`, `links-zee`, `boven-zee`, `ver-weg-zee`, `eiland`, `strand`, `midden-strand`, `rechts-strand`.

Daarnaast worden **relationele zones** tijdens het spel berekend uit de actuele positie van ankerobjecten (`naast-schelp`, `tussen-bal-zandkasteel`, …). Ontbreekt het anker nog, dan geeft de logica netjes "nog niet mogelijk" terug: geen crash en het telt niet als goed.

### 6.4 Opdrachten

| Modus          |    Aantal     | ID-reeks            | Niveaus |
| :------------- | :-----------: | :------------------ | :------ |
| Zeg & Zet      |      16       | `lp-001` … `lp-016` | 1–3     |
| Kies het Woord |      12       | `cw-001` … `cw-012` | 1–3     |
| Zeg & Bouw     | 5 bouwkaarten | `build-*`           | thema's |

Rondelengte is **data-gestuurd**: de ronde volgt de content, niet een vast getal.

### 6.5 Feedbackteksten

Elke opdracht draagt `feedbackCopy` met `correct`, `almost`, `tryAgain` en `repeatAfterSuccess`. De nazegzin is ontdaan van uitroepen, zodat het kind een schone modelzin nazegt — een bewuste keuze voor uitspraakmodellering.

---

## 7. Beloningen & progressie

### 7.1 Valuta

| Valuta           | Symbool | Verdiend bij      | Basis | Bonus          | Rol                         |
| :--------------- | :-----: | :---------------- | :---- | :------------- | :-------------------------- |
| **Woordsterren** |   ⭐    | Elk goed antwoord | 1     | +1 zonder hint | Stuurt unlocks en teller    |
| **Tempo**        |   ⚡    | Elk goed antwoord | 1     | +1 zonder hint | In-ronde gevoel, geen poort |

Sterren worden **cumulatief per profiel** bijgehouden, over alle sessies en modi heen.

### 7.2 "Strandschat" — één curve

Eén tabel, één resolver ([`logic/rewards.ts`](../../src/app/games/magisch-strand-avontuur/logic/rewards.ts)). Alle items zijn cosmetisch.

|  #  | Item                 | Type        | Drempel ⭐ |
| :-: | :------------------- | :---------- | :--------: |
|  1  | Schelp Sticker       | sticker     |     3      |
|  2  | Zeeblauwe Bezemkleur | broom-color |     8      |
|  3  | Dolfijn Sticker      | sticker     |     16     |
|  4  | Strand Sprankel      | broom-trail |     28     |
|  5  | Strandbezem          | broom-skin  |     42     |
|  6  | Ster Helper Sticker  | sticker     |     60     |
|  7  | Gouden Bezem         | broom-skin  |     85     |

Een ronde levert ongeveer 24–32 ⭐ op: de eerste beloning komt vrijwel direct, de laatste na drie à vier rondes.

### 7.3 Observatiemodel

Per profiel houdt de game bij: geoefende/herkende/zelf benoemde woorden, per ruimtelijk begrip en taaldomein (geoefend, goed zonder hulp, goed met hulp, extra oefening nodig), aantal audio-herhalingen, responstijden en de ontgrendelde beloningen. Dit voedt het platform-voortgangsscherm met een categorie-uitsplitsing en tempo-inzicht — zonder cijfers of normvergelijking.

### 7.4 Instellingen

| Instelling      | Default | Effect                                                |
| :-------------- | :-----: | :---------------------------------------------------- |
| `audioEnabled`  |   aan   | Uit → geen gesproken opdracht, geen feedbackgeluiden  |
| `hintsEnabled`  |   aan   | Uit → geen hints (en dus altijd de bonus zonder hint) |
| `musicEnabled`  |   aan   | Achtergrondmuziek                                     |
| `reducedMotion` |   uit   | Dempt zweef-, sparkle- en parallax-animaties          |

---

## 8. Platform, download en offline

### 8.1 Gedrag per platform

| Platform               | Gedrag                                                                                |
| :--------------------- | :------------------------------------------------------------------------------------ |
| **Desktopbrowser**     | Direct speelbaar; content streamt en cachet. Geen gate.                               |
| **Telefoon** (portret) | **Blokkerende download-gate**: spelen kan pas na 100% lokale content. Alleen portret. |
| **Tablet**             | Zelfde gate, ruimere layout; portret én landschap.                                    |

### 8.2 De gate

`resolveDownloadGate` is een pure policy over de offline-pakketten: `mode` (`streaming` of `gated`), `phase` (`checking` → `needs-download` → `sizing` → `confirm` → `downloading` → `verifying` → `ready`, of `error`), `canPlay`, `isUpdateAvailable` en `progress`.

Op de gamekaart: `📥 37 MB` wanneer niets lokaal staat, een voortgangsring met percentage tijdens het downloaden, en daarna een `🗑️ Verwijder`-optie terwijl de kaart direct het spel start. Sluiten tijdens het downloaden laat de download doorlopen. Op 4G/5G verschijnt eerst een bevestiging (`Toch downloaden` of `Wacht op wifi`) — een waarschuwing, geen blokkade. Verwijderen vraagt een in-app bevestiging.

### 8.3 Telefoon: alleen portret

Draaien naar landschap toont de `PortraitGuard` ("Draai je telefoon rechtop") en pauzeert de gameplay. Reden: rechtop hoort de microfoon het beste en kan een kind met duimen spelen. Tablets bepalen hun eigen stand.

---

## 9. Data, opslag & privacy

### 9.1 Twee lagen

| Laag              | Waarvoor                                       | Techniek                   |
| :---------------- | :--------------------------------------------- | :------------------------- |
| Lichte key-value  | Instellingen, wereld, unlocks, privacy-akkoord | `RuntimeStorage`           |
| Rijke observaties | Oefenobservaties per poging                    | IndexedDB via het platform |

Sleutels zijn geprefixt met `magisch-strand-avontuur:` en bevatten altijd het profiel-id; IndexedDB is gesleuteld op profiel + game. Data lekt niet tussen kindprofielen (met tests geborgd).

### 9.2 Privacy

- ✅ **Wel opgeslagen:** tekstuele oefenobservaties, instellingen, unlocks — allemaal lokaal.
- ❌ **Niet:** geluidsopnames, uploads, tracking, cookies, advertenties, aankopen.

> _"De app bewaart geen geluidsopnames. De microfoon wordt alleen gebruikt om een korte zin naar tekst om te zetten. Die tekstzin kan als oefenobservatie bij de voortgang staan."_

De privacynotice draagt een versiedatum; verandert de tekst, dan wordt opnieuw om akkoord gevraagd. "Voortgang resetten" wist alle sleutels, de IndexedDB-observaties én het Zeg & Vlieg-record.

---

## 10. Toegankelijkheid & kwaliteit

### 10.1 Toegankelijkheid

| Eis               | Concreet                                                                   |
| :---------------- | :------------------------------------------------------------------------- |
| Touch-targets     | Minimaal 48×48 CSS-pixels                                                  |
| Focus             | Zichtbare `focus-visible`-ring op elk interactief element                  |
| Semantiek         | Native knoppen; icon-only knoppen met `aria-label`                         |
| Voortgang         | `role="meter"` met naam, min, max en waarde                                |
| Tekst altijd      | Opdracht, fout en succes staan altijd als tekst; audio/video is aanvullend |
| Beweging          | OS-voorkeur én de in-app `reducedMotion`-instelling worden gerespecteerd   |
| Gelijkwaardigheid | Geen leerhandeling uitsluitend via spraak of hover                         |

### 10.2 Prestatiebudget

Uit de performance-analyse die aan de asset-optimalisatie voorafging, gelden nu deze regels:

- **Objectstickers** zijn WebP (was PNG van 100–244 KB, nu 30–50 KB) — anders flitsen keuzekaarten leeg bij het doorschakelen.
- **Instructievideo's** zijn 480p (was ~2,3 MB per clip, nu enkele honderden kB's). Zware video's concurreerden met de spraakherkenning op de main-thread en maakten de microfoon traag.
- **Animatie-resets nooit universeel:** een `transition-duration`-reset op `*` veroorzaakte een `transitionend`-stortvloed (gemeten 246 events/s) waardoor "rustige beweging" de game juist onspeelbaar maakte. De demping raakt alleen de decoratieve animaties.
- **Spraak-UI is geïsoleerd** zodat tussenresultaten niet de hele scène opnieuw renderen.

### 10.3 Kwaliteitspoorten

Elke build draait: prettier, eslint (`--max-warnings 0`), TypeScript, dependency-cruiser, knip (dode code), Vitest (unit + component), Playwright (e2e op chromium-tablet; webkit nightly), axe (a11y) en bundle-/assetbudgetten. Wat elke test bewijst, staat in de [Test-matrix](Test-matrix.md).

---

## 11. Handmatige verificatie op toestel

Sommige dingen kan alleen een mens beoordelen. Deze zijn doorlopen en akkoord bevonden op een Samsung Galaxy A56 en een iPhone:

| Onderwerp                 | Bevinding                                           |
| :------------------------ | :-------------------------------------------------- |
| Spraak in alle spraakmodi | Werkt na de mobiel-vaste herkenning (§5.3)          |
| Audio-output              | Hoorbaar en prettig van volume                      |
| Rustige beweging          | Dempt de animaties zonder de game traag te maken    |
| Focus-ring                | Zichtbaar bij toetsenbordbediening                  |
| Reset wist het record     | Bevestigd                                           |
| Mic geweigerd → typen     | Vriendelijke melding, typen werkt                   |
| Voortgangsscherm          | Categorieën en tempo kloppen met wat er gespeeld is |

Wat hierbij als wens naar voren kwam maar niet gebouwd is, staat in de [Versie 2-backlog](Versie-2-Backlog.md).
