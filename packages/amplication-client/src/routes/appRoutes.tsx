import { ComponentType, lazy, LazyExoticComponent } from "react";
import resourceRoutes from "./resourceRoutes";
import { resourceTabRoutes } from "./resourceTabRoutes";

export interface RouteDef {
  path: string;
  redirect?: string;
  Component?: LazyExoticComponent<ComponentType<any>>;
  routes?: RouteDef[];
  tabRoutes?: RouteDef[];
  exactPath: boolean;
  moduleName?: string;
  moduleClass?: string;
  displayName?: string; //used for the tab name
  routeTrackType?: string;
  permission?: boolean;
  isAnalytics?: boolean;
  iconName?: string;
}

export const Routes: RouteDef[] = [
  {
    path: "/:workspace([A-Za-z0-9-]{20,})",
    Component: lazy(() => import("../Workspaces/WorkspaceLayout")),
    moduleName: "WorkspaceLayout",
    moduleClass: "workspaces-layout",
    exactPath: false,
    permission: true,
    routes: [
      {
        path: "/:workspace([A-Za-z0-9-]{20,})",
        Component: lazy(() => import("../Workspaces/WorkspacePage")),
        moduleName: "WorkspacePage",
        moduleClass: "workspace-page",
        exactPath: false,
        tabRoutes: [
          {
            path: "/:workspace([A-Za-z0-9-]{20,})/graph",
            Component: lazy(() => import("../Workspaces/WorkspaceGraph")),
            moduleName: "",
            displayName: "Architecture",
            exactPath: false,
            isAnalytics: true,
          },
          {
            path: "/:workspace([A-Za-z0-9-]{20,})/projects",
            Component: lazy(() => import("../Workspaces/WorkspaceOverview")),
            moduleName: "",
            displayName: "Projects",
            exactPath: false,
            isAnalytics: true,
          },
          {
            path: "/:workspace([A-Za-z0-9-]{20,})/blueprints",
            Component: lazy(() => import("../Blueprints/BlueprintsPage")),
            moduleName: "",
            displayName: "Blueprints",
            exactPath: false,
            routes: [
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/blueprints/:blueprint([A-Za-z0-9-]{20,})",
                Component: lazy(() => import("../Blueprints/Blueprint")),
                moduleName: "",
                displayName: "Blueprint",
                exactPath: true,
                routes: [],
                isAnalytics: true,
              },
            ],
            isAnalytics: true,
          },
          {
            path: "/:workspace([A-Za-z0-9-]{20,})/settings",
            Component: lazy(
              () => import("../Workspaces/WorkspaceSettingsPage")
            ),
            moduleName: "app-settings",
            displayName: "Settings",
            exactPath: false,
            tabRoutes: [
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/settings/members",
                Component: lazy(() => import("../Workspaces/MemberList")),
                iconName: "user",
                displayName: "Users",
                exactPath: true,
                routes: [],
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/settings/teams",
                Component: lazy(() => import("../Teams/TeamsPage")),
                iconName: "users",
                displayName: "Teams",
                exactPath: false,
                routes: [
                  {
                    path: "/:workspace([A-Za-z0-9-]{20,})/settings/teams/:team([A-Za-z0-9-]{20,})",
                    Component: lazy(() => import("../Teams/Team")),
                    displayName: "Team",
                    exactPath: true,
                    routes: [],
                    isAnalytics: true,
                  },
                ],
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/settings/roles",
                Component: lazy(() => import("../Roles/RolesPage")),
                iconName: "roles_outline",
                displayName: "Roles",
                exactPath: false,
                routes: [
                  {
                    path: "/:workspace([A-Za-z0-9-]{20,})/settings/roles/:role([A-Za-z0-9-]{20,})",
                    Component: lazy(() => import("../Roles/Role")),
                    moduleName: "",
                    displayName: "Role",
                    exactPath: true,
                    routes: [],
                    isAnalytics: true,
                  },
                ],
                isAnalytics: true,
              },

              {
                path: "/:workspace([A-Za-z0-9-]{20,})/settings/properties",
                Component: lazy(
                  () => import("../CustomProperties/CustomPropertiesPage")
                ),
                iconName: "multi_select_option_set",
                displayName: "Catalog Properties",
                exactPath: false,
                routes: [
                  {
                    path: "/:workspace([A-Za-z0-9-]{20,})/settings/properties/:property([A-Za-z0-9-]{20,})",
                    Component: lazy(
                      () => import("../CustomProperties/CustomProperty")
                    ),
                    moduleName: "",
                    displayName: "Property",
                    exactPath: true,
                    routes: [],
                    isAnalytics: true,
                  },
                ],
                isAnalytics: true,
              },
            ],
            isAnalytics: true,
          },
        ],
        routes: [
          {
            path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/new-resource",
            Component: lazy(
              () =>
                import("../Resource/create-resource-page/CreateResourcePage")
            ),
            moduleName: "CreateResourcePage",
            moduleClass: "create-resource-page",
            exactPath: true,
            routes: [],
          },

          {
            path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})",
            Component: lazy(() => import("../Platform/ProjectPlatformPage")),
            moduleName: "ProjectPlatformPage",
            moduleClass: "project-platform-page",
            exactPath: false,
            tabRoutes: [
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/private-plugins",
                Component: lazy(
                  () => import("../PrivatePlugins/PrivatePluginsPage")
                ),
                moduleName: "",
                displayName: "Plugin Repository",
                routeTrackType: "",
                exactPath: false,
                routes: [
                  {
                    path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/private-plugins/git-settings",
                    Component: lazy(
                      () => import("../PrivatePlugins/PrivatePluginGitSettings")
                    ),
                    moduleName: "",
                    routeTrackType: "",
                    exactPath: true,
                    routes: [],
                    isAnalytics: true,
                  },
                  {
                    path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/private-plugins/:pluginId([A-Za-z0-9-]{20,})",
                    Component: lazy(
                      () => import("../PrivatePlugins/PrivatePlugin")
                    ),
                    moduleName: "",
                    routeTrackType: "",
                    exactPath: true,
                    routes: [],
                    isAnalytics: true,
                  },
                ],
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/tech-debt",
                Component: lazy(
                  () =>
                    import("../OutdatedVersionAlerts/OutdatedVersionAlertsPage")
                ),
                moduleName: "",
                displayName: "Tech Debt",
                routeTrackType: "",
                exactPath: false,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/pending-changes",
                Component: lazy(
                  () => import("../VersionControl/PendingChangesPage")
                ),
                moduleName: "PendingChangesPage",
                moduleClass: "pending-changes-page",
                displayName: "Pending Changes",
                routeTrackType: "",
                exactPath: true,
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/publish",
                Component: lazy(
                  () => import("../VersionControl/PublishChangesPage")
                ),
                moduleName: "",
                displayName: "Publish",
                routeTrackType: "",
                exactPath: false,
                routes: [],
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/settings",
                Component: lazy(
                  () => import("../Project/ProjectPlatformSettingsPage")
                ),
                moduleName: "PlatformSettings",
                displayName: "Settings",
                moduleClass: "platform-settings",
                routeTrackType: "",
                exactPath: false,
                isAnalytics: true,
                routes: [
                  {
                    path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/settings/access",
                    Component: lazy(
                      () => import("../Project/ProjectAccessForm")
                    ),
                    moduleName: "ProjectPlatformAccess",
                    moduleClass: "",
                    routeTrackType: "",
                    exactPath: false,
                    isAnalytics: true,
                  },
                ],
              },
            ],
            routes: [
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/create-service-template",
                Component: lazy(
                  () =>
                    import("../Resource/create-resource/CreateServiceWizard")
                ),
                moduleName: "CreateServiceWizard",
                moduleClass: "create-service-wizard",
                routeTrackType: "",
                exactPath: false,
                isAnalytics: true,
                routes: [],
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/create-plugin-repository",
                Component: lazy(
                  () =>
                    import(
                      "../Resource/create-plugin-repository/CreatePluginRepository"
                    )
                ),
                moduleName: "CreatePluginRepository",
                moduleClass: "create-plugin-repository",
                routeTrackType: "",
                exactPath: true,
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})",
                Component: lazy(() => import("../Resource/ResourceHome")),
                moduleName: "",
                routeTrackType: "",
                exactPath: false,
                routes: resourceRoutes,
                tabRoutes: resourceTabRoutes(
                  "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})"
                ),
              },
            ],
          },
          {
            path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})",
            Component: lazy(() => import("../Project/ProjectPage")),
            moduleName: "ProjectPage",
            moduleClass: "project-page",
            exactPath: false,
            tabRoutes: [
              // {
              //   path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/architecture",
              //   Component: lazy(
              //     () =>
              //       import("../Project/ArchitectureConsole/ArchitectureConsole")
              //   ),
              //   moduleName: "ProjectArchitecture",
              //   displayName: "Architecture",
              //   moduleClass: "",
              //   routeTrackType: "",
              //   exactPath: false,
              //   isAnalytics: true,
              // },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/git-sync",
                Component: lazy(
                  () => import("../Resource/git/ResourceGitSettingsPage")
                ),
                moduleName: "ProjectSettingsGit",
                displayName: "Git Settings",
                moduleClass: "",
                routeTrackType: "",
                exactPath: false,
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/commits",
                Component: lazy(() => import("../VersionControl/CommitsPage")),
                moduleName: "CommitsPage",
                moduleClass: "commits-page",
                displayName: "Commits",
                routeTrackType: "",
                exactPath: false,
                routes: [
                  {
                    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/commits/:commit([A-Za-z0-9-]{20,})",
                    Component: lazy(
                      () => import("../VersionControl/CommitPage")
                    ),
                    moduleName: "CommitPage",
                    moduleClass: "commit-page",
                    routeTrackType: "",
                    exactPath: false,
                    isAnalytics: true,
                  },
                  {
                    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/commits/:commit([A-Za-z0-9-]{20,})/builds/:build([A-Za-z0-9-]{20,})",
                    Component: lazy(
                      () => import("../VersionControl/BuildPage")
                    ),
                    moduleName: "",
                    routeTrackType: "",
                    exactPath: true,
                    isAnalytics: true,
                  },
                ],
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/code-view",
                Component: lazy(
                  () => import("../Resource/code-view/CodeViewPage")
                ),
                moduleName: "CodeViewPage",
                displayName: "Code View",
                moduleClass: "code-view-page",
                routeTrackType: "",
                exactPath: true,
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/pending-changes",
                Component: lazy(
                  () => import("../VersionControl/PendingChangesPage")
                ),
                moduleName: "PendingChangesPage",
                moduleClass: "pending-changes-page",
                displayName: "Pending Changes",
                routeTrackType: "",
                exactPath: true,
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/settings",
                Component: lazy(() => import("../Project/ProjectSettingsPage")),
                moduleName: "ProjectSettings",
                displayName: "Settings",
                moduleClass: "project-settings",
                routeTrackType: "",
                exactPath: false,
                isAnalytics: true,
                routes: [
                  {
                    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/settings/general",
                    Component: lazy(() => import("../Project/ProjectFormPage")),
                    moduleName: "ProjectSettingsGeneral",
                    moduleClass: "",
                    routeTrackType: "",
                    exactPath: false,
                    isAnalytics: true,
                  },

                  {
                    path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/settings/directories",
                    Component: lazy(
                      () =>
                        import(
                          "../Project/DirectoriesProjectConfigurationSettingsForm"
                        )
                    ),
                    moduleName: "ProjectSettingsDirectories",
                    moduleClass: "",
                    routeTrackType: "",
                    exactPath: false,
                    isAnalytics: true,
                  },
                ],
              },
            ],
            routes: [
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/dotnet-upgrade",
                Component: lazy(
                  () => import("../VersionControl/DotNetPromotePage")
                ),
                moduleName: "DotnetPromote",
                moduleClass: "",
                routeTrackType: "",
                exactPath: true,
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/welcome",
                Component: lazy(
                  () => import("../Assistant/OnboardingWithJovuPage")
                ),
                moduleName: "OnboardingWithJovuPage",
                routeTrackType: "",
                exactPath: true,
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/create-resource",
                Component: lazy(
                  () =>
                    import("../Resource/create-resource/CreateServiceWizard")
                ),
                moduleName: "CreateServiceWizard",
                moduleClass: "create-service-wizard",
                routeTrackType: "",
                exactPath: false,
                isAnalytics: true,
                routes: [],
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/create-broker",
                Component: lazy(
                  () =>
                    import(
                      "../Resource/create-message-broker/CreateMessageBroker"
                    )
                ),
                moduleName: "CreateMessageBroker",
                moduleClass: "create-message-broker",
                routeTrackType: "",
                exactPath: true,
                isAnalytics: true,
              },

              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})",
                Component: lazy(() => import("../Resource/ResourceHome")),
                moduleName: "",
                routeTrackType: "",
                exactPath: false,
                routes: resourceRoutes,
                tabRoutes: resourceTabRoutes(
                  "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})"
                ),
              },
            ],
          },
        ],
      },

      {
        path: "/:workspace([A-Za-z0-9-]{20,})/purchase",
        Component: lazy(() => import("../Purchase/PurchasePage")),
        moduleName: "",
        routes: [],
        exactPath: true,
        isAnalytics: true,
      },
    ],
  },
  {
    path: "/purchase",
    routeTrackType: "purchase",
    redirect: "/",
    moduleName: "purchase",
    routes: [],
    exactPath: true,
    isAnalytics: true,
  },
  {
    path: "/login",
    Component: lazy(() => import("../User/Login")),
    moduleName: "Login",
    routeTrackType: "login",
    moduleClass: "login-page",
    exactPath: true,
    isAnalytics: true,
  },
  {
    path: "/github-auth-app/callback",
    Component: lazy(
      () => import("../Resource/git/AuthResourceWithGithubCallback")
    ),
    moduleName: "AuthResourceWithGithubCallback",
    permission: true,
    routeTrackType: "auth app with git callback",
    exactPath: true,
    isAnalytics: true,
  },
  {
    path: "/bitbucket-auth-app/callback",
    Component: lazy(
      () => import("../Resource/git/AuthResourceWithBitbucketCallback")
    ),
    moduleName: "AuthResourceWithBitbucketCallback",
    permission: true,
    routeTrackType: "auth app with git callback",
    exactPath: true,
    isAnalytics: true,
  },
  {
    path: "/gitlab-auth-app/callback",
    Component: lazy(
      () => import("../Resource/git/AuthResourceWithGitLabCallback")
    ),
    moduleName: "AuthResourceWithGitLabCallback",
    permission: true,
    routeTrackType: "auth app with git callback",
    exactPath: true,
    isAnalytics: true,
  },
  {
    path: "/azure-devops-auth/callback",
    Component: lazy(
      () => import("../Resource/git/AuthResourceWithAzureDevopsCallback")
    ),
    moduleName: "AuthResourceWithAzureDevopsCallback",
    permission: true,
    routeTrackType: "auth app with git callback",
    exactPath: true,
    isAnalytics: true,
  },
  {
    path: "/signup",
    Component: lazy(() => import("../User/Signup")),
    moduleName: "Signup",
    moduleClass: "signup-page",
    routeTrackType: "signup",
    exactPath: true,
    isAnalytics: true,
  },
];
