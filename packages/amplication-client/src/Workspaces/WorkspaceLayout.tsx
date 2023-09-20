import { CircularProgress } from "@amplication/ui/design-system";
import { StiggProvider } from "@stigg/react-sdk";
import React, { lazy, useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { match } from "react-router-dom";
import { useTracking } from "react-tracking";
import useAuthenticated from "../authentication/use-authenticated";
import { AppContextProvider } from "../context/appContext";
import { REACT_APP_BILLING_API_KEY } from "../env";
import { HubSpotChatComponent } from "../hubSpotChat";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import ProjectEmptyState from "../Project/ProjectEmptyState";
import { AppRouteProps } from "../routes/routesUtil";
import CompleteInvitation from "../User/CompleteInvitation";
import { AnalyticsEventNames } from "../util/analytics-events.types";
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
import useCommits from "../VersionControl/hooks/useCommits";
import RedeemCoupon from "../User/RedeemCoupon";

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
  const [chatStatus, setChatStatus] = useState<boolean>(false);
  const authenticated = useAuthenticated();
  const {
    currentWorkspace,
    handleSetCurrentWorkspace,
    createWorkspace,
    createNewWorkspaceError,
    loadingCreateNewWorkspace,
    refreshCurrentWorkspace,
    getWorkspaces,
    workspacesList,
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
    resetPendingChangesIndicator,
    setResetPendingChangesIndicator,
  } = usePendingChanges(currentProject);

  const commitUtils = useCommits(currentProject?.id);

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
    gitRepositoryOrganizationProvider,
    createMessageBroker,
    errorCreateMessageBroker,
    loadingCreateMessageBroker,
    createServiceWithEntitiesResult,
    updateCodeGeneratorVersion,
    loadingUpdateCodeGeneratorVersion,
    errorUpdateCodeGeneratorVersion,
  } = useResources(currentWorkspace, currentProject, addBlock, addEntity);

  useEffect(() => {
    if (!currentProject?.id) return;
    commitUtils.refetchCommitsData(true);
  }, [currentProject?.id]);

  const { trackEvent, Track } = useTracking<{ [key: string]: any }>({
    workspaceId: currentWorkspace?.id,
    projectId: currentProject?.id,
    resourceId: currentResource?.id,
  });

  const openHubSpotChat = () => {
    const status = window.HubSpotConversations.widget.status();

    if (status.loaded) {
      window.HubSpotConversations.widget.refresh();
    } else {
      window.HubSpotConversations.widget.load();
    }
    trackEvent({
      eventName: AnalyticsEventNames.ChatWidgetView,
      workspaceId: currentWorkspace.id,
    });
    setChatStatus(true);
  };

  useEffect(() => {
    if (currentWorkspace) {
      trackEvent({
        eventName: AnalyticsEventNames.WorkspaceSelected,
        workspaceId: currentWorkspace.id,
      });
    }
  }, [currentWorkspace]);

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
        getWorkspaces,
        workspacesList,
        gitRepositoryFullName,
        gitRepositoryUrl,
        gitRepositoryOrganizationProvider,
        createMessageBroker,
        errorCreateMessageBroker,
        loadingCreateMessageBroker,
        resetPendingChangesIndicator,
        setResetPendingChangesIndicator,
        openHubSpotChat,
        createServiceWithEntitiesResult,
        commitUtils,
        updateCodeGeneratorVersion,
        loadingUpdateCodeGeneratorVersion,
        errorUpdateCodeGeneratorVersion,
      }}
    >
      {isMobileOnly ? (
        <MobileMessage />
      ) : (
        <StiggProvider
          apiKey={REACT_APP_BILLING_API_KEY}
          customerId={currentWorkspace.id}
        >
          <Track>
            <div className={moduleClass}>
              <WorkspaceHeader />
              <CompleteInvitation />
              <RedeemCoupon />
              <div className={`${moduleClass}__page_content`}>
                <div className={`${moduleClass}__main_content`}>
                  {projectsList.length ? innerRoutes : <ProjectEmptyState />}
                </div>
                <div className={`${moduleClass}__changes_menu`}>
                  {currentProject ? (
                    <PendingChanges projectId={currentProject.id} />
                  ) : null}
                  {currentProject && commitUtils.lastCommit && (
                    <LastCommit lastCommit={commitUtils.lastCommit} />
                  )}
                </div>
              </div>
              <WorkspaceFooter lastCommit={commitUtils.lastCommit} />
              <HubSpotChatComponent
                setChatStatus={setChatStatus}
                chatStatus={chatStatus}
              />
              <ScreenResolutionMessage />
            </div>
          </Track>
        </StiggProvider>
      )}
    </AppContextProvider>
  ) : (
    <CircularProgress centerToParent />
  );
};

export default WorkspaceLayout;
