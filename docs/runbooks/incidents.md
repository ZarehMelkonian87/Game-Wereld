# 🚑 Incidentrunbook

> Wat te doen als het misgaat. Begin altijd bij het zichtbare correlatie-id en de diagnose-export. Deel nooit een kindnaam, transcript, antwoordinhoud of audio.

**Laatst bijgewerkt:** 2026-09-22

## De game laadt niet na een release

**Signaal:** wit scherm, of 404's op `offline/*.json`, `sw.js` en `manifest.webmanifest`.

1. Controleer wat er live staat: geeft `…/Game-Wereld/package.json` een **200**, dan publiceert GitHub de ruwe broncode in plaats van de build.
2. Zet _Settings → Pages → Source_ op **GitHub Actions** en start de deploy-workflow opnieuw.
3. Controleer dat het manifest weer 200 geeft.
4. Op het toestel: **Nu bijwerken**, of de app verwijderen en opnieuw installeren.

## De microfoon doet niets

**Signaal:** wave beweegt wel maar er komt geen zin, of er gebeurt helemaal niets.

1. Open _Instellingen → Microfoon-diagnose_ op het toestel en doorloop de vier stappen.
2. Lees het rapport: bestaat de API, is er toestemming, komen er callbacks, hangt de sessie?
3. Controleer bij **Build** dat het toestel de nieuwste versie draait.
4. Veelvoorkomende oorzaken staan in [ADR-006](../architectuur/adr-006-spraakherkenning.md): een tweede microfoonopname, lege resultaat-events, of tussenresultaten die als definitief binnenkomen.
5. Ondertussen kan het kind altijd doorspelen met typen.

## Migratie mislukt bij opstarten

**Signaal:** de app toont `migration-failed`.

1. Exporteer de diagnose.
2. Reproduceer met de bijbehorende migratiefixture.
3. Kies **Opnieuw proberen**; gebruik de tijdelijke modus alleen als voortgangsverlies voor die sessie geaccepteerd is.
4. Bouw de database pas opnieuw op na bevestiging van de begeleider en nadat de lokale data is beoordeeld.
5. Rol terug naar de vorige complete release; verwijder geen legacysleutels.

## Opslag vol

**Signaal:** `quota-exceeded` bij het opslaan van een observatie of een offline-pakket.

1. Bekijk quota en caches in de diagnose.
2. Verwijder uitsluitend een gekozen offline-pakket, na bevestiging. Verwijder nooit profieldata.
3. Probeer de oorspronkelijke actie opnieuw en controleer dat de pakketstatus nooit ten onrechte `ready` was.

## Corrupte profiel- of voortgangsdata

1. Noteer correlatie-id en foutcode; kopieer geen ruwe recordinhoud.
2. Draai het corruptiescenario na.
3. Probeer migratie of herbouw op een kopie.
4. Alleen als herstel onmogelijk is: database resetten, met expliciete bevestiging.

## Ontbrekende media

1. Controleer pakketstatus, contentversie en cachelijst.
2. Bied het tekstalternatief aan (de opdracht staat altijd als tekst).
3. Download alleen het getroffen pakket opnieuw.

## Game hapert of voelt traag

1. Controleer of "Rustige beweging" aanstaat en of dat verschil maakt.
2. Meet of er zware media (video, geluid) tegelijk met de microfoon actief zijn.
3. Controleer de budgetten uit [ADR-003](../architectuur/adr-003-offline-pakketten-en-download-gate.md): stickers als WebP, video op 480p, geen universele CSS-animatiereset.
