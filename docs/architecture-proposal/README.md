# Architectuurvoorstel Game Wereld

Status: **gedeeltelijk geïmplementeerd**

Laatste herziening: **23 juli 2026**

Scope: de huidige React/Vite-PWA en de groei naar meerdere educatieve spellen

De implementatiegroepen A tot en met G en de tweede-gameproef uit H zijn uitgevoerd. De formele eindstatus blijft gedeeltelijk totdat minimaal één werkelijk stabiele release de legacy-rollbackperiode heeft doorlopen en de fysieke iPad-/screenreaderreleaseproef is geregistreerd. Zie [Groep H — acceptatie](../architecture/group-h-acceptatie-2026-07.md).

Dit voorstel vervangt het eerdere Engelstalige voorstel in deze map. Het is gebaseerd op inspectie van de huidige broncode, configuratie, build-output en documentatie. Het doel is geen theoretisch “enterprise”-model, maar een architectuur die de eerstvolgende problemen oplost en gecontroleerd kan meegroeien.

## Kernbesluit

Game Wereld wordt een **modulaire monoliet in één frontend-repository**:

- één app-shell en één deployment;
- zelfstandige feature- en gamemodules met afgedwongen importgrenzen;
- een kleine, compile-time gameregistry met lazy loading;
- browser- en leveranciers-API's achter expliciete adapters;
- lokale, versieerbare opslag met een append-only oefenlog en afgeleide voortgang;
- geen backend, microfrontends, runtime-pluginloader of generieke game-engine zolang daar geen concrete behoefte voor bestaat.

De eerste investering gaat naar een betrouwbare kwaliteitsstraat. Op dit moment slaagt `vite build`, terwijl `tsc --noEmit` niet slaagt. Nieuwe architectuurlagen bouwen op een niet-typeveilige basis zou het risico vergroten.

## Leeswijzer

1. [Samenvatting en besluit](01-samenvatting-en-besluit.md)
2. [Kritische audit van de huidige app](02-kritische-audit-huidige-app.md)
3. [Architectuurprincipes en afwegingen](03-architectuurprincipes-en-afwegingen.md)
4. [Doelarchitectuur en modulegrenzen](04-doelarchitectuur-en-modulegrenzen.md)
5. [Gamemodulecontract en lifecycle](05-gamemodulecontract-en-lifecycle.md)
6. [Data, state, opslag, analytics en privacy](06-data-state-opslag-analytics-en-privacy.md)
7. [PWA, assets, performance, betrouwbaarheid en toegankelijkheid](07-pwa-assets-performance-betrouwbaarheid-en-toegankelijkheid.md)
8. [Code Quality & Architecture Requirements](08-code-quality-and-architecture-requirements.md)
9. [Tooling, testen, debugging en observability](09-tooling-testen-debugging-en-observability.md)
10. [Migratieplan, beslismomenten en risico's](10-migratieplan-beslismomenten-en-risicos.md)
11. [Implementatietakenlijst](11-implementatie-takenlijst.md)

## Normatieve taal

- **MOET / MAG NIET**: harde eis; CI of review blokkeert een overtreding.
- **HOORT**: standaardkeuze; afwijking vereist een korte motivatie.
- **KAN**: optie, geen verplichting.

## Geldigheid en eigenaarschap

Dit voorstel beschrijft de gewenste richting, niet de actuele implementatie. Afgeronde migratiestappen worden als Architecture Decision Record (ADR) vastgelegd. Bij strijdigheid tussen dit voorstel en de code geldt de code als actuele waarheid en dit voorstel als doel; de afwijking moet zichtbaar op de roadmap staan.
