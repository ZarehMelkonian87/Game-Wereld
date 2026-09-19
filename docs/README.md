# 📚 Game Wereld — Documentatie-overzicht

Welkom in het centrale documentatie-overzicht van het **+1 Woordenschat Platform (Game Wereld)**.

Dit overzicht beschrijft de mappenstructuur, de rol van elk document en de status (actief versus historisch archief).

---

## 🧭 Mappenstructuur & Inhoud

### 1. Game Design & Specificaties (`docs/` en `docs/gdd/`)

_De officiële, levende spelontwerpen en pedagogische fundamenten._

- **[GDD-index — Magisch Strand-Avontuur](gdd/GDD-index.md):** De centrale bron van waarheid op hoofdlijn voor de eerste game (Magisch Strand-Avontuur). Bevat de screen map, pedagogiek, game loop, curriculum en de levende takenlijst (§12) tot en met versie 1.50.
- **[Feature-catalogus](gdd/Feature-catalogus.md):** Granulaire inventarisatie van alle concrete features (`FEAT_*`) met acceptatiecriteria en verificatiestatus.
- **[User Journey Map](gdd/User-Journey-Map.md):** De 9 kritieke spelersreizen (`JRN_*`) van onboarding tot beloningsviering.
- **[Test-matrix](gdd/Test-matrix.md):** Verificatiematrix die journeys en features koppelt aan geautomatiseerde testcases (`TC_*`).
- **[UX-Mobiele-Telefoon-T42](gdd/UX-Mobiele-Telefoon-T42.md):** Het actuele implementatiecontract voor de mobiele telefoonervaring (100% portret, screen guard, download-gate per gamekaart, `ConfirmDeleteModal`, 4G/5G waarschuwing).
- **[Concept-Zeg-en-Bouw](gdd/Concept-Zeg-en-Bouw.md):** Spelconcept voor de 4e modus (Zeg & Bouw, compound-zinnen, thema's, vrije bouw).
- **[Analyse-T33-Performance](gdd/Analyse-T33-Performance.md):** Onderzoek en benchmarks naar WebP/480p media-optimalisatie en spraakvertraging.
- **[UX Design Specification Magisch Strand](UX_Design_Specification_Magisch_Strand_Avontuur.md):** Gedetailleerde UX/UI schermspecificatie (9 schermen).
- **[GDD Groot Circus-Avontuur](GDD_Groot_Circus_Avontuur.md):** Game Design Document en implementatieplan voor de tweede educatieve game (circusthema).
- **[Werkplan & Voorstellen](gdd/Werkplan-en-Voorstellen.md):** _[Gearchiveerd]_ Oorspronkelijk besluitvormingsverslag van september 2026; alle taken (`T-19` t/m `T-33`) zijn afgerond en opgenomen in de GDD-index.

---

### 2. Architectuur & Besluiten (`docs/architecture/` en `docs/architecture-proposal/`)

_De technische fundamenten, architectuurbesluiten en kwaliteitsstandaarden._

- **[Code Quality & Architecture Requirements](code-quality-and-architecture.md):** De normatieve kwaliteitsstandaard voor de gehele repository (TypeScript, modulegrenzen, a11y, testvereisten).
- **[Architecture Decision Records (ADR's)](architecture/README.md):**
  - `ADR-001`: IndexedDB, Dexie en migratiebeleid
  - `ADR-002`: Practice-events projector en retentie
  - `ADR-003`: Workbox, offlinepakketten, performancebudgetten en multiplatform download-gating
  - `ADR-004`: Externe foutmonitoring (uitgesteld)
  - `ADR-005`: Tweede game contractevaluatie
- **[Architectuurvoorstel](architecture-proposal/README.md):** Het oorspronkelijke migratievoorstel (hoofdstuk 1 t/m 11) van juli 2026.
- **[Sprintrapporten juli 2026](architecture/README.md#historische-migratierapporten-juli-2026):** Statische opleverings- en verificatierapporten van de initiële transitie.

---

### 3. Toegankelijkheid (A11y) (`docs/accessibility/`)

_Inclusiviteit en WCAG 2.2 standaarden._

- **[Gedeeld Interactiecontract](accessibility/gedeeld-interactiecontract.md):** Normatieve regels voor touch-targets (≥ 48×48 px), focus-ringen, kleurcontrast, `prefers-reduced-motion` en multimodale gelijkwaardigheid.
- **[Release-checklist A11y](accessibility/release-checklist.md):** Controlelijst vóór productie-releases.

---

### 4. Diagnostiek & Runbooks (`docs/diagnostics/` en `docs/runbooks/`)

_Onderhoudbaarheid, debugging en beheer._

- **[Diagnose & Foutscenario's](diagnostics/diagnose-export-en-failure-scenarios.md):** Handleiding voor export van IndexedDB, storage en audio/spraak-diagnostiek.
- **[Incidents Runbook](runbooks/incidents.md):** Handelingsprotocol bij productie-incidenten.
- **[Release Runbook](runbooks/release.md):** Stappenplan voor veilige PWA-releases.

---

### 5. UX & Redesign (`docs/ux/`)

- **[Interface Redesign Takenlijst](ux/interface-redesign-takenlijst.md):** _[Gearchiveerd / Voltooid]_ Uitvoeringsverslag van het interface-herontwerp (UX-101 t/m UX-402) uit juli 2026.
