import { ComponentType, lazy, LazyExoticComponent } from "react";
import resourceRoutes from "./resourceRoutes";

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
  isAnalytics?: boolean
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
        path: "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})",
        Component: lazy(() => import("../Project/ProjectPage")),
        moduleName: "ProjectPage",
        moduleClass: "project-page",
        exactPath: false,
        routes: [
          {
            path:
              "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/code-view",
            Component: lazy(() => import("../Resource/code-view/CodeViewPage")),
            moduleName: "CodeViewPage",
            moduleClass: "code-view-page",
            routeTrackType: "",
            exactPath: false,
            isAnalytics: true,
          },
          {
            path:
              "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/commits/:commit([A-Za-z0-9-]{20,})?",
            Component: lazy(() => import("../VersionControl/CommitsPage")),
            moduleName: "CommitsPage",
            moduleClass: "commits-page",
            routeTrackType: "",
            exactPath: false,
            isAnalytics: true,
          },
          {
            path:
              "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/pending-changes",
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
            path:
              "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/create-resource",
            Component: lazy(
              () => import("../Resource/create-resource/CreateServiceWizard")
            ),
            moduleName: "CreateServiceWizard",
            moduleClass: "create-service-wizard",
            routeTrackType: "",
            exactPath: true,
            isAnalytics: true,
          },
          {
            path:
              "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})",
            Component: lazy(() => import("../Resource/ResourceHome")),
            moduleName: "",
            routeTrackType: "",
            exactPath: false,
            routes: resourceRoutes,
          },
        ],
      },
      {
        path: "/:workspace([A-Za-z0-9-]{20,})/members",
        Component: lazy(() => import("../Workspaces/MemberList")),
        moduleName: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
      {
        path: "/:workspace([A-Za-z0-9-]{20,})/settings",
        Component: lazy(() => import("../Workspaces/WorkspaceForm")),
        moduleName: "",
        exactPath: true,
        routes: [],
        isAnalytics: true,
      },
    ],
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
      () => import("../Resource/git/AuthResourceWithGitCallback")
    ),
    moduleName: "AuthAppWithGitCallback",
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
    path: "/user/profile",
    Component: lazy(() => import("../Profile/ProfilePage")),
    permission: true,
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
    isAnalytics: true,
  },
];
