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
import iconEntitySelected from "../assets/icons/entity-selected.svg";
import iconPages from "../assets/icons/pages.svg";
import iconPagesSelected from "../assets/icons/pages-selected.svg";
import iconFlow from "../assets/icons/flow.svg";
import iconFlowSelected from "../assets/icons/flow-selected.svg";
import iconConnector from "../assets/icons/connector.svg";
import iconConnectorSelected from "../assets/icons/connector-selected.svg";
import iconApi from "../assets/icons/api.svg";
import iconApiSelected from "../assets/icons/api-selected.svg";
import iconSettings from "../assets/icons/settings.svg";
import iconSettingsSelected from "../assets/icons/settings-selected.svg";
import iconApp from "../assets/icons/app-placeholder.svg"; /**@todo: replace app placeholder with a component that shows an automated icon or a custom icon logo */

type Props = {
  match: match<{
    application: string;
    appModule: string;
  }>;
};

/**@todo: create a menu component to show the list of items based on input parameter including the selected item  */

function ApplicationLayout({ match }: Props) {
  const { application, appModule } = match.params;
  return (
    <div className="application-layout">
      <Drawer className="application-layout__menu">
        {" "}
        <DrawerContent>
          <List>
            <ListItem activated={appModule === ""}>
              <Link title="Application Home" to={`/${application}/home`}>
                <Icon icon={iconApp} className="logo" />
              </Link>
            </ListItem>
            <ListItem activated={appModule === "entities"}>
              <Link title="Entities" to={`/${application}/entities/`}>
                <Icon
                  icon={
                    appModule === "entities" ? iconEntitySelected : iconEntity
                  }
                />
              </Link>
            </ListItem>
            <ListItem activated={appModule === "pages"}>
              <Link title="Pages" to={`/${application}/pages`}>
                <Icon
                  icon={appModule === "pages" ? iconPagesSelected : iconPages}
                />
              </Link>
            </ListItem>
            <ListItem activated={appModule === "workflow"}>
              <Link title="Workflow" to={`/${application}/workflow`}>
                <Icon
                  icon={appModule === "workflow" ? iconFlowSelected : iconFlow}
                />
              </Link>
            </ListItem>
            <ListItem activated={appModule === "connectors"}>
              <Link title="Connectors" to={`/${application}/connectors`}>
                <Icon
                  icon={
                    appModule === "connectors"
                      ? iconConnectorSelected
                      : iconConnector
                  }
                />
              </Link>
            </ListItem>
            <ListItem activated={appModule === "api"}>
              <Link title="API" to={`/${application}/api`}>
                <Icon icon={appModule === "api" ? iconApiSelected : iconApi} />
              </Link>
            </ListItem>
            <ListItem activated={appModule === "settings"}>
              <Link title="Settings" to={`/${application}/settings`}>
                <Icon
                  icon={
                    appModule === "settings"
                      ? iconSettingsSelected
                      : iconSettings
                  }
                />
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
