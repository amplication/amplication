import React from "react";
import * as models from "../models";

export interface AppContextInterface {
  currentWorkspace: models.Workspace | undefined;
  handleSetCurrentWorkspace?: (workspaceId: string) => void;
}

const initialContext = {
  currentWorkspace: undefined,
  handleSetCurrentWorkspace: () => {},
};

export const AppContext = React.createContext<AppContextInterface>(undefined!);

export const AppContextProvider: React.FC<{ newVal: {[key: string]: any }}> = ({ children, newVal }) => (
  <AppContext.Provider value={{...initialContext, ...newVal }}>{children}</AppContext.Provider>
);

export const useAppContext = () => {
  const context = React.useContext(AppContext)
  if (context === undefined) throw Error("useAppContext must be used within a AppContextProvider");

  return context;
}
