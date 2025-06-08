import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Root from "./Layouts/Root";
import NonAuth from "./Layouts/NonAuth";
import LoginPage from "./Pages/LoginPage";
import Dhashboard from "./Layouts/Dhashboard";
import ListProblems from "./Pages/ListProblems";


import HomePage1 from "./Pages/HomePage1";
import PlaylistPage from "./Pages/PlaylistPage";
import FavoritesPage from "./Pages/FavoritesPage";
import ProfilePage from "./Pages/ProfilePage";
import SubmissionPage from "./Pages/SubmissionPage";
import Index from "./components/New/Index";
import JoinRoom from "./Pages/JoinRoom";
import EditorPage from "./Pages/Editorpage";
import CreateProblemPage from "./Pages/CreateProblemPage";
import ListProblemByCompany from "./Pages/ListProblemByCompany";
import CreateProblemPageForSQL from "./Pages/CreateProblemPageForSql";

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
            path: "list-problems/:topic",
            element: <ListProblems />,
          },
          {
            path: "create-problem",
            element: <CreateProblemPage />,
          },
          {
            path: "problems/update/:problemId",
            // element: <UpdateProblemForm />,
          },
          {
            path: "home",
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
          {
            path: "problem-list/:companyName",
            element: <ListProblemByCompany />,
          },
          {
            path: "create-sql",
            element: <CreateProblemPageForSQL />,
          },
        ],
      },
    ],
  },
]);
