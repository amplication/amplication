import { useMemo } from "react";
import { RouteDef } from "../routes/appRoutes";
import { useLocation, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";
import { TabItem } from "@amplication/ui/design-system";

const TAB_NAME_MISSING = "TAB_NAME_MISSING";
//converts a list of routes to a list of tabs, and determines if the current route is a tab
export default function useProjectRoutes(tabRoutes: RouteDef[]): {
  projectTabs: TabItem[];
  platformTabs: TabItem[];
  currentRouteIsTab: boolean;
} {
  const match = useRouteMatch<{
    platformPrefix: string | undefined;
  }>();
  const location = useLocation();

  //when in project paths, replace the optional param with the actual path
  const currentPath = match.params.platformPrefix
    ? match.path.replace(":platformPrefix(platform/)?", "platform/")
    : match.path.replace(":platformPrefix(platform/)?", "");
  const currentUrl = match.url;

  const tabs = useMemo(() => {
    const allTabs = tabRoutes?.map((route) => {
      return {
        name: !isEmpty(route.displayName)
          ? route.displayName
          : TAB_NAME_MISSING,
        to: `${currentUrl}${route.path.replace(currentPath, "")}`,
        exact: route.exactPath,
        iconName: route.iconName,
        groupName: route.groupName,
      };
    });

    const tabGroups = allTabs.reduce(
      (acc, tab) => {
        if (tab.groupName === "platform") {
          acc.platformTabs.push(tab);
        } else {
          acc.projectTabs.push(tab);
        }
        return acc;
      },
      { projectTabs: [] as TabItem[], platformTabs: [] as TabItem[] }
    );

    return tabGroups;
  }, [tabRoutes, currentUrl, currentPath]);

  const currentRouteIsTab = tabRoutes?.some((def) =>
    location.pathname
      .replace(currentUrl, "")
      .startsWith(def.path.replace(currentPath, ""))
  );

  return {
    ...tabs,
    currentRouteIsTab,
  };
}
