# Mobile UI Mockup Analyse

Bronbeeld: `concept-art/generated-images/mobile-ui-mockups-sheet.png`

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
