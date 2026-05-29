# Broom Escape Race Gameplay Design

## Purpose

The Broom Escape Race is the reward-and-reinforcement phase of `+1 Woordenschat Bezem Escape`.

After the child completes a vocabulary scene, the same beach world transforms into a short race level. The child flies on a magical broom through the world they just built. Objects from the scene become obstacles, gates, landmarks and collectibles.

The race should feel fun and fast, but it remains educational. The child experiences that language powers the broom.

## Learning Goals

The race reinforces:

- vocabulary recognition;
- spatial concepts;
- sentence comprehension;
- following short instructions;
- attention to object-location relationships;
- repetition of words from the scene builder.

The race is not a test and does not use official diagnostic scoring.

## Core Race Loop

```text
Hear short race instruction
-> identify object or location
-> steer broom
-> pass object correctly or collect target
-> receive supportive feedback
-> gain +1 Speed
-> continue race
-> finish with reward summary
```

## Race Duration

MVP race duration:

- minimum: 30 seconds;
- maximum: 60 seconds;
- recommended first demo: 30 seconds.

Short duration keeps the race exciting and prevents fatigue.

## Race Start Conditions

The race starts after:

- scene builder completion;
- minimum number of successful placements;
- child taps `Start Race`;
- speed meter has at least one speed point.

MVP recommendation:

- start after 5 successful scene-builder instructions.

## 1. Race Camera Design

### Camera Goal

The camera must make the child feel like they are flying through the same world, while keeping objects large and readable on mobile.

### Camera Style

Use a 2D side-scrolling or gentle forward-scrolling camera.

Recommended MVP:

- side-scrolling beach race;
- broom moves from left to right;
- background scrolls slowly;
- placed objects appear as landmarks and obstacles.

Why:

- easy to understand;
- works on mobile;
- clear spatial concepts like boven, onder, links, rechts, tussen;
- easier than 3D perspective for young children.

### Camera Layout

The screen is divided into three vertical bands:

- sky lane;
- sea lane;
- beach lane.

Objects are placed in one of these lanes:

- airplane and kite in sky lane;
- boat and dolphin in sea lane;
- ball, parasol, shells, crab and sandcastle in beach lane.

### Object Readability

Objects must be:

- large enough to recognize;
- not too close together;
- surrounded by empty space;
- visually consistent with the sticker style.

### Camera Motion

The camera scroll speed depends on broom speed.

Rules:

- base speed is slow and safe;
- correct actions add speed;
- mistakes reduce speed slightly;
- no sudden jumps;
- no motion that causes confusion.

## 2. Mobile Controls

### Control Goals

Controls must be simple for young children.

MVP controls:

- left/right or up/down lane buttons;
- jump button;
- optional swipe support later.

### Recommended MVP Control Layout

Portrait:

- left button bottom-left;
- right button bottom-center or bottom-right;
- jump button larger on bottom-right;
- instruction bubble above race area;
- speed and stars at top.

Landscape:

- left/right controls on left bottom;
- jump button on right bottom;
- instruction bubble top-center;
- speed and stars top corners.

### Touch Rules

- every control is at least 44px;
- jump button is visually primary during race;
- controls must not cover current target;
- controls stay fixed during scrolling;
- buttons have active pressed states.

### Swipe Option Later

Swipe can be added later:

- swipe up: move up or jump;
- swipe down: move down;
- swipe left/right: lane shift.

Swipe should not replace buttons in MVP because buttons are clearer for young children.

## 3. Obstacle Design

### Object Roles

Objects from the scene builder become race elements.

| Scene object | Race role |
| --- | --- |
| vliegtuig | overhead object to fly under |
| vlieger | sky object to fly under or avoid |
| vuurtoren | landmark to pass left/right |
| boot | sea landmark or gate anchor |
| dolfijn | sea collectible or star marker |
| bal | jump obstacle |
| parasol | gate anchor |
| schelpen | collectible |
| krab | low obstacle |
| zandkasteel | gate anchor or jump obstacle |

### Obstacle Types

#### Over/Under Obstacles

Used for:

- boven;
- onder.

Examples:

- Vlieg onder het vliegtuig door.
- Vlieg boven de krab.

#### Left/Right Landmarks

Used for:

- links;
- rechts.

Examples:

- Ga links langs de vuurtoren.
- Ga rechts langs de boot.

#### Collectibles

Used for:

- vocabulary recognition;
- place relationship.

Examples:

- Pak de schelpen naast de boot.
- Pak de dolfijnster in de zee.

#### Gates

Used for:

- tussen;
- relation between two objects.

Examples:

- Vlieg tussen de parasol en het zandkasteel.

### Obstacle Safety Rules

- no scary collision effects;
- no hard fail;
- no losing all progress;
- wrong action only slows broom slightly;
- object remains readable after mistake.

## 4. Instruction Bubble Design

### Purpose

The instruction bubble tells the child what to do during the race.

The child mainly hears the instruction through audio. The bubble supports adults and older children.

### Bubble Contents

The bubble contains:

- short instruction sentence;
- audio replay button;
- hint button;
- optional object icon later.

Examples:

- Vlieg onder het vliegtuig door.
- Spring over de bal.
- Pak de schelpen naast de boot.

### Bubble Placement

Portrait:

- top of race area;
- below speed/star HUD;
- does not block the broom.

Landscape:

- top-center or top-left;
- never over controls.

### Bubble Style

- rounded panel;
- soft white or warm pastel fill;
- thick outline;
- speaker icon;
- hint icon;
- short text;
- no long explanations during active flight.

## 5. Speed Boost System

### Design Intent

Speed is the emotional reward that connects language to racing.

The child should understand:

> When I understand words, my broom goes faster.

### Speed Sources

During race:

- correct route: +1 Speed;
- correct collectible: +1 Speed;
- correct spatial action: +1 Speed;
- completing instruction without hint: small sparkle boost;
- completing after hint: normal +1 Speed.

### Speed Meter

Speed meter is a magical broom energy bar.

Visual behavior:

- fills with warm yellow/cyan glow;
- broom icon pulses on speed gain;
- small sparkle trail appears behind broom;
- meter never looks like health or danger.

### Speed Limits

To keep race safe:

- speed has a child-friendly maximum;
- acceleration is gradual;
- camera never becomes too fast to read objects.

### MVP Speed Rule

For first race demo:

- start speed equals scene-builder speed;
- each correct race action gives +1;
- mistake reduces temporary speed by 1 level for 2 seconds;
- speed cannot go below safe base speed.

## 6. Mistake Handling

### Mistake Types

- child passes wrong side;
- child misses collectible;
- child jumps too late;
- child flies above instead of under;
- child ignores instruction.

### No Hard Failure

There is no game over.

On mistake:

1. broom slows slightly;
2. target glows;
3. instruction repeats or hint appears;
4. child gets another chance if possible.

### Supportive Language

Do not say:

- fout;
- verkeerd;
- je bent af;
- game over.

Use:

- Bijna!
- Probeer nog een keer.
- Kijk naar het vliegtuig.
- Onder betekent lager dan het vliegtuig.

### Mistake Feedback Examples

Wrong vertical relation:

> Bijna! Onder betekent lager. Vlieg onder het vliegtuig door.

Missed collectible:

> Goed geprobeerd. De schelpen liggen naast de boot. Pak ze daar.

Wrong side:

> Bijna! Links is deze kant. Ga links langs de vuurtoren.

## 7. Reward System

### During Race

Rewards:

- +1 Speed;
- sparkle trail;
- star pickup;
- mascot celebration;
- soft sound effect later.

### End Of Race

End screen shows:

- words practiced;
- place concepts practiced;
- stars collected;
- speed gained;
- unlocked reward if any.

### Reward Examples

- Dolfijn Sticker;
- Blauwe Bezem;
- Strandster Sticker;
- Rainbow trail later.

### Reward Philosophy

Reward effort and language actions. Do not punish mistakes.

The child should leave the race feeling successful even with help.

## 8. How Race Reinforces Vocabulary And Place Concepts

### Repetition Across Contexts

The same word appears multiple times:

1. object tray in scene builder;
2. placement instruction;
3. feedback sentence;
4. race instruction;
5. reward summary.

Example:

```text
Scene builder: Zet de boot op het water.
Feedback: De boot vaart op het water.
Race: Vlieg boven de boot.
Result: Je oefende boot en boven.
```

### Spatial Reinforcement

The race turns spatial concepts into movement:

- onder = fly lower;
- boven = fly higher;
- links = move left side;
- rechts = move right side;
- tussen = pass between two objects;
- naast = collect item close to another object.

### Vocabulary Reinforcement

The child must identify objects quickly:

- vliegtuig;
- vuurtoren;
- boot;
- bal;
- schelpen;
- krab;
- parasol;
- zandkasteel.

The visual object always matches the sticker from the scene builder.

## Example Race Instruction Set

| Id | Instruction | Target object(s) | Concept | Race action |
| --- | --- | --- | --- | --- |
| `race-001` | Vlieg onder het vliegtuig door. | vliegtuig | onder | fly lower than airplane |
| `race-002` | Ga links langs de vuurtoren. | vuurtoren | links | pass on left side |
| `race-003` | Spring over de bal. | bal | over/boven | jump |
| `race-004` | Pak de schelpen naast de boot. | schelpen, boot | naast | collect shells near boat |
| `race-005` | Vlieg tussen de parasol en het zandkasteel. | parasol, zandkasteel | tussen | pass gate between objects |
| `race-006` | Pak de dolfijnster in de zee. | dolfijnster, zee | in | collect sea star |
| `race-007` | Ga rechts langs de boot. | boot | rechts | pass right side |
| `race-008` | Vlieg boven de krab. | krab | boven | fly above crab |

## Race Completion

The race ends when:

- timer reaches 30 to 60 seconds;
- or all race instructions are completed.

MVP recommendation:

- 30 second timer;
- 5 race instructions;
- then reward screen.

## Data To Store

Per race instruction:

- instruction id;
- target object;
- spatial concept;
- correct action;
- mistake type if any;
- hint used;
- audio repeated;
- speed earned;
- stars collected;
- reaction time as observation.

Per race:

- duration;
- start speed;
- end speed;
- total stars;
- concepts practiced;
- words practiced;
- rewards unlocked.

## Implementation Notes

The race should be data-driven.

Each race instruction needs:

- id;
- audio text;
- target object ids;
- spatial concept;
- required lane or side;
- obstacle type;
- hint text;
- correct feedback;
- near-correct feedback;
- speed reward.

The race should reuse scene-builder assets and object ids whenever possible.
