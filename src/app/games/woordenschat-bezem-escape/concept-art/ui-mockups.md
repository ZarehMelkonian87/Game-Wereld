# Mobile UI Mockups

## Doel

Dit document beschrijft de mobiele UI-richting voor `+1 Woordenschat Bezem Escape`.

De UI moet simpel, vriendelijk en geschikt zijn voor jonge kinderen. Alle schermen moeten passen bij de bestaande Game Wereld appstijl en bij de art direction bible van deze game.

## Generated Mockup Sheet

De eerste visuele UI-sheet staat hier:

`generated-images/mobile-ui-mockups-sheet.png`

Deze sheet is bedoeld als conceptreferentie, niet als definitieve pixel-perfect UI.

## Global Mobile UX Rules

- Grote knoppen.
- Grote iconen.
- Minimale tekst.
- Audio-knop altijd zichtbaar in gameplay.
- Hint-knop altijd zichtbaar in gameplay.
- Duidelijke progress bar.
- Speed meter als magische bezem energy bar.
- Star counter zichtbaar tijdens gameplay.
- Object tray onderaan bij scene builder.
- Veilige spacing vanaf schermranden.
- Geen clutter.
- Geen tiny buttons.
- Geen advertenties.
- Geen verwarrende menu's.
- Portrait en landscape moeten allebei bruikbaar zijn.

## Visual UI Style

- 2D sticker style.
- Soft pastel colors.
- Rounded buttons.
- Thick outlines.
- Friendly icons.
- Clean layout.
- Child-friendly.
- Consistent met Game Wereld appstijl.

## Screen Mockup Requirements

### 1. Start Screen

Doel:

- kind komt rustig binnen;
- startactie is direct duidelijk.

UI:

- grote game titel;
- magische bezem of stermascotte;
- primaire startknop;
- profielknop als secundaire actie;
- geen drukke uitleg.

### 2. Child Profile Selection Screen

Doel:

- kind of ouder kiest profiel.

UI:

- grote profielkaarten;
- avatar per kind;
- korte naam;
- plusknop voor nieuw profiel;
- geen complexe accountflow.

### 3. Avatar Selection Screen

Doel:

- kind kiest of past avatar aan.

UI:

- grote avatar preview;
- horizontale avatar-keuze;
- simpele kleurkeuzes;
- optionele knoppen voor haar, shirt, hoed en rugzak later;
- grote bevestigknop.

### 4. World Selection Screen

Doel:

- kind kiest wereld.

UI:

- grote wereldkaarten;
- Strandwereld eerst;
- slotjes voor toekomstige werelden;
- voortgang/sterren per wereld;
- geen lange lijst.

### 5. Beach Scene Builder Screen

Doel:

- kind luistert, kiest object en plaatst sticker in scene.

UI moet tonen:

- grote scene area;
- object tray met draggable stickers onderaan;
- audio instruction button;
- hint button;
- speed meter;
- star counter;
- parent-only back button of hold-action back;
- duidelijke actieve doelzone.

Portrait:

- opdracht boven scene;
- scene midden;
- object tray onder scene;
- actieknop onderaan.

Landscape:

- opdracht en controls links;
- scene rechts;
- object tray onder scene.

### 6. Vocabulary Choice Screen

Doel:

- kind hoort een woord en kiest het juiste plaatje.

UI:

- audio-knop prominent;
- vraag/instructiebubbel;
- 2 tot 4 grote antwoordkaarten;
- hint-knop;
- speed/sterren zichtbaar;
- correcte keuze krijgt zachte highlight.

### 7. Broom Race Screen

Doel:

- korte race met taalopdracht.

UI moet tonen:

- karakter op magische bezem;
- eenvoudige links/rechts controls of swipe guidance;
- jump button;
- current instruction bubble;
- speed meter;
- stars collected;
- rustige baan zonder clutter.

### 8. Reward Screen

Doel:

- kind krijgt positieve afsluiting.

UI:

- grote sticker/beloning;
- geoefende woorden als kleine iconen;
- sterren;
- speed winst;
- knop "nog een keer";
- knop terug naar wereld.

### 9. Parent/Therapist Dashboard

Doel:

- ouder of logopedist ziet oefenobservaties.

UI:

- rustigere layout;
- kaarten voor woordenschat, plaatsbegrippen, hints en sessies;
- geen diagnostische claims;
- simpele labels zoals groeiend, met hulp, extra oefenen;
- filter per periode later.

### 10. Settings Screen

Doel:

- ouder beheert instellingen.

UI:

- geluid aan/uit;
- muziek aan/uit;
- taal/audio opties later;
- profielbeheer;
- oudersectie duidelijk gescheiden;
- grote toggles.

## Gameplay HUD Rules

Gameplay HUD bevat altijd:

- audio-knop;
- hint-knop;
- speed meter;
- stercounter;
- huidige opdracht;
- duidelijke hoofdactie.

De HUD mag de scene niet blokkeren.

## Back Button Rule

Voor kindschermen mag de back button niet te prominent zijn.

Opties:

- kleine terugknop voor ouder;
- hold-to-exit;
- oudercode later;
- duidelijke bevestiging als sessie actief is.

## Landscape Rules

Landscape gebruikt meer horizontale ruimte:

- controls links;
- scene rechts;
- tray onder scene;
- dashboard mag twee kolommen gebruiken;
- race controls links/rechts onderin.

## Portrait Rules

Portrait is de primaire mobiele flow:

- alles stapelt verticaal;
- knoppen blijven minimaal 44px;
- actieknop altijd bereikbaar;
- object tray blijft onderaan;
- geen horizontale body overflow.

## Source Prompt

```text
Create a clean mobile UI mockup sheet for a children's educational game called '+1 Woordenschat Bezem Escape'. Show 10 small mobile screen mockups arranged in a neat grid: start screen, child profile selection, avatar selection, world selection, beach scene builder, vocabulary choice, broom race, reward screen, parent/therapist dashboard, settings screen. UI must be simple, friendly, suitable for young children, large rounded buttons, big icons, minimal readable text, audio button always visible, hint button always visible where gameplay appears, clear progress bar, speed meter as magical broom energy bar, star counter, drag-and-drop object tray at bottom for scene builder, safe spacing from screen edges, no clutter, no tiny buttons, no ads, no confusing menus. Visual style: 2D sticker style, soft pastel colors, rounded buttons, thick outlines, friendly icons, clean layout, child-friendly. Beach scene builder screen shows large scene area, object tray with sticker objects, audio instruction button, hint button, speed meter, star counter, parent back button as small hold-action icon. Race screen shows child character on magical broom, simple left/right controls, jump button, current instruction bubble, speed meter, stars collected. Paper cut-out sticker look, mobile game UI design board, high contrast, no watermark, no logo, no photorealism, no scary details.
```
