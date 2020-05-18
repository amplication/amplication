import React from "react";
import { Switch, Route, Link, match } from "react-router-dom";

import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { List, ListItem } from "@rmwc/list";
import "@rmwc/list/styles";

import ApplicationHome from "./ApplicationHome";
import Entities from "./Entities/Entities";
import "./Application.css";

type Props = {
  match: match<{
    application: string;
  }>;
};

function Application({ match }: Props) {
  const { application } = match.params;
  return (
    <div className="application">
      <Drawer>
        <DrawerContent>
          <List>
            <Link to={`/${application}`}>
              <ListItem>App</ListItem>
            </Link>
            <Link to={`/${application}/entities/`}>
              <ListItem>Entities</ListItem>
            </Link>
            <Link to={`/${application}/pages`}>
              <ListItem>Pages</ListItem>
            </Link>
            <Link to={`/${application}/workflow`}>
              <ListItem>Workflow</ListItem>
            </Link>
            <Link to={`/${application}/connectors`}>
              <ListItem>Connectors</ListItem>
            </Link>
            <Link to={`/${application}/api`}>
              <ListItem>API</ListItem>
            </Link>
            <Link to={`/${application}/settings`}>
              <ListItem>Settings</ListItem>
            </Link>
          </List>
        </DrawerContent>
      </Drawer>
      <Switch>
        <Route exact path="/:application/" component={ApplicationHome} />
        <Route path="/:application/entities/" component={Entities} />
      </Switch>
    </div>
  );
}

export default Application;
