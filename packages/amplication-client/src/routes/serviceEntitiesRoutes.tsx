const serviceEntitiesRoutes = [
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
];

export default serviceEntitiesRoutes;