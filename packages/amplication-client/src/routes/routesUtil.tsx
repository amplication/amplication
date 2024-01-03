import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteDef } from "./appRoutes";
import useAuthenticated from "../authentication/use-authenticated";
import * as analytics from "../util/analytics";
import { awsRum } from "../util/rum";

//use lazy loading imports to prevent inclusion of the components CSS in the main bundle
const CircularProgress = lazy(
  () =>
    import(
      "@amplication/ui/design-system/components/CircularProgress/CircularProgress"
    )
);
const NotFoundPage = lazy(() => import("../404/NotFoundPage"));

export type AppRouteProps = {
  moduleName: string | undefined;
  moduleClass: string;
  innerRoutes: JSX.Element | undefined;
  tabRoutes: JSX.Element | undefined;
  tabRoutesDef: RouteDef[] | undefined;
};

export const PURCHASE_URL = "@@purchase";

const setPurchaseRoute = () => {
  localStorage.removeItem(PURCHASE_URL);

  localStorage.setItem(PURCHASE_URL, Date.now().toString());
};

const LazyRouteWrapper: React.FC<{
  route: RouteDef;
}> = ({ route }) => {
  const authenticated = useAuthenticated();

  return (
    // fallback component will be individual per component
    <Suspense fallback={<CircularProgress centerToParent />}>
      <Route
        path={route.path}
        exact={route.exactPath}
        render={(props) => {
          const { location, match } = props;

          route.isAnalytics &&
            pageTracking(match.path, match.url, match.params);

          const nestedRoutes =
            route.routes && routesGenerator(route.routes, route.path);
          const tabRoutes =
            route.tabRoutes && routesGenerator(route.tabRoutes, route.path);

          const appRouteProps: AppRouteProps = {
            moduleName: route.moduleName,
            moduleClass: route.moduleClass || "",
            innerRoutes: nestedRoutes,
            tabRoutes: tabRoutes,
            tabRoutesDef: route.tabRoutes,
          };

          if (route.path === "/purchase" && props.history.action === "POP")
            setPurchaseRoute();

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
                  search: location.search,
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
              <>
                {/* <div>{route.path}</div> */}
                {React.createElement(route.Component, {
                  ...props,
                  ...appRouteProps,
                })}
              </>
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
      <Route component={NotFoundPage} />
    </Switch>
  );
};

const pageTracking = (path: string, url: string, params: any) => {
  analytics.page(path.replaceAll("/", "-"), {
    path,
    url,
    params: params,
  });

  const cleanPath = path.replaceAll("([A-Za-z0-9-]{20,})", "");
  awsRum.recordPageView({
    pageId: cleanPath,
    pageAttributes: params,
  });
};
