import { ApolloError } from "@apollo/client";
import React from "react";
import * as models from "../models";
import { CreateWorkspaceType } from "../Workspaces/hooks/workspace";

export interface AppContextInterface {
  currentWorkspace: models.Workspace | undefined;
  handleSetCurrentWorkspace: (workspaceId: string) => void;
  createWorkspace: (data: CreateWorkspaceType) => void;
  createNewWorkspaceError: ApolloError | undefined;
  loadingCreateNewWorkspace: boolean
  currentProject: models.Project | undefined;
  projectsList: models.Project[];
  setNewProject: (data: models.ProjectCreateInput) => void;
  onNewProjectCompleted: (data: models.Project) => void;
  resources: models.Resource[];
  handleSearchChange: (searchResults: string) => void
  loadingResources: boolean;
  errorResources: Error | undefined;
}

const initialContext: AppContextInterface = {
  currentWorkspace: undefined,
  handleSetCurrentWorkspace: () => {},
  createWorkspace: () => {},
  createNewWorkspaceError: undefined,
  loadingCreateNewWorkspace: false,
  currentProject: undefined,
  projectsList: [],
  setNewProject: () => {},
  onNewProjectCompleted: () => {},
  resources: [],
  handleSearchChange: () => {},
  loadingResources: true,
  errorResources: undefined,
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
