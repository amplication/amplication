import React, { useState, useCallback, useMemo } from "react";
import { last } from "lodash";
import NavigationTabsContext, {
  NavigationTabItem,
} from "./NavigationTabsContext";

type Props = {
  children: React.ReactNode;
};

function NavigationTabsProvider({ children }: Props) {
  const [currentResource, setCurrentResource] = useState<string>("");

  const [navigationTabItems, setNavigationTabItems] = useState<
    NavigationTabItem[]
  >([]);

  const registerNavigationTabItem = useCallback(
    (addItem: NavigationTabItem) => {
      if (addItem.resourceId !== currentResource) {
        setCurrentResource(addItem.resourceId);
        setNavigationTabItems([]);
      }

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
    [setNavigationTabItems, setCurrentResource, currentResource]
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
