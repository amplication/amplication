import React from "react";
import * as models from "../models";

export interface AppContextInterface {
  currentWorkspace: models.Workspace | undefined;
  handleSetCurrentWorkspace?: (workspaceId: string) => void;
  currentProject: models.Project | undefined;
  projectsList: models.Project[];
  setNewProject: (data: models.ProjectCreateInput) => void;
  onNewProjectCompleted: (data: models.Project) => void;
  resources: models.Resource[];
  handleSearchChange: (value: any) => void
}

const initialContext: AppContextInterface = {
  currentWorkspace: undefined,
  handleSetCurrentWorkspace: () => {},
  currentProject: undefined,
  projectsList: [],
  setNewProject: () => {},
  onNewProjectCompleted: () => {},
  resources: [],
  handleSearchChange: () => {}
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
