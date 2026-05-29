# Reward System Design

## Purpose

The reward system in `+1 Woordenschat Bezem Escape` motivates children to practice vocabulary, sentence comprehension and spatial language without pressure.

The child should feel:

- safe;
- proud;
- curious;
- encouraged to try again;
- never punished.

The reward system is not gambling, not random loot and not ad-driven.

## Reward Principles

- Reward effort and practice, not perfection only.
- Give clear, predictable rewards.
- Avoid pressure, streak anxiety or punishment.
- Make language actions feel powerful.
- Keep rewards visual, simple and child-friendly.
- Let parents see learning progress separately from playful rewards.

## Not Allowed

- No loot boxes.
- No gambling mechanics.
- No random paid rewards.
- No ads.
- No punishment for mistakes.
- No loss of earned rewards.
- No scary failure state.
- No pressure messages like "you failed" or "try harder".

## 1. Reward Types

### Stars

Stars are the basic session reward.

Use:

- earned for completing tasks;
- shown during and after a level;
- used for simple progress feedback.

### +1 Speed

Speed is the moment-to-moment motivational reward.

Use:

- increases broom energy;
- makes the race feel faster;
- connects language success to movement.

### Word Badges

Word badges show that the child practiced a word multiple times.

Examples:

- Dolfijn Badge;
- Boot Badge;
- Parasol Badge;
- Schelp Badge.

### Stickers

Stickers are collectible rewards.

Examples:

- Dolfijn Sticker;
- Strandster Sticker;
- Schelp Sticker;
- Vuurtoren Sticker;
- Krab Sticker.

### Broom Colors

Broom colors are visual customization rewards.

Examples:

- Blauwe Bezem;
- Zandgele Bezem;
- Regenboog Bezem;
- Sterren Bezem.

### Broom Trails

Trails are visual effects during the race.

Examples:

- Sparkle Trail;
- Bubble Trail;
- Rainbow Trail;
- Star Dust Trail.

### Avatar Clothes

Avatar clothes are safe customization rewards.

Examples:

- blue shirt;
- beach scarf;
- tiny backpack;
- star badge;
- sun hat.

### New Worlds

New worlds unlock later through practice.

Examples:

- Boerderijwereld;
- Dierentuin;
- Speeltuin;
- School;
- Ruimte.

### Mascot Animations

Mascot animations are small celebrations from the star mascot.

Examples:

- happy bounce;
- hint sparkle;
- celebration spin;
- thumbs-up gesture;
- gentle clap.

## 2. How Rewards Are Earned

### Basic Rule

Every completed language action can earn a reward.

| Action | Reward |
| --- | --- |
| Word recognized | +1 Speed |
| Object placed correctly | +1 Speed |
| Sentence understood | +1 Word Star |
| Instruction completed with hint | +1 Speed |
| Instruction completed without hint | +1 Speed and sparkle bonus |
| Word actively named | +2 Speed |
| Sentence repeated | +1 Word Star |
| Scene completed | Sticker or badge progress |
| Race completed | Stars and possible cosmetic unlock |

### Mistakes

Mistakes do not remove rewards.

If the child needs help:

- give hint;
- allow retry;
- still reward completion;
- mark progress as "with help" for parent dashboard.

### Predictable Unlocks

Rewards should be predictable.

Example:

- practice dolfijn 3 times -> Dolfijn Sticker;
- complete 5 beach tasks -> Blauwe Bezem;
- complete beach race -> Strandster Sticker.

Avoid hidden random rewards.

## 3. How +1 Speed Works

### Design Goal

Speed makes language feel powerful.

The child should understand:

> I listen, understand and use words. My broom gets faster.

### Speed Sources

MVP:

- each completed instruction gives +1 Speed;
- each correct race action gives +1 Speed;
- no speed loss below base level.

Later:

- correct without hint gives sparkle boost;
- active vocabulary gives +2 Speed;
- sentence production gives +2 Speed;
- repeated difficult word gives extra badge progress.

### Speed Meter

Speed is shown as a magical broom energy bar.

Visual behavior:

- fills gradually;
- glows when speed increases;
- broom icon pulses;
- star mascot reacts positively;
- trail becomes more visible during race.

### Speed Safety

Speed should never make the game too hard.

Rules:

- maximum speed is capped;
- acceleration is smooth;
- mistake only slows briefly;
- race remains readable.

## 4. How Word Mastery Unlocks Stickers

### Word Mastery Definition

Word mastery in this game means practice progress, not diagnostic mastery.

A word can move through practice states:

1. Seen.
2. Recognized with help.
3. Recognized without help.
4. Actively named with help.
5. Actively named without help.
6. Used in a short sentence.

### Sticker Unlock Rule

Example rule:

- word practiced 1 time: word appears in sticker book as gray outline;
- recognized 2 times: sticker gets color;
- named once: sticker gets sparkle;
- used in sentence: sticker gets gold border.

### Beach Sticker Examples

| Word | Sticker unlock |
| --- | --- |
| dolfijn | Dolfijn Sticker |
| boot | Boot Sticker |
| vuurtoren | Vuurtoren Sticker |
| parasol | Parasol Sticker |
| schelp | Schelp Sticker |
| krab | Krab Sticker |
| zandkasteel | Zandkasteel Sticker |

### Parent View

Parent can see:

- practiced;
- recognized;
- named;
- sentence used;
- with help;
- without help.

No clinical wording is used.

## 5. How Parents Can See Progress

### Parent Dashboard Goals

The dashboard should show practice observations simply.

It should not say:

- diagnosis;
- delayed;
- failed;
- below norm.

It can say:

- growing;
- practiced;
- with help;
- without help;
- extra practice useful.

### Dashboard Sections

1. Words practiced today.
2. Words recognized without help.
3. Words practiced with hint.
4. Spatial concepts practiced.
5. Sentences repeated.
6. Active words named.
7. Rewards earned.
8. Suggested practice next time.

### Example Parent Summary

```text
Vandaag geoefend:
- Dolfijn: herkend zonder hulp.
- Vuurtoren: herkend met hint.
- Naast: goed geoefend.
- Onder: nog extra oefenen.
- Zinnen: korte zinnen gingen goed.
```

## 6. Example Reward Screen After A Beach Level

### Screen Title

Goed gespeeld!

### Main Visual

- child avatar on broom;
- star mascot celebrating;
- earned sticker shown large;
- speed bar glowing softly.

### Results

```text
Je oefende 6 strandwoorden.
Je gebruikte 3 plaatswoorden.
Je verdiende 8 woordsterren.
Nieuwe beloning: Dolfijn Sticker.
```

### Visual Items

- word icons: dolfijn, boot, bal, parasol, schelp, krab;
- concept icons: in, op, naast;
- star count;
- broom speed;
- unlocked reward.

### Buttons

- Nog een keer.
- Kies wereld.
- Bekijk stickers.

All buttons use large touch targets and Game Wereld UI style.

## 7. Example Encouraging Feedback Text

### Correct Answers

- Goed zo! De dolfijn zwemt in de zee. +1 Speed!
- Knap! De boot vaart op het water. +1 Speed!
- Ja! De bal ligt naast de parasol. +1 Speed!
- Mooi! De krab zit op de handdoek. +1 Speed!
- Super! Je vond de schelp op het strand. +1 Speed!

### With Hint

- Goed geprobeerd. De dolfijn hoort in de zee. Probeer het nog eens.
- Bijna! Naast betekent dichtbij aan de zijkant.
- Kijk goed naar het water. Waar vaart de boot?
- De krab zoekt de handdoek. Zet hem op de handdoek.
- De vlieger hoort boven het strand.

### Race Feedback

- Wauw! Je vloog onder het vliegtuig. +1 Speed!
- Goed gestuurd! Je ging links langs de vuurtoren.
- Knap gesprongen! Je ging over de bal.
- Je vond de schelpen naast de boot.
- Je bezem krijgt meer kracht door jouw woorden.

### Reward Feedback

- Je hebt goed geoefend.
- Je woorden maken je bezem sneller.
- Nieuwe sticker vrijgespeeld!
- Je hebt veel strandwoorden geoefend.
- Nog een ronde? Je bezem is er klaar voor.

## Reward Balance For MVP

MVP reward plan:

- every task completion: +1 Speed;
- every scene-builder task: +1 Word Star;
- every race task: +1 Star if correct or completed with help;
- first completed beach scene: Dolfijn Sticker;
- first completed beach race: Blauwe Bezem;
- 10 total word stars: Strandster Sticker.

## Implementation Notes

Reward data should be stored per profile:

- total speed earned;
- total stars;
- unlocked broom colors;
- unlocked broom trails;
- unlocked stickers;
- word badge progress;
- last reward earned;
- reward history.

Rewards should be deterministic and explainable.
