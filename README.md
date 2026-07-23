# 🎮 Game Wereld - Kindvriendelijke Gaming Platform

Een mobile-first game platform gebouwd met React, TypeScript, Vite en Tailwind CSS. Geïnspireerd door Roblox, ontworpen voor kinderen met een focus op veiligheid, gebruiksgemak en plezier!

## ✨ Features

- 🎨 **Roblox-achtige Gaming Aesthetics** - Donker thema met neon kleuren en 3D effecten
- 📱 **Mobile-First Design** - Volledig responsive, werkt perfect op telefoons en tablets
- 🔄 **Portrait & Landscape Support** - Automatische aanpassing aan schermoriëntatie
- 👤 **Meerdere Profielen** - Elk kind kan een eigen profiel met avatar aanmaken
- 🎭 **16 Epic Avatars** - Van Shadow Cat tot Dragon Master
- 🎯 **8 Game Zones** - Verschillende thema's zoals Number Zone, Beast Arena, Brain Power
- 🏆 **Progress Tracking** - Scores, sterren en voortgang per profiel
- 📊 **Voortgangsbeeld** - Gedetailleerd overzicht van vaardigheden per thema met percentages
- 📈 **Maandelijkse Groei** - Zie sterktes en uitdagingen van deze maand
- 💾 **Local Storage** - Alle data wordt veilig lokaal opgeslagen
- ⚡ **Smooth Animations** - Motion animaties voor een premium feel

## 🚀 Installatie & Gebruik

### Vereisten

- Node.js 22.21.x (zie `.nvmrc` en `package.json`)
- npm 10.9.x

### Stap 1: Installeer dependencies

```bash
npm install
```

### Stap 2: Start development server

```bash
npm run dev
```

Open de app op deze computer via `http://localhost:3000`.

Voor telefoon, tablet of een andere laptop op hetzelfde wifi-netwerk gebruik je het `Network` adres uit de terminal, bijvoorbeeld:

```text
http://192.168.1.79:3000
```

### Production Build

```bash
npm run build
```

De gebouwde bestanden komen in de `dist` folder.

### Preview Production Build

```bash
npm run preview
```

### Kwaliteitscontroles

`npm run check` voert de formatteringscheck, linting, TypeScriptcontrole, unit-/componenttests en architectuurregels uit. Het commando wijzigt geen bronbestanden. De onderdelen zijn ook afzonderlijk beschikbaar:

| Commando                    | Doel                                                          |
| --------------------------- | ------------------------------------------------------------- |
| `npm run format:check`      | controleer consistente opmaak                                 |
| `npm run lint`              | controleer TypeScript, React Hooks en toegankelijkheidsregels |
| `npm run typecheck`         | typecheck app-, test- en configuratiecode zonder output       |
| `npm run test`              | draai Vitest eenmalig                                         |
| `npm run test:watch`        | draai Vitest interactief tijdens ontwikkeling                 |
| `npm run test:coverage`     | genereer lokale V8-coveragerapportage                         |
| `npm run test:architecture` | bewaak imports en cycles met Dependency Cruiser               |
| `npm run check:dead-code`   | rapporteer ongebruikte files en dependencies met Knip         |
| `npm run test:e2e`          | draai de kritieke flow in Chromium en WebKit                  |

Gebruik `npm run format` bewust om ondersteunde bestanden te formatteren. Gegenereerde output en grote game-assets worden niet meegenomen. De normatieve eisen en tijdelijke uitzonderingen staan in `docs/code-quality-and-architecture.md` en `docs/architecture/temporary-exceptions.md`.

## 📁 Project Structuur

```
game-wereld-app/
├── src/
│   ├── app/
│   │   ├── components/      # Herbruikbare componenten (toekomstig)
│   │   ├── contexts/        # React Context (ProfileContext)
│   │   ├── data/            # Game data en avatars
│   │   ├── games/           # Eigen map per mini-game + documentatie
│   │   ├── screens/         # Alle schermen
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── ProfileSelectScreen.tsx
│   │   │   ├── AvatarSelectScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── GamesListScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── App.tsx          # Main app component
│   │   ├── Root.tsx         # Root layout met ProfileProvider
│   │   └── routes.tsx       # React Router configuratie
│   ├── styles/
│   │   ├── theme.css        # Tailwind theme en custom CSS
│   │   └── fonts.css        # Font imports
│   └── main.tsx             # App entry point
├── index.html               # HTML template
├── vite.config.ts           # Vite configuratie
├── package.json
└── README.md
```

## 🎮 Game Zones

Momenteel beschikbaar:

1. **Number Zone** 🔢 - Rekenen challenges
2. **Word Quest** 📚 - Taal avonturen
3. **Beast Arena** 🦁 - Dieren wereld
4. **Color Blast** 🎨 - Kleur explosies
5. **Shape Shift** 🔷 - Vormen puzzels
6. **Brain Power** 🧠 - Geheugen games
7. **Puzzle Master** 🧩 - Puzzel challenges
8. **Beat Zone** 🎵 - Muziek en ritme

## 🎭 Beschikbare Avatars

16 epic avatars inclusief:

- Shadow Cat 🐱
- Thunder Dog 🐶
- Dragon Master 🐉
- Robo Player 🤖
- Space Alien 👽
- Epic Wizard 🧙
- En meer!

## 🛠 Tech Stack

- **React 18.3** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router 7** - Routing
- **Tailwind CSS 4** - Styling
- **Motion (Framer Motion)** - Animaties
- **Lucide React** - Icons
- **Local Storage** - Data persistence

## 📱 Mobile Support

- ✅ Touch-friendly interface
- ✅ Grote knoppen (min. 80px)
- ✅ Portrait & Landscape modes
- ✅ Safe area insets voor modern devices
- ✅ Responsive layout voor alle schermgroottes

## 🔮 Toekomstige Uitbreidingen

De app is volledig voorbereid op:

- ✨ Toevoegen van echte mini-games
- 🎯 Multiplayer functionaliteit
- 🏅 Achievements en badges
- 📊 Statistieken en leaderboards
- 🎨 Meer avatars en themes
- 🔊 Geluid en muziek

## 📝 Nieuwe Games Toevoegen

Elke mini-game krijgt een eigen map in `/src/app/games/`.

Per game bewaren we minimaal:

- `README.md` - ontwerp, leerdoel, gameplay en meetdata.
- `index.tsx` - React component/entrypoint van de game.

Om nieuwe games toe te voegen:

1. Kopieer `/src/app/games/_template/`.
2. Geef de nieuwe map dezelfde id als de game.
3. Vul de `README.md` in.
4. Bouw de game in `index.tsx`.
5. Voeg de metadata toe in `/src/app/data/games.ts`.

```typescript
// Voeg een nieuwe game toe aan miniGames array
{
  id: "nieuwe-game",
  themeId: "math", // Kies een bestaand thema
  name: "Epic Game",
  description: "Beschrijving van de game",
  difficulty: "easy", // easy | medium | hard
  icon: "🎯",
}
```

## 🎨 Kleuren Aanpassen

Bewerk `/src/styles/theme.css` om het color scheme aan te passen.

## 📄 Licentie

Dit is een privé project voor educatief gebruik.

## 🤝 Support

Voor vragen of problemen, open een issue in de repository.

---

**Veel plezier met spelen! 🎮✨**
