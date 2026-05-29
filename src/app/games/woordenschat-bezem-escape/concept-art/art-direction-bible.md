# Art Direction Bible

## Project

**Game:** +1 Woordenschat Bezem Escape
**Visual style:** 2D digital sticker style
**Core inspiration:** paper cut-out speech therapy scene games
**Platform:** mobile-first, portrait and landscape
**Audience:** preschool and young primary school children

This art direction bible defines the visual rules for all game assets in `+1 Woordenschat Bezem Escape`.

The game world should feel like a digital paper scene board with movable cut-out objects. The child should immediately understand what can be touched, moved, placed, collected or avoided.

## Core Art Direction

The visual style is:

- 2D digital sticker style;
- inspired by paper cut-out scene boards;
- soft pastel colors;
- thick rounded outlines;
- white sticker borders around movable objects;
- clear readable shapes for preschool children;
- friendly, calm and playful;
- warm and safe;
- low-detail and uncluttered;
- suitable for vocabulary learning on mobile screens.

## Fixed Image Style Prompt

Use this exact base prompt for generated image assets:

```text
2D digital sticker illustration for a mobile educational children's game, paper cut-out style, thick rounded black outline, soft pastel colors, simple readable shapes, white sticker border, child-friendly, clean design, high contrast, preschool learning game style, no text, no watermark, no logo, no photorealism, no scary details, centered composition
```

Object-specific descriptions should be added before this base prompt, but the base style wording must stay consistent.

## Do Not Copy

Do not copy:

- Roblox characters, UI, worlds, proportions or branding;
- official speech therapy test materials;
- official CELF Preschool or PPVT/Peabody items;
- copyrighted educational card sets;
- stock-looking generic game art without a consistent style.

All assets must be original and child-friendly.

## Artwork Text Rule

Do not include text inside the artwork.

Reason:

- game text must stay editable in UI;
- assets may be reused in multiple languages;
- preschool children should identify objects by shape and audio, not by written labels;
- text inside images becomes unreadable on small mobile screens.

Allowed:

- text labels in UI components outside the artwork;
- accessible names in code;
- document descriptions.

Not allowed:

- words printed on object stickers;
- signs with readable words in the scene;
- letters/numbers embedded in artwork unless the game mode specifically trains letters or numbers later.

## Color Palette

### Global Palette

Use soft, warm, low-stress colors.

| Role | Color | Hex |
| --- | --- | --- |
| Sky pastel | Light sky blue | `#BDEBFF` |
| Deep sky | Calm blue | `#7DCCF2` |
| Sea | Soft turquoise | `#63D5E8` |
| Deep sea | Gentle blue | `#3AAED8` |
| Sand | Warm sand | `#F7D889` |
| Warm highlight | Soft peach | `#FFCBA8` |
| Grass/island | Mint green | `#8BE0A4` |
| Positive action | Friendly green | `#16A875` |
| Magic accent | Soft violet | `#A78BFA` |
| Reward accent | Warm yellow | `#FFD84D` |
| UI panel | Warm white | `#FFF9EA` |
| Sticker border | White | `#FFFFFF` |
| Outline dark | Soft navy | `#243B53` |
| Shadow | Transparent blue-gray | `rgba(36, 59, 83, 0.18)` |

### Palette Rules

- Use pastel fills as the default.
- Use high contrast only for interaction states.
- Keep the background softer than the movable objects.
- Object stickers must stand out against the scene.
- Avoid harsh red for mistakes.
- Avoid black outlines; use soft navy or deep muted color.
- Avoid dominant purple as the whole screen theme; use it for magic and rewards only.

## Line Style

### Object Lines

Objects use thick, rounded outlines.

Rules:

- outline width should feel chunky and soft;
- corners are rounded;
- no sharp aggressive points unless the object requires it;
- outline color is usually soft navy or darker version of fill;
- detail lines are fewer and thinner than the outer outline.

### UI Lines

UI follows the existing Game Wereld app style:

- strong rounded borders;
- clear active states;
- high touch readability;
- no random line styles.

### Sticker Border

Movable objects have a white sticker border around the object.

Rules:

- sticker border must be visible on both bright and dark backgrounds;
- border is thicker than internal detail lines;
- border shape follows the silhouette of the object;
- subtle drop shadow may be used to show that the object is movable.

## Character Style

### Main Character: Magic Broom

The magic broom is the central character and progress object.

Visual personality:

- friendly;
- energetic but calm;
- magical but not scary;
- simple enough to read at small size;
- slightly rounded and soft;
- expressive through motion, not face detail.

Design features:

- rounded broom handle;
- soft bristle shape;
- small magic glow or trail;
- optional ribbon or star charm;
- clear silhouette.

Avoid:

- realistic witch broom;
- dark spooky fantasy;
- angry face;
- complex patterns;
- copy of existing game brooms.

### Optional Helper Character Later

A helper character can be added later, but is not required for MVP.

If used:

- should be small and supportive;
- should not distract from vocabulary objects;
- should use the same sticker style;
- should not speak through long text bubbles.

## Object Style

### Purpose

Objects are learning targets. They must be more readable than decorative scene elements.

### Object Rules

Each object must:

- have a clear silhouette;
- be recognizable at small mobile size;
- use simple shapes;
- have a white sticker border;
- have a soft shadow;
- avoid tiny details;
- avoid visual clutter;
- be original and not copied from test materials.

### Detail Level

Use:

- one main shape;
- one to three supporting details;
- simple color blocks;
- rounded forms.

Avoid:

- realistic textures;
- noisy patterns;
- tiny facial details;
- detailed line hatching;
- complex shadows;
- text on objects.

### Object States

Objects need consistent states:

- default sticker;
- selected sticker;
- correct placement;
- hint/pulse;
- disabled/used;
- race collectible or obstacle.

State rules:

- selected: cyan glow or border;
- hint: soft pulsing highlight;
- correct: green sparkle or bounce;
- incorrect: no red X; use gentle nudge and hint;
- used: slightly settled into scene but still readable.

## Background Style

### Paper Scene Board Feel

The background should feel like a scene board:

- broad simple layers;
- clear zones;
- soft paper-like shapes;
- low detail;
- no photorealism;
- no clutter.

### Background Rules

- Background is less saturated than objects.
- Interaction zones should be visually clear when active.
- Decorative items should not compete with vocabulary objects.
- Avoid busy texture.
- Use large readable shapes.
- Keep enough empty space for moving objects.

### Zone Highlights

Target zones use:

- soft dashed outline;
- gentle glow;
- translucent fill;
- color linked to active instruction.

Avoid:

- harsh red;
- flashing;
- strong patterns;
- full-screen overlays.

## UI Button Style

UI must follow the existing Game Wereld app style, not a random art style.

### General Rules

- rounded rectangular buttons;
- thick borders;
- strong active state;
- minimum 44px touch target;
- icon plus short label where useful;
- no tiny text;
- no text overflow;
- no random one-off colors.

### Primary Button

Use for:

- Start;
- Ik heb het gedaan;
- Volgende;
- Start Race.

Style:

- friendly green or cyan;
- thick border;
- white text;
- icon plus label;
- high contrast.

### Secondary Buttons

Use for:

- Audio;
- Hint;
- Reset;
- Hulp;
- Terug.

Color mapping:

- Audio: cyan;
- Hint: warm yellow;
- Hulp: cyan/blue;
- Reset: neutral light panel;
- Reward: violet/yellow accent.

### Tabs

Tabs for MVP:

- Plaats;
- Kies;
- Race.

Rules:

- active tab is filled;
- inactive tabs are lighter;
- labels are short on mobile;
- no more than three tabs in MVP.

## Reward Animation Style

Reward animations should be short, soft and satisfying.

### Allowed Effects

- small star burst;
- sticker pop-in;
- gentle bounce;
- soft glow;
- short magic trail;
- speed badge count-up;
- sticker placed in collection.

### Timing

- micro feedback: 200-400ms;
- reward reveal: 600-1200ms;
- no long blocking animation during learning flow.

### Avoid

- screen-shaking failure effects;
- aggressive flashing;
- loud visual clutter;
- confetti covering the learning object;
- animations that make text unreadable.

## Consistency Rules

All visual assets must follow these rules:

1. Use the same sticker border style.
2. Use the same rounded outline language.
3. Use the same pastel palette family.
4. Keep object detail level consistent.
5. Keep shadows soft and similar.
6. Keep all vocabulary objects readable at small sizes.
7. Do not include text inside artwork.
8. Do not mix 3D, realistic, pixel art or flat icon styles with the sticker style.
9. UI components must follow Game Wereld app style.
10. New worlds must reuse the same art grammar.

## Beach World Examples

### Scene

Beach world includes:

- pastel blue sky;
- calm turquoise sea;
- warm sand;
- small mint island;
- soft sun shape;
- simple horizon line;
- enough empty placement space.

### Objects

| Object | Art Direction |
| --- | --- |
| Dolphin | Rounded blue dolphin sticker, simple curve, friendly shape, no tiny face detail. |
| Boat | Small sailboat sticker, simple sail triangle, warm accent color. |
| Lighthouse | Rounded lighthouse shape, simple stripes, no text or numbers. |
| Airplane | Soft rounded toy-like plane, not realistic, readable silhouette. |
| Kite | Diamond kite with simple tail, different from airplane silhouette. |
| Ball | Simple beach ball or play ball, two to three color sections max. |
| Parasol | Rounded umbrella canopy, thick outline, simple pole. |
| Shell | Rounded shell with two or three curved detail lines. |
| Crab | Friendly crab, rounded claws, simple eyes optional, no scary details. |
| Sandcastle | Soft blocky castle shape, rounded towers, no flags with text. |

### Beach Target Zones

- Sea zone: translucent blue highlight.
- Sand zone: warm yellow glow.
- Sky zone: soft cyan glow.
- Island zone: mint green outline.
- Under parasol: soft shadow highlight.
- Next to object: side glow, not a sharp arrow.

## Future World Examples

### Farm World

Scene:

- pastel field;
- simple barn;
- fence;
- sky;
- soft path.

Objects:

- cow;
- sheep;
- chicken;
- tractor;
- hay bale;
- apple tree;
- bucket;
- farmer hat.

Visual rules:

- animals are rounded and friendly;
- farm tools are simplified;
- no realistic dirt or clutter;
- barn has no readable text.

### Zoo World

Scene:

- gentle paths;
- simple habitat areas;
- trees;
- water area;
- safe enclosure shapes.

Objects:

- lion;
- elephant;
- giraffe;
- monkey;
- penguin;
- zookeeper hat;
- food bucket.

Visual rules:

- animals are friendly, not scary;
- habitats are clear but not cage-heavy;
- avoid visual overcrowding.

### Playground World

Scene:

- soft ground;
- slide;
- swing;
- sandbox;
- climbing frame.

Objects:

- ball;
- bucket;
- shovel;
- kite;
- teddy;
- scooter;
- jump rope.

Visual rules:

- objects should feel safe and soft;
- avoid sharp metal details;
- use warm, playful colors.

### School World

Scene:

- classroom board without readable text;
- desk;
- shelf;
- window;
- rug.

Objects:

- book;
- pencil;
- backpack;
- chair;
- clock;
- lunchbox;
- glue stick.

Visual rules:

- no text on books or board;
- classroom is calm, not cluttered;
- school items are clear vocabulary targets.

### Space World

Scene:

- soft dark blue or lavender sky;
- simple planets;
- moon ground;
- stars as subtle decoration.

Objects:

- rocket;
- astronaut helmet;
- planet;
- star;
- moon rock;
- satellite;
- comet.

Visual rules:

- keep space warm and safe;
- avoid scary darkness;
- use soft glow effects;
- keep objects sticker-like with white borders.

## Asset Checklist

Before an asset is approved:

- [ ] It has a clear preschool-readable silhouette.
- [ ] It uses pastel colors.
- [ ] It has a rounded outline.
- [ ] It has a white sticker border if movable.
- [ ] It contains no text.
- [ ] It is original.
- [ ] It is not copied from Roblox.
- [ ] It is not copied from official speech therapy materials.
- [ ] It is readable on mobile.
- [ ] It matches the rest of the asset set.
