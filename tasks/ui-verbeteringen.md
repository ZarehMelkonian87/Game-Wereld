# 📋 Takenlijst: UI/UX Verbeteringen - Game Wereld

Deze takenlijst bevat alle geïdentificeerde verbeterpunten uit de UI-analyse. We kunnen deze taken één voor één gaan uitvoeren en afvinken.

## [x] 🎨 1. Algemene Stijl & Typografie
- [x] **Typografie upgraden**
  * Bestanden: [fonts.css](file:///Users/melkonian/git/Game-Wereld/src/styles/fonts.css), [theme.css](file:///Users/melkonian/git/Game-Wereld/src/styles/theme.css)
  * Actie: Google Font *Fredoka* (of *Outfit*) importeren en activeren als primair lettertype voor een speelse gaming-look.
- [x] **Achtergrond flits oplossen**
  * Bestanden: [theme.css](file:///Users/melkonian/git/Game-Wereld/src/styles/theme.css)
  * Actie: De body achtergrondkleur `#bae6fd` aanpassen naar de donkere gaming achtergrondkleur om een opstart-flits te voorkomen.

## [x] 🚀 2. Welcome Screen
- [x] **Gamepad Interactie**
  * Bestanden: [WelcomeHero.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/welcome/WelcomeHero.tsx)
  * Actie: Voeg hover-glow en schaal-effecten (`scale: 1.08`) toe aan het grote Gamepad-icoon.
- [x] **Quick Mute**
  * Bestanden: [WelcomeScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/welcome/WelcomeScreen.tsx)
  * Actie: Voeg een subtiele, zwevende audio/mute-knop toe aan het startscherm.

## [ ] 👤 3. Profile Select Screen
- [ ] **Gepersonaliseerde Profielkaarten**
  * Bestanden: [ProfileCard.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/profile-select/ProfileCard.tsx)
  * Actie: Geef elke profielkaart de verloopkleuren (gradient) van de bijbehorende avatar in plaats van universeel grijs.
- [ ] **Direct Beheer**
  * Bestanden: [ProfileCard.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/profile-select/ProfileCard.tsx)
  * Actie: Voeg een klein 'tandwiel'-beheericoontje toe op de profielkaarten om direct naar de profielinstellingen te kunnen navigeren.

## [ ] 🎭 4. Avatar Select Screen
- [ ] **Gamer Name Generator**
  * Bestanden: [AvatarNameStep.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/avatar-select/AvatarNameStep.tsx)
  * Actie: Voeg een knop "Verzin een naam 🎲" toe die een willekeurige toffe kindernaam genereert.
- [ ] **Invoerfeedback**
  * Bestanden: [AvatarNameStep.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/avatar-select/AvatarNameStep.tsx)
  * Actie: Voeg subtiele focus-animaties toe aan het invoerveld en toon een karakterteller (max 15 tekens).

## [ ] 🏠 5. Home Screen (Game Zones)
- [ ] **Voortgangsindicatoren**
  * Bestanden: [ThemeCard.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/home/ThemeCard.tsx)
  * Actie: Voeg per Game Zone-kaart een visuele indicator toe (bijvoorbeeld een voortgangsbalk of sterren-totaal).
- [ ] **Header Glow & Tooltips**
  * Bestanden: [HomeHeader.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/home/HomeHeader.tsx)
  * Actie: Geef de knoppen in de header (voortgang, instellingen, uitloggen) subtiele neon-randen en tooltips.

## [ ] 🎮 6. Games List Screen
- [ ] **Custom "Komt Binnenkort" Dialoog**
  * Bestanden: [GamesListScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/games-list/GamesListScreen.tsx)
  * Actie: Vervang de native browser `alert()` voor locked games met een mooie geanimeerde in-game dialoog of spraakballon.
- [ ] **Visuele Scheiding Locked Games**
  * Bestanden: [GameListCard.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/games-list/GameListCard.tsx)
  * Actie: Pas een grayscale/blur filter toe op locked game-kaarten zodat direct duidelijk is wat speelbaar is.

## [ ] ⚙️ 7. Settings Screen
- [ ] **Parental Gate (Ouderlijk Toezicht)**
  * Bestanden: [SettingsScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/settings/SettingsScreen.tsx)
  * Actie: Voeg een eenvoudige rekensom of beveiligingsvraag toe bij het klikken op "Delete Speler" om te voorkomen dat kinderen per ongeluk hun profiel wensen te wissen.
- [ ] **Geluidsfeedback**
  * Bestanden: [SettingsScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/settings/SettingsScreen.tsx)
  * Actie: Speel een kort effectgeluidje af bij het in- of uitschakelen van geluid en muziek.

## [ ] 📊 8. Progress Screen
- [ ] **Activiteitsgrafiek**
  * Bestanden: [ProgressScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/progress/ProgressScreen.tsx)
  * Actie: Voeg een kleurrijk staafdiagram toe met `recharts` voor de wekelijkse/maandelijkse speeltijd.
- [ ] **Prestatie Badges**
  * Bestanden: [ProgressScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/screens/progress/ProgressScreen.tsx)
  * Actie: Toon verdiende prestatie-badges wanneer een kind bepaalde mijlpalen behaalt.
