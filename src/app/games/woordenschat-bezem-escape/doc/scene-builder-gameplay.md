# Scene Builder Gameplay Design

## Purpose

The scene-builder is the core learning mode of `+1 Woordenschat Bezem Escape`.

The child sees an empty beach scene and a tray of draggable sticker objects. The app gives a spoken instruction. The child chooses the correct object and places it in the correct location.

The mode trains:

- vocabulary recognition;
- spatial concepts;
- sentence comprehension;
- following instructions;
- active vocabulary;
- early sentence production.

The scene-builder must feel like a playful digital version of a paper speech therapy scene board.

## Core Loop

```text
Hear instruction
-> understand word and place
-> choose sticker object
-> drag or tap object
-> place object in scene
-> receive feedback
-> earn +1 Speed
-> scene becomes more complete
-> repeat
-> transition to broom race
```

## 1. How The Child Receives An Instruction

### Instruction Delivery

Each instruction is delivered in three ways:

- spoken audio;
- short visible sentence for parent/therapist;
- visual support through target highlighting when needed.

The child should not need to read. The visible sentence is mainly for the adult or for children who can already read.

### Audio Button

The audio button is always visible during gameplay.

Rules:

- large touch target;
- speaker icon;
- short label if space allows;
- pressing it repeats the current instruction;
- each repeat is counted as `audioRepeats`.

### Instruction Bubble

The instruction bubble shows:

- current spoken sentence;
- optional target word icon later;
- no long explanation;
- calm friendly visual style.

### Example Instructions

- Zet de dolfijn in de zee.
- Zet de boot op het water.
- Zet de vuurtoren op het eiland.
- Leg de bal naast de parasol.
- Zet de vlieger boven het strand.
- Zet het vliegtuig boven de zee.
- Leg de schelpen op het strand.
- Zet de krab op de handdoek.
- Zet het zandkasteel naast de schelpen.

## 2. How The Child Drags An Object

### Object Tray

The object tray is placed at the bottom in portrait and under/near the scene in landscape.

Tray rules:

- shows available sticker objects;
- every sticker is large enough to tap;
- selected sticker gets a soft glow;
- used stickers can remain visible but marked as placed;
- object names are not printed inside the artwork.

### Drag Interaction

The child can:

1. press a sticker;
2. drag it into the beach scene;
3. release it on or near a target zone.

During drag:

- sticker stays above other UI;
- sticker slightly enlarges;
- valid zones softly glow;
- scene remains readable;
- tray does not jump or resize.

### Tap Alternative

Because drag-and-drop can be difficult for young children, tapping must also work.

Tap flow:

1. child taps object;
2. object becomes selected;
3. child taps target zone;
4. app previews placement;
5. child confirms with the main action button.

This keeps the game accessible on phones and for children with fine motor challenges.

## 3. How Drop Zones Work

### Zone Types

The beach scene contains semantic zones:

- `sky`;
- `sea`;
- `water`;
- `beach`;
- `sand`;
- `island`;
- `towel`;
- relative zones such as `next-to-parasol`, `above-sea`, `under-umbrella`.

### Zone Visibility

Zones are usually invisible to keep the scene clean.

Zones become visible when:

- the child taps Hint;
- the child starts dragging the correct object;
- the child has made an incorrect attempt;
- the instruction is difficult.

### Zone Visual Style

Target zones use:

- soft dashed outline;
- pastel transparent fill;
- gentle glow;
- no harsh red;
- no flashing.

### Relative Drop Zones

For relational concepts like `naast`, `boven` and `onder`, the game creates contextual zones around an anchor object.

Examples:

- `naast de parasol`: left/right side area near the parasol;
- `boven de zee`: sky area directly above the sea;
- `op de handdoek`: towel area;
- `naast de schelpen`: side area near placed shells.

If the anchor object is not placed yet, the instruction should not be selected unless the anchor has a default scene position.

## 4. How Correct Answers Are Detected

### Detection Inputs

The game checks:

- selected object id;
- drop zone id;
- spatial concept;
- anchor object if needed;
- number of attempts;
- hint state.

### Correct Answer Rule

An answer is correct when:

```text
selected object matches target object
AND
drop location matches target zone or valid relative zone
```

### Near-Correct Rule

An answer is near-correct when:

- object is correct but zone is wrong;
- zone is correct but object is wrong;
- drop is close to the target zone;
- relation is almost right, for example near the parasol but not clearly next to it.

Near-correct answers should trigger supportive correction, not failure.

### Incorrect Rule

An answer is incorrect when:

- wrong object is selected;
- object is placed in a clearly unrelated zone;
- child confirms without selecting object;
- child confirms without choosing a location.

Even then, the language stays supportive.

## 5. How Hints Work

### Hint Button

The hint button is always visible during gameplay.

When pressed, it can:

- repeat the key word;
- highlight the correct object;
- highlight the target zone;
- show a small mascot gesture;
- simplify the instruction.

### Hint Levels

Hints should become stronger step by step.

#### Hint 1: Repeat Key Word

Example:

> Zoek de dolfijn.

#### Hint 2: Highlight Object

The correct object sticker softly pulses.

#### Hint 3: Highlight Zone

The correct zone softly glows.

#### Hint 4: Explain Spatial Concept

Example:

> In betekent binnen het water. Zet de dolfijn in de zee.

### Hint Scoring

Using a hint is not punished.

The game records:

- `hintUsed: true`;
- hint level;
- correct with help.

Reward can still be given, but bonus can be reserved for answers without hints.

## 6. How Feedback Works

### Feedback Goals

Feedback should:

- confirm effort;
- repeat the target word;
- repeat the correct sentence;
- teach the spatial concept;
- keep the child motivated.

### Correct Feedback

Format:

```text
Positive confirmation
-> target sentence
-> +1 Speed
```

Example:

> Goed zo! De dolfijn zwemt in de zee. +1 Speed!

### Near-Correct Feedback

Format:

```text
Bijna
-> explain what to adjust
-> explain concept simply
-> invite retry
```

Example:

> Bijna! De bal moet naast de parasol. Naast betekent dichtbij aan de zijkant.

### Incorrect Feedback

Never say only:

- Fout.
- Verkeerd.
- Nee.

Use:

> Goed geprobeerd. Kijk, dit is de dolfijn. De dolfijn hoort in de zee.

### Feedback Channels

Use:

- short audio;
- visual glow;
- small mascot reaction;
- speed meter animation;
- sticker bounce.

Avoid:

- angry sounds;
- red X;
- harsh shake;
- long text.

## 7. How +1 Speed Is Awarded

### Basic Speed Reward

The child earns speed through language actions.

| Action | Reward |
| --- | --- |
| Correct object selected | +1 Speed |
| Correct zone selected | +1 Speed |
| Full instruction correct | +1 Word Star |
| Correct without hint | Bonus sparkle |
| Correct after hint | Normal reward |
| Active word spoken later | +2 Speed |
| Own sentence produced later | +2 Speed |

### MVP Speed Rule

For MVP, keep it simple:

- each completed instruction gives +1 Speed;
- each completed instruction gives +1 Word Star;
- no penalty for mistakes;
- no loss of speed.

### Speed Meter

Speed is shown as a magical broom energy bar.

The meter should:

- fill gradually;
- glow when speed increases;
- show a small broom icon;
- never feel like a health bar;
- connect directly to the upcoming race.

## 8. How Mistakes Are Corrected Kindly

### Correction Philosophy

Mistakes are learning moments.

The child should feel:

- safe;
- encouraged;
- guided;
- ready to try again.

### Correction Flow

1. Accept the attempt.
2. Identify what was close.
3. Repeat the correct word or phrase.
4. Give a visual hint.
5. Let the child try again.

### Examples

Wrong object:

> Goed geprobeerd. Dit is de boot. Zoek nu de dolfijn.

Wrong place:

> Bijna! De dolfijn hoort in de zee. Sleep hem naar het water.

Wrong spatial concept:

> Bijna! Naast betekent dichtbij aan de zijkant. Leg de bal naast de parasol.

No object selected:

> Kies eerst een plaatje. Zoek de dolfijn.

No location selected:

> Zet het plaatje op de plek in de scene.

## 9. How The Scene Becomes Complete

### Scene Completion

Each correct placement adds one sticker to the beach scene.

The scene becomes complete when:

- required instructions are finished;
- all required objects are placed;
- minimum speed threshold is reached.

### MVP Completion Rule

For MVP:

- complete after 5 successful placements;
- show short celebration;
- unlock `Start Race` button.

### Visual Completion

When complete:

- placed objects remain visible;
- speed meter glows;
- star mascot celebrates;
- race button appears;
- scene subtly shifts into race-ready state.

### Data Stored

Per completed instruction:

- instruction id;
- object id;
- zone id;
- concept;
- attempts;
- hint used;
- audio repeats;
- completion time;
- speed earned;
- word stars earned.

## 10. How The Game Transitions Into The Broom Race

### Transition Trigger

Race transition starts when:

- scene completion rule is met;
- child taps `Start Race`;
- parent has not cancelled session.

### Transition Sequence

1. Final sticker lands in scene.
2. Speed meter fills and sparkles.
3. Mascot says a short encouraging line.
4. Scene zooms or slides into race mode.
5. Broom appears with child avatar.
6. First race instruction appears.

### Race Uses Same Language

Objects from the scene become:

- obstacles;
- gates;
- collectibles;
- landmarks.

Examples:

- airplane becomes an object to fly under;
- boat becomes a landmark to fly above;
- shells become collectibles;
- parasol becomes a side/next-to reference.

### Race Instruction Examples

- Vlieg onder het vliegtuig door.
- Vlieg boven de boot.
- Pak de schelpen naast de bal.
- Ga naar de parasol op het strand.

## Scene Builder Example Instruction Set

| Id | Instruction | Target object | Target place | Concept |
| --- | --- | --- | --- | --- |
| `sb-001` | Zet de dolfijn in de zee. | dolfijn | zee | in |
| `sb-002` | Zet de boot op het water. | boot | water | op |
| `sb-003` | Zet de vuurtoren op het eiland. | vuurtoren | eiland | op |
| `sb-004` | Leg de bal naast de parasol. | bal | naast parasol | naast |
| `sb-005` | Zet de vlieger boven het strand. | vlieger | lucht boven strand | boven |
| `sb-006` | Zet het vliegtuig boven de zee. | vliegtuig | lucht boven zee | boven |
| `sb-007` | Leg de schelpen op het strand. | schelpen | strand | op |
| `sb-008` | Zet de krab op de handdoek. | krab | handdoek | op |
| `sb-009` | Zet het zandkasteel naast de schelpen. | zandkasteel | naast schelpen | naast |

## Active Vocabulary Support

After correct placement, the game can invite speech production.

Examples:

- Wat is dit?
- Zeg: dolfijn.
- Waar zwemt de dolfijn?
- Maak een zin: De dolfijn zwemt in de zee.

MVP can show this as optional parent-supported step.

Parent buttons later:

- goed gezegd;
- bijna goed;
- met hulp.

## Implementation Notes

The scene-builder should be implemented with data-driven instructions.

Each instruction needs:

- id;
- audio text;
- target object id;
- accepted target zone ids;
- spatial concept;
- anchor object id if relative;
- hint text;
- correct feedback;
- near-correct feedback;
- reward value.

No hardcoded one-off instruction logic should be needed for basic placements.
