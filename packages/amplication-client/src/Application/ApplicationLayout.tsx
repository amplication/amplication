import React, { useState, useCallback, useEffect } from "react";
import { Switch, Route, match, useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GlobalHotKeys } from "react-hotkeys";

import ApplicationHome from "./ApplicationHome";
import Entities from "../Entity/Entities";
import Pages from "../Pages/Pages";
import EntityPage from "../Pages/EntityPage";
import Builds from "../VersionControl/Builds";
import SettingsPage from "../Settings/SettingsPage";

import NewEntityPage from "../Pages/NewEntityPage";
import PendingChanges from "../VersionControl/PendingChanges";

import "./ApplicationLayout.scss";
import * as models from "../models";

import MenuItem from "../Layout/MenuItem";
import MainLayout from "../Layout/MainLayout";
import ApplicationBadge from "./ApplicationBadge";
import PendingChangesContext, {
  PendingChangeItem,
} from "../VersionControl/PendingChangesContext";
import { GET_APPLICATION } from "./ApplicationHome";
import useBreadcrumbs from "../Layout/use-breadcrumbs";
import { track } from "../util/analytics";
import { REACT_APP_SHOW_UI_ELEMENTS } from "../env";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";

export type ApplicationData = {
  app: models.App;
};

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

type Props = {
  match: match<{
    application: string;
    appModule: string;
    className?: string;
  }>;
};

const keyMap = {
  GO_TO_PENDING_CHANGES: ["ctrl+shift+G"],
};

function ApplicationLayout({ match }: Props) {
  const { application } = match.params;
  const history = useHistory();

  const [pendingChanges, setPendingChanges] = useState<PendingChangeItem[]>([]);

  const { data: pendingChangesData, refetch } = useQuery<
    PendingChangeStatusData
  >(GET_PENDING_CHANGES_STATUS, {
    variables: {
      applicationId: application,
    },
  });

  const { data: applicationData } = useQuery<ApplicationData>(GET_APPLICATION, {
    variables: {
      id: match.params.application,
    },
  });

  useBreadcrumbs(match.url, applicationData?.app.name);

  useEffect(() => {
    setPendingChanges(
      pendingChangesData ? pendingChangesData.pendingChanges : []
    );
  }, [pendingChangesData, setPendingChanges]);

  const addChange = useCallback(
    (
      resourceId: string,
      resourceType: models.EnumPendingChangeResourceType
    ) => {
      const existingChange = pendingChanges.find(
        (changeItem) =>
          changeItem.resourceId === resourceId &&
          changeItem.resourceType === resourceType
      );
      if (existingChange) {
        return;
      }

      setPendingChanges(
        pendingChanges.concat([
          {
            resourceId,
            resourceType,
          },
        ])
      );
    },
    [pendingChanges, setPendingChanges]
  );

  const addEntity = useCallback(
    (entityId: string) => {
      addChange(entityId, models.EnumPendingChangeResourceType.Entity);
    },
    [addChange]
  );

  const addBlock = useCallback(
    (blockId: string) => {
      addChange(blockId, models.EnumPendingChangeResourceType.Block);
    },
    [addChange]
  );

  const navigateToPendingChanges = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      history.push(`/${application}/pending-changes`);
    },
    [history, application]
  );

  const handlers = {
    GO_TO_PENDING_CHANGES: navigateToPendingChanges,
  };

  return (
    <PendingChangesContext.Provider
      value={{
        pendingChanges,
        addEntity,
        addBlock,
        addChange,
        reset: refetch,
      }}
    >
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={handlers}
        className="hotkeys-wrapper"
      >
        <MainLayout>
          <MainLayout.Menu
            render={(expanded) => {
              return (
                <>
                  <ApplicationBadge
                    expanded={expanded}
                    url={`/${application}`}
                    name={applicationData?.app.name || ""}
                  />
                  <MenuItem
                    title="Entities"
                    to={`/${application}/entities`}
                    icon="entity"
                  />
                  {REACT_APP_SHOW_UI_ELEMENTS && (
                    <MenuItem
                      title="Pages"
                      to={`/${application}/pages`}
                      icon="pages"
                    />
                  )}

                  <MenuItem
                    title="Publish"
                    to={`/${application}/builds`}
                    icon="publish"
                  />
                  <MenuItem
                    title="Settings"
                    to={`/${application}/settings`}
                    icon="settings"
                  />
                </>
              );
            }}
          />
          <MainLayout.Content>
            <Switch>
              <Route exact path="/:application/" component={ApplicationHome} />
              <Route
                path="/:application/pending-changes"
                component={PendingChanges}
              />

              <Route path="/:application/entities/" component={Entities} />

              {REACT_APP_SHOW_UI_ELEMENTS && (
                <>
                  <Route path="/:application/pages/" component={Pages} />
                  <Route
                    path="/:application/entity-pages/new"
                    component={NewEntityPage}
                  />
                  <Route
                    path="/:application/entity-pages/:entityPageId"
                    component={EntityPage}
                  />
                </>
              )}
              <Route path="/:application/builds" component={Builds} />
              <Route path="/:application/settings" component={SettingsPage} />
            </Switch>
          </MainLayout.Content>
          <ScreenResolutionMessage />
        </MainLayout>
      </GlobalHotKeys>
    </PendingChangesContext.Provider>
  );
}

const enhance = track((props) => {
  return { applicationId: props.match.params.application };
});

export default enhance(ApplicationLayout);

export const GET_PENDING_CHANGES_STATUS = gql`
  query pendingChangesStatus($applicationId: String!) {
    pendingChanges(where: { app: { id: $applicationId } }) {
      resourceId
      resourceType
    }
  }
`;
