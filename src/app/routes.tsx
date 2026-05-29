import { createBrowserRouter } from "react-router";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { ProfileSelectScreen } from "./screens/ProfileSelectScreen";
import { AvatarSelectScreen } from "./screens/AvatarSelectScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { GamesListScreen } from "./screens/GamesListScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { Root } from "./Root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: WelcomeScreen },
      { path: "profiles", Component: ProfileSelectScreen },
      { path: "avatar", Component: AvatarSelectScreen },
      { path: "home", Component: HomeScreen },
      { path: "games/:theme", Component: GamesListScreen },
      { path: "settings", Component: SettingsScreen },
      { path: "progress", Component: ProgressScreen },
    ],
  },
]);
