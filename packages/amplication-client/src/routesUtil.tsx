import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { RouteDef } from "./appRoutes";
import useAuthenticated from "./authentication/use-authenticated";
// import usePageTracking from './util/usePageTracking';

const LazyRouteWrapper: React.FC<{ route: RouteDef }> = ({ route }) => {
  const authenticated = useAuthenticated();

  return (
    // fallback component will be individual per component
    <Suspense fallback={<div>...Loading</div>}>
      <Route
        path={route.path}
        exact={route.exactPath}
        render={(props) => {
          const { location } = props;
          const nestedRoutes = route.routes && routesGenerator(route.routes);

          return route.redirect ? (
            <Redirect to={route.redirect} />
          ) : route.permission ? (
            authenticated ? (
              route.Component &&
              React.createElement(route.Component, {
                ...props,
                InnerRoutes: nestedRoutes,
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
            React.createElement(route.Component, {
              ...props,
              InnerRoutes: nestedRoutes,
            })
          );
        }}
      />
    </Suspense>
  );
};

// eslint-disable-next-line no-undef
export const routesGenerator: (routes: RouteDef[]) => JSX.Element = (
  routes
) => {
  return (
    <Router>
      <Switch>
        <Route path="/">
          {routes.map((route: RouteDef) => (
            <LazyRouteWrapper key={route.path} route={route} />
          ))}
        </Route>
      </Switch>
    </Router>
  );
};
