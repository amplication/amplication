const resourceEntitiesRoutes = [
  {
    path:
      "/:workspace/:project/:resource/entities/permissions",
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [],
  },
  {
    path: "/:workspace/:project/:resource/entities/fields",
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [
      {
        path:
          "/:workspace/:project/:resource/entities/fields/:fieldId",
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: [],
      },
    ],
  },
];

export default resourceEntitiesRoutes;