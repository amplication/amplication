import { lazy } from "react";

const resourceSettingsRoutes = [
  {
    path:
      "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/resourceSettings/update",
    Component: lazy(() => import("../Resource/ResourceForm")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
  {
    path:
      "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/resourceSettings/generationSettings/update",
    Component: lazy(
      () => import("../Resource/serviceSettings/GenerationSettingsForm")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
  {
    path:
      "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/resourceSettings/directories/update",
    Component: lazy(
      () => import("../Resource/serviceSettings/DirectoriesSettingsForm")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
  {
    path:
      "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/resourceSettings/db/update",
    Component: lazy(
      () => import("../Resource/ApplicationDatabaseSettingsForms")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
  {
    path:
      "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/resourceSettings/auth/update",
    Component: lazy(() => import("../Resource/ApplicationAuthSettingForm")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
  {
    path:
      "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/resourceSettings/api-tokens",
    Component: lazy(() => import("../Settings/ApiTokenList")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
];

export default resourceSettingsRoutes;
