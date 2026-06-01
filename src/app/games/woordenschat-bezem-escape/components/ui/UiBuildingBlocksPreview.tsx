import { ArrowLeft, Check, ChevronRight, Settings, Volume2 } from "lucide-react";
import { useDutchSpeechRecognition } from "../../hooks/useDutchSpeechRecognition";
import { HintButton } from "./HintButton";
import { HudIconButton } from "./HudIconButton";
import { ObjectStickerButton } from "./ObjectStickerButton";
import { PanelCard } from "./PanelCard";
import { PrimaryActionButton } from "./PrimaryActionButton";
import { ProgressBar } from "./ProgressBar";
import { RibbonTitle } from "./RibbonTitle";
import { StarCounter } from "./StarCounter";
import { VoiceCommandButton } from "./VoiceCommandButton";
import { VoiceCommandStatus } from "./VoiceCommandStatus";

const previewStickerUrl = new URL(
  "../../assets/objects/transparent/sailboat-sticker.png",
  import.meta.url,
).href;

const VoiceRecognitionPreviewPanel = () => {
  const {
    errorMessage,
    startListening,
    status,
    stopListening,
    support,
    supportMessage,
    transcript,
  } = useDutchSpeechRecognition();

  return (
    <PanelCard className="landscape:p-2">
      <div className="flex flex-col gap-3" data-component="VoiceRecognitionPreviewPanel">
        <VoiceCommandButton
          isSupported={support.isSupported}
          onStartListening={startListening}
          onStopListening={stopListening}
          status={status}
        />
        <VoiceCommandStatus
          errorMessage={errorMessage}
          exampleText="Zet de boot in de zee."
          isSupported={support.isSupported}
          status={status}
          supportMessage={supportMessage}
          transcript={transcript}
        />
      </div>
    </PanelCard>
  );
};

VoiceRecognitionPreviewPanel.displayName = "VoiceRecognitionPreviewPanel";

export const UiBuildingBlocksPreview = () => (
  <div
    className="absolute inset-0 z-10 overflow-y-auto bg-sky-100/85 p-4 text-slate-900 backdrop-blur-[2px] landscape:p-2"
    data-component="UiBuildingBlocksPreview"
    data-testid="ui-building-blocks-preview"
  >
    <div
      className="mx-auto flex w-full max-w-sm flex-col gap-4 landscape:max-w-3xl landscape:gap-2"
      data-slot="content"
    >
      <div className="flex justify-center" data-slot="title">
        <RibbonTitle className="landscape:min-h-10 landscape:py-1">UI bouwstenen</RibbonTitle>
      </div>

      <div className="grid gap-4 landscape:grid-cols-2 landscape:gap-2" data-slot="preview-grid">
        <PanelCard className="landscape:p-2">
          <div className="flex flex-wrap items-center gap-2">
            <HudIconButton
              icon={<Volume2 className="h-5 w-5" strokeWidth={3} />}
              label="Audio"
              showLabel
              tone="blue"
            />
            <HintButton />
            <HudIconButton
              icon={<ArrowLeft className="h-5 w-5" strokeWidth={3} />}
              label="Terug"
              tone="white"
            />
            <HudIconButton
              icon={<Settings className="h-5 w-5" strokeWidth={3} />}
              label="Ouder"
              tone="green"
            />
            <StarCounter value={18} />
          </div>
        </PanelCard>

        <PanelCard className="landscape:p-2">
          <div className="flex flex-col gap-3">
            <ProgressBar label="Speed" max={10} value={6} />
            <ProgressBar label="Woorden" max={12} tone="purple" value={4} />
          </div>
        </PanelCard>

        <PanelCard className="landscape:p-2">
          <div className="flex items-center gap-3">
            <ObjectStickerButton imageUrl={previewStickerUrl} label="Boot" selected />
            <ObjectStickerButton imageUrl={previewStickerUrl} label="Boot" showLabel={false} />
          </div>
        </PanelCard>

        <PanelCard className="landscape:p-2">
          <div className="flex flex-col gap-3">
            <PrimaryActionButton
              iconLeft={<Check className="h-5 w-5" strokeWidth={3} />}
              iconRight={<ChevronRight className="h-5 w-5" strokeWidth={3} />}
            >
              Volgende
            </PrimaryActionButton>
            <PrimaryActionButton className="w-full">Speel race</PrimaryActionButton>
          </div>
        </PanelCard>

        <VoiceRecognitionPreviewPanel />
      </div>
    </div>
  </div>
);

UiBuildingBlocksPreview.displayName = "UiBuildingBlocksPreview";
