# Gameplatformcontracten

Deze map is de stabiele grens tussen `GameHost`, games en runtime-adapters. Games mogen uitsluitend typen en functies uit deze publieke contractlaag gebruiken.

## Stabiel contract

- `GameManifest`, `GameRegistryEntry` en `GameModule`;
- gebrande ids en hun grensparsers;
- `GameRuntime` met `identity`, `clock`, `ids`, `practice`, `media`, `speech`, `diagnostics`, `lifecycle`, `profile` en `storage`;
- benoemde `Result`- en `RuntimeFailure`-typen.

Wijzigingen aan deze onderdelen zijn contractwijzigingen. Ze vereisen typecheck, runtime-validatie, de generieke gamecontracttest en een beoordeling van achterwaartse compatibiliteit.

## Interne implementatie

Concrete browser- en testadapters in `../runtime`, de tijdelijke sessierepository en host-UI zijn intern. Een game mag deze implementaties niet importeren. Leveranciers-SDK's, routerobjecten, app-contexten en databaseobjecten worden nooit onderdeel van `GameRuntime`.
