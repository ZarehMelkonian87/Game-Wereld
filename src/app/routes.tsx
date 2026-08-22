import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

export const router = createBrowserRouter([
  {
    Component: Root,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        index: true,
        lazy: () =>
          import("./screens/welcome").then(({ WelcomeScreen }) => ({
            Component: WelcomeScreen,
          })),
      },
      {
        path: "profiles",
        lazy: () =>
          import("./screens/profile-select").then(({ ProfileSelectScreen }) => ({
            Component: ProfileSelectScreen,
          })),
      },
      {
        path: "avatar",
        lazy: () =>
          import("./screens/avatar-select").then(({ AvatarSelectScreen }) => ({
            Component: AvatarSelectScreen,
          })),
      },
      {
        path: "home",
        lazy: () =>
          import("./screens/home").then(({ HomeScreen }) => ({
            Component: HomeScreen,
          })),
      },
      {
        path: "games/:theme",
        lazy: () =>
          import("./screens/games-list").then(({ GamesListScreen }) => ({
            Component: GamesListScreen,
          })),
      },
      {
        path: "games/:theme/:gameId",
        lazy: () =>
          import("./screens/game-play").then(({ GamePlayScreen }) => ({
            Component: GamePlayScreen,
          })),
      },
      {
        path: "settings",
        lazy: () =>
          import("./screens/settings").then(({ SettingsScreen }) => ({
            Component: SettingsScreen,
          })),
      },
      {
        path: "progress",
        lazy: () =>
          import("./screens/progress").then(({ ProgressScreen }) => ({
            Component: ProgressScreen,
          })),
      },
    ],
    path: "/",
  },
]);
