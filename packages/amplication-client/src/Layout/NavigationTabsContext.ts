import { createContext } from "react";

export type NavigationTabItem = {
  name: string;
  url: string;
  active: boolean;
};

export type ContextDataType = {
  items: NavigationTabItem[];
  registerItem: (item: NavigationTabItem) => void;
  unregisterItem: (url: string) => void;
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
