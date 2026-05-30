# Fase 17 - Instellingen

## Doel

De game krijgt eigen profielspecifieke instellingen voor audio, hints, rustige beweging en voortgang resetten.

## Gebouwd

- Nieuw scherm `GameSettingsScreen.tsx`.
- Nieuw helperbestand `logic/settings.ts`.
- Instellingen worden per profiel opgeslagen onder:
  - `woordenschat-bezem-escape:<profileId>:settings`.
- Instellingen:
  - audio aan/uit;
  - hints aan/uit;
  - rustige beweging aan/uit.
- Audio-knoppen in scene-builder, woordkeuze en race respecteren `audioEnabled`.
- Hint-knoppen in scene-builder, woordkeuze en race respecteren `hintsEnabled`.
- Reset voortgang heeft ouderbevestiging met twee klikken.
- Reset wist:
  - gameprogress;
  - vrijgespeelde beloningen;
  - race session-state;
  - race result-state;
  - bestaande app-progress voor deze game wordt teruggezet naar 0.
- Instellingenscherm noemt expliciet:
  - oefenobservatie;
  - geen diagnose;
  - geen officiele testscore;
  - geen normvergelijking.

## Verificatie

- `npm run build` is succesvol.
- Browsercontrole kon voor deze fase niet opnieuw worden uitgevoerd omdat de Codex browser-pane tijdelijk niet beschikbaar was na eerdere tests. Dezelfde route is via build geverifieerd en wordt in Fase 18 opnieuw meegenomen in de volledige mobiele QA.
