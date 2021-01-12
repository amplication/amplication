import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Switch, Route, match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import ApplicationHome, { GET_APPLICATION } from "./ApplicationHome";
import Entities from "../Entity/Entities";
import Pages from "../Pages/Pages";
import EntityPage from "../Pages/EntityPage";
import Settings from "../Settings/Settings";
import BuildPage from "../VersionControl/BuildPage";
import RolesPage from "../Roles/RolesPage";

import NewEntityPage from "../Pages/NewEntityPage";
import PendingChangesPage from "../VersionControl/PendingChangesPage";

import "./ApplicationLayout.scss";
import * as models from "../models";

import MenuItem from "../Layout/MenuItem";
import MainLayout from "../Layout/MainLayout";
import { CircleBadge } from "@amplication/design-system";

import PendingChangesContext, {
  PendingChangeItem,
} from "../VersionControl/PendingChangesContext";
import useBreadcrumbs from "../Layout/use-breadcrumbs";
import { track } from "../util/analytics";
import { SHOW_UI_ELEMENTS } from "../feature-flags";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import PendingChangesMenuItem from "../VersionControl/PendingChangesMenuItem";
import Commits from "../VersionControl/Commits";

enum EnumFixedPanelKeys {
  None = "None",
  PendingChanges = "PendingChanges",
}

export type ApplicationData = {
  app: models.App;
};

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

const CLASS_NAME = "application-layout";

type Props = {
  match: match<{
    application: string;
    appModule: string;
    className?: string;
  }>;
};

function ApplicationLayout({ match }: Props) {
  const { application } = match.params;

  const [pendingChanges, setPendingChanges] = useState<PendingChangeItem[]>([]);
  const [commitRunning, setCommitRunning] = useState<boolean>(false);

  const [selectedFixedPanel, setSelectedFixedPanel] = useState<string>(
    EnumFixedPanelKeys.PendingChanges
  );

  const handleMenuItemWithFixedPanelClicked = useCallback(
    (panelKey: string) => {
      if (selectedFixedPanel === panelKey) {
        setSelectedFixedPanel(EnumFixedPanelKeys.None);
      } else {
        setSelectedFixedPanel(panelKey);
      }
    },
    [selectedFixedPanel]
  );

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

  const resetPendingChanges = useCallback(() => {
    setPendingChanges([]);
    refetch();
  }, [refetch]);

  const setCommitRunningCallback = useCallback(
    (isRunning: boolean) => {
      setCommitRunning(isRunning);
    },
    [setCommitRunning]
  );

  const pendingChangesContextValue = useMemo(
    () => ({
      pendingChanges,
      commitRunning,
      setCommitRunning: setCommitRunningCallback,
      addEntity,
      addBlock,
      addChange,
      reset: resetPendingChanges,
    }),
    [
      pendingChanges,
      commitRunning,
      addEntity,
      addBlock,
      addChange,
      resetPendingChanges,
      setCommitRunningCallback,
    ]
  );

  const pendingChangesBadge =
    (pendingChanges.length && pendingChanges.length.toString()) || null;

  return (
    <PendingChangesContext.Provider value={pendingChangesContextValue}>
      <MainLayout className={CLASS_NAME}>
        <MainLayout.Menu>
          <MenuItem
            className={`${CLASS_NAME}__app-icon`}
            title="Dashboard"
            to={`/${application}`}
          >
            <CircleBadge
              name={applicationData?.app.name || ""}
              color={applicationData?.app.color}
            />
          </MenuItem>
          <PendingChangesMenuItem
            applicationId={application}
            isOpen={selectedFixedPanel === EnumFixedPanelKeys.PendingChanges}
            onClick={handleMenuItemWithFixedPanelClicked}
            panelKey={EnumFixedPanelKeys.PendingChanges}
            badgeValue={pendingChangesBadge}
          />
          <div className={`${CLASS_NAME}__menu-group`} />
          <MenuItem
            title="Entities"
            to={`/${application}/entities`}
            icon="entity_outline"
          />
          {SHOW_UI_ELEMENTS && (
            <MenuItem title="Pages" to={`/${application}/pages`} icon="pages" />
          )}
          <MenuItem
            title="Roles"
            to={`/${application}/roles`}
            icon="roles_outline"
          />
          <MenuItem
            title="Commits"
            to={`/${application}/commits`}
            icon="history_commit_outline"
          />
          <MenuItem
            title="Sync with GitHub"
            to={`/${application}/settings`}
            icon="Sync_with_Github_outline"
          />
        </MainLayout.Menu>
        <MainLayout.Content>
          <Switch>
            <Route exact path="/:application/" component={ApplicationHome} />
            <Route path="/:application/settings" component={Settings} />
            <Route
              path="/:application/pending-changes"
              component={PendingChangesPage}
            />

            <Route path="/:application/entities/" component={Entities} />

            {SHOW_UI_ELEMENTS && (
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
            <Route path="/:application/builds/:buildId" component={BuildPage} />

            <Route path="/:application/roles" component={RolesPage} />
            <Route path="/:application/commits" component={Commits} />
          </Switch>
        </MainLayout.Content>
        <ScreenResolutionMessage />
      </MainLayout>
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
