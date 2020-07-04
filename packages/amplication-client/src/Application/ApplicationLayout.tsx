import React from "react";
import { Switch, Route, Link, match } from "react-router-dom";

import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { List, ListItem } from "@rmwc/list";
import "@rmwc/list/styles";
import { Icon } from "@rmwc/icon";

import ApplicationHome from "./ApplicationHome";
import Entities from "../Entities/Entities";
import Pages from "../Pages/Pages";
import "./ApplicationLayout.scss";
import iconEntity from "../assets/icons/entity.svg";
import iconPages from "../assets/icons/pages.svg";
import iconFlow from "../assets/icons/flow.svg";
import iconConnector from "../assets/icons/connector.svg";
import iconApi from "../assets/icons/api.svg";
import iconSettings from "../assets/icons/settings.svg";
import iconApp from "../assets/icons/app-placeholder.svg"; /**@todo: replace app placeholder with a component that shows an automated icon or a custom icon logo */

type Props = {
  match: match<{
    application: string;
  }>;
};

/**@todo: create a menu component to show the list of items based on input parameter including the selected item  */

function ApplicationLayout({ match }: Props) {
  const { application } = match.params;
  return (
    <div className="application-layout">
      <Drawer className="application-layout__menu">
        {" "}
        <DrawerContent>
          <List>
            <ListItem>
              <Link title="Application Home" to={`/${application}`}>
                <Icon icon={iconApp} className="logo" />
              </Link>
            </ListItem>
            <ListItem>
              <Link title="Entities" to={`/${application}/entities/`}>
                <Icon icon={iconEntity} className="logo" />
              </Link>
            </ListItem>
            <ListItem>
              <Link title="Pages" to={`/${application}/pages`}>
                <Icon icon={iconPages} className="logo" />
              </Link>
            </ListItem>
            <ListItem>
              <Link title="Workflow" to={`/${application}/workflow`}>
                <Icon icon={iconFlow} className="logo" />
              </Link>
            </ListItem>
            <ListItem>
              <Link title="Connectors" to={`/${application}/connectors`}>
                <Icon icon={iconConnector} className="logo" />
              </Link>
            </ListItem>
            <ListItem>
              <Link title="API" to={`/${application}/api`}>
                <Icon icon={iconApi} className="logo" />
              </Link>
            </ListItem>
            <ListItem>
              <Link title="Settings" to={`/${application}/settings`}>
                <Icon icon={iconSettings} className="logo" />
              </Link>
            </ListItem>
          </List>
        </DrawerContent>
      </Drawer>
      <div className="application-layout__content">
        <Switch>
          <Route exact path="/:application/" component={ApplicationHome} />
          <Route path="/:application/entities/" component={Entities} />
          <Route path="/:application/pages/" component={Pages} />
        </Switch>
      </div>
    </div>
  );
}

export default ApplicationLayout;
