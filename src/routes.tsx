import { createBrowserRouter, type RouteObject } from "react-router-dom";
import type { ComponentType } from "react";
import App from "./App";

interface PageModule {
  default?: ComponentType;
  [key: string]: unknown;
}

const pages = import.meta.glob<PageModule>("./pages/**/*.tsx", { eager: true });

export interface NavItem {
  name: string;
  path: string;
}

export const navLinks: NavItem[] = Object.keys(pages)
  .map((path) => {
    const fileName = path.replace("./pages/", "").replace(".tsx", "");
    const isHome = fileName.toLowerCase() === "home";

    return {
      name: isHome ? "Hem" : fileName,
      path: isHome ? "/" : `/${fileName.toLowerCase()}`,
    };
  })
  .filter((item) => !item.path.toLowerCase().includes("detalj"));

const dynamicRoutes: RouteObject[] = Object.keys(pages).map((path) => {
  const fileName = path.replace("./pages/", "").replace(".tsx", "");

  const isHome = fileName.toLowerCase() === "home";
  const isDetalj = fileName.toLowerCase().includes("detalj");

  const module = pages[path];
  const Component = (module.default ||
    module[fileName] ||
    Object.values(module)[0]) as ComponentType;

  return {
    path: isHome
      ? undefined
      : isDetalj
        ? `${fileName.toLowerCase()}/:id`
        : fileName.toLowerCase(),
    index: isHome ? true : undefined,
    element: Component ? <Component /> : null,
  };
});

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: dynamicRoutes,
  },
]);
