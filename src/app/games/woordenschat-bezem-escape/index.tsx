import { useState } from "react";
import { useNavigate } from "react-router";
import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";
import {
  GameMenuScreen,
  ParentDashboardScreen,
  RaceScreen,
  RewardScreen,
  SceneBuilderScreen,
  WordChoiceScreen,
} from "./screens";
import type {
  BroomRaceInstruction,
  SceneBuilderInstruction,
  VocabularyChoiceInstruction,
} from "./types";

type GameScreenPreview = "dashboard" | "menu" | "race" | "reward" | "scene-builder" | "word-choice";

const RACE_STATE_STORAGE_KEY = "woordenschat-bezem-escape:race-state";
const RACE_RESULT_STORAGE_KEY = "woordenschat-bezem-escape:race-result";

function shouldShowUiPreview() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("preview") === "ui";
}

function getInstructionPreviewText() {
  const longInstruction = "Zet de boot in het water en leg daarna de bal naast de parasol.";

  if (typeof window === "undefined") {
    return undefined;
  }

  const instructionPreview = new URLSearchParams(window.location.search).get("instructionPreview");

  if (instructionPreview === "long") {
    return longInstruction;
  }

  return undefined;
}

function shouldShowTrayLabels() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("trayLabels") === "true";
}

function getScreenPreview(): GameScreenPreview {
  if (typeof window === "undefined") {
    return "menu";
  }

  const screen = new URLSearchParams(window.location.search).get("screen");

  if (screen === "word-choice") {
    return "word-choice";
  }

  if (screen === "race") {
    return "race";
  }

  if (screen === "reward") {
    return "reward";
  }

  if (screen === "dashboard") {
    return "dashboard";
  }

  if (screen === "menu") {
    return "menu";
  }

  return "menu";
}

function getSceneBuilderInstructions() {
  const instructions = beachWorld.instructions.filter(
    (item): item is SceneBuilderInstruction => item.mode === "listen-and-place",
  );

  if (instructions.length === 0) {
    throw new Error("Woordenschat Bezem Escape mist een scene-builder opdracht.");
  }

  return instructions;
}

const sceneBuilderInstructions = getSceneBuilderInstructions();

function getVocabularyChoiceInstructions() {
  const instructions = beachWorld.instructions.filter(
    (item): item is VocabularyChoiceInstruction => item.mode === "choose-word",
  );

  if (instructions.length === 0) {
    throw new Error("Woordenschat Bezem Escape mist woordkeuze-opdrachten.");
  }

  return instructions;
}

const wordChoiceInstructions = getVocabularyChoiceInstructions();

function getBroomRaceInstructions() {
  const instructions = beachWorld.instructions.filter(
    (item): item is BroomRaceInstruction => item.mode === "broom-escape-run",
  );

  if (instructions.length === 0) {
    throw new Error("Woordenschat Bezem Escape mist race-opdrachten.");
  }

  return instructions;
}

const raceInstructions = getBroomRaceInstructions();

function hasSavedRaceState() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.sessionStorage.getItem(RACE_STATE_STORAGE_KEY));
}

export function WoordenschatBezemEscapeGame() {
  const navigate = useNavigate();
  const showUiPreview = shouldShowUiPreview();
  const instructionText = getInstructionPreviewText();
  const showTrayLabels = shouldShowTrayLabels();
  const [screenPreview, setScreenPreview] = useState<GameScreenPreview>(() => getScreenPreview());
  const [raceUnlocked, setRaceUnlocked] = useState(() => hasSavedRaceState());

  function resetRound() {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(RACE_RESULT_STORAGE_KEY);
    }

    setScreenPreview("scene-builder");
  }

  function openMenu() {
    setRaceUnlocked(hasSavedRaceState());
    setScreenPreview("menu");
  }

  return (
    <BezemEscapeShell world={beachWorld}>
      <BeachBackground
        landscapeUrl={beachBackgrounds.landscape}
        portraitUrl={beachBackgrounds.portrait}
      />
      {showUiPreview ? (
        <UiBuildingBlocksPreview />
      ) : (
        <>
          {screenPreview === "reward" ? (
            <RewardScreen
              onBackToMenu={() => navigate("/games/language")}
              onChooseWorld={openMenu}
              onPlayAgain={resetRound}
            />
          ) : screenPreview === "dashboard" ? (
            <ParentDashboardScreen onBackToMenu={openMenu} />
          ) : screenPreview === "menu" ? (
            <GameMenuScreen
              raceUnlocked={raceUnlocked}
              onOpenDashboard={() => setScreenPreview("dashboard")}
              onOpenRewards={() => setScreenPreview("reward")}
              onOpenSettings={() => navigate("/settings")}
              onStartRace={() => {
                if (raceUnlocked) {
                  setScreenPreview("race");
                }
              }}
              onStartSceneBuilder={() => setScreenPreview("scene-builder")}
              onStartWordChoice={() => setScreenPreview("word-choice")}
            />
          ) : screenPreview === "race" ? (
            <RaceScreen
              instructions={raceInstructions}
              objects={beachWorld.objects}
              onShowReward={() => setScreenPreview("reward")}
            />
          ) : screenPreview === "word-choice" ? (
            <WordChoiceScreen instructions={wordChoiceInstructions} objects={beachWorld.objects} />
          ) : (
            <SceneBuilderScreen
              instructions={sceneBuilderInstructions}
              instructionText={instructionText}
              objects={beachWorld.objects}
              onStartRace={() => {
                setRaceUnlocked(true);
                setScreenPreview("race");
              }}
              zones={beachWorld.zones}
              showTrayLabels={showTrayLabels}
            />
          )}
        </>
      )}
    </BezemEscapeShell>
  );
}
