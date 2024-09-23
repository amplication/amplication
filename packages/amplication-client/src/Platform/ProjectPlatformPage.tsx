import { TabItem } from "@amplication/ui/design-system";
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
  const { currentProject } = useContext(AppContext);

  const { baseUrl: projectUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: false,
  });

  useBreadcrumbs(`${currentProject?.name} `, projectUrl);

  useBreadcrumbs(`Platform Console`, match.url);
  const { tabs, currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  const tabItems: TabItem[] = useMemo(() => {
    return [
      {
        name: OVERVIEW,
        to: match.url,
        exact: true,
      },
      ...(tabs || []),
    ];
  }, [match.url, tabs]);

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
