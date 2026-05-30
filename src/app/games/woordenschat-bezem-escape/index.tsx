import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell, TopHud, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";
import { RaceScreen, RewardScreen, SceneBuilderScreen, WordChoiceScreen } from "./screens";
import type { SceneBuilderInstruction } from "./types";

type GameScreenPreview = "race" | "reward" | "scene-builder" | "word-choice";

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
    return "scene-builder";
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

  return "scene-builder";
}

function getFirstSceneBuilderInstruction() {
  const instruction = beachWorld.instructions.find(
    (item): item is SceneBuilderInstruction => item.mode === "listen-and-place",
  );

  if (!instruction) {
    throw new Error("Woordenschat Bezem Escape mist een scene-builder opdracht.");
  }

  return instruction;
}

const firstSceneBuilderInstruction = getFirstSceneBuilderInstruction();

export function WoordenschatBezemEscapeGame() {
  const showUiPreview = shouldShowUiPreview();
  const instructionText = getInstructionPreviewText();
  const showTrayLabels = shouldShowTrayLabels();
  const screenPreview = getScreenPreview();

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
            <RewardScreen />
          ) : screenPreview === "race" ? (
            <RaceScreen />
          ) : screenPreview === "word-choice" ? (
            <WordChoiceScreen />
          ) : (
            <SceneBuilderScreen
              instruction={firstSceneBuilderInstruction}
              instructionText={instructionText}
              objects={beachWorld.objects}
              showTrayLabels={showTrayLabels}
            />
          )}
          <TopHud
            showHint={screenPreview !== "reward"}
            showParentBack={screenPreview === "scene-builder"}
            starCount={0}
          />
        </>
      )}
    </BezemEscapeShell>
  );
}
