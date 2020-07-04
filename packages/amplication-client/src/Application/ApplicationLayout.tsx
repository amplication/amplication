import React from "react";
import { Switch, Route, match } from "react-router-dom";

import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { List } from "@rmwc/list";
import "@rmwc/list/styles";

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

import ApplicationNavigationListItem from "./ApplicationNavigationListItem";

type Props = {
  match: match<{
    application: string;
    appModule: string;
  }>;
};

/**@todo: create a menu component to show the list of items based on input parameter including the selected item  */

function ApplicationLayout({ match }: Props) {
  const { application } = match.params;
  const menuItems = [
    {
      title: "Application Home",
      to: `/${application}/home`,
      icon: iconApp,
      iconSelected: iconApp,
    },
    {
      title: "Entities",
      to: `/${application}/entities`,
      icon: iconEntity,
      iconSelected: iconEntitySelected,
    },
    {
      title: "Pages",
      to: `/${application}/pages`,
      icon: iconPages,
      iconSelected: iconPagesSelected,
    },
    {
      title: "Workflow",
      to: `/${application}/workflow`,
      icon: iconFlow,
      iconSelected: iconFlowSelected,
    },
    {
      title: "Connectors",
      to: `/${application}/connectors`,
      icon: iconConnector,
      iconSelected: iconConnectorSelected,
    },
    {
      title: "API",
      to: `/${application}/api`,
      icon: iconApi,
      iconSelected: iconApiSelected,
    },
    {
      title: "Settings",
      to: `/${application}/settings`,
      icon: iconSettings,
      iconSelected: iconSettingsSelected,
    },
  ];

  return (
    <div className="application-layout">
      <Drawer className="application-layout__menu">
        {" "}
        <DrawerContent>
          <List>
            {menuItems.map((item) => (
              <ApplicationNavigationListItem menuItem={item} />
            ))}
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
