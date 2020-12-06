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

  return (
    <div>
      <Switch>
        <Route path="/login" render={() => <Login onLogin={handleLogin} />} />
        <Route exact path="/" component={Navigation} />
        {ROUTES}
      </Switch>
    </div>
  );
};

export default App;
