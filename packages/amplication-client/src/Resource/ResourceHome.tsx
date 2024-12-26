import { TabItem } from "@amplication/ui/design-system";
import { useContext, useMemo } from "react";
import { match } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import useTabRoutes from "../Layout/useTabRoutes";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import {
  MenuItemLinks,
  linksMap,
  resourceMenuLayout,
  setResourceUrlLink,
} from "./resourceMenuUtils";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import {
  ResourceContextInterface,
  ResourceContextProvider,
} from "../context/resourceContext";
import { useLastSuccessfulGitBuild } from "../VersionControl/hooks/useLastSuccessfulGitBuild";
import OverviewContainer from "./ResourceOverview/OverviewContainer";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const CLASS_NAME = "resource-home";
const OVERVIEW = "Overview";

const ResourceHome = ({
  match,
  innerRoutes,
  tabRoutes,
  tabRoutesDef,
}: Props) => {
  const { currentResource, currentWorkspace, currentProject, pendingChanges } =
    useContext(AppContext);

  const { isPlatformConsole } = useResourceBaseUrl();

  const tabs: TabItem[] = useMemo(() => {
    const fixedRoutes = resourceMenuLayout[currentResource?.resourceType]?.map(
      (menuItem: MenuItemLinks) => {
        const indicatorValue =
          menuItem === "pendingChanges" && pendingChanges?.length
            ? pendingChanges.length
            : undefined;

        const toUrl = linksMap[menuItem].to;

        return {
          name: linksMap[menuItem].title,
          to: setResourceUrlLink(
            currentWorkspace.id,
            currentProject.id,
            currentResource.id,
            toUrl,
            isPlatformConsole
          ),
          iconName: linksMap[menuItem].icon,
          exact: false,
          indicatorValue,
        };
      }
    );
    return [
      {
        name: OVERVIEW,
        to: match.url,
        exact: true,
      },
      ...(fixedRoutes?.filter((fixRoute) => fixRoute !== null) || []),
    ];
  }, [
    currentResource,
    isPlatformConsole,
    match.url,
    pendingChanges,
    currentWorkspace,
    currentProject,
  ]);

  const { build, buildPluginVersionMap } = useLastSuccessfulGitBuild(
    currentResource?.id
  );

  const { currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  const context: ResourceContextInterface = {
    resourceId: currentResource?.id,
    resource: currentResource,
    lastSuccessfulGitBuild: build,
    lastSuccessfulGitBuildPluginVersions: buildPluginVersionMap,
  };

  return (
    <>
      <ResourceContextProvider newVal={context}>
        {(match.isExact || currentRouteIsTab) && currentResource ? (
          <PageLayout className={CLASS_NAME} tabs={tabs}>
            {match.isExact ? <OverviewContainer /> : tabRoutes}
          </PageLayout>
        ) : (
          innerRoutes
        )}
      </ResourceContextProvider>
    </>
  );
};

export default ResourceHome;
