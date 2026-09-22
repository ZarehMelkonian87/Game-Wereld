# ♿ Toegankelijkheidscheck vóór een release

> Af te vinken bij elke release. Regels: [interactiecontract](interactiecontract.md).

## Automatisch

- [ ] `npm run check` groen (format, lint, types, unit, scripttests, architectuur, documentlinks)
- [ ] `npm run test:e2e:a11y` groen
- [ ] Chromium: welkom, profiel, catalogus, GameHost, instellingen, voortgang en microfoon-diagnose zonder axe-overtredingen
- [ ] De kernopdracht met geweigerde microfoon lukt via het toetsenbord
- [ ] Geen nieuwe axe-excludes toegevoegd

## Handmatig — bediening

- [ ] Toetsenbord: alle acties bereikbaar, logische focusvolgorde, zichtbare ring, geen focusval
- [ ] Touch: doelen ≥ 48×48 px en voldoende uit elkaar
- [ ] Zonder precies slepen: selecteer-en-tik en pijltoetsen/Enter voltooien de opdracht
- [ ] Zonder microfoon: weigeren en dezelfde opdracht via typen afmaken
- [ ] Zonder audio: alle instructies en feedback staan als tekst

## Handmatig — waarneming

- [ ] VoiceOver (iOS/Safari): namen, rollen, status begrijpelijk
- [ ] TalkBack (Android/Chrome): swipevolgorde en dubbeltik-acties bruikbaar
- [ ] Contrast van tekst, focusring, uitgeschakelde status en feedback
- [ ] 200% zoom: geen verlies van kernfunctionaliteit
- [ ] Rustige beweging: geen doorlopende decoratieve beweging, status blijft duidelijk, game blijft vloeiend
- [ ] Telefoon in landschap: de portret-guard verschijnt en de gameplay pauzeert
- [ ] Tablet in beide standen: geen clipping of onbereikbare bediening

## Handmatig — met een kind (of als kind)

- [ ] Een volledige ronde per modus zonder vastlopen of doodlopende staat
- [ ] Spraak werkt op een echt toestel (Android en iOS); bij twijfel het rapport uit de microfoon-diagnose bewaren
- [ ] Geluiden zijn hoorbaar en niet schrikachtig
- [ ] Teksten zijn leesbaar voor een beginnende lezer

## Vastleggen

Noteer per release: datum, geteste toestellen en browsers, wat is afgevinkt, en welke bevindingen naar de backlog gaan.
