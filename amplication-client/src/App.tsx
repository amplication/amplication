import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
  TopAppBarActionItem,
  TopAppBarFixedAdjust,
} from "@rmwc/top-app-bar";
import AppPage from "./AppPage";
import Home from "./Home";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "@material/icon-button/dist/mdc.icon-button.css";
import "@material/ripple/dist/mdc.ripple.css";
import "./App.css";

const data = {
  organization: {
    name: "First Organization",
  },
};

function App() {
  return (
    <div>
      <TopAppBar>
        <TopAppBarRow>
          <TopAppBarSection alignStart>
            <TopAppBarTitle>
              <Link to="/">{data.organization.name}</Link>
            </TopAppBarTitle>
          </TopAppBarSection>
          <TopAppBarSection alignEnd>
            <TopAppBarActionItem icon="search" />
            <TopAppBarActionItem icon="notifications" />
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <TopAppBarFixedAdjust />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/applications/:app" component={AppPage} />
      </Switch>
    </div>
  );
}

export default App;
