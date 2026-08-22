# Uitvoerrapport Groep D — oefenevents, sessies en voortgangsprojecties

Datum: 23 juli 2026  
Status: afgerond

## Resultaat

Groep D vervangt gamespecifieke voortgangswrites en demo-afleidingen door één privacyveilig feitencontract. Alle huidige spelmodi rapporteren neutrale oefenobservaties via `GameRuntime`. De runtime vult identiteit, contentversie, event-id en tijd in en schrijft idempotent naar de repository.

De centrale projector is de enige bron van dashboardinterpretatie. Events blijven ongewijzigd, projecties zijn verwijderbaar en volledig herbouwbaar en ieder getal is gekoppeld aan de geselecteerde events en de projectorversie.

## Contract en inhoudelijke grens

ADR-002 definieert `PracticeEventV1`, de termen task, skill, attempt, instruction replay, visual hint en spoken help, plus representatieve eventreeksen. De opdrachtgever/repository-eigenaar is de inhoudelijk eigenaar en heeft het architectuurvoorstel en de uitvoering van Groep D expliciet geaccepteerd.

De status `confident` is uitsluitend een productmatige rekenregel voor het lokale oefenoverzicht. Het is geen pedagogische, medische of diagnostische uitspraak. Een wijziging van termen, drempels of fixtures vereist een nieuwe inhoudelijke goedkeuring.

Events en logs bevatten geen naam, avatar, ruwe audio of spraaktranscript. De Voice Side Scroller zet alleen het waarneembare resultaat, neutrale skill-id's, hulp en responstijd om.

## Sessies en betrouwbaarheid

- `GameHost` start iedere run met profiel-, game- en contentidentiteit.
- Sessies hebben `started`, `completed`, `abandoned` of `crashed` en kunnen maximaal één eindstatus krijgen.
- Een open sessie wordt bij een volgende appstart als `abandoned` hersteld.
- De eventwriter gebruikt injecteerbare klok- en id-adapters, valideert met Zod en is idempotent op event-id.
- Een eventwrite en de incrementele projectie-update gebeuren in één IndexedDB-transactie.
- Databaseversie 2 migreert oude sessies expliciet naar een bekende legacy-contentversie.

## Projector

Projectorversie 1 is pure TypeScript en verwerkt zelfstandige en ondersteunde correcte pogingen, incorrect, skipped, hintgebruik, instructieherhalingen, gesproken hulp, responstijd en skilltotalen. De projector:

- dedupliceert op event-id;
- sorteert gebeurtenissen deterministisch;
- ondersteunt een gerichte tijdsselectie;
- geeft bij rebuild en incrementele verwerking hetzelfde resultaat;
- bewaart `projectorVersion`, `calculatedAt` en bronselectie;
- muteert nooit ruwe events.

De kernprojector behaalt 95,45% statement-, 91,13% branch-, 100% function- en 100% line coverage.

## Spelmodi en dashboard

Scene Builder, Word Choice en Voice Side Scroller gebruiken dezelfde runtimewriter en mappinghelpers. De mappings leggen geen masterylabel vast. Speech unavailable en permission denied blijven normale, geteste fallbackflows.

Het dashboard leest rechtstreeks via een featurequery boven de repositories. Loading, geen oefeningen, legacy/gedeeltelijke data, rebuild en fouten hebben elk een expliciete toestand. Periodefilters selecteren eerst events en projecteren daarna dezelfde selectie. Statische voorbeeldcijfers, fictieve minuten en niet-herleidbare vergelijkingen zijn verwijderd.

## Export, retentie en verwijderen

De inhoudelijke voortgangsexport is gescheiden van de technische diagnose-export. De voortgangsexport bevat een eigen schema- en contractversie, maar geen naam, avatar of lokale profiel-id.

Ruwe events blijven lokaal bestaan tot profielverwijdering. Na 24 maanden volgt alleen een markering voor handmatige compactiereview; automatisch verlies van bronfeiten is niet toegestaan. Profielverwijdering wist settings, sessies, events, projecties en gamegebonden gegevens transactioneel. De E2E-test controleert na verwijdering alle betrokken stores.

## Toetsing aan Code Quality & Architecture Requirements

- Alle nieuwe en gewijzigde functies zijn arrow functions.
- Persistente grenzen zijn expliciet getypeerd, branded en met Zod gevalideerd.
- Games kennen geen Dexie-instance en schrijven geen projecties of definitieve labels.
- Projectielogica is puur en onafhankelijk van React, DOM en storage.
- Klok en ids zijn injecteerbaar; event-idempotentie en transacties zijn getest.
- Speechprivacy en exportprivacy zijn met gerichte tests afgedekt.
- Dependency Cruiser vindt geen grensschendingen of cycli.
- Knip vindt geen blokkerende ongebruikte bestanden, dependencies of onopgeloste imports.

## Verificatie

Uitgevoerd op 23 juli 2026:

- `npm run check`: groen; na de afsluitende concurrencytest 52 tests geslaagd en 1 bestaande Groep E-test als todo.
- Projectorcoverage: 95,45% statements, 91,13% branches, 100% functies en 100% regels.
- `npm run test:e2e`: 4 van 4 geslaagd in Chromium-tablet en WebKit-tablet.
- `npm run build`: groen.
- `npm run check:bundle`: shell 142,54/200 kB gzip, gamechunk 53,67/250 kB gzip en CSS 27,71/40 kB gzip.
- `npm run build:analyze`: groen en analysebestand gegenereerd.
- `npm run check:dead-code`: groen.
- `npm audit --audit-level=high`: 0 kwetsbaarheden.

## Commitbericht voor de gebruiker

`feat(progress): centralize practice events, sessions and projections`
