import { useEffect, useContext } from "react";
import NavigationTabsContext from "./NavigationTabsContext";

export default function useNavigationTabs(
  resourceId: string,
  key: string,
  url: string,
  name?: string | null
) {
  const navigationTabsContext = useContext(NavigationTabsContext);

  useEffect(() => {
    navigationTabsContext.registerItem({
      resourceId,
      key,
      name: name || "Loading...",
      url,
      active: true,
    });
  }, [key, name, url, navigationTabsContext.registerItem]);
}
