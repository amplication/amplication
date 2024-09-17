import { lazy } from "react";

export const resourceEntitiesRoutes = (resourceBasePath) => [
  {
    path: `${resourceBasePath}/entities/:entityId([A-Za-z0-9-]{20,})`,
    Component: lazy(() => import("../Entity/Entity")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [],
    isAnalytics: false,
  },

  {
    path: `${resourceBasePath}/entities/import-schema`,
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
