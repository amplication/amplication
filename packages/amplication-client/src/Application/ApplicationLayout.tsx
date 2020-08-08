import React from "react";
import { Switch, Route, match } from "react-router-dom";

import { SideNav } from "@primer/components";

import ApplicationHome from "./ApplicationHome";
import Entities from "../Entity/Entities";
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

import MenuItem from "../Layout/MenuItem";
import MainLayout from "../Layout/MainLayout";
import ApplicationBadge from "./ApplicationBadge";

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
      <MainLayout>
        <MainLayout.Menu
          render={(expanded) => {
            return (
              <>
                <ApplicationBadge
                  expanded={expanded}
                  url={`/${application}/home`}
                  name="My Cool App"
                />
                <SideNav className="side-nav">
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
              </>
            );
          }}
        ></MainLayout.Menu>
        <MainLayout.Content>
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
        </MainLayout.Content>
      </MainLayout>
    </>
  );
}

export default ApplicationLayout;
