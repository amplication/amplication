import React from "react";
import { Switch, Route, match } from "react-router-dom";

import { SideNav } from "@primer/components";

import ApplicationHome from "./ApplicationHome";
import Entities from "../Entities/Entities";
import Pages from "../Pages/Pages";
import EntityPage from "../Pages/EntityPage";
import NewEntityPage from "../Pages/NewEntityPage";
import "./ApplicationLayout.scss";
import iconEntitySelected from "../assets/icons/entity-selected.svg";
import iconPagesSelected from "../assets/icons/pages-selected.svg";
import iconFlowSelected from "../assets/icons/flow-selected.svg";
import iconConnectorSelected from "../assets/icons/connector-selected.svg";
import iconApiSelected from "../assets/icons/api-selected.svg";
import iconSettingsSelected from "../assets/icons/settings-selected.svg";
import iconApp from "../assets/icons/app-placeholder.svg"; /**@todo: replace app placeholder with a component that shows an automated icon or a custom icon logo */

import MenuItem from "../Layout/MenuItem";

import { MainMenu } from "../util/teleporter";

type Props = {
  match: match<{
    application: string;
    appModule: string;
    className?: string;
  }>;
};

function ApplicationLayout({ match }: Props) {
  const { application } = match.params;

  return (
    <>
      <MainMenu.Source>
        <SideNav className="side-nav">
          <MenuItem
            title="Application Home"
            to={`/${application}/home`}
            icon={iconApp}
            className="app-icon"
          />
          <MenuItem
            title="Entities"
            to={`/${application}/entities`}
            icon={iconEntitySelected}
          />
          <MenuItem
            title="Pages"
            to={`/${application}/pages`}
            icon={iconPagesSelected}
          />
          <MenuItem
            title="Workflow"
            to={`/${application}/workflow`}
            icon={iconFlowSelected}
          />
          <MenuItem
            title="Connectors"
            to={`/${application}/connectors`}
            icon={iconConnectorSelected}
          />
          <MenuItem
            title="API"
            to={`/${application}/api`}
            icon={iconApiSelected}
          />
          <MenuItem
            title="Settings"
            to={`/${application}/settings`}
            icon={iconSettingsSelected}
          />
        </SideNav>
      </MainMenu.Source>

      <div className="application-layout">
        <Switch>
          <Route exact path="/:application/" component={ApplicationHome} />
          <Route path="/:application/entities/" component={Entities} />
          <Route path="/:application/pages/" component={Pages} />
          <Route
            path="/:application/entity-page/new"
            component={NewEntityPage}
          />
          <Route
            path="/:application/entity-page/:entityPageId"
            component={EntityPage}
          />
        </Switch>
      </div>
    </>
  );
}

export default ApplicationLayout;
