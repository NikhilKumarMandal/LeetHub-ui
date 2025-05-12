import { createBrowserRouter } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LandingPage from "./Pages/LandingPage";
import Root from "./Layouts/Root";
import NonAuth from "./Layouts/NonAuth";
import LoginPage from "./Pages/LoginPage";
import Dhashboard from "./Layouts/Dhashboard";

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
            element: <HomePage/>,
        },
        {
            path: "login", 
            element: <LoginPage/>,
        }
        ]
    },
    {
        path: "/auth",
        element: <Dhashboard />,
        children: [
        {
        path: "homepage",
        element: <LandingPage/>
        }
    ]
    },
    ]
    },
])