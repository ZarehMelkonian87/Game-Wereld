# Fase 14 - Voortgang Opslaan Per Kindprofiel

## Doel

De game slaat oefenobservaties nu per kindprofiel op. Dit is oefendata voor ouder/logopedist, geen diagnose en geen officiele testscore.

## Gebouwd

- Nieuwe helper `logic/progress.ts`.
- Voortgang wordt opgeslagen onder profielspecifieke localStorage keys:
  - `woordenschat-bezem-escape:<profileId>:progress`.
- Race-resultaat wordt gekoppeld aan de bestaande app-profielvoortgang.
- Scene-builder schrijft oefen-events voor:
  - correct zonder hulp;
  - correct met hint;
  - hulp nodig / nog oefenen.
- Woordkeuze schrijft oefen-events voor:
  - herkend zonder hulp;
  - herkend met hint;
  - fout gekozen / nog oefenen.
- Ouder/logopedist beoordelingen worden opgeslagen voor:
  - actieve woordenschat;
  - zinnen nazeggen.
- Race-samenvatting schrijft oefen-events voor:
  - geoefende woorden;
  - geoefende plaatsbegrippen;
  - hints;
  - audioherhalingen;
  - speed;
  - woordsterren.

## Data Die Nu Wordt Bewaard

- geoefende woorden;
- herkende woorden;
- actief benoemde woorden;
- geoefende plaatsbegrippen;
- begrippen die moeilijk waren;
- zinsbegripresultaten;
- zinsnazegpogingen;
- aanwijzingen-volgen observaties;
- woordcategorie veld is voorbereid via `languageDomains`;
- correct zonder hulp;
- correct met hulp;
- hulp nodig / nog oefenen;
- hints en audioherhalingen.

## Verificatie

- `npm run build` is succesvol.
- Browser smoke test:
  - race afgerond;
  - beloningsscherm geopend;
  - `data-progress-saved="true"`;
  - profiel-id staat op het scherm;
  - race-resultaat behoudt speed, sterren en result-id.
