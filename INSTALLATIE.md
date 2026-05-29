# 🚀 Installatie Instructies - Game Wereld

## Voor Windows Gebruikers

### Stap 1: Installeer Node.js
1. Download Node.js van https://nodejs.org/
2. Kies de LTS versie (Long Term Support)
3. Voer de installer uit en volg de instructies
4. Herstart je computer na installatie

### Stap 2: Controleer of Node.js is geïnstalleerd
Open Command Prompt (cmd) en type:
```bash
node --version
npm --version
```

Je zou versie nummers moeten zien (bijv. v20.x.x)

### Stap 3: Download het project
1. Download het hele project als ZIP
2. Pak het uit naar een map (bijv. `C:\game-wereld-app`)

### Stap 4: Open Command Prompt in project folder
1. Ga naar de uitgepakte map
2. Rechtsklik in de folder en kies "Open in Terminal" of "Command Prompt here"
   (Of type `cmd` in de adresbalk van de Windows Verkenner)

### Stap 5: Installeer dependencies
In Command Prompt:
```bash
npm install
```

Dit kan een paar minuten duren.

### Stap 6: Start de app!
```bash
npm run dev
```

Open de app op deze computer via `http://localhost:3000`.
Voor telefoon/tablet/laptop op hetzelfde wifi-netwerk gebruik je het `Network` adres uit de terminal, bijvoorbeeld `http://192.168.1.79:3000`.

---

## Voor Mac Gebruikers

### Stap 1: Installeer Node.js
1. Download Node.js van https://nodejs.org/
2. Kies de LTS versie
3. Voer de installer uit en volg de instructies

OF gebruik Homebrew (als je dat hebt):
```bash
brew install node
```

### Stap 2: Controleer installatie
Open Terminal en type:
```bash
node --version
npm --version
```

### Stap 3: Download en pak uit
1. Download het project als ZIP
2. Pak uit naar een map (bijv. `~/game-wereld-app`)

### Stap 4: Navigeer naar project folder
```bash
cd ~/game-wereld-app
```

### Stap 5: Installeer dependencies
```bash
npm install
```

### Stap 6: Start de app
```bash
npm run dev
```

Open de app op deze computer via `http://localhost:3000`.
Voor telefoon/tablet/laptop op hetzelfde wifi-netwerk gebruik je het `Network` adres uit de terminal, bijvoorbeeld `http://192.168.1.79:3000`.

---

## Voor Linux Gebruikers

### Stap 1: Installeer Node.js
Ubuntu/Debian:
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Fedora:
```bash
sudo dnf install nodejs
```

Arch:
```bash
sudo pacman -S nodejs npm
```

### Stap 2: Download en pak uit
```bash
cd ~
# Pak je gedownloade ZIP uit
unzip game-wereld-app.zip
cd game-wereld-app
```

### Stap 3: Installeer dependencies
```bash
npm install
```

### Stap 4: Start de app
```bash
npm run dev
```

Open de app op deze computer via `http://localhost:3000`.
Voor telefoon/tablet/laptop op hetzelfde wifi-netwerk gebruik je het `Network` adres uit de terminal, bijvoorbeeld `http://192.168.1.79:3000`.

---

## Veelvoorkomende Problemen

### "Cannot find module"
```bash
npm install
```

### Port 3000 is al in gebruik
Bewerk `vite.config.ts` en verander de port:
```typescript
server: {
  host: "0.0.0.0",
  port: 3001, // Of een andere port
}
```

### Installatie duurt heel lang
Dat is normaal! De eerste keer worden alle dependencies gedownload.

### Browser opent niet automatisch
Open handmatig: `http://localhost:3000`

---

## Stoppen met de App

Druk op `Ctrl + C` in de terminal/command prompt waar de app draait.

---

## Handige Commando's

```bash
# Start development server
npm run dev

# Build voor productie
npm run build

# Preview productie build
npm run preview

# Installeer nieuwe dependency
npm install package-name

# Update alle dependencies
npm update
```

---

## Extra: Visual Studio Code

Voor het beste development ervaring:

1. Download VS Code: https://code.visualstudio.com/
2. Open de project folder in VS Code
3. Installeer aanbevolen extensies:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin (Volar)

---

**Veel succes! Als je problemen hebt, check de console voor foutmeldingen.** 🚀
