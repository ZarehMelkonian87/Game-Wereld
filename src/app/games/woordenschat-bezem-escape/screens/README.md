# Screens

Deze map is voor volledige game-schermen.

Huidige schermen en mappen:

- `start/StartScreen`
- `world-select/WorldSelectScreen`
- `ModeSelectScreen`
- `settings/GameSettingsScreen`
- `SceneBuilderScreen`
- `WordChoiceScreen`
- `RaceScreen`
- `reward/RewardScreen`
- `ParentDashboardScreen`

Voorbeelden die hier later komen:

- `ProfileSelectScreen`
- `AvatarSelectScreen`

Regels:

- Maak geen lege schermcomponenten vooruit.
- Voeg een schermbestand pas toe wanneer we dat scherm echt gaan bouwen.
- Grote menu/interface-schermen krijgen een eigen map met kleine onderdelen.
- Root exports lopen via `screens/index.ts`; importeer schermen niet direct uit losse files.
- Profiel/avatar blijven later totdat de gameplay-basis visueel akkoord is.
- De bestaande Game Wereld app-profielen blijven leidend.
