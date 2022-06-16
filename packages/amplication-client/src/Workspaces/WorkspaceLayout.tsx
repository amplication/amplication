import React from "react";
import { match, Switch } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import MenuItemWithFixedPanel from "../Layout/MenuItemWithFixedPanel";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import { PendingChangeItem } from "../VersionControl/PendingChangesContext";
import ResourceList from "./ResourceList";
//import Subscription from "../Subscription/Subscription";
import { isMobileOnly } from "react-device-detect";
import InnerTabLink from "../Layout/InnerTabLink";
import MobileMessage from "../Layout/MobileMessage";
import PageContent from "../Layout/PageContent";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";
import ProfilePage from "../Profile/ProfilePage";
import CompleteInvitation from "../User/CompleteInvitation";
import MemberList from "./MemberList";
import WorkspaceForm from "./WorkspaceForm";
import "./WorkspaceLayout.scss";
import WorkspaceSelector from "./WorkspaceSelector";

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
  if (isMobileOnly) {
    return <MobileMessage />;
  }

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
              Resources
            </InnerTabLink>
            <InnerTabLink to={`/workspace/settings`} icon="settings">
              Workspace Settings
            </InnerTabLink>
            <InnerTabLink to={`/workspace/members`} icon="users">
              Workspace Members
            </InnerTabLink>
            {/* <InnerTabLink to={`/workspace/plans`} icon="file_text">
              Workspace Plan
            </InnerTabLink> */}
          </div>
        </MenuItemWithFixedPanel>
      </MainLayout.Menu>
      <MainLayout.Content>
        <CompleteInvitation />
        <div className={`${CLASS_NAME}__resource-container`}>
          <PageContent className={CLASS_NAME}>
            <Switch>
              <RouteWithAnalytics exact path="/workspace/settings">
                <WorkspaceForm />
              </RouteWithAnalytics>
            </Switch>
            <Switch>
              <RouteWithAnalytics
                exact
                path="/workspace/members"
                component={MemberList}
              />
            </Switch>
            {/* <Switch>
              <RouteWithAnalytics exact path="/workspace/plans" component={Subscription} />
            </Switch> */}
            <Switch>
              <RouteWithAnalytics exact path="/user/profile">
                <ProfilePage />
              </RouteWithAnalytics>
            </Switch>
            <Switch>
              <RouteWithAnalytics exact path="/">
                <ResourceList />
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
