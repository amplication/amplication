import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import { Drawer, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";

import ApplicationHome from "./ApplicationHome";
import "./Application.css";

import "@material/drawer/dist/mdc.drawer.css";
import "@material/list/dist/mdc.list.css";
import "@material/tab-bar/dist/mdc.tab-bar.css";
import "@material/tab/dist/mdc.tab.css";
import "@material/tab-scroller/dist/mdc.tab-scroller.css";
import "@material/tab-indicator/dist/mdc.tab-indicator.css";
import "@material/ripple/dist/mdc.ripple.css";
import "@material/card/dist/mdc.card.css";

function Application() {
  return (
    <div className="application">
      <Drawer>
        <DrawerContent>
          <List>
            <Link to=".">
              <ListItem>App</ListItem>
            </Link>
            <Link to="data">
              <ListItem>Data</ListItem>
            </Link>
            <Link to="pages">
              <ListItem>Pages</ListItem>
            </Link>
            <Link to="workflow">
              <ListItem>Workflow</ListItem>
            </Link>
            <Link to="connectors">
              <ListItem>Connectors</ListItem>
            </Link>
            <Link to="api">
              <ListItem>API</ListItem>
            </Link>
            <Link to="settings">
              <ListItem>Settings</ListItem>
            </Link>
          </List>
        </DrawerContent>
      </Drawer>
      <Switch>
        <Route
          exact
          path="/applications/:application/"
          component={ApplicationHome}
        />
      </Switch>
    </div>
  );
}

export default Application;
