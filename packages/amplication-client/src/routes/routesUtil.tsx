import React, { Suspense } from "react";
import { match, Redirect, Route, Switch } from "react-router-dom";
import { RouteDef } from "./appRoutes";
import useAuthenticated from "../authentication/use-authenticated";

export enum MatchRoute {
  WORKSPACE = "workspace",
  PROJECT = "project",
  RESOURCE = "resource",
  COMMIT_ID = "commitId",
  ENTITY_ID = "entityId",
  FIELD_ID = "fieldId",
  BUILD_ID = "buildId",
}

export type AppMatchRoute = {
  match: match<{ [property in MatchRoute]: string }>;
};

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
          const { location } = props;
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
