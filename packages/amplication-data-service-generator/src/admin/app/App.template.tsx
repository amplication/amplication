import React, { useCallback } from "react";
import { Route, Switch, useHistory, Link } from "react-router-dom";
// @ts-ignore
import Navigation from "./Navigation";
// @ts-ignore
import Login from "./Login";
// @ts-ignore
import { Credentials, setCredentials, removeCredentials } from "./auth";
import { Menu } from "@amplication/design-system";

declare const ROUTES: React.ReactElement[];

const App = (): React.ReactElement => {
  const history = useHistory();
  const handleLogin = useCallback(
    (credentials: Credentials) => {
      setCredentials(credentials);
      history.push("/");
    },
    [history]
  );

  return (
    <div>
      <Link to="/">Home</Link>
      <Switch>
        <Route path="/login" render={() => <Login onLogin={handleLogin} />} />
        <Route path="/" component={AppLayout} />
      </Switch>
    </div>
  );
};

export default App;

const AppLayout = (): React.ReactElement => {
  const history = useHistory();
  const signOut = useCallback(() => {
    removeCredentials();
    history.push("/login");
  }, [history]);

  return (
    <div>
      <Menu onSignOutClick={signOut} />
      <Switch>
        <Route exact path="/" component={Navigation} />
        {ROUTES}
      </Switch>
    </div>
  );
};
