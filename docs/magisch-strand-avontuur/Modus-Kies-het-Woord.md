# 🃏 Modus — Kies het Woord

> Instapmodus van de leerlijn. Hoort bij de [GDD](GDD-index.md); hier staat de volledige mechanica.

| Veld             | Waarde                                                                                                                               |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Modus-ID**     | `MODE_KIES_WOORD` (`choose-word`)                                                                                                    |
| **Scherm**       | `SCR_MSA_WORD_CHOICE` · [`WordChoiceScreen.tsx`](../../src/app/games/magisch-strand-avontuur/screens/WordChoiceScreen.tsx)           |
| **Logica**       | [`screens/word-choice/useWordChoiceState.ts`](../../src/app/games/magisch-strand-avontuur/screens/word-choice/useWordChoiceState.ts) |
| **Ontgrendeld**  | Altijd (0 ⭐) — dit is de instap                                                                                                     |
| **Talige focus** | Receptief: woordherkenning tussen afleiders                                                                                          |
| **Taaldomein**   | `receptive-vocabulary`                                                                                                               |
| **Status**       | 🟢 Gebouwd, getest (e2e `word-choice.spec.ts` + `WordChoiceScreen.test.tsx`)                                                         |

---

## 1. Waarom deze modus

Het kind koppelt een gehoord/gelezen woord aan het juiste beeld. Dit is de laagste trede van de leertrap: herkennen gaat vooraf aan plaatsen en zelf benoemen. De modus levert sterren op waarmee de volgende modi opengaan.

## 2. De ronde

1. Een ronde bestaat uit **12 vragen** (`cw-001` … `cw-012`), in geschudde volgorde. De lengte volgt de content, niet een vast getal.
2. Het vraagpaneel toont de vraag ("Waar is de dolfijn?") met mascotte; de instructievideo kan worden afgespeeld.
3. Er staan **2 tot 4 keuzekaarten** met sticker en label. Het aantal en de moeilijkheid van de afleiders lopen op met het niveau:

   | Niveau | Kaarten | Afleider-strategie                         |
   | :----: | :-----: | :----------------------------------------- |
   |   1    |    2    | `different-category` (duidelijk anders)    |
   |   2    |    3    | `same-theme` (zelfde strandthema)          |
   |   3    |    4    | `same-category` (zelfde categorie, lastig) |

4. Het kind tikt een kaart aan.
5. De voortgangsbalk loopt mee ("Voortgang 3/12") en toont de verdiende sterren.

## 3. Feedback

| Uitkomst | Wat er gebeurt                                                                                                                                                                                                               |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Goed** | Kaart krijgt een groene rand en een vinkje. Succestekst met lidwoord ("Ja, dat is **het** zandkasteel. +1 Tempo!"), nazegzin, en zonder hint de bonus "Bonus zonder hint!". Er klinkt een kort goed-geluid.                  |
| **Fout** | Rode markering op de gekozen kaart, vriendelijke tip ("Bijna. Zoek nog eens naar: …"), zacht fout-geluid. Geen straf, geen puntenverlies; het kind mag direct opnieuw kiezen. Het woord wordt onthouden als "extra oefenen". |

**Hint** (als hints aanstaan): toont de hinttekst en laat de juiste kaart oplichten. De vraag telt dan als "met hulp" en levert geen bonus op.

## 4. Automatisch doorgaan

Na een goed antwoord schakelt de quiz **vanzelf** door:

| Situatie                        | Wachttijd |
| :------------------------------ | :-------: |
| Goed antwoord                   |   1,8 s   |
| Goed antwoord + nieuwe beloning |   2,6 s   |

Er is geen "Volgende"-knop meer: uit kindertests bleek de extra tik hinderlijk. Tijdens het wachten worden extra tikken en de hintknop genegeerd, zodat sterren niet dubbel tellen. Na een fout antwoord blijft de vraag staan.

De geluiden zijn CC0 (Kenney "Interface Sounds"), omgezet naar kleine mono-WAV's zodat ze ook op iOS klinken, en ze respecteren de audio-instelling.

## 5. Beloning

Per goed antwoord: `wordStars` + `speed` uit de opdracht (beide 1), met +1 op beide wanneer er geen hint is gebruikt. Een volle ronde levert daarmee ongeveer 24 ⭐ op wanneer het kind zonder hints speelt.

## 6. Ronde-eindscherm

Na de laatste vraag verschijnt `WordChoiceRoundSummary` met: verdiende sterren en tempo, welke woorden meteen goed gingen, welke met hint, welke nog extra oefening vragen, en de eerstvolgende beloning. Knoppen: **Opnieuw** (nieuwe geschudde ronde) en **Menu**.

## 7. Prestatie-aandachtspunt

Alle objectstickers worden bij het openen van de quiz voorgeladen. Zonder die preload flitsten de keuzekaarten leeg bij het doorschakelen. Samen met de WebP-stickers is dat opgelost.

## 8. Testhaken

`word-choice-screen` (met `data-auto-advancing`, `data-word-star-value`, `data-active-instruction-id`, `data-is-completed`), `word-choice-question-panel`, `word-choice-answer-area`, `word-choice-target-card`, `word-choice-status-area`, `word-choice-reward-unlock-message`, `word-choice-round-summary`, `word-choice-summary-replay-button`, `word-choice-summary-menu-button`.
