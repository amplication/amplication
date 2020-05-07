import React, { useCallback, useState } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { TopAppBarFixedAdjust } from "@rmwc/top-app-bar";
import Header from "./Header";
import Application from "./Application";
import Login from "./Login";
import Home from "./Home";
import { LoginCredentials, User } from "./types";
import * as mock from "./mock.json";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "@material/icon-button/dist/mdc.icon-button.css";
import "@material/ripple/dist/mdc.ripple.css";
import "./App.css";
import PrivateRoute from "./PrivateRoute";

function App() {
  const history = useHistory();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const login = useCallback((credentials: LoginCredentials) => {
    setUser(mock.user);
    // @ts-ignore
    const { from } = location.state || { from: { pathname: "/" } };
    history.replace(from);
  }, []);
  return (
    <>
      <Header organization={mock.organization} user={user} />
      <TopAppBarFixedAdjust />
      <Switch>
        <Route path="/login" render={() => <Login onSubmit={login} />} />
        <PrivateRoute exact path="/" user={user}>
          <Home />
        </PrivateRoute>
        <PrivateRoute path="/applications/:application" user={user}>
          <Application />
        </PrivateRoute>
      </Switch>
    </>
  );
}

export default App;
