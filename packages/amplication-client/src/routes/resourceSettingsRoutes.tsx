import { lazy } from "react";

export const resourceSettingsRoutes = (resourceBasePath) => [
  {
    path: `${resourceBasePath}/settings/general`,
    Component: lazy(() => import("../Resource/ResourceFormPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
  {
    path: `${resourceBasePath}/settings/resource-settings`,
    Component: lazy(() => import("../ResourceSettings/ResourceSettingsPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
  {
    path: `${resourceBasePath}/settings/generationSettings`,
    Component: lazy(
      () => import("../Resource/resourceSettings/GenerationSettingsForm")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
  {
    path: `${resourceBasePath}/settings/directories`,
    Component: lazy(
      () => import("../Resource/resourceSettings/DirectoriesSettingsForm")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
  {
    path: `${resourceBasePath}/settings/authentication`,
    Component: lazy(
      () => import("../Resource/resourceSettings/AuthenticationSettingsForm")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
  {
    path: `${resourceBasePath}/settings/code-generator-version`,
    Component: lazy(
      () =>
        import("../Resource/codeGeneratorVersionSettings/CodeGeneratorVersion")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
];
