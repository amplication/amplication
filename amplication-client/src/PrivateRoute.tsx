import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { User } from "./types";

type Props = Omit<RouteProps, "component" | "render"> & {
  user: User | null;
};

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, user, ...rest }: Props) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user !== null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
