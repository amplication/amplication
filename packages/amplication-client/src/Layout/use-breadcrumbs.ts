import { useEffect, useContext } from "react";
import NavigationTabsContext from "../Layout/NavigationTabsContext";

export default function useNavigationTabs(url: string, name?: string | null) {
  const navigationTabsContext = useContext(NavigationTabsContext);

  useEffect(() => {
    navigationTabsContext.registerItem({
      name: name || "Loading...",
      url,
      active: true,
    });
    // return () => {
    //   navigationTabsContext.unregisterItem(url);
    // };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [
    name,
    url,
    navigationTabsContext.registerItem,
    navigationTabsContext.unregisterItem,
  ]);
}
