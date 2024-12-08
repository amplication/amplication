import React from "react";
import * as models from "../models";

export interface ResourceContextInterface {
  resourceId: string;
  resource: models.Resource | null;
  lastSuccessfulGitBuild: models.Build | null;
  lastSuccessfulGitBuildPluginVersions: Record<string, string>;
}

const initialContext: ResourceContextInterface = {
  resourceId: null,
  resource: null,
  lastSuccessfulGitBuild: null,
  lastSuccessfulGitBuildPluginVersions: {},
};

export const ResourceContext =
  React.createContext<ResourceContextInterface>(initialContext);

export const ResourceContextProvider: React.FC<{
  newVal: ResourceContextInterface;
  children: React.ReactNode;
}> = ({ children, newVal }) => (
  <ResourceContext.Provider value={{ ...initialContext, ...newVal }}>
    {children}
  </ResourceContext.Provider>
);

export const useResourceContext = () => {
  const context = React.useContext(ResourceContext);
  if (context === undefined)
    throw Error(
      "useResourceContext must be used within a ResourceContextProvider"
    );

  return context;
};
