# 🏛️ Architectuur & Besluiten (ADR's)

Deze map bevat de formele Architecture Decision Records (ADR's) van Game Wereld, evenals de historische opleveringsrapporten van de architectuurmigratie uit juli 2026.

---

## 📜 Actieve Architecture Decision Records (ADR's)

De ADR's leggen getoetste, blijvende technische beslissingen vast:

| ADR | Titel | Status | Datum |
| :--- | :--- | :--: | :--- |
| **[ADR-001](adr-001-indexeddb-dexie-en-migratiebeleid.md)** | IndexedDB, Dexie en migratiebeleid | Geaccepteerd | Juli 2026 |
| **[ADR-002](adr-002-practice-events-projector-en-retentie.md)** | Practice-events projector en retentie | Geaccepteerd | Juli 2026 |
| **[ADR-003](adr-003-workbox-offlinepakketten-en-performancebudgetten.md)** | Workbox, offlinepakketten, performancebudgetten & download-gating | Geaccepteerd (incl. addendum sept 2026) | Juli 2026 / Sept 2026 |
| **[ADR-004](adr-004-externe-foutmonitoring-uitgesteld.md)** | Externe foutmonitoring (uitgesteld t.b.v. privacy/COPPA) | Geaccepteerd | Juli 2026 |
| **[ADR-005](adr-005-tweede-game-contractevaluatie.md)** | Tweede game contractevaluatie (modulaire isolatie) | Geaccepteerd | Juli 2026 |

---

## 📦 Historische Migratierapporten (Juli 2026)

Deze statische rapporten documenteren de resultaten van de initiële transitie en kwaliteitsstraat:

- **[Baseline Rapport](baseline-2026-07.md):** Meting van de uitgangssituatie vóór kwaliteitsstraat.
- **[Quality Gate Rapport](quality-gate-report-2026-07.md):** Verificatie van tests, types en linters.
- **[Storage Key Inventory](storage-key-inventory-2026-07.md):** Volledige inventarisatie van opslagsleutels.
- **[Temporary Exceptions](temporary-exceptions.md):** Tijdelijke uitzonderingen tijdens de migratiefase.
- **Groepsrapporten:**
  - [Groep B — Typeveiligheid & Linting](group-b-report-2026-07.md)
  - [Groep C — Opslag & State](group-c-report-2026-07.md)
  - [Groep D — Gamemodulecontract & Host](group-d-report-2026-07.md)
  - [Groep E — PWA, Workbox & Assets](group-e-report-2026-07.md)
  - [Groep F — Toegankelijkheid (A11y)](group-f-report-2026-07.md)
  - [Groep G — Observability & Diagnostiek](group-g-report-2026-07.md)
  - [Groep H — Acceptatietesten & Tweede Game](group-h-acceptatie-2026-07.md)
