# Incidentrunbooks

Gebruik eerst de zichtbare correlation-id en de developmentdiagnose-export. Deel geen naam, transcript, antwoordinhoud, audio of volledige browserprofielen.

## Storage migration failure

Signaal: boot toont `migration-failed`.

1. Exporteer veilige diagnose.
2. Reproduceer met corruptiescenario en relevante migratiefixture.
3. Kies `Opnieuw proberen`; gebruik tijdelijke modus alleen als voortgangsverlies voor deze sessie is begrepen.
4. Maak de database alleen opnieuw na begeleidersbevestiging en nadat lokale data veilig is beoordeeld.
5. Rollback naar de vorige complete release; verwijder legacybronkeys niet.

## Quota

Signaal: `quota-exceeded` bij eventwrite of offlinepakket.

1. Bekijk quota en appcaches in diagnostiek.
2. Reproduceer met `storage: { outcome: "quota-exceeded" }`.
3. Verwijder uitsluitend een gekozen offlinepakket na bevestiging; verwijder geen profieldata.
4. Retry de oorspronkelijke actie en controleer dat package-status nooit ten onrechte `ready` was.

## Corrupt profiel/persistente data

1. Noteer correlation-id en foutcode; kopieer geen ruwe recordinhoud.
2. Draai corruptiefixture/scenario.
3. Probeer migratie/rebuild op een kopie of testfixture.
4. Alleen als herstel onmogelijk is: database reset met expliciete bevestiging.

## Ontbrekende media

1. Controleer pakketstatus, contentversie en cachelijst.
2. Reproduceer met `media: { outcome: "error" }`.
3. Bied tekstalternatief; verwijder/download alleen het getroffen pakket opnieuw.
4. Controleer manifesthash, MIME-type en source path vóór heruitrol.

## Speechproblemen

1. Controleer secure context, capability en foutcode; leg geen transcript vast.
2. Reproduceer `denied` of `timeout`.
3. Gebruik de zichtbare typ-/aanwijsfallback.
4. Vraag microfoontoestemming niet herhaald zonder gebruikersactie.

## Lazy chunk failure

1. Gebruik correlation-id en controleer release/contentversie.
2. Probeer één gecontroleerde retry.
3. Bied update of veilig teruggaan.
4. Publiceer bij mismatch de vorige complete buildset; meng nooit shell en chunks van verschillende releases.

## Foutieve service-workerrelease

1. Stop nieuwe uitrol; laat actieve gamesessies eindigen.
2. Publiceer de vorige volledige shell/chunk/SW-set.
3. Controleer precache, navigatiefallback en één cache per release.
4. Verwijder caches alleen via de geteste service-workerstrategie; geen brede handmatige `caches.delete` zonder exact doel en bevestiging.

## Tabletopbewijs

| Incident               | Reproduceerbaar bewijs                     | Verwacht herstel                               |
| ---------------------- | ------------------------------------------ | ---------------------------------------------- |
| quota                  | declaratieve storagefake                   | foutresultaat, retry mogelijk                  |
| corruptie              | declaratieve storagefake + migratiefixture | geen stille defaults/partial writes            |
| speech denied/time-out | speechfake                                 | tekstalternatief                               |
| media error            | mediafake                                  | tekst blijft beschikbaar                       |
| offline/SW update      | environmentfake + PWA-E2E                  | update uitgesteld, offline eerlijk             |
| lazy crash             | loader-/boundarytest                       | shell blijft staan en correlation-id zichtbaar |

Verbeterpunt na tabletop: pakketgenerator en voortgangsquery waren nog één-gamegericht; beide zijn tijdens Groep H gegeneraliseerd.
