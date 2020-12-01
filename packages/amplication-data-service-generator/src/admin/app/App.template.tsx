import React, { useCallback } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
// @ts-ignore
import Navigation from "./Navigation";
// @ts-ignore
import Login from "./Login";
// @ts-ignore
import { Credentials, setCredentials } from "./auth";

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

  const loginRoute = (
    <Route path="/login" render={() => <Login onLogin={handleLogin} />} />
  );
  return (
    <div>
      <Navigation />
      {ROUTES}
    </div>
  );
};

export default App;
