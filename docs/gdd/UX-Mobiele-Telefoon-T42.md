# 📱 UX-Design — Mobiele Telefoon (`T-42`)

> Onderdeel van het multiplatform-initiatief ([GDD-index §13](GDD-index.md#13-multiplatform-ondersteuning--download-gating-initiatief)). Dit document is het **implementatiecontract** voor `T-43` en `T-46`. De daarin gedefinieerde flows zijn geïmplementeerd in de productiecomponenten `GameCardDownloadButton`, `DownloadGateModal` en `ConfirmDeleteModal`.

---

## 0. Metadata

| Veld                  | Waarde                                                       |
| :-------------------- | :----------------------------------------------------------- |
| **Platform**          | Mobiele telefoon (geïnstalleerde PWA én browser)             |
| **Documentversie**    | `1.0`                                                        |
| **Laatst bijgewerkt** | 2026-09-17                                                   |
| **Status**            | 🟢 Goedgekeurd & geïmplementeerd (`T-43` afgerond)           |
| **Bouwt op**          | `T-38` (platformdetectie), `T-39` (gate-architectuur, §13.5) |

---

## 1. Uitgangspunten

### 1.1 Eén vaste stand: 100% portret

De telefoonversie draait **uitsluitend in portret**. Reden (kindergebruik 4–8 jaar):

- **Natuurlijke handgreep** — jonge kinderen houden een telefoon verticaal vast, met één hand of twee duimen.
- **Microfoon-akoestiek** — de microfoon zit onderaan het toestel en staat in portret op de ideale afstand van de mond. Dit raakt direct de spraakmodi (Zeg & Zet / Vlieg / Bouw).
- **Geen afgekapte layout** — geen verspringende of half zichtbare speelvelden bij draaien.

**Screen guard:** wordt het toestel horizontaal gehouden, dan toont het spel een vriendelijk scherm _"Houd je telefoon rechtop"_ met knop **"Begrepen"**, in plaats van de layout te herschikken. De gameplay pauzeert zolang dit scherm zichtbaar is.

> Dit geldt **alleen voor telefoon**. Tablet (`T-44`) en web (`T-40`) bepalen hun eigen stand.

### 1.2 Safe areas

| Toestel                     | Boven                                  | Onder                                                                                                                               |
| :-------------------------- | :------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| **iPhone** (Dynamic Island) | min. `env(safe-area-inset-top)` ≈ 47pt | `env(safe-area-inset-bottom)` ≈ 34pt marge rond de home-indicator, zodat kinderhandjes niet per ongeluk naar het startscherm swipen |
| **Samsung/Android**         | punch-hole camera                      | navigatiebalk 24–48pt; verhoudingen 19.5:9 en 20:9 (verticaal iets royaler)                                                         |

Alle interactieve elementen blijven binnen de safe area en houden de a11y-norm ≥ 48×48 px aan (`T-13`).

---

## 2. Download-gate (kern van dit platform)

### 2.1 Waar zit de gate

De download wordt beheerd **in de spellenlijst**, geïntegreerd in de rechterzijde van elke game-kaart. Tikken op een kaart die nog niet klaar is, opent het **download­scherm** (schuift omhoog als modal).

**Vangnet:** daarnaast blijft er een onzichtbare controle op game-host-niveau (§13.5), zodat een game **nooit** kan starten zonder volledige content (bv. via een deeplink of een verlopen cache). De speler ziet dit vangnet normaal nooit.

### 2.2 Toestanden op de game-kaart

| #   | Toestand                   | Weergave op de kaart                                                                           |
| :-- | :------------------------- | :--------------------------------------------------------------------------------------------- |
| 1   | **Niet gedownload**        | Downloadknop met grootte: **📥 37 MB** (spelen niet mogelijk)                                  |
| 2   | **Bezig (achtergrond)**    | Geanimeerde voortgangsring met percentage (`⏳ 42%`)                                           |
| 3   | **Gedownload & Speelbaar** | Downloadknop verandert in **🗑️ Verwijder**-optie; aantikken van de kaart start direct het spel |
| 4   | **Update beschikbaar**     | Knop toont **🔄 Update**-indicator om nieuwste servercontent op te halen                       |

Verder: spelicoon vergroot naar **70×70 px** met badge; kaart compacter zodat er meer spellen zonder scrollen passen.

### 2.3 Downloadscherm — toestanden

Alle toestanden tonen: titel, _"Eenmalige Offline Download"_, fase-aanduiding, compacte weergave met zijmarges op mobiel, en onderaan de actieknoppen.

| Toestand                 | Inhoud                                                                                |                                     Acties                                     |
| :----------------------- | :------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------: |
| **Bezig**                | "Fase 2 van 3: Bestanden opslaan…" · voortgangsbalk met % · MB's · netwerk actief     |            🔒 **"Speel Nu (Pas na 100% download)"** — uitgeschakeld            |
| **Klaar**                | "Download Voltooid!" · _100% Opgeslagen • Direct offline speelbaar_                   | ✅ **"Klaar! Start Avontuur"** + link _Gamebestanden van apparaat verwijderen_ |
| **Fout**                 | "Download kon niet worden voltooid" · toelichting van de fout · herstelbaar           |                           🔄 **"Opnieuw Proberen"**                            |
| **Fout (opslag)**        | "Te weinig opslagruimte" · _Er is te weinig vrije opslag op dit toestel._             |                           🔄 **"Opnieuw Proberen"**                            |
| **Mobiele data (4G/5G)** | "Mobiele data (4G/5G)" · _Je gebruikt een mobiele dataverbinding. Download is ~X MB._ |         **[⬇️ Toch downloaden]** (geen blokkade) + **[Wacht op wifi]**         |
| **Groot pakket**         | Bewuste bevestiging boven **50 MB** met grootte + vrije ruimte                        |                       **"Start Download"** + **"Later"**                       |

Vaste voetnoot bij downloaden: _"Na deze download hoef je **nooit meer opnieuw** te downloaden, behalve bij een nieuwe app-update."_

### 2.4 Besloten gedrag

| Onderwerp                               | Keuze                                                                                                                                                                                                                                   |
| :-------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mobiele data (4G/5G)**                | **Waarschuwen + bevestigen** vóór de download (`Toch downloaden` vs. `Wacht op wifi`). Geen blokkade: de speler kan altijd bewust kiezen om via 4G/5G te downloaden. Op wifi start de download direct.                                  |
| **Verwijderen van gamebestanden**       | Bij klikken op `[🗑️ Verwijder]` (op kaart of in modal) opent een gestijlde **in-app ConfirmDeleteModal** (_"Spel verwijderen? De bestanden (~37 MB) worden gewist"_). Bevestigen wist de cache en zet de kaart terug naar `[📥 37 MB]`. |
| **Scherm sluiten (×) tijdens download** | **Download gaat door op de achtergrond**; de voortgang blijft zichtbaar op de game-kaart (ring/percentage). Het kind kan ondertussen rondkijken.                                                                                        |
| **Spelen tijdens download**             | Niet mogelijk voor deze game — kaart en Play blijven vergrendeld tot 100%. Andere (al gedownloade) games blijven speelbaar.                                                                                                             |
| **Web (desktop)**                       | Ongewijzigd: streaming, geen gate.                                                                                                                                                                                                      |

### 2.5 Koppeling met de gate-architectuur (`T-39`)

| Ontwerp                                | `DownloadGateState`                                      |
| :------------------------------------- | :------------------------------------------------------- |
| "Fase 1 van 3" (grootte bepalen)       | `phase: "sizing"`                                        |
| Mobiele-data-/groot-pakket-bevestiging | `phase: "confirm"` (+ `requiredBytes`, `availableBytes`) |
| "Fase 2 van 3" (bestanden) + %         | `phase: "downloading"` + `progress`                      |
| "Fase 3 van 3" (controleren)           | `phase: "verifying"`                                     |
| "Download Voltooid!"                   | `phase: "ready"`, `canPlay: true`                        |
| Foutschermen + Opnieuw                 | `phase: "error"` + `message`                             |
| Update-indicator 🔄                    | `outdated` → `phase: "needs-download"`                   |
| Vergrendelde Play-knop                 | `canPlay: false`                                         |

---

## 3. Schermen in portret

| #   | Scherm                           | Portret-aanpak                                                                       |
| :-- | :------------------------------- | :----------------------------------------------------------------------------------- |
| 1   | **Spellenlijst + download-gate** | Kaarten met geïntegreerde download-zone (§2.2)                                       |
| 2   | **Start & moduskeuze**           | 2×2 rooster, duimvriendelijk; header met naam + sterren                              |
| 3   | **Kies het Woord**               | Keuzekaarten in **2×2** touch-rooster                                                |
| 4   | **Zeg & Zet**                    | Opdrachtbalk boven, doelzone-label, strandscène daaronder, objectlade + mic onderaan |
| 5   | **Zeg & Bouw**                   | Stickerlade onderaan                                                                 |
| 6   | **Zeg & Vlieg**                  | Verticale vlucht, duim-rail binnen bereik                                            |
| 7   | **Beloningen**                   | Verticale lijst                                                                      |

### 3.1 Leerlijn (gecorrigeerd)

De moduskaarten volgen de leerlijn uit de game (`T-04`/`T-31`) — **de game is leidend**:

**Kies het Woord (0 ⭐) → Zeg & Zet (3 ⭐) → Zeg & Bouw (8 ⭐) → Zeg & Vlieg (14 ⭐)**

> De eerdere wireframe-versie toonde "Vlieg vanaf 6 ⭐" en "Bouw = Creatief"; dat is gecorrigeerd naar bovenstaande volgorde en drempels.

---

## 4. Acceptatiecriteria voor `T-43` & `T-46` (bouw)

1. Op een telefoon is de game **niet speelbaar** vóór 100% download; de Play-knop en kaartactie zijn vergrendeld tot alle content lokaal aanwezig is.
2. Na 100% download verandert de knop op de kaart in een **[🗑️ Verwijder]**-optie en start het aantikken van de kaart direct het spel.
3. Verwijderen toont een kindvriendelijke in-app modal (`ConfirmDeleteModal`) ter bevestiging vóór het wissen van de cache.
4. Alle downloadscherm-toestanden (§2.3) zijn bereikbaar, compact en kindvriendelijk geformuleerd met voldoende zijmarges op mobiel.
5. Sluiten tijdens downloaden laat de download doorlopen; de kaart toont de voortgang met een geanimeerde ring en percentage.
6. Op 4G/5G verschijnt eerst de databevestiging met keuze `Toch downloaden` (geen blokkade) of `Wacht op wifi`; op wifi start de download direct.
7. Draaien naar liggend toont de screen guard; gameplay pauzeert.
8. Safe areas gerespecteerd op iPhone én Samsung; alle knoppen ≥ 48×48.
9. **Web (desktop) gedraagt zich ongewijzigd** (streaming, geen gate) — regressietest.
10. Moduskaarten tonen de leerlijn 0/3/8/14 conform §3.1.
11. Oude implementatiecode (`OfflinePackageCard.tsx`, testroutes) is volledig opgeruimd.
