import { EnumTextColor, TabItem } from "@amplication/ui/design-system";
import React, { useContext, useMemo } from "react";
import { match } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import useTabRoutes from "../Layout/useTabRoutes";
import { AppContext } from "../context/appContext";
import { EnumResourceType } from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import ServiceTemplateList from "./ServiceTemplateList";
import useResourcePermissions from "../Resource/hooks/useResourcePermissions";
import {
  ResourceContextInterface,
  ResourceContextProvider,
} from "../context/resourceContext";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};
const OVERVIEW = "Templates";

const ProjectPlatformPage: React.FC<Props> = ({
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

  //count how many unique resources in the pending changes
  const publishCount = useMemo(() => {
    return pendingChanges?.reduce((acc, change) => {
      if (change.resource.resourceType === EnumResourceType.PluginRepository) {
        acc.push(change.originId);
      } else if (!acc.includes(change.resource.id)) {
        acc.push(change.resource.id);
      }
      return acc;
    }, [] as string[]).length;
  }, [pendingChanges]);

  const tabItems: TabItem[] = useMemo(() => {
    const tabsWithPendingChanges = tabs.map((tab) => {
      if (tab.name === "Publish") {
        return {
          ...tab,
          indicatorValue: publishCount > 0 ? publishCount : undefined,
          indicatorColor: EnumTextColor.White,
        };
      }
      if (tab.name === "Pending Changes") {
        return {
          ...tab,
          name: "Platform Changes",
          indicatorValue: pendingChanges?.length
            ? pendingChanges.length
            : undefined,
          indicatorColor: EnumTextColor.White,
        };
      }
      return tab;
    });

    return [
      {
        name: OVERVIEW,
        to: match.url,
        exact: true,
      },
      ...(tabsWithPendingChanges || []),
    ];
  }, [match.url, publishCount, tabs, pendingChanges]);

  return match.isExact || currentRouteIsTab ? (
    <>
      <ResourceContextProvider newVal={context}>
        <PageLayout className={moduleClass} tabs={tabItems}>
          {match.isExact ? <ServiceTemplateList /> : tabRoutes}
        </PageLayout>
      </ResourceContextProvider>
    </>
  ) : (
    innerRoutes
  );
};

export default ProjectPlatformPage;
