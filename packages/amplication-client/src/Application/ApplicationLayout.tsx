import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Switch, Route, match } from "react-router-dom";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";
import { gql, useQuery } from "@apollo/client";

import ApplicationHome, { GET_APPLICATION } from "./ApplicationHome";
import Entities from "../Entity/Entities";
import { RelatedFieldsMigrationFix } from "../Entity/RelatedFieldsMigrationFix";
import BuildPage from "../VersionControl/BuildPage";
import RolesPage from "../Roles/RolesPage";

import PendingChangesPage from "../VersionControl/PendingChangesPage";
import { AsidePanel, FilesPanel } from "../util/teleporter";

import "./ApplicationLayout.scss";
import * as models from "../models";

import MenuItem from "../Layout/MenuItem";
import MainLayout, { EnumMainLayoutAsidePosition } from "../Layout/MainLayout";
import { CircleBadge } from "@amplication/design-system";
import LastCommit from "../VersionControl/LastCommit";

import PendingChangesContext, {
  PendingChangeItem,
} from "../VersionControl/PendingChangesContext";
import { track } from "../util/analytics";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import Commits from "../VersionControl/Commits";
import NavigationTabs from "../Layout/NavigationTabs";
import SyncWithGithubPage from "./git/SyncWithGithubPage";
import CodeViewPage from "./code-view/CodeViewPage";
import AppSettingsPage from "./appSettings/AppSettingsPage";

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
  const [isError, setIsError] = useState<boolean>(false);

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

  useEffect(() => {
    setPendingChanges(
      pendingChangesData ? pendingChangesData.pendingChanges : []
    );
  }, [pendingChangesData, setPendingChanges]);

  const addChange = useCallback(
    (
      originId: string,
      originType: models.EnumPendingChangeOriginType
    ) => {
      const existingChange = pendingChanges.find(
        (changeItem) =>
          changeItem.originId === originId &&
          changeItem.originType === originType
      );
      if (existingChange) {
        //reassign pending changes to trigger refresh
        setPendingChanges([...pendingChanges]);
      } else {
        setPendingChanges(
          pendingChanges.concat([
            {
              originId,
              originType,
            },
          ])
        );
      }
    },
    [pendingChanges, setPendingChanges]
  );

  const addEntity = useCallback(
    (entityId: string) => {
      addChange(entityId, models.EnumPendingChangeOriginType.Entity);
    },
    [addChange]
  );

  const addBlock = useCallback(
    (blockId: string) => {
      addChange(blockId, models.EnumPendingChangeOriginType.Block);
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
  const setIsErrorCallback = useCallback(
    (onError: boolean) => {
      setIsError(onError);
    },
    [setIsError]
  );

  const pendingChangesContextValue = useMemo(
    () => ({
      pendingChanges,
      commitRunning,
      isError,
      setIsError: setIsErrorCallback,
      setCommitRunning: setCommitRunningCallback,
      addEntity,
      addBlock,
      addChange,
      reset: resetPendingChanges,
    }),
    [
      pendingChanges,
      commitRunning,
      isError,
      addEntity,
      addBlock,
      addChange,
      resetPendingChanges,
      setCommitRunningCallback,
      setIsErrorCallback,
    ]
  );

  return (
    <PendingChangesContext.Provider value={pendingChangesContextValue}>
      <MainLayout
        className={CLASS_NAME}
        footer={<LastCommit applicationId={application} />}
      >
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

          <MenuItem
            title="Entities"
            to={`/${application}/entities`}
            icon="entity_outline"
          />
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
            title="Connect to GitHub"
            to={`/${application}/github`}
            icon="github"
          />
          <MenuItem
            title="Code View"
            to={`/${application}/code-view`}
            icon="code1"
          />
          <MenuItem
            title="Settings"
            to={`/${application}/appSettings/update`}
            icon="settings"
          />
        </MainLayout.Menu>
        <MainLayout.Aside position={EnumMainLayoutAsidePosition.left}>
          <FilesPanel.Target className="main-layout__aside__expandable" />
        </MainLayout.Aside>
        <MainLayout.Content>
          <div className={`${CLASS_NAME}__app-container`}>
            <NavigationTabs defaultTabUrl={`/${application}/`} />

            <Switch>
              <RouteWithAnalytics
                path="/:application/pending-changes"
                component={PendingChangesPage}
              />

              <Route path="/:application/entities/" component={Entities} />

              <RouteWithAnalytics
                path="/:application/builds/:buildId"
                component={BuildPage}
              />

              <RouteWithAnalytics
                path="/:application/roles"
                component={RolesPage}
              />
              <Route path="/:application/commits" component={Commits} />
              <RouteWithAnalytics
                path="/:application/fix-related-entities"
                component={RelatedFieldsMigrationFix}
              />
              <RouteWithAnalytics
                path="/:application/github"
                component={SyncWithGithubPage}
              />
              <RouteWithAnalytics
                path="/:application/code-view"
                component={CodeViewPage}
              />
              <Route
                path="/:application/appSettings"
                component={AppSettingsPage}
              />
              <Route path="/:application/" component={ApplicationHome} />
            </Switch>
          </div>
        </MainLayout.Content>
        <MainLayout.Aside>
          <AsidePanel.Target className="main-layout__aside__expandable" />
        </MainLayout.Aside>

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
      originId
      originType
    }
  }
`;
