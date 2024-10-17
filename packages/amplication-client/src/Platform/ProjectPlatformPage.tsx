import { EnumTextColor, TabItem } from "@amplication/ui/design-system";
import React, { useContext, useMemo } from "react";
import { match } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import useTabRoutes from "../Layout/useTabRoutes";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import ServiceTemplateList from "./ServiceTemplateList";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

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
  const { currentProject, pendingChanges } = useContext(AppContext);

  const { baseUrl: projectUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: false,
  });

  useBreadcrumbs(`${currentProject?.name} `, projectUrl);
  useBreadcrumbs(`Platform Console`, match.url);
  const { tabs, currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  //count how many unique resources in the pending changes
  const pendingChangesCount = useMemo(() => {
    return pendingChanges?.reduce((acc, change) => {
      if (!acc.includes(change.resource.id)) {
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
          indicatorValue:
            pendingChangesCount > 0 ? pendingChangesCount : undefined,
          indicatorColor: EnumTextColor.ThemeOrange,
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
  }, [match.url, pendingChangesCount, tabs]);

  return match.isExact || currentRouteIsTab ? (
    <>
      <PageLayout className={moduleClass} tabs={tabItems}>
        {match.isExact ? <ServiceTemplateList /> : tabRoutes}
      </PageLayout>
    </>
  ) : (
    innerRoutes
  );
};

export default ProjectPlatformPage;
