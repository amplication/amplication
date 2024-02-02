import { ComponentType, lazy, LazyExoticComponent } from "react";
import resourceRoutes from "./resourceRoutes";
import resourceTabRoutes from "./resourceTabRoutes";

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
            path: "/:workspace([A-Za-z0-9-]{20,})/members",
            Component: lazy(() => import("../Workspaces/MemberList")),
            moduleName: "",
            displayName: "Members",
            exactPath: true,
            routes: [],
            isAnalytics: true,
          },
          {
            path: "/:workspace([A-Za-z0-9-]{20,})/settings",
            Component: lazy(() => import("../Workspaces/WorkspaceForm")),
            moduleName: "",
            displayName: "Settings",
            exactPath: true,
            routes: [],
            isAnalytics: true,
          },
        ],
        routes: [
          {
            path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})",
            Component: lazy(() => import("../Project/ProjectPage")),
            moduleName: "ProjectPage",
            moduleClass: "project-page",
            exactPath: false,
            tabRoutes: [
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/architecture",
                Component: lazy(
                  () =>
                    import("../Project/ArchitectureConsole/ArchitectureConsole")
                ),
                moduleName: "ProjectArchitecture",
                displayName: "Architecture",
                moduleClass: "",
                routeTrackType: "",
                exactPath: false,
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/git-sync",
                Component: lazy(
                  () => import("../Resource/git/SyncWithGithubPage")
                ),
                moduleName: "ProjectSettingsGit",
                displayName: "Sync with Git",
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
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/pending-changes",
                Component: lazy(
                  () => import("../VersionControl/PendingChangesPage")
                ),
                moduleName: "PendingChangesPage",
                moduleClass: "pending-changes-page",
                routeTrackType: "",
                exactPath: true,
                isAnalytics: true,
              },
              {
                path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/welcome",
                Component: lazy(
                  () =>
                    import("../Resource/create-resource/CreateServiceWizard")
                ),
                moduleName: "CreateServiceWizard",
                moduleClass: "create-service-wizard",
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
                tabRoutes: resourceTabRoutes,
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
    path: "/signup",
    Component: lazy(() => import("../User/Signup")),
    moduleName: "Signup",
    moduleClass: "signup-page",
    routeTrackType: "signup",
    exactPath: true,
    isAnalytics: true,
  },
  {
    path: "/signup/preview-account",
    Component: lazy(() => import("../User/SignupPreviewAccount")),
    moduleName: "SignupPreviewAccount",
    moduleClass: "signupPreviewAccount-page",
    routeTrackType: "signupPreviewAccount",
    exactPath: true,
    isAnalytics: true,
  },
];
