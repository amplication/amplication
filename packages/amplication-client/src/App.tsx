import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { TopAppBarFixedAdjust } from "@rmwc/top-app-bar";
import Header from "./Layout/Header";
import ApplicationLayout from "./Application/ApplicationLayout";
import NewApplication from "./Application/NewApplication";
import Login from "./User/Login";
import Signup from "./User/Signup";
import Applications from "./Application/Applications";
import User from "./User/User";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "@material/icon-button/dist/mdc.icon-button.css";
import "@material/ripple/dist/mdc.ripple.css";
import PrivateRoute from "./authentication/PrivateRoute";

const { NODE_ENV } = process.env;

function App() {
  const history = useHistory();
  if (NODE_ENV === "development") {
    history.listen((...args) => {
      console.debug("History: ", ...args);
    });
  }
  return (
    <>
      <Header />
      <TopAppBarFixedAdjust />
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
    </>
  );
}

export default App;
