import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import useAuthenticated from "../use-authenticated";

type Props = Omit<RouteProps, "render">;

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
// Based on: https://reacttraining.com/react-router/web/example/auth-workflow
function PrivateRoute({ component, children, ...rest }: Props) {
  const authenticated = useAuthenticated();
  return (
    <Route
      {...rest}
      render={(props) => {
        const { location } = props;
        const childNode = component
          ? React.createElement(component, props)
          : children;
        return authenticated ? (
          childNode
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

export default PrivateRoute;
