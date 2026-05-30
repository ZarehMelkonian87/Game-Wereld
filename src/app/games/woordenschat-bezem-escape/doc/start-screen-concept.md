# Startscherm Concept

## Doel

Het startscherm is de rustige en vrolijke ingang van `+1 Woordenschat Bezem Escape`. Een kind moet direct begrijpen: hier kan ik spelen. Het scherm mag niet voelen als een dashboard of instellingenpagina.

## Kernboodschap

De boodschap van het startscherm:

> Luister, plaats woorden en vlieg met je bezem.

Dit wordt niet als lange uitlegtekst getoond. De UI laat dit vooral zien met mascot, bezem, sterren en een duidelijke speelknop.

## Hoofdstructuur

### 1. Logo Gebied

Het logo staat bovenin of net boven het midden, afhankelijk van de schermhoogte.

Logo-tekst:

```text
+1 Woordenschat
Bezem Escape
```

Visuele opbouw:

- `+1` als klein beloningssignaal;
- `Woordenschat` als hoofdwoord;
- `Bezem Escape` als speelse subtitel;
- mascot of ster naast het logo;
- kleine bezem-trail achter of onder het logo.

Voor deze richting gebruiken we een getekende transparante logo-asset: `../assets/logos/start-logo-b-generated-magenta.png`. Deze asset is gemaakt met een magenta chroma-key bron, zodat de groene `Escape` letters niet worden verwijderd bij het transparant maken.

### 2. Hero Visual

Het eerste visuele signaal is een vriendelijke mascot of avatar op een magische bezem.

Voorkeur voor MVP:

- stermascot in blije of wijzende pose;
- basisbezem of strandbezem;
- enkele kleine woordsterren rond de bezem.

Regels:

- geen drukke scene vol objecten;
- geen willekeurige decoratie;
- geen tekst in artwork;
- visueel moet op klein mobiel scherm direct leesbaar blijven.

### 3. Primaire Actie

Grote primaire knop:

```text
Speel
```

Gedrag:

- als er nog geen wereld is gekozen: ga naar `Wereldkeuze`;
- als later een laatst gespeelde wereld wordt opgeslagen: ga naar die wereld;
- in de eerste MVP mag `Speel` naar `Wereldkeuze` gaan.

Stijl:

- groen/cyan primaire knop;
- dik afgeronde vorm;
- icoon links: play-icoon of kleine bezem;
- minimaal 56px hoog in portrait;
- centraal onder hero visual.

### 4. Secundaire Acties

Onder de speelknop komt een compacte rij met kleine acties.

Acties:

- `Werelden`: opent wereldkeuze;
- `Groei`: opent ouder/logopedist voortgang;
- `Opties`: opent instellingen.

Regels:

- secundaire acties zijn kleiner dan `Speel`;
- ze staan in een vaste rij of compact panel;
- ze mogen het kind niet afleiden van de hoofdactie;
- `Groei` mag minder prominent zijn omdat dit vooral voor ouder/logopedist is.

## Achtergrond

De achtergrond moet vrolijker zijn dan het huidige menu, maar rustig blijven.

Richting:

- zachte pastel lucht;
- lichte zee- of strandvorm onderin;
- subtiele papier-cutout sfeer;
- geen volle objectscene;
- geen dubbele witte rand;
- geen scroll op normale telefoons.

Toegestane visuele accenten:

- kleine sterretjes;
- zachte bezem-trail;
- subtiele wolk of golfvorm;
- mascot-schaduw.

Niet gebruiken:

- veel losse strandobjecten;
- drukke patronen;
- lange teksten;
- random zwevende knoppen;
- grote kaartenstapel.

## Portrait Layout

Volgorde van boven naar beneden:

1. Veilige top spacing.
2. Logo.
3. Mascot/avatar met bezem.
4. Grote `Speel` knop.
5. Secundaire actierij: `Werelden`, `Groei`, `Opties`.

Layout-regels:

- geen verticale scroll bij normale telefoons;
- content blijft binnen safe-area;
- `Speel` blijft makkelijk bereikbaar met duim;
- secundaire acties staan onderaan maar niet tegen schermrand.

## Landscape Layout

Volgorde:

- links: logo en korte visuele identiteit;
- rechts: mascot/bezem en `Speel` knop;
- secundaire acties onder of naast de primaire knop.

Layout-regels:

- geen elementen buiten beeld;
- geen grote hero die de knoppen wegduwt;
- `Speel` blijft direct zichtbaar.

## Tekst Op Het Scherm

Maximale tekst voor MVP:

- `+1 Woordenschat`
- `Bezem Escape`
- `Speel`
- `Werelden`
- `Groei`
- `Opties`

Optionele korte zin onder logo:

```text
Luister en vlieg!
```

Deze zin alleen gebruiken als de layout luchtig blijft.

## Componentkeuze

Te gebruiken bestaande componenten:

- `PrimaryActionButton` voor `Speel`;
- `HudIconButton` of kleine custom icon buttons voor secundaire acties;
- `PanelCard` alleen als secundaire acties visueel samen moeten blijven;
- `RibbonTitle` niet als hoofdlogo, tenzij het logo anders te veel afwijkt van de appstijl.

Nieuwe componenten die later nuttig kunnen zijn:

- `GameLogo`;
- `StartActionRow`;
- `StartHero`.

## Navigatiebesluit

Voor de eerste implementatie:

- `Speel` opent `WorldSelectScreen`;
- `Werelden` opent ook `WorldSelectScreen`;
- `Groei` opent `ParentDashboardScreen`;
- `Opties` opent `GameSettingsScreen`.

Later kan `Speel` direct doorgaan naar de laatst gekozen wereld.

## Acceptatie

Het startscherm is akkoord wanneer:

- het duidelijk vrolijker voelt dan het huidige menu;
- het logo meteen herkenbaar is;
- `Speel` de duidelijkste actie is;
- de wereldkeuze makkelijk te vinden is;
- ouder/instelknoppen aanwezig zijn maar niet dominant;
- portrait en landscape geen scroll of overlap hebben;
- de stijl past bij `mobile-ui-mockups-sheet.png`.
