# Diagnose-export en reproduceerbare failure-scenario's

## Doel

Een development-diagnose-export beschrijft alleen technische toestand en maximaal 100 gevalideerde events. De export bevat geen naam, profiel-id, transcript, ruwe antwoordinhoud of audio. Deel een export alleen via het afgesproken ontwikkel-/supportkanaal en verwijder hem na analyse.

## Van export naar scenario

Vertaal alleen technische velden naar `RuntimeFailureScenario`; kopieer nooit vrije tekst of gebruikersinhoud:

| Veilige diagnose-indicatie   | Declaratief scenario                       |
| ---------------------------- | ------------------------------------------ |
| `storage` + `quota-exceeded` | `storage: { outcome: "quota-exceeded" }`   |
| ongeldige persistente data   | `storage: { outcome: "corrupt" }`          |
| speech `not-allowed`         | `speech: { outcome: "denied" }`            |
| speech `no-speech`           | `speech: { outcome: "timeout" }`           |
| media unavailable            | `media: { outcome: "error" }`              |
| browser offline              | `network: { online: false }`               |
| update wacht                 | `serviceWorker: { updateAvailable: true }` |

Gebruik voor clock en UUID alleen nieuwe testwaarden. Een speechresultaatscenario gebruikt een verzonnen testzin, nooit een echt transcript.

```ts
const scenario: RuntimeFailureScenario = {
  clock: { now: "2026-07-23T12:00:00.000Z" },
  network: { online: false },
  random: { seed: 42 },
  speech: { outcome: "denied" },
  storage: { outcome: "quota-exceeded" },
  serviceWorker: { updateAvailable: true },
  uuids: ["00000000-0000-4000-8000-000000000010", "00000000-0000-4000-8000-000000000011"],
};
```

`createScenarioGameRuntime` levert injecteerbare clock, seeded random, UUID-reeks, speech, media en storage. De omgevingssnapshot bevat offline- en service-worker-updatestatus. Productiecode importeert deze fake niet; tests kiezen hem expliciet via de publieke runtime-testadapter.

## Regressieregel

Iedere high-impact fout krijgt:

1. een minimale declaratieve fixture;
2. een assertie op zichtbaar herstelgedrag of runtime-resultaat;
3. een privacy-assertie wanneer diagnostiek wordt geschreven;
4. minimaal twee identieke runs in dezelfde test om determinisme te bewijzen.
