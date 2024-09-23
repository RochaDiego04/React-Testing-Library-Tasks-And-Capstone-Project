import { Navigate, RouteObject } from "react-router-dom";
import Home from "../../views/Home";
import Login from "../../views/Login";
import SignUp from "../../views/SignUp";
import NotFound from "../../views/NotFound";
import Projects from "../../views/Projects";
import Tasks from "../../views/Tasks";

export const routes = (isAuthenticated: boolean): RouteObject[] => [
  {
    path: "/",
    element: isAuthenticated ? <Home /> : <Navigate to="/login" replace />,
  },
  {
    path: "/projects",
    element: isAuthenticated ? <Projects /> : <Navigate to="/login" replace />,
  },
  {
    path: "/projects/:id",
    element: isAuthenticated ? <Tasks /> : <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
