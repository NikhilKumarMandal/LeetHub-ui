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
import ProfilePage from "./Pages/ProfilePage";
import SubmissionPage from "./Pages/SubmissionPage";
import Index from "./components/New/Index";
import JoinRoom from "./Pages/JoinRoom";
import EditorPage from "./Pages/Editorpage";
import CreateProblemPage from "./Pages/CreateProblemPage";

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
            element: <CreateProblemPage />,
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
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "submissions",
            element: <SubmissionPage />,
          },
          {
            path: "create-room",
            element: <JoinRoom />,
          },
          {
            path: "editor/:roomId",
            element: <EditorPage />,
          },
        ],
      },
    ],
  },
]);
