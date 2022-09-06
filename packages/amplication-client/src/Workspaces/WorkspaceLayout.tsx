import React, { lazy } from "react";
import { match } from "react-router-dom";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import { isMobileOnly } from "react-device-detect";
import CompleteInvitation from "../User/CompleteInvitation";
import "./WorkspaceLayout.scss";
import WorkspaceHeader from "./WorkspaceHeader/WorkspaceHeader";
// import WorkspaceFooter from "./WorkspaceFooter";
import useAuthenticated from "../authentication/use-authenticated";
import useProjectSelector from "./hooks/useProjectSelector";
import { AppContextProvider } from "../context/appContext";
import useWorkspaceSelector from "./hooks/useWorkspaceSelector";
import { CircularProgress } from "@amplication/design-system";
import useResources from "./hooks/useResources";
import { AppRouteProps } from "../routes/routesUtil";
import usePendingChanges, {
  PendingChangeItem,
} from "./hooks/usePendingChanges";
import ProjectEmptyState from "../Project/ProjectEmptyState";
import PendingChanges from "../VersionControl/PendingChanges";
import LastCommit from "../VersionControl/LastCommit";
import WorkspaceFooter from "./WorkspaceFooter";

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
    resources,
    projectConfigurationResource,
    handleSearchChange,
    loadingResources,
    errorResources,
    currentResource,
    setResource,
    createResource,
    loadingCreateResource,
    errorCreateResource,
    gitRepositoryFullName,
    gitRepositoryUrl,
  } = useResources(currentWorkspace, currentProject);

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
        setNewResource: createResource,
        projectConfigurationResource,
        handleSearchChange,
        loadingResources,
        errorResources,
        loadingCreateResource,
        errorCreateResource,
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
      }}
    >
      {isMobileOnly ? (
        <MobileMessage />
      ) : (
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
      )}
    </AppContextProvider>
  ) : (
    <CircularProgress />
  );
};

export default WorkspaceLayout;
