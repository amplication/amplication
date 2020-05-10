import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import useAuthenticated from "./use-authenticated";

type Props = Omit<RouteProps, "component" | "render">;

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
// Based on: https://reacttraining.com/react-router/web/example/auth-workflow
function PrivateRoute({ children, ...rest }: Props) {
  const authenticated = useAuthenticated();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
