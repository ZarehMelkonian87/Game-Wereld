# Mobile UI Mockup Analyse

Bronbeeld: oude gegenereerde mobile UI mockup-sheet. De lokale PNG-kopie is na analyse verwijderd om de repository klein te houden.

Doel van deze analyse: de mockup-sheet gebruiken als visuele richting voor een rustige, mobile-first implementatie. De sheet is geen pixel-perfect ontwerp. We gebruiken de structuur, verhoudingen en UI-patronen als leidraad.

## Belangrijkste Observaties

De mockup-sheet toont tien mobiele schermen:

1. Startscherm
2. Profiel selecteren
3. Avatar selecteren
4. Wereld selecteren
5. Strand bouwer
6. Woord kiezen
7. Bezem race
8. Beloning
9. Ouder / therapeut dashboard
10. Instellingen

Alle schermen gebruiken dezelfde visuele taal:

- pastel lucht- en strandachtergrond;
- afgeronde witte panels met duidelijke borders;
- dikke, kindvriendelijke typografie;
- groene primaire actieknoppen;
- blauwe/cyan navigatieknoppen;
- gele hint- en beloningsaccenten;
- stercounter als herkenbare voortgang;
- audio-knop linksboven of dicht bij de opdracht;
- eenvoudige layouts met weinig tekst;
- grote iconen en minimaal 44px touch targets.

## UI Patronen Uit De Sheet

### Vaste HUD

Veel schermen hebben bovenin:

- audio-knop links;
- stercounter bovenin;
- hintknop rechts bij gameplay;
- ouder/profielknop bij gameplay of dashboard.

Dit moet een herbruikbare `TopHud` worden, niet per scherm opnieuw gebouwd.

### Blauwe Lint-Titel

Menu- en instellingen-schermen gebruiken een blauwe linttitel, bijvoorbeeld:

- `Kies je profiel`
- `Kies je avatar`
- `Kies een wereld`
- `Overzicht`
- `Instellingen`

Dit moet een herbruikbare `RibbonTitle` worden.

### Card Systeem

De mockups gebruiken cards voor:

- profielkaarten;
- avataropties;
- wereldkaarten;
- woordkeuze-antwoorden;
- dashboard-metrics;
- instellingenrijen.

Cards moeten dezelfde radius, border, padding en actieve staat gebruiken.

### Gameplay Layout

De gameplay-schermen gebruiken een vaste volgorde:

- korte opdracht bovenaan;
- grote visuele speelruimte;
- voortgang/speed onder of naast de scene;
- objecten of controls onderaan;
- geen lange uitlegtekst in het kindscherm.

### Scene Builder

De strand bouwer toont:

- een compacte opdrachtstrip boven de scene;
- een grote scene;
- een zichtbare dropzone;
- speedbar en sterren onder de scene;
- objecttray onderaan;
- slechts korte labels.

Belangrijk: dit scherm mag niet alle menu-elementen tegelijk tonen.

### Woord Kiezen

Het woordkeuze-scherm toont:

- audio/vraagpaneel bovenaan;
- een grote target-card;
- 2 tot 6 antwoordkaarten;
- progress onderaan.

Voor de MVP starten we met 2 of 3 opties, niet direct 6.

### Race

De race toont:

- opdrachtbubble bovenaan;
- grote scene;
- avatar op bezem;
- drie grote controls onderaan;
- speedbar onderaan.

Dit wordt later een eigen screen, niet een overlay bovenop de scene builder.

## Implementatieprincipes

- Eerst UI-bouwstenen maken, daarna schermen.
- Elk scherm in een apart bestand.
- `index.tsx` blijft een dun entrypoint.
- Geen gameplay-logica in UI-basiscomponenten.
- Geen nested cards tenzij het echt nodig is.
- Geen nieuwe UI-laag zonder portrait en landscape screenshot.
- Geen nieuwe stap doorvoeren zonder visuele goedkeuring als het om layout gaat.

## UI Contract Voor Implementatie

Deze afspraken gelden voor de volgende bouwstappen.

### Status Van De Mockup-Sheet

De mockup-sheet is een richtinggevend ontwerp, geen pixel-perfect specificatie.

We kopieren dus niet exact:

- alle posities;
- alle verhoudingen;
- alle teksten;
- alle aantallen knoppen of cards.

We nemen wel over:

- de rustige pastelstijl;
- de witte panel/card-taal;
- de duidelijke HUD-patronen;
- de grote kindvriendelijke knoppen;
- de volgorde van informatie per scherm;
- de minimale tekst in kindschermen.

### Primaire Flow

Portrait is de primaire mobiele flow. Elk nieuw onderdeel wordt eerst in portrait ontworpen en daarna pas vertaald naar landscape.

Landscape moet speelbaar blijven, maar hoeft niet dezelfde compositie te hebben. In landscape krijgt de scene prioriteit en schuiven controls naar een compacte zij- of onderzone.

### Eerste Prioriteit

De eerste implementatieprioriteit is gameplay, niet de volledige app-navigatie.

Volgorde:

1. Scene builder basis.
2. Woord kiezen basis.
3. Race basis.
4. Beloning basis.
5. Daarna pas start/profiel/avatar/wereld/dashboard/instellingen.

### Schermen Die Later Komen

Deze schermen worden later als aparte schermen gebouwd en niet in de gameplay component gestopt:

- startscherm;
- profiel selecteren;
- avatar selecteren;
- wereld selecteren;
- ouder/logopedist dashboard;
- instellingen.

De bestaande app-profielen blijven leidend. We bouwen geen tweede profiel-systeem in deze game zonder aparte beslissing.

### Componentregels

`index.tsx` blijft een dun entrypoint. Het mag alleen de huidige game-screen samenstellen.

Niet toegestaan in `index.tsx`:

- grote JSX-blokken;
- gameplay-state;
- layout-berekeningen;
- assetlijsten;
- individuele knoppen/cards/objecten.

Nieuwe UI hoort in:

- `components/layout/` voor shell, stage en scene-layout;
- `components/ui/` voor herbruikbare knoppen, panels en HUD-elementen;
- `screens/` voor volledige schermen zoals scene builder, woord kiezen en race.

### Visuele Acceptatie

Elke visuele stap heeft minimaal:

- portrait screenshot;
- landscape screenshot;
- geen horizontale body overflow;
- geen verticale scroll wanneer het scherm fullscreen moet zijn;
- geen kapotte afbeeldingen;
- geen console-errors;
- geen dubbele randen of onbedoelde padding;
- geen tekst die buiten knoppen of panels valt.

Als een stap niet visueel goed voelt, passen we die stap aan voordat er nieuwe UI-lagen bijkomen.

## Voorgestelde Folderstructuur

```text
woordenschat-bezem-escape/
  index.tsx
  asset-urls.ts
  content.ts
  types.ts
  components/
    layout/
      BezemEscapeShell.tsx
      BeachBackground.tsx
      GameStage.tsx
    ui/
      TopHud.tsx
      HudIconButton.tsx
      StarCounter.tsx
      HintButton.tsx
      RibbonTitle.tsx
      PrimaryActionButton.tsx
      PanelCard.tsx
      ProgressBar.tsx
      ObjectStickerButton.tsx
    index.ts
  screens/
    StartScreen.tsx
    ProfileSelectScreen.tsx
    AvatarSelectScreen.tsx
    WorldSelectScreen.tsx
    SceneBuilderScreen.tsx
    WordChoiceScreen.tsx
    RaceScreen.tsx
    RewardScreen.tsx
    ParentDashboardScreen.tsx
    SettingsScreen.tsx
```

We hoeven niet alle bestanden direct te maken. De structuur geeft richting zodat nieuwe onderdelen niet opnieuw in `index.tsx` belanden.

## Huidige Structuur Na Fase 2.3

De basisstructuur staat klaar, maar zonder lege schermcomponenten:

```text
woordenschat-bezem-escape/
  index.tsx
  asset-urls.ts
  content.ts
  types.ts
  components/
    layout/
      BezemEscapeShell.tsx
      BeachBackground.tsx
      GameStage.tsx
    ui/
      README.md
    index.ts
  screens/
    README.md
```

`components/ui/` en `screens/` hebben bewust alleen een README. Nieuwe componenten en schermen worden pas toegevoegd wanneer we die stap echt implementeren.

## Nieuwe Implementatievolgorde

Voor de eerstvolgende stappen richten we ons op het gameplay-scherm, niet op alle menu-schermen tegelijk:

1. UI-systeem en componentstructuur.
2. Achtergrond en game-stage goedkeuren.
3. Vaste HUD als losse laag.
4. Scene builder layout shell.
5. Objecttray als losse laag.
6. Drie teststickers.
7. Pas daarna alle stickers en interactie.

De andere mockup-schermen, zoals profiel, avatar, wereld, dashboard en instellingen, worden later als aparte schermen gebouwd met dezelfde componenten.
