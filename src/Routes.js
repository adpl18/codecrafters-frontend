import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/404";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddCourse from "./pages/AddCourse";
import Busqueda from "./pages/Busqueda";

const ProjectRoutes = () => {
    let element = useRoutes([
        { path: "/", element: <Home /> },
        { path: "/404", element: <NotFound />},
        { path: "/login", element: <Login />},
        { path: "/profile", element: <Profile />},
        { path: "/edit-profile", element: <EditProfile />},
        { path: "/addcourse", element: <AddCourse />},
        { path: "/busqueda", element: <Busqueda />},
    ]);

    return element;
};

export default ProjectRoutes;