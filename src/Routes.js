import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/404";
import Profile from "./pages/Profile";

const ProjectRoutes = () => {
    let element = useRoutes([
        { path: "/", element: <Home /> },
        { path: "/404", element: <NotFound />},
        { path: "/profile", element: <Profile />},
    ]);

    return element;
};

export default ProjectRoutes;