# 05. Beloningen, Progressie & Opslag

Dit document specificeert het beloningsmechanisme, het voortgangs- en observatiemodel, en de technische opslagarchitectuur van **Magisch Strand-Avontuur**.

---

## 🏆 1. Beloningen- en Gamification-systeem

Het spel motiveert kinderen via een gelaagd beloningsmodel dat zowel directe acties (_micro-rewards_) als langetermijndoelen (_macro-rewards_) beloont:

### A. Directe Bekrachtiging (Micro-Rewards)

- **Woordsterren (⭐)**:
  - `+2` sterren bij een correcte plaatsing of juist gekozen woord.
  - `+1` bonusster bij een zelfstandig antwoord zonder hints.
- **Tempo / Snelheid (⚡)**:
  - Geeft visuele energie en versnelt de bezemanimatie.
  - Versterkt het gevoel van vlotheid en meesterschap.
- **Visuele Effecten**:
  - Sparkle-animaties ✨, pulserende randen en feestelijke mascotte-reacties bij elk succes.

### B. Ontgrendelbare Bezemskins & Stickers (Macro-Rewards)

Naarmate het kind meer woorden en rondes voltooit, ontgrendelt het nieuwe skins voor de magische vliegende bezem:

| Beloning ID      | Naam                | Vereiste Sterren | Vereist Tempo | Visuele Stijl                                       |
| :--------------- | :------------------ | :--------------- | :------------ | :-------------------------------------------------- |
| `broom-01-basic` | **Basis Bezem**     | 0                | 0             | Klassieke houten bezem met vrolijke strik.          |
| `broom-02-beach` | **Strand Bezem**    | 10               | 5             | Zonnige gele bezem met zeester-embleem.             |
| `broom-06-speed` | **Snelheids Bezem** | 25               | 15            | Flitsende gestroomlijnde bezem met bliksemaccenten. |
| `broom-07-gold`  | **Gouden Bezem**    | 50               | 30            | Schitterende gouden bezem met magische aura.        |

---

## 💾 2. Lokale Data- en Opslagarchitectuur

Het spel maakt gebruik van een robuuste, lokale opslaglaag gebouwd op **Dexie.js / IndexedDB** via de contracten van het centrale game-platform:

### A. Observatieregistratie (`PracticeEventV1`)

Bij elke voltooide of gemiste interactie schrijft de game een gestandaardiseerde observatie via `runtime.practice.append()`:

```typescript
interface PracticeObservation {
  assistance: Array<"instruction-replay" | "visual-hint" | "spoken-help">;
  attemptNumber: number;
  outcome: "correct" | "incorrect" | "skipped";
  responseTimeMs?: number; // Altijd geheel afgerond (Math.round)
  skillIds: string[]; // bijv. ["active-vocabulary", "vocabulary:boot"]
  taskId: string; // bijv. "zeg-en-vlieg:target-boot"
}
```

### B. Veilige Sanitatie van Tijd & Waarden

- Omdat interacties draaien op `performance.now()` en `requestAnimationFrame`, worden tijdsduren altijd expliciet door `Math.round(Math.max(0, ms))` gehaald.
- Het database-schema ([schemas.ts](file:///Users/melkonian/git/Game-Wereld/src/app/storage/schemas.ts)) bevat een automatische `transform` die zwevende kommagetallen afvangt en afrondt, waardoor database-validatiefouten (`storage-write-failed`) structureel worden voorkomen.

### C. In-Game Rondestatus vs. Platform Lifecycle

- **In-Game Rondes:** Afronding van een ronde van 10 vragen toont het in-game **Resultatenoverzicht** ([WordChoiceRoundSummary](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/word-choice/components/WordChoiceRoundSummary.tsx) of [VoiceSideScrollerRoundSummary](file:///Users/melkonian/git/Game-Wereld/src/app/games/magisch-strand-avontuur/screens/voice-side-scroller/VoiceSideScrollerRoundSummary.tsx)). Het spel blijft gemount en laat het kind direct opnieuw spelen.
- **Platform Exits:** `runtime.lifecycle.complete()` of `exit()` wordt uitsluitend aangeroepen wanneer de speler expliciet kiest om de game te verlaten naar het overkoepelende app-portaal.

---

## 🛡️ 3. Privacy, AVG & COPPA Compliance

Magisch Strand-Avontuur is **volledig ontworpen volgens privacy-by-design principes**:

1. **Geen Spraakopnames**: De microfooninput wordt uitsluitend lokaal in het werkgeheugen door de Web Speech API geanalyseerd; er worden géén audiobestanden opgeslagen of verzonden naar externe servers.
2. **Geen Advertenties of Tracking**: Geen trackers, externe analytics of in-app aankopen.
3. **Volledig Offline Functioneel**: Dankzij de PWA Service Worker en het offline asset-pakket werkt het volledige spel inclusief audio en video zonder actieve internetverbinding.
