import { createBrowserRouter } from "react-router";
import {
  AvatarSelectScreen,
  GamePlayScreen,
  GamesListScreen,
  HomeScreen,
  ProfileSelectScreen,
  ProgressScreen,
  SettingsScreen,
  WelcomeScreen,
} from "./screens";
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
      { path: "games/:theme/:gameId", Component: GamePlayScreen },
      { path: "settings", Component: SettingsScreen },
      { path: "progress", Component: ProgressScreen },
    ],
  },
]);
