import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { RumSida } from "./pages/RumSida";
import { RumDetaljSida } from "./pages/rumDetaljSida";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/rum",
    element: <RumSida />,
  },
  {
    path: "/rum/:id",
    element: <RumDetaljSida />,
  },
]);
