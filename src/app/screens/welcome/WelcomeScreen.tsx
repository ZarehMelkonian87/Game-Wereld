import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useProfile } from "../../contexts/ProfileContext";
import { WelcomeBackground } from "./WelcomeBackground";
import { WelcomeHero } from "./WelcomeHero";

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();

  useEffect(() => {
    if (currentProfile) {
      navigate("/home");
    }
  }, [currentProfile, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      data-component="WelcomeScreen"
    >
      <WelcomeBackground />
      <WelcomeHero onStart={() => navigate("/profiles")} />
    </div>
  );
};

WelcomeScreen.displayName = "WelcomeScreen";
