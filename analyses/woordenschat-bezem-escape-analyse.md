# 🎮 Analyserapport: +1 Woordenschat Bezem Escape
> **Auteur:** Antigravity (AI Pair Programmer)  
> **Perspectief:** Professional Game Designer & Educatief/Logopedisch Specialist  
> **Doelapparaten:** Samsung Galaxy (S-Series, A-Series, Z-Flip, Galaxy Tab)

Dit analyserapport evalueert de game **Woordenschat Bezem Escape** (gebaseerd op de code in [index.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/index.tsx)) met de nadruk op mobiele responsiviteit (in het bijzonder voor Samsung Galaxy aspect ratio's), de werking van de drag-and-drop interacties en de educatieve effectiviteit voor kinderen.

---

## 🛠️ Deel 1: Game Designer Analyse (Technisch & UX)

Samsung Galaxy telefoons (zoals de S21, S22, S23, S24 en A-Series) hebben extreem langwerpige schermen in portretstand (beeldverhouding **19.5:9** of **20:9**). Tablets zoals de Galaxy Tab S8/S9 hebben juist een **16:10** verhouding. Dit stelt strenge eisen aan de schaalbaarheid van hitboxes.

### 1. Het Aspect Ratio & Hitbox Verschuivingsprobleem (Kritiek)
*   **Probleem:** De achtergrond van het strand ([BeachBackground.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/components/layout/BeachBackground.tsx)) is gestyled met `object-cover`. Hierdoor wordt de afbeelding aan de zijkanten bijgesneden afhankelijk van het schermformaat. Echter, de interactieve zones ([content.ts](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/content.ts)) gebruiken absolute percentagecoördinaten (bijv. strand begint vanaf `y: 66%`).
*   **Gevolg op Galaxy:** Op een langwerpig Galaxy-scherm verschuift de visuele lijn van het strand op de achtergrondafbeelding door de automatische cropping, maar de onzichtbare aanraakzone blijft strak op 66% staan. Kinderen slepen de bal visueel correct naar het zand, maar de game keurt het af omdat de vinger de verschoven hitbox mist.
*   **Oplossing:** Dwing de spel-arena (`scene-area`) af in een vaste aspect ratio (bijvoorbeeld **16:9** of **4:3**) met `aspect-ratio: 16/9` en `max-width: 100%`, `max-height: 100%`. Hierdoor schalen de afbeelding en de hitboxcoördinaten exact 1-op-1 mee, ongeacht het schermtype.

### 2. Touch-Action Conflict (Pointer Cancel bij Drag-up)
*   **Probleem:** De carrouselknoppen ([StickerObject.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/game-platform/components/gameplay/StickerObject.tsx)) hebben de CSS-klasse `touch-pan-x` om horizontaal swipen in de balk toe te staan.
*   **Gevolg op Galaxy:** Wanneer een kind een sticker omhoog sleept naar de scene (verticale beweging), interpreteert Android/Chrome dit als een pagina-scroll. De browser triggert een `pointercancel`, waardoor het slepen direct afbreekt en de sticker terugschiet.
*   **Oplossing:** Zodra een `pointerdown` op een sticker plaatsvindt, moet de `touch-action` tijdelijk dynamisch op `touch-none` worden gezet om te voorkomen dat de browser de vingerbeweging kaapt.

### 3. Te Strikte Drop-grenzen (Edge Drops)
*   **Probleem:** In `getScenePointFromViewportPoint` in [SceneBuilderScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/SceneBuilderScreen.tsx) wordt gecontroleerd of de vinger zich exact binnen de coördinaten van de `sceneArea` bevindt.
*   **Gevolg op Galaxy:** Als een kind een sticker naar de onderrand van het strand sleept en zijn vinger per ongeluk 1 pixel over de rand van de objectenbalk beweegt, wordt de drop geannuleerd met de foutmelding: *"Laat het plaatje los op de scene"*.
*   **Oplossing:** Voeg een tolerantiemarge toe van **30px** buiten de scene-grenzen. Indien de vinger hier wordt losgelaten, klemt (clamped) de game het coördinaat automatisch vast op de dichtstbijzijnde rand.

### 4. Touch Target Sizes & Fijne Motoriek
*   **Probleem:** Op mobiele Galaxy-schermen schalen de sticker-knoppen via `clamp(3rem, 12vw, 5.5rem)` naar de minimale grens van `3rem` (48px). Dit is voor kleuters (met minder ontwikkelde fijne motoriek) erg klein en moeilijk te raken.
*   **Oplossing:** Verhoog de minimale grens naar `4.2rem` (circa 68px) en voeg grotere actieve paddings toe rondom de stickers.

---

## 🎓 Deel 2: Educatief & Logopedisch Analyse

De game sluit didactisch en logopedisch erg goed aan bij behandeldoelen zoals receptieve en actieve woordenschat, zinsbegrip en ruimtelijke begrippen. Wel zijn er verbeterslagen mogelijk:

### 1. Actieve Spraakstimulering in "Zeg & Zet"
*   **Sterk punt:** De modus nodigt ouders/begeleiders uit om de taalproductie te beoordelen via het *Parent Observation Panel*.
*   **Verbetering:** Kinderen reageren sterk op directe interactie. We kunnen optioneel de Web Speech API (spraak-naar-tekst) aanbieden. Wanneer het kind praat, kan er een visuele 'audiogolf' of een oplichtend figuurtje verschijnen om spreekpogingen te belonen en te stimuleren.

### 2. Visuele Ondersteuning van Abstracte Begrippen
*   **Probleem:** Begrippen als *"tussen"* of *"naast"* zijn voor kinderen met een taalontwikkelingsstoornis (TOS) erg abstract.
*   **Verbetering:** Zodra een kind een sticker oppakt, kan de juiste doelzone in de scene zachtjes pulseren (bijv. neon-geel). Dit geeft directe visuele scaffolding.

### 3. Auditatieve Overbelasting & Rumoerige Omgevingen
*   **Probleem:** De opdrachten worden uitsluitend via audio ingesproken. In een drukke klas of wachtruimte mist het kind de instructie.
*   **Verbetering:** Voeg een optie toe voor grote, speelse ondertiteling met pictogrammen voor de belangrijkste woorden (bijv. een pijl naar boven voor "boven").

---

## 📋 Deel 3: Plan van Aanpak (Aanbevolen Acties)

Indien goedgekeurd, stellen we voor de volgende wijzigingen in de code aan te brengen:

1.  **Tolerantie en Clamping toevoegen** aan drag-and-drop in [SceneBuilderScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/SceneBuilderScreen.tsx) zodat drops aan de randen soepel verlopen.
2.  **Aspect-ratio lock op de scene** introduceren in de CSS om hitbox-verschuiving op Galaxy-schermen te voorkomen.
3.  **Touch-action en drag-stuttering oplossen** in de carrousel door de `touch-action` tijdelijk op `touch-none` te zetten tijdens actieve drag.
4.  **Visuele scaffolding (pulsing zones)** implementeren wanneer een sticker wordt vastgehouden.
