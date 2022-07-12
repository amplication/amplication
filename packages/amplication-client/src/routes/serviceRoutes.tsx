import { lazy } from "react";
import serviceEntitiesRoutes from "./serviceEntitiesRoutes";
import serviceSettingsRoutes from "./serviceSettingsRoutes";

const serviceRoutes = [
  {
    path: "/:workspace/:project/:service/entities",
    Component: lazy(() => import("../Resource/EntitiesTile")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [
      {
        path: "/:workspace/:project/:service/entities/:entityId",
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: serviceEntitiesRoutes,
      },
    ],
  },
  {
    path: "/:workspace/:project/:service/roles",
    Component: lazy(() => import("../Resource/RolesTile")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [
      {
        path: "/:workspace/:project/:service/roles/:roleId",
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
      },
    ],
  },
  {
    path: "/:workspace/:project/:service/commits",
    Component: lazy(() => import("../VersionControl/Commits")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [
      {
        path: "/:workspace/:project/:service/commits/:commitId",
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
      },
    ],
  },
  {
    path: "/:workspace/:project/:service/github",
    Component: lazy(() =>
      import("../Resource/git/SyncWithGithubPage")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
  {
    path: "/:workspace/:project/:service/code-view",
    Component: lazy(() =>
      import("../Resource/code-view/CodeViewPage")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
  {
    path: "/:workspace/:project/:service/appSettings",
    Component: lazy(() =>
      import("../Resource/serviceSettings/ServiceSettingsPage")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: serviceSettingsRoutes,
  },
]

export default serviceRoutes;