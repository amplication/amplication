import { CircularProgress } from "@amplication/ui/design-system";
import { StiggProvider } from "@stigg/react-sdk";
import React, { lazy, useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { match } from "react-router-dom";
import { useTracking } from "react-tracking";
import useAuthenticated from "../authentication/use-authenticated";
import { AppContextProvider } from "../context/appContext";
import {
  REACT_APP_BILLING_API_KEY,
  REACT_APP_FEATURE_AI_ASSISTANT_ENABLED,
} from "../env";
import { HubSpotChatComponent } from "../hubSpotChat";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import { AppRouteProps } from "../routes/routesUtil";
import CompleteInvitation from "../User/CompleteInvitation";
import { AnalyticsEventNames } from "../util/analytics-events.types";
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
import PendingChanges from "../VersionControl/PendingChanges";
import LastCommit from "../VersionControl/LastCommit";
import { EnumResourceTypeGroup, EnumSubscriptionStatus } from "../models";
import Assistant from "../Assistant/Assistant";
import ResponsiveContainer from "../Components/ResponsiveContainer";
import { AssistantContextProvider } from "../Assistant/context/AssistantContext";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import classNames from "classnames";
import useCustomPropertiesMap from "../CustomProperties/hooks/useCustomPropertiesMap";
import { CatalogContextProvider } from "../Catalog/CatalogContext";
import useBlueprintsMap from "../Blueprints/hooks/useBlueprintsMap";
import usePermissions from "./hooks/usePermissions";

const MobileMessage = lazy(() => import("../Layout/MobileMessage"));

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
  }>;
};

const WorkspaceLayout: React.FC<Props> = ({
  match,
  innerRoutes,
  moduleClass,
}) => {
  const [chatStatus, setChatStatus] = useState<boolean>(false);
  const authenticated = useAuthenticated();
  const {
    currentWorkspace,
    subscriptionPlan,
    subscriptionStatus,
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
    projectListError,
    projectListLoading,
    onNewProjectCompleted,
    currentProjectConfiguration,
  } = useProjectSelector(authenticated, currentWorkspace);

  const blueprintsMap = useBlueprintsMap();

  const { isPlatformConsole } = useProjectBaseUrl();

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
  } = usePendingChanges(
    currentProject,
    isPlatformConsole
      ? EnumResourceTypeGroup.Platform
      : EnumResourceTypeGroup.Services
  );

  const commitUtils = useCommits(currentProject?.id);

  const permissions = usePermissions();

  const {
    resources,
    projectConfigurationResource,
    pluginRepositoryResource,
    loadingResources,
    errorResources,
    reloadResources,
    currentResource,
    gitRepositoryFullName,
    gitRepositoryUrl,
    gitRepositoryOrganizationProvider,
    createPluginRepository,
    errorCreatePluginRepository,
    loadingCreatePluginRepository,
    updateCodeGeneratorVersion,
    loadingUpdateCodeGeneratorVersion,
    errorUpdateCodeGeneratorVersion,
    createServiceFromTemplate,
    loadingCreateServiceFromTemplate,
    errorCreateServiceFromTemplate,
  } = useResources(currentWorkspace, currentProject, addBlock, addEntity);

  const { customPropertiesMap } = useCustomPropertiesMap();

  useEffect(() => {
    if (!currentProject?.id) return;
    commitUtils.refetchCommitsData(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject?.id]); //do not include commitUtils to avoid infinite loop

  const { trackEvent, Track } = useTracking<{ [key: string]: any }>({
    workspaceId: currentWorkspace?.id,
    subscriptionPlan: `${currentWorkspace?.subscription?.subscriptionPlan}${
      currentWorkspace?.subscription?.status === EnumSubscriptionStatus.Trailing
        ? "-trial"
        : ""
    }`,
    projectId: currentProject?.id,
    resourceId: currentResource?.id,
    $groups: {
      groupWorkspace: currentWorkspace?.id,
      groupProject: currentProject?.id,
      groupResource: currentResource?.id,
    },
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
  }, [currentWorkspace, trackEvent]);

  const showSideBar = !!currentProject;

  return currentWorkspace ? (
    <AppContextProvider
      newVal={{
        currentWorkspace,
        subscriptionPlan,
        subscriptionStatus,
        handleSetCurrentWorkspace,
        createWorkspace,
        currentProjectConfiguration,
        createNewWorkspaceError,
        loadingCreateNewWorkspace,
        currentProject,
        projectsList,
        projectListError,
        projectListLoading,
        setNewProject: createProject,
        onNewProjectCompleted,
        resources,
        projectConfigurationResource,
        pluginRepositoryResource,
        loadingResources,
        reloadResources,
        errorResources,
        currentResource,
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
        createPluginRepository,
        errorCreatePluginRepository,
        loadingCreatePluginRepository,
        resetPendingChangesIndicator,
        setResetPendingChangesIndicator,
        openHubSpotChat,
        commitUtils,
        updateCodeGeneratorVersion,
        loadingUpdateCodeGeneratorVersion,
        errorUpdateCodeGeneratorVersion,
        createServiceFromTemplate,
        loadingCreateServiceFromTemplate,
        errorCreateServiceFromTemplate,
        customPropertiesMap,
        blueprintsMap,
        permissions,
      }}
    >
      <AssistantContextProvider>
        <CatalogContextProvider>
          {isMobileOnly ? (
            <MobileMessage />
          ) : (
            <StiggProvider
              apiKey={REACT_APP_BILLING_API_KEY}
              customerId={currentWorkspace.id}
            >
              <Track>
                <div className={`${moduleClass}__assistant__wrapper`}>
                  {REACT_APP_FEATURE_AI_ASSISTANT_ENABLED === "true" && (
                    <div className={`${moduleClass}__assistant`}>
                      <Assistant />
                    </div>
                  )}
                  <div
                    className={classNames(moduleClass, {
                      [`${moduleClass}--with-side-panel`]: showSideBar,
                    })}
                  >
                    <WorkspaceHeader />
                    <CompleteInvitation />
                    <RedeemCoupon />

                    <div className={`${moduleClass}__page_content`}>
                      <ResponsiveContainer
                        className={`${moduleClass}__main_content`}
                      >
                        {innerRoutes}
                      </ResponsiveContainer>

                      {showSideBar ? (
                        <div className={`${moduleClass}__changes_menu`}>
                          <PendingChanges projectId={currentProject.id} />
                          {!isPlatformConsole && commitUtils.lastCommit && (
                            <LastCommit lastCommit={commitUtils.lastCommit} />
                          )}
                        </div>
                      ) : null}
                    </div>

                    <WorkspaceFooter lastCommit={commitUtils.lastCommit} />
                    <HubSpotChatComponent
                      setChatStatus={setChatStatus}
                      chatStatus={chatStatus}
                    />
                    <ScreenResolutionMessage />
                  </div>
                </div>
              </Track>
            </StiggProvider>
          )}
        </CatalogContextProvider>
      </AssistantContextProvider>
    </AppContextProvider>
  ) : (
    <CircularProgress centerToParent />
  );
};

export default WorkspaceLayout;
