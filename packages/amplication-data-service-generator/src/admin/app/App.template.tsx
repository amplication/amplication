import React, { useCallback } from "react";
import { Route, useHistory } from "react-router-dom";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import Navigation from "./Navigation";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import Login from "./Login";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { Credentials, setCredentials } from "./auth";

declare const ROUTES: React.ReactNode[];

const App = (): React.ReactNode => {
  const history = useHistory();
  const handleLogin = useCallback(
    (credentials: Credentials) => {
      setCredentials(credentials);
      history.push("/");
    },
    [history]
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
