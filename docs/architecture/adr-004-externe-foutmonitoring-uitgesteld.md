# ADR-004 — Externe foutmonitoring uitgesteld

Status: geaccepteerd — besluit `uitstellen`  
Datum: 23 juli 2026  
Eigenaar: opdrachtgever/repository-eigenaar  
Herbeoordeling: na een meetperiode met de lokale diagnose-export of vóór een publieke uitrol

## Context en probleem

Game Wereld is local-first, wordt grotendeels offline gebruikt en verwerkt gegevens van kinderen. Een externe foutmonitor kan fouten buiten een ontwikkelapparaat verzamelen, maar voegt een verwerker, netwerkverkeer, bewaarrisico, kosten en een nieuwe productiedependency toe. Er is nog geen gemeten foutvolume of vlootomvang die aantoont dat lokale diagnose onvoldoende is.

De relevante fouten zitten nu bij storage/migratie, gamechunk en GameHost, speech/media, service worker en offlinepakketten. Deze fouten zijn lokaal zichtbaar via een correlation-id, een begrensde veilige ringbuffer en een gesaniteerde diagnose-export. Offline opgetreden fouten kunnen niet betrouwbaar direct naar een leverancier worden gestuurd; later uploaden vergroot juist de retentie- en koppelingsrisico's.

## Besluit

Externe foutmonitoring wordt uitgesteld. Er wordt geen Sentry- of equivalente SDK, endpoint of account “alvast” toegevoegd. Eerst wordt vastgesteld:

1. hoeveel niet-lokaal oplosbare fouten daadwerkelijk voorkomen;
2. of begeleiders een veilige export kunnen aanleveren;
3. welke foutklasse aantoonbaar extra waarde uit externe aggregatie haalt;
4. welke juridische/verwerkersvoorwaarden en structurele kosten gelden.

Lokale diagnostiek is nu de primaire oplossing. Een herbeoordeling is nodig wanneer diagnose-exporten onvoldoende blijken, meerdere beheerde apparaten centraal ondersteund moeten worden of een productieregressie niet lokaal reproduceerbaar is.

## Privacy- en leveranciersbeoordeling

Voor eventuele invoering zijn vooraf verplicht:

- een EU-verwerkersovereenkomst, subverwerkerslijst en vastgelegde verwerkingslocatie;
- een DPIA/privacyreview voor kindcontext en een gedocumenteerde grondslag;
- standaard maximaal 30 dagen retentie, met getest verwijderproces;
- kostenplafond, rate limit en budgetwaarschuwing;
- geen advertentie-, fingerprinting- of cross-productidentiteit;
- een eigen willekeurige correlation-id per fout, nooit profiel-id of duurzame sessie-id;
- privacy- en scrubbingtests vóór activering.

## Toegestane gegevens

Alleen hetzelfde gevalideerde `DiagnosticEvent`-contract mag later kandidaat zijn:

- subsystem, eventnaam en severity;
- release-id, timestamp en correlation-id;
- allowlisted technische context: capability, contentversie, errorcode, game-id, operatie, herstelpad, route en technische state.

Altijd verboden:

- naam, avatar, profiel-id of andere kindidentiteit;
- transcript, ruwe antwoordinhoud, taakinhoud of vrije tekst;
- audio, video, foto of blob;
- DOM-, formulier-, toetsenbord-, pointer- of inputcapture;
- session replay, breadcrumbs met inputinhoud en device fingerprinting.

## Technische voorwaarden bij een later besluit `invoeren`

- Release-id komt uit hetzelfde buildcontract als lokale diagnostiek.
- Source maps worden privé tijdens CI geüpload, niet publiek gedeployed, en volgen dezelfde verwijdertermijn.
- Alleen error-events starten op 100%; warn-events worden maximaal 10% deterministisch gesampled; info/debug gaan nooit extern.
- Scrubbing gebeurt vóór transport én bij de leverancier; een strict-schemafout blokkeert verzending.
- Transport faalt stil en beïnvloedt gameplay, opslag of offlinegedrag niet.
- Integratie-, allowlist-, negatieve privacy-, offline-, sampling- en verwijdertests zijn groen vóór productieactivatie.

## Gevolgen

Voordeel is dat nu geen onbewezen privacy- en operationele complexiteit wordt toegevoegd. Nadeel is dat fouten niet automatisch over apparaten worden geaggregeerd. De veilige export en declaratieve failure-scenario's beperken dat nadeel en leveren eerst het bewijs voor een latere beslissing.
