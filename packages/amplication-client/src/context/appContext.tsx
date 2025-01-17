import { ApolloError } from "@apollo/client";
import React from "react";
import * as models from "../models";
import { PendingChangeItem } from "../Workspaces/hooks/usePendingChanges";
import { CreateWorkspaceType } from "../Workspaces/hooks/workspace";
import { CommitUtils } from "../VersionControl/hooks/useCommits";
import { TUpdateCodeGeneratorVersion } from "../Workspaces/hooks/useResources";
import { IBlueprintsMap } from "../Blueprints/hooks/useBlueprintsMap";
import { IPermissions } from "../Workspaces/hooks/usePermissions";
import { RolesPermissions } from "@amplication/util-roles-types";

export interface AppContextInterface {
  currentWorkspace: models.Workspace | undefined;
  handleSetCurrentWorkspace: (workspaceId: string) => void;
  createWorkspace: (data: CreateWorkspaceType) => void;
  subscriptionPlan: models.EnumSubscriptionPlan;
  subscriptionStatus: models.EnumSubscriptionStatus;
  createNewWorkspaceError: ApolloError | undefined;
  loadingCreateNewWorkspace: boolean;
  currentProject: models.Project | undefined;
  currentProjectConfiguration: models.Resource | undefined;
  projectsList: models.Project[];
  projectListError: ApolloError | undefined;
  projectListLoading: boolean;
  setNewProject: (data: models.ProjectCreateInput) => void;
  onNewProjectCompleted: (data: models.Project) => void;
  resources: models.Resource[];
  setNewService: (
    data: models.ResourceCreateWithEntitiesInput,
    eventName: string
  ) => void;
  projectConfigurationResource: models.Resource | undefined;
  pluginRepositoryResource: models.Resource | undefined;
  loadingResources: boolean;
  reloadResources: () => void;
  errorResources: Error | undefined;
  loadingCreateService: boolean;
  errorCreateService: Error | undefined;
  currentResource: models.Resource | undefined;
  pendingChanges: PendingChangeItem[];
  commitRunning: boolean;
  pendingChangesIsError: boolean;
  addEntity: (entityId?: string) => void;
  addBlock: (blockId: string) => void;
  addChange: (originId: string) => void;
  resetPendingChanges: () => void;
  setCommitRunning: (isRunning: boolean) => void;
  setPendingChangesError: (onError: boolean) => void;
  refreshCurrentWorkspace: () => void;
  getWorkspaces: () => void;
  workspacesList: models.Workspace[];
  gitRepositoryFullName: string;
  gitRepositoryUrl: string;
  gitRepositoryOrganizationProvider: models.EnumGitProvider | undefined;
  createMessageBroker: (
    data: models.ResourceCreateInput,
    eventName: string
  ) => void;
  loadingCreateMessageBroker: boolean;
  errorCreateMessageBroker: Error | undefined;
  createPluginRepository: (data: models.ResourceCreateInput) => void;
  loadingCreatePluginRepository: boolean;
  errorCreatePluginRepository: Error | undefined;
  resetPendingChangesIndicator: boolean;
  setResetPendingChangesIndicator: (reset: boolean) => void;
  openHubSpotChat: () => void;
  createServiceWithEntitiesResult: models.ResourceCreateWithEntitiesResult;
  commitUtils: CommitUtils;
  updateCodeGeneratorVersion: (input: TUpdateCodeGeneratorVersion) => void;
  loadingUpdateCodeGeneratorVersion: boolean;
  errorUpdateCodeGeneratorVersion: ApolloError | undefined;
  createServiceFromTemplate: (
    data: models.ResourceFromTemplateCreateInput
  ) => Promise<models.Resource>;
  loadingCreateServiceFromTemplate: boolean;
  errorCreateServiceFromTemplate: Error | undefined;
  customPropertiesMap: Record<string, models.CustomProperty>;
  blueprintsMap: IBlueprintsMap;
  permissions: IPermissions;
}

const initialContext: AppContextInterface = {
  currentWorkspace: undefined,
  subscriptionPlan: models.EnumSubscriptionPlan.Free,
  subscriptionStatus: models.EnumSubscriptionStatus.Active,
  handleSetCurrentWorkspace: () => {},
  createWorkspace: () => {},
  createNewWorkspaceError: undefined,
  loadingCreateNewWorkspace: false,
  currentProject: undefined,
  currentProjectConfiguration: undefined,
  projectsList: [],
  projectListError: undefined,
  projectListLoading: false,
  setNewProject: () => {},
  onNewProjectCompleted: () => {},
  resources: [],
  setNewService: () => {},
  projectConfigurationResource: undefined,
  pluginRepositoryResource: undefined,
  loadingResources: true,
  errorResources: undefined,
  reloadResources: () => {},
  loadingCreateService: true,
  errorCreateService: undefined,
  currentResource: undefined,
  pendingChanges: [],
  commitRunning: false,
  pendingChangesIsError: false,
  addEntity: () => {},
  addBlock: () => {},
  addChange: () => {},
  resetPendingChanges: () => {},
  setCommitRunning: () => {},
  setPendingChangesError: () => {},
  refreshCurrentWorkspace: () => {},
  getWorkspaces: () => {},
  workspacesList: [],
  gitRepositoryFullName: "",
  gitRepositoryUrl: "",
  gitRepositoryOrganizationProvider: undefined,
  createMessageBroker: () => {},
  loadingCreateMessageBroker: false,
  errorCreateMessageBroker: undefined,
  createPluginRepository: () => {},
  loadingCreatePluginRepository: false,
  errorCreatePluginRepository: undefined,
  resetPendingChangesIndicator: false,
  setResetPendingChangesIndicator: () => {},
  openHubSpotChat: () => {},
  createServiceWithEntitiesResult: undefined,
  commitUtils: {
    commits: [],
    lastCommit: null,
    commitsError: null,
    commitsLoading: false,
    refetchCommitsData: () => {},
    refetchLastCommit: () => {},
    updateBuildStatus: (build: models.Build) => {},
    disableLoadMore: false,
  },
  updateCodeGeneratorVersion: (input: TUpdateCodeGeneratorVersion) => {},
  loadingUpdateCodeGeneratorVersion: false,
  errorUpdateCodeGeneratorVersion: undefined,
  createServiceFromTemplate: () => Promise.resolve({} as models.Resource),
  loadingCreateServiceFromTemplate: false,
  errorCreateServiceFromTemplate: undefined,
  customPropertiesMap: {},
  blueprintsMap: {
    ready: false,
    blueprintsMap: {},
    blueprintsMapById: {},
  },
  permissions: {
    allowedTasks: {} as Record<RolesPermissions, boolean>,
    canPerformTask: () => false,
    isAdmin: false,
  },
};

export const AppContext =
  React.createContext<AppContextInterface>(initialContext);

export const AppContextProvider: React.FC<{
  newVal: AppContextInterface;
  children: React.ReactNode;
}> = ({ children, newVal }) => (
  <AppContext.Provider value={{ ...initialContext, ...newVal }}>
    {children}
  </AppContext.Provider>
);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined)
    throw Error("useAppContext must be used within a AppContextProvider");

  return context;
};
