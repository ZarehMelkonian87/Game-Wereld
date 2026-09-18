# 🔬 Analyse T-33 — Performance & Lag

> Diepte-analyse van de twee gemelde performanceproblemen: **kaarten flitsen leeg** (Kies het Woord) en **mic-vertraging die de gameplay onspeelbaar maakt**. Bevat de gemeten oorzaken, wat al is aangepast, en een geprioriteerd voorstel. Hoort bij taak `T-33` (+ `T-23`).

**Status:** 🔬 analyse — één veilige fix toegepast (nog niet gecommit; wacht op test door Zareh).

---

## 1. Samenvatting

| Symptoom | Belangrijkste oorzaak | Impact |
| :--- | :--- | :--- |
| Kaarten flitsen leeg (Kies het Woord) | Objectstickers laden op-aanvraag; geen preload; zware PNG's | Kort lelijk, maar speelbaar |
| **Mic voelt traag / volgende commando lukt niet** | **(a)** zware media (video's ~2,3 MB) laden/decoderen tijdens spraak + **(b)** 4s-stiltetimer vóór verwerking + **(c)** re-renders per tussenresultaat | **Ernstig** — blokkeert gameplay |

**Kernconclusie:** de **mediazwaarte** is vrijwel zeker de grootste boosdoener. Elke opdracht laadt/decodeert een **~2,3 MB instructievideo** (autoplay), terwijl de microfoon actief is. Dat concurreert op de main-thread en het netwerk met de spraakherkenning → haperende, trage verwerking.

---

## 2. Gemeten feiten (bewijs)

### 2.1 Mediagroottes (te zwaar)

- **Instructievideo's:** ~**2,2–2,5 MB per stuk**, en er zijn er **veel** (per instructie een opdracht-, feedback- én hintvideo). Bron: `assets/instructions/*.mp4`.
- **Objectstickers:** **100–244 KB per PNG**, 12 stuks (~2 MB totaal), **geen WebP** (achtergronden hebben wél WebP). Bron: `assets/objects/transparent/*.png`.

Ter vergelijking: een korte instructieclip hoort **< 300 KB** te zijn, een sticker **20–50 KB** (WebP). De huidige assets zijn dus **5–10× te groot**.

### 2.2 Video draait mee tijdens gameplay

- In **Zeg & Zet** en **Kies het Woord** staat `InstructionVideoButton` met `autoPlayOnMount` aan zodra audio aanstaat. Bij elke nieuwe opdracht/vraag wordt dus een **nieuwe ~2,3 MB video** geladen en gedecodeerd — precies wanneer het kind ook de microfoon gebruikt.

### 2.3 Spraak-verwerking

- **4s-stiltetimer (Zeg & Zet):** het commando wordt pas verwerkt bij `status === "heard"`, wat pas gebeurt **ná 4 seconden stilte** (`silenceStopMs: 4000`). Het kind spreekt, en er "gebeurt niets" totdat de timer afloopt → voelt kapot/traag. (Raakt ook `T-26`.)
- **Re-renders per tussenresultaat:** met `interimResults: true` werkt de transcript-state bij elk tussenresultaat bij. Als zware componenten (canvas, carrousel) daarop meerenderen, ontstaat jank. (Op te lossen door de spraak-UI te isoleren — hoort bij `T-27`.)

---

## 3. Wat al is aangepast (veilige fix)

**Kaart-flits — preload van objectstickers** ([useWordChoiceState.ts](../../src/app/games/magisch-strand-avontuur/screens/word-choice/useWordChoiceState.ts)): alle 12 stickers worden bij het openen van de quiz voorgeladen, zodat de browser ze cachet. **Resultaat (geverifieerd in de browser):** de netwerk-fetch bij het doorschakelen is weg; er resteert nog een minieme paint-tick. Volledige eliminatie vraagt kleinere beelden (zie §4.1).

> Deze wijziging is **nog niet gecommit** — eerst zelf testen.

---

## 4. Voorstel (geprioriteerd)

### 4.1 🥇 Media optimaliseren — grootste winst (nieuw: `T-33a` / `T-33b`)

| Sub | Wat | Verwacht effect |
| :--- | :--- | :--- |
| `T-33a` | **Stickers → WebP + resized** (bv. max 512px). 200 KB PNG → ~30–50 KB WebP | Kaart-flits weg; sneller decoden; minder geheugen |
| `T-33b` | **Video's comprimeren** (H.264/VP9, lagere bitrate/resolutie, poster-frame). 2,3 MB → ~200–400 KB | Veel minder main-thread/netwerk-druk tijdens spraak → **mic-lag sterk omlaag** |

> Dit raakt binaire assets en de visuele kwaliteit; daarom apart en met jouw review. Het project heeft al een `optimize:images`-script (sharp) als basis.

### 4.2 🥈 Video niet automatisch laten meedraaien tijdens spraak

- Video **niet autoplayen** zodra de microfoon actief is (of pas laden bij tik). Voorkomt dat een zware video en de spraakherkenning tegelijk om resources vechten. Klein en veilig; kan samen met `T-26`.

### 4.3 🥉 Spraak-UI isoleren + stiltetimer herzien (hoort bij T-26/T-27)

- **Isoleren:** de wave/transcriptie in een eigen, gememoïseerd component zodat tussenresultaten niet de hele scène opnieuw renderen (`T-27`).
- **Stiltetimer:** 4s is te lang; verwerk eerder of geef directe voortgang (woord-voor-woord), zodat het kind niet "in het niets" wacht (`T-26`).

---

## 5. Afhankelijkheden

- `T-33a`/`T-33b` (media) zijn **onafhankelijk** en kunnen meteen — grootste winst voor de laagste inspanning/risico.
- §4.3 valt samen met **`T-26`** (mic-mechanisme) en **`T-27`** (wave/transcriptie): daar horen de re-render-isolatie en de stiltetimer thuis, en dáár zijn ze met een echte microfoon te testen.

---

## 6. Aanbevolen volgorde

1. **`T-33a` + `T-33b`** (media comprimeren) — meet daarna of de mic-lag merkbaar minder is.
2. **§4.2** (video niet tijdens spraak).
3. De rest binnen **`T-27`/`T-26`** (met mic-test).

> Zo pakken we eerst de goedkope, risicoarme winst (kleinere media) en meten we het effect, vóórdat we de zwaardere spraak-refactor doen.
