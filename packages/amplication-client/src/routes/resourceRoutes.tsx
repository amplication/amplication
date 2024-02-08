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
    path: "/:workspace/:project/:resource/preview-break-the-monolith-options",
    Component: lazy(
      () => import("../Resource/break-the-monolith/BreakTheMonolithOptionsPage")
    ),
    moduleName: "breakTheMonolithOptionsPage",
    moduleClass: "break-the-monolith-options-page",
    routeTrackType: "",
    exactPath: true,
    isAnalytics: true,
  },
  {
    path: "/:workspace/:project/:resource/preview-break-the-monolith-overview",
    Component: lazy(
      () =>
        import("../Resource/break-the-monolith/BreakTheMonolithOverviewPage")
    ),
    moduleName: "breakTheMonolithOverviewPage",
    moduleClass: "break-the-monolith-overview-page",
    routeTrackType: "",
    exactPath: true,
    isAnalytics: true,
  },
];

export default resourceRoutes;
