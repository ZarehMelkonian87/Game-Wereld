# Accessibility-releasecheck

Eigenaar uitvoering: release-reviewer  
Eigenaar herstel: frontendteam  
Frequentie: iedere release

## Automatisch

- [ ] `npm run check`
- [ ] `npm run test:e2e:a11y`
- [ ] Chromium: welkom, profiel, catalogus, GameHost, instellingen en voortgang hebben geen axe WCAG 2.2 A/AA-overtredingen.
- [ ] WebKit: dezelfde schermen en de toetsenbord-/microfoonfallback zijn groen.
- [ ] Geen generieke axe-excludes; iedere toekomstige uitzondering noemt regel, exact element, reden, eigenaar, issue en einddatum.

## Handmatig

- [ ] Toetsenbord: alle acties bereikbaar, logische focusvolgorde, zichtbare focus, geen focusval.
- [ ] VoiceOver op iPadOS/Safari: namen, rollen, hints, status en formulierfouten begrijpelijk.
- [ ] TalkBack op Android/Chrome: swipevolgorde, dubbel-tikacties en touchdoelen bruikbaar.
- [ ] macOS VoiceOver met Safari: app-shell, instellingen, voortgang en GameHost doorlopen.
- [ ] Contrast: tekst, focusring, disabledstatus en feedback bij licht/donker beeld controleren.
- [ ] 200% zoom: geen horizontaal verlies van kernfunctionaliteit; tekst en controls blijven bruikbaar.
- [ ] Reduced motion: geen decoratieve continue beweging; status blijft begrijpelijk.
- [ ] Portrait en landscape: geen clipping of onbereikbare bediening.
- [ ] Touch: doelen minimaal 48×48 px en voldoende gescheiden.
- [ ] Zonder microfoon: weigeren en daarna dezelfde opdracht via typen voltooien.
- [ ] Zonder precieze drag: selecteer-en-plaats en pijltoetsen/Enter voltooien.
- [ ] Zonder audio: alle instructies en feedback als tekst beschikbaar.

## Resultaat vastleggen

Leg datum, build/commit, uitvoerder, browsers/devices, bevindingen en herstelissues vast in `docs/architecture/group-f-report-2026-07.md` of de release-notes. CI bewaart het Playwright QA-artifact veertien dagen, ook bij een groene run.

Een release is geblokkeerd bij een kritieke automatische overtreding, onbereikbare kernactie, ontbrekende naam/rol, toetsenbordval, ontbrekend niet-spraak-/niet-dragalternatief of verlies van kernfunctionaliteit bij 200% zoom.
