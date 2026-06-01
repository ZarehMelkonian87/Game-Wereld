# Frontend Component Standard

Deze afspraken gebruiken we bij elk nieuw scherm of grotere UI-aanpassing in `+1 Woordenschat Bezem Escape`.

## Vaste Regels

- Gebruik alleen arrow functions voor React-components, handlers en helpers.
- Houd components klein: een component heeft een duidelijke eigen taak.
- Geef elk component een duidelijke naam en zet `Component.displayName`.
- Geef de root DOM-node van elk schermspecifiek component `data-component="<ComponentName>"`.
- Gebruik `data-slot` voor belangrijke visuele onderdelen binnen een component, zoals `title`, `content`, `world-grid` of `status`.
- Gebruik domein-attributen zoals `data-world-id`, `data-status` of `data-selected` wanneer dat debuggen makkelijker maakt.
- Zet grote schermen in een eigen map onder `screens/<screen-name>/`.
- Houd het publieke exportpad stabiel als andere files dat al gebruiken.
- Zet visuele subonderdelen apart, bijvoorbeeld header, kaart, badge, knop, melding en layout.
- Zet herbruikbare UI in `components/ui` of `components/layout`.
- Zet schermspecifieke onderdelen alleen in de schermmap.
- Vermijd grote JSX-blokken in `index.tsx`; daar hoort vooral schermrouting en state.
- Gebruik bestaande UI-bouwstenen voordat er nieuwe styling wordt gemaakt.
- Test portrait en landscape bij mobiele schermen.

## Checklist Voor Elke UI-Fase

- [ ] Is het scherm opgesplitst in logische kleine componenten?
- [ ] Zijn alle functions arrow functions?
- [ ] Heeft elk component een duidelijke `displayName`?
- [ ] Heeft de root DOM-node een leesbare `data-component`?
- [ ] Zijn belangrijke children herkenbaar met `data-slot` of domein-attributen?
- [ ] Staat schermspecifieke code in een eigen map?
- [ ] Zijn imports en exports kort en duidelijk?
- [ ] Werkt de layout zonder overflow in portrait?
- [ ] Werkt de layout zonder overlap in landscape?
- [ ] Draait `npx tsc --noEmit` zonder fouten?
- [ ] Draait `npm run build` zonder fouten?
