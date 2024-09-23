import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./utils/router/routes";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

function App() {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.user);
  const router = createBrowserRouter(routes(isAuthenticated));

  return <RouterProvider router={router} />;
}

export default App;
