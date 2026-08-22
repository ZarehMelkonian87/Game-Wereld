import { createProfileId } from "../../game-platform";
import {
  createProfileProgressExport,
  reportStorageWriteFailure,
  useStorageRepositories,
} from "../../storage";

interface ProfileDataExportCardProps {
  profileId: string;
}

export const ProfileDataExportCard = ({ profileId }: ProfileDataExportCardProps) => {
  const { repositories } = useStorageRepositories();

  const exportProgress = async () => {
    try {
      const payload = await createProfileProgressExport(repositories, createProfileId(profileId));
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `game-wereld-voortgang-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      reportStorageWriteFailure(error);
    }
  };

  return (
    <section className="mb-6 rounded-2xl border-2 border-cyan-600 bg-slate-800 p-5">
      <h3 className="mb-2 text-xl font-black text-white">VOORTGANG EXPORTEREN</h3>
      <p className="mb-4 text-sm text-slate-300">
        Download oefenpogingen en berekende voortgang zonder naam, avatar, audio of transcript.
      </p>
      <button
        className="min-h-12 rounded-xl bg-cyan-500 px-5 font-bold text-slate-950"
        onClick={() => void exportProgress()}
        type="button"
      >
        Voortgang downloaden
      </button>
    </section>
  );
};

ProfileDataExportCard.displayName = "ProfileDataExportCard";
