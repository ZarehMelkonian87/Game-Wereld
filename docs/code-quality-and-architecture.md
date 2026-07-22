# 🏗️ Code Quality & Architecture Requirements

This document defines the architectural standards, code quality guidelines, and structural patterns for the **Game-Wereld** codebase. Every developer and AI assistant working on this project must strictly adhere to these rules to maintain high code readability, modularity, performance, and long-term maintainability.

---

## 1. 🎯 Core Architectural Principles

### 1.1 Component & Hook Size Limit (Max 250 Lines Rule)
- **Strict Universal Limit**: No single file—whether a UI component (`.tsx`), custom hook (`.ts`), or utility module (`.ts`)—should exceed **250 lines of code**.
- **Refactoring Requirement**: When any file approaches or exceeds 250 lines, it **must** be decomposed into smaller, single-responsibility sub-components, modular sub-hooks, or pure logic helpers.
- **Hook Decomposition Rule**: Large composite hooks must be broken down by domain responsibility (e.g., separating point dragging, panel docking, hint handling, and spoken command execution into dedicated sub-hooks).
- **Logical Co-location**: Feature-specific sub-components, hooks, and helpers should be placed in dedicated `components/`, `hooks/`, and `logic/` subfolders co-located next to the feature module.

### 1.2 Separation of Concerns
Every module in the codebase must have a single, well-defined responsibility:
1. **Render Components**: Responsible **only** for JSX markup, layout, and visual presentation.
2. **Custom Hooks**: Responsible **only** for state management, side-effects, event subscriptions, and lifecycle orchestration.
3. **Logic & Utilities**: Pure, deterministic TypeScript functions responsible for domain rules, math calculations, and data transformations.

---

## 2. 📂 Project Folder Structure & Module Boundaries

Organize code cleanly by layer and domain scope:

```
src/app/
├── components/           # Generic, cross-game UI presentation components (Buttons, Modals, Cards)
├── hooks/                # Global React hooks (screen orientation, profile state, settings)
├── logic/                # Global pure utilities & domain logic (math, calculations, formatters)
├── types/                # Project-wide TypeScript types and interfaces
└── games/
    └── [game-name]/
        ├── components/   # Shared UI components specific to this game
        ├── hooks/        # Custom React hooks specific to this game
        ├── logic/        # Pure domain rules, collision detection, score calculation
        ├── content.ts    # Static game instructions and asset mappings
        └── screens/      # Screen containers (e.g. SceneBuilderScreen, StartScreen)
            └── [screen-name]/
                ├── components/   # Sub-components specific to this screen (< 250 lines each)
                ├── hooks/        # Hooks specific to this screen
                └── logic/        # Screen-specific calculation helpers
```

---

## 3. 🧱 Detailed Layer Guidelines

### 3.1 Render Components (`components/`, `screens/`)
- **Pure Presentation**: Render components must be lightweight and focused on UI layout and visual styling.
- **No Complex Inline Logic**: Move heavy data transformations, complex state derivations, or pointer physics out of the render function into custom hooks or utility functions.
- **Modular Composition**: Assemble complex views using small, declarative sub-components (e.g. `<TopBar />`, `<InstructionCard />`, `<ObjectCarousel />`, `<TargetZoneHint />`).
- **Touch-Friendly & Accessible**: All interactive buttons must have explicit `type="button"`, descriptive `aria-label` attributes, and minimum 40x40px hit areas for mobile/touch usability.

### 3.2 Custom Hooks (`hooks/`)
- **Encapsulated State**: Move state hooks (`useState`, `useReducer`), refs (`useRef`), and side-effects (`useEffect`) into reusable custom hooks (e.g. `useZoneEditorState`, `useInstructionVideoPlayback`, `usePointerDragTracking`).
- **Clean API**: Return clean, strongly-typed objects or tuples from custom hooks.
- **No JSX**: Custom hooks must not return JSX elements; they manage data and actions only.

### 3.3 Utility & Domain Logic (`logic/`)
- **Framework-Agnostic**: Functions in `logic/` must be pure TypeScript without React dependencies (`useState`, `useEffect`, JSX).
- **Deterministic & Testable**: Polygon centroid math, bounding box intersections, and reward calculations belong in `logic/`.
- **Pure Functions**: Avoid mutating input objects or global variables.

---

## 4. 🧼 Code Readability & Maintainability Standards

### 4.1 Strict Typing
- **No `any`**: Always define explicit TypeScript interfaces or types for props, state, and function parameters.
- **Exported Signatures**: All exported functions and hooks must specify explicit return types.

### 4.2 Naming Conventions
- **Components & Interfaces**: `PascalCase` (`SceneZoneDevTools`, `BeachBackground`, `SceneZone`).
- **Custom Hooks**: `camelCase` starting with `use` (`useZoneEditor`, `useSpeechRecognition`).
- **Utilities & Variables**: `camelCase` (`getZoneCenter`, `parseSimplePolygonPath`).
- **Constants**: `UPPER_SNAKE_CASE` (`GAME_FOREGROUND_AUDIO_VOLUME`).

### 4.3 Error Handling & Robustness
- **No Swallowed Errors**: Catch blocks must log meaningful context or report to user-facing feedback handlers.
- **Defensive Property Access**: Always verify object initialization and use optional chaining (`?.`) / nullish coalescing (`??`) to prevent runtime crashes (`ReferenceError`, `TypeError`).

---

## 5. 📐 Quality Assurance & Code Review Checklist

Before committing code or completing a task, verify the following:
- [ ] **Line Count**: Is any single component file over 250 lines? If so, refactor into sub-components or custom hooks.
- [ ] **Responsibility**: Does the render component contain complex inline logic or heavy effects? If so, extract into a custom hook or utility.
- [ ] **Mobile Responsiveness**: Are touch targets at least 40x40px, and are control panels collapsible/movable?
- [ ] **TypeScript**: Does `npm run build` complete with zero errors or type warnings?
