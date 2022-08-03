import { lazy } from "react";
import resourceEntitiesRoutes from "./resourceEntitiesRoutes";
import resourceSettingsRoutes from "./resourceSettingsRoutes";

const resourceRoutes = [
  {
    path:
      "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/entities",
    Component: lazy(() => import("../Entity/EntityList")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: resourceEntitiesRoutes,
  },
  {
    path: "/:workspace/:project/:resource/roles",
    Component: lazy(() => import("../Roles/RolesPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: "/:workspace/:project/:resource/roles/:roleId",
        Component: lazy(() => import("../Roles/Role")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
      },
    ],
  },
  {
    path: "/:workspace/:project/:resource/commits",
    Component: lazy(() => import("../VersionControl/Commits")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [
      {
        path: "/:workspace/:project/:resource/commits/:commitId",
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
      },
    ],
  },
  {
    path: "/:workspace/:project/:resource/github",
    Component: lazy(() => import("../Resource/git/SyncWithGithubPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
  {
    path: "/:workspace/:project/:resource/code-view",
    Component: lazy(() => import("../Resource/code-view/CodeViewPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
  {
    path:
      "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings",
    Component: lazy(
      () => import("../Resource/serviceSettings/ServiceSettingsPage")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: resourceSettingsRoutes,
  },
];

export default resourceRoutes;
