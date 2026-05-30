# Fase 9: Actieve Taal En Zinnen

Status: uitgevoerd.

## Doel

Na een correcte plaatsopdracht kan een ouder of logopedist nu kort registreren of het kind het woord actief benoemt en of het kind de korte zin kan nazeggen. Dit blijft een oefenobservatie en geen diagnose.

## Uitgevoerd

- Na correct antwoord verschijnt de vraag `Wat zie je?`.
- Ouder/logopedist kan actieve woordenschat beoordelen met `Goed`, `Bijna`, `Hulp`.
- Actief benoemde woorden worden bijgehouden.
- De bestaande herhaalzin wordt als `Bezemspreuk` getoond.
- Ouder/logopedist kan zinsnazeggen beoordelen met `Goed`, `Deels`, `Hulp`.
- Korte zin goed, gedeeltelijk herhaald en met hulp worden apart geregistreerd.
- De laag verschijnt alleen na een afgeronde opdracht, zodat het kinderspel rustig blijft.

## Smoke Test

Getest op `390x844`:

- Correcte boot-opdracht opent het ouder/logopedist-paneel.
- `Goed` bij actieve woordenschat registreert `boot`.
- `Deels` bij zinsnazeggen verhoogt `data-sentence-repeat-partial` naar `1`.

## Bewuste Grenzen

De registraties staan nu nog in component-state. Persistente profielopslag komt in Fase 14.
