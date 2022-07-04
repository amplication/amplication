import React, { ComponentType, Suspense, lazy, LazyExoticComponent} from 'react';


const Login: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./User/Login").then(comp => ({ default: Login || comp })));
const Signup: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./User/Signup").then(comp => ({ default: Signup || comp })));
const AuthAppWithGitCallback: LazyExoticComponent<ComponentType<any>> = import("./Application/git/AuthAppWithGitCallback").then(comp => ({ default: AuthAppWithGitCallback || comp }));
const CreateAppFromExcel: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./Application/CreateAppFromExcel").then(comp => ({ default: comp.CreateAppFromExcel || comp })));





const Routes = [
  {
    pathNames: ["/login"],
    component: Login,
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
  },
  {
    pathNames: ["/github-auth-app/callback"],
    component: AuthAppWithGitCallback,
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
  },
  {
    pathNames: ["/signup"],
    component: "/",
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
  },
  {
    pathNames: ["/user"],
    component: "/",
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [
      {
        pathNames: ["/profile"],
        component: "/",
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: []
      },
    ]
  },
  {
    pathNames: ["/", "/workspace"],
    component: "/",
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: [
      {
        pathNames: ["/settings"],
        component: "/",
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: []
      },
      {
        pathNames: ["/members"],
        component: "/",
        moduleName: "",
        routeTrackType: "",
        exactPath: true,
        routes: []
      },
    ]
  },
  {
    pathNames: ["/:application"],
    component: "/",
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: []
  },
  {
    pathNames: ["/github-auth-app/callback"],
    component: "/",
    moduleName: "",
    routeTrackType: "",
    exactPath: true,
    routes: []
  },
  // {
  //   pathNames: ["/", "/workspace"],
  //   component: "/",
  //   moduleName: "",
  //   routeTrackType: "",
  //   exactPath: true,
  //   routes: []
  // },
  // {
  //   pathNames: ["/", "/workspace"],
  //   component: "/",
  //   moduleName: "",
  //   routeTrackType: "",
  //   exactPath: true,
  //   routes: []
  // }
]

const LazyRouteWrapper = () => {

}

const LoadComponent: React.FC<{}> = ({}) => {

}

export const RoutesGenerator = () => {

}
