import { lazy } from "react";
import resourceEntitiesRoutes from "./resourceEntitiesRoutes";
import resourceSettingsRoutes from "./resourceSettingsRoutes";

const resourceTabRoutes = [
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/entities",
    Component: lazy(() => import("../Entity/EntityList")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: resourceEntitiesRoutes,
  },

  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/roles",
    Component: lazy(() => import("../Roles/RolesPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/roles/:roleId",
        Component: lazy(() => import("../Roles/Role")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
    ],
  },
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/topics",
    Component: lazy(() => import("../Topics/TopicsPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/topics/:topicId",
        Component: lazy(() => import("../Topics/Topic")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
    ],
  },
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/Services",
    Component: lazy(() => import("../MessageBrokerServices/ServicesPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
  },
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/service-connections",
    Component: lazy(
      () => import("../ServiceConnections/ServiceConnectionsPage")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/service-connections/:connectedResourceId",
        Component: lazy(() => import("../ServiceConnections/ServiceTopics")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
    ],
  },

  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/git-sync",
    Component: lazy(() => import("../Resource/git/SyncWithGithubPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/settings",
    Component: lazy(
      () => import("../Resource/resourceSettings/ResourceSettingsPage")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: resourceSettingsRoutes,
  },
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/plugins",
    Component: lazy(() => import("../Plugins/PluginsPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/plugins/catalog",
        Component: lazy(() => import("../Plugins/PluginsCatalog")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
      {
        path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/plugins/installed",
        Component: lazy(() => import("../Plugins/InstalledPlugins")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
      {
        path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/plugins/installed/:plugin",
        Component: lazy(() => import("../Plugins/InstalledPluginSettings")),
        moduleName: "",
        moduleClass: "installed-plugin-settings",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
    ],
  },
];

export default resourceTabRoutes;
