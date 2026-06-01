# Wereldkeuze Concept

## Doel

De wereldkeuze is het scherm na `Spelen`. Het kind kiest hier in welke oefenwereld het wil spelen. In de eerste versie is alleen `Strand` speelbaar. De andere werelden zijn zichtbaar als rustige `komt later` kaarten, zodat de app groter aanvoelt zonder het kind te verwarren.

Dit scherm is geen dashboard. Het moet voelen als een simpele game-keuze: kies een wereld, druk op `Start wereld`.

## Flow

```text
Startscherm
-> Spelen
-> Wereldkeuze
-> Kies Strand
-> Start wereld
-> Moduskeuze / huidig GameMenuScreen
```

De terugknop gaat altijd terug naar het startscherm.

## Zichtbare Werelden Eerste Versie

De concrete lijst staat in `world-list.md`. Samenvatting:

| Wereld | Status | Thema | Eerste leerfocus |
| --- | --- | --- | --- |
| Strand | Open | zee, zand, lucht | plaatsbegrippen en strandwoorden |
| Boerderij | Komt later | dieren, stal, veld | dieren en actiewoorden |
| Dierentuin | Komt later | dierenverblijven | categorieen en beschrijven |
| Speeltuin | Komt later | spelen, bewegen | werkwoorden en aanwijzingen |
| School | Komt later | klas, spullen | objectwoorden en volgorde |
| Ruimte | Komt later | sterren, planeten | ruimtelijke taal en vergelijken |

## Schermopbouw Portrait

1. Bovenbalk
   - links: terugknop;
   - midden: korte titel `Kies wereld`;
   - rechts: kleine sterren/voortgang-pill.
2. Korte visuele kop
   - kleine mascot of ster;
   - geen lange uitlegtekst.
3. Wereldkaarten
   - twee kolommen;
   - `Strand` groot genoeg om duidelijk te zijn;
   - toekomstige werelden kleiner of gedimd, maar nog herkenbaar.
4. Onderbalk
   - vaste grote knop `Start wereld`;
   - alleen actief als een open wereld geselecteerd is.

Portrait mag binnen de wereldlijst verticaal scrollen als dat nodig is. De onderbalk blijft vast staan.

## Schermopbouw Landscape

Landscape gebruikt de breedte beter:

- links: korte titel en geselecteerde wereld-preview;
- rechts: compacte grid met wereldkaarten;
- onderaan of linksonder: `Start wereld`;
- terugknop linksboven.

Knoppen mogen niet over de wereldkaarten of character-art vallen.

## Wereldkaart Ontwerp

Elke kaart heeft:

- groot icoon of stickerbeeld;
- korte naam;
- status-chip: `Open` of `Komt later`;
- thema-kleur;
- duidelijke selected state.

Gebruik weinig tekst. Voor jonge kinderen moet het icoon de belangrijkste herkenning zijn.

## Kaart States

### Open

Voor `Strand`:

- volle kleur;
- witte sticker/panel-rand;
- lichte schaduw;
- klikbaar;
- geselecteerd bij openen van het scherm.

### Geselecteerd

Een geselecteerde kaart krijgt:

- dikkere witte rand;
- groene check of glow;
- iets grotere schaduw;
- `Start wereld` knop wordt actief.

### Komt Later

Voor toekomstige werelden:

- zachte gedimde kleuren;
- slot-icoon of kleine chip `Komt later`;
- wel zichtbaar, niet klikbaar voor starten;
- tikken mag een vriendelijke korte feedback geven zoals `Deze wereld komt later`.

Gebruik geen harde foutmelding.

## Eerste Visuele Richting Per Wereld

| Wereld | Icoonrichting | Hoofdkleur | Kaartgevoel |
| --- | --- | --- | --- |
| Strand | golf, schelp, parasol | aqua en geel | warm, open, zonnig |
| Boerderij | schuur, kip, appel | groen en rood | rustig, landelijk |
| Dierentuin | poot, giraffe, boom | groen en oranje | ontdekking |
| Speeltuin | glijbaan, bal | blauw en roze | beweging |
| School | potlood, boek, rugzak | blauw en geel | netjes en herkenbaar |
| Ruimte | ster, planeet, raket | donkerblauw en geel | magisch maar niet donker |

## Knoppen

### Terug

- icoonknop linksboven;
- minimaal 44px;
- dezelfde stijl als andere HUD-knoppen;
- gaat naar startscherm.

### Start Wereld

- grote groene knop;
- onderaan vast;
- tekst: `Start wereld`;
- met play-icoon;
- disabled als geen open wereld geselecteerd is.

## Gedrag

- Bij openen staat `Strand` standaard geselecteerd.
- Tik op `Strand` selecteert `Strand`.
- Tik op een `komt later` kaart start niets.
- `Start wereld` opent voorlopig het bestaande `GameMenuScreen`.
- Later kan `Start wereld` direct naar de laatst gebruikte modus gaan.

## UX Regels

- Geen losse random knoppen op het scherm.
- Geen lange uitlegteksten.
- Geen advertentie-achtige badges.
- Geen drukke kaartdecoratie.
- Geen kleine touch targets.
- Wereldkaarten moeten in dezelfde stijl blijven als het startscherm: pastel, sticker, witte randen, dikke afgeronde vormen.

## Acceptatie Voor Implementatie

- Het kind ziet meteen dat `Strand` de speelbare keuze is.
- Toekomstige werelden zijn zichtbaar maar niet verwarrend.
- `Start wereld` is de duidelijke hoofdactie.
- Terug naar het startscherm werkt.
- Portrait en landscape blijven overzichtelijk.
- De werelddata kan later los in een eigen datafile worden gezet.
