# Gebruikershandleiding development-diagnostiek

## Wat is development-diagnostiek?

Development-diagnostiek is een tijdelijk hulpmiddel voor ontwikkelaars, testers en begeleiders die een technisch probleem onderzoeken. Het toont onder andere de appversie, actieve route, databaseversie, beschikbare browsermogelijkheden, service-workerstatus, offlinepakketten en maximaal 100 veilige technische events.

Het hulpmiddel staat standaard uit en is uitsluitend beschikbaar in een developmentbuild. Gewone spelers hebben het niet nodig en zien daarom geen diagnoseknop.

## Waarom is dit handig?

Met diagnostiek kan een technisch probleem gerichter worden onderzocht zonder te gokken of direct lokale gegevens te verwijderen. Het helpt bijvoorbeeld bij:

- een game die niet laadt of onverwacht stopt;
- problemen met offline spelen of een service-workerupdate;
- een mislukte opslagmigratie of onvoldoende opslagruimte;
- ontbrekende media of geweigerde microfoontoestemming;
- het verzamelen van een veilige diagnose-export voor een ontwikkelaar.

Diagnostiek is geen score-, leerling- of beoordelingssysteem.

## Diagnostiek inschakelen

Voeg eenmalig `?diagnostics=on` toe aan de huidige lokale URL. Voorbeelden:

```text
http://localhost:3001/?diagnostics=on
http://localhost:3001/games/vocabulary?diagnostics=on
```

Na het openen wordt de parameter uit de adresbalk verwijderd. Rechtsonder verschijnt de knop **Diagnostiek**. De instelling geldt alleen voor het huidige browsertabblad en verdwijnt wanneer die browsersessie wordt gesloten.

## Diagnostiek uitschakelen

1. Open de knop **Diagnostiek**.
2. Kies **Diagnostiek uitschakelen**.

De knop en het paneel verdwijnen direct. Als alternatief kan `?diagnostics=off` aan de huidige URL worden toegevoegd.

## Privacy en veilig gebruik

De diagnose-export bevat alleen technische toestand en gevalideerde events. Naam, profiel-id, gesproken transcript, ruwe antwoorden en audio worden niet opgenomen.

- Deel een export alleen via het afgesproken support- of ontwikkelkanaal.
- Verwijder een export nadat het probleem is onderzocht.
- Gebruik destructieve herstelacties, zoals database- of profielverwijdering, alleen na expliciete bevestiging en een controle van het exacte doel.
- Schakel diagnostiek na gebruik weer uit.

## Wanneer diagnostiek niet gebruiken?

Laat diagnostiek uit wanneer de app normaal werkt. Schakel het alleen tijdelijk in als een ontwikkelaar, tester of begeleider technische informatie nodig heeft. Voor inhoudelijke voortgang of leerresultaten gebruikt u het gewone voortgangsscherm.
