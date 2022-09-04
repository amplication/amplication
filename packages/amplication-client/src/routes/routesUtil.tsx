import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteDef } from "./appRoutes";
import useAuthenticated from "../authentication/use-authenticated";
import * as analytics from "../util/analytics";

export type AppRouteProps = {
  moduleName: string | undefined;
  moduleClass: string;
  // eslint-disable-next-line no-undef
  innerRoutes: JSX.Element | undefined;
};

const LazyRouteWrapper: React.FC<{
  route: RouteDef;
}> = ({ route }) => {
  const authenticated = useAuthenticated();

  return (
    // fallback component will be individual per component
    <Suspense fallback={<div>...Loading</div>}>
      <Route
        path={route.path}
        exact={route.exactPath}
        render={(props) => {
          const { location , match } = props;

          route.isAnalytics &&  pageTracking(match.path, match.url, match.params); 
          const nestedRoutes =
            route.routes && routesGenerator(route.routes, route.path);

          const appRouteProps: AppRouteProps = {
            moduleName: route.moduleName,
            moduleClass: route.moduleClass || "",
            innerRoutes: nestedRoutes,
          };

          return route.redirect ? (
            <Redirect
              to={{
                pathname: route.redirect,
                search: "",
              }}
            />
          ) : route.permission ? (
            authenticated ? (
              route.Component &&
              React.createElement(route.Component, {
                ...props,
                ...appRouteProps,
              })
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location },
                }}
              />
            )
          ) : (
            route.Component &&
            (authenticated && ["/login", "/signup"].includes(route.path) ? (
              <Redirect
                to={{
                  pathname: "/",
                }}
              />
            ) : (
              React.createElement(route.Component, {
                ...props,
                ...appRouteProps,
              })
            ))
          );
        }}
      />
    </Suspense>
  );
};

export const routesGenerator: (
  routes: RouteDef[],
  path?: string
  // eslint-disable-next-line no-undef
) => JSX.Element = (routes, path = "/") => {
  return (
    <Switch>
      <Route path={path}>
        {routes.map((route: RouteDef) => (
          <LazyRouteWrapper key={route.path} route={route} />
        ))}
      </Route>
    </Switch>
  );
};

const pageTracking = (path: string, url: string, params: any)=> {
  analytics.page(path.replaceAll("/", "-"), {
    path,
    url,
    params: params,
  });
}
