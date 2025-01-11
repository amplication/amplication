import { EnumTextColor, TabItem } from "@amplication/ui/design-system";
import React, { useContext, useMemo } from "react";
import { match } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import useTabRoutes from "../Layout/useTabRoutes";
import ResourceList from "../Workspaces/ResourceList";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import "./ProjectPage.scss";
import {
  ResourceContextInterface,
  ResourceContextProvider,
} from "../context/resourceContext";
import useResourcePermissions from "../Resource/hooks/useResourcePermissions";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};
const OVERVIEW = "Project Catalog";

const ProjectPage: React.FC<Props> = ({
  innerRoutes,
  match,
  moduleClass,
  tabRoutes,
  tabRoutesDef,
}) => {
  const { pendingChanges } = useContext(AppContext);

  const { tabs, currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  //we use resource context for the project configuration resource to check permissions on the project level
  const { projectConfigurationResource } = useContext(AppContext);
  const permissions = useResourcePermissions(projectConfigurationResource?.id);
  const context: ResourceContextInterface = {
    resourceId: projectConfigurationResource?.id,
    resource: projectConfigurationResource,
    lastSuccessfulGitBuild: undefined,
    lastSuccessfulGitBuildPluginVersions: undefined,
    permissions,
  };

  const tabItems: TabItem[] = useMemo(() => {
    const tabsWithPendingChanges = tabs.map((tab) => {
      if (tab.name === "Pending Changes") {
        return {
          ...tab,
          indicatorValue: pendingChanges?.length
            ? pendingChanges.length
            : undefined,
          indicatorColor: EnumTextColor.White,
        };
      } else return tab;
    });

    return [
      {
        name: OVERVIEW,
        to: match.url,
        exact: true,
        textColor: EnumTextColor.ThemeBlue,
      },
      ...(tabsWithPendingChanges || []),
    ];
  }, [tabs, match.url, pendingChanges]);

  return match.isExact || currentRouteIsTab ? (
    <>
      <ResourceContextProvider newVal={context}>
        <PageLayout className={moduleClass} tabs={tabItems}>
          {match.isExact ? <ResourceList /> : tabRoutes}
        </PageLayout>
      </ResourceContextProvider>
    </>
  ) : (
    innerRoutes
  );
};

export default ProjectPage;
