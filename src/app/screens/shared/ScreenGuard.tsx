import { useEffect } from "react";
import type { NavigateFunction } from "react-router";
import type { Profile } from "../../game-platform";

export const useRequireProfile = (currentProfile: Profile | null, navigate: NavigateFunction) => {
  useEffect(() => {
    if (!currentProfile) {
      navigate("/");
    }
  }, [currentProfile, navigate]);
};
