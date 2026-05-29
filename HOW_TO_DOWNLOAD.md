# 📦 Hoe te downloaden en gebruiken

## Methode 1: Download als ZIP (Makkelijkst)

### Als je dit project op GitHub hebt:
1. Klik op de groene **"Code"** knop
2. Klik op **"Download ZIP"**
3. Pak het ZIP bestand uit naar een folder op je computer
4. Volg de instructies in `QUICK_START.md` of `INSTALLATIE.md`

### Als je bestanden lokaal hebt:
Je hebt al alle bestanden! Ga direct naar `QUICK_START.md`

---

## Methode 2: Git Clone (Voor developers)

```bash
git clone <repository-url>
cd game-wereld-app
npm install
npm run dev
```

---

## 📁 Wat zit er in deze download?

```
game-wereld-app/
├── 📄 README.md              # Uitgebreide project documentatie
├── 📄 QUICK_START.md         # Snelste manier om te beginnen
├── 📄 INSTALLATIE.md         # Stap-voor-stap installatie voor elk OS
├── 📄 HOW_TO_DOWNLOAD.md     # Dit bestand
├── 📄 package.json           # Project configuratie
├── 📄 vite.config.ts         # Vite build configuratie
├── 📄 tsconfig.json          # TypeScript configuratie
├── 📄 index.html             # HTML template
├── 📄 .gitignore             # Git ignore regels
│
└── 📁 src/                   # Broncode
    ├── 📄 main.tsx           # App entry point
    │
    ├── 📁 app/
    │   ├── 📄 App.tsx        # Main component
    │   ├── 📄 Root.tsx       # Root layout
    │   ├── 📄 routes.tsx     # Router configuratie
    │   │
    │   ├── 📁 screens/       # Alle schermen
    │   │   ├── WelcomeScreen.tsx
    │   │   ├── ProfileSelectScreen.tsx
    │   │   ├── AvatarSelectScreen.tsx
    │   │   ├── HomeScreen.tsx
    │   │   ├── GamesListScreen.tsx
    │   │   └── SettingsScreen.tsx
    │   │
    │   ├── 📁 contexts/      # React Context
    │   │   └── ProfileContext.tsx
    │   │
    │   └── 📁 data/          # Data bestanden
    │       ├── avatars.ts
    │       └── games.ts
    │
    └── 📁 styles/            # CSS bestanden
        ├── theme.css
        └── fonts.css
```

---

## ✅ Checklist na downloaden

- [ ] Node.js geïnstalleerd (v16+)
- [ ] Project uitgepakt/gedownload
- [ ] Terminal/CMD geopend in project folder
- [ ] `npm install` uitgevoerd
- [ ] `npm run dev` uitgevoerd
- [ ] Browser geopend op `http://localhost:3000`
- [ ] Mobiel getest via het `Network` adres uit de terminal
- [ ] App werkt! 🎉

---

## 🆘 Hulp nodig?

1. Check `INSTALLATIE.md` voor OS-specifieke instructies
2. Check `README.md` voor algemene documentatie
3. Zie "Veelvoorkomende Problemen" in `INSTALLATIE.md`

---

**Succes! Je hebt alles wat je nodig hebt om te starten! 🚀**
