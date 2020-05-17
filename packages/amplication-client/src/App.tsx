import React from "react";
import { Route, Switch } from "react-router-dom";
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

function App() {
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
        <PrivateRoute exact path="/">
          <Applications />
        </PrivateRoute>
        <PrivateRoute path="/new">
          <NewApplication />
        </PrivateRoute>
        <PrivateRoute path="/:application">
          <Application />
        </PrivateRoute>
      </Switch>
    </>
  );
}

export default App;
