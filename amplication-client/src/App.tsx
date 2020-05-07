import React from "react";
import { Route, Switch } from "react-router-dom";
import { TopAppBarFixedAdjust } from "@rmwc/top-app-bar";
import Header from "./Header";
import Application from "./Application";
import Home from "./Home";
import { user, organization } from "./mock.json";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "@material/icon-button/dist/mdc.icon-button.css";
import "@material/ripple/dist/mdc.ripple.css";
import "./App.css";

function App() {
  return (
    <div>
      <Header organization={organization} user={user} />
      <TopAppBarFixedAdjust />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/applications/:application" component={Application} />
      </Switch>
    </div>
  );
}

export default App;
