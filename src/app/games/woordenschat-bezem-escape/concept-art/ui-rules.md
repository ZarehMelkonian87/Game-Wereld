# UI Style Rules

## Doel

Dit document bevat harde regels voor alle menu's, tabs, knoppen, panels en navigatie binnen `+1 Woordenschat Bezem Escape`.

De game mag een eigen strand- en bezemthema hebben, maar de UI moet voelen alsof hij onderdeel is van de bestaande Game Wereld app.

## Hoofdregel

Geen willekeurige UI-stijlen.

Elke knop, tab, menu, kaart en panel moet:

- passen bij de bestaande app;
- dezelfde basisvormen gebruiken;
- dezelfde touch target-regels volgen;
- dezelfde fontstijl en gewicht gebruiken;
- duidelijke active/pressed states hebben;
- werken in portrait en landscape;
- leesbaar blijven op telefoon.

## Bestaande App-Stijl Die We Volgen

De huidige app gebruikt:

- afgeronde rechthoeken met duidelijke borders;
- sterke gradientkleuren per thema;
- donkere of lichte panels met hoge contrasten;
- grote iconen;
- dikke, speelse fontgewichten;
- duidelijke active states;
- eenvoudige schermstructuur;
- kindvriendelijke kleuren;
- mobiele spacing met weinig tekst.

Deze stijl blijft leidend.

## Knoppen

### Harde Regels

- Elke zichtbare knop is minimaal 44px hoog.
- Belangrijke actieknoppen zijn groter dan secundaire knoppen.
- Knoppen hebben altijd een duidelijke border.
- Knoppen hebben altijd een active/pressed state.
- Knoppen mogen geen tekst afsnijden.
- Knoppen gebruiken bij voorkeur een icoon plus kort label.
- Knoppen mogen niet zweven zonder duidelijke functie.
- Er zijn geen decoratieve knoppen zonder interactie.

### Primaire Knop

Gebruik voor hoofdacties zoals:

- Start;
- Ik heb het gedaan;
- Volgende;
- Speel race.

Stijl:

- groen of cyan afhankelijk van context;
- dikke border;
- witte tekst;
- groot genoeg voor kindervingertik;
- duidelijk onderaan of in actiegebied.

### Secundaire Knop

Gebruik voor:

- Hint;
- Audio;
- Reset;
- Terug;
- Hulp.

Stijl:

- kleiner dan primaire knop, maar minimaal 44px;
- duidelijke icoon;
- korte tekst;
- kleur gekoppeld aan functie.

## Tabs En Modusknoppen

Tabs worden gebruikt voor:

- Plaats;
- Kies;
- Race.

Regels:

- maximaal drie tabs in de MVP;
- actieve tab is duidelijk gevuld;
- inactieve tabs zijn lichter;
- tabs staan boven de opdracht of links in landscape;
- tablabels zijn kort op kleine schermen;
- geen dubbele of concurrerende navigatie.

## Menus

Menu's moeten simpel blijven.

Toegestaan:

- terugknop;
- moduskeuze;
- resultaatknoppen;
- instellingen later.

Niet toegestaan in MVP:

- diepe submenu's;
- lange tekstlijsten voor kinderen;
- verborgen acties;
- dropdowns voor kernbediening.

## Panels

Panels worden gebruikt voor:

- opdracht;
- feedback;
- resultaat;
- objectenbalk.

Regels:

- panels hebben duidelijke achtergrond;
- panels mogen niet in andere panels genest worden zonder noodzaak;
- tekst moet kort blijven;
- panelhoogte moet mobiel beheersbaar blijven;
- geen random card-styles buiten het bestaande systeem.

## Iconen

Gebruik bestaande iconstijl:

- lucide iconen voor UI-acties;
- emoji of later eigen assets voor game-objecten;
- geen gemixte iconsets zonder reden;
- iconen moeten de actie verduidelijken.

Voorbeelden:

- Audio: speaker-icoon.
- Hint: lamp-icoon.
- Terug: pijl links.
- Hulp: vraagteken.
- Speed: bliksem.
- Sterren: ster.

## Kleuren

### Game Thema

De game mag strandkleuren gebruiken:

- luchtblauw;
- zeeblauw;
- zandgeel;
- warm geel voor beloning;
- groen/cyan voor positieve acties.

### UI Consistentie

Knoppen en panels moeten nog steeds aansluiten op de app:

- cyan voor audio/navigatie;
- groen voor bevestigen;
- geel voor hint;
- paars/fuchsia alleen voor magie/beloning;
- rood vermijden behalve later voor waarschuwing, niet voor fouten.

## Feedback

Feedback mag nooit hard of strafachtig voelen.

Visuele feedback:

- zachte highlight;
- pulse voor doelobject;
- lichte glow voor juiste zone;
- ster/speed animatie later.

Niet gebruiken:

- rood kruis;
- harde foutmelding;
- agressieve shake;
- donkere error overlays.

## Mobiele Layout

### Portrait

Regels:

- header bovenaan;
- tabs onder header;
- opdracht boven scene;
- scene centraal;
- objectenbalk onder scene;
- actieknop onderaan;
- hulpknop naast of dichtbij actieknop.

### Landscape

Regels:

- opdracht en tabs links;
- scene rechts;
- objectenbalk onder scene;
- actieknop zichtbaar binnen scherm;
- geen horizontale body overflow.

## Tekst

Regels:

- korte labels;
- geen lange uitleg voor kinderen;
- geen tekst die buiten knoppen valt;
- grote tekst alleen voor titels;
- compacte tekst in panels;
- Nederlands kindvriendelijk taalgebruik.

## Verboden

Niet doen:

- willekeurige knopkleuren per scherm;
- tabs zonder actieve state;
- kleine icon-only knoppen zonder duidelijke betekenis;
- menu's met te veel keuzes;
- stijlen die niet lijken op de bestaande app;
- decoratieve kaarten om elk element;
- tekst die over de scene valt;
- knoppen die buiten beeld vallen;
- horizontale overflow op mobiel.

## Acceptatiecriteria

Een nieuw UI-onderdeel mag pas worden gebouwd als:

- het past binnen deze regels;
- het minimaal 44px touch target heeft;
- het werkt in portrait en landscape;
- het visueel aansluit op de bestaande Game Wereld app;
- het doel voor het kind duidelijk is;
- tekst en iconen niet overlappen.
