# Educational Content Matrix

## Purpose

This document defines the first educational content matrix for `+1 Woordenschat Bezem Escape`.

The activities are inspired by language skill areas that can also appear in CELF Preschool and PPVT/Peabody-like domains, but this game does not copy official test items, official scoring, norm tables or diagnostic methods.

All tasks are original, child-friendly and intended for practice and observation only.

## Trained Language Areas

| Area | In-game practice |
| --- | --- |
| Receptive vocabulary | Child hears a word and chooses the matching picture. |
| Active vocabulary | Child names an object, action or place with parent support. |
| Sentence comprehension | Child understands a spoken sentence and performs the action. |
| Sentence repetition | Child repeats short playful sentences. |
| Word structure | Child practices plurals, verbs, adjectives and simple grammar. |
| Concepts and following directions | Child follows one-step and multi-step instructions. |
| Word categories | Child groups objects by meaning. |
| Spatial language | Child practices in, on, under, above, next to, between, left, right and distance words. |

## Beach World Vocabulary Set

| Object id | Dutch word | Category | Notes |
| --- | --- | --- | --- |
| `dolfijn` | dolfijn | dieren | Sea animal. |
| `boot` | boot | voertuigen | Water vehicle. |
| `vuurtoren` | vuurtoren | plekken/objecten | Landmark. |
| `vliegtuig` | vliegtuig | voertuigen | Sky vehicle. |
| `vlieger` | vlieger | strandspullen | Object in sky, can be confused with vliegtuig. |
| `bal` | bal | strandspullen | Simple familiar word. |
| `parasol` | parasol | strandspullen | Anchor for under/next to. |
| `schelp` | schelp | strandspullen/natuur | Beach object. |
| `krab` | krab | dieren | Beach animal. |
| `zandkasteel` | zandkasteel | strandspullen | Compound word. |
| `handdoek` | handdoek | strandspullen | Placement surface. |
| `zon` | zon | natuur | Sky object. |

## Spatial Concept Set

- in;
- op;
- onder;
- boven;
- naast;
- tussen;
- links;
- rechts;
- midden;
- dichtbij;
- ver weg.

## Content Item Fields

Every task should later be stored with:

- id;
- domain;
- level;
- prompt;
- audio text;
- target object or answer;
- accepted answers;
- distractors if relevant;
- spatial concept if relevant;
- hint;
- feedback;
- observation tags.

## 1. Receptive Vocabulary Tasks

The child hears a word and selects the matching sticker from 2, 3 or 4 options.

| Id | Level | Prompt | Target | Options |
| --- | --- | --- | --- | --- |
| `rv-001` | 1 | Waar is de dolfijn? | dolfijn | dolfijn, boot |
| `rv-002` | 1 | Waar is de bal? | bal | bal, schelp |
| `rv-003` | 1 | Waar is de boot? | boot | boot, parasol |
| `rv-004` | 1 | Waar is de zon? | zon | zon, bal |
| `rv-005` | 2 | Waar is de krab? | krab | krab, dolfijn, schelp |
| `rv-006` | 2 | Waar is de parasol? | parasol | parasol, handdoek, bal |
| `rv-007` | 2 | Waar is de vlieger? | vlieger | vlieger, vliegtuig, zon |
| `rv-008` | 2 | Waar is de handdoek? | handdoek | handdoek, parasol, zandkasteel |
| `rv-009` | 2 | Waar is de schelp? | schelp | schelp, krab, bal |
| `rv-010` | 2 | Waar is het zandkasteel? | zandkasteel | zandkasteel, vuurtoren, parasol |
| `rv-011` | 3 | Waar is de vuurtoren? | vuurtoren | vuurtoren, zandkasteel, vliegtuig, boot |
| `rv-012` | 3 | Waar is het vliegtuig? | vliegtuig | vliegtuig, vlieger, boot, zon |
| `rv-013` | 3 | Welke is een dier in de zee? | dolfijn | dolfijn, boot, parasol, handdoek |
| `rv-014` | 3 | Welke vaart op het water? | boot | boot, vliegtuig, krab, zon |
| `rv-015` | 3 | Welke geeft schaduw? | parasol | parasol, schelp, boot, vlieger |
| `rv-016` | 3 | Welke hoort in de lucht? | vliegtuig | vliegtuig, krab, handdoek, schelp |
| `rv-017` | 3 | Welke vind je op het strand? | schelp | schelp, vliegtuig, zon, boot |
| `rv-018` | 3 | Welke is hoog en staat op een eiland? | vuurtoren | vuurtoren, bal, dolfijn, handdoek |
| `rv-019` | 3 | Welke maak je van zand? | zandkasteel | zandkasteel, vliegtuig, boot, zon |
| `rv-020` | 3 | Welke ligt op het strand om op te zitten? | handdoek | handdoek, vlieger, vuurtoren, dolfijn |

## 2. Scene Placement Tasks

The child places a sticker object in the correct location on the beach scene.

| Id | Level | Instruction | Target object | Spatial concept | Target location |
| --- | --- | --- | --- | --- | --- |
| `sp-001` | 1 | Zet de dolfijn in de zee. | dolfijn | in | zee |
| `sp-002` | 1 | Zet de boot op het water. | boot | op | water |
| `sp-003` | 1 | Zet de zon boven de zee. | zon | boven | lucht |
| `sp-004` | 1 | Leg de handdoek op het strand. | handdoek | op | strand |
| `sp-005` | 1 | Leg de schelp op het strand. | schelp | op | strand |
| `sp-006` | 2 | Zet de vuurtoren op het eiland. | vuurtoren | op | eiland |
| `sp-007` | 2 | Zet de vlieger boven het strand. | vlieger | boven | lucht boven strand |
| `sp-008` | 2 | Zet het vliegtuig boven de zee. | vliegtuig | boven | lucht boven zee |
| `sp-009` | 2 | Zet de krab op de handdoek. | krab | op | handdoek |
| `sp-010` | 2 | Zet het zandkasteel naast de schelp. | zandkasteel | naast | naast schelp |
| `sp-011` | 2 | Leg de bal naast de parasol. | bal | naast | naast parasol |
| `sp-012` | 2 | Zet de krab onder de parasol. | krab | onder | onder parasol |
| `sp-013` | 3 | Zet de boot links van de vuurtoren. | boot | links | links van vuurtoren |
| `sp-014` | 3 | Zet de dolfijn rechts van de boot. | dolfijn | rechts | rechts van boot |
| `sp-015` | 3 | Leg de schelp tussen de bal en de handdoek. | schelp | tussen | tussen bal en handdoek |
| `sp-016` | 3 | Zet het zandkasteel in het midden van het strand. | zandkasteel | midden | midden strand |
| `sp-017` | 3 | Leg de bal dichtbij de parasol. | bal | dichtbij | dichtbij parasol |
| `sp-018` | 3 | Zet de boot ver weg van de dolfijn. | boot | ver weg | ver van dolfijn |
| `sp-019` | 3 | Zet de vlieger links boven het strand. | vlieger | links/boven | links in lucht |
| `sp-020` | 3 | Zet het vliegtuig rechts boven de zee. | vliegtuig | rechts/boven | rechts in lucht |

## 3. Sentence Comprehension Tasks

The child hears a full sentence and performs or selects the matching action.

| Id | Level | Sentence | Expected response |
| --- | --- | --- | --- |
| `sc-001` | 1 | De dolfijn zwemt in de zee. | Select or place dolfijn in zee. |
| `sc-002` | 1 | De boot vaart op het water. | Select or place boot on water. |
| `sc-003` | 1 | De zon staat boven het strand. | Select or place zon in sky. |
| `sc-004` | 1 | De bal ligt op het strand. | Select or place bal on beach. |
| `sc-005` | 1 | De handdoek ligt op het zand. | Select or place handdoek on sand. |
| `sc-006` | 2 | De krab zit op de handdoek. | Place krab on towel. |
| `sc-007` | 2 | De vlieger vliegt boven de zee. | Place vlieger above sea. |
| `sc-008` | 2 | De vuurtoren staat op het eiland. | Place vuurtoren on island. |
| `sc-009` | 2 | De schelp ligt naast de bal. | Place schelp next to ball. |
| `sc-010` | 2 | De parasol staat naast het zandkasteel. | Place parasol next to sandcastle. |
| `sc-011` | 3 | De boot is links van de vuurtoren. | Place boat left of lighthouse. |
| `sc-012` | 3 | De dolfijn is rechts van de boot. | Place dolphin right of boat. |
| `sc-013` | 3 | De schelp ligt tussen de bal en de handdoek. | Place shell between ball and towel. |
| `sc-014` | 3 | Het vliegtuig vliegt hoog boven de zee. | Place airplane high above sea. |
| `sc-015` | 3 | De krab zit onder de parasol. | Place crab under umbrella. |
| `sc-016` | 3 | Het zandkasteel staat in het midden van het strand. | Place sandcastle in center of beach. |
| `sc-017` | 3 | De bal ligt dichtbij de parasol. | Place ball close to umbrella. |
| `sc-018` | 3 | De boot is ver weg van de dolfijn. | Place boat far from dolphin. |
| `sc-019` | 4 | Zet eerst de zon boven en daarna de boot op het water. | Complete two-step action. |
| `sc-020` | 4 | Leg eerst de handdoek op het strand en zet daarna de krab erop. | Complete two-step action. |

## 4. Active Vocabulary Prompts

The child is invited to name an object, action or place. Parent/therapist can mark the response later.

| Id | Level | Prompt | Target response |
| --- | --- | --- | --- |
| `av-001` | 1 | Wat is dit? | dolfijn |
| `av-002` | 1 | Wat is dit? | boot |
| `av-003` | 1 | Wat is dit? | bal |
| `av-004` | 1 | Wat is dit? | zon |
| `av-005` | 1 | Wat zie je op het strand? | handdoek |
| `av-006` | 2 | Wie zwemt in de zee? | dolfijn |
| `av-007` | 2 | Wat vaart op het water? | boot |
| `av-008` | 2 | Wat vliegt in de lucht? | vlieger or vliegtuig |
| `av-009` | 2 | Wat geeft schaduw? | parasol |
| `av-010` | 2 | Wat ligt op het strand? | schelp |
| `av-011` | 2 | Wat zit op de handdoek? | krab |
| `av-012` | 3 | Wat staat op het eiland? | vuurtoren |
| `av-013` | 3 | Wat maak je van zand? | zandkasteel |
| `av-014` | 3 | Noem een dier uit de zee. | dolfijn |
| `av-015` | 3 | Noem iets dat je op het strand gebruikt. | parasol, handdoek, bal, schelp |

## 5. Sentence Repetition Prompts

The child repeats a short sentence. This is playful practice, not formal scoring.

| Id | Level | Sentence to repeat |
| --- | --- | --- |
| `sr-001` | 1 | De boot vaart. |
| `sr-002` | 1 | De zon schijnt. |
| `sr-003` | 1 | De bal rolt. |
| `sr-004` | 1 | De krab loopt. |
| `sr-005` | 1 | De dolfijn zwemt. |
| `sr-006` | 2 | De boot vaart op zee. |
| `sr-007` | 2 | De bal ligt op het strand. |
| `sr-008` | 2 | De krab zit op de handdoek. |
| `sr-009` | 2 | De vlieger vliegt hoog. |
| `sr-010` | 2 | De schelp ligt naast de bal. |
| `sr-011` | 3 | De vuurtoren staat op het eiland. |
| `sr-012` | 3 | De dolfijn zwemt in de blauwe zee. |
| `sr-013` | 3 | Het vliegtuig vliegt boven de boot. |
| `sr-014` | 3 | Het zandkasteel staat naast de schelpen. |
| `sr-015` | 3 | De parasol staat dichtbij de handdoek. |

## 6. Word Structure Tasks

These tasks practice word forms and simple grammar through choices or parent-supported production.

| Id | Level | Task | Target |
| --- | --- | --- | --- |
| `ws-001` | 1 | Een schelp, twee ... | schelpen |
| `ws-002` | 1 | Een boot, twee ... | boten |
| `ws-003` | 1 | Een bal, twee ... | ballen |
| `ws-004` | 1 | Een krab, twee ... | krabben |
| `ws-005` | 1 | Een parasol, twee ... | parasols |
| `ws-006` | 2 | De dolfijn ... in de zee. | zwemt |
| `ws-007` | 2 | De boot ... op het water. | vaart |
| `ws-008` | 2 | De vlieger ... in de lucht. | vliegt |
| `ws-009` | 2 | De bal ... op het strand. | ligt |
| `ws-010` | 2 | De krab ... op de handdoek. | zit |
| `ws-011` | 3 | Kies: grote bal / kleine bal. | adjective contrast |
| `ws-012` | 3 | Kies: hoge vuurtoren / lage vuurtoren. | adjective contrast |
| `ws-013` | 3 | Kies: natte schelp / droge schelp. | adjective contrast |
| `ws-014` | 3 | Maak korter: zandkasteel. Welke woorden hoor je? | zand + kasteel |
| `ws-015` | 3 | Maak de zin af: De zon staat ... de zee. | boven |

## 7. Following Directions Tasks

The child follows one-step, two-step or three-step directions.

| Id | Level | Direction | Expected action |
| --- | --- | --- | --- |
| `fd-001` | 1 | Pak de dolfijn. | Select dolfijn. |
| `fd-002` | 1 | Pak de boot. | Select boot. |
| `fd-003` | 1 | Leg de bal op het strand. | Place ball on beach. |
| `fd-004` | 1 | Zet de zon boven. | Place sun in sky. |
| `fd-005` | 1 | Pak de schelp. | Select shell. |
| `fd-006` | 2 | Zet de krab op de handdoek. | Place crab on towel. |
| `fd-007` | 2 | Zet de vlieger boven het strand. | Place kite above beach. |
| `fd-008` | 2 | Zet de boot naast de dolfijn. | Place boat next to dolphin. |
| `fd-009` | 2 | Leg de schelp dichtbij de bal. | Place shell close to ball. |
| `fd-010` | 2 | Zet de vuurtoren rechts op het eiland. | Place lighthouse right/on island. |
| `fd-011` | 3 | Zet eerst de boot op het water en daarna de zon boven. | Two-step action. |
| `fd-012` | 3 | Leg eerst de handdoek op het strand en zet daarna de krab erop. | Two-step action. |
| `fd-013` | 3 | Zet eerst de parasol neer en leg daarna de bal ernaast. | Two-step action. |
| `fd-014` | 4 | Pak de schelp, leg hem naast de bal en zet de krab op de handdoek. | Three-step action. |
| `fd-015` | 4 | Zet de vlieger boven, de boot op het water en het zandkasteel in het midden. | Three-step action. |

## 8. Word Category Tasks

The child groups or selects words by category.

| Id | Level | Task | Target category/answer |
| --- | --- | --- | --- |
| `wc-001` | 1 | Welke is een dier? dolfijn of boot | dolfijn |
| `wc-002` | 1 | Welke is een voertuig? boot of schelp | boot |
| `wc-003` | 1 | Welke hoort in de lucht? zon of krab | zon |
| `wc-004` | 1 | Welke hoort op het strand? bal of vliegtuig | bal |
| `wc-005` | 1 | Welke is een strandspul? parasol of dolfijn | parasol |
| `wc-006` | 2 | Zet dolfijn en krab bij dieren. | dieren |
| `wc-007` | 2 | Zet boot en vliegtuig bij voertuigen. | voertuigen |
| `wc-008` | 2 | Zet bal, parasol en handdoek bij strandspullen. | strandspullen |
| `wc-009` | 2 | Zet zon en zee bij natuur. | natuur |
| `wc-010` | 2 | Welke hoort er niet bij: boot, vliegtuig, dolfijn? | dolfijn |
| `wc-011` | 3 | Welke hoort er niet bij: bal, parasol, handdoek, krab? | krab |
| `wc-012` | 3 | Welke hoort er niet bij: dolfijn, krab, schelp, boot? | boot |
| `wc-013` | 3 | Kies alle dingen die kunnen vliegen: vliegtuig, vlieger, bal. | vliegtuig, vlieger |
| `wc-014` | 3 | Kies alle dingen voor op het strand: handdoek, parasol, boot. | handdoek, parasol |
| `wc-015` | 3 | Kies alle dieren: dolfijn, krab, zon. | dolfijn, krab |

## Practice Feedback Examples

Correct:

> Goed zo! De dolfijn zwemt in de zee. +1 Speed!

Near-correct:

> Bijna! De bal moet naast de parasol. Naast betekent dichtbij aan de zijkant.

With help:

> Goed geprobeerd. Kijk, de schelp ligt op het strand. Probeer het nog een keer.

## Observation Tags

Use these tags later for dashboard aggregation:

- `recognized_without_help`;
- `recognized_with_hint`;
- `active_named`;
- `active_with_help`;
- `sentence_understood`;
- `sentence_repeated`;
- `spatial_correct`;
- `spatial_needs_practice`;
- `category_correct`;
- `following_direction_1_step`;
- `following_direction_2_step`;
- `following_direction_3_step`.
