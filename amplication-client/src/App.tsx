import React from "react";
import { Route, Switch } from "react-router-dom";
import { TopAppBarFixedAdjust } from "@rmwc/top-app-bar";
import Header from "./Header";
import Application from "./Application";
import Home from "./Home";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "@material/icon-button/dist/mdc.icon-button.css";
import "@material/ripple/dist/mdc.ripple.css";
import "./App.css";

const data = {
  organization: {
    name: "First Organization",
  },
  user: {
    image:
      "https://247wallst.files.wordpress.com/2016/05/warren-buffett-square-e1462828190521.jpg?w=400",
    name: "User Name",
  },
};

function App() {
  return (
    <div>
      <Header organization={data.organization} user={data.user} />
      <TopAppBarFixedAdjust />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/applications/:application" component={Application} />
      </Switch>
    </div>
  );
}

export default App;
