import { lazy } from "react";
import { resourceEntitiesRoutes } from "./resourceEntitiesRoutes";
import { resourceSettingsRoutes } from "./resourceSettingsRoutes";

export const resourceTabRoutes = (projectBasePath) => [
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/entities`,
    Component: lazy(() => import("../Entity/EntityList")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: resourceEntitiesRoutes(
      `${projectBasePath}/:resource([A-Za-z0-9-]{20,})`
    ),
    isAnalytics: true,
  },
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/modules`,
    Component: lazy(() => import("../Modules/ModulesPage")),
    moduleName: "",
    displayName: "APIs",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/modules/:module([A-Za-z0-9-]{20,})`,
        Component: lazy(() => import("../Modules/ModuleOverview")),
        moduleName: "",
        routeTrackType: "",
        exactPath: false,
        isAnalytics: true,
        routes: [
          {
            path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/modules/:module([A-Za-z0-9-]{20,})/edit`,
            Component: lazy(() => import("../Modules/ModulePage")),
            moduleName: "",
            routeTrackType: "",
            exactPath: true,
            routes: [],
            isAnalytics: true,
          },
          {
            path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/modules/:module([A-Za-z0-9-]{20,})/actions`,
            Component: lazy(() => import("../ModuleActions/ModuleActions")),
            moduleName: "",
            routeTrackType: "",
            exactPath: false,
            isAnalytics: true,
            routes: [
              {
                path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/modules/:module([A-Za-z0-9-]{20,})/actions/:moduleAction([A-Za-z0-9-]{20,})`,
                Component: lazy(() => import("../ModuleActions/ModuleAction")),
                moduleName: "",
                routeTrackType: "",
                exactPath: true,
                routes: [],
                isAnalytics: true,
              },
            ],
          },
          {
            path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/modules/:module([A-Za-z0-9-]{20,})/dtos`,
            Component: lazy(() => import("../ModuleDto/ModuleDtos")),
            moduleName: "",
            routeTrackType: "",
            exactPath: false,
            isAnalytics: true,
            routes: [
              {
                path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/modules/:module([A-Za-z0-9-]{20,})/dtos/:moduleDto([A-Za-z0-9-]{20,})`,
                Component: lazy(() => import("../ModuleDto/ModuleDto")),
                moduleName: "",
                routeTrackType: "",
                exactPath: true,
                routes: [],
                isAnalytics: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/roles`,
    Component: lazy(() => import("../ResourceRoles/RolesPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/roles/:roleId`,
        Component: lazy(() => import("../ResourceRoles/Role")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
    ],
  },
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/topics`,
    Component: lazy(() => import("../Topics/TopicsPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/topics/:topicId`,
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
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/services`,
    Component: lazy(() => import("../MessageBrokerServices/ServicesPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
  },
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/service-connections`,
    Component: lazy(
      () => import("../ServiceConnections/ServiceConnectionsPage")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/service-connections/:connectedResourceId`,
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
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/git-sync`,
    Component: lazy(() => import("../Resource/git/ResourceGitSettingsPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/settings`,
    Component: lazy(
      () => import("../Resource/resourceSettings/ResourceSettingsPage")
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: resourceSettingsRoutes(
      `${projectBasePath}/:resource([A-Za-z0-9-]{20,})`
    ),
  },
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/pending-changes`,
    Component: lazy(() => import("../VersionControl/PendingChangesPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
  },
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/plugins`,
    Component: lazy(() => import("../Plugins/PluginsPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/plugins/installed`,
        Component: lazy(() => import("../Plugins/InstalledPlugins")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
      {
        path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/plugins/catalog`,
        Component: lazy(() => import("../Plugins/PluginsCatalog")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
      {
        path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/plugins/catalog/:category`,
        Component: lazy(() => import("../Plugins/PluginsCatalog")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
      {
        path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/plugins/installed/:plugin`,
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
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/versions`,
    Component: lazy(() => import("../Platform/ResourceVersionsPage")),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/versions/:version([A-Za-z0-9-]{20,})`,
        Component: lazy(() => import("../Platform/ResourceVersionPage")),
        moduleName: "",
        routeTrackType: "",
        exactPath: false,
        routes: [],
      },
    ],
  },
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/template-resources`,
    Component: lazy(
      () =>
        import(
          "../ServiceTemplate/ServiceTemplateServiceList/ServiceTemplateServiceList"
        )
    ),
    moduleName: "",
    routeTrackType: "",
    exactPath: false,
    routes: [],
  },
  {
    path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/tech-debt`,
    Component: lazy(
      () => import("../OutdatedVersionAlerts/OutdatedVersionAlertsPage")
    ),
    moduleName: "",
    displayName: "Tech Debt",
    routeTrackType: "",
    exactPath: false,
    routes: [
      {
        path: `${projectBasePath}/:resource([A-Za-z0-9-]{20,})/tech-debt/:alert([A-Za-z0-9-]{20,})`,
        Component: lazy(
          () => import("../OutdatedVersionAlerts/OutdatedVersionAlertPage")
        ),
        moduleName: "",
        displayName: "Tech Debt Alert",
        routeTrackType: "",
        exactPath: false,
        routes: [],
      },
    ],
  },
];
