import { gql } from "@apollo/client";
import React from "react";
import { Switch, match } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import * as models from "../models";
import MenuItemWithFixedPanel from "../Layout/MenuItemWithFixedPanel";
import { PendingChangeItem } from "../VersionControl/PendingChangesContext";
import ApplicationList from "./ApplicationList";
import InnerTabLink from "../Layout/InnerTabLink";
import WorkspaceSelector from "./WorkspaceSelector";
import WorkspaceForm from "./WorkspaceForm";
import PageContent from "../Layout/PageContent";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";
import "./WorkspaceLayout.scss";

export type ApplicationData = {
  app: models.App;
};

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

const CLASS_NAME = "workspaces-layout";

type Props = {
  match: match<{
    workspace: string;
  }>;
};

function WorkspaceLayout({ match }: Props) {
  return (
    <MainLayout className={CLASS_NAME}>
      <MainLayout.Menu>
        <MenuItemWithFixedPanel
          tooltip=""
          icon={false}
          isOpen
          panelKey={"panelKey"}
          onClick={() => {}}
        >
          <WorkspaceSelector />
          <div className={`${CLASS_NAME}__tabs`}>
            <InnerTabLink to={`/`} icon="grid">
              Apps
            </InnerTabLink>
            <InnerTabLink to={`/workspace/settings`} icon="settings">
              Workspace Settings
            </InnerTabLink>
          </div>
        </MenuItemWithFixedPanel>
      </MainLayout.Menu>
      <MainLayout.Content>
        <div className={`${CLASS_NAME}__app-container`}>
          <PageContent className={CLASS_NAME}>
            <Switch>
              <RouteWithAnalytics exact path="/workspace/settings">
                <WorkspaceForm />
              </RouteWithAnalytics>
            </Switch>
            <Switch>
              <RouteWithAnalytics exact path="/">
                <ApplicationList />
              </RouteWithAnalytics>
            </Switch>
          </PageContent>
        </div>
      </MainLayout.Content>
      <ScreenResolutionMessage />
    </MainLayout>
  );
}

export default WorkspaceLayout;

export const GET_PENDING_CHANGES_STATUS = gql`
  query pendingChangesStatus($applicationId: String!) {
    pendingChanges(where: { app: { id: $applicationId } }) {
      resourceId
      resourceType
    }
  }
`;
