import React, { useState } from "react";

type OnboardingChecklistProps = {
  serviceCreated: boolean;
  entityUpdated: boolean;
  dtoUpdated: boolean;
  apiUpdated: boolean;
  viewPRClicked: boolean;
  pluginInstalled: boolean;
};

export interface OnboardingChecklistContextInterface {
  currentOnboardingProps: OnboardingChecklistProps;
  setOnboardingProps: (props: Partial<OnboardingChecklistProps>) => void;
}

const initialContext: OnboardingChecklistContextInterface = {
  currentOnboardingProps: {
    serviceCreated: false,
    entityUpdated: false,
    dtoUpdated: false,
    apiUpdated: false,
    viewPRClicked: false,
    pluginInstalled: false,
  },
  setOnboardingProps: () => {},
};

export const OnboardingChecklistContext =
  React.createContext<OnboardingChecklistContextInterface>(initialContext);

export const OnboardingChecklistContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [savedValues, setSavedValues] = useState<OnboardingChecklistProps>(
    initialContext.currentOnboardingProps
  );

  const setOnboardingProps = (props: Partial<OnboardingChecklistProps>) => {
    setSavedValues((prev) => ({ ...prev, ...props }));
  };

  return (
    <OnboardingChecklistContext.Provider
      value={{
        currentOnboardingProps: savedValues,
        setOnboardingProps: setOnboardingProps,
      }}
    >
      {children}
    </OnboardingChecklistContext.Provider>
  );
};

export const useOnboardingChecklistContext = () => {
  const context = React.useContext(OnboardingChecklistContext);
  if (context === undefined)
    throw Error(
      "useOnboardingChecklistContext must be used within a OnboardingChecklistContextProvider"
    );

  return context;
};
