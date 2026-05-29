# Parent And Speech Therapist Dashboard Design

## Purpose

The dashboard for `+1 Woordenschat Bezem Escape` shows practice progress and simple observations.

It is designed for:

- parents;
- caregivers;
- speech therapists/logopedists.

The dashboard does not diagnose, does not compare to official norms and does not use CELF Preschool or PPVT/Peabody scoring.

## Core Rule

Show practice observations only.

Allowed:

- words practiced;
- concepts practiced;
- help used;
- progress over time;
- suggestions for next practice.

Not allowed:

- medical diagnosis;
- official norm comparison;
- CELF scores;
- PPVT scores;
- labels like delayed, disorder or below average.

## Simple Status Labels

Use only simple, supportive labels:

- Gaat goed;
- Oefenen;
- Met hulp;
- Nog moeilijk.

Optional neutral labels:

- Geoefend;
- Vandaag;
- Deze week;
- Volgende keer.

## Dashboard Data Tracked

The dashboard tracks:

- words practiced;
- words recognized;
- words named actively;
- spatial concepts practiced;
- concepts that were difficult;
- sentence comprehension performance;
- sentence repetition attempts;
- following directions performance;
- word categories practiced;
- number of hints used;
- audio repetitions;
- correct without help;
- correct with help;
- needs more practice.

## Observation Model

Each practice event can contribute to dashboard observations.

Suggested event fields:

- `profileId`;
- `sessionId`;
- `gameId`;
- `worldId`;
- `taskId`;
- `domain`;
- `wordIds`;
- `spatialConcepts`;
- `categoryIds`;
- `sentenceType`;
- `wasCorrect`;
- `usedHint`;
- `audioRepeats`;
- `attempts`;
- `supportLevel`;
- `completedAt`.

## Status Logic

Status should be explainable and gentle.

### Gaat goed

Use when:

- child answered correctly without help multiple times;
- word/concept appears stable across sessions;
- few or no hints were needed.

### Oefenen

Use when:

- child has practiced but not enough yet;
- mixed results;
- still building familiarity.

### Met hulp

Use when:

- child completed task after hint;
- audio repetition helped;
- parent/therapist support was used.

### Nog moeilijk

Use when:

- repeated mistakes;
- multiple hints needed;
- child did not complete after support;
- concept was difficult across tasks.

Avoid making this sound negative. It means "good next practice target".

## 1. Today's Practice

### Purpose

Give a short overview of the current day.

### Shows

- minutes or sessions played;
- number of tasks completed;
- words practiced;
- concepts practiced;
- stars earned;
- hints used;
- audio repetitions;
- rewards earned.

### Example

```text
Vandaag geoefend
- 12 opdrachten gespeeld
- 8 woorden geoefend
- 4 plaatsbegrippen geoefend
- 3 keer hint gebruikt
- Nieuwe beloning: Dolfijn Sticker
```

## 2. Word List

### Purpose

Show progress for each word.

### Columns

- word;
- recognized;
- named actively;
- support;
- status.

### Example

| Woord | Herkend | Zelf benoemd | Hulp | Status |
| --- | --- | --- | --- | --- |
| dolfijn | 4x | 2x | 0x | Gaat goed |
| vuurtoren | 2x | 0x | 2x | Met hulp |
| schelp | 3x | 1x | 1x | Oefenen |
| krab | 1x | 0x | 2x | Nog moeilijk |

## 3. Spatial Concepts

### Purpose

Show how place concepts are developing through practice.

### Concepts

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

### Example

| Begrip | Goed zonder hulp | Met hulp | Status |
| --- | --- | --- | --- |
| in | 5 | 0 | Gaat goed |
| op | 4 | 1 | Gaat goed |
| naast | 2 | 2 | Oefenen |
| onder | 1 | 3 | Met hulp |
| tussen | 0 | 2 | Nog moeilijk |

## 4. Sentence Understanding

### Purpose

Show whether the child understands spoken sentences and can perform the matching action.

### Tracks

- one-step sentences;
- spatial sentences;
- two-step sentences;
- longer sentences later.

### Example

| Type zin | Goed | Met hulp | Status |
| --- | --- | --- | --- |
| 1-staps | 8 | 1 | Gaat goed |
| Plaatszin | 5 | 3 | Oefenen |
| 2-staps | 2 | 4 | Met hulp |

### Parent-Friendly Summary

```text
Korte opdrachten gingen goed.
Opdrachten met "naast" en "tussen" mogen vaker geoefend worden.
```

## 5. Active Vocabulary

### Purpose

Show which words the child said or attempted to say.

### Support Levels

- zelf gezegd;
- bijna goed;
- met hulp;
- nog niet geprobeerd.

### Example

| Woord | Zelf gezegd | Met hulp | Status |
| --- | --- | --- | --- |
| boot | 3 | 0 | Gaat goed |
| dolfijn | 2 | 1 | Gaat goed |
| vuurtoren | 0 | 2 | Met hulp |
| zandkasteel | 0 | 1 | Oefenen |

## 6. Sentence Repetition

### Purpose

Show sentence repetition practice without formal scoring.

### Tracks

- short sentence repeated;
- partial repetition;
- repeated with help;
- attempts.

### Example

| Zinsoort | Pogingen | Met hulp | Status |
| --- | --- | --- | --- |
| Korte zin | 5 | 1 | Gaat goed |
| Middellange zin | 3 | 2 | Oefenen |
| Lange zin | 1 | 2 | Nog moeilijk |

### Example Summary

```text
Korte zinnen gingen goed.
Langere zinnen kunnen rustig verder geoefend worden.
```

## 7. Following Directions

### Purpose

Show how well the child follows instructions.

### Tracks

- one-step directions;
- two-step directions;
- three-step directions later;
- directions with place concepts;
- directions with order words like eerst/daarna.

### Example

| Aanwijzing | Goed | Met hulp | Status |
| --- | --- | --- | --- |
| 1-staps | 7 | 1 | Gaat goed |
| 2-staps | 2 | 3 | Oefenen |
| Met plaatsbegrip | 4 | 4 | Met hulp |
| Eerst/daarna | 1 | 2 | Nog moeilijk |

## 8. Categories

### Purpose

Show practice with word categories.

### Beach Categories

- dieren;
- voertuigen;
- strandspullen;
- natuur;
- plekken.

### Example

| Categorie | Woorden | Status |
| --- | --- | --- |
| dieren | dolfijn, krab | Gaat goed |
| voertuigen | boot, vliegtuig | Oefenen |
| strandspullen | bal, parasol, handdoek | Gaat goed |
| natuur | zon, schelp | Oefenen |
| plekken | vuurtoren, strand, zee | Met hulp |

## 9. Recommended Next Practice

### Purpose

Suggest what to practice next, based on observations.

### Rules

Recommendations should be simple and supportive.

Examples:

- Oefen nog 3 opdrachten met "naast".
- Herhaal woorden: vuurtoren, zandkasteel.
- Speel nog een korte ronde met 2-staps opdrachten.
- Kies morgen opnieuw Strandwereld.
- Oefen dieren: dolfijn en krab.

### Recommendation Priority

1. Concepts marked Nog moeilijk.
2. Words recognized with help.
3. Active vocabulary not yet attempted.
4. Sentence types needing support.
5. Categories with mixed results.

## 10. Export Or Share Summary

### Purpose

Let parents share a simple practice summary with a logopedist.

### Export Content

Export should include:

- child profile name;
- date range;
- sessions played;
- words practiced;
- concepts practiced;
- hints used;
- audio repetitions;
- correct without help;
- correct with help;
- recommended next practice.

### Example Export Text

```text
Oefensamenvatting - Strandwereld

Periode: deze week
Gespeelde rondes: 4
Geoefende woorden: dolfijn, boot, vuurtoren, bal, parasol, schelp
Plaatsbegrippen: in, op, naast, onder

Gaat goed:
- dolfijn herkennen
- boot herkennen
- in en op

Met hulp:
- vuurtoren benoemen
- naast gebruiken

Nog oefenen:
- tussen
- 2-staps aanwijzingen

Let op: dit is een oefenoverzicht, geen diagnostisch rapport.
```

### Export Formats Later

Possible export formats:

- copy summary text;
- share as PDF later;
- parent note screen;
- session history view.

## Dashboard UI Rules

### General

- Calm layout.
- Clear cards.
- No clutter.
- Parent-facing, not child-facing.
- Use friendly labels.
- Avoid alarm colors.
- No red failure badges.

### Status Colors

Suggested:

- Gaat goed: green;
- Oefenen: blue;
- Met hulp: yellow;
- Nog moeilijk: soft purple or neutral amber.

Avoid red unless there is a technical error.

### Mobile Layout

Portrait:

- stacked cards;
- summary first;
- tabs or accordion sections.

Landscape:

- two-column layout;
- summary left;
- detail cards right.

## Data Privacy

MVP stores data locally.

No external sharing happens unless parent intentionally exports or copies a summary.

## Acceptance Criteria

Dashboard is acceptable when:

- it shows practice observations only;
- it avoids diagnosis and official scoring;
- it uses simple labels;
- parent can see today's practice;
- parent can inspect words and concepts;
- parent can see hints/audio repetitions;
- parent can see recommended next practice;
- export summary includes a clear non-diagnostic note.
