import { lazy } from "react";
import resourceEntitiesRoutes from "./resourceEntitiesRoutes";
import resourceSettingsRoutes from "./resourceSettingsRoutes";

const resourceRoutes = [
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/entities",
    Component: lazy(() => import("../Entity/EntityList")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: resourceEntitiesRoutes,
  },
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/builds/:build([A-Za-z0-9-]{20,})",
    Component: lazy(() => import("../VersionControl/BuildPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    isAnalytics: true,
  },
  {
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/changes/:commit([A-Za-z0-9-]{20,})",
    Component: lazy(() => import("../VersionControl/ChangesPage")),
    moduleName: "ChangesPage",
    moduleClass: "changes-page",
    routeTrackType: "",
    exactPath: true,
    isAnalytics: true,
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
        isAnalytics: true,
      },
    ],
  },
  {
    path: "/:workspace/:project/:resource/topics",
    Component: lazy(() => import("../Topics/TopicsPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: "/:workspace/:project/:resource/topics/:topicId",
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
    path: "/:workspace/:project/:resource/Services",
    Component: lazy(() => import("../MessageBrokerServices/ServicesPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
  },
  {
    path: "/:workspace/:project/:resource/service-connections",
    Component: lazy(
      () => import("../ServiceConnections/ServiceConnectionsPage")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: "/:workspace/:project/:resource/service-connections/:connectedResourceId",
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
    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/commits",
    Component: lazy(() => import("../VersionControl/CommitList")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})/commits/builds/:buildId",
        Component: lazy(() => import("../VersionControl/BuildPage")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
    ],
  },
  {
    path: "/:workspace/:project/:resource/git-sync",
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
    path: "/:workspace/:project/:resource/plugins",
    Component: lazy(() => import("../Plugins/PluginsPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: "/:workspace/:project/:resource/plugins/catalog",
        Component: lazy(() => import("../Plugins/PluginsCatalog")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
      {
        path: "/:workspace/:project/:resource/plugins/installed",
        Component: lazy(() => import("../Plugins/InstalledPlugins")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
      {
        path: "/:workspace/:project/:resource/plugins/installed/:plugin",
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

export default resourceRoutes;
