import { ApolloError } from "@apollo/client";
import React from "react";
import * as models from "../models";
import { PendingChangeItem } from "../Workspaces/hooks/usePendingChanges";
import { CreateWorkspaceType } from "../Workspaces/hooks/workspace";

export interface AppContextInterface {
  currentWorkspace: models.Workspace | undefined;
  handleSetCurrentWorkspace: (workspaceId: string) => void;
  createWorkspace: (data: CreateWorkspaceType) => void;
  createNewWorkspaceError: ApolloError | undefined;
  loadingCreateNewWorkspace: boolean;
  currentProject: models.Project | undefined;
  currentProjectConfiguration: models.Resource | undefined;
  projectsList: models.Project[];
  setNewProject: (data: models.ProjectCreateInput) => void;
  onNewProjectCompleted: (data: models.Project) => void;
  resources: models.Resource[];
  setNewResource: (
    data: models.ResourceCreateWithEntitiesInput,
    eventName: string,
    addEntity: (id: string) => void
  ) => void;
  setResource: (resource: models.Resource) => void;
  projectConfigurationResource: models.Resource | undefined;
  handleSearchChange: (searchResults: string) => void;
  loadingResources: boolean;
  errorResources: Error | undefined;
  loadingCreateResource: boolean;
  errorCreateResource: Error | undefined;
  currentResource: models.Resource | undefined;
  pendingChanges: PendingChangeItem[];
  commitRunning: boolean;
  pendingChangesIsError: boolean;
  addEntity: (entityId: string) => void;
  addBlock: (blockId: string) => void;
  addChange: (originId: string) => void;
  resetPendingChanges: () => void;
  setCommitRunning: (isRunning: boolean) => void;
  setPendingChangesError: (onError: boolean) => void;
  refreshCurrentWorkspace: () => void;
  gitRepositoryFullName: string;
  gitRepositoryUrl: string;
}

const initialContext: AppContextInterface = {
  currentWorkspace: undefined,
  handleSetCurrentWorkspace: () => {},
  createWorkspace: () => {},
  createNewWorkspaceError: undefined,
  loadingCreateNewWorkspace: false,
  currentProject: undefined,
  currentProjectConfiguration: undefined,
  projectsList: [],
  setNewProject: () => {},
  onNewProjectCompleted: () => {},
  resources: [],
  setNewResource: () => {},
  setResource: () => {},
  projectConfigurationResource: undefined,
  handleSearchChange: () => {},
  loadingResources: true,
  errorResources: undefined,
  loadingCreateResource: true,
  errorCreateResource: undefined,
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
  gitRepositoryFullName: "",
  gitRepositoryUrl: "",
};

export const AppContext = React.createContext<AppContextInterface>(
  initialContext
);

export const AppContextProvider: React.FC<{
  newVal: AppContextInterface;
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
