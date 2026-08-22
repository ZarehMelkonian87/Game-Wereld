# Magisch Strand-Avontuur (+1 Woordenschat Bezem Escape)

**Magisch Strand-Avontuur** is een interactieve, kindvriendelijke educatieve game gericht op taalontwikkeling, woordenschatverwerving, zinsbegrip, ruimtelijke begrippen en spraakproductie (doelgroep 4–8 jaar).

Geïnspireerd op logopedische observatiedomeinen (receptieve & actieve woordenschat, zinsbegrip en ruimtelijke oriëntatie) biedt het spel een veilige, speelse omgeving zonder diagnostische druk of prestatielabels.

> [!TIP]
> **Uitgebreid Game Design & Pedagogisch Dossier beschikbaar:**
> Bekijk de modulaire documentatie in de map [`docs/`](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/README.md):
>
> - [01. Pedagogisch & Logopedisch Fundament](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/01-pedagogisch-en-logopedisch-fundament.md)
> - [02. Leerdoelen, Woorden & Ruimtelijke Oriëntatie](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/02-leerdoelen-en-curriculum.md)
> - [03. Gameplay & Exacte Interactie-specificaties](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/03-gameplay-en-interactie-specificaties.md)
> - [04. Schermarchitectuur & User Flows](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/04-schermen-ux-en-user-flows.md)
> - [05. Beloningen, Progressie & Opslag](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/docs/05-beloningen-progressie-en-opslag.md)

---

## 🎮 Speelbare Game Modi

Magisch Strand-Avontuur bevat **drie volwaardige spelmodi** die elk een ander aspect van taal en spraak trainen:

### 1. Zeg & Zet (SceneBuilder – Luisteren, Zeggen & Plaatsen)

- **Educatief doel:** Receptieve woordenschat, zinsbegrip en ruimtelijke plaatsbegrippen.
- **Spelverloop:**
  - Het kind hoort en ziet een video- of gesproken opdracht (bijv. _"Zet de gele zeester onder de parasol"_).
  - Het kind plaatst het juiste sticker-object op het strand via **slepen (drag-and-drop)**, **aantikken (tap-to-place)** óf via **de microfoon (gesproken commando)**.
- **Spraakfunctionaliteit & Microfoon:**
  - **Continue herkenning:** De microfoon stopt niet bij korte pauzes of aarzelingen.
  - **15 seconden opnameduur:** Ruime tijd om lange samengestelde zinnen rustig uit te spreken.
  - **Adaptieve stiltetimer (2,5s):** Rondt de opname automatisch netjes af na 2,5 seconden stilte.
  - **Live visuele golfanimatie ([SpeechWaveAnimation](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/scene-builder/components/SpeechWaveAnimation.tsx)):** Toont realtime gehoorde woorden (`🗣️ "..."`), kalmerende instructies en een directe **"Klaar"**-knop.
  - **Toetsenbord- en tekstfallback:** Mogelijkheid om commando's handmatig in te typen.
- **Ruimtelijke begrippen:** `in`, `op`, `naast`, `onder`, `boven`, `tussen`, `dichtbij`, `ver weg`, `links`, `rechts`, `midden`.

---

### 2. Kies het Woord (Word Choice Quiz)

- **Educatief doel:** Snelle woordherkenning, discriminatie en auditief zinsbegrip.
- **Spelverloop:**
  - Het kind doorloopt een ronde van **10 afwisselende woordopdrachten** met 2 of 4 keuzekaarten.
  - Bevat video-opdrachten en automatische spraakondersteuning via spraaksynthese.
  - Directe feestelijke beloning ✨ bij een correct antwoord, inclusief nazegzinnen (_"Zeg na: De dolfijn zwemt in de zee"_).
- **Gamecyclus & Voortgangsbalk:**
  - De onderste statusbalk volgt exact de spelcyclus van de ronde (`Voortgang 1/10` t/m `10/10`) en toont verdiende woordsterren (⭐ `0/30`).
- **In-Game Resultatenoverzicht ([WordChoiceRoundSummary](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/word-choice/components/WordChoiceRoundSummary.tsx)):**
  - Na vraag 10 blijft het kind in de game en verschijnt het feestelijke **Resultatenoverzicht**.
  - Toont ⭐ verdiende sterren, ⚡ behaald tempo, 🎯 aantal goed, direct herkende woorden, woorden geoefend met hint, en lastige woorden.
  - Directe interactieve knoppen: **"Opnieuw"** (start direct een frisse ronde van 10 vragen) en **"Menu"** (terug naar spelkeuze).

---

### 3. Zeg & Vlieg (Voice Side-Scroller)

- **Educatief doel:** Actieve woordproductie, articulatie en reactievermogen onder spelelementen.
- **Spelverloop:**
  - Het kind vliegt op een magische bezem over het strand.
  - **Dubbele besturing:** Hoogteregeling via een ergonomische duim-rail én actieve woorduitspraak via de microfoon.
  - Wanneer een object in beeld verschijnt (boot, krab, dolfijn, schelp, bal, parasol, zon), spreekt het kind het woord hardop uit om het object te verzamelen en tempo-boosts te activeren.
- **Spraak- & Woordherkenning:**
  - **Uitgebreide aliassen ([voiceSideScrollerWords.ts](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/voice-side-scroller/voiceSideScrollerWords.ts)):** Ondersteuning voor kindertaal, verkleinwoorden (bijv. `bootje`, `krabbetje`, `dolfijntje`), meervoudsvormen (`boten`, `schelpen`) en fonetische varianten (`krap`, `strandbal`).
  - **Zinsontleding:** Ook als het kind _"kijk een boot"_ of _"daar is een dolfijn"_ zegt, pikt het spel het doelwoord direct op.
- **Ronde-einde ([VoiceSideScrollerRoundSummary](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/voice-side-scroller/VoiceSideScrollerRoundSummary.tsx)):**
  - Overzicht van gevlogen meters, score, sterren, level, hints en geoefende woorden.

---

## 🏆 Beloningen & Voortgangssysteem

- **Verzamelbare Bezems & Skins:**
  - Basisbezem, Strandbezem, Snelheidsbezem en Gouden Bezem.
  - Stickers ontgrendelen op basis van behaalde sterren en tempo.
- **Beloningsscherm ([RewardScreen](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/reward/RewardScreen.tsx)):**
  - Overzicht van nieuw ontgrendelde items en geoefende begrippen.
- **Duurzame Lokale Opslag:**
  - Volledige Dexie.js / IndexedDB data-integratie per kindprofiel.
  - Automatische geheel-tallige afronding (`Math.round`) van reactietijden en observaties ter voorkoming van opslagfouten.

---

## 🔒 Privacy & Kindveiligheid

1. **Geen Audio-opslag:** Gesproken audio wordt uitsluitend realtime in de browser verwerkt door de Web Speech API; er worden géén audiofragmenten of stemopnames bewaard of verzonden.
2. **Observatiedata i.p.v. Cijfers:** Oefenmomenten registreren neutrale gebeurtenissen (pogingen, hints gebruikt, reactietijd, geoefend doelwoord) voor pedagogisch inzicht.
3. **Toegankelijkheid & Instellingen ([GameSettingsScreen](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/settings/GameSettingsScreen.tsx)):**
   - Audio aan/uit, hints aan/uit, microfoonpermissiecontrole met herstelinstructies, en optie voor verminderde beweging (_reduced motion_).

---

## 📐 Schermen & Componentenarchitectuur

Het spel volgt de UX-specificaties met 9 gestandaardiseerde schermen en modules:

| Scherm / Module    | UX ID                  | Beschrijving                                     | Belangrijkste Componenten                                                               |
| :----------------- | :--------------------- | :----------------------------------------------- | :-------------------------------------------------------------------------------------- |
| **Startscherm**    | `SCR_MAIN_TITLE`       | Welkomstscherm met speelknop en instellingen     | `StartTopBar`, `BtnPrimaryPlay`                                                         |
| **Spelkeuzemenu**  | `SCR_ADVENTURE_SELECT` | Keuze tussen de 3 spelmodi en werelden           | `AdventureSelectHeader`, `AdventureBottomNavigation`                                    |
| **Zeg & Zet**      | `SCR_ZEG_ZET_GAME`     | Interactieve stickerplaatsing & spraakcommando's | `SceneAreaCanvas`, `SpeechWaveAnimation`, `TrayStickerPalette`                          |
| **Kies het Woord** | `SCR_KIES_WOORD_GAME`  | 10-vragen quiz met live cyclusbalk & resultaten  | `WordChoiceScreen`, `WordChoiceRoundSummary`, `GameplayStatusBar`                       |
| **Zeg & Vlieg**    | `SCR_ZEG_VLIEG_ACTIVE` | Vliegend actiespel met duim-rail en spraak       | `VoiceSideScrollerStage`, `VoiceSideScrollerThumbRail`, `VoiceSideScrollerRoundSummary` |
| **Beloningen**     | `SCR_REWARD_SUMMARY`   | Overzicht van verdiende stickers en bezems       | `RewardCard`, `RewardActionsPanel`                                                      |
| **Instellingen**   | `SCR_SETTINGS`         | Audio, hints, microfoonstatus en privacy         | `AudioSettingsCard`, `BtnMicRecheck`                                                    |

---

## 🧪 Verificatie & Kwaliteit

- **Geautomatiseerde Testsuite:** Meer dan 100 geautomatiseerde unittests en integratietests ([vitest](file:///Users/melkonian/git/Game-Wereld/vitest.config.ts)).
- **Codekwaliteit:** 100% TypeScript typecheck, ESLint (`--max-warnings 0`) en Prettier formatting.
- **Offline PWA Support:** Gevalideerde service worker en offline asset-manifests.
