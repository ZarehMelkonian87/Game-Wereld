# Eerste Wereldlijst

## Doel

Dit document legt de eerste zichtbare werelden vast voor de wereldkeuze. Het is de inhoudelijke bron voor Fase 5, waarin deze lijst wordt omgezet naar echte TypeScript-data.

Statuswaarden:

- `open`: speelbaar in de huidige versie.
- `komt_later`: zichtbaar als toekomstige wereld, nog niet speelbaar.
- `gesloten`: gereserveerd voor latere werelden die met voortgang vrijgespeeld worden.

Voor de eerste versie gebruiken we alleen `open` en `komt_later`.

## Wereldlijst MVP

| ID | Naam | Status | Thema-kleur | Icoonrichting | Kort leerdoel | Eerste modes |
| --- | --- | --- | --- | --- | --- | --- |
| `strand` | Strand | `open` | aqua, zonnig geel, zacht zand | golf, schelp, parasol | Strandwoorden, plaatsbegrippen en korte aanwijzingen oefenen. | Luister & Plaats, Kies het Woord, Race |
| `boerderij` | Boerderij | `komt_later` | grasgroen, appelrood, warm geel | schuur, kip, appel | Dieren, geluiden, actiewoorden en simpele zinnen oefenen. | Later |
| `dierentuin` | Dierentuin | `komt_later` | bladgroen, oranje, licht zand | pootafdruk, giraffe, boom | Dieren benoemen, categorieen kiezen en beschrijven. | Later |
| `speeltuin` | Speeltuin | `komt_later` | helder blauw, zacht roze, fris groen | glijbaan, bal, schommel | Werkwoorden, bewegingstaal en aanwijzingen volgen. | Later |
| `school` | School | `komt_later` | schoolblauw, potloodgeel, wit | boek, potlood, rugzak | Schoolspullen, volgorde, kleuren en aantallen oefenen. | Later |
| `ruimte` | Ruimte | `komt_later` | nachtblauw, sterrengeel, zacht paars | planeet, ster, raket | Ruimtelijke taal, vergelijken en volgorde oefenen. | Later |

## Kaartinhoud Per Wereld

### Strand

- Status: `open`
- Kaarttekst: `Strand`
- Chip: `Open`
- Hoofdkleur: aqua/geel
- Visuele focus: heldere strandkaart met golf of schelp
- Leerfocus:
  - dolfijn, boot, vuurtoren, vliegtuig, vlieger, bal, parasol, schelp, krab, zandkasteel;
  - `in`, `op`, `onder`, `boven`, `naast`, `tussen`, `links`, `rechts`;
  - korte opdrachten en race-aanwijzingen.
- Startgedrag: `Start wereld` opent voorlopig het bestaande spelmenu.

### Boerderij

- Status: `komt_later`
- Kaarttekst: `Boerderij`
- Chip: `Komt later`
- Hoofdkleur: groen/rood
- Visuele focus: simpele schuur of kip
- Leerfocus later:
  - dieren benoemen;
  - actiewoorden zoals eten, lopen, slapen;
  - diercategorieen.

### Dierentuin

- Status: `komt_later`
- Kaarttekst: `Dierentuin`
- Chip: `Komt later`
- Hoofdkleur: groen/oranje
- Visuele focus: pootafdruk of giraffe
- Leerfocus later:
  - dieren herkennen;
  - categorieen zoals groot/klein, snel/langzaam;
  - zinnen maken over dieren.

### Speeltuin

- Status: `komt_later`
- Kaarttekst: `Speeltuin`
- Chip: `Komt later`
- Hoofdkleur: blauw/roze/groen
- Visuele focus: glijbaan of bal
- Leerfocus later:
  - werkwoorden zoals springen, rollen, klimmen;
  - aanwijzingen met volgorde;
  - plaatsbegrippen rond speeltoestellen.

### School

- Status: `komt_later`
- Kaarttekst: `School`
- Chip: `Komt later`
- Hoofdkleur: blauw/geel/wit
- Visuele focus: boek, potlood of rugzak
- Leerfocus later:
  - schoolspullen benoemen;
  - kleur, aantal en volgorde;
  - korte zinnen over dagelijkse routines.

### Ruimte

- Status: `komt_later`
- Kaarttekst: `Ruimte`
- Chip: `Komt later`
- Hoofdkleur: nachtblauw/geel/paars
- Visuele focus: planeet, ster of raket
- Leerfocus later:
  - boven/onder, ver weg/dichtbij;
  - vergelijken: groot/klein, snel/langzaam;
  - volgorde en route-aanwijzingen.

## Implementatieregels Voor Fase 5

- Gebruik de `ID` kolom als stabiele data-id.
- Gebruik exact de statuswaarden `open`, `komt_later` en later eventueel `gesloten`.
- Alleen `strand` mag in de eerste implementatie starten.
- Alle `komt_later` werelden blijven zichtbaar maar openen geen game.
- De wereldlijst moet in een eigen datafile komen, niet hardcoded in `WorldSelectScreen`.
- De kaarttekst blijft kort, zodat het op kleine telefoons past.
