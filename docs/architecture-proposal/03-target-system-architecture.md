# 📐 Chapter 3: Target System Architecture

## 3.1 High-Level Architecture Overview

We propose a **Clean Layered Architecture** with strict dependency boundaries. Dependencies must always point inwards, from presentation and outer framework adapters towards core domain models and shared platform utilities.

```mermaid
graph TD
    subgraph Layer 1: App Shell & Routing
        AS[React Router Shell] --> SC[Screen Containers]
    end

    subgraph Layer 2: Domain & Application Services
        PS[Profile Domain Service]
        AS_ENG[Analytics Engine]
        GM[Game Lifecycle Manager]
    end

    subgraph Layer 3: Platform Layer (game-platform)
        GP_UI[Game Primitives & Layouts]
        GP_INP[Pointer Physics & Touch Handlers]
        GP_STO[Storage Adapter Interface]
        GP_SP[Speech & Audio Engine]
    end

    subgraph Layer 4: Game Plugins (src/app/games/*)
        G1[Strand Bezem Escape]
        G2[Reken Eiland]
        G3[Vormen Bos]
    end

    SC --> PS
    SC --> GM
    GM --> G1
    GM --> G2
    GM --> G3
    G1 --> GP_UI
    G1 --> GP_INP
    G1 --> GP_SP
    PS --> GP_STO
    AS_ENG --> GP_STO
```

---

## 3.2 Layer Responsibilities & Boundaries

### 1. App Shell (`src/app/App.tsx`, `Root.tsx`, `routes.tsx`, `screens/`)
* **Role**: Route management, authentication/profile guards, global layout frame, app navigation.
* **Rules**:
  - Must not import internal logic, state, or assets from specific game subfolders.
  - Interacts with games exclusively via the `GamePlayScreen` launcher and `IGamePlugin` registry.

### 2. Platform Layer (`src/app/game-platform/`)
* **Role**: The foundational framework shared across all mini-games.
* **Sub-Modules**:
  - `components/primitives`: High-quality, accessible UI elements (`GameButton`, `GamePanel`, `GameStarCounter`, `GameProgressBar`).
  - `components/layout`: Mobile-first responsive containers (`GameShell`, `GameSafeArea`, `GameStage`, `GameTopHud`).
  - `components/gameplay`: Common gameplay components (`InstructionBubble`, `AudioButton`, `HintButton`, `ObjectTray`).
  - `storage/`: Platform storage interfaces and implementations (`IStorageAdapter`, `BrowserGameStorage`).
  - `speech/`: Speech synthesis and recognition integration.
  - `progress/`: Practice event types and analytics calculators.

### 3. Game Domain Packages (`src/app/games/<game-id>/`)
* **Role**: Fully isolated, self-contained educational micro-games.
* **Internal Structure**:
  - `game.config.ts`: Metadata, theme, age range, capabilities.
  - `index.tsx`: Main game component export conforming to `IGamePlugin`.
  - `assets/`: Self-contained images, audio, video manifests.
  - `content/`: Pedagogical task definitions and world mappings.
  - `screens/`: Game-specific screens (Start, Gameplay, Reward).
  - `components/`: Specialized gameplay presentation elements.
  - `hooks/`: Focused custom hooks (< 250 lines each).
  - `logic/`: Framework-agnostic pure functions.

---

## 3.3 Strict Universal Module Constraints (Max 250 Lines)

To maintain exceptional code readability and eliminate maintainability traps:

1. **250 Lines File Cap**: No file (`.tsx` or `.ts`) in `src/app/` may exceed 250 lines.
2. **Decomposition Strategy**:
   - **Render Components**: Extract sub-components into `components/` subfolders.
   - **Custom Hooks**: Split composite state into domain-focused sub-hooks (`useScenePlacementHandlers`, `useSceneHintHandlers`, etc.).
   - **Logic Helpers**: Extract pure TypeScript math, parsers, and formatters into `logic/` helper files.
3. **Co-location**: Keep sub-components, hooks, and helpers co-located in the same feature folder where they are consumed.
