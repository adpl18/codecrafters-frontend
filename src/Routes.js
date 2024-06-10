import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/404";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AddCourse from "./pages/AddCourse";

const ProjectRoutes = () => {
    let element = useRoutes([
        { path: "/", element: <Home /> },
        { path: "/404", element: <NotFound />},
        { path: "/login", element: <Login />},
        { path: "/profile", element: <Profile />},
        { path: "/addcourse", element: <AddCourse />},
    ]);

    return element;
};

export default ProjectRoutes;