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
        ],
      },
    ],
  },
]);
