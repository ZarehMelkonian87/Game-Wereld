import { useNavigate } from "react-router";
import { useProfile } from "../../contexts/ProfileContext";
import { useRequireProfile } from "../shared";
import { HomeHeader } from "./HomeHeader";
import { ThemeGrid } from "./ThemeGrid";

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { currentProfile, setCurrentProfile } = useProfile();

  useRequireProfile(currentProfile, navigate);

  if (!currentProfile) {
    return null;
  }

  const handleLogout = () => {
    setCurrentProfile(null as any);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col safe-area-inset" data-component="HomeScreen">
      <HomeHeader
        currentProfile={currentProfile}
        onLogout={handleLogout}
        onOpenProgress={() => navigate("/progress")}
        onOpenSettings={() => navigate("/settings")}
      />
      <ThemeGrid onSelectTheme={(themeId) => navigate(`/games/${themeId}`)} />
    </div>
  );
};

HomeScreen.displayName = "HomeScreen";
