import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import ApplicationLayout from "./Application/ApplicationLayout";
import NewApplication from "./Application/NewApplication";
import Login from "./User/Login";
import Signup from "./User/Signup";
import Applications from "./Application/Applications";
import User from "./User/User";

import PrivateRoute from "./authentication/PrivateRoute";
import BreadcrumbsProvider from "./Layout/BreadcrumbsProvider";
import CommandPalette from "./CommandPalette/CommandPalette";

const { NODE_ENV } = process.env;

function App() {
  const history = useHistory();
  if (NODE_ENV === "development") {
    history.listen((...args) => {
      console.debug("History: ", ...args);
    });
  }

  return (
    <BreadcrumbsProvider>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/me">
          <User />
        </PrivateRoute>
        <PrivateRoute exact path="/" component={Applications} />
        <PrivateRoute path="/new" component={NewApplication} />
        <PrivateRoute path="/:application" component={ApplicationLayout} />
      </Switch>
      <CommandPalette />
    </BreadcrumbsProvider>
  );
}

export default App;
