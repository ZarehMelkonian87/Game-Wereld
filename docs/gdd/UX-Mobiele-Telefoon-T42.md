# 📱 UX-Design — Mobiele Telefoon (`T-42`)

> Onderdeel van het multiplatform-initiatief ([GDD-index §13](GDD-index.md#13-multiplatform-ondersteuning--download-gating-initiatief)). Dit document is het **implementatiecontract** voor `T-43` (bouw). Visueel wireframe: [`wirframe/WIREFRAME_MOBIEL_MAGISCH_STRAND_AVONTUUR.html`](../../wirframe/WIREFRAME_MOBIEL_MAGISCH_STRAND_AVONTUUR.html).

---

## 0. Metadata

| Veld | Waarde |
| :--- | :--- |
| **Platform** | Mobiele telefoon (geïnstalleerde PWA én browser) |
| **Documentversie** | `1.0` |
| **Laatst bijgewerkt** | 2026-09-17 |
| **Status** | 🟢 Ontworpen — ter goedkeuring vóór `T-43` |
| **Bouwt op** | `T-38` (platformdetectie), `T-39` (gate-architectuur, §13.5) |

---

## 1. Uitgangspunten

### 1.1 Eén vaste stand: 100% portret

De telefoonversie draait **uitsluitend in portret**. Reden (kindergebruik 4–8 jaar):

- **Natuurlijke handgreep** — jonge kinderen houden een telefoon verticaal vast, met één hand of twee duimen.
- **Microfoon-akoestiek** — de microfoon zit onderaan het toestel en staat in portret op de ideale afstand van de mond. Dit raakt direct de spraakmodi (Zeg & Zet / Vlieg / Bouw).
- **Geen afgekapte layout** — geen verspringende of half zichtbare speelvelden bij draaien.

**Screen guard:** wordt het toestel horizontaal gehouden, dan toont het spel een vriendelijk scherm *"Houd je telefoon rechtop"* met knop **"Begrepen"**, in plaats van de layout te herschikken. De gameplay pauzeert zolang dit scherm zichtbaar is.

> Dit geldt **alleen voor telefoon**. Tablet (`T-44`) en web (`T-40`) bepalen hun eigen stand.

### 1.2 Safe areas

| Toestel | Boven | Onder |
| :--- | :--- | :--- |
| **iPhone** (Dynamic Island) | min. `env(safe-area-inset-top)` ≈ 47pt | `env(safe-area-inset-bottom)` ≈ 34pt marge rond de home-indicator, zodat kinderhandjes niet per ongeluk naar het startscherm swipen |
| **Samsung/Android** | punch-hole camera | navigatiebalk 24–48pt; verhoudingen 19.5:9 en 20:9 (verticaal iets royaler) |

Alle interactieve elementen blijven binnen de safe area en houden de a11y-norm ≥ 48×48 px aan (`T-13`).

---

## 2. Download-gate (kern van dit platform)

### 2.1 Waar zit de gate

De download wordt beheerd **in de spellenlijst**, geïntegreerd in de rechterzijde van elke game-kaart. Tikken op een kaart die nog niet klaar is, opent het **download­scherm** (schuift omhoog als modal).

**Vangnet:** daarnaast blijft er een onzichtbare controle op game-host-niveau (§13.5), zodat een game **nooit** kan starten zonder volledige content (bv. via een deeplink of een verlopen cache). De speler ziet dit vangnet normaal nooit.

### 2.2 Toestanden op de game-kaart

| # | Toestand | Weergave op de kaart |
| :-- | :--- | :--- |
| 1 | **Niet gedownload** | Downloadknop met grootte: **📥 36 MB** |
| 2 | **Bezig (achtergrond)** | Voortgangsring/percentage op de plek van de knop |
| 3 | **Klaar** | **Knop verdwijnt volledig** → direct ▶️ Speel |
| 4 | **Update beschikbaar** | Knop keert terug als **🔄 Update**-indicator |

Verder: spelicoon vergroot naar **70×70 px** met badge; kaart compacter zodat er meer spellen zonder scrollen passen.

### 2.3 Downloadscherm — toestanden

Alle toestanden tonen: titel, *"Eenmalige Offline Download"*, fase-aanduiding, voortgangsbalk met %, bestanden/MB, netwerk + snelheid, en onderaan de **Play-knop**.

| Toestand | Inhoud | Play-knop |
| :--- | :--- | :--: |
| **Bezig** | "Strandbestanden Opslaan…" · *Fase 2 van 3: 42 van 81 bestanden (18 MB / 36 MB)* · 52% · WiFi • 4.2 MB/s | 🔒 **"Speel Nu (Pas na 100% download)"** — uitgeschakeld |
| **Klaar** | "Download Voltooid!" · *100% Opgeslagen • Direct offline speelbaar* | ✅ **"Klaar! Start Avontuur"** — groen, actief |
| **Fout (netwerk)** | "Download Gepauzeerd" · ⚠️ *Geen internetverbinding gevonden. Controleer verbinding.* · voortgang blijft behouden | 🔒 uitgeschakeld + **🔄 "Opnieuw Proberen"** |
| **Fout (opslag)** 🆕 | ⚠️ *Er is te weinig ruimte op dit toestel. Maak ~X MB vrij en probeer opnieuw.* (toont benodigd vs. beschikbaar) | 🔒 uitgeschakeld + **🔄 "Opnieuw Proberen"** |
| **Mobiele data** 🆕 | ⚠️ *Je gebruikt mobiele data. Deze download is ongeveer 36 MB.* | **"Toch downloaden"** + **"Wacht op wifi"** |
| **Groot pakket** | Bewuste bevestiging boven **50 MB** (bestaande drempel) met grootte + vrije ruimte | **"Ja, downloaden"** |

Vaste voetnoot bij elke toestand: *"Na deze download hoef je **nooit meer opnieuw** te downloaden, behalve bij een nieuwe app-update."*

### 2.4 Besloten gedrag

| Onderwerp | Keuze |
| :--- | :--- |
| **Mobiele data (4G/5G)** | **Waarschuwen + bevestigen** vóór de download. Op wifi start de download direct. |
| **Scherm sluiten (×) tijdens download** | **Download gaat door op de achtergrond**; de voortgang blijft zichtbaar op de game-kaart (ring/percentage). Het kind kan ondertussen rondkijken. |
| **Spelen tijdens download** | Niet mogelijk voor deze game — Play blijft vergrendeld tot 100%. Andere (al gedownloade) games blijven speelbaar. |
| **Web (desktop)** | Ongewijzigd: streaming, geen gate. |

### 2.5 Koppeling met de gate-architectuur (`T-39`)

| Ontwerp | `DownloadGateState` |
| :--- | :--- |
| "Fase 1 van 3" (grootte bepalen) | `phase: "sizing"` |
| Mobiele-data-/groot-pakket-bevestiging | `phase: "confirm"` (+ `requiredBytes`, `availableBytes`) |
| "Fase 2 van 3" (bestanden) + % | `phase: "downloading"` + `progress` |
| "Fase 3 van 3" (controleren) | `phase: "verifying"` |
| "Download Voltooid!" | `phase: "ready"`, `canPlay: true` |
| Foutschermen + Opnieuw | `phase: "error"` + `message` |
| Update-indicator 🔄 | `outdated` → `phase: "needs-download"` |
| Vergrendelde Play-knop | `canPlay: false` |

---

## 3. Schermen in portret

| # | Scherm | Portret-aanpak |
| :-- | :--- | :--- |
| 1 | **Spellenlijst + download-gate** | Kaarten met geïntegreerde download-zone (§2.2) |
| 2 | **Start & moduskeuze** | 2×2 rooster, duimvriendelijk; header met naam + sterren |
| 3 | **Kies het Woord** | Keuzekaarten in **2×2** touch-rooster |
| 4 | **Zeg & Zet** | Opdrachtbalk boven, doelzone-label, strandscène daaronder, objectlade + mic onderaan |
| 5 | **Zeg & Bouw** | Stickerlade onderaan |
| 6 | **Zeg & Vlieg** | Verticale vlucht, duim-rail binnen bereik |
| 7 | **Beloningen** | Verticale lijst |

### 3.1 Leerlijn (gecorrigeerd)

De moduskaarten volgen de leerlijn uit de game (`T-04`/`T-31`) — **de game is leidend**:

**Kies het Woord (0 ⭐) → Zeg & Zet (3 ⭐) → Zeg & Bouw (8 ⭐) → Zeg & Vlieg (14 ⭐)**

> De eerdere wireframe-versie toonde "Vlieg vanaf 6 ⭐" en "Bouw = Creatief"; dat is gecorrigeerd naar bovenstaande volgorde en drempels.

---

## 4. Acceptatiecriteria voor `T-43` (bouw)

1. Op een telefoon is de game **niet speelbaar** vóór 100% download; de Play-knop is aantoonbaar vergrendeld.
2. Na 100% verdwijnt de downloadknop en start het spel met één tik.
3. Alle zes downloadscherm-toestanden (§2.3) zijn bereikbaar en kindvriendelijk geformuleerd.
4. Sluiten tijdens downloaden laat de download doorlopen; de kaart toont de voortgang.
5. Op 4G/5G verschijnt eerst de databevestiging; op wifi niet.
6. Draaien naar liggend toont de screen guard; gameplay pauzeert.
7. Safe areas gerespecteerd op iPhone én Samsung; alle knoppen ≥ 48×48.
8. **Web (desktop) gedraagt zich ongewijzigd** (streaming, geen gate) — regressietest.
9. Moduskaarten tonen de leerlijn 0/3/8/14 conform §3.1.
