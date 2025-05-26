import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Root from "./Layouts/Root";
import NonAuth from "./Layouts/NonAuth";
import LoginPage from "./Pages/LoginPage";
import Dhashboard from "./Layouts/Dhashboard";
import HomePage from "./Pages/HomePage";
import ListProblems from "./Pages/ListProblems";

import CreateProblemForm from "./Pages/CreateProblemForm";
import UpdateProblemForm from "./Pages/UpdateProblemForm";
import HomePage1 from "./Pages/HomePage1";
import PlaylistPage from "./Pages/PlaylistPage";
import FavoritesPage from "./Pages/FavoritesPage";
import Workspace from "./components/Workspace/Workspace";
import ResizableLayout from "./components/New/ResizableLayout";
import Index from "./components/New/Index";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <NonAuth />,
        children: [
          {
            path: "",
            element: <LandingPage />,
          },
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
      {
        path: "/playlist/:playlistId",
        element: <PlaylistPage />,
      },
      {
        path: "/auth",
        element: <Dhashboard />,
        children: [
          {
            path: "homepage",
            element: <HomePage />,
          },
          {
            path: "list-problems/:topic",
            element: <ListProblems />,
          },
          {
            path: "create-problem",
            element: <CreateProblemForm />,
          },
          {
            path: "problems/update/:problemId",
            element: <UpdateProblemForm />,
          },
          {
            path: "hello",
            element: <HomePage1 />,
          },
          {
            path: "favorite",
            element: <FavoritesPage />,
          },
          {
            path: "problems/:problemId",
            // element: <Workspace />,
            element: <Index />,
          },
        ],
      },
    ],
  },
]);
