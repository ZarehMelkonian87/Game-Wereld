import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  MapPin,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
  Zap,
} from "lucide-react";
import { beachWorld } from "./content";
import type { BezemEscapeMode, SceneObject, SceneZone } from "./types";

const modeOptions: Array<{
  id: BezemEscapeMode;
  label: string;
  shortLabel: string;
}> = [
  {
    id: "listen-and-place",
    label: "Luister & Plaats",
    shortLabel: "Plaats",
  },
  {
    id: "choose-word",
    label: "Kies het Woord",
    shortLabel: "Kies",
  },
  {
    id: "broom-escape-run",
    label: "Bezem Escape-run",
    shortLabel: "Race",
  },
];

const objectPositions: Record<string, { x: number; y: number }> = {
  dolfijn: { x: 20, y: 50 },
  boot: { x: 42, y: 52 },
  vuurtoren: { x: 78, y: 36 },
  vliegtuig: { x: 66, y: 18 },
  vlieger: { x: 24, y: 15 },
  bal: { x: 38, y: 78 },
  parasol: { x: 58, y: 72 },
  schelp: { x: 24, y: 82 },
  krab: { x: 74, y: 82 },
  zandkasteel: { x: 50, y: 84 },
  handdoek: { x: 70, y: 78 },
  zon: { x: 12, y: 14 },
};

function getZoneStyle(zone: SceneZone) {
  return {
    left: `${zone.x}%`,
    top: `${zone.y}%`,
    width: `${zone.width}%`,
    height: `${zone.height}%`,
  };
}

function getObjectPosition(object: SceneObject) {
  return objectPositions[object.id] ?? { x: 50, y: 50 };
}

export function WoordenschatBezemEscapeGame() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<BezemEscapeMode>("listen-and-place");
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [selectedObjectId, setSelectedObjectId] = useState("dolfijn");

  const modeInstructions = useMemo(
    () => beachWorld.instructions.filter((instruction) => instruction.mode === selectedMode),
    [selectedMode],
  );

  const currentInstruction = modeInstructions[instructionIndex % modeInstructions.length];
  const targetObject = beachWorld.objects.find((object) => object.id === currentInstruction.targetObjectIds[0]);
  const selectedObject = beachWorld.objects.find((object) => object.id === selectedObjectId);
  const targetZone = beachWorld.zones.find((zone) => zone.id === currentInstruction.targetZoneIds[0]);
  const answerObjects = currentInstruction.answerOptions?.length
    ? beachWorld.objects.filter((object) => currentInstruction.answerOptions?.includes(object.id))
    : beachWorld.objects;

  const handleModeChange = (mode: BezemEscapeMode) => {
    setSelectedMode(mode);
    setInstructionIndex(0);
    const firstInstruction = beachWorld.instructions.find((instruction) => instruction.mode === mode);

    if (firstInstruction?.targetObjectIds[0]) {
      setSelectedObjectId(firstInstruction.targetObjectIds[0]);
    }
  };

  const handleNextInstruction = () => {
    const nextIndex = (instructionIndex + 1) % modeInstructions.length;
    const nextInstruction = modeInstructions[nextIndex];

    setInstructionIndex(nextIndex);

    if (nextInstruction.targetObjectIds[0]) {
      setSelectedObjectId(nextInstruction.targetObjectIds[0]);
    }
  };

  return (
    <main
      data-testid="woordenschat-bezem-layout"
      className="min-h-screen safe-area-inset overflow-hidden bg-gradient-to-b from-sky-400 via-cyan-200 to-amber-200 text-slate-900"
    >
      <div className="flex min-h-screen flex-col">
        <header className="shrink-0 border-b-4 border-white/50 bg-white/80 px-3 py-2 shadow-lg backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/games/language")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-cyan-700 bg-cyan-600 text-white shadow active:bg-cyan-700"
              aria-label="Terug naar games"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase text-cyan-800">Strandwereld</p>
              <h1 className="truncate text-xl font-black leading-tight sm:text-2xl">
                +1 Woordenschat Bezem Escape
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-lg border-2 border-yellow-400 bg-yellow-100 px-2 py-1">
              <Zap className="h-5 w-5 fill-yellow-400 text-yellow-600" />
              <span className="text-lg font-black">3</span>
            </div>
          </div>
        </header>

        <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-2 p-2 landscape:grid landscape:grid-cols-[300px_minmax(0,1fr)] landscape:gap-1">
          <section className="flex shrink-0 flex-col gap-2 landscape:min-h-0 landscape:shrink landscape:gap-1 landscape:overflow-y-auto">
            <div className="grid grid-cols-3 gap-2">
              {modeOptions.map((mode) => {
                const isActive = selectedMode === mode.id;

                return (
                  <button
                    type="button"
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`min-h-12 rounded-lg border-2 px-2 py-2 text-center text-xs font-black shadow active:translate-y-0.5 sm:text-sm ${
                      isActive
                        ? "border-cyan-900 bg-cyan-700 text-white"
                        : "border-white/70 bg-white/80 text-slate-800"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="block sm:hidden">{mode.shortLabel}</span>
                    <span className="hidden sm:block">{mode.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-lg border-4 border-white/70 bg-white/90 p-3 shadow-lg">
              <div className="flex items-start gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                  <Volume2 className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase text-slate-500">Opdracht</p>
                  <p className="mt-1 text-lg font-black leading-snug">{currentInstruction.prompt}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="flex min-h-12 items-center justify-center gap-1 rounded-lg border-2 border-cyan-700 bg-cyan-600 px-2 text-sm font-black text-white active:bg-cyan-700"
                >
                  <Volume2 className="h-5 w-5" />
                  Audio
                </button>
                <button
                  type="button"
                  className="flex min-h-12 items-center justify-center gap-1 rounded-lg border-2 border-amber-500 bg-amber-300 px-2 text-sm font-black text-amber-950 active:bg-amber-400"
                >
                  <Lightbulb className="h-5 w-5" />
                  Hint
                </button>
                <button
                  type="button"
                  onClick={handleNextInstruction}
                  className="flex min-h-12 items-center justify-center gap-1 rounded-lg border-2 border-emerald-700 bg-emerald-600 px-2 text-sm font-black text-white active:bg-emerald-700"
                >
                  Volgende
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="hidden grid-cols-3 gap-2 landscape:grid">
              <div className="rounded-lg border-2 border-white/70 bg-white/85 p-2 text-center shadow">
                <Zap className="mx-auto h-5 w-5 text-yellow-600" />
                <p className="mt-1 text-xs font-black">Speed</p>
                <p className="text-xl font-black">+1</p>
              </div>
              <div className="rounded-lg border-2 border-white/70 bg-white/85 p-2 text-center shadow">
                <Star className="mx-auto h-5 w-5 fill-yellow-400 text-yellow-600" />
                <p className="mt-1 text-xs font-black">Ster</p>
                <p className="text-xl font-black">+1</p>
              </div>
              <div className="rounded-lg border-2 border-white/70 bg-white/85 p-2 text-center shadow">
                <Sparkles className="mx-auto h-5 w-5 text-fuchsia-600" />
                <p className="mt-1 text-xs font-black">Beloning</p>
                <p className="truncate text-sm font-black">Bezem</p>
              </div>
            </div>
          </section>

          <section className="flex min-h-0 flex-1 flex-col gap-2 landscape:gap-1">
            <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-lg border-4 border-white bg-sky-200 shadow-2xl sm:min-h-[270px] landscape:min-h-0">
              <div className="absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-sky-300 to-sky-100" />
              <div className="absolute left-5 top-5 h-14 w-14 rounded-full bg-yellow-300 shadow-[0_0_28px_rgba(250,204,21,0.75)]" />
              <div className="absolute inset-x-0 top-[40%] h-[30%] bg-gradient-to-b from-cyan-400 to-blue-500" />
              <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-b from-amber-200 to-amber-300" />
              <div className="absolute right-[8%] top-[39%] h-[13%] w-[25%] rounded-[50%] bg-emerald-300 shadow-lg" />

              {beachWorld.zones.map((zone) => {
                const isTarget = targetZone?.id === zone.id;

                return (
                  <div
                    key={zone.id}
                    className={`absolute rounded-lg border-2 ${
                      isTarget
                        ? "border-dashed border-fuchsia-700 bg-fuchsia-300/35"
                        : "border-transparent bg-transparent"
                    }`}
                    style={getZoneStyle(zone)}
                    aria-label={zone.label}
                  />
                );
              })}

              {beachWorld.objects.map((object) => {
                const position = getObjectPosition(object);
                const isTarget = targetObject?.id === object.id;
                const isSelected = selectedObject?.id === object.id;

                return (
                  <button
                    type="button"
                    key={object.id}
                    onClick={() => setSelectedObjectId(object.id)}
                    className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border-2 bg-white/85 text-2xl shadow-lg active:scale-95 sm:h-14 sm:w-14 sm:text-3xl ${
                      isSelected ? "border-cyan-800 ring-4 ring-cyan-300" : "border-white"
                    } ${isTarget ? "animate-pulse" : ""}`}
                    style={{ left: `${position.x}%`, top: `${position.y}%` }}
                    aria-label={object.label}
                  >
                    {object.emoji}
                  </button>
                );
              })}

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2 rounded-lg bg-white/85 px-3 py-2 shadow">
                  <MapPin className="h-5 w-5 shrink-0 text-cyan-700" />
                  <span className="truncate text-sm font-black">
                    Doel: {targetZone?.label ?? targetObject?.label ?? "kies"}
                  </span>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-purple-700 bg-purple-600 text-3xl shadow">
                  🧹
                </div>
              </div>
            </div>

            <div className="rounded-lg border-4 border-white/70 bg-white/90 p-2 shadow-lg">
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <p className="text-sm font-black">
                  {selectedMode === "choose-word" ? "Kies plaatje" : "Sleep of tik plaatje"}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedObjectId(currentInstruction.targetObjectIds[0] ?? "dolfijn")}
                  className="flex min-h-11 items-center gap-1 rounded-lg border-2 border-slate-300 bg-slate-100 px-3 text-xs font-black active:bg-slate-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 landscape:flex landscape:overflow-x-auto landscape:pb-1">
                {answerObjects.map((object) => {
                  const isSelected = selectedObjectId === object.id;

                  return (
                    <button
                      type="button"
                      key={object.id}
                      draggable
                      onClick={() => setSelectedObjectId(object.id)}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", object.id);
                        setSelectedObjectId(object.id);
                      }}
                      className={`flex min-h-14 flex-col items-center justify-center rounded-lg border-2 p-1 text-center shadow active:scale-95 sm:min-h-[64px] landscape:min-h-12 landscape:w-14 landscape:min-w-14 landscape:flex-none ${
                        isSelected
                          ? "border-cyan-800 bg-cyan-100"
                          : "border-amber-300 bg-amber-50"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className="text-2xl leading-none">{object.emoji}</span>
                      <span className="mt-1 max-w-full truncate text-[11px] font-black">
                        {object.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2">
              <button
                type="button"
                className="flex min-h-14 items-center justify-center gap-2 rounded-lg border-4 border-emerald-800 bg-emerald-600 px-3 text-lg font-black text-white shadow-lg active:bg-emerald-700 landscape:min-h-11 landscape:text-base"
              >
                <Sparkles className="h-6 w-6" />
                Ik heb het gedaan
              </button>
              <button
                type="button"
                className="flex min-h-14 w-14 items-center justify-center rounded-lg border-4 border-cyan-800 bg-cyan-600 text-white shadow-lg active:bg-cyan-700 landscape:min-h-11 landscape:w-11"
                aria-label="Vraag hulp"
              >
                <HelpCircle className="h-7 w-7" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
