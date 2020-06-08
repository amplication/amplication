import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { TopAppBarFixedAdjust } from "@rmwc/top-app-bar";
import Header from "./Header";
import Application from "./Application";
import NewApplication from "./NewApplication";
import Login from "./Login";
import Signup from "./Signup";
import Applications from "./Applications";
import User from "./User";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "@material/icon-button/dist/mdc.icon-button.css";
import "@material/ripple/dist/mdc.ripple.css";
import "./App.css";
import PrivateRoute from "./PrivateRoute";

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
        <PrivateRoute path="/:application" component={Application} />
      </Switch>
    </>
  );
}

export default App;
