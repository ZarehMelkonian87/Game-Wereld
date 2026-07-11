# 📋 Takenlijst: Verbeteringen Woordenschat Bezem Escape
> Deze lijst bevat alle verbeterpunten uit het analyserapport om de game uitstekend speelbaar te maken op Samsung Galaxy-apparaten en didactisch te optimaliseren.

---

## [ ] 📱 1. Schaalbaarheid & Aspect Ratio (Samsung Galaxy)
- [ ] **Aspect Ratio Lock op de Scene**
  * Bestanden: [SceneBuilderScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/SceneBuilderScreen.tsx) & [BeachBackground.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/components/layout/BeachBackground.tsx)
  * Actie: Vergrendel het canvas (`scene-area`) in een vaste aspect ratio container van `16:9` via CSS (`aspect-ratio: 16/9`), zodat achtergrondafbeeldingen en percentage-hitboxes op langwerpige Galaxy-schermen en Galaxy-tablets perfect uitgelijnd blijven.

## [ ] 👆 2. Drag & Drop Interacties (Mobiel & Touch)
- [ ] **Touch-Action Conflict Oplossen**
  * Bestanden: [StickerObject.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/game-platform/components/gameplay/StickerObject.tsx)
  * Actie: Voorkom dat de browser touch-gestures kaapt (verticale scroll-interpretatie die `pointercancel` triggert) door de CSS-klasse `touch-action` dynamisch in te stellen op `touch-none` bij actieve interactie of tijdens slepen.
- [ ] **Drop-Tolerantie & Clamping**
  * Bestanden: [SceneBuilderScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/SceneBuilderScreen.tsx)
  * Actie: Voeg een tolerantiemarge toe van `30px` buiten de sceneArea grenzen en klem (clamp) de coördinaten vast aan de dichtstbijzijnde rand bij een drop, in plaats van de actie direct te annuleren.
- [ ] **Touch Target Size**
  * Bestanden: [StickerObject.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/game-platform/components/gameplay/StickerObject.tsx)
  * Actie: Verhoog de minimale grootte van de clamp van stickers op mobiele resoluties naar `4.2rem` (circa 68px) en vergroot de actieve aanraakpaddings voor kinderen.

## [ ] 🎓 3. Educatieve & Visuele Scaffolding
- [ ] **Pulsing Target Zones (Doelzones)**
  * Bestanden: [SceneBuilderScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/SceneBuilderScreen.tsx) & [TargetZoneHint.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/scene-builder/TargetZoneHint.tsx)
  * Actie: Laat de juiste doelzone (bijv. zee, lucht of strand) zachtjes pulseren (glow effect) zodra het kind een sticker optakt of geselecteerd heeft, om abstracte plaatsbegrippen visueel te verduidelijken.
- [ ] **Speelse Ondertiteling & Pictogrammen**
  * Bestanden: [SceneBuilderScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/SceneBuilderScreen.tsx)
  * Actie: Voeg een optie toe voor grote, duidelijke ondertiteling van de gesproken opdrachten, ondersteund met picto-pijlen (bijv. pijl omhoog voor "boven"), voor lawaaierige klaslokalen of kinderen met een gehoorbeperking.
- [ ] **Spraak-animatie in Zeg & Zet**
  * Bestanden: [SceneBuilderScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/SceneBuilderScreen.tsx)
  * Actie: Voeg een optionele, speelse spraakgolf-visualisatie toe wanneer het kind begint te praten in de actieve taalmodus, om spreekgedrag positief te bekrachtigen.
