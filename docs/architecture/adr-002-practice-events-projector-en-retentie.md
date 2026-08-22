# ADR-002 — PracticeEventV1, voortgangsprojector en retentie

Status: geaccepteerd  
Datum: 23 juli 2026  
Inhoudelijk eigenaar: opdrachtgever/repository-eigenaar

## Context

Games gebruikten deels gamespecifieke resultaten en het dashboard bevatte afgeleide demo-informatie. Daardoor kon een game zelf impliciet bepalen wat “beheerst” betekende en waren zichtbare cijfers niet volledig naar oefenfeiten te herleiden.

De opdrachtgever heeft het architectuurvoorstel inclusief de neutrale event-/projectorbenadering geaccepteerd en Groep D expliciet voor uitvoering vrijgegeven. De onderstaande drempels zijn een productinterpretatie voor dit lokale oefenoverzicht, geen klinische of diagnostische uitspraak. Een wijziging van terminologie of drempels vereist opnieuw expliciete inhoudelijke goedkeuring en nieuwe fixtures.

## Begrippen

- **Task:** één stabiel geïdentificeerde opdracht uit een specifieke contentversie.
- **Skill:** een stabiele, game-onafhankelijke oefencategorie, bijvoorbeeld `receptive-vocabulary`, `active-vocabulary` of `spatial:boven`.
- **Attempt:** één observeerbare beantwoording of plaatsing binnen een task en sessie. `attemptNumber` is de oplopende ordinal voor die task.
- **Instruction replay:** de opdracht is na de eerste presentatie opnieuw afgespeeld.
- **Visual hint:** de game heeft een extra visuele aanwijzing getoond die het antwoord ondersteunt.
- **Spoken help:** een begeleider- of gamehulp heeft aanvullende gesproken ondersteuning gegeven. Herkenning van de eigen stem van het kind is geen `spoken-help`.
- **Outcome:** uitsluitend het observeerbare resultaat `correct`, `incorrect` of `skipped`.

## Besluit: PracticeEventV1

Iedere modus rapporteert hetzelfde schema:

```ts
type PracticeEventV1 = {
  schemaVersion: 1;
  id: EventId;
  occurredAt: string;
  profileId: ProfileId;
  sessionId: SessionId;
  gameId: GameId;
  contentVersion: string;
  taskId: TaskId;
  skillIds: string[];
  outcome: "correct" | "incorrect" | "skipped";
  attemptNumber: number;
  responseTimeMs?: number;
  assistance: Array<"instruction-replay" | "visual-hint" | "spoken-help">;
};
```

De runtime injecteert event-id, tijd, profiel-, sessie-, game- en contentidentiteit. De game levert alleen de oefenobservatie. Een event bevat nooit:

- naam of avatar;
- ruwe audio of een spraaktranscript;
- een gameberekend label zoals `mastered`, `supported` of `diagnose`;
- willekeurige gamespecifieke objecten.

## Besluit: projector versie 1

De projector is pure TypeScript en is de enige plek waar dashboardinterpretatie ontstaat:

- `independentCorrect`: correct zonder geregistreerde hulp;
- `supportedCorrect`: correct met minimaal één hulptype;
- `practicing`: er is minimaal één event, maar de confidentdrempel is niet gehaald;
- `confident`: minimaal drie zelfstandige correcte pogingen én minimaal 60% van alle geselecteerde pogingen zelfstandig correct;
- score: 100 per zelfstandig correct en 60 per ondersteund correct;
- sterren: één per zelfstandig correcte poging.

“Confident” betekent uitsluitend dat deze eventselectie aan deze rekenregel voldoet. De UI noemt de eventtelling en projectorversie en suggereert geen eigenschap of diagnose van het kind.

| Representatieve reeks                                   | Verwachte status |
| ------------------------------------------------------- | ---------------- |
| Geen events                                             | `not-started`    |
| Eén correct zonder hulp                                 | `practicing`     |
| Drie correct zonder hulp en één incorrect               | `confident`      |
| Drie correct zonder hulp, twee incorrect en één skipped | `practicing`     |
| Alleen correct met hints/herhalingen                    | `practicing`     |

De projectie bewaart `projectorVersion`, `calculatedAt`, eventtelling, eerste/laatste geselecteerde eventtijd en skilltotalen. Een volledige rebuild dedupliceert op event-id en sorteert deterministisch. Een nieuwe projectorversie muteert nooit bestaande events.

## Sessies

Een sessie bevat game-, profiel- en contentversie, `startedAt`, optioneel `endedAt` en exact één eindstatus: `completed`, `abandoned` of `crashed`. Een bij appstart achtergebleven `started`-record wordt als `abandoned` afgesloten; dit is technisch herstel en geen leerfeit.

## Retentie en export

Ruwe events blijven lokaal bewaard tot profielverwijdering. Na 24 maanden worden ze alleen gemarkeerd voor een handmatige compactiereview; deze versie verwijdert niets automatisch. Compactie mag pas na:

1. een geverifieerde projectierebuild;
2. een privacyveilige voortgangsexport;
3. expliciete product-/inhoudelijke goedkeuring;
4. tests die aantonen welke uitlegbaarheid verloren gaat.

De inhoudelijke voortgangsexport bevat geen naam, avatar, lokaal profiel-id, audio of transcript. De technische diagnose-export blijft daarvan gescheiden.

## Gevolgen

- Alle drie huidige modi gebruiken één runtimewriter.
- Dashboardcijfers zijn herleidbaar tot events en projectorversie.
- Projecties kunnen worden verwijderd en identiek herbouwd.
- Projectorwijzigingen vereisen fixtures en inhoudelijke herbeoordeling.
- Een tweede game kan hetzelfde contract gebruiken zonder een eigen masterylabel.
