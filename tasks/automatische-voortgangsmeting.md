# 📋 Takenlijst: Automatische Voortgangsmeting & Opschonen Ouder-Dashboard

Deze takenlijst beschrijft de stappen om het handmatige ouder-dashboard uit de game `woordenschat-bezem-escape` te verwijderen en te vervangen door een automatische, data-gedreven meting in het speler-voortgangsscherm.

---

## 🧹 1. Verwijderen Ouders & Therapeuten UI

- [x] **Knop op Startscherm Verwijderen**
  * Bestand: [StartActions.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/start/StartActions.tsx)
  * Actie: Verwijder de `Ouders & Therapeuten` knop (`start-dashboard-button`).
- [x] **Props Opschonen in StartScreen**
  * Bestand: [StartScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/start/StartScreen.tsx)
  * Actie: Verwijder `onOpenDashboard` uit de component props en de aanroep.
- [x] **Navigatieknop in Adventure-Select Verwijderen**
  * Bestand: [AdventureSelectScreen.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/adventure-select/AdventureSelectScreen.tsx) & [AdventureBottomNavigation.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/screens/adventure-select/AdventureBottomNavigation.tsx)
  * Actie: Verwijder de dashboard-knop uit de navigatiebalk onderaan.
- [x] **Scherm Routering Verwijderen**
  * Bestand: [index.tsx](file:///Users/melkonian/git/Game-Wereld/src/app/games/woordenschat-bezem-escape/index.tsx)
  * Actie: Verwijder de import van `ParentDashboardScreen` en de rendering-tak `screenPreview === "dashboard"`.
- [x] **Ongebruikte Dashboard Bestanden Wissen**
  * Actie: Verwijder het bestand `ParentDashboardScreen.tsx` en de hele map `parent-dashboard/` fysiek uit het project.

---

## 🧮 2. Slimme Automatische Metingen Implementeren

- [x] **Voortgangsdata Uitlezen uit LocalStorage**
  * Bestand: [progressData.ts](file:///Users/melkonian/git/Game-Wereld/src/app/screens/progress/progressData.ts)
  * Actie: Schrijf een hulpmethode die de localStorage-sleutel `woordenschat-bezem-escape:${profileId}:progress` uitleest en de pogingen-array parsed.
- [x] **Statistieken Berekenen**
  * Bestand: [progressData.ts](file:///Users/melkonian/git/Game-Wereld/src/app/screens/progress/progressData.ts)
  * Actie: Bereken de live percentages voor de speler over de geselecteerde periode:
    * **In één keer goed (Foutloosheid):** `(aantal pogingen met attempts === 1 && hintsUsed === 0) / totaal aantal pogingen * 100`
    * **Zelfstandig opgelost (Zonder hints):** `(aantal pogingen met hintsUsed === 0) / totaal aantal pogingen * 100`
    * **Goed uitgesproken (Spraak-modus):** `(aantal pogingen in mode "zeg-en-bouw" && isCorrect === true) / totaal aantal pogingen * 100`
- [x] **Fallbacks toevoegen**
  * Bestand: [progressData.ts](file:///Users/melkonian/git/Game-Wereld/src/app/screens/progress/progressData.ts)
  * Actie: Zorg voor een nette nulmeting (bijvoorbeeld 0% of een call-to-action zoals *"Speel Bezem Escape om je eerste voortgang te zien!"*) als er nog geen gameplay-data is voor de speler.

---

## 🚀 3. Verificatie & Kwaliteitscontrole

- [x] **TypeScript & Build Check**
  * Actie: Run `npx tsc --noEmit && npm run build` om te garanderen dat de build slaagt zonder compiler-fouten.
- [x] **Gameplay & Voortgang Check**
  * Actie: Speel een ronde Bezem Escape, open daarna de Voortgangspagina en verifieer of de percentages live en accuraat zijn bijgewerkt.
