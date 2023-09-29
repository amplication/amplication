import { lazy } from "react";

const resourceSettingsRoutes = [
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/general",
    Component: lazy(() => import("../Resource/ResourceFormPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/generationSettings",
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
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/directories",
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
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/authentication",
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
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/code-generator-version",
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

export default resourceSettingsRoutes;
