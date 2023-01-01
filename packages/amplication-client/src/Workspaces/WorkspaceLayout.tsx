import { CircularProgress } from "@amplication/design-system";
import React, { lazy } from "react";
import { isMobileOnly } from "react-device-detect";
import { match } from "react-router-dom";
import { useTracking } from "react-tracking";
import useAuthenticated from "../authentication/use-authenticated";
import { AppContextProvider } from "../context/appContext";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import ProjectEmptyState from "../Project/ProjectEmptyState";
import { AppRouteProps } from "../routes/routesUtil";
import CompleteInvitation from "../User/CompleteInvitation";
import LastCommit from "../VersionControl/LastCommit";
import PendingChanges from "../VersionControl/PendingChanges";
import usePendingChanges, {
  PendingChangeItem,
} from "./hooks/usePendingChanges";
import useProjectSelector from "./hooks/useProjectSelector";
import useResources from "./hooks/useResources";
import useWorkspaceSelector from "./hooks/useWorkspaceSelector";
import WorkspaceFooter from "./WorkspaceFooter";
import WorkspaceHeader from "./WorkspaceHeader/WorkspaceHeader";
import "./WorkspaceLayout.scss";

const MobileMessage = lazy(() => import("../Layout/MobileMessage"));

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
  }>;
};

const WorkspaceLayout: React.FC<Props> = ({ innerRoutes, moduleClass }) => {
  const authenticated = useAuthenticated();
  const {
    currentWorkspace,
    handleSetCurrentWorkspace,
    createWorkspace,
    createNewWorkspaceError,
    loadingCreateNewWorkspace,
    refreshCurrentWorkspace,
  } = useWorkspaceSelector(authenticated);
  const {
    currentProject,
    createProject,
    projectsList,
    onNewProjectCompleted,
    currentProjectConfiguration,
  } = useProjectSelector(authenticated, currentWorkspace);

  const {
    pendingChanges,
    commitRunning,
    pendingChangesIsError,
    addEntity,
    addBlock,
    addChange,
    resetPendingChanges,
    setCommitRunning,
    setPendingChangesError,
  } = usePendingChanges(currentProject);

  const {
    resources,
    projectConfigurationResource,
    handleSearchChange,
    loadingResources,
    errorResources,
    currentResource,
    setResource,
    createService,
    loadingCreateService,
    errorCreateService,
    gitRepositoryFullName,
    gitRepositoryUrl,
    createMessageBroker,
    errorCreateMessageBroker,
    loadingCreateMessageBroker,
  } = useResources(currentWorkspace, currentProject, addBlock, addEntity);

  const { Track } = useTracking({
    workspaceId: currentWorkspace?.id,
    projectId: currentProject?.id,
    resourceId: currentResource?.id,
  });

  return currentWorkspace ? (
    <AppContextProvider
      newVal={{
        currentWorkspace,
        handleSetCurrentWorkspace,
        createWorkspace,
        currentProjectConfiguration,
        createNewWorkspaceError,
        loadingCreateNewWorkspace,
        currentProject,
        projectsList,
        setNewProject: createProject,
        onNewProjectCompleted,
        resources,
        setNewService: createService,
        projectConfigurationResource,
        handleSearchChange,
        loadingResources,
        errorResources,
        loadingCreateService,
        errorCreateService,
        currentResource,
        setResource,
        pendingChanges,
        commitRunning,
        pendingChangesIsError,
        addEntity,
        addBlock,
        addChange,
        resetPendingChanges,
        setCommitRunning,
        setPendingChangesError,
        refreshCurrentWorkspace,
        gitRepositoryFullName,
        gitRepositoryUrl,
        createMessageBroker,
        errorCreateMessageBroker,
        loadingCreateMessageBroker,
      }}
    >
      {isMobileOnly ? (
        <MobileMessage />
      ) : (
        <Track>
          <div className={moduleClass}>
            <WorkspaceHeader />
            <CompleteInvitation />
            <div className={`${moduleClass}__page_content`}>
              <div className={`${moduleClass}__main_content`}>
                {projectsList.length ? innerRoutes : <ProjectEmptyState />}
              </div>
              <div className={`${moduleClass}__changes_menu`}>
                {currentProject ? (
                  <PendingChanges projectId={currentProject.id} />
                ) : null}
                {currentProject && <LastCommit projectId={currentProject.id} />}
              </div>
            </div>
            <WorkspaceFooter />
            <ScreenResolutionMessage />
          </div>
        </Track>
      )}
    </AppContextProvider>
  ) : (
    <CircularProgress centerToParent />
  );
};

export default WorkspaceLayout;
