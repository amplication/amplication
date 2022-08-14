import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Switch, Route, match } from "react-router-dom";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";
import { gql, useQuery } from "@apollo/client";

import ResourceHome, { GET_RESOURCE } from "./ResourceHome";
import Entities from "../Entity/Entities";
import { RelatedFieldsMigrationFix } from "../Entity/RelatedFieldsMigrationFix";
import BuildPage from "../VersionControl/BuildPage";
import RolesPage from "../Roles/RolesPage";

import PendingChangesPage from "../VersionControl/PendingChangesPage";
import { AsidePanel, FilesPanel } from "../util/teleporter";

import "./ResourceLayout.scss";
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
import ServiceSettingsPage from "./resourceSettings/ResourceSettingsPage";

export type ResourceData = {
  resource: models.Resource;
};

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

const CLASS_NAME = "resource-layout";

type Props = {
  match: match<{
    resource: string;
    appModule: string;
    className?: string;
  }>;
};

function ResourceLayout({ match }: Props) {
  const { resource } = match.params;

  const [pendingChanges, setPendingChanges] = useState<PendingChangeItem[]>([]);
  const [commitRunning, setCommitRunning] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const { data: pendingChangesData, refetch } = useQuery<
    PendingChangeStatusData
  >(GET_PENDING_CHANGES_STATUS, {
    variables: {
      resourceId: resource,
    },
  });

  const { data: resourceData } = useQuery<ResourceData>(GET_RESOURCE, {
    variables: {
      id: match.params.resource,
    },
  });

  useEffect(() => {
    setPendingChanges(
      pendingChangesData ? pendingChangesData.pendingChanges : []
    );
  }, [pendingChangesData, setPendingChanges]);

  const addChange = useCallback(
    (originId: string, originType: models.EnumPendingChangeOriginType) => {
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
        footer={<LastCommit resourceId={resource} />}
      >
        <MainLayout.Menu>
          <MenuItem
            className={`${CLASS_NAME}__app-icon`}
            title="Dashboard"
            to={`/${resource}`}
          >
            <CircleBadge
              name={resourceData?.resource.name || ""}
              color={resourceData?.resource.color}
            />
          </MenuItem>

          <MenuItem
            title="Entities"
            to={`/${resource}/entities`}
            icon="entity_outline"
          />
          <MenuItem
            title="Roles"
            to={`/${resource}/roles`}
            icon="roles_outline"
          />
          <MenuItem
            title="Commits"
            to={`/${resource}/commits`}
            icon="history_commit_outline"
          />
          <MenuItem
            title="Connect to GitHub"
            to={`/${resource}/github`}
            icon="github"
          />
          <MenuItem
            title="Code View"
            to={`/${resource}/code-view`}
            icon="code1"
          />
          <MenuItem
            title="Settings"
            to={`/${resource}/serviceSettings/update`}
            icon="settings"
          />
        </MainLayout.Menu>
        <MainLayout.Aside position={EnumMainLayoutAsidePosition.left}>
          <FilesPanel.Target className="main-layout__aside__expandable" />
        </MainLayout.Aside>
        <MainLayout.Content>
          <div className={`${CLASS_NAME}__app-container`}>
            <NavigationTabs defaultTabUrl={`/${resource}/`} />

            <Switch>
              <RouteWithAnalytics
                path="/:resource/pending-changes"
                component={PendingChangesPage}
              />

              <Route path="/:resource/entities/" component={Entities} />

              <RouteWithAnalytics
                path="/:resource/builds/:buildId"
                component={BuildPage}
              />

              <RouteWithAnalytics
                path="/:resource/roles"
                component={RolesPage}
              />
              <Route path="/:resource/commits" component={Commits} />
              <RouteWithAnalytics
                path="/:resource/fix-related-entities"
                component={RelatedFieldsMigrationFix}
              />
              <RouteWithAnalytics
                path="/:resource/github"
                component={SyncWithGithubPage}
              />
              <RouteWithAnalytics
                path="/:resource/code-view"
                component={CodeViewPage}
              />
              <Route
                path="/:resource/serviceSettings"
                component={ServiceSettingsPage}
              />
              <Route path="/:resource/" component={ResourceHome} />
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
  return { resourceId: props.match.params.resource };
});

export default enhance(ResourceLayout);

export const GET_PENDING_CHANGES_STATUS = gql`
  query pendingChangesStatus($resourceId: String!) {
    pendingChanges(where: { resource: { id: $resourceId } }) {
      originId
      originType
    }
  }
`;
