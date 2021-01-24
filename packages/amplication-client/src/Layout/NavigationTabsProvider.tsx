import React, { useState, useCallback, useMemo } from "react";
import { last } from "lodash";
import NavigationTabsContext, {
  NavigationTabItem,
} from "./NavigationTabsContext";

type Props = {
  children: React.ReactNode;
};

function NavigationTabsProvider({ children }: Props) {
  const [navigationTabItems, setNavigationTabItems] = useState<
    NavigationTabItem[]
  >([]);

  const registerNavigationTabItem = useCallback(
    (addItem: NavigationTabItem) => {
      setNavigationTabItems((items) => {
        let exist = false;
        const next = items.map((item) => {
          if (item.key === addItem.key) {
            exist = true;
            return addItem;
          }
          return {
            ...item,
            active: false,
          };
        });

        if (!exist) {
          next.push({
            ...addItem,
            active: true,
          });
        }
        return next;
      });
    },
    [setNavigationTabItems]
  );

  const unregisterNavigationTabItem = useCallback(
    (key: string) => {
      const nextItems = navigationTabItems.filter((item) => item.key !== key);

      const nextUrl = last(nextItems)?.url;

      setNavigationTabItems(nextItems);
      return nextUrl;
    },
    [setNavigationTabItems, navigationTabItems]
  );

  const NavigationTabsContextValue = useMemo(
    () => ({
      items: navigationTabItems,
      registerItem: registerNavigationTabItem,
      unregisterItem: unregisterNavigationTabItem,
    }),
    [navigationTabItems, registerNavigationTabItem, unregisterNavigationTabItem]
  );

  return (
    <NavigationTabsContext.Provider value={NavigationTabsContextValue}>
      {children}
    </NavigationTabsContext.Provider>
  );
}

export default NavigationTabsProvider;
