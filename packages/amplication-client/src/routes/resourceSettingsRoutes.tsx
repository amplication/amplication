import { lazy } from "react";

const resourceSettingsRoutes = [
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/update",
    Component: lazy(() => import("../Resource/ResourceForm")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/generationSettings/update",
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
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/directories/update",
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
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/authentication/update",
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
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/code-generator-version/update",
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
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings/api-tokens",
    Component: lazy(() => import("../Settings/ApiTokenList")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
];

export default resourceSettingsRoutes;
