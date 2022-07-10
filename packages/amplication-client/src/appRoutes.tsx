import { ComponentType, lazy, LazyExoticComponent } from "react";

export interface RouteDef {
  path: string;
  redirect?: string;
  Component?: LazyExoticComponent<ComponentType<any>>;
  routes?: RouteDef[];
  exactPath: boolean;
  moduleName?: string;
  moduleClass?: string;
  routeTrackType?: string;
  permission?: boolean;
}

export const Routes: RouteDef[] = [
  {
    path: "/",
    redirect: "/:workspace",
    routeTrackType: "main root",
    exactPath: true,
  },
  {
    path: "/login",
    Component: lazy(() => import("./User/Login")),
    moduleName: "Login",
    routeTrackType: "login",
    moduleClass: "login-page",
    exactPath: true,
  },
  {
    path: "/github-auth-app/callback",
    Component: lazy(() => import("./Application/git/AuthAppWithGitCallback")),
    moduleName: "AuthAppWithGitCallback",
    permission: true,
    routeTrackType: "auth app with git callback",
    exactPath: true,
  },
  {
    path: "/signup",
    Component: lazy(() => import("./User/Signup")),
    moduleName: "Signup",
    moduleClass: "signup-page",
    routeTrackType: "signup",
    exactPath: true,
  },
  {
    path: "/user/profile",
    Component: lazy(() => import("./Profile/ProfilePage")),
    permission: true,
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
  },
  {
    path: "/:workspace",
    Component: lazy(() => import("./Workspaces/WorkspaceLayout")),
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [
      {
        path: "/:workspace/settings",
        Component: lazy(() => import("./Workspaces/WorkspaceForm")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
      },
      {
        path: "/:workspace/members",
        Component: lazy(() => import("./Workspaces/MemberList")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
      },
      {
        path: "/:project",
        Component: lazy(() => import("./Application/ApplicationHome")),
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [
          {
            path: "/:workspace/:project/:service",
            Component: lazy(() => import("./Application/ApplicationHome")),
            moduleName: "",
            routeTrackType: "",
            exactPath: true,
            routes: [
              {
                path: "/:workspace/:project/:service/entities",
                Component: lazy(() => import("./Application/EntitiesTile")),
                moduleName: "",
                routeTrackType: "",
                exactPath: true,
                routes: [
                  {
                    path: "/:workspace/:project/:service/entities/:entityId",
                    moduleName: "",
                    routeTrackType: "",
                    exactPath: true,
                    routes: [
                      {
                        path:
                          "/:workspace/:project/:service/entities/permissions",
                        moduleName: "",
                        routeTrackType: "",
                        exactPath: true,
                        routes: [],
                      },
                      {
                        path: "/:workspace/:project/:service/entities/fields",
                        moduleName: "",
                        routeTrackType: "",
                        exactPath: true,
                        routes: [
                          {
                            path:
                              "/:workspace/:project/:service/entities/fields/:fieldId",
                            moduleName: "",
                            routeTrackType: "",
                            exactPath: true,
                            routes: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                path: "/:workspace/:project/:service/roles",
                Component: lazy(() => import("./Application/RolesTile")),
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
                Component: lazy(() => import("./VersionControl/Commits")),
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
                  import("./Application/git/SyncWithGithubPage")
                ),
                moduleName: "",
                routeTrackType: "",
                exactPath: true,
                routes: [],
              },
              {
                path: "/:workspace/:project/:service/code-view",
                Component: lazy(() =>
                  import("./Application/code-view/CodeViewPage")
                ),
                moduleName: "",
                routeTrackType: "",
                exactPath: true,
                routes: [],
              },
              {
                path: "/:workspace/:project/:service/appSettings",
                Component: lazy(() =>
                  import("./Application/appSettings/AppSettingsPage")
                ),
                moduleName: "",
                routeTrackType: "",
                exactPath: true,
                routes: [
                  {
                    path: "/:workspace/:project/:service/appSettings/update",
                    moduleName: "",
                    routeTrackType: "",
                    exactPath: true,
                    routes: [],
                  },
                  {
                    path:
                      "/:workspace/:project/:service/appSettings/generationSettings",
                    moduleName: "",
                    routeTrackType: "",
                    exactPath: true,
                    routes: [],
                  },
                  {
                    path:
                      "/:workspace/:project/:service/appSettings/directories",
                    moduleName: "",
                    routeTrackType: "",
                    exactPath: true,
                    routes: [],
                  },
                  {
                    path: "/:workspace/:project/:service/appSettings/db",
                    moduleName: "",
                    routeTrackType: "",
                    exactPath: true,
                    routes: [],
                  },
                  {
                    path: "/:workspace/:project/:service/appSettings/auth",
                    moduleName: "",
                    routeTrackType: "",
                    exactPath: true,
                    routes: [],
                  },
                  {
                    path:
                      "/:workspace/:project/:service/appSettings/api-tokens",
                    moduleName: "",
                    routeTrackType: "",
                    exactPath: true,
                    routes: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/create-app",
    Component: lazy(() => import("./Application/CreateAppFromExcel")),
    moduleName: "CreateAppFromExcel",
    permission: true,
    moduleClass: "create-app-from-excel",
    routeTrackType: "create-app",
    exactPath: true,
  },
];

export const OldRoutes: RouteDef[] = [
  {
    path: "/",
    Component: lazy(() => import("./Workspaces/WorkspaceLayout")),
    routeTrackType: "main root",
    exactPath: true,
  },
  {
    path: "/workspace",
    Component: lazy(() => import("./Workspaces/WorkspaceLayout")),
    permission: true,
    moduleName: "WorkspaceLayout",
    exactPath: false,
  },
  {
    path: "/login",
    Component: lazy(() => import("./User/Login")),
    moduleName: "Login",
    moduleClass: "login-page",
    exactPath: true,
  },
  {
    path: "/github-auth-app/callback",
    Component: lazy(() => import("./Application/git/AuthAppWithGitCallback")),
    moduleName: "AuthAppWithGitCallback",
    permission: true,
    exactPath: true,
  },
  {
    path: "/:application([A-Za-z0-9]{12,})",
    Component: lazy(() => import("./Application/ApplicationLayout")),
    moduleName: "ApplicationLayout",
    permission: true,
    exactPath: false,
  },
  {
    path: "/signup",
    Component: lazy(() => import("./User/Signup")),
    moduleName: "Signup",
    exactPath: true,
  },
  {
    path: "/user/profile",
    Component: lazy(() => import("./Workspaces/WorkspaceLayout")),
    permission: true,
    moduleName: "ProfilePage",
    exactPath: true,
  },
  {
    path: "/create-app",
    Component: lazy(() => import("./Application/CreateAppFromExcel")),
    moduleName: "CreateAppFromExcel",
    permission: true,
    exactPath: true,
  },
];
