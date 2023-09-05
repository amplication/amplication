import { createContext } from "react";

export type NavigationTabItem = {
  resourceId: string;
  name: string;
  key: string;
  url: string;
  active: boolean;
};

export type ContextDataType = {
  items: NavigationTabItem[];
  registerItem: (item: NavigationTabItem) => void;
  unregisterItem: (url: string) => string | undefined;
};

const NavigationTabsContext = createContext<ContextDataType>({
  items: [],
  registerItem: (item: NavigationTabItem) => {
    throw new Error();
  },
  unregisterItem: (url: string) => {
    throw new Error();
  },
});

export default NavigationTabsContext;
