# 🏖️ Modus — Zeg & Zet

> Relationele modus: luisteren, begrijpen, plaatsen. Hoort bij de [GDD](GDD-index.md).

| Veld             | Waarde                                                                                                                                                                                                          |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Modus-ID**     | `MODE_ZEG_ZET` (`listen-and-place`)                                                                                                                                                                             |
| **Scherm**       | `SCR_MSA_SCENE_BUILDER` · [`SceneBuilderScreen.tsx`](../../src/app/games/magisch-strand-avontuur/screens/SceneBuilderScreen.tsx)                                                                                |
| **Logica**       | [`screens/scene-builder/`](../../src/app/games/magisch-strand-avontuur/screens/scene-builder/) + [`logic/spoken-command-parser.ts`](../../src/app/games/magisch-strand-avontuur/logic/spoken-command-parser.ts) |
| **Ontgrendeld**  | Vanaf 3 ⭐                                                                                                                                                                                                      |
| **Talige focus** | Relationeel: zinsbegrip + ruimtelijke taal                                                                                                                                                                      |
| **Taaldomeinen** | `sentence-comprehension`, `concepts-and-directions`, `spatial-language`, `following-directions`                                                                                                                 |
| **Status**       | 🟢 Gebouwd, getest (e2e `magisch-strand-avontuur.spec.ts` 3.1–3.7 + unit)                                                                                                                                       |

---

## 1. Waarom deze modus

Het kind hoort een hele zin ("Zet de boot in de zee") en moet die begrijpen én uitvoeren. Daarmee traint de modus zinsbegrip en abstracte ruimtelijke begrippen, die met oplichtende zones concreet worden gemaakt.

> De zestien opdrachten staan letterlijk in de [woordenlijst](Woordenlijst.md).

## 2. De ronde

Een ronde bestaat uit **16 opdrachten** (`lp-001` … `lp-016`) in geschudde volgorde, waarbij objecten die later als anker dienen eerder worden geplaatst. De niveaus lopen op:

| Niveau | Soort plaatsing      | Voorbeeld                                         |
| :----: | :------------------- | :------------------------------------------------ |
|   1    | Statisch in één zone | "Zet de boot in de zee."                          |
|   2    | Lateraal/relatief    | "Zet de parasol rechts op het strand."            |
|   3    | Complex relationeel  | "Leg de schelp tussen de bal en het zandkasteel." |

## 3. Vier manieren om te plaatsen

| Weg         | Hoe                                                                        |
| :---------- | :------------------------------------------------------------------------- |
| **Tikken**  | Object kiezen in de objectbalk → op de plek in de scène tikken             |
| **Slepen**  | Object van de balk naar de doelzone slepen                                 |
| **Spreken** | Microfoon → commando inspreken → de parser bepaalt object, relatie en zone |
| **Typen**   | Typ-paneel met overtyp-hulp (zie §6)                                       |

Elke weg levert dezelfde plaatsing en dezelfde observatie op.

## 4. Automatische bevestiging

Er is **geen "Klaar"-knop** meer. Zodra een object geplaatst is — via welke weg dan ook — wordt de plaatsing meteen gecontroleerd en, als die klopt, bevestigd; de volgende opdracht verschijnt vanzelf. Dat scheelt een tik en houdt het tempo bij jonge kinderen erin.

| Uitkomst     | Wat er gebeurt                                                                                                    |
| :----------- | :---------------------------------------------------------------------------------------------------------------- |
| **Goed**     | `scene-builder-feedback` met `data-kind="correct"`, zwevende succes-toast, sterren + tempo, door naar de volgende |
| **Bijna**    | `data-kind="almost"`: vriendelijke tip, doelzone licht op, object kan opnieuw worden opgepakt. Geen straf         |
| **Onbekend** | Bij een onduidelijk commando volgt een verduidelijkingsvraag of het voorstel om te typen                          |

## 5. Gesproken commando's

`parseSpokenPlacementCommand` ontleedt de zin in **object**, **ruimtelijk begrip** en **zone of anker**, en bepaalt een betrouwbaarheid:

| Confidence     | Betekenis                                  | Gevolg                           |
| :------------- | :----------------------------------------- | :------------------------------- |
| `high`         | object + relatie + (zone óf anker) herkend | Commando wordt uitgevoerd        |
| `needs-choice` | object + één van beide herkend             | Verduidelijkingsvraag met keuzes |
| `needs-help`   | te weinig herkend                          | Hulp tonen / typen voorstellen   |

**Robuustheid:** transcripties worden genormaliseerd (kleine letters, accenten en leestekens weg). Er zijn kindertaal- en synoniemaliassen voor objecten ("bootje", "zeilboot", "schip" → boot; "krabben" → krab; "kite" → vlieger), voor zones ("water", "in het water" → zee) en voor begrippen ("beneden", "laag" → onder). Bij meerdere kandidaten wint het meest specifieke alias, met een vaste prioriteit voor ruimtelijke begrippen (`tussen` > `naast` > `onder` > …).

**Tijdens het luisteren** toont de `SpeechWaveAnimation` een golf met de live transcriptie ("Ik hoor je: …"). Microfoon en typ-paneel zijn nooit tegelijk actief: typen openen zet de mic uit en wist de transcriptie; de mic starten sluit het typ-paneel.

## 6. Typen met overtyp-hulp

Het typ-paneel toont de doelzin als **spookletters** die letter voor letter worden ingevuld:

- goed getypte letter → groen;
- verkeerde letter → zacht rood, de getypte letter blijft staan;
- volgende letter → blauw cursorblokje;
- hoofdletters en accenten tellen niet mee; een eigen, langere zin mag ook.

Enter bevestigt. Er is geen "Bijvoorbeeld:"-regel meer — de zin zelf staat in het veld.

## 7. Zones en ankers

Negen vaste zones plus dynamische, relationele zones die uit de actuele positie van geplaatste ankerobjecten worden berekend. Verwijst een opdracht naar een anker dat nog niet geplaatst is, dan meldt de logica dat netjes: geen crash, en het telt niet als goed.

**Hint:** de doelzone pulseert met een gloeiende rand (`target-zone-hint-boundary`, `target-zone-hint-magic-rings`). **Videomodel:** de instructievideo toont de handeling; speelt hij niet af, dan volgt een nette tekstfallback in plaats van een foutmelding.

## 8. Ronde-eindscherm

`SceneBuilderRoundSummary` viert de afgemaakte plaat en toont: geoefende woorden, geoefende plaatswoorden, sterren en tempo, en de eerstvolgende beloning. Knoppen: **Opnieuw** en **Terug naar wereldkeuze**.

## 9. Testhaken

`scene-builder-screen`, `scene-builder-instruction-area`, `scene-builder-instruction-text`, `scene-builder-scene-area`, `scene-tap-target`, `scene-builder-tray-area`, `scene-builder-feedback`, `scene-builder-confirm-button`, `scene-builder-round-summary`, `scene-builder-next-reward`, `target-zone-hint-boundary`, `voice-command-button`, `speech-stop-button`, `speech-retry-panel`, `typed-command-open-button`, `typed-command-input`, `typed-command-submit-button`, `microphone-permission-message`.
