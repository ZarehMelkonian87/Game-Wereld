# 🛠️ Werkplan & Voorstellen — Magisch Strand-Avontuur

> **STATUS: VOLTOOID & GEARCHIVEERD (2026-09-18)**  
> Dit werkdocument verzamelde de open reviewpunten van 2026-09-13. **Alle daarin voorgestelde taken (`T-01`, `T-19` t/m `T-33`) zijn 100% geïmplementeerd, geverifieerd en opgenomen in de canonieke [GDD-index](GDD-index.md).** Dit document wordt bewaard als historisch besluitvormingsverslag.

**Legenda werkwijze:** 🟩 klaar om te doen (oorzaak bekend) · 🟨 keuze nodig van jou · 🟦 samen ontwerpen · 🔬 eerst onderzoeken.

### ✅ Besluiten (2026-09-13)

| Onderwerp | Besluit |
| :--- | :--- |
| **Dev-tools** (WP-B1) | Build-flag (`import.meta.env.DEV`) **+** `?dev=true`; toggle uit de zichtbare instellingen |
| **Zeg & Vlieg** (WP-B3) | Vriendelijk: **schildjes + persoonlijk record + combo** (geen harde game-over) |
| **Unlock/volgorde** (WP-B4) | **Ja** — unlock-mechanisme met leervolgorde **Kies het Woord → Zeg & Zet → Zeg & Vlieg** |
| **Zeg & Bouw** (WP-C8) | Claude schrijft eerst een **concept-voorstel** als startpunt |

---

## A. Bugs met bekende oorzaak (klaar om te fixen)

### WP-A1 · Video-foutmelding is vals 🟩 → `T-19`

**Probleem:** bij elke Zeg & Zet-opdracht verschijnt "De video-opdracht kan niet worden afgespeeld", terwijl de video bij klikken prima speelt.

**Oorzaak (gevonden):** in [InstructionVideoButton.tsx](../../src/app/games/magisch-strand-avontuur/screens/scene-builder/InstructionVideoButton.tsx) wordt bij autoplay `video.muted = false` gezet en dan `video.play()` aangeroepen. Browsers blokkeren autoplay-met-geluid zonder gebruikersgebaar → `play()` gooit een `NotAllowedError` → `onPlaybackError` → foutbanner. Bij een echte klik (gebruikersgebaar) mag het geluid wél en speelt het.

**Voorstel:** onderscheid maken tussen "autoplay geblokkeerd door beleid" (géén echte fout) en een echte afspeelfout.
- Autoplay op mount: start **gedempt** (`muted = true`) zodat het beeld alvast speelt, of sla autoplay-met-geluid over en wacht op de tik.
- Toon de foutbanner **alleen** bij een echte fout ná een gebruikersgebaar (vang `NotAllowedError` apart af en negeer die stil).

**Beslissing:** akkoord met deze aanpak? (Aanbevolen.)

---

### WP-A2 · Sterren tonen 120 bij nieuw profiel 🟩 → `T-21`

**Probleem:** een net aangemaakt profiel toont meteen 120 ⭐.

**Oorzaak (gevonden):** [StartScreen.tsx](../../src/app/games/magisch-strand-avontuur/screens/start/StartScreen.tsx) heeft `starCount = 120` als **hardgecodeerde default-prop**, en [index.tsx](../../src/app/games/magisch-strand-avontuur/index.tsx) geeft nooit een echte waarde mee. Het is een placeholder, niet gekoppeld aan de echte voortgang.

**Voorstel (deel van de "scores per profiel"-oplossing, zie WP-B2):**
- Verwijder de default `120`.
- Geef de **echte per-profiel sterrentotaal** door (uit de voortgang/`totalWordStars` van het actieve profiel).
- Doe dit consistent op álle plekken die sterren tonen (start, moduskeuze, beloning).

**Beslissing:** onderdeel van WP-B2 hieronder.

---

## B. Voorstellen waar jij een keuze maakt

### WP-B1 · Dev-tool "Zone Editor" verbergen voor gebruikers 🟨 → `T-20`

**Probleem:** de toggle "Zone Editor (DevTools)" staat in het instellingenscherm dat ouders/kinderen zien. We hebben geen database en geen accounts.

**Opties (van meest naar minst aanbevolen voor ons project):**

| # | Aanpak | Hoe | Voor / tegen |
| :-- | :--- | :--- | :--- |
| **1** ⭐ | **Build-flag** | Dev-tools alleen tonen als `import.meta.env.DEV` (dus nooit in de productie-build) | + Standaardpraktijk, 0 risico voor gebruikers. − Jij kunt ze in productie niet snel aanzetten |
| **2** ⭐ | **URL-parameter** | Dev-tools alleen via `?dev=true` (bestaat al voor de zone-tool); toggle uit de UI halen | + Werkt ook in productie als jij de link kent. − "Geheim" maar niet echt beveiligd |
| 3 | **Ouderpoort** | Verstop achter een kindslot (bv. "Hoeveel is 7 + 5?") | + Bekend patroon in kinder-apps. − Overkill voor alleen een dev-tool |
| 4 | **Geheim gebaar** | Bv. 5× op het logo tikken onthult dev-opties | + Leuk, onzichtbaar. − Minder ontdekbaar voor jou |

**Aanbeveling:** **combineer 1 + 2** — haal de toggle uit het zichtbare instellingenscherm; dev-tools verschijnen alleen in dev-modus (`import.meta.env.DEV`) óf via `?dev=true`. Standaard, veilig, en jij houdt toegang. Optie 3 (ouderpoort) bewaren we voor later echte oudersinstellingen.

**Beslissing:** welke optie(s)? (Aanbevolen: 1 + 2.)

---

### WP-B2 · Scores/voortgang netjes per profiel 🟨 → `T-21`, `GAP-10`

**Probleem:** elke gebruiker moet zijn eigen scores bijhouden; nu lijkt de teller niet per-profiel.

**Belangrijk:** we hébben al per-profiel opslag (sleutels als `magisch-strand-avontuur:{profileId}:...` en observaties in IndexedDB per profiel). Er zijn **geen accounts of database nodig** — de **profielen zíjn** het "account"-concept, lokaal opgeslagen op het apparaat. Het 120-probleem is puur de hardgecodeerde placeholder (WP-A2), niet een echt architectuurprobleem.

**Voorstel:**
1. **Eén bron van waarheid per profiel:** het sterrentotaal komt uit de voortgang van het actieve profiel (`totalWordStars`), overal consistent uitgelezen via de `profileId`.
2. **Nieuw profiel = 0 ⭐**, en scores volgen strikt de `profileId`.
3. **Verifiëren** dat schakelen tussen profielen de juiste scores toont en dat er geen lek is tussen profielen (`T-12`).
4. **Documenteren** dat "profiel = lokaal account op dit apparaat" het bewuste model is (geen cloud/login).

**Beslissing:** akkoord dat we bij het huidige model blijven (lokale profielen per apparaat, geen login)? Wil je op termijn óók scores delen tussen apparaten (dat vraagt wél een backend — apart, later)?

---

### WP-B3 · Zeg & Vlieg: vriendelijke uitdaging i.p.v. harde straf 🟨🟦 → `T-22` (herzien)

**Probleem/wens:** nu leidt één botsing tot "Game over". Je wilt géén harde straf (kinderen haken af), maar wél spanning en het gevoel "ik wil winnen, het lukt me". De speler moet leren sneller toe te passen wat hij in de andere modi leerde; bij een botsing mag de ronde opnieuw beginnen, maar vriendelijk.

**Voorstel — "vriendelijke herkansing" met behoud van spelspanning:**

Kern: **geen "Game over"-scherm**, wel een korte, vrolijke onderbreking en een directe herstart, met behoud van wat je verzamelde.

Concrete mechaniek-opties (te combineren):
- **Schildjes/hartjes (aanbevolen):** de speler heeft bv. 3 ✨-schildjes. Een botsing kost er één (kort schud-effect + vriendelijk geluid, geen scherm-onderbreking). Bij 0 schildjes: een vrolijk "Goed gevlogen! Je haalde X meter — probeer je record te verbeteren!" en meteen opnieuw. Zo is er spanning (schildjes raken op) zonder harde straf.
- **Persoonlijk record:** toon "Verste vlucht: X m" en vier het als de speler het verbetert → "ik wil winnen"-gevoel.
- **Combo/streak:** meerdere objecten snel achter elkaar goed benoemen geeft een zichtbare combo + bonus → beloont vaardigheid.
- **Zachte herstart:** bij een botsing na 0 schildjes geen "Game over", maar "Oeps, botsing! Opnieuw?" met een grote vrolijke **Opnieuw**-knop; verzamelde sterren van die run blijven behouden.

**Game-feel in alle 3 de modi (jouw wens):** consistent positieve bekrachtiging — combo's/streaks, persoonlijke records, kleine vieringen bij mijlpalen, en altijd "je kunt het, probeer nog eens" i.p.v. straf.

**Beslissing:** kies de mechaniek — (a) schildjes + record + combo (aanbevolen), (b) alleen zachte herstart + record, of (c) jouw eigen mix. En: hoeveel schildjes (bv. 3)?

---

### WP-B4 · Volgorde van de modi + unlock-mechanisme 🟨🟦 → nieuw `T-31`

**Probleem/wens:** de eerste twee modi zijn niet-strafend (kind speelt in eigen tempo); Zeg & Vlieg is uitdagender. Je oppert een unlock-mechanisme: een modus vrijspelen door genoeg punten in de vorige te halen.

**Voorstel — leertrap met vrijspelen:**

Volg de logopedische leertrap (GDD 2.3): **receptief → relationeel → productief**:

| Volgorde | Modus | Vrijgespeeld door | Waarom |
| :--: | :--- | :--- | :--- |
| 1 | **Kies het Woord** (receptief) | Altijd open (instap) | Makkelijkste; herkennen |
| 2 | **Zeg & Zet** (relationeel) | X ⭐ in Kies het Woord | Bouwt op herkenning |
| 3 | **Zeg & Vlieg** (productief) | Y ⭐ in Zeg & Zet | Moeilijkst; zelf benoemen + tempo |
| 4 | **Zeg & Bouw** (n.t.b.) | later | Zie WP-C8 |

- Vergrendelde modi tonen een vriendelijk slotje + "Speel eerst [modus] om dit vrij te spelen!" (niet frustrerend, wel een doel).
- Drempels (X, Y) klein houden en testen.

**Afhankelijkheid:** dit leunt op **één scores-systeem** (`T-01`) en **scores per profiel** (`T-21`).

**Beslissing:** wil je dit unlock-model? En de startvolgorde Kies het Woord → Zeg & Zet → Zeg & Vlieg (i.p.v. de huidige volgorde met Zeg & Zet eerst)?

---

## C. Samen ontwerpen / uitwerken

### WP-C1 · Mic-mechanisme Zeg & Zet herontwerpen 🟦 → nieuw `T-26`

**Huidig (werkt niet goed), zoals waargenomen:** mic aan → balk "Ik luister je"; als je de juiste zin zegt gebeurt er niets; scherm wisselt naar "Ik hoor je" met daaronder "bal" of "bal bal"; hintbalk "Ik hoorde de bal. Waar moet de bal komen?"; optie "Bedoel je bal / opnieuw zeggen". Dit loopt niet lekker.

**Voorstel — helder, voorspelbaar spraakverloop:**
1. **Luisteren:** wave + "Ik luister…" + live transcriptie (zie WP-C2).
2. **Herkennen:** zodra genoeg herkend is (object + plek), voer **direct** de plaatsing uit met bevestiging: "Ik zet de **boot** in de **zee** — klopt dat?" (zoals de typ-fallback nu al goed doet!).
3. **Deels herkend (alleen object):** vriendelijke vervolgvraag "Ik hoorde **boot**. Waar moet de boot komen?" en luister door.
4. **Niets/onduidelijk:** "Ik hoorde het niet goed, probeer nog eens" of stel het toetsenbord voor.
5. **Nooit vastlopen:** altijd een zichtbare uitweg (Opnieuw / Toetsenbord).

**Kernidee:** hergebruik de parser-logica die bij de **typ-fallback al bewezen werkt** (die plaatste de dolfijn correct). De spraakinvoer moet exact hetzelfde pad volgen.

**Afhankelijkheid:** samen met WP-C2 (wave + transcriptie) en WP-C3 (filter). **Beslissing:** akkoord met dit verloop?

---

### WP-C2 · Runtime wave + live transcriptie (Zeg & Zet én Zeg & Vlieg) 🟦 → nieuw `T-27`

**Wens:** de speler moet zien dát en wát hij zegt.

**Voorstel:**
- **Wave beweegt** op basis van geluid: stil = vlakke lijn, praten = bewegende golf.
- **Woord-voor-woord tekst** onder de wave, oplopend: "Zet" → "Zet de boot" → "Zet de boot links" → "Zet de boot links in de zee".
- Werkt in **beide** mic-modi (Zeg & Zet en Zeg & Vlieg).
- Technisch: gebruik `interimResults` (staat al aan) voor de oplopende tekst; koppel de wave-amplitude aan de microfoon-input (Web Audio `AnalyserNode`) zodat de golf echt op de stem reageert.

**Afhankelijkheid:** basis voor WP-C1 en WP-C4. **Beslissing:** akkoord? Wil je de wave in beide modi identiek, of per modus een eigen stijl?

---

### WP-C3 · Bescherming tegen scheld-/ongewenste woorden 🟦 → nieuw `T-28`

**Wens:** vriendelijk beschermen tegen scheldwoorden/ongewenste woorden in de live transcriptie (kinderen gaan los).

**Voorstel:**
- **Blocklist** (Nederlandse scheld-/ongewenste woorden) — herkende woorden die matchen worden **niet getoond** op het scherm.
- Bij een treffer: geen straf, wel een vriendelijke nudge: "Laten we bij de strandwoorden blijven! 🏖️".
- Omdat het spel toch alleen de **doelwoorden** nodig heeft, negeren we de rest sowieso voor de gameplay; het filter dekt vooral de **zichtbare transcriptie**.
- Blocklist onderhoudbaar in één bestand; uitbreidbaar.

**Beslissing:** akkoord? Heb je specifieke woorden/gevoeligheden die er zeker in moeten?

---

### WP-C4 · Zeg & Vlieg: mic-commando's werken niet 🔬🟦 → nieuw `T-32`

**Probleem:** in Zeg & Vlieg werken de spraakcommando's helemaal niet en is er geen feedback dat er gesproken wordt.

**Aanpak:** eerst onderzoeken (werkt de herkenning-hook hier überhaupt? `autoStopMs: 0` + `restartOnEnd` kan hier problemen geven), dan de **wave + transcriptie** (WP-C2) toevoegen zodat de speler feedback ziet, en de woordherkenning koppelen aan het verzamelen van objecten.

**Afhankelijkheid:** WP-C2 (wave/transcriptie). **Beslissing:** akkoord met "eerst onderzoeken, dan wave + koppeling"?

---

### WP-C5 · Random objecten in alle 3 de modi 🟦 → nieuw `T-29`

**Wens (nieuw idee):** alle 3 de modi moeten objecten/opdrachten **willekeurig** aanbieden. Kies het Woord doet dit al; Zeg & Zet en Zeg & Vlieg moeten dit (ook) ondersteunen. Staat dit niet in de GDD, dan aanpassen.

**Voorstel:**
- Eén gedeelde, herbruikbare **shuffle-aanpak** voor opdracht-/objectvolgorde.
- Per ronde eventueel een willekeurige **selectie** (subset) i.p.v. altijd de volledige lijst in vaste volgorde.
- Vastleggen in GDD (sectie 4 + 6) dat randomisatie de norm is voor alle modi.

**Beslissing:** volledige lijst in willekeurige volgorde, of een willekeurige **subset** per ronde (bv. 8 van de 12)? En moet de volgorde per ronde opnieuw shuffelen?

---

### WP-C6 · Kies het Woord: audio-functie verwijderen 🟩🟦 → nieuw `T-25`

**Wens:** de losse audio-voorleesfunctie (`FEAT_WORD_AUDIO`) is overbodig; de **video kan herspeeld** worden. Verwijder de functionaliteit én alle bijbehorende UI-knoppen, en haal het uit de GDD/Feature-catalogus.

**Voorstel:** verwijderen `FEAT_WORD_AUDIO` en de knop(pen); documentatie opschonen.

**⚠️ Belangrijke afhankelijkheid:** als audio weggaat en de **video** het enige gesproken-/uitleg-kanaal wordt, dan **moet de video eerst werken** → hangt aan **WP-A1 / `T-19`**. Anders houden kinderen die niet lezen geen enkel audiokanaal over. **Doe `T-19` vóór `T-25`.**

**Beslissing:** akkoord met deze volgorde (eerst video fixen, dan audio verwijderen)?

---

### WP-C7 · Performance/lag — kaart-flits én mic-vertraging 🔬 → `T-23` (uitgebreid) + nieuw `T-33`

**Probleem (ernstig):** kaarten flitsen leeg bij doorschakelen (Kies het Woord), en — belangrijker — bij microfooncommando's is het soms zó traag dat de gameplay onmogelijk wordt (volgende commando lukt niet meer). Ook in andere games gezien.

**Vermoedelijke oorzaken (te onderzoeken):**
- **Afbeeldingen niet voorgeladen** → lege kaarten bij wissel (Kies het Woord). Fix: preload de volgende beelden.
- **Te veel re-renders tijdens spraak:** `interimResults` triggert bij elk tussenresultaat een `setState` → herhaalde re-render van zware componenten → jank. Fix: throttlen/debouncen, en zware onderdelen memo-iseren.
- **Herstart-churn:** `restartOnEnd`/sessie herstarten kan opstapelen. Onderzoeken.
- **Asset-grootte / blob-resolutie:** grote media of synchrone blob-resolutie kan blokkeren.

**Aanpak:** eerst **meten** (waar zit de lag precies), dan gericht optimaliseren. Dit is breder dan alleen Kies het Woord, dus een eigen onderzoekstaak `T-33`.

**Beslissing:** akkoord dat ik dit als aparte diepte-analyse oppak (meten → voorstel → fix)?

---

### WP-C8 · Zeg & Bouw: eerst volledig ontwerpen 🟦 → `T-04` (uitgesteld tot ontwerp klaar)

**Wens:** vóór implementatie wil je de **volledige gameplay + user journey** van Zeg & Bouw vastgelegd hebben.

**Voorstel:** we doen een aparte ontwerpsessie voor Zeg & Bouw (concept, mechaniek, schermen, journey, content, beloningen) en leggen die vast in de GDD + Journey Map, vóórdat er code komt. Ik kan een eerste concept-voorstel schrijven om op te reageren.

**Beslissing:** wil je dat ik een **concept-voorstel** voor Zeg & Bouw schrijf als startpunt, of lever jij eerst het idee aan?

---

## D. Documentatie die we bijwerken (volgt uit bovenstaande besluiten)

- **FEAT_PLAT_SETTINGS** verduidelijken (zie los antwoord in de chat / Feature-catalogus).
- GDD-index 4.4: Zeg & Vlieg-mechaniek herschrijven (WP-B3).
- GDD-index sectie 4/6: randomisatie als norm (WP-C5).
- GDD-index sectie 5: mic-verloop + wave/transcriptie + filter (WP-C1/C2/C3).
- Feature-catalogus: `FEAT_WORD_AUDIO` verwijderen (WP-C6); features toevoegen voor wave/transcriptie en filter.
- Volgorde + unlock (WP-B4) toevoegen aan GDD + Journey Map.

---

## E. Afhankelijkheden in één oogopslag

```
T-19 (video fix) ───────────────► T-25 (audio verwijderen K.h.W.)
T-01 (1 scoresysteem) ─┐
T-21 (scores per profiel)─┴──────► T-31 (unlock + volgorde modi)
WP-C2 (wave+transcriptie,T-27) ─┬► T-26 (mic Zeg & Zet)
                                └► T-32 (mic Zeg & Vlieg)
T-28 (woordfilter) ─────────────► onderdeel van T-27/T-26/T-32
```

Onafhankelijk (kan parallel): `T-20` (dev-tools verbergen), `T-21/A2` (120-fix), `T-29` (randomisatie), `T-33` (performance-analyse), `T-30/B3` (vriendelijk Zeg & Vlieg), `T-04/C8` (Zeg & Bouw ontwerp).

---

## F. Voorgestelde uitvoeringsvolgorde

1. **Snelle winst (bekende oorzaak):** `T-19` video-fix, `T-21` 120-fix, `T-20` dev-tools verbergen.
2. **Kernbeleving:** `T-01` één scoresysteem → daarna `T-31` unlock + volgorde, en `T-30` vriendelijk Zeg & Vlieg.
3. **Spraak-blok (samen):** `T-27` wave+transcriptie → `T-26` mic Zeg & Zet + `T-32` mic Zeg & Vlieg → `T-28` filter.
4. **Opschonen:** `T-25` audio weg (na `T-19`), `T-29` randomisatie, `T-03` ronde-einde Zeg & Zet.
5. **Onderzoek:** `T-33` performance-analyse (kan al eerder parallel starten — hoog belang).
6. **Ontwerp:** `T-04/C8` Zeg & Bouw volledig uitwerken.

> Deze volgorde is een voorstel; jouw beslissingen bij B en C kunnen hem verschuiven.
