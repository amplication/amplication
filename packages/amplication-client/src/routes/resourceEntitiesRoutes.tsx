import { lazy } from "react";

const resourceEntitiesRoutes = [
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/entities/:entityId([A-Za-z0-9-]{20,})",
    Component: lazy(() => import("../Entity/Entity")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [],
    isAnalytics: true,
  },

  {
    path: "/:workspace/:project/:resource/entities/import-schema",
    Component: lazy(
      () => import("../Entity/ImportPrismaSchema/EntitiesImport")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
];

export default resourceEntitiesRoutes;
