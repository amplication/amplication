import { lazy } from "react";

const resourceRoutes = [
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
    path: "/:workspace/:project/:resource/break-the-monolith-preview-environment",
    Component: lazy(
      () =>
        import("../Resource/break-the-monolith/CreateBTMPreviewEnvironmentPage")
    ),
    moduleName: "CreateBTMPreviewEnvironmentPage",
    moduleClass: "create-btm-preview-environment-page",
    routeTrackType: "",
    exactPath: true,
    isAnalytics: true,
  },
  {
    path: "/:workspace/:project/:resource/break-the-monolith-preview",
    Component: lazy(
      () => import("../Resource/break-the-monolith/BreakTheMonolithPreviewPage")
    ),
    moduleName: "BreakTheMonolithPreviewPage",
    moduleClass: "break-the-monolith-preview-page",
    routeTrackType: "",
    exactPath: true,
    isAnalytics: true,
  },
];

export default resourceRoutes;
