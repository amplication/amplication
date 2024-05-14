import { EnumApiOperationTagStyle } from "@amplication/ui/design-system";
import React from "react";

export interface ModulesContextInterface {
  searchPhrase: string;
  displayMode?: EnumApiOperationTagStyle;
  graphQlEnabled?: boolean;
  restEnabled?: boolean;
  customActionsLicenseEnabled?: boolean;
  setSearchPhrase: (searchPhrase: string) => void;
  setDisplayMode: (displayMode: EnumApiOperationTagStyle) => void;
}

const initialContext: ModulesContextInterface = {
  searchPhrase: null,
  displayMode: EnumApiOperationTagStyle.REST,
  graphQlEnabled: false,
  restEnabled: false,
  customActionsLicenseEnabled: false,
  setSearchPhrase: () => {},
  setDisplayMode: () => {},
};

export const ModulesContext =
  React.createContext<ModulesContextInterface>(initialContext);

export const ModulesContextProvider: React.FC<{
  newVal: ModulesContextInterface;
  children: React.ReactNode;
}> = ({ children, newVal }) => (
  <ModulesContext.Provider value={{ ...initialContext, ...newVal }}>
    {children}
  </ModulesContext.Provider>
);

export const useModulesContext = () => {
  const context = React.useContext(ModulesContext);
  if (context === undefined)
    throw Error(
      "useModulesContext must be used within a ModulesContextProvider"
    );

  return context;
};
