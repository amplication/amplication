import { useMemo } from "react";
import { RouteDef } from "../routes/appRoutes";
import { useLocation, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";

export type TabItem = {
  name: string;
  url: string;
};

const TAB_NAME_MISSING = "TAB_NAME_MISSING";
//converts a list of routes to a list of tabs, and determines if the current route is a tab
export default function useTabRoutes(tabRoutes: RouteDef[]): {
  tabs: TabItem[];
  currentRouteIsTab: boolean;
} {
  const match = useRouteMatch();
  const location = useLocation();

  const currentPath = match.path;
  const currentUrl = match.url;

  const tabs = useMemo(() => {
    return tabRoutes?.map((route) => {
      return {
        name: !isEmpty(route.displayName)
          ? route.displayName
          : TAB_NAME_MISSING,
        url: `${currentUrl}${route.path.replace(currentPath, "")}`,
      };
    });
  }, [tabRoutes, currentPath]);

  const currentRouteIsTab = tabRoutes?.some((def) =>
    location.pathname
      .replace(currentUrl, "")
      .startsWith(def.path.replace(currentPath, ""))
  );

  return {
    tabs,
    currentRouteIsTab,
  };
}
