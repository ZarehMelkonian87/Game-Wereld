# 🧹 Modus — Zeg & Vlieg

> Productieve modus met tempo: benoemen wat voorbij komt. Hoort bij de [GDD](GDD-index.md).

| Veld             | Waarde                                                                                                                                |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Modus-ID**     | `MODE_ZEG_VLIEG` (`zeg-en-vlieg`)                                                                                                     |
| **Scherm**       | `SCR_MSA_VOICE_SCROLLER` · [`screens/voice-side-scroller/`](../../src/app/games/magisch-strand-avontuur/screens/voice-side-scroller/) |
| **Ontgrendeld**  | Vanaf 14 ⭐                                                                                                                           |
| **Talige focus** | Productief: het woord zelfstandig en verstaanbaar uitspreken                                                                          |
| **Taaldomein**   | `active-vocabulary`                                                                                                                   |
| **Status**       | 🟢 Gebouwd, getest (e2e `voice-side-scroller.spec.ts` + unit voor engine, record en woordselectie)                                    |

---

## 1. Waarom deze modus

De hoogste trede: het kind produceert het woord zelf, zonder keuzekaarten, in een spelsituatie die vaart heeft. Daardoor wordt het benoemen automatisch in plaats van bedacht.

## 2. De ronde

Statusmachine: `ready` → `running` → `game-over`.

1. **Start-overlay** toont de doelwoorden van deze ronde en de privacytekst over de microfoon.
2. Na **Start** vliegt de held continu van links naar rechts; de afstand loopt op (8 meter per seconde).
3. **Besturing:** een duim-rail regelt traploos de vlieghoogte. De held zakt langzaam als het kind niets doet.
4. **Doelen:** objecten komen in beeld. Zegt het kind de naam, dan wordt het object verzameld.
5. **Obstakels** moeten worden ontweken.
6. De ronde eindigt vriendelijk zodra het laatste schildje op is.

## 3. Woorden verzamelen met de stem

De herkenning loopt doorlopend (`restartOnEnd`), zodat het kind meerdere objecten achter elkaar kan benoemen. Ze is bewust vergevingsgezind:

- **Kort woordgeheugen (1,8 s):** een woord dat net gezegd is telt alsnog wanneer het bijbehorende plaatje even later in het herkenningsvenster schuift. Zonder dat geheugen misten kinderen objecten die ze al hadden benoemd.
- **Meer alternatieven:** `maxAlternatives: 8` — kindertaalvarianten en bijna-uitspraken worden meegenomen.
- **Herstel na een misser:** na een niet-herkende poging volgt een korte adempauze (0,7 s) voordat opnieuw wordt geluisterd, zodat de mic niet blijft hakkelen.
- **Ongewenste woorden** worden eruit gefilterd; een gemengde uiting als "stomme bal" telt gewoon als "bal".

Per doelwoord houdt de game bij of het herkend is, hoeveel pogingen er waren, of er hulp aan te pas kwam en of het woord extra oefening vraagt. Niet-gemeesterde woorden komen in volgende rondes vaker voorbij.

## 4. Vriendelijk mechanisme

| Element       | Werking                                                                                             |
| :------------ | :-------------------------------------------------------------------------------------------------- |
| **Schildjes** | 3 per ronde. Een botsing kost één schildje plus een korte vertraging (1,3 s) — geen harde game-over |
| **Combo**     | Meerdere woorden goed op rij geeft een zichtbare combo 🔥; elke 3e levert een bonusster             |
| **Tempo**     | Elk verzameld woord geeft een snelheidsboost; een botsing breekt de combo                           |
| **Record**    | De verste vlucht wordt per profiel bewaard en gevierd bij een nieuw record                          |

De moeilijkheid loopt op met de afgelegde afstand: obstakels komen dichter op elkaar.

## 5. Ronde-eindscherm

Vriendelijk verwoord ("Goed gevlogen! Je haalde X meter") met: meters, sterren, score, het persoonlijke record en de per-woord observaties (wat ging meteen goed, wat vraagt nog oefening). Knoppen: **Opnieuw** en **Wereld**.

## 6. Prestatie

De modus draait op een frame-loop en is de zwaarste van de vier. Daarom: geen universele CSS-animatieresets (die veroorzaakten een `transitionend`-stortvloed en maakten juist "rustige beweging" onspeelbaar), en de spraak-UI rendert los van de speelwereld.

## 7. Wat deze modus (nog) niet doet

Zeg & Vlieg kent een score en een record per ronde, maar draagt nog **geen sterren** bij aan het cumulatieve profieltotaal — de drie andere modi doen dat wel. Zie de [Versie 2-backlog](Versie-2-Backlog.md).

## 8. Testhaken

`voice-side-scroller-screen`, `voice-side-scroller-stage` (met `data-scroll-x`), `voice-side-scroller-player`, `voice-side-scroller-hud`, `voice-side-scroller-shields`, `voice-side-scroller-combo`, `voice-side-scroller-record`, `voice-side-scroller-new-record`, `voice-side-scroller-target-layer`, `voice-side-scroller-obstacle-layer`, `voice-side-scroller-thumb-rail`, `voice-side-scroller-start-overlay`, `voice-side-scroller-round-summary`, `voice-side-scroller-wave`, `voice-side-scroller-status-panel`.
